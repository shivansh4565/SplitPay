import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CheckCircle2, HelpCircle, X, Smartphone, ExternalLink, QrCode } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { generateUpiDeepLink, isMobileDevice } from '../utils/upiDeepLink';

export function PaymentConfirmModal({
  isOpen,
  payment,
  merchantData,
  onConfirmPaid,
  onClose
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQrInline, setShowQrInline] = useState(false);
  const isMobile = isMobileDevice();

  const displayAmount = payment?.amount !== undefined && payment?.amount !== null
    ? payment.amount
    : (payment?.amountPaise ? payment.amountPaise / 100 : 0);

  const upiUrl = payment && merchantData ? generateUpiDeepLink({
    pa: merchantData.pa,
    pn: merchantData.name,
    am: displayAmount,
    cu: 'INR',
    extraParams: merchantData.rawParams || {}
  }) : '';

  useEffect(() => {
    if (!isOpen || !upiUrl) return;
    QRCode.toDataURL(upiUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#041710', light: '#ffffff' }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR error in confirm modal:', err));
  }, [isOpen, upiUrl]);

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#07241a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-emerald-500/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-emerald-900/40">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
              Confirm Payment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-emerald-300/70">
              Part #{payment.sequence || 1}
            </span>
            <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">
              {formatINR(displayAmount)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-emerald-200/60 truncate max-w-xs mx-auto mt-1">
              To: <span className="font-bold text-zinc-800 dark:text-zinc-200">{merchantData.name}</span> ({merchantData.pa})
            </p>
          </div>

          {/* Desktop QR preview toggle */}
          {!isMobile && (
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-[#041710] border border-zinc-200 dark:border-emerald-500/20 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-700 dark:text-emerald-200 flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  <span>Paying from Phone?</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowQrInline(!showQrInline)}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{showQrInline ? 'Hide QR' : 'Show QR'}</span>
                </button>
              </div>

              {showQrInline && qrDataUrl && (
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-zinc-200 dark:border-emerald-500/30 mt-2 animate-fade-in">
                  <img src={qrDataUrl} alt="Scan QR" className="w-36 h-36 object-contain" />
                  <p className="text-[10px] text-zinc-500 text-center mt-1">
                    Scan with Google Pay, PhonePe, or Paytm
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-zinc-500 dark:text-emerald-100/70">
            Did you complete this payment in your UPI app?
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-50 dark:bg-[#041710]/50 border-t border-zinc-200 dark:border-emerald-900/40 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm border border-zinc-300 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Not Yet
          </button>

          <button
            onClick={() => {
              onConfirmPaid();
              onClose();
            }}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-1.5 active:scale-[0.99]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Yes, Mark Paid</span>
          </button>
        </div>
      </div>
    </div>
  );
}