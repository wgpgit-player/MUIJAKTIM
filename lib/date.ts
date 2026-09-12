const formatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/** Normalizes any date input to "dd MMMM yyyy", e.g. "12 September 2026". */
export function formatDateID(input: string | number | Date): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return formatter.format(d);
}
