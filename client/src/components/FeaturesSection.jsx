import React from 'react';
import { QrCode, Layers, IndianRupee, BarChart3, Shield, Zap, Smartphone, Users, Sparkles } from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: QrCode,
    title: 'Scan & Go',
    description: 'Upload any merchant UPI QR and instantly read the payment details.'
  },
  {
    icon: Layers,
    title: 'Smart Split',
    description: 'Automatically split large amounts into payments under ₹2,000.'
  },
  {
    icon: IndianRupee,
    title: 'Pay via UPI',
    description: 'Open your preferred UPI app with a single tap for each payment part.'
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'See your payment status, completed payments, and remaining amount in real-time.'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'No bank login, no sensitive data. Just a simple and secure way to manage payments.'
  },
  {
    icon: Zap,
    title: 'Instant & Easy',
    description: 'Go from QR to payment plan in seconds — no complicated steps.'
  },
  {
    icon: Smartphone,
    title: 'Works on Any Device',
    description: 'Use it on any device with your favorite UPI app installed.'
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: 'Perfect for individuals, friends, and families when paying large bills.'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative w-full py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 relative max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>FEATURES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              smarter payments.
            </span>
          </h2>

          <p className="text-zinc-600 dark:text-emerald-100/70 text-sm sm:text-base leading-relaxed">
            SplitPay makes large UPI payments simple, secure, and stress-free. Built for everyday use, designed for everyone.
          </p>

          {/* Handwritten Annotation on Top Right */}
          <div className="hidden md:block absolute -right-32 top-8 transform rotate-6">
            <p className="font-handwriting text-xl text-emerald-600 dark:text-emerald-400 font-bold leading-none">
              Same Features.<br />Smarter Payments.
            </p>
            <svg className="w-8 h-8 text-emerald-500 -ml-2 -mt-1" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M40 5 C 30 20, 10 25, 10 40 M 10 40 L 18 35 M 10 40 L 15 48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES_DATA.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className="group p-6 rounded-3xl bg-white/90 dark:bg-[#07241a]/80 border border-zinc-200 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-emerald-100/60 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Slogan Bar */}
        <div className="pt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-emerald-300/60">
            <span>SMALL PAYMENTS, BIGGER POSSIBILITIES.</span>
            <span className="text-emerald-500">💚</span>
          </div>
        </div>

      </div>
    </section>
  );
}