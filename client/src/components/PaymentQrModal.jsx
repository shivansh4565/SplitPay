import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Copy, Check, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function PaymentQrModal({ isOpen, onClose, payment, merchantData, upiUrl, onMarkPaid }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const amountVal = payment?.amount !== undefined && payment?.amount !== null
    ? payment.amount
    : (payment?.amountPaise ? payment.amountPaise / 100 : 0);

  useEffect(() => {
    if (!isOpen || !upiUrl) return;

    let isMounted = true;
    setIsGenerating(true);

    QRCode.toDataURL(upiUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#041710',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(err => {
        console.error('Failed to generate QR code:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, upiUrl]);

  if (!isOpen || !payment) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirect = () => {
    try {
      window.location.href = upiUrl;
    } catch (e) {
      console.warn('Direct launch error:', e);
    }
  };

  const handleComplete = () => {
    if (onMarkPaid) {
      onMarkPaid();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#07241a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-emerald-500/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-emerald-900/40">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
              Scan & Pay Part #{payment.sequence || 1}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Display */}
        <div className="p-6 text-center space-y-4 flex flex-col items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-emerald-300/70">
              Payment Amount
            </span>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatINR(amountVal)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-emerald-200/60 truncate max-w-xs">
              To: <span className="font-bold text-zinc-800 dark:text-zinc-200">{merchantData.name}</span> ({merchantData.pa})
            </p>
          </div>

          {/* QR Code Container */}
          <div className="w-64 h-64 bg-white rounded-2xl p-3 border-2 border-zinc-200 dark:border-emerald-500/30 shadow-inner flex items-center justify-center relative">
            {isGenerating ? (
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="UPI Payment QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <p className="text-xs text-rose-500">Failed to render QR</p>
            )}
          </div>

          <div className="bg-zinc-50 dark:bg-[#041710] p-3 rounded-2xl border border-zinc-200 dark:border-emerald-500/20 text-[11px] text-zinc-600 dark:text-emerald-200/80 w-full text-left flex items-start space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>, or <strong>Paytm</strong> to pay {formatINR(amountVal)} directly to the merchant.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-50 dark:bg-[#041710]/50 border-t border-zinc-200 dark:border-emerald-900/40 space-y-2">
          <button
            onClick={handleComplete}
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-1.5 active:scale-[0.99]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I've Completed This Payment</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs border border-zinc-300 dark:border-emerald-500/30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors flex items-center justify-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleOpenDirect}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs border border-zinc-300 dark:border-emerald-500/30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors flex items-center justify-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}