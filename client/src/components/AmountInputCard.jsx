import React, { useState, useEffect } from 'react';
import { Layers, AlertCircle, ArrowRight } from 'lucide-react';
import { splitAmount } from '../utils/splitAmount';
import { formatINR } from '../utils/formatters';

const PRESET_AMOUNTS = [2500, 3999, 5500, 9999, 15000];

export function AmountInputCard({
  amount,
  onChangeAmount,
  onGeneratePlan,
  disabled = false,
  isMerchantReady = false,
  isLoading = false
}) {
  const [validationError, setValidationError] = useState('');
  const [splitPreview, setSplitPreview] = useState(null);

  useEffect(() => {
    if (!amount || amount === '') {
      setValidationError('');
      setSplitPreview(null);
      return;
    }

    const num = Number(amount);
    if (isNaN(num)) {
      setValidationError('Please enter a valid numeric amount.');
      setSplitPreview(null);
      return;
    }

    if (num <= 0) {
      setValidationError('Please enter a valid amount greater than ₹0.');
      setSplitPreview(null);
      return;
    }

    if (num > 500000) {
      setValidationError('Maximum supported amount is ₹5,00,000 per session.');
      setSplitPreview(null);
      return;
    }

    setValidationError('');
    try {
      const chunks = splitAmount(num);
      setSplitPreview(chunks);
    } catch (err) {
      setValidationError(err.message);
      setSplitPreview(null);
    }
  }, [amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isMerchantReady) {
      setValidationError('Upload a merchant QR before generating the payment plan.');
      return;
    }
    if (validationError || !amount || Number(amount) <= 0) {
      return;
    }
    onGeneratePlan();
  };

  return (
    <div className="rounded-3xl p-6 bg-white/90 dark:bg-[#07241a]/90 border border-zinc-200 dark:border-emerald-500/20 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
          2
        </div>
        <h2 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
          Enter Amount
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="total-amount" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-emerald-300/70 mb-1.5">
            Total Amount to Pay
          </label>
          <div className="relative rounded-2xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-emerald-400">
              <span className="text-xl font-bold font-sans">₹</span>
            </div>
            <input
              id="total-amount"
              type="number"
              step="any"
              min="0.01"
              disabled={disabled}
              value={amount}
              onChange={(e) => onChangeAmount(e.target.value)}
              placeholder="e.g. 5500"
              className={`block w-full pl-10 pr-4 py-3.5 text-lg sm:text-xl font-black rounded-2xl bg-zinc-50 dark:bg-[#041710] border text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${
                validationError
                  ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/30'
                  : 'border-zinc-200 dark:border-emerald-500/30 focus:ring-emerald-500/40 focus:border-emerald-500'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>

        {/* Quick Amount Presets */}
        {!disabled && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-zinc-400 dark:text-emerald-300/60 mr-1 font-medium">Presets:</span>
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeAmount(preset.toString())}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                  Number(amount) === preset
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                    : 'bg-zinc-50 dark:bg-[#041710] border-zinc-200 dark:border-emerald-500/20 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#0c3123]'
                }`}
              >
                {formatINR(preset)}
              </button>
            ))}
          </div>
        )}

        {/* Live Split Preview */}
        {splitPreview && !validationError && (
          <div className="animate-fade-in bg-zinc-50 dark:bg-[#041710] rounded-2xl p-3.5 border border-zinc-200 dark:border-emerald-500/20 text-xs">
            <div className="flex items-center justify-between text-zinc-600 dark:text-emerald-200/80 mb-2">
              <span className="flex items-center space-x-1.5 font-bold">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Split Plan:</span>
              </span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {splitPreview.length} payment{splitPreview.length > 1 ? 's' : ''} (all &lt; ₹2,000)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {splitPreview.map((chunk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0c3123] border border-zinc-200 dark:border-emerald-500/30 text-zinc-800 dark:text-emerald-200 font-mono font-bold text-[11px]"
                >
                  Part {idx + 1}: {formatINR(chunk)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Inline Error Notice */}
        {validationError && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Generate Button */}
        {!disabled && (
          <button
            type="submit"
            disabled={!isMerchantReady || !!validationError || !amount || Number(amount) <= 0 || isLoading}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 text-white shadow-lg transition-all ${
              !isMerchantReady || !!validationError || !amount || Number(amount) <= 0 || isLoading
                ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.99] shadow-emerald-600/30'
            }`}
          >
            <span>{isLoading ? 'Generating Plan...' : 'Generate Payment Plan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
}