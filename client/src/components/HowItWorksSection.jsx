import React from 'react';
import { ArrowRight, QrCode, Layers, Smartphone, Shield, Lock, Zap, Sparkles } from 'lucide-react';

const STEPS_DATA = [
  {
    step: '1',
    title: 'Upload Merchant QR',
    description: "Scan or upload the merchant's UPI QR code.",
    icon: (
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center relative">
        <QrCode className="w-8 h-8" />
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40" />
      </div>
    )
  },
  {
    step: '2',
    title: 'Enter Amount',
    description: 'Add the total amount you want to pay.',
    icon: (
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
        <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#041710] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm shadow-sm font-mono">
          ₹ 5500
        </span>
      </div>
    )
  },
  {
    step: '3',
    title: 'Get Payment Plan',
    description: "We'll split it into payments under ₹2,000.",
    icon: (
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
        <Layers className="w-8 h-8" />
      </div>
    )
  },
  {
    step: '4',
    title: 'Pay & Mark as Done',
    description: 'Pay each part via UPI and mark it as completed.',
    icon: (
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
        <Smartphone className="w-8 h-8" />
      </div>
    )
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative w-full py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>HOW IT WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            Just 4 simple steps
          </h2>

          <p className="text-zinc-600 dark:text-emerald-100/70 text-sm sm:text-base leading-relaxed">
            From QR to payment — it's that easy.
          </p>
        </div>

        {/* 4 Connected Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {STEPS_DATA.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-6 rounded-3xl bg-white/90 dark:bg-[#07241a]/80 border border-zinc-200 dark:border-emerald-500/20 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center space-y-4"
            >
              {/* Step number badge */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                {item.step}
              </div>

              {/* Graphic Icon */}
              <div className="pt-2">
                {item.icon}
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-emerald-100/60 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Forward arrow for desktop (except last) */}
              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-emerald-100 dark:bg-[#0c3123] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Trust & Feature Bar */}
        <div className="rounded-3xl p-5 bg-white/80 dark:bg-[#07241a]/70 border border-zinc-200 dark:border-emerald-500/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs text-zinc-700 dark:text-emerald-100/80 font-semibold">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>No bank login required</span>
            </div>
            <span className="text-zinc-300 dark:text-emerald-900 hidden sm:inline">|</span>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>100% secure & private</span>
            </div>
            <span className="text-zinc-300 dark:text-emerald-900 hidden sm:inline">|</span>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Built for everyday payments</span>
            </div>
          </div>

          <div className="text-right">
            <p className="font-handwriting text-lg text-emerald-600 dark:text-emerald-400 font-bold transform -rotate-2">
              ~ Small steps. Big convenience.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}