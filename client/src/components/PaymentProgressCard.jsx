import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function PaymentProgressCard({ progress, merchantName }) {
  const {
    totalAmount,
    paidAmount,
    remainingAmount,
    totalCount,
    verifiedCount,
    completedCount,
    pendingCount,
    progressPercent
  } = progress;

  const count = verifiedCount !== undefined ? verifiedCount : completedCount;

  return (
    <div className="rounded-3xl p-6 bg-white/90 dark:bg-[#07241a]/90 border border-zinc-200 dark:border-emerald-500/20 shadow-xl backdrop-blur-xl transition-all space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-emerald-300/70">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verified Payment Progress</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-0.5 tracking-tight">
            {formatINR(paidAmount)} <span className="text-zinc-400 dark:text-zinc-500 text-base sm:text-lg font-normal">/ {formatINR(totalAmount)} verified</span>
          </h3>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {progressPercent}% Verified
          </span>
          <p className="text-xs text-zinc-500 dark:text-emerald-200/60 mt-1 font-medium">
            {count} of {totalCount} verified
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-[#041710] rounded-full h-3.5 overflow-hidden p-0.5 border border-zinc-200/80 dark:border-emerald-500/20">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${Math.min(100, Math.max(progressPercent, 0))}%` }}
        />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
        <div className="bg-zinc-50 dark:bg-[#041710] p-2.5 rounded-2xl border border-zinc-200/70 dark:border-emerald-500/20">
          <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-emerald-300/60">Total</p>
          <p className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-white mt-0.5">
            {formatINR(totalAmount)}
          </p>
        </div>

        <div className="bg-emerald-500/10 dark:bg-[#0c3123] p-2.5 rounded-2xl border border-emerald-500/30">
          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Verified</p>
          <p className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatINR(paidAmount)}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-[#041710] p-2.5 rounded-2xl border border-zinc-200/70 dark:border-emerald-500/20">
          <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-emerald-300/60">Remaining</p>
          <p className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-white mt-0.5">
            {formatINR(remainingAmount)}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-[#041710] p-2.5 rounded-2xl border border-zinc-200/70 dark:border-emerald-500/20">
          <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-emerald-300/60">Payments</p>
          <p className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-white mt-0.5">
            {totalCount}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-[#041710] p-2.5 rounded-2xl border border-zinc-200/70 dark:border-emerald-500/20">
          <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-emerald-300/60">Completed</p>
          <p className="text-xs sm:text-sm font-extrabold text-emerald-500 mt-0.5">
            {count}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-[#041710] p-2.5 rounded-2xl border border-zinc-200/70 dark:border-emerald-500/20">
          <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-emerald-300/60">Pending</p>
          <p className="text-xs sm:text-sm font-extrabold text-amber-500 mt-0.5">
            {pendingCount}
          </p>
        </div>
      </div>
    </div>
  );
}