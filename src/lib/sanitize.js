export function sanitizeText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeLines(values) {
  return values.map((value) => sanitizeText(value)).filter(Boolean);
}
