export function parseJsonField<T>(value: string, fieldName: string): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw new Error(
      `${fieldName} must contain valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
