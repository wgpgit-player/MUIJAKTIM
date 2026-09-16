// One-time import: scrapes the public fatwa directory at fatwamui.com (official
// Komisi Fatwa MUI site, robots.txt allows crawling) and seeds them into our own
// `fatwa` table as reference/national fatwas, since MUI Jaktim has no fatwa of its
// own yet. Downloads each PDF, extracts text via pdf-parse for the `body` field,
// and re-uploads the PDF to our own Supabase Storage bucket instead of hotlinking.
//
// Usage: npm run import:fatwa-mui
// Safe to re-run: rows are upserted by slug, and a PDF already uploaded in a
// previous run is not re-downloaded/re-uploaded.

import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });

import * as cheerio from "cheerio";
import type { PrismaClient } from "@prisma/client";
import type { createAdminClient as CreateAdminClientFn } from "../lib/supabase/admin";

// Dynamic imports (inside main, awaited): static ESM imports are hoisted above the
// dotenv config() calls above, so lib/prisma would read DATABASE_URL before it's set.
let prisma: PrismaClient;
let createAdminClient: typeof CreateAdminClientFn;

const LIST_URL = "https://fatwamui.com/data-fatwa";
const CONCURRENCY = 3;

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_MAP: Record<string, "MUAMALAH" | "IBADAH_KESEHATAN" | "DIREKTORI_KONTEMPORER"> = {
  Ibadah: "IBADAH_KESEHATAN",
  "POM Iptek": "MUAMALAH",
  "Sosial Kemasyarakatan": "DIREKTORI_KONTEMPORER",
  "HASIL IJTIMA": "DIREKTORI_KONTEMPORER",
  "Aqidah dan Aliran Keagamaan": "DIREKTORI_KONTEMPORER",
};
function mapCategory(tema: string) {
  return CATEGORY_MAP[tema] ?? "DIREKTORI_KONTEMPORER";
}

function parseTanggal(raw: string): Date | null {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

type Row = {
  title: string;
  tema: string;
  nomor: string;
  tanggal: string;
  pdfUrl: string | null;
};

async function fetchRows(): Promise<Row[]> {
  const res = await fetch(LIST_URL);
  if (!res.ok) throw new Error(`Gagal ambil daftar fatwa: HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const rows: Row[] = [];
  $("#datatable1 tbody tr").each((_, el) => {
    const tds = $(el).find("td");
    const title = $(tds[1]).text().trim();
    const tema = $(tds[2]).text().trim();
    const nomor = $(tds[3]).text().trim();
    const tanggal = $(tds[4]).text().trim();
    const href = $(tds[5]).find("a").attr("href") || "";
    const pdfUrl = href.startsWith("http") ? href : null;
    if (title) rows.push({ title, tema, nomor, tanggal, pdfUrl });
  });
  return rows;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text.trim();
  } catch {
    return "";
  }
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, idx: number) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  ({ prisma } = await import("../lib/prisma"));
  ({ createAdminClient } = await import("../lib/supabase/admin"));

  console.log("Mengambil daftar fatwa dari fatwamui.com...");
  let rows = await fetchRows();
  console.log(`Ditemukan ${rows.length} baris fatwa.`);
  const limit = process.env.IMPORT_LIMIT ? Number(process.env.IMPORT_LIMIT) : null;
  if (limit) rows = rows.slice(0, limit);

  const admin = createAdminClient();
  const usedSlugs = new Set<string>();

  let created = 0;
  let updated = 0;
  let pdfFailed = 0;
  let skippedNoTitle = 0;

  await mapWithConcurrency(rows, CONCURRENCY, async (row, idx) => {
    let slug = slugify(row.title);
    if (!slug) {
      skippedNoTitle++;
      return;
    }
    if (usedSlugs.has(slug)) slug = `${slug}-${idx}`;
    usedSlugs.add(slug);

    const existing = await prisma.fatwa.findUnique({ where: { slug } });

    let pdfUrl: string | null = existing?.pdfUrl ?? null;
    let body = existing?.body ?? "";

    if (row.pdfUrl && !existing?.pdfUrl) {
      try {
        const pdfRes = await fetch(row.pdfUrl);
        if (pdfRes.ok) {
          const arrayBuffer = await pdfRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const text = await extractPdfText(buffer);
          if (text) body = text.slice(0, 20000);

          const path = `fatwa/${slug}.pdf`;
          const { error } = await admin.storage
            .from("media")
            .upload(path, buffer, { contentType: "application/pdf", upsert: true });
          if (!error) {
            const { data } = admin.storage.from("media").getPublicUrl(path);
            pdfUrl = data.publicUrl;
          } else {
            console.warn(`  ! Upload gagal untuk "${row.title}": ${error.message}`);
            pdfFailed++;
          }
        } else {
          pdfFailed++;
        }
      } catch (err) {
        console.warn(`  ! PDF gagal diproses untuk "${row.title}":`, (err as Error).message);
        pdfFailed++;
      }
    }

    if (!body) {
      body = `Fatwa ${row.nomor ? `Nomor ${row.nomor} ` : ""}tentang "${row.title}". Dokumen PDF lengkap tersedia untuk diunduh.`;
    }

    const data = {
      title: row.title,
      number: row.nomor || null,
      category: mapCategory(row.tema),
      body,
      pdfUrl,
      publishedAt: parseTanggal(row.tanggal),
      status: "PUBLISHED" as const,
    };

    if (existing) {
      await prisma.fatwa.update({ where: { slug }, data });
      updated++;
    } else {
      await prisma.fatwa.create({ data: { ...data, slug } });
      created++;
    }

    if ((idx + 1) % 25 === 0) console.log(`  ... ${idx + 1}/${rows.length} diproses`);
  });

  console.log("\nSelesai.");
  console.log(`  Dibuat baru : ${created}`);
  console.log(`  Diperbarui  : ${updated}`);
  console.log(`  PDF gagal   : ${pdfFailed}`);
  console.log(`  Dilewati    : ${skippedNoTitle}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Import gagal:", err);
  process.exit(1);
});
