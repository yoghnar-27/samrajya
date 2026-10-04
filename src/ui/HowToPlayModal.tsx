import React, { useState } from 'react';
import { X, Crown, Dices, Swords, MapPin, RefreshCw, ShieldAlert } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'COWRIES' | 'ARMIES' | 'TERRITORIES' | 'BATTLE' | 'RECLAIM';

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('COWRIES');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="royal-panel max-w-3xl w-full p-6 md:p-8 rounded-xl shadow-2xl border-2 border-[var(--border-gold-strong)] text-[var(--text-parchment)] relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-gold-subtle)] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <Crown className="w-7 h-7 text-[var(--accent-gold)]" />
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-[var(--text-gold-bright)] tracking-wider">
                SAMRAJYA RULEBOOK
              </h2>
              <span className="text-xs font-heading text-stone-400">
                Pachisi Inspired Kingdom Strategy Manual • SIH 2026
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-amber-400 hover:bg-stone-800/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-stone-800">
          <button
            onClick={() => setActiveTab('COWRIES')}
            className={`px-4 py-2 rounded text-xs font-heading font-semibold tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'COWRIES'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70 shadow-lg'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Dices className="w-4 h-4 text-amber-400" />
            THE COWRIES
          </button>

          <button
            onClick={() => setActiveTab('ARMIES')}
            className={`px-4 py-2 rounded text-xs font-heading font-semibold tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'ARMIES'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70 shadow-lg'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Swords className="w-4 h-4 text-amber-400" />
            ARMIES
          </button>

          <button
            onClick={() => setActiveTab('TERRITORIES')}
            className={`px-4 py-2 rounded text-xs font-heading font-semibold tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'TERRITORIES'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70 shadow-lg'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            TERRITORIES
          </button>

          <button
            onClick={() => setActiveTab('BATTLE')}
            className={`px-4 py-2 rounded text-xs font-heading font-semibold tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'BATTLE'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70 shadow-lg'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            BATTLE
          </button>

          <button
            onClick={() => setActiveTab('RECLAIM')}
            className={`px-4 py-2 rounded text-xs font-heading font-semibold tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'RECLAIM'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-500/70 shadow-lg'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            RECLAIM
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-4 text-sm leading-relaxed min-h-[220px]">
          
          {activeTab === 'COWRIES' && (
            <div className="bg-stone-950/60 p-5 rounded-lg border border-stone-800 space-y-3">
              <h3 className="font-heading font-bold text-amber-300 text-lg flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-400" />
                Six Traditional Pachisi Cowrie Shells
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                Each turn begins by throwing six authentic porcelain cowrie shells. The number of upward-facing open shell mouths calculates your movement steps across trade roads:
              </p>
              <ul className="grid grid-cols-2 gap-2 text-xs font-heading text-amber-200 pt-2">
                <li className="bg-stone-900 p-2 rounded">● 0 Open Mouths → 6 Steps + Grace Turn</li>
                <li className="bg-stone-900 p-2 rounded">● 1 Open Mouth → 10 Steps + Grace Turn</li>
                <li className="bg-stone-900 p-2 rounded">● 2, 3, 4 Open → 2, 3, 4 Steps</li>
                <li className="bg-stone-900 p-2 rounded">● 5 Open Mouths → 25 Steps + Grace Turn</li>
              </ul>
            </div>
          )}

          {activeTab === 'ARMIES' && (
            <div className="bg-stone-950/60 p-5 rounded-lg border border-stone-800 space-y-3">
              <h3 className="font-heading font-bold text-amber-300 text-lg flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-400" />
                3D Army Units & Pathway Movement
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                After receiving your movement value, select a player garrison. Connected trade roads highlight in glowing green. Your 3D soldier unit physically marches along the route while the camera tracks its journey.
              </p>
            </div>
          )}

          {activeTab === 'TERRITORIES' && (
            <div className="bg-stone-950/60 p-5 rounded-lg border border-stone-800 space-y-3">
              <h3 className="font-heading font-bold text-amber-300 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Capitals, Forts & Farmlands
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                The map contains 4 major dynasty capitals (Chola, Vijayanagara, Maurya, Rajput) and 6 resource regions (Gingee Fort, Kaveri Farmlands, Deccan Spice Bazaar). Capture regions to increase your realm treasury!
              </p>
            </div>
          )}

          {activeTab === 'BATTLE' && (
            <div className="bg-stone-950/60 p-5 rounded-lg border border-stone-800 space-y-3">
              <h3 className="font-heading font-bold text-amber-300 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Deterministic Combat Resolution
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                When assaulting rival territories, combat resolves using Attacker Strength + Roll vs Defender Strength + Roll + Fort Bonus (+2). Victorious assaults capture the target territory!
              </p>
            </div>
          )}

          {activeTab === 'RECLAIM' && (
            <div className="bg-amber-950/40 p-5 rounded-lg border border-amber-600/50 space-y-3">
              <h3 className="font-heading font-bold text-amber-300 text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                The Signature Exile & Reclaim Comeback
              </h3>
              <p className="text-stone-300 text-xs md:text-sm">
                If your capital is seized by rival invaders, your ruler enters exile—NOT game over! Launch an Imperial Reclaim Challenge with an Exile perk (+2 Attack) to defeat the usurper and return to sovereign power.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border-gold-subtle)] flex justify-end">
          <button 
            onClick={onClose}
            className="btn-royal-primary px-8 py-2.5 text-sm"
          >
            CLOSE RULEBOOK
          </button>
        </div>

      </div>
    </div>
  );
};
