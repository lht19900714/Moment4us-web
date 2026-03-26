import type { ISODateString } from "./types.js";
export declare function isISODateString(input: unknown): input is ISODateString;
export declare function parseISODateString(input: unknown, fieldName: string): ISODateString;
export declare function parseSlugSegment(input: unknown, fieldName: string): string;
