import React, { useState } from 'react';
import { MerchantQRCard } from './MerchantQRCard';
import { AmountInputCard } from './AmountInputCard';
import { PaymentProgressCard } from './PaymentProgressCard';
import { PaymentPartCard } from './PaymentPartCard';
import { ResetConfirmModal } from './ResetConfirmModal';
import { CompletionState } from './CompletionState';
import { RotateCcw, Zap } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function PaymentWorkspace({
  session,
  isLoading,
  createPlan,
  markPaymentAsPaid,
  handleStatusUpdate,
  handleRetryPayment,
  resetSession,
  progress,
  workspaceRef
}) {
  const [merchantData, setMerchantData] = useState(() => {
    if (session) {
      return {
        name: session.merchantName,
        pa: session.merchantUpiId,
        rawParams: session.additionalParams || {}
      };
    }
    return null;
  });
  const [amount, setAmount] = useState(session ? session.totalAmount?.toString() : '');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleMerchantDetected = (data) => {
    setMerchantData(data);
  };

  const handleClearMerchant = () => {
    setMerchantData(null);
  };

  const handleGeneratePlan = async () => {
    if (!merchantData || !amount) return;

    try {
      await createPlan({
        merchantName: merchantData.name,
        merchantUpiId: merchantData.pa,
        totalAmount: parseFloat(amount),
        additionalParams: merchantData.rawParams || {}
      });
    } catch (err) {
      console.error('Plan generation failed:', err);
    }
  };

  const handlePromptReset = () => {
    if (progress.verifiedCount > 0 && !progress.isCompleted) {
      setIsResetConfirmOpen(true);
    } else {
      handlePerformReset();
    }
  };

  const handlePerformReset = () => {
    resetSession();
    setMerchantData(null);
    setAmount('');
    setIsResetConfirmOpen(false);
  };

  const payments = session?.payments || [];

  // Determine sequential lock status:
  // Payment at index i is locked if any payment at index < i is not 'verified'
  let firstUnverifiedIndex = -1;
  for (let i = 0; i < payments.length; i++) {
    if (payments[i].status !== 'verified') {
      firstUnverifiedIndex = i;
      break;
    }
  }

  return (
    <section id="pay" ref={workspaceRef} className="relative w-full py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Heading */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>DIRECT UPI SPLITTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            {!session ? 'Create your split payment' : 'Pay in split installments'}
          </h2>
          <p className="text-zinc-600 dark:text-emerald-100/70 text-xs sm:text-sm max-w-md mx-auto">
            {!session
              ? 'Upload or scan any merchant QR, specify the total amount, and pay part-by-part easily under ₹2,000.'
              : `Splitting ${formatINR(session.totalAmount)} into ${session.payments.length} sequentially unlocked payments.`}
          </p>
        </div>

        {!session ? (
          /* STEP 1: Plan Generator Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <MerchantQRCard
              merchantData={merchantData}
              onMerchantDetected={handleMerchantDetected}
              onClearMerchant={handleClearMerchant}
            />

            <AmountInputCard
              amount={amount}
              onChangeAmount={setAmount}
              onGeneratePlan={handleGeneratePlan}
              isMerchantReady={!!merchantData}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* STEP 2: Active Plan Execution */
          <div className="space-y-6 animate-fade-in">
            {/* Top Bar with Reset Option */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Payment Plan
                </h3>
                <p className="text-xs text-zinc-500 dark:text-emerald-200/70">
                  {session.merchantName} ({session.merchantUpiId})
                </p>
              </div>

              <button
                onClick={handlePromptReset}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold border border-zinc-200 dark:border-emerald-500/30 hover:bg-zinc-100 dark:hover:bg-[#0c3123] text-zinc-700 dark:text-emerald-200 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New</span>
              </button>
            </div>

            {/* Completion View or Progress & Cards */}
            {progress.isCompleted ? (
              <CompletionState
                session={session}
                onReset={handlePerformReset}
              />
            ) : (
              <>
                <PaymentProgressCard
                  progress={progress}
                  merchantName={session.merchantName}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-emerald-300/70">
                      Payment Parts ({session.payments.length})
                    </h4>
                    <span className="text-xs text-zinc-400 dark:text-emerald-300/50">
                      Sequentially unlocked &lt; ₹2,000
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payments.map((payment, idx) => {
                      const isLocked = idx > firstUnverifiedIndex;
                      const isUpNext = idx === firstUnverifiedIndex;

                      return (
                        <PaymentPartCard
                          key={payment._id || payment.id || idx}
                          payment={payment}
                          index={idx}
                          totalCount={payments.length}
                          merchantData={{
                            name: session.merchantName,
                            pa: session.merchantUpiId,
                            rawParams: session.additionalParams || {}
                          }}
                          isLocked={isLocked}
                          isUpNext={isUpNext}
                          onMarkPaid={markPaymentAsPaid}
                          onRetry={handleRetryPayment}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Reset Confirmation Dialog */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handlePerformReset}
      />
    </section>
  );
}