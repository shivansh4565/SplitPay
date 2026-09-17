import { sessionStore } from './paymentSessionController.js';

/**
 * Retrieves payment status for a specific payment part.
 * GET /api/payments/:paymentPartId/status?sessionId=...
 */
export const getPaymentPartStatus = async (req, res, next) => {
  try {
    const { paymentPartId } = req.params;
    const { sessionId } = req.query;

    if (!sessionId || !paymentPartId) {
      return res.status(400).json({ success: false, message: 'Missing sessionId or paymentPartId' });
    }

    const session = sessionStore.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Payment session not found' });
    }

    const paymentPart = session.payments.find(p => p._id.toString() === paymentPartId);
    if (!paymentPart) {
      return res.status(404).json({ success: false, message: 'Payment part not found' });
    }

    return res.json({
      success: true,
      status: paymentPart.status,
      sequence: paymentPart.sequence,
      amountPaise: paymentPart.amountPaise,
      amount: paymentPart.amount || Number((paymentPart.amountPaise / 100).toFixed(2)),
      verifiedAt: paymentPart.verifiedAt,
      failedReason: paymentPart.failedReason,
      isSessionCompleted: session.isCompleted
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retries a failed payment part.
 * POST /api/payments/:paymentPartId/retry
 */
export const retryPaymentPart = async (req, res, next) => {
  try {
    const { paymentPartId } = req.params;
    const { sessionId } = req.body;

    const session = sessionStore.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const paymentPart = session.payments.find(p => p._id.toString() === paymentPartId);
    if (!paymentPart) {
      return res.status(404).json({ success: false, message: 'Payment part not found' });
    }

    paymentPart.status = 'pending';
    paymentPart.failedReason = null;
    paymentPart.retryCount = (paymentPart.retryCount || 0) + 1;

    return res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};