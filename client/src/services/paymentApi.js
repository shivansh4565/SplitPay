/**
 * Frontend Payment API client for SplitPay Direct UPI Splitter.
 */

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function updatePaymentPartStatus({
  sessionId,
  paymentPartId,
  status
}) {
  const res = await fetch(
    `${API_URL}/api/payment-sessions/${sessionId}/payments/${paymentPartId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update payment status.');
  }

  return data;
}

export async function fetchPaymentStatus({
  paymentPartId,
  sessionId
}) {
  const res = await fetch(
    `${API_URL}/api/payments/${paymentPartId}/status?sessionId=${sessionId}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to check payment status.');
  }

  return data;
}

export async function retryPaymentPart({
  paymentPartId,
  sessionId
}) {
  const res = await fetch(
    `${API_URL}/api/payments/${paymentPartId}/retry`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to retry payment.');
  }

  return data;
}
