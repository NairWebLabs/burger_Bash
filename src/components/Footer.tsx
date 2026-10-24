import React from 'react';
import { MapPin, Clock, ShieldCheck, Flame } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 bg-[#07080a] border-t border-white/[0.08] text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-3">
          <span className="text-xl font-bold font-display text-white tracking-tight uppercase">
            EMBER & BRIOCHE
          </span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            High-temperature smash burger atelier. Ground fresh from dry-aged chuck and brisket blend, seared over cast iron and binchotan white charcoal.
          </p>
          <div className="text-[11px] font-mono-num text-amber-400 flex items-center gap-1.5 pt-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Cast Iron Surface: 550°F</span>
          </div>
        </div>

        {/* Atelier Locations */}
        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-mono-num text-zinc-300 tracking-wider">
            Atelier Locations
          </h4>
          <div className="text-xs text-zinc-400 space-y-1">
            <p className="font-medium text-white">Tribeca Flagship</p>
            <p>148 Franklin Street, New York, NY</p>
            <p className="text-[11px] font-mono-num text-zinc-500">Pick-up Booth & Dining Counter</p>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-mono-num text-zinc-300 tracking-wider">
            Plancha Hours
          </h4>
          <div className="text-xs text-zinc-400 space-y-1 font-mono-num">
            <p>Monday – Thursday: 11:30 AM – 10:30 PM</p>
            <p>Friday – Saturday: 11:30 AM – 12:00 AM</p>
            <p>Sunday: 12:00 PM – 10:00 PM</p>
            <p className="text-emerald-400 text-[11px]">WhatsApp Bot Active 24/7</p>
          </div>
        </div>

        {/* Order Verification */}
        <div className="space-y-2.5">
          <h4 className="text-xs uppercase font-mono-num text-zinc-300 tracking-wider">
            WhatsApp Order Dispatch
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every cart order connects directly to our automated EMBER Concierge AI via WhatsApp protocol with kitchen line synchronization.
          </p>
          <div className="pt-2 text-[11px] text-zinc-500 font-mono-num">
            © 2026 EMBER & BRIOCHE ATELIER. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
