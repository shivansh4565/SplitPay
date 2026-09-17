import React from 'react';
import { Linkedin, Instagram, Youtube, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full pt-12 pb-8 px-4 sm:px-6 border-t border-zinc-200 dark:border-emerald-950/80 bg-zinc-50/50 dark:bg-[#04130d] relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Footer Rounded Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#07241a]/70 border border-zinc-200 dark:border-emerald-500/20 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#051e15] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 2.5C7.7 2.5 3 7.2 3 13c0 2.4.8 4.6 2.2 6.4L18.4 6.2C17 3.9 15.4 2.5 13.5 2.5z" fill="#10b981"/>
                    <path d="M10.5 21.5c5.8 0 10.5-4.7 10.5-10.5 0-2.4-.8-4.6-2.2-6.4L5.6 17.8c1.4 2.3 3 3.7 4.9 3.7z" fill="#34d399"/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                  Split<span className="text-emerald-500">Pay</span>
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-emerald-300/70 font-medium">
                  Big Bills. Smaller Payments.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-emerald-100/60 leading-relaxed max-w-md">
              Make large UPI payments simple, secure, and stress-free. Split your bills and pay your way — anytime, anywhere.
            </p>

            {/* Social Icons with Handwritten Note */}
            <div className="pt-2 relative inline-flex items-center space-x-2.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#0c3123] text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 flex items-center justify-center transition-colors text-xs font-bold font-sans"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#0c3123] text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#0c3123] text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#0c3123] text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>

              <div className="hidden sm:block absolute left-44 -top-2 transform -rotate-6 pointer-events-none">
                <p className="font-handwriting text-base text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                  Let's stay connected! ↖
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 lg:border-l lg:border-zinc-200 lg:dark:border-emerald-900/40 lg:pl-10 space-y-4 text-center relative">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest font-extrabold text-zinc-900 dark:text-emerald-300">
                SMALL PAYMENTS.
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">BIGGER POSSIBILITIES.</span>
              </p>

              <div className="flex items-center justify-center my-2">
                <span className="h-px w-12 bg-zinc-200 dark:bg-emerald-900" />
                <Heart className="w-4 h-4 mx-2 text-emerald-500 fill-emerald-500" />
                <span className="h-px w-12 bg-zinc-200 dark:bg-emerald-900" />
              </div>

              <p className="text-xs text-zinc-500 dark:text-emerald-100/60 max-w-sm mx-auto">
                Built for a simpler, smarter, and more convenient tomorrow.
              </p>
            </div>

            {/* Top Right Handwritten quote */}
            <div className="hidden sm:block absolute right-0 -top-8 transform rotate-3 pointer-events-none">
              <p className="font-handwriting text-xl text-emerald-600 dark:text-emerald-400 font-bold">
                Pay Smarter.
                <br />
                Live Better.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-emerald-200/50 font-medium px-2">
          <p>© 2025 SplitPay. All rights reserved.</p>
          <p className="flex items-center space-x-1.5">
            <span>🇮🇳</span>
            <span>Built with 💚 in India</span>
          </p>
        </div>

      </div>
    </footer>
  );
}