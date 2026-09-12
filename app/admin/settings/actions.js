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
