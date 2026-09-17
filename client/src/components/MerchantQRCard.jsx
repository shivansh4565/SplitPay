import React, { useState, useRef } from 'react';
import { QrCode, Upload, Camera, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Store } from 'lucide-react';
import { decodeQrFromFile, parseUpiString } from '../utils/upiDecoder';
import { CameraScannerModal } from './CameraScannerModal';

const SAMPLE_MERCHANTS = [
  {
    name: 'Cafe Bliss',
    pa: 'cafebliss@okaxis',
    raw: 'upi://pay?pa=cafebliss@okaxis&pn=Cafe%20Bliss&mc=5812&cu=INR'
  },
  {
    name: 'Apollo Pharmacy',
    pa: 'apollopharmacy@icici',
    raw: 'upi://pay?pa=apollopharmacy@icici&pn=Apollo%20Pharmacy&mc=5912&cu=INR'
  },
  {
    name: 'Croma Electronics',
    pa: 'cromaretail@hdfcbank',
    raw: 'upi://pay?pa=cromaretail@hdfcbank&pn=Croma%20Electronics&mc=5732&cu=INR'
  }
];

export function MerchantQRCard({ merchantData, onMerchantDetected, onClearMerchant, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    if (!file) return;
    setIsDecoding(true);
    setErrorMessage(null);

    try {
      const { upiData, previewUrl } = await decodeQrFromFile(file);
      onMerchantDetected({
        name: upiData.pn,
        pa: upiData.pa,
        rawParams: upiData.rawParams,
        previewUrl,
        fullUrl: upiData.fullUrl
      });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to read this QR code. Please upload a clearer merchant QR image.');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample) => {
    setErrorMessage(null);
    try {
      const upiData = parseUpiString(sample.raw);
      onMerchantDetected({
        name: upiData.pn,
        pa: upiData.pa,
        rawParams: upiData.rawParams,
        previewUrl: null,
        fullUrl: sample.raw
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="rounded-3xl p-6 bg-white/90 dark:bg-[#07241a]/90 border border-zinc-200 dark:border-emerald-500/20 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
            Merchant QR
          </h2>
        </div>
        
        {merchantData && !disabled && (
          <button
            onClick={onClearMerchant}
            className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-emerald-300 flex items-center space-x-1 py-1 px-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#0c3123] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change QR</span>
          </button>
        )}
      </div>

      {merchantData ? (
        // Decoded Merchant Display State
        <div className="animate-fade-in bg-zinc-50 dark:bg-[#041710] rounded-2xl p-4 border border-zinc-200 dark:border-emerald-500/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-emerald-300/60 block">
                    Merchant
                  </span>
                  <p className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white leading-tight">
                    {merchantData.name}
                  </p>
                </div>
                <div className="pt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 dark:text-emerald-300/60 block">
                    UPI ID
                  </span>
                  <p className="font-mono text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    {merchantData.pa}
                  </p>
                </div>
              </div>
            </div>

            {merchantData.previewUrl && (
              <div className="shrink-0 hidden sm:block">
                <img
                  src={merchantData.previewUrl}
                  alt="QR Preview"
                  className="w-16 h-16 object-contain rounded-xl border border-zinc-200 dark:border-emerald-500/30 bg-white p-1 shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-200/80 dark:border-emerald-900/40 flex items-center justify-between text-xs text-zinc-500 dark:text-emerald-200/60">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">Valid UPI QR Detected</span>
            </div>
            {merchantData.rawParams?.mc && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-[#0c3123] text-zinc-700 dark:text-emerald-300">
                MCC: {merchantData.rawParams.mc}
              </span>
            )}
          </div>
        </div>
      ) : (
        // Upload & Scan Area
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={disabled || isDecoding}
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                : 'border-zinc-200 dark:border-emerald-500/20 hover:border-emerald-500/50 bg-zinc-50/50 dark:bg-[#041710]/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-[#0c3123] text-zinc-600 dark:text-emerald-300 flex items-center justify-center mb-3">
              {isDecoding ? (
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
              ) : (
                <QrCode className="w-6 h-6" />
              )}
            </div>

            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {isDecoding ? 'Decoding QR code...' : 'Drag & drop merchant QR image here'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-emerald-100/50 mt-1">
              Supports PNG, JPG, WebP from gallery or screenshot
            </p>

            <div className="flex items-center space-x-2 mt-4" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isDecoding}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload QR</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                disabled={disabled || isDecoding}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold border border-zinc-300 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-700 dark:text-emerald-200 rounded-xl transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan with Camera</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Samples */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-emerald-200/60 mb-2">
              <span className="flex items-center space-x-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Try Sample Merchant:</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_MERCHANTS.map((sample) => (
                <button
                  key={sample.pa}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  disabled={disabled}
                  className="p-2.5 text-left rounded-xl border border-zinc-200 dark:border-emerald-500/20 bg-zinc-50/70 dark:bg-[#041710]/70 hover:bg-zinc-100 dark:hover:bg-[#0c3123] hover:border-emerald-500/50 transition-all text-xs"
                >
                  <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{sample.name}</p>
                  <p className="text-[10px] font-mono text-zinc-500 dark:text-emerald-400/80 truncate">{sample.pa}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start space-x-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanSuccess={({ upiData, previewUrl }) => {
          onMerchantDetected({
            name: upiData.pn,
            pa: upiData.pa,
            rawParams: upiData.rawParams,
            previewUrl,
            fullUrl: upiData.fullUrl
          });
        }}
      />
    </div>
  );
}