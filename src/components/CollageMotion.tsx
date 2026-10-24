import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export const CollageMotion: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const layers = [
    {
      id: 1,
      title: 'Top Crown',
      desc: 'French butter-basted brioche toasted on plancha with bone marrow tallow',
      badge: 'Golden Crumb',
      offsetY: -30
    },
    {
      id: 2,
      title: 'House Emulsion',
      desc: 'Smoked saffron remoulade infused with charred sweet shallots & crushed peppercorns',
      badge: 'Chef Sauce',
      offsetY: -10
    },
    {
      id: 3,
      title: 'Melted Shield',
      desc: 'Cave-aged sharp Wisconsin cheddar melted directly over patties under steam cloche',
      badge: '2-Year Aged',
      offsetY: 10
    },
    {
      id: 4,
      title: 'The Smashed Core',
      desc: 'Double 80/20 dry-aged chuck & brisket blend pressed paper-thin for maximum Maillard crisp',
      badge: '550°F Lacy Crust',
      offsetY: 30
    }
  ];

  return (
    <section id="collage" className="py-28 px-6 bg-[#090a0c] relative overflow-hidden border-t border-b border-white/[0.06]">
      {/* Background architectural grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial & Story */}
          <div className="lg:col-span-5 text-left">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-amber-400 font-mono-num mb-3">
              <span>01. Culinary Deconstruction</span>
              <span aria-hidden="true">·</span>
              <span>The Alchemy</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white uppercase tracking-tight leading-[0.95] mb-6">
              COLLAGE OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
                TEXTURE & HEAT
              </span>
            </h2>

            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              A standard burger is assembled; an Ember & Brioche burger is engineered. Each layer provides distinct tactile resistance—from the glass-like snap of lacy browned edges to the creamy velvet of steam-melted curd.
            </p>

            {/* Interactive Layer Explorer Tabs */}
            <div className="space-y-3">
              {layers.map((layer, idx) => (
                <div
                  key={layer.id}
                  onMouseEnter={() => setActiveLayer(idx)}
                  onMouseLeave={() => setActiveLayer(null)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeLayer === idx
                      ? 'bg-amber-500/10 border-amber-500/40 translate-x-2'
                      : 'bg-zinc-900/40 border-white/[0.06] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white font-display uppercase tracking-wide">
                      0{layer.id}. {layer.title}
                    </span>
                    <span className="text-xs font-mono-num text-amber-400">
                      {layer.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Layered Collage Motion Canvas */}
          <div className="lg:col-span-7 relative h-[520px] sm:h-[600px] flex items-center justify-center">
            
            {/* Ambient Back Glow */}
            <div className="absolute w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Central Primary High-Res Photo Card */}
            <motion.div
              animate={{
                y: activeLayer !== null ? [0, -6, 0] : [0, -10, 0],
                rotate: activeLayer !== null ? 0 : [0, 1, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-20 w-[85%] sm:w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group"
            >
              <img
                src="/src/assets/images/burger_smoked_saffron_smash_1792861412281.jpg"
                alt="Architectural smash burger cross section"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-left">
                <span className="text-[11px] font-mono-num text-amber-400 uppercase tracking-widest">
                  Live Plancha Cut
                </span>
                <h3 className="text-2xl font-bold font-display text-white uppercase tracking-tight">
                  Lacy-Edge Double Smashed
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Seared under 15 lbs weighted steel press for 90 seconds.
                </p>
              </div>
            </motion.div>

            {/* Collage Floating Card 1: Wagyu Truffle Insight (Top Right) */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                x: [0, 4, 0],
                rotate: [-2, 1, -2]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute top-4 right-2 sm:right-6 z-30 w-48 sm:w-56 p-3.5 bg-zinc-900/90 backdrop-blur-md rounded-xl border border-white/10 shadow-xl text-left hidden sm:block"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-mono-num text-amber-400 uppercase tracking-wider">
                  550°F Heat Zone
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-snug">
                Caramelized sugars fuse with beef tallow to form a shatteringly crisp edge.
              </p>
            </motion.div>

            {/* Collage Floating Card 2: Artisanal Binchotan Tag (Bottom Left) */}
            <motion.div
              animate={{
                y: [0, 10, 0],
                x: [0, -4, 0],
                rotate: [3, -1, 3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-6 left-2 sm:left-6 z-30 w-52 sm:w-60 p-4 bg-zinc-900/90 backdrop-blur-md rounded-xl border border-white/10 shadow-xl text-left"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-mono-num text-amber-300 uppercase tracking-wider">
                  A5 Truffle Grade
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-snug">
                Shaved Norcia winter truffles steeped directly in alpine Gruyère cream.
              </p>
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono-num">
                <span>Rating</span>
                <span className="text-amber-400 font-bold">5.0 / 5.0 Michelin</span>
              </div>
            </motion.div>

            {/* Secondary Floating Circular Stamp */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-6 left-12 z-10 w-24 h-24 rounded-full border border-dashed border-amber-500/30 flex items-center justify-center pointer-events-none"
            >
              <span className="text-[9px] font-mono-num text-amber-500/60 uppercase tracking-widest text-center px-2">
                EMBER & BRIOCHE ATELIER
              </span>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
