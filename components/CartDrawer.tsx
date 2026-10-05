'use client';

import React, { useState } from 'react';
import { CartItem } from '@/lib/types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';
import { cafeAudio } from '@/lib/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onProceedToCheckout: (cartDetails: {
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    orderType: 'dine_in' | 'takeaway' | 'delivery';
    appliedPromo: string | null;
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(1.50);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedPromo === 'SLOWBAR10') {
    discount = subtotal * 0.10;
  } else if (appliedPromo === 'FREESHIP') {
    discount = 5.00;
  }

  const tax = (subtotal - discount) * 0.085;
  const total = Math.max(0, subtotal - discount + tax + tipAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'SLOWBAR10' || code === 'FREESHIP') {
      setAppliedPromo(code);
      setPromoCode('');
      cafeAudio.playCeramicClink();
    } else {
      setPromoError('Invalid code. Try SLOWBAR10');
    }
  };

  const handleProceed = () => {
    cafeAudio.playCeramicClink();
    onProceedToCheckout({
      subtotal,
      discount,
      tax,
      tip: tipAmount,
      total,
      orderType,
      appliedPromo
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#161413] border-l border-[#2E2822] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#28221D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C68A4C]" />
              <h2 className="text-base font-display font-semibold text-[#EDE8E1]">
                Your Slow Bar Order
              </h2>
              <span className="text-xs font-mono text-[#7A7065]">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9E9388] hover:text-[#EDE8E1] hover:bg-[#221D1A] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Itemized List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Order Type Toggle */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#1C1917] border border-[#2B241F] rounded-xl text-xs font-medium">
              {[
                { id: 'dine_in', label: 'Dine-In' },
                { id: 'takeaway', label: 'Takeaway' },
                { id: 'delivery', label: 'Dispatch' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setOrderType(type.id as typeof orderType)}
                  className={`py-1.5 px-2 rounded-lg transition-all ${
                    orderType === type.id
                      ? 'bg-[#C68A4C] text-[#121110] font-semibold'
                      : 'text-[#9E9388] hover:text-[#EDE8E1]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {items.length === 0 ? (
              <div className="py-16 text-center text-[#7A7065]">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium text-[#BBB1A5]">Your bag is currently empty</p>
                <p className="text-xs mt-1">Configure a bespoke cup in 3D or select from our seasonal menu.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartId}
                    className="p-3.5 bg-[#1B1917] border border-[#2B241F] rounded-xl flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-[#EDE8E1]">{item.name}</h4>
                        {item.customization && (
                          <div className="text-[11px] text-[#C68A4C] font-mono mt-0.5 space-x-1">
                            {item.customization.size && <span>{item.customization.size}</span>}
                            {item.customization.roast && <span>· {item.customization.roast} roast</span>}
                            {item.customization.milk && <span>· {item.customization.milk} milk</span>}
                            {item.customization.temperature && <span>· {item.customization.temperature}</span>}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-sm font-medium text-[#EDE8E1] tabular-nums whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#26201B]">
                      <div className="flex items-center gap-2 bg-[#141210] border border-[#2B241F] rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, -1)}
                          className="p-1 text-[#BBB1A5] hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono px-2 text-[#EDE8E1] font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId, 1)}
                          className="p-1 text-[#BBB1A5] hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-xs text-[#7A7065] hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Code Input */}
            {items.length > 0 && (
              <div className="pt-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (SLOWBAR10)"
                    className="flex-1 py-2 px-3 bg-[#1C1917] border border-[#2B241F] rounded-lg text-xs text-[#EDE8E1] uppercase placeholder:normal-case placeholder:text-[#5E554C] focus:border-[#C68A4C] focus:outline-hidden font-mono"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3 bg-[#2A231D] hover:bg-[#382F27] border border-[#3E342B] text-xs text-[#EDE8E1] rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>
                {appliedPromo && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5 font-mono">
                    <Check className="w-3 h-3" />
                    <span>Applied code: {appliedPromo}</span>
                  </div>
                )}
                {promoError && (
                  <p className="text-xs text-red-400 mt-1">{promoError}</p>
                )}
              </div>
            )}

            {/* Barista Tip Selector */}
            {items.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs text-[#BBB1A5] mb-2 font-mono">
                  <span>Barista Craft Tip:</span>
                  <span className="text-[#C68A4C]">${tipAmount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  {[0, 1.00, 1.50, 2.50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className={`py-1.5 rounded-lg border font-mono transition-all ${
                        tipAmount === amount
                          ? 'border-[#C68A4C] bg-[#27211C] text-[#EDE8E1]'
                          : 'border-[#28221D] bg-[#1C1917] text-[#9E9388] hover:border-[#382F27]'
                      }`}
                    >
                      {amount === 0 ? 'None' : `$${amount.toFixed(2)}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Totals */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#28221D] bg-[#191716] space-y-3">
              <div className="space-y-1.5 text-xs text-[#BBB1A5] font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#EDE8E1]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Est. Tax (8.5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Barista Tip</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#EDE8E1] pt-2 border-t border-[#28221D]">
                  <span>Total</span>
                  <span className="text-[#C68A4C]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3.5 px-4 bg-[#C68A4C] hover:bg-[#D69A5C] active:scale-[0.99] text-[#121110] font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-between"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-1 font-mono font-bold">
                  <span>${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
