export function serializeStructuredData(
  data: Record<string, unknown> | Record<string, unknown>[],
) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
