import { requireRole } from "@/lib/rbac";
import { uploadMedia } from "@/lib/uploadMedia";

export async function POST(request) {
  try {
    await requireRole(["ADMIN", "SUPER_ADMIN"]);
  } catch {
    return Response.json({ error: "Tidak diizinkan." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "File harus berupa gambar." }, { status: 400 });
  }

  try {
    const url = await uploadMedia(file, "news-body");
    return Response.json({ url });
  } catch (err) {
    return Response.json({ error: err.message ?? "Upload gagal." }, { status: 500 });
  }
}
