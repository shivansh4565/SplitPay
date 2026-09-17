import React, { useState } from 'react';
import {
  Check,
  Lock,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { generateUpiDeepLink } from '../utils/upiDeepLink';
import { PaymentQrModal } from './PaymentQrModal';
import { PaymentConfirmModal } from './PaymentConfirmModal';

export function PaymentPartCard({
  payment,
  index,
  totalCount,
  merchantData,
  isLocked = false,
  isUpNext = false,
  onMarkPaid,
  onRetry
}) {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Safe fallback for amount
  const displayAmount = payment.amount !== undefined && payment.amount !== null
    ? payment.amount
    : (payment.amountPaise ? payment.amountPaise / 100 : 0);

  const status = payment.status || 'pending';
  const isVerified = status === 'verified';
  const isProcessing = status === 'processing' || status === 'created';
  const isFailed = status === 'failed';

  const upiUrl = generateUpiDeepLink({
    pa: merchantData.pa,
    pn: merchantData.name,
    am: displayAmount,
    cu: 'INR',
    extraParams: merchantData.rawParams || {}
  });

  const handleLaunchApp = () => {
    if (isLocked || isVerified) return;
    setErrorMessage(null);

    // Direct UPI Deep Link Launch
    try {
      window.location.href = upiUrl;
    } catch (e) {
      console.warn('UPI redirection error:', e);
    }

    // Open confirmation dialog
    setIsConfirmModalOpen(true);
  };

  const handleDirectMarkPaid = () => {
    if (isLocked || isVerified) return;
    setErrorMessage(null);
    onMarkPaid(payment._id || payment.id);
  };

  return (
    <>
      <div
        className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
          isVerified
            ? 'bg-emerald-50/60 dark:bg-[#07241a]/60 border-emerald-500/40 shadow-sm'
            : isProcessing
            ? 'bg-amber-50/50 dark:bg-[#1a2310]/60 border-amber-500/40 shadow-md ring-2 ring-amber-500/20'
            : isFailed
            ? 'bg-rose-50/50 dark:bg-[#230d0d]/60 border-rose-500/40'
            : isLocked
            ? 'bg-zinc-100/70 dark:bg-[#041710]/40 border-zinc-200 dark:border-emerald-950 opacity-60'
            : isUpNext
            ? 'bg-white dark:bg-[#07241a] border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
            : 'bg-white/90 dark:bg-[#07241a]/90 border-zinc-200 dark:border-emerald-500/20 shadow-sm'
        }`}
      >
        {/* Top Sequence & Status Badges */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-emerald-300/70">
              Payment {payment.sequence || index + 1} of {totalCount}
            </span>

            {isVerified && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Check className="w-3 h-3" />
                <span>Paid</span>
              </span>
            )}

            {isProcessing && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Processing</span>
              </span>
            )}

            {isFailed && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <AlertCircle className="w-3 h-3" />
                <span>Failed</span>
              </span>
            )}

            {isLocked && !isVerified && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </span>
            )}

            {!isLocked && !isVerified && !isProcessing && !isFailed && isUpNext && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 text-white uppercase tracking-wider shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>READY TO PAY</span>
              </span>
            )}
          </div>

          {/* Amount Display */}
          <div className="my-2">
            <p className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {formatINR(displayAmount)}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-emerald-300/60 truncate mt-0.5">
              To: {merchantData.pa}
            </p>
          </div>
        </div>

        {/* State Information & Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-emerald-900/40 space-y-2">
          {isVerified ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>✓ Payment Completed</span>
              </div>
              {payment.verifiedAt && (
                <p className="text-[10px] text-zinc-400 dark:text-emerald-200/50">
                  Completed at {new Date(payment.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              )}
            </div>
          ) : isLocked ? (
            <div className="py-2 text-center">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 flex items-center justify-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Unlocks after Payment {index} is completed</span>
              </span>
            </div>
          ) : (
            /* Unlocked & Ready to Pay */
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleLaunchApp}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 active:scale-[0.99] transition-all"
                >
                  <span>Launch App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="py-2.5 px-3 rounded-2xl border border-zinc-300 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-800 dark:text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Show QR</span>
                </button>
              </div>

              <button
                onClick={handleDirectMarkPaid}
                className="w-full py-2 px-3 rounded-xl border border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mark as Paid</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="text-[11px] text-rose-500 font-medium pt-1">{errorMessage}</p>
          )}
        </div>
      </div>

      {/* QR Modal for on-screen scanning */}
      <PaymentQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        payment={{ ...payment, amount: displayAmount }}
        merchantData={merchantData}
        upiUrl={upiUrl}
        onMarkPaid={() => {
          onMarkPaid(payment._id || payment.id);
        }}
      />

      {/* Confirmation Modal upon launching app */}
      <PaymentConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        payment={{ ...payment, amount: displayAmount }}
        merchantData={merchantData}
        onConfirmPaid={() => {
          onMarkPaid(payment._id || payment.id);
        }}
      />
    </>
  );
}