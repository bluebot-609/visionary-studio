import React from 'react';

interface StepperProps {
  current: 0 | 1 | 2 | 3;
}

export const Stepper: React.FC<StepperProps> = ({ current }) => {
  const steps = ['Step 1 of 4', 'Step 2 of 4', 'Step 3 of 4', 'Step 4 of 4'];
  
  return (
    <div className="flex items-center gap-2 overflow-x-auto text-xs scrollbar-hide md:gap-3">
      {steps.map((label, idx) => {
        const active = idx === current;
        return (
          <div key={label} className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div
              className={`flex items-center gap-1.5 md:gap-2 rounded-full border px-2 py-1 md:px-3 whitespace-nowrap ${
                active
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-white/10 bg-white/[0.04] text-white/60'
              }`}
            >
              <span className={`block h-1.5 w-1.5 rounded-full flex-shrink-0 ${active ? 'bg-accent' : 'bg-white/40'}`} />
              <span className="uppercase tracking-[0.15em] md:tracking-[0.3em] text-[10px] md:text-xs">{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className="text-white/30 flex-shrink-0">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

