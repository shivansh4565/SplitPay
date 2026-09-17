import React, { useRef, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { usePaymentSession } from './hooks/usePaymentSession';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PaymentWorkspace } from './components/PaymentWorkspace';
import { ReceiptHistoryModal } from './components/ReceiptHistoryModal';
import { Footer } from './components/Footer';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const paymentState = usePaymentSession();
  const workspaceRef = useRef(null);
  const [isReceiptHistoryOpen, setIsReceiptHistoryOpen] = useState(false);

  const handleNavigate = (target) => {
    if (target === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'features') {
      const el = document.getElementById('features');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'pay') {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleStartPayment = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSeeHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#051811] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Dynamic Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-600/15 dark:via-[#082a1e]/40 dark:to-transparent blur-3xl opacity-80" />
      </div>

      {/* Floating Pill Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onNavigate={handleNavigate}
        onOpenReceipts={() => setIsReceiptHistoryOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full relative z-10">
        {/* Hero Section */}
        <HeroSection
          onStartPayment={handleStartPayment}
          onSeeHowItWorks={handleSeeHowItWorks}
        />

        {/* Payment Workspace (Direct UPI Splitter) */}
        <PaymentWorkspace
          session={paymentState.session}
          isLoading={paymentState.isLoading}
          createPlan={paymentState.createPlan}
          markPaymentAsPaid={paymentState.markPaymentAsPaid}
          handleStatusUpdate={paymentState.handleStatusUpdate}
          handleRetryPayment={paymentState.handleRetryPayment}
          resetSession={paymentState.resetSession}
          progress={paymentState.progress}
          workspaceRef={workspaceRef}
        />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />
      </main>

      {/* Saved Receipts History Modal */}
      <ReceiptHistoryModal
        isOpen={isReceiptHistoryOpen}
        onClose={() => setIsReceiptHistoryOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}