/**
 * Constructs a standard UPI payment deep link preserving merchant metadata.
 * 
 * @param {Object} options
 * @param {string} options.pa - Merchant UPI ID
 * @param {string} options.pn - Merchant Name
 * @param {number|string} options.am - Amount for this specific chunk
 * @param {string} [options.cu='INR'] - Currency code
 * @param {Record<string, string>} [options.extraParams={}] - Additional query parameters from original QR
 * @returns {string} upi://pay deep link
 */
export function generateUpiDeepLink({ pa, pn, am, cu = 'INR', extraParams = {} }) {
  const params = new URLSearchParams();

  // Set essential UPI parameters
  params.set('pa', pa);
  if (pn) params.set('pn', pn);
  
  // Format amount to 2 decimal places without trailing .00 if whole number for clean deep-linking
  const numAm = Number(am);
  const formattedAmount = Number.isInteger(numAm) ? numAm.toString() : numAm.toFixed(2);
  params.set('am', formattedAmount);
  params.set('cu', cu);

  // Preserve extra parameters if present (e.g., mc = merchant category code, tr = transaction ref, etc.)
  const reservedKeys = ['pa', 'pn', 'am', 'cu'];
  for (const [key, value] of Object.entries(extraParams)) {
    if (!reservedKeys.includes(key) && value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  }

  return `upi://pay?${params.toString()}`;
}

/**
 * Checks if the current client is likely running on a mobile device.
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
