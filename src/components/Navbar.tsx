import React from 'react';
import { ShoppingBag, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { kitchenSound } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  isAdminView: boolean;
  onToggleAdmin: () => void;
  soundActive: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  isAdminView,
  onToggleAdmin,
  soundActive,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0d10]/90 backdrop-blur-md border-b border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark in display face */}
        <a 
          href="#hero" 
          className="text-xl md:text-2xl font-bold tracking-tight text-white font-display hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
        >
          EMBER & BRIOCHE
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <a 
            href="#hero" 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            The Atelier
          </a>
          <a 
            href="#menu" 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Burgers & Sides
          </a>
          <a 
            href="#collage" 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Our Alchemy
          </a>
          <a 
            href="#reels" 
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4"
          >
            Motion Reels
          </a>
          <button
            onClick={onToggleAdmin}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs uppercase tracking-wider font-mono-num flex items-center gap-1.5 px-2.5 py-1 rounded border ${
              isAdminView 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isAdminView ? 'Live Kitchen Active' : 'Kitchen Admin'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundActive ? 'Mute ambient grill sizzle' : 'Play ambient grill sizzle'}
            aria-label="Toggle grill ambiance audio"
            className="p-2 text-zinc-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/[0.04] cursor-pointer"
          >
            {soundActive ? (
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="group relative flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-950" />
            <span>Bag</span>
            <span className="font-mono-num text-[11px] bg-black/15 px-1.5 py-0.5 rounded text-zinc-950 font-bold">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="font-mono-num pl-1 border-l border-black/20 text-zinc-900 font-bold">
                ${cartTotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
