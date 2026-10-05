'use client';

import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Sparkles, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cafeAudio } from '@/lib/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartDetails: {
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    orderType: 'dine_in' | 'takeaway' | 'delivery';
    appliedPromo: string | null;
  } | null;
  onOrderComplete: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartDetails,
  onOrderComplete
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4 (Slow Bar)');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'counter'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);

  if (!isOpen || !cartDetails) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsProcessing(true);
    cafeAudio.playBrewPourSound();

    setTimeout(() => {
      setIsProcessing(false);
      const orderNum = `AK-${Math.floor(1000 + Math.random() * 9000)}`;
      setCompletedOrder({
        orderNumber: orderNum,
        total: cartDetails.total
      });

      cafeAudio.playCeramicClink();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch {
        // Fallback
      }

      onOrderComplete();
    }, 1200);
  };

  const handleFinish = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#181615] border border-[#2E2822] rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9E9388] hover:text-[#EDE8E1] hover:bg-[#25201C] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="text-xs uppercase font-mono text-[#C68A4C] tracking-wider">
              Extraction In Progress
            </div>
            <h3 className="text-2xl font-display font-semibold text-[#EDE8E1] mt-1">
              Order #{completedOrder.orderNumber} Confirmed
            </h3>

            <p className="text-xs sm:text-sm text-[#9E9388] mt-2 max-w-sm mx-auto leading-relaxed">
              Our barista is grinding your single-origin beans and preparing the brew. Estimated preparation time: 4-6 minutes.
            </p>

            <div className="my-5 p-4 bg-[#141210] border border-[#26201B] rounded-xl text-left font-mono text-xs text-[#BBB1A5] space-y-1.5">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="text-[#EDE8E1]">{name}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="text-[#C68A4C]">{tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span className="text-[#EDE8E1] font-bold">${completedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Receipt sent:</span>
                <span>{email}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 bg-[#C68A4C] hover:bg-[#D69A5C] text-[#121110] font-semibold text-sm rounded-xl transition-all"
            >
              Back to Roastery Experience
            </button>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#28221D] pb-4 mb-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C68A4C] font-mono">
                <span>Express Slow Bar Barista Checkout</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-[#EDE8E1] mt-1">
                Complete Your Order
              </h3>
              <p className="text-xs text-[#9E9388] mt-1">
                Total amount to charge: <span className="text-[#EDE8E1] font-bold font-mono">${cartDetails.total.toFixed(2)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#BBB1A5] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kenji Sato"
                    className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2B241F] rounded-lg text-xs text-[#EDE8E1] placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#BBB1A5] mb-1">
                    Receipt Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kenji@tokyocoffee.jp"
                    className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2B241F] rounded-lg text-xs text-[#EDE8E1] placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BBB1A5] mb-1">
                  {cartDetails.orderType === 'dine_in'
                    ? 'Table Number or Seating Area'
                    : cartDetails.orderType === 'takeaway'
                    ? 'Pickup Time Preference'
                    : 'Dispatch Delivery Address'}
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#1C1917] border border-[#2B241F] rounded-lg text-xs text-[#EDE8E1] focus:border-[#C68A4C] focus:outline-hidden"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-medium text-[#BBB1A5] mb-2 font-mono">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card' },
                    { id: 'apple_pay', label: 'Apple / Google' },
                    { id: 'counter', label: 'At Counter' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                      className={`py-2 px-2 text-xs rounded-lg border text-center transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1] font-medium'
                          : 'border-[#28221D] bg-[#1C1917] text-[#9E9388] hover:border-[#382F27]'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="p-3 bg-[#141210] border border-[#28221D] rounded-xl space-y-2.5">
                  <div>
                    <label className="block text-[11px] text-[#7A7065] font-mono mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full py-2 px-3 bg-[#1C1917] border border-[#2E2823] rounded text-xs text-[#EDE8E1] font-mono focus:border-[#C68A4C] focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#7A7065] font-mono mb-1">Expiry</label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        className="w-full py-2 px-3 bg-[#1C1917] border border-[#2E2823] rounded text-xs text-[#EDE8E1] font-mono focus:border-[#C68A4C] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#7A7065] font-mono mb-1">CVC</label>
                      <input
                        type="text"
                        defaultValue="842"
                        className="w-full py-2 px-3 bg-[#1C1917] border border-[#2E2823] rounded text-xs text-[#EDE8E1] font-mono focus:border-[#C68A4C] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-[#7A7065] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#C68A4C] shrink-0" />
                <span>256-bit encrypted checkout. No sensitive card data stored.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#C68A4C] hover:bg-[#D69A5C] active:scale-[0.99] text-[#121110] font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Coffee className="w-4 h-4 animate-spin" />
                    <span>Transmitting Order to Barista...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ${cartDetails.total.toFixed(2)}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
