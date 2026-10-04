import { RefreshCw } from 'lucide-react';

interface AITurnOverlayProps {
  isAITurn: boolean;
  aiLog: string | null;
}

export const AITurnOverlay: React.FC<AITurnOverlayProps> = ({ isAITurn, aiLog }) => {
  if (!isAITurn) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="royal-panel p-4 rounded-xl border border-amber-500/70 text-center text-[var(--text-parchment)] shadow-2xl bg-black/90">
        
        <div className="flex items-center justify-center gap-2 mb-1">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="font-heading font-bold text-xs text-amber-300 tracking-widest uppercase">
            RIVAL KINGDOM TURN IN PROGRESS
          </span>
        </div>

        <p className="text-xs text-stone-300 font-heading">
          {aiLog || 'Evaluating regional threats, capital safety, and expansion paths...'}
        </p>

      </div>
    </div>
  );
};
