import React, { useState } from 'react';
import { ArrowRight, Play, Shield, Lock, Zap, Copy, Check, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export function HeroSection({ onStartPayment, onSeeHowItWorks }) {
  const [copied, setCopied] = useState(false);

  const handleCopySample = () => {
    navigator.clipboard.writeText('cafebliss@okaxis');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full pt-6 sm:pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient glow shapes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 dark:bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-teal-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="uppercase text-[10px] sm:text-xs">MAKE BIG PAYMENTS, ONE SMALL STEP AT A TIME</span>
          </div>

          {/* Large Headline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.08]">
              Split the Bill.
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
                Pay Smarter.
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-zinc-600 dark:text-emerald-100/70 text-sm sm:text-base leading-relaxed max-w-lg">
            Upload a merchant QR, enter the amount, and we’ll split it into payments under ₹2,000 so you can pay easily via UPI — fast, simple, and secure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartPayment}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start a Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSeeHowItWorks}
              className="px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#0c3123]/80 dark:hover:bg-[#124230] border border-zinc-300 dark:border-emerald-500/20 text-zinc-800 dark:text-zinc-200 font-semibold text-sm flex items-center space-x-2 transition-all backdrop-blur-md"
            >
              <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              <span>See how it works</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-zinc-200 dark:border-emerald-900/40 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-emerald-200/60 font-medium">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>No bank login required</span>
            </div>
            <span className="text-zinc-300 dark:text-emerald-900">|</span>
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% secure & private</span>
            </div>
            <span className="text-zinc-300 dark:text-emerald-900">|</span>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Built for everyday payments</span>
            </div>
          </div>

          {/* Handwritten Quote */}
          <div className="pt-1">
            <p className="font-handwriting text-lg sm:text-xl text-zinc-500 dark:text-emerald-300/80 transform -rotate-1">
              ~ Small payments. Bigger possibilities.
            </p>
          </div>
        </div>

        {/* Right Interactive Showcase Column */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          
          {/* Main Showcase Container */}
          <div className="w-full max-w-md space-y-3 relative">
            
            {/* Top Merchant QR Mockup Card */}
            <div className="relative rounded-3xl p-5 bg-white/95 dark:bg-[#07241a]/95 border border-zinc-200 dark:border-emerald-500/30 shadow-2xl backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-emerald-300/60 block">
                    MERCHANT QR
                  </span>
                  <p className="font-bold text-sm text-zinc-800 dark:text-white">
                    Cafe Bliss
                  </p>
                </div>

                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Valid UPI QR</span>
                </span>
              </div>

              {/* Center Scannable Preview Graphic */}
              <div className="relative w-48 h-48 mx-auto bg-white dark:bg-[#041710] p-3 rounded-2xl border border-zinc-200 dark:border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-inner my-2">
                {/* Clean Vector QR Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-900 dark:text-emerald-300 fill-current">
                  {/* Outer corner boxes */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="11" width="16" height="16" rx="2" />
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="73" y="11" width="16" height="16" rx="2" />
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="73" width="16" height="16" rx="2" />
                  
                  {/* Pattern elements */}
                  <rect x="40" y="8" width="8" height="8" rx="1"/>
                  <rect x="52" y="8" width="8" height="8" rx="1"/>
                  <rect x="40" y="24" width="8" height="8" rx="1"/>
                  <rect x="8" y="40" width="8" height="8" rx="1"/>
                  <rect x="24" y="40" width="8" height="8" rx="1"/>
                  <rect x="40" y="40" width="20" height="20" rx="3" fill="#10b981"/>
                  <rect x="68" y="40" width="8" height="8" rx="1"/>
                  <rect x="84" y="40" width="8" height="8" rx="1"/>
                  <rect x="40" y="68" width="8" height="8" rx="1"/>
                  <rect x="52" y="76" width="8" height="8" rx="1"/>
                  <rect x="68" y="68" width="12" height="12" rx="2"/>
                  <rect x="84" y="84" width="8" height="8" rx="1"/>
                </svg>

                {/* Animated Green Laser Scan Line */}
                <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scan-laser pointer-events-none" />
              </div>

              {/* Bottom Card Bar */}
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 dark:text-emerald-300/60 block">Merchant</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">☕ Cafe Bliss</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 dark:text-emerald-300/60 block">UPI ID</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">cafebliss@okaxis</span>
                    <button
                      onClick={handleCopySample}
                      aria-label="Copy UPI ID"
                      className="p-1 text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row of 2 Small Companion Cards */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Payment Plan Card */}
              <div className="rounded-2xl p-3.5 bg-white/90 dark:bg-[#07241a]/90 border border-zinc-200 dark:border-emerald-500/20 shadow-lg text-xs space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-zinc-700 dark:text-zinc-300 font-bold">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Payment Plan</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                    3 payments
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 font-mono text-[11px]">
                  <div className="flex justify-between items-center text-zinc-800 dark:text-zinc-200">
                    <span className="text-zinc-400">1</span>
                    <span className="font-bold">₹1,999</span>
                    <span className="text-emerald-500 flex items-center space-x-1 text-[10px] font-sans">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-800 dark:text-zinc-200">
                    <span className="text-zinc-400">2</span>
                    <span className="font-bold">₹1,999</span>
                    <span className="text-amber-500 flex items-center space-x-1 text-[10px] font-sans">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-800 dark:text-zinc-200">
                    <span className="text-zinc-400">3</span>
                    <span className="font-bold">₹1,502</span>
                    <span className="text-zinc-400 flex items-center space-x-1 text-[10px] font-sans">
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Progress Card */}
              <div className="rounded-2xl p-3.5 bg-white/90 dark:bg-[#07241a]/90 border border-zinc-200 dark:border-emerald-500/20 shadow-lg text-xs space-y-2 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Total Progress</span>
                    <span className="text-[10px] font-mono text-zinc-400">1 of 3</span>
                  </div>

                  <div className="mt-1">
                    <p className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white">
                      ₹1,999 <span className="text-zinc-400 text-xs font-normal">/ ₹5,500</span>
                    </p>
                  </div>
                </div>

                <div>
                  <div className="w-full bg-zinc-200 dark:bg-[#041710] rounded-full h-2 overflow-hidden mb-1.5">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '36%' }} />
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Keep going! You're almost there. 💚
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Right Pill Badges */}
            <div className="hidden sm:flex flex-col space-y-2 absolute -right-12 top-6 pointer-events-none">
              {['+ UPI', '+ Instant', '+ Secure', '+ Simple'].map((tag, idx) => (
                <span
                  key={tag}
                  style={{ animationDelay: `${idx * 0.2}s` }}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#0a2f22]/90 border border-emerald-500/30 text-emerald-300 shadow-lg backdrop-blur-md animate-float"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}