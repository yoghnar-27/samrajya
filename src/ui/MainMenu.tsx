import React, { useState } from 'react';
import { Play, HelpCircle, Shield, Award } from 'lucide-react';
import { HowToPlayModal } from './HowToPlayModal';

interface MainMenuProps {
  onBeginReign: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onBeginReign }) => {
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen w-full px-4 py-8 md:py-12 pointer-events-none">
      
      {/* TOP HEADER / SIH 2026 BADGE */}
      <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/80 border border-amber-500/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-heading tracking-widest text-amber-200/90 shadow-lg">
        <Award className="w-4 h-4 text-amber-400" />
        <span>SIH 2026 PROTOTYPE — IMPERIAL PACHISI STRATEGY</span>
      </div>

      {/* CENTER MAIN MENU TITLE & BUTTONS */}
      <div className="pointer-events-auto flex flex-col items-center text-center max-w-xl w-full my-auto py-8">
        
        {/* Emblem Motif */}
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-amber-950/60 border border-amber-500/50 shadow-2xl text-amber-400">
          <Shield className="w-8 h-8" />
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-widest text-gold-gradient text-gold-glow mb-2">
          SAMRAJYA
        </h1>

        {/* Subtitle / Tagline */}
        <div className="flex items-center gap-3 w-full justify-center my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
          <p className="font-heading text-lg md:text-xl font-semibold tracking-[0.3em] text-amber-200/90">
            RISE. RULE. RECLAIM.
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        <p className="text-stone-300/80 text-xs md:text-sm font-body max-w-md mb-8 leading-relaxed">
          Experience the epic revival of ancient India's royal game of Pachisi—reimagined into a 3D kingdom strategy battle for glory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
          <button
            onClick={onBeginReign}
            className="btn-royal-primary w-full py-4 text-base"
          >
            <Play className="w-5 h-5 fill-current" />
            BEGIN REIGN
          </button>

          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="btn-royal-secondary w-full py-4 text-base"
          >
            <HelpCircle className="w-5 h-5" />
            HOW TO PLAY
          </button>
        </div>
      </div>

      {/* FOOTER CREDITS */}
      <div className="pointer-events-auto text-center text-xs text-stone-400 font-body">
        <p className="tracking-wider">HISTORICALLY INSPIRED CIVILIZATION STRATEGY • SIH26208</p>
      </div>

      {/* How To Play Overlay */}
      <HowToPlayModal 
        isOpen={isHowToPlayOpen} 
        onClose={() => setIsHowToPlayOpen(false)} 
      />
    </div>
  );
};
