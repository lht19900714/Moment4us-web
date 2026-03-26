export interface CloudflareImageConfig {
  accountHash: string;
  variant?: string;
}

export interface CloudflareImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  format?: "auto" | "webp" | "avif" | "json";
}

export function buildCloudflareImageUrl(
  imageId: string,
  config: CloudflareImageConfig,
  options: CloudflareImageTransformOptions = {},
): string {
  const accountHash = requireNonEmpty(config.accountHash, "Cloudflare Images account hash");
  const normalizedImageId = requireNonEmpty(imageId, "Cloudflare image id");
  const variant = requireNonEmpty(config.variant ?? "public", "Cloudflare image variant");
  const baseUrl = `https://imagedelivery.net/${encodeURIComponent(accountHash)}/${encodeURIComponent(
    normalizedImageId,
  )}/${encodeURIComponent(variant)}`;
  const transformSegment = buildTransformSegment(options);

  return transformSegment.length === 0 ? baseUrl : `${baseUrl}/${transformSegment}`;
}

export function buildCloudflareImageSrcSet(
  imageId: string,
  config: CloudflareImageConfig,
  widths: readonly number[],
  options: Omit<CloudflareImageTransformOptions, "width"> = {},
): string {
  return widths
    .map((width) => {
      validatePositiveInteger(width, "image width");
      return `${buildCloudflareImageUrl(imageId, config, { ...options, width })} ${width}w`;
    })
    .join(", ");
}

function validatePositiveInteger(value: number, fieldName: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
}

function buildTransformSegment(options: CloudflareImageTransformOptions): string {
  const segments: string[] = [];

  if (options.width !== undefined) {
    validatePositiveInteger(options.width, "width");
    segments.push(`width=${options.width}`);
  }

  if (options.height !== undefined) {
    validatePositiveInteger(options.height, "height");
    segments.push(`height=${options.height}`);
  }

  if (options.quality !== undefined) {
    validatePositiveInteger(options.quality, "quality");
    segments.push(`quality=${options.quality}`);
  }

  if (options.fit !== undefined) {
    segments.push(`fit=${options.fit}`);
  }

  if (options.format !== undefined) {
    segments.push(`format=${options.format}`);
  }

  return segments.join(",");
}

function requireNonEmpty(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return normalized;
}
