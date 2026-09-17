/**
 * Formats a number or numeric string to Indian Rupee currency format (e.g., ₹5,500.00 or ₹1,999)
 * 
 * @param {number|string} amount 
 * @param {boolean} [showDecimalsIfZero=false]
 * @returns {string} Formatted INR currency string
 */
export function formatINR(amount, showDecimalsIfZero = false) {
  if (amount === null || amount === undefined || amount === '') return '₹0';
  
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '₹0';

  const hasDecimals = !Number.isInteger(num) || showDecimalsIfZero;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Clean numeric string for display (e.g., "5,500.00")
 */
export function formatNumber(amount) {
  if (amount === null || amount === undefined || amount === '') return '0';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2
  }).format(num);
}