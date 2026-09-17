import React, { useState, useEffect } from 'react';
import { X, Receipt, Trash2, ExternalLink, Calendar, Store, IndianRupee, RotateCcw } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { getSavedReceipts, deleteReceipt, clearAllReceipts } from '../utils/receiptStorage';
import { ReceiptModal } from './ReceiptModal';

export function ReceiptHistoryModal({ isOpen, onClose }) {
  const [receipts, setReceipts] = useState([]);
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setReceipts(getSavedReceipts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = deleteReceipt(id);
    setReceipts(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved receipt history?')) {
      const updated = clearAllReceipts();
      setReceipts(updated);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-lg bg-white dark:bg-[#07241a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-emerald-500/30 overflow-hidden flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-emerald-900/40 bg-zinc-50 dark:bg-[#041710]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                  Saved Payment Receipts
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-emerald-300/60">
                  Stored locally on your device
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {receipts.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-[#0c3123] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of Receipts */}
          <div className="p-5 overflow-y-auto space-y-3 flex-1">
            {receipts.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-[#041710] text-zinc-400 dark:text-emerald-500/40 flex items-center justify-center mx-auto border border-zinc-200 dark:border-emerald-500/20">
                  <Receipt className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                    No Saved Receipts Yet
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-emerald-100/60 max-w-xs mx-auto mt-1">
                    When you complete a split payment, your receipt will be saved here automatically.
                  </p>
                </div>
              </div>
            ) : (
              receipts.map((rcpt) => {
                const dateStr = new Date(rcpt.completedAt || rcpt.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div
                    key={rcpt.id}
                    onClick={() => setActiveReceipt(rcpt)}
                    className="group p-4 rounded-2xl bg-zinc-50/80 dark:bg-[#041710]/80 border border-zinc-200 dark:border-emerald-500/20 hover:border-emerald-500/50 hover:bg-zinc-100/80 dark:hover:bg-[#0c3123] transition-all cursor-pointer flex items-center justify-between shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                          {rcpt.merchantName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                          {rcpt.payments?.length || 1} parts
                        </span>
                      </div>
                      
                      <p className="text-[11px] font-mono text-zinc-500 dark:text-emerald-300/60 truncate max-w-xs">
                        {rcpt.merchantUpiId}
                      </p>
                      
                      <p className="text-[10px] text-zinc-400 dark:text-emerald-200/40 flex items-center space-x-1 pt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-black text-base text-emerald-600 dark:text-emerald-400">
                          {formatINR(rcpt.totalAmount)}
                        </p>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          PAID
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDelete(rcpt.id, e)}
                        aria-label="Delete receipt"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-zinc-50 dark:bg-[#041710] border-t border-zinc-200 dark:border-emerald-900/40 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-emerald-500/30 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-[#0c3123] text-zinc-700 dark:text-zinc-200 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Individual Receipt Detail & Print Modal */}
      {activeReceipt && (
        <ReceiptModal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          receipt={activeReceipt}
        />
      )}
    </>
  );
}
