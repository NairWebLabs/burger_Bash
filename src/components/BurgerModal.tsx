import React, { useState } from 'react';
import { MenuItem, CartCustomization } from '../types';
import { X, Check, Plus, Minus, Flame, Sparkles, ChefHat } from 'lucide-react';

interface BurgerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customization: CartCustomization, unitPrice: number) => void;
}

export const BurgerModal: React.FC<BurgerModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [doneness, setDoneness] = useState(item.options?.doneness?.[0] || 'Chef Standard');
  const [bun, setBun] = useState(item.options?.bun?.[0] || 'Signature Golden Brioche');
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraPatty, setExtraPatty] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate customized unit price
  let calculatedUnitPrice = item.price;
  if (extraCheese) calculatedUnitPrice += 2.00;
  if (extraPatty) calculatedUnitPrice += 5.50;

  const totalPrice = calculatedUnitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(
      item,
      quantity,
      {
        doneness,
        bun,
        extraCheese,
        extraPatty,
        specialInstructions
      },
      calculatedUnitPrice
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#121318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 text-left animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] font-mono-num uppercase tracking-wider text-amber-400">
              {item.subname}
            </span>
            <h2 className="text-3xl font-black font-display text-white uppercase tracking-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description & Chef Note */}
          <div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              {item.description}
            </p>
            
            <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/20 flex items-start gap-3">
              <ChefHat className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 leading-snug">
                <span className="font-semibold text-amber-400 font-mono-num uppercase">Chef's Technique: </span>
                {item.chefNote}
              </div>
            </div>
          </div>

          {/* Key Ingredients List */}
          <div>
            <h4 className="text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-2.5">
              Architectural Ingredients
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              {item.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customization: Doneness */}
          {item.options?.doneness && item.options.doneness.length > 0 && (
            <div>
              <label className="block text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-2">
                Sear Style & Doneness
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.options.doneness.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDoneness(opt)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      doneness === opt
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization: Bun Choice */}
          {item.options?.bun && item.options.bun.length > 0 && (
            <div>
              <label className="block text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-2">
                Artisanal Bun
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.bun.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBun(b)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      bun === b
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upgrades / Add-ons */}
          {item.customizable && (
            <div>
              <label className="block text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-2">
                Gourmet Add-ons
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-zinc-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraCheese}
                      onChange={(e) => setExtraCheese(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-800 border-zinc-700 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-200">Extra Melted Aged Raclette (+2.00)</span>
                  </div>
                  <span className="text-xs font-mono-num text-amber-400">+$2.00</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-zinc-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={extraPatty}
                      onChange={(e) => setExtraPatty(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-800 border-zinc-700 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-200">Extra Dry-Aged Smashed Patty (+5.50)</span>
                  </div>
                  <span className="text-xs font-mono-num text-amber-400">+$5.50</span>
                </label>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-2">
              Kitchen Instructions / Allergies
            </label>
            <input
              type="text"
              placeholder="e.g. Extra pickles on the side, dressing light..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-6 bg-[#0c0d10] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-zinc-900">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3.5 py-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-4 py-2 text-xs font-bold font-mono-num text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3.5 py-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto flex-1 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-between"
          >
            <span>Add to Atelier Bag</span>
            <span className="font-mono-num font-bold text-sm">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
