import { useEffect, useRef } from 'react';
import { fetchPaymentStatus } from '../services/paymentApi';

/**
 * Intelligent polling hook to track in-flight payment confirmation from the backend.
 *
 * @param {Object} params
 * @param {string} params.sessionId
 * @param {string} params.paymentPartId
 * @param {string} params.status - Current status ('pending', 'created', 'processing', 'verified', 'failed')
 * @param {Function} params.onStatusUpdate - Callback when authoritative status changes
 */
export function usePaymentStatus({ sessionId, paymentPartId, status, onStatusUpdate }) {
  const isPollingRef = useRef(false);
  const timeoutRef = useRef(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    // Only poll when payment is actively in created or processing states
    const shouldPoll = Boolean(
      sessionId &&
      paymentPartId &&
      (status === 'created' || status === 'processing')
    );

    if (!shouldPoll) {
      isPollingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      attemptsRef.current = 0;
      return;
    }

    isPollingRef.current = true;
    attemptsRef.current = 0;

    const poll = async () => {
      if (!isPollingRef.current) return;

      attemptsRef.current += 1;
      try {
        const res = await fetchPaymentStatus({ paymentPartId, sessionId });
        if (res.success && res.status) {
          onStatusUpdate(paymentPartId, res.status, res);

          // Stop condition if terminal state reached
          if (['verified', 'failed', 'expired'].includes(res.status)) {
            isPollingRef.current = false;
            return;
          }
        }
      } catch (err) {
        console.warn('[Payment Polling] Error checking status:', err.message);
      }

      // Max attempts: 60 (approx 2.5 minutes)
      if (attemptsRef.current < 60 && isPollingRef.current) {
        timeoutRef.current = setTimeout(poll, 2500);
      } else {
        isPollingRef.current = false;
      }
    };

    // First check after 2 seconds
    timeoutRef.current = setTimeout(poll, 2000);

    return () => {
      isPollingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sessionId, paymentPartId, status, onStatusUpdate]);
}