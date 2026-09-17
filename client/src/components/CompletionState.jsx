import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, ShieldCheck, Check, Printer, Copy, Receipt, Smartphone } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { saveReceipt, formatReceiptAsText } from '../utils/receiptStorage';
import { ReceiptModal } from './ReceiptModal';

export function CompletionState({ session, onReset }) {
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [savedReceiptData, setSavedReceiptData] = useState(null);
  const [copied, setCopied] = useState(false);

  const payments = session?.payments || [];
  const paymentsCount = payments.length;
  const totalAmount = session?.totalAmount || 0;
  const merchantName = session?.merchantName || 'Merchant';
  const merchantUpiId = session?.merchantUpiId || '';

  useEffect(() => {
    // 1. Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    // 2. Automatically save receipt to localStorage
    if (session) {
      const saved = saveReceipt(session);
      setSavedReceiptData(saved);
    }
  }, [session]);

  const handleCopyText = () => {
    if (!savedReceiptData && !session) return;
    const text = formatReceiptAsText(savedReceiptData || session);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="rounded-3xl p-6 sm:p-10 bg-white/95 dark:bg-[#07241a]/95 border border-emerald-500/30 shadow-2xl text-center space-y-6 animate-fade-in backdrop-blur-xl">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Header text */}
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            ✓ All Payments Completed
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-emerald-200/70">
            All {paymentsCount} payment parts have been successfully paid to the merchant.
          </p>
        </div>

        {/* Summary Box */}
        <div className="bg-zinc-50 dark:bg-[#041710] rounded-2xl p-5 border border-zinc-200 dark:border-emerald-500/20 max-w-lg mx-auto space-y-3 text-left">
          <div className="flex justify-between items-center text-sm border-b border-zinc-200/80 dark:border-emerald-900/40 pb-3">
            <span className="text-zinc-500 dark:text-emerald-300/70 font-medium">Total Amount Paid</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatINR(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 dark:text-emerald-300/70">Merchant</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">{merchantName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 dark:text-emerald-300/70">Merchant UPI ID</span>
            <span className="font-mono text-zinc-600 dark:text-emerald-400">{merchantUpiId}</span>
          </div>

          {/* Payments Summary List */}
          <div className="pt-2 border-t border-zinc-200/80 dark:border-emerald-900/40 space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 dark:text-emerald-300/70 block">
              Completed Payments Breakdown
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {payments.map((p, idx) => (
                <div
                  key={p._id || idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0c3123] border border-zinc-200 dark:border-emerald-500/20"
                >
                  <span className="font-bold text-zinc-700 dark:text-emerald-200">
                    Part {p.sequence || idx + 1}: {formatINR(p.amount)}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Paid</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Local Storage Saved Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20">
          <Receipt className="w-3.5 h-3.5 text-emerald-500" />
          <span>Receipt automatically saved to local storage</span>
        </div>

        {/* Receipt Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <Printer className="w-4 h-4" />
            <span>View & Print Receipt</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-3 px-4 rounded-2xl border border-zinc-300 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-800 dark:text-emerald-200 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

        {/* Reset Action */}
        <div className="pt-2">
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-emerald-500/30 text-xs font-semibold text-zinc-600 dark:text-emerald-300 hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Split Payment</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {isReceiptModalOpen && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          receipt={savedReceiptData || {
            receiptNumber: `SP-${Date.now().toString().slice(-6)}`,
            merchantName,
            merchantUpiId,
            totalAmount,
            payments,
            completedAt: new Date().toISOString()
          }}
        />
      )}
    </>
  );
}