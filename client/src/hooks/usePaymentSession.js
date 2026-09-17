import { useState, useCallback } from 'react';
import { splitAmount } from '../utils/splitAmount';
import { updatePaymentPartStatus, retryPaymentPart } from '../services/paymentApi';

const STORAGE_KEY = 'splitpay_session_v3';

export function usePaymentSession() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveToStorage = (newSession) => {
    try {
      if (newSession) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  /**
   * Generates a new payment plan and initializes the session on the backend.
   */
  const createPlan = useCallback(async ({ merchantName, merchantUpiId, totalAmount, additionalParams = {} }) => {
    setIsLoading(true);
    setError(null);

    try {
      const numAmount = Number(totalAmount);
      const totalAmountPaise = Math.round(numAmount * 100);
      const chunksInr = splitAmount(numAmount);
      
      const localPayments = chunksInr.map((amount, idx) => ({
        _id: `temp_pay_${Date.now()}_${idx}`,
        sequence: idx + 1,
        amountPaise: Math.round(amount * 100),
        amount,
        status: 'pending',
        verifiedAt: null,
        failedReason: null,
        retryCount: 0
      }));

      const initialSession = {
        _id: `temp_sess_${Date.now()}`,
        merchantName,
        merchantUpiId,
        totalAmountPaise,
        totalAmount: numAmount,
        status: 'pending',
        isCompleted: false,
        additionalParams,
        payments: localPayments,
        createdAt: new Date().toISOString()
      };

      setSession(initialSession);
      saveToStorage(initialSession);

      try {
        const res = await fetch('/api/payment-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchantName,
            merchantUpiId,
            totalAmount: numAmount,
            additionalParams
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setSession(data.session);
            saveToStorage(data.session);
            return data.session;
          }
        }
      } catch (backendErr) {
        console.warn('Backend sync notice:', backendErr);
      }

      return initialSession;
    } catch (err) {
      setError(err.message || 'Failed to generate payment plan');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Marks a payment part as completed / paid.
   */
  const markPaymentAsPaid = useCallback(async (paymentPartId) => {
    if (!session) return;

    const now = new Date().toISOString();
    let updatedSession = null;

    setSession(prev => {
      if (!prev) return prev;
      const updatedPayments = prev.payments.map(p => {
        if (p._id === paymentPartId || p.id === paymentPartId) {
          return {
            ...p,
            status: 'verified',
            verifiedAt: now,
            failedReason: null
          };
        }
        return p;
      });

      const allVerified = updatedPayments.every(p => p.status === 'verified');
      updatedSession = {
        ...prev,
        payments: updatedPayments,
        isCompleted: allVerified,
        status: allVerified ? 'completed' : prev.status,
        updatedAt: now
      };

      saveToStorage(updatedSession);
      return updatedSession;
    });

    // Asynchronously notify backend
    if (session._id && !session._id.startsWith('temp_sess_')) {
      try {
        await updatePaymentPartStatus({
          sessionId: session._id,
          paymentPartId,
          status: 'verified'
        });
      } catch (err) {
        console.warn('Backend status update notice:', err);
      }
    }

    return updatedSession;
  }, [session]);

  /**
   * Updates payment part status from polling or external event.
   */
  const handleStatusUpdate = useCallback((paymentPartId, newStatus, extraData = {}) => {
    setSession(prev => {
      if (!prev) return prev;
      const updated = prev.payments.map(p => {
        if (p._id === paymentPartId || p.id === paymentPartId) {
          return {
            ...p,
            status: newStatus,
            verifiedAt: newStatus === 'verified' ? (extraData.verifiedAt || new Date().toISOString()) : p.verifiedAt,
            failedReason: newStatus === 'failed' ? (extraData.failedReason || p.failedReason) : null
          };
        }
        return p;
      });

      const allVerified = updated.every(p => p.status === 'verified');
      const newSess = {
        ...prev,
        payments: updated,
        isCompleted: allVerified,
        status: allVerified ? 'completed' : prev.status
      };
      saveToStorage(newSess);
      return newSess;
    });
  }, []);

  /**
   * Retries a failed payment part.
   */
  const handleRetryPayment = useCallback(async (paymentPartId) => {
    if (!session) return;
    try {
      const res = await retryPaymentPart({ paymentPartId, sessionId: session._id });
      if (res.session) {
        setSession(res.session);
        saveToStorage(res.session);
      }
    } catch (err) {
      console.error('Retry failed:', err);
    }
  }, [session]);

  const resetSession = useCallback(async () => {
    const currentId = session?._id;
    setSession(null);
    saveToStorage(null);

    if (currentId && !currentId.startsWith('temp_sess_')) {
      try {
        await fetch(`/api/payment-sessions/${currentId}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Error deleting session:', err);
      }
    }
  }, [session]);

  // PROGRESS COMPUTATION (VERIFIED PAYMENTS ARE COUNTED AS PAID)
  const payments = session?.payments || [];
  const totalCount = payments.length;
  const verifiedPayments = payments.filter(p => p.status === 'verified');
  const verifiedCount = verifiedPayments.length;
  const pendingCount = totalCount - verifiedCount;

  const totalPaise = session?.totalAmountPaise || Math.round((session?.totalAmount || 0) * 100);
  const paidPaise = verifiedPayments.reduce((acc, p) => acc + (p.amountPaise || Math.round(p.amount * 100)), 0);
  const remainingPaise = Math.max(0, totalPaise - paidPaise);

  const paidAmount = Number((paidPaise / 100).toFixed(2));
  const remainingAmount = Number((remainingPaise / 100).toFixed(2));
  const progressPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
  const isCompleted = totalCount > 0 && verifiedCount === totalCount;

  return {
    session,
    isLoading,
    error,
    createPlan,
    markPaymentAsPaid,
    handleStatusUpdate,
    handleRetryPayment,
    resetSession,
    progress: {
      totalAmount: session?.totalAmount || Number((totalPaise / 100).toFixed(2)),
      paidAmount,
      remainingAmount,
      totalCount,
      verifiedCount,
      completedCount: verifiedCount,
      pendingCount,
      progressPercent,
      isCompleted
    }
  };
}