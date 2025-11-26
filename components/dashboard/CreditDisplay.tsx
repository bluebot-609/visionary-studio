'use client';

import { Coins, Loader2 } from 'lucide-react';
import { useCredits } from '../../hooks/use-credits';

interface CreditDisplayProps {
  onPurchaseClick?: () => void;
  showPurchaseButton?: boolean;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ 
  onPurchaseClick,
  showPurchaseButton = true 
}) => {
  const { balance, loading } = useCredits();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur transition hover:border-white/20 hover:bg-black/50">
        <Coins className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold text-white">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
          ) : (
            `${balance} Credits`
          )}
        </span>
      </div>
      {showPurchaseButton && onPurchaseClick && (
        <button
          onClick={onPurchaseClick}
          className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition hover:border-accent/50 hover:bg-accent/20"
        >
          Buy Credits
        </button>
      )}
    </div>
  );
};





