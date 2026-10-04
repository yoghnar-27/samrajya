import { useState } from 'react';
import { ThreeCanvas } from './world/ThreeCanvas';
import { MainMenu } from './ui/MainMenu';
import type { GamePhase } from './game/types';
import { Shield, Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MAIN_MENU');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const handleBeginReign = () => {
    setActiveNotification('Kingdom View Activated — Preparing Imperial Realm');
    setPhase('PLAYING');
    setTimeout(() => setActiveNotification(null), 4000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-body select-none">
      
      {/* 1. FULLSCREEN 3D VIEWPORT CANVAS */}
      <ThreeCanvas isMenuMode={phase === 'MAIN_MENU'} />

      {/* 2. MAIN MENU OVERLAY (Phase: MAIN_MENU) */}
      {phase === 'MAIN_MENU' && (
        <MainMenu onBeginReign={handleBeginReign} />
      )}

      {/* 3. IN-GAME HUD SHELL (Phase: PLAYING - Preliminary HUD View) */}
      {phase === 'PLAYING' && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 md:p-6">
          
          {/* Top Header Panel */}
          <div className="flex items-center justify-between w-full">
            
            {/* Title Badge */}
            <div className="pointer-events-auto royal-panel px-4 py-2 flex items-center gap-3 rounded">
              <Shield className="w-5 h-5 text-[var(--accent-gold)]" />
              <div>
                <h2 className="font-display text-base font-bold text-gold-gradient tracking-wider">
                  SAMRAJYA
                </h2>
                <p className="text-[10px] text-stone-400 font-heading">
                  IMPERIAL KINGDOM VIEW
                </p>
              </div>
            </div>

            {/* Strategic Controls Hint */}
            <div className="pointer-events-auto royal-panel px-4 py-2 flex items-center gap-2 rounded text-xs text-amber-200/90 font-heading">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Drag Mouse to Rotate • Scroll to Zoom</span>
            </div>

            {/* Back to Menu Button */}
            <button
              onClick={() => setPhase('MAIN_MENU')}
              className="pointer-events-auto btn-royal-secondary text-xs px-3 py-1.5"
            >
              MAIN MENU
            </button>
          </div>

          {/* Center Toast Notification */}
          {activeNotification && (
            <div className="self-center pointer-events-auto royal-panel border-amber-500/60 px-6 py-3 rounded-full flex items-center gap-3 text-amber-200 text-sm font-heading animate-in fade-in slide-in-from-top-4 duration-300">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{activeNotification}</span>
            </div>
          )}

          {/* Bottom Bar Shell */}
          <div className="pointer-events-auto self-center royal-panel px-6 py-3 rounded text-xs text-stone-300 font-heading flex items-center gap-4">
            <span className="text-amber-400 font-bold">PHASE 1 ACTIVE:</span>
            <span>3D Imperial World & Royal Visual System</span>
          </div>

        </div>
      )}

    </div>
  );
}
