import React, { useState, useEffect } from 'react';
import { Sun, Moon, Receipt } from 'lucide-react';
import { getSavedReceipts } from '../utils/receiptStorage';

export function Navbar({ theme, toggleTheme, onNavigate, onOpenReceipts }) {
  const isDark = theme === 'dark';
  const [receiptCount, setReceiptCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const list = getSavedReceipts();
      setReceiptCount(list.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    // Periodic refresh in case of active session
    const interval = setInterval(updateCount, 2000);

    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full pt-4 pb-2 px-4 sticky top-0 z-40">
      <nav className="max-w-4xl mx-auto rounded-full px-5 py-3 flex items-center justify-between shadow-xl transition-all duration-300 border border-emerald-500/20 bg-white/90 dark:bg-[#07241a]/90 backdrop-blur-xl">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* Custom SplitPay Emblem */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#051e15] rounded-[14px] flex items-center justify-center overflow-hidden relative">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-6h2v6zm0-8h-2V7h2v2z" opacity="0.2"/>
                <path d="M13.5 2.5C7.7 2.5 3 7.2 3 13c0 2.4.8 4.6 2.2 6.4L18.4 6.2C17 3.9 15.4 2.5 13.5 2.5z" fill="#10b981"/>
                <path d="M10.5 21.5c5.8 0 10.5-4.7 10.5-10.5 0-2.4-.8-4.6-2.2-6.4L5.6 17.8c1.4 2.3 3 3.7 4.9 3.7z" fill="#34d399"/>
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 dark:text-white">
                Split<span className="text-emerald-500">Pay</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-emerald-300/70 font-medium tracking-tight -mt-0.5">
              Big Bills. Smaller Payments.
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden sm:flex items-center space-x-6 text-xs font-semibold">
          <button
            onClick={() => onNavigate('features')}
            className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => onNavigate('pay')}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:opacity-90 transition-opacity"
          >
            Pay
          </button>
        </div>

        {/* Right Actions: Receipts & Theme Toggle */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenReceipts}
            title="View Saved Receipts"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-zinc-200 dark:border-emerald-500/30 bg-zinc-100/80 dark:bg-[#0c3123]/80 hover:bg-zinc-200 dark:hover:bg-[#124230] text-zinc-700 dark:text-emerald-200 transition-all shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Receipts</span>
            {receiptCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {receiptCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Pill Switch */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative w-16 h-8 rounded-full bg-zinc-200 dark:bg-[#03150d] border border-zinc-300 dark:border-emerald-500/30 p-1 flex items-center justify-between transition-colors cursor-pointer"
          >
            <Sun className={`w-3.5 h-3.5 z-10 ml-0.5 transition-colors ${!isDark ? 'text-amber-500' : 'text-zinc-500'}`} />
            <Moon className={`w-3.5 h-3.5 z-10 mr-0.5 transition-colors ${isDark ? 'text-emerald-400' : 'text-zinc-400'}`} />
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-emerald-600 shadow-md transform transition-transform duration-300 ${
                isDark ? 'left-[34px]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </nav>
    </div>
  );
}