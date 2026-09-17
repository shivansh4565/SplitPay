/**
 * Splits a total amount into chunks strictly less than ₹2,000 using integer paise arithmetic.
 * 
 * Default max chunk is ₹1,999.00 (199,900 paise).
 * Every generated payment chunk satisfies: 0 < chunk < 2000.
 *
 * @param {number|string} totalAmount - Total amount in INR
 * @param {number} [maxChunk=1999] - Maximum chunk amount in INR (must be < 2000)
 * @returns {number[]} Array of chunk amounts in INR rounded to 2 decimal places
 */
export function splitAmount(totalAmount, maxChunk = 1999) {
  const numericAmount = typeof totalAmount === 'string' ? parseFloat(totalAmount) : Number(totalAmount);

  if (isNaN(numericAmount) || !isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Please enter a valid amount greater than ₹0.');
  }

  // Work with integer paise to avoid floating point precision issues
  const totalPaise = Math.round(numericAmount * 100);
  const maxPaise = Math.min(Math.round(maxChunk * 100), 199900); // strictly < 200000 paise (₹2,000)

  if (maxPaise <= 0) {
    throw new Error('Max chunk must be greater than 0 paise.');
  }

  const chunks = [];
  let remainingPaise = totalPaise;

  while (remainingPaise > 0) {
    const chunkPaise = Math.min(remainingPaise, maxPaise);
    const chunkInr = Number((chunkPaise / 100).toFixed(2));
    chunks.push(chunkInr);
    remainingPaise -= chunkPaise;
  }

  return chunks;
}
