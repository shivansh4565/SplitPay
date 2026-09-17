import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ResetConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h4 className="text-base font-bold text-zinc-900 dark:text-white">
            Reset Active Payment Session?
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            You have marked payments in progress. Resetting will clear the current plan and progress.
          </p>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl font-medium text-xs border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-colors"
          >
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
}
