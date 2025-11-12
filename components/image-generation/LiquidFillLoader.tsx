import React from 'react';

interface LiquidFillLoaderProps {
  visible: boolean;
  currentStep: string;
  progress?: number;
}

export const LiquidFillLoader: React.FC<LiquidFillLoaderProps> = ({
  visible,
  currentStep,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-md rounded-2xl md:rounded-3xl">
      <div className="flex flex-col items-center gap-2 md:gap-3 px-4">
        {/* Simple circle with wave animation */}
        <div className="relative h-8 w-8 md:h-10 md:w-10">
          <div className="absolute inset-0 animate-pulse rounded-full bg-accent/30" />
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-0 animate-wave bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </div>
        </div>
        <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/70 text-center">
          {currentStep}
        </div>
      </div>
    </div>
  );
};

