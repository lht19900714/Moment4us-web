export type ISODateString = string;

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  keywords?: string[];
}

export interface ImageAsset {
  id: string;
  alt?: string;
  width: number;
  height: number;
}
