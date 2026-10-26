/**
 * Formats a numeric price to space-separated thousands with currency symbol.
 * Example: 33500 => "33 500 so'm"
 */
export function formatPrice(amount, currency = "so'm") {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `0 ${currency}`;
  }
  const rounded = Math.round(Number(amount));
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
}

/**
 * Formats a phone number as +998 XX XXX XX XX
 */
export function formatUzPhone(value) {
  if (!value) return '+998 ';
  // Strip non-digits
  const digits = value.replace(/\D/g, '');
  // Ensure starts with 998
  let clean = digits;
  if (!clean.startsWith('998')) {
    clean = '998' + clean;
  }
  clean = clean.slice(0, 12); // 998 + 9 digits = 12 digits

  let result = '+998';
  if (clean.length > 3) {
    result += ' ' + clean.slice(3, 5);
  }
  if (clean.length > 5) {
    result += ' ' + clean.slice(5, 8);
  }
  if (clean.length > 8) {
    result += ' ' + clean.slice(8, 10);
  }
  if (clean.length > 10) {
    result += ' ' + clean.slice(10, 12);
  }
  return result;
}
