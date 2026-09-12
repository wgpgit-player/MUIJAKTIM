"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function updateDefaultLocation(formData) {
  await requireRole(["SUPER_ADMIN"]);

  const lat = parseFloat(formData.get("lat"));
  const lon = parseFloat(formData.get("lon"));
  const label = formData.get("label")?.toString().trim();

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !label) {
    throw new Error("Latitude, longitude, dan label wajib diisi dengan benar.");
  }

  await prisma.setting.upsert({
    where: { key: "default_location" },
    update: { value: { lat, lon, label } },
    create: { key: "default_location", value: { lat, lon, label } },
  });

  revalidatePath("/admin/settings");
}

export async function updateWhatsappContact(formData) {
  await requireRole(["SUPER_ADMIN"]);

  const number = formData.get("number")?.toString().trim().replace(/[^0-9]/g, "");
  const message = formData.get("message")?.toString().trim();

  if (!number || !message) {
    throw new Error("Nomor WhatsApp dan template pesan wajib diisi.");
  }

  await prisma.setting.upsert({
    where: { key: "whatsapp_contact" },
    update: { value: { number, message } },
    create: { key: "whatsapp_contact", value: { number, message } },
  });

  revalidatePath("/admin/settings");
}
