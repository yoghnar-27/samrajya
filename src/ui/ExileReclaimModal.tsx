import { Flame, RefreshCw } from 'lucide-react';

interface ExileReclaimModalProps {
  isOpen: boolean;
  onReclaimChallenge: () => void;
}

export const ExileReclaimModal: React.FC<ExileReclaimModalProps> = ({
  isOpen,
  onReclaimChallenge
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="royal-panel max-w-xl w-full p-8 md:p-10 rounded-2xl border-2 border-red-500/80 text-center text-[var(--text-parchment)] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Background Flame Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          
          {/* Emblem Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-2xl animate-pulse">
            <Flame className="w-8 h-8" />
          </div>

          {/* Title Banner */}
          <h2 className="font-display text-4xl md:text-5xl font-bold text-red-500 tracking-widest mb-2 drop-shadow-lg">
            THE KINGDOM HAS FALLEN
          </h2>

          <p className="font-heading text-lg text-amber-200/90 font-semibold tracking-wider mb-6">
            THE RULER SURVIVES IN EXILE.
          </p>

          <p className="text-xs md:text-sm text-stone-300 leading-relaxed max-w-md mx-auto mb-8 font-body">
            Your royal citadel has been seized by rival invaders. But in SAMRAJYA, exile is not defeat—it is the spark of your imperial comeback. Rally your loyalist remnant forces and challenge the usurpers!
          </p>

          {/* Primary Action Button: RECLAIM KINGDOM */}
          <button
            onClick={onReclaimChallenge}
            className="btn-royal-primary px-10 py-4 text-base font-bold tracking-widest shadow-2xl border-2 border-amber-400 flex items-center justify-center gap-3 mx-auto w-full max-w-sm"
          >
            <RefreshCw className="w-5 h-5 text-amber-300 animate-spin" />
            <span>RECLAIM KINGDOM</span>
          </button>

        </div>

      </div>
    </div>
  );
};
