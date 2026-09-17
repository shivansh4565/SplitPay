import crypto from 'crypto';
import { splitAmount } from '../utils/splitAmount.js';

// Clean in-memory session cache for server fallback
export const sessionStore = new Map();

export const createPaymentSession = async (req, res, next) => {
  try {
    const { merchantName, merchantUpiId, totalAmount, additionalParams } = req.body;

    if (!merchantName || !merchantUpiId || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: merchantName, merchantUpiId, totalAmount'
      });
    }

    const numericAmount = Number(totalAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount must be greater than 0'
      });
    }

    const totalAmountPaise = Math.round(numericAmount * 100);

    // Split amount into chunks < 2000 INR
    const chunksInr = splitAmount(numericAmount);
    const payments = chunksInr.map((amt, idx) => {
      const amountPaise = Math.round(amt * 100);
      return {
        _id: crypto.randomUUID(),
        sequence: idx + 1,
        amount: amt,
        amountPaise,
        status: 'pending',
        verifiedAt: null,
        failedReason: null,
        retryCount: 0
      };
    });

    const sessionId = crypto.randomUUID();
    const session = {
      _id: sessionId,
      merchantName,
      merchantUpiId,
      totalAmount: numericAmount,
      totalAmountPaise,
      status: 'pending',
      isCompleted: false,
      additionalParams: additionalParams || {},
      payments,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    sessionStore.set(sessionId, session);

    return res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = sessionStore.get(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Payment session not found' });
    }

    return res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id, paymentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'created', 'processing', 'verified', 'completed', 'failed', 'expired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.'
      });
    }

    const session = sessionStore.get(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Payment session not found' });
    }

    const payment = session.payments.find(p => p._id.toString() === paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment part not found' });
    }

    const normalizedStatus = (status === 'completed' || status === 'verified') ? 'verified' : status;
    payment.status = normalizedStatus;
    payment.verifiedAt = (normalizedStatus === 'verified') ? new Date() : null;

    const allVerified = session.payments.every(p => p.status === 'verified');
    session.isCompleted = allVerified;
    if (allVerified) session.status = 'completed';
    session.updatedAt = new Date();

    sessionStore.set(id, session);

    return res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

export const deletePaymentSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    sessionStore.delete(id);
    return res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
};