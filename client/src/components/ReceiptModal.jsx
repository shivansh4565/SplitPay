import React, { useState } from 'react';
import { X, Printer, Copy, Check, CheckCircle2, ShieldCheck, Download, Calendar, Store, IndianRupee } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { formatReceiptAsText } from '../utils/receiptStorage';

export function ReceiptModal({ isOpen, onClose, receipt }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = formatReceiptAsText(receipt);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = new Date(receipt.completedAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:fixed">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#07241a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-emerald-500/30 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* Modal Top Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-emerald-900/40 print:hidden bg-zinc-50 dark:bg-[#041710]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider text-zinc-500 dark:text-emerald-300/70">
              Payment Receipt
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-[#0c3123] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-zinc-900 dark:text-zinc-100 print:text-black">
          
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-dashed border-zinc-300 dark:border-emerald-900/60 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto mb-2 print:border">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white print:text-black">
              Split<span className="text-emerald-500">Pay</span> Receipt
            </h3>
            <p className="text-xs text-zinc-500 dark:text-emerald-200/60 font-mono">
              Receipt #{receipt.receiptNumber || 'SP-OFFICIAL'}
            </p>
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30 mt-2">
              <Check className="w-3.5 h-3.5" />
              <span>PAYMENT COMPLETED</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-zinc-50 dark:bg-[#041710] p-4 rounded-2xl border border-zinc-200 dark:border-emerald-500/20 text-center space-y-1 print:bg-zinc-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-emerald-300/70">
              Total Amount Paid
            </span>
            <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
              {formatINR(receipt.totalAmount)}
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-emerald-200/50 flex items-center justify-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </p>
          </div>

          {/* Merchant Details */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-emerald-900/30">
              <span className="text-zinc-500 dark:text-emerald-200/70 flex items-center space-x-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>Merchant Name</span>
              </span>
              <span className="font-bold text-zinc-800 dark:text-zinc-100">{receipt.merchantName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 dark:border-emerald-900/30">
              <span className="text-zinc-500 dark:text-emerald-200/70">Merchant UPI ID</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{receipt.merchantUpiId}</span>
            </div>
          </div>

          {/* Installments Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 dark:text-emerald-300/70 block">
              Payment Parts Breakdown
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {(receipt.payments || []).map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-[#041710] border border-zinc-200 dark:border-emerald-500/20 print:bg-white"
                >
                  <span className="font-bold text-zinc-700 dark:text-emerald-200">
                    Part {p.sequence || idx + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {formatINR(p.amount)}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      PAID
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="pt-2 border-t border-dashed border-zinc-200 dark:border-emerald-900/40 text-center">
            <p className="text-[10px] text-zinc-400 dark:text-emerald-200/50">
              This digital receipt confirms direct peer-to-peer UPI transfer to the merchant VPA.
            </p>
          </div>
        </div>

        {/* Footer Actions (hidden when printing) */}
        <div className="p-4 bg-zinc-50 dark:bg-[#041710] border-t border-zinc-200 dark:border-emerald-900/40 flex flex-wrap gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm border border-zinc-300 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-800 dark:text-emerald-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
