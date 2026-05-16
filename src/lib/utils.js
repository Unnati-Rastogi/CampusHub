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
    options.hour12 = true;
  }
  
  return dt.toLocaleDateString('en-IN', options);
}

/**
 * Formats a "HH:mm" 24-hour time string into a 12-hour format.
 * Example: "14:30" -> "2:30 PM"
 */
export function formatTime(timeStr, fallback = '—') {
  if (!timeStr) return fallback;
  
  // If already in 12h format, return as is
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }

  if (!timeStr.includes(':')) return timeStr;

  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let h = parseInt(parts[0]);
  const m = parts[1].substring(0, 2); // Get just the minutes digits
  
  if (isNaN(h)) return timeStr;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; 
  return `${h}:${m} ${ampm}`;
}

/**
 * Validates an email address.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
