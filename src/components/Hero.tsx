import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play, Pause, Flame, Sparkles, ArrowDownRight, MessageSquareCode } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenWhatsAppDirect: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOpenWhatsAppDirect }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 140]);
  const opacityParallax = useTransform(scrollY, [0, 500], [1, 0.2]);

  // Video loop sources (primary + fallback sizzle)
  const videoSource = "https://assets.mixkit.co/videos/preview/mixkit-juicy-beef-burger-patty-cooking-on-a-grill-41617-large.mp4";
  const heroPoster = "/src/assets/images/hero_artistic_smash_burger_1792861412573.jpg";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section 
      id="hero" 
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0c0d10]"
    >
      {/* Background Motion Video Container with Slow Zoom (Ken Burns) & Parallax */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      >
        <div className="relative w-full h-full animate-slow-zoom scale-105 transition-transform duration-1000 ease-out">
          <video
            ref={videoRef}
            src={videoSource}
            poster={heroPoster}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover opacity-45 brightness-95 contrast-110 filter"
          />

          {/* Film Grain & Dark Vignette Scrim */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#0c0d10]/60 to-[#0c0d10] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-[#0c0d10]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10] via-transparent to-[#0c0d10] pointer-events-none" />
        </div>
      </motion.div>

      {/* Floating subtle ember glow elements reacting to mouse coordinates */}
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px)`
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/5 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 1.8}px, ${mousePos.y * 1.8}px)`
        }}
      />

      {/* Foreground Hero Content & Editorial Text Reveals */}
      <motion.div 
        style={{ opacity: opacityParallax }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center flex flex-col items-center"
      >
        {/* Unboxed Metadata Kicker (Anti-Slop: No colored pill badges) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 text-xs tracking-widest uppercase text-amber-400/90 font-mono-num mb-6"
        >
          <span>550°F Maillard Crust</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Dry-Aged Brisket Blend</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Binchotan Smoke</span>
        </motion.div>

        {/* Hero Title with Dramatic Reveal & Typographic Weight */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight leading-[0.92] text-white uppercase max-w-4xl"
          >
            THE ARCHITECTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">
              OF THE SMASH BURGER
            </span>
          </motion.h1>
        </div>

        {/* Balanced Measure Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="max-w-2xl text-base sm:text-lg text-zinc-300 font-normal leading-relaxed mb-10 text-balance"
        >
          Crispy lacy margins. Cave-aged raclette melted under steam cloches. Toasted French butter brioche. Order online with instant automated WhatsApp AI dispatch and real-time kitchen tracking.
        </motion.p>

        {/* Primary Functional Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 cursor-pointer shadow-xl shadow-amber-500/15 flex items-center justify-center gap-2"
          >
            <span>Explore Curated Menu</span>
            <ArrowDownRight className="w-4 h-4 text-zinc-950" />
          </button>

          <button
            onClick={onOpenWhatsAppDirect}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-medium text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-sm"
          >
            <MessageSquareCode className="w-4 h-4 text-emerald-400" />
            <span>Launch WhatsApp AI Concierge</span>
          </button>
        </motion.div>

        {/* Real-time Atelier Status Banner below hero controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1 }}
          className="mt-14 pt-8 border-t border-white/[0.08] w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left"
        >
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-num mb-1">Kitchen Grill</div>
            <div className="text-sm font-medium text-zinc-200 font-mono-num flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>550°F Active Cast Iron</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-num mb-1">Beef Blend</div>
            <div className="text-sm font-medium text-zinc-200 font-mono-num">
              80/20 Dry-Aged Chuck & Rib
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-num mb-1">WhatsApp AI</div>
            <div className="text-sm font-medium text-zinc-200 font-mono-num flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Instant Auto-Confirmation</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono-num mb-1">Average Wait</div>
            <div className="text-sm font-medium text-zinc-200 font-mono-num">
              18–24 Min Dispatch
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Bottom-Right Video Play/Pause Control */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleVideoPlayback}
          className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 hover:text-white transition-all cursor-pointer"
          aria-label={isPlaying ? "Pause background motion video" : "Play background motion video"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </section>
  );
};
