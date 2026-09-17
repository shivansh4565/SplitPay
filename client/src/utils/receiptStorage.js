import { formatINR } from './formatters';

const RECEIPTS_STORAGE_KEY = 'splitpay_saved_receipts';

/**
 * Retrieves all saved receipts from localStorage (sorted newest first).
 */
export function getSavedReceipts() {
  try {
    const raw = localStorage.getItem(RECEIPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to load saved receipts:', e);
    return [];
  }
}

/**
 * Saves a completed session into localStorage as a permanent receipt.
 */
export function saveReceipt(session) {
  if (!session) return null;

  try {
    const receipts = getSavedReceipts();
    const receiptId = session._id || `rcpt_${Date.now()}`;

    // Prevent duplicate entries for the same session
    const existingIndex = receipts.findIndex(r => r.id === receiptId);

    const receiptData = {
      id: receiptId,
      receiptNumber: `SP-${Date.now().toString().slice(-6)}`,
      merchantName: session.merchantName || 'Merchant',
      merchantUpiId: session.merchantUpiId || '',
      totalAmount: session.totalAmount || (session.totalAmountPaise ? session.totalAmountPaise / 100 : 0),
      payments: (session.payments || []).map((p, idx) => ({
        sequence: p.sequence || idx + 1,
        amount: p.amount || (p.amountPaise ? p.amountPaise / 100 : 0),
        status: p.status || 'verified',
        verifiedAt: p.verifiedAt || new Date().toISOString()
      })),
      completedAt: session.updatedAt || new Date().toISOString(),
      createdAt: session.createdAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      receipts[existingIndex] = receiptData;
    } else {
      receipts.unshift(receiptData);
    }

    localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
    return receiptData;
  } catch (e) {
    console.warn('Failed to save receipt to localStorage:', e);
    return null;
  }
}

/**
 * Deletes a specific receipt by ID.
 */
export function deleteReceipt(id) {
  try {
    const receipts = getSavedReceipts().filter(r => r.id !== id);
    localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
    return receipts;
  } catch (e) {
    console.warn('Failed to delete receipt:', e);
    return [];
  }
}

/**
 * Clears all saved receipts.
 */
export function clearAllReceipts() {
  try {
    localStorage.removeItem(RECEIPTS_STORAGE_KEY);
    return [];
  } catch (e) {
    console.warn('Failed to clear receipts:', e);
    return [];
  }
}

/**
 * Generates a clean text receipt for copying to WhatsApp/SMS/Notes.
 */
export function formatReceiptAsText(receipt) {
  if (!receipt) return '';

  const dateStr = new Date(receipt.completedAt || Date.now()).toLocaleString();
  const partsText = (receipt.payments || [])
    .map(p => `  • Part ${p.sequence}: ${formatINR(p.amount)} [PAID]`)
    .join('\n');

  return `==============================
      SPLITPAY RECEIPT
==============================
Receipt No : ${receipt.receiptNumber || 'N/A'}
Date & Time: ${dateStr}
Merchant   : ${receipt.merchantName}
UPI VPA    : ${receipt.merchantUpiId}
Total Paid : ${formatINR(receipt.totalAmount)}
------------------------------
Payment Breakdown:
${partsText}
------------------------------
Status     : ALL PAYMENTS COMPLETED
Verified via Direct UPI
==============================`;
}
