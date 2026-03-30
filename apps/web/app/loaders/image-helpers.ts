import {
  buildCloudflareImageSrcSet,
  buildCloudflareImageUrl,
  type CloudflareImageConfig,
} from "@moment4us/data";

export interface GalleryItemDimensions {
  width: number;
  height: number;
}

export function getImageConfig(context?: {
  cloudflare?: {
    env?: {
      CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
      CLOUDFLARE_IMAGES_VARIANT?: string;
    };
  };
}): CloudflareImageConfig {
  return {
    accountHash: context?.cloudflare?.env?.CLOUDFLARE_IMAGES_ACCOUNT_HASH ?? "moment4us-demo",
    variant: context?.cloudflare?.env?.CLOUDFLARE_IMAGES_VARIANT ?? "public",
  };
}

export function isDemoConfig(config: CloudflareImageConfig): boolean {
  return config.accountHash === "moment4us-demo";
}

/**
 * Unsplash placeholder images for local development when Cloudflare Images
 * account is not configured. Maps fixture image IDs to real Unsplash URLs.
 */
const demoImageUrls: Record<string, string> = {
  "harbor-vows-cover": "https://images.unsplash.com/photo-1519741497674-611481863552?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "harbor-vows-1": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "harbor-vows-2": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "harbor-vows-3": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-cover": "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-1": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-2": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "at-home-newborn-3": "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-cover": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-1": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-2": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "studio-portraits-3": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-cover": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-1": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-2": "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
  "city-elopement-3": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=%WIDTH%&h=%HEIGHT%&fit=crop&q=80",
};

export function getDemoImageUrl(imageId: string, width: number, height: number): string {
  const template = demoImageUrls[imageId];
  if (template === undefined) {
    return `https://images.unsplash.com/photo-1519741497674-611481863552?w=${width}&h=${height}&fit=crop&q=80`;
  }
  return template.replace("%WIDTH%", String(width)).replace("%HEIGHT%", String(height));
}

export function getDemoSrcSet(imageId: string, widths: readonly number[], height: number): string {
  return widths.map((w) => `${getDemoImageUrl(imageId, w, height)} ${w}w`).join(", ");
}

export function buildImageSrc(
  imageId: string,
  config: CloudflareImageConfig,
  dimensions: GalleryItemDimensions,
  quality: number,
): string {
  if (isDemoConfig(config)) {
    return getDemoImageUrl(imageId, dimensions.width, dimensions.height);
  }
  return buildCloudflareImageUrl(imageId, config, {
    width: dimensions.width,
    height: dimensions.height,
    fit: "cover",
    quality,
    format: "auto",
  });
}

export function buildImageSrcSet(
  imageId: string,
  config: CloudflareImageConfig,
  widths: readonly number[],
  height: number,
  quality: number,
): string {
  if (isDemoConfig(config)) {
    return getDemoSrcSet(imageId, widths, height);
  }
  return buildCloudflareImageSrcSet(imageId, config, widths, {
    height,
    fit: "cover",
    quality,
    format: "auto",
  });
}
