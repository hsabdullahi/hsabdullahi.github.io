export function formatSize(bytes: number | null) {
  if (bytes === null) return null;
  if (bytes < 1024) return `${bytes} bytes`;
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KiB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}
export function formatDate(
  date: string | null,
  precision: "day" | "month" | "year" | "unknown",
) {
  if (!date || precision === "unknown") return "Undated";
  if (precision === "year") return date;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    ...(precision === "day" ? { day: "numeric" } : {}),
    timeZone: "UTC",
  }).format(new Date(`${date}${precision === "month" ? "-01" : ""}T12:00:00Z`));
}
