import React, { useState } from 'react';
import { Play, HelpCircle, Shield, Award } from 'lucide-react';
import { CinematicMenuCanvas } from '../world/CinematicMenuCanvas';
import { HowToPlayModal } from './HowToPlayModal';

interface MainMenuProps {
  onBeginReign: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onBeginReign }) => {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      
      {/* FULLSCREEN 3D CINEMATIC BACKGROUND CANVAS */}
      <CinematicMenuCanvas />

      {/* FOREGROUND OVERLAY */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen w-full px-4 py-8 md:py-12 pointer-events-none">
        
        {/* TOP HEADER / SIH 2026 BADGE */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-stone-950/85 border border-amber-500/40 backdrop-blur-md px-5 py-2 rounded-full text-xs font-heading tracking-widest text-amber-200 shadow-2xl">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>SIH 2026 PROTOTYPE — 3D IMPERIAL PACHISI STRATEGY</span>
        </div>

        {/* CENTER MAIN MENU TITLE & BUTTONS */}
        <div className="pointer-events-auto flex flex-col items-center text-center max-w-xl w-full my-auto py-8">
          
          {/* Emblem Motif */}
          <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-amber-950/70 border-2 border-amber-500/60 shadow-2xl text-amber-400 animate-pulse">
            <Shield className="w-10 h-10" />
          </div>

          {/* Title */}
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-widest text-gold-gradient text-gold-glow mb-2 drop-shadow-2xl">
            SAMRAJYA
          </h1>

          {/* Subtitle / Tagline */}
          <div className="flex items-center gap-4 w-full justify-center my-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-500/80" />
            <p className="font-heading text-xl md:text-2xl font-bold tracking-[0.35em] text-amber-200">
              RISE. RULE. RECLAIM.
            </p>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-500/80" />
          </div>

          <p className="text-stone-300/90 text-xs md:text-sm font-body max-w-md mb-9 leading-relaxed">
            Experience the epic revival of ancient India's royal game of Pachisi—reimagined into an immersive 3D civilization strategy experience.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <button
              onClick={onBeginReign}
              className="btn-royal-primary w-full py-4 text-base font-bold tracking-widest border-2 border-amber-400/90"
            >
              <Play className="w-5 h-5 fill-current" />
              BEGIN REIGN
            </button>

            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="btn-royal-secondary w-full py-4 text-base font-bold tracking-widest"
            >
              <HelpCircle className="w-5 h-5" />
              HOW TO PLAY
            </button>
          </div>
        </div>

        {/* FOOTER CREDITS */}
        <div className="pointer-events-auto text-center text-xs text-stone-400 font-body">
          <p className="tracking-wider">HISTORICALLY INSPIRED INDIAN CIVILIZATION STRATEGY • SIH26208</p>
        </div>

        {/* How To Play Modal */}
        <HowToPlayModal 
          isOpen={isHowToPlayOpen} 
          onClose={() => setIsHowToPlayOpen(false)} 
        />
      </div>

    </div>
  );
};
