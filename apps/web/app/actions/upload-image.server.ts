interface R2BucketLike {
  put(key: string, value: ReadableStream | ArrayBuffer | string): Promise<unknown>;
}

interface UploadResult {
  ok: true;
  key: string;
}

interface UploadError {
  ok: false;
  error: string;
}

export type UploadImageResult = UploadResult | UploadError;

export async function handleImageUpload(
  request: Request,
  bucket: R2BucketLike | undefined,
  slug: string,
): Promise<UploadImageResult> {
  if (!bucket) {
    return { ok: false, error: "Image storage is not configured." };
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { ok: false, error: "Unable to process upload." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file provided." };
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `portfolio/${slug}/${timestamp}-${sanitizedName}`;

  try {
    const buffer = await file.arrayBuffer();
    await bucket.put(key, buffer);
  } catch {
    return { ok: false, error: "Failed to upload image." };
  }

  return { ok: true, key };
}
