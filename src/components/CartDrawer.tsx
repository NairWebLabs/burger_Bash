import React, { useState } from 'react';
import { CartItem } from '../types';
import { whatsappCheckoutConfig } from '../config/whatsappCheckout';
import { X, Trash2, Plus, Minus, ArrowRight, MessageSquareCode, ShieldCheck, MapPin, Phone, User, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToWhatsApp: (customerDetails: {
    name: string;
    phone: string;
    address: string;
    orderType: 'delivery' | 'pickup';
    notes: string;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToWhatsApp
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('Alex Mercer');
  const [phone, setPhone] = useState('+1 (555) 392-1049');
  const [address, setAddress] = useState('184 Franklin St, Apt 3A, New York');
  const [notes, setNotes] = useState('Call on arrival, leave with doorman if unavailable.');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cur = whatsappCheckoutConfig.currency.symbol;
  const subtotal = items.reduce((acc, curr) => acc + (curr.calculatedPrice * curr.quantity), 0);
  
  const deliveryFee = orderType === 'delivery' 
    ? (whatsappCheckoutConfig.delivery.freeDeliveryThreshold > 0 && subtotal >= whatsappCheckoutConfig.delivery.freeDeliveryThreshold 
        ? 0 
        : whatsappCheckoutConfig.delivery.defaultFee) 
    : 0;

  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (items.length === 0) {
      setValidationError('Your bag is empty.');
      return;
    }

    if (!name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setValidationError('Please provide a delivery address.');
      return;
    }

    onProceedToWhatsApp({
      name: name.trim(),
      phone: phone.trim(),
      address: orderType === 'pickup' ? 'Atelier Counter Pickup' : address.trim(),
      orderType,
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0e0f14] h-full flex flex-col border-l border-white/10 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-display text-white uppercase tracking-tight">
              YOUR ATELIER BAG
            </h2>
            <span className="font-mono-num text-xs bg-amber-400/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              {items.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Empty State */}
          {items.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
                <X className="w-6 h-6" />
              </div>
              <p className="text-zinc-400 font-medium text-sm mb-2">Your Bag is Empty</p>
              <p className="text-xs text-zinc-500 max-w-xs mb-6">
                Explore our curated vault of smash burgers and wagyu creations.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex gap-4 items-start"
                  >
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-lg bg-zinc-800 shrink-0 border border-white/5"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white font-display truncate">
                          {cartItem.item.name}
                        </h4>
                        <span className="font-mono-num font-bold text-xs text-white shrink-0">
                          ${(cartItem.calculatedPrice * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Customization Details */}
                      {cartItem.customization && (
                        <div className="text-[11px] text-zinc-400 space-y-0.5 mt-1 font-mono-num">
                          {cartItem.customization.doneness && (
                            <div>· {cartItem.customization.doneness}</div>
                          )}
                          {cartItem.customization.bun && (
                            <div>· {cartItem.customization.bun}</div>
                          )}
                          {cartItem.customization.extraCheese && (
                            <div className="text-amber-400/90">+ Extra Melted Raclette</div>
                          )}
                          {cartItem.customization.extraPatty && (
                            <div className="text-amber-400/90">+ Extra Smashed Patty</div>
                          )}
                          {cartItem.customization.specialInstructions && (
                            <div className="italic text-zinc-500 truncate">
                              "{cartItem.customization.specialInstructions}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/30">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono-num text-white">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(cartItem.cartItemId)}
                          className="text-zinc-500 hover:text-red-400 text-xs transition-colors cursor-pointer p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery vs Pickup Selector */}
              <div className="pt-2">
                <div className="grid grid-cols-2 p-1 bg-zinc-900 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-amber-400 text-zinc-950 font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🛵 Direct Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-amber-400 text-zinc-950 font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🏪 Atelier Counter Pickup
                  </button>
                </div>
              </div>

              {/* Customer Contact & Delivery Details */}
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] uppercase font-mono-num text-zinc-400 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono-num text-zinc-400 mb-1">
                    WhatsApp Phone Number (For Automated Bot Dispatch)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-[11px] uppercase font-mono-num text-zinc-400 mb-1">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, Apartment or Suite, City"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {validationError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer Billing & WhatsApp Confirmation Trigger */}
        {items.length > 0 && (
          <div className="p-6 bg-[#090a0c] border-t border-white/10 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs font-mono-num text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{cur}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Dispatch</span>
                <span className="text-white">
                  {deliveryFee === 0 ? 'FREE' : `${cur}${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5 text-white">
                <span className="font-display uppercase tracking-wider">Estimated Total</span>
                <span className="text-amber-400 text-base">{cur}{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Direct to WhatsApp Checkout Button */}
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5"
            >
              <MessageSquareCode className="w-4 h-4 text-zinc-950" />
              <span>Proceed to WhatsApp Checkout</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono-num text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Official click-to-chat · Customer manually sends prefilled order</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
