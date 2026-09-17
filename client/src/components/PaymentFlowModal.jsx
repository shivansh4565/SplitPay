import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  HelpCircle,
  X,
  Smartphone,
  ArrowRight,
  RefreshCw,
  Sparkles,
  QrCode,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { generateUpiDeepLink, isMobileDevice } from '../utils/upiDeepLink';

export function PaymentFlowModal({
  isOpen,
  onClose,
  payment,
  paymentIndex,
  totalPayments,
  merchantData,
  nextPayment,
  nextPaymentIndex,
  onConfirmPaidAndNext,
  onConfirmPaidOnly
}) {
  const [modalState, setModalState] = useState('confirm'); // 'confirm' | 'verifying' | 'next_prompt'
  const [countdown, setCountdown] = useState(3);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [nextQrDataUrl, setNextQrDataUrl] = useState('');
  const [showQrInline, setShowQrInline] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMobile = isMobileDevice();

  // Reset state when a new payment opens
  useEffect(() => {
    if (isOpen && payment) {
      setModalState('confirm');
      setCountdown(3);
      setShowQrInline(false);

      const currentUpiUrl = generateUpiDeepLink({
        pa: merchantData.pa,
        pn: merchantData.name,
        am: payment.amount,
        cu: 'INR',
        extraParams: merchantData.rawParams || {}
      });

      QRCode.toDataURL(currentUpiUrl, {
        width: 220,
        margin: 2,
        color: { dark: '#041710', light: '#ffffff' }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR code generation error:', err));

      if (nextPayment) {
        const nextUpiUrl = generateUpiDeepLink({
          pa: merchantData.pa,
          pn: merchantData.name,
          am: nextPayment.amount,
          cu: 'INR',
          extraParams: merchantData.rawParams || {}
        });

        QRCode.toDataURL(nextUpiUrl, {
          width: 220,
          margin: 2,
          color: { dark: '#041710', light: '#ffffff' }
        })
          .then(url => setNextQrDataUrl(url))
          .catch(err => console.error('Next QR generation error:', err));
      }
    }
  }, [isOpen, payment, nextPayment, merchantData]);

  // Handle countdown during next_prompt
  useEffect(() => {
    let timer;
    if (modalState === 'next_prompt' && nextPayment) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      } else {
        // Auto-advance to next payment when countdown hits 0
        handleProceedNext();
      }
    }
    return () => clearTimeout(timer);
  }, [modalState, countdown, nextPayment]);

  if (!isOpen || !payment) return null;

  const currentUpiUrl = generateUpiDeepLink({
    pa: merchantData.pa,
    pn: merchantData.name,
    am: payment.amount,
    cu: 'INR',
    extraParams: merchantData.rawParams || {}
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUpiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserConfirmedPaid = () => {
    setModalState('verifying');

    // Simulate verified confirmation with smooth fintech animation
    setTimeout(() => {
      // Fire confetti celebration on successful verification
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (nextPayment) {
        setModalState('next_prompt');
      } else {
        // This was the last payment! Finish the whole plan
        onConfirmPaidOnly(payment._id || payment.id);
        onClose();
      }
    }, 1200);
  };

  const handleProceedNext = () => {
    onConfirmPaidAndNext(payment._id || payment.id, nextPayment);
  };

  const handleStayOnDashboard = () => {
    onConfirmPaidOnly(payment._id || payment.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#07241a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-emerald-500/30 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-emerald-900/40">
          <div className="flex items-center space-x-2">
            {modalState === 'confirm' && (
              <>
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                  Payment {paymentIndex + 1} of {totalPayments} Status
                </h3>
              </>
            )}
            {modalState === 'verifying' && (
              <>
                <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
                <h3 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                  Verifying Payment...
                </h3>
              </>
            )}
            {modalState === 'next_prompt' && (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
                  Payment #{paymentIndex + 1} Done!
                </h3>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Body State 1: Verification / Confirmation */}
        {modalState === 'confirm' && (
          <div className="p-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <span className="text-2xl font-bold font-sans">₹</span>
            </div>

            <div>
              <h4 className="text-lg font-black text-zinc-900 dark:text-white">
                Did you complete this payment?
              </h4>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">
                {formatINR(payment.amount)}
              </p>
              <p className="text-xs text-zinc-500 dark:text-emerald-200/60 mt-1 truncate">
                To <span className="font-semibold text-zinc-700 dark:text-zinc-200">{merchantData.name}</span> ({merchantData.pa})
              </p>
            </div>

            {/* Desktop Scannable QR Helper */}
            {!isMobile && (
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#041710] border border-zinc-200 dark:border-emerald-500/20 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span>Paying with your mobile phone?</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQrInline(!showQrInline)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQrInline ? 'Hide QR' : 'Show QR'}</span>
                  </button>
                </div>

                {showQrInline && qrDataUrl && (
                  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-zinc-200 dark:border-emerald-500/30 mt-2 animate-fade-in shadow-inner">
                    <img src={qrDataUrl} alt="Scan QR" className="w-40 h-40" />
                    <p className="text-[10px] text-zinc-500 text-center mt-1 font-medium">
                      Scan with Google Pay / PhonePe / Paytm to pay {formatINR(payment.amount)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm border border-zinc-300 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                Not Yet
              </button>

              <button
                onClick={handleUserConfirmedPaid}
                className="w-full sm:w-1/2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, Mark as Paid</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Body State 2: Verifying Animation */}
        {modalState === 'verifying' && (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto relative">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping opacity-75" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                Verifying Payment...
              </h4>
              <p className="text-xs text-zinc-500 dark:text-emerald-200/70 mt-1">
                Recording {formatINR(payment.amount)} for Part {paymentIndex + 1}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Body State 3: Next Payment Auto-Redirect */}
        {modalState === 'next_prompt' && nextPayment && (
          <div className="p-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                ✓ Part {paymentIndex + 1} of {totalPayments} Completed
              </span>
              <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Ready for Next Payment!
              </h4>
              <p className="text-2xl font-black text-emerald-500">
                {formatINR(nextPayment.amount)}
              </p>
              <p className="text-xs text-zinc-500 dark:text-emerald-200/70">
                Payment Part {nextPaymentIndex + 1} of {totalPayments}
              </p>
            </div>

            {/* Next Payment QR for instant scanning on Desktop */}
            {!isMobile && nextQrDataUrl && (
              <div className="p-3 bg-zinc-50 dark:bg-[#041710] rounded-2xl border border-zinc-200 dark:border-emerald-500/20 flex flex-col items-center">
                <img src={nextQrDataUrl} alt="Next QR" className="w-36 h-36 rounded-xl bg-white p-2" />
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  Point phone camera at screen to pay next part
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleProceedNext}
                className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Pay Part {nextPaymentIndex + 1} ({formatINR(nextPayment.amount)}) Now</span>
                <ArrowRight className="w-4 h-4" />
                {countdown > 0 && (
                  <span className="text-xs font-mono bg-emerald-700/50 px-2 py-0.5 rounded-full ml-1">
                    {countdown}s
                  </span>
                )}
              </button>

              <button
                onClick={handleStayOnDashboard}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-500 dark:text-emerald-200/60 hover:text-zinc-800 dark:hover:text-white transition-colors"
              >
                Stay on Payment Overview
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}