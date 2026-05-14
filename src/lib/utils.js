/**
 * Formats an ISO date string into a human-readable date.
 * Example: '2023-10-05' -> '5 Oct 2023'
 *
 * @param {string} dateStr - The date string to format
 * @param {boolean} [includeTime=false] - Whether to include the time in the output
 * @param {string} [fallback='—'] - The string to return if dateStr is falsy
 * @returns {string} The formatted date string
 */
export function formatDate(dateStr, includeTime = false, fallback = '—') {
  if (!dateStr) return fallback;
  
  // If dateStr is just a date (YYYY-MM-DD), append time to avoid timezone offset issues
  const dt = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T00:00:00');
  
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  if (includeTime) {
    options.hour = 'numeric';
    options.minute = '2-digit';
  }
  
  return dt.toLocaleDateString('en-IN', options);
}

/**
 * Validates an email address.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
