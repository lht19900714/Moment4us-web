import { type SeoMetadata } from "@moment4us/shared";

export function parseRecord(input: unknown, fieldName: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return input as Record<string, unknown>;
}

export function parseString(input: unknown, fieldName: string): string {
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return input;
}

export function parseStringArray(input: unknown, fieldName: string): string[] {
  if (!Array.isArray(input)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return input.map((item, index) => parseString(item, `${fieldName}[${index}]`));
}

export function parseBoolean(input: unknown, fieldName: string): boolean {
  if (typeof input !== "boolean") {
    throw new Error(`${fieldName} must be a boolean`);
  }

  return input;
}

export function parseSeo(input: unknown, fieldName: string): SeoMetadata {
  const value = parseRecord(input, fieldName);
  const seo: SeoMetadata = {
    title: parseString(value.title, `${fieldName}.title`),
    description: parseString(value.description, `${fieldName}.description`),
  };

  if (value.canonicalPath !== undefined) {
    seo.canonicalPath = parseString(value.canonicalPath, `${fieldName}.canonicalPath`);
  }

  if (value.image !== undefined) {
    seo.image = parseString(value.image, `${fieldName}.image`);
  }

  if (value.keywords !== undefined) {
    seo.keywords = parseStringArray(value.keywords, `${fieldName}.keywords`);
  }

  return seo;
}

export function parseEmail(input: unknown, fieldName: string): string {
  const value = parseString(input, fieldName);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    throw new Error(`${fieldName} must be a valid email`);
  }

  return value;
}
