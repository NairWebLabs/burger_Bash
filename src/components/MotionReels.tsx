import React, { useState, useRef } from 'react';
import { MOTION_REEL_CLIPS } from '../data/menu';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Flame, Eye } from 'lucide-react';
import { kitchenSound } from '../utils/audio';

interface MotionReelsProps {
  soundActive: boolean;
  onToggleSound: () => void;
}

export const MotionReels: React.FC<MotionReelsProps> = ({ soundActive, onToggleSound }) => {
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentClip = MOTION_REEL_CLIPS[activeClipIndex];

  const handleSelectClip = (index: number) => {
    setActiveClipIndex(index);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleTogglePlay = () => {
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

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <section id="reels" className="py-24 px-6 bg-[#090a0c] relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-amber-400 font-mono-num mb-2">
              <span>High-Frame Sizzle Cinema</span>
              <span aria-hidden="true">·</span>
              <span>Visual Chemistry</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
              MOTION VIEW ATELIER
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            Witness the physics of caramelized smash edges, dripping gruyère emulsions, and French butter caramelization in ultra-high resolution motion reels.
          </p>
        </div>

        {/* Video Cinema Theater Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Video Screen (8 cols) */}
          <div className="lg:col-span-8 relative aspect-[16/9] bg-zinc-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group flex flex-col justify-end">
            <video
              ref={videoRef}
              key={currentClip.id}
              src={currentClip.videoUrl}
              poster={currentClip.poster}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300"
            />

            {/* Gradient Scrim for Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

            {/* Top Reel Details */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-left">
              <div>
                <span className="text-[11px] font-mono-num text-amber-400 uppercase tracking-widest block mb-0.5">
                  Reel 0{activeClipIndex + 1} / 0{MOTION_REEL_CLIPS.length}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white uppercase tracking-tight">
                  {currentClip.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-num text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {currentClip.tag}
                </span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="p-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl transition-all cursor-pointer font-bold shadow-lg shadow-amber-500/20"
                  aria-label={isPlaying ? "Pause video clip" : "Play video clip"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={onToggleSound}
                  className="p-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer"
                  title="Toggle ambient sizzle audio"
                  aria-label="Toggle ambient sizzle audio"
                >
                  {soundActive ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <p className="text-xs text-zinc-300 hidden sm:block max-w-xs text-left">
                  {currentClip.description}
                </p>
              </div>

              {/* Speed Controls */}
              <div className="flex items-center gap-1 p-1 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                {[0.75, 1, 1.25].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2.5 py-1 text-xs font-mono-num rounded-lg transition-colors cursor-pointer ${
                      speed === s
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reel Playlist / Selector Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            {MOTION_REEL_CLIPS.map((clip, index) => (
              <div
                key={clip.id}
                onClick={() => handleSelectClip(index)}
                className={`flex-1 p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 text-left ${
                  activeClipIndex === index
                    ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/5'
                    : 'bg-zinc-900/40 border-white/[0.06] hover:bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                  <img
                    src={clip.poster}
                    alt={clip.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {activeClipIndex === index && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-amber-300 fill-current" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono-num text-amber-400 uppercase tracking-wider block mb-1">
                    {clip.tag}
                  </span>
                  <h4 className="text-sm font-bold font-display text-white uppercase tracking-tight truncate">
                    {clip.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                    {clip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
