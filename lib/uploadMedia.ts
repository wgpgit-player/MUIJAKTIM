import { createClient } from "@/lib/supabase/server";

/**
 * Uploads a File (from a Server Action's FormData) to the public "media" Storage
 * bucket and returns its public URL. Path is namespaced by folder (e.g. "hero",
 * "news") to keep the bucket organized; filename is randomized to avoid collisions.
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
