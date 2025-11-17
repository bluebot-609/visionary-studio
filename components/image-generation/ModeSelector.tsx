import React from 'react';
import { Card } from '../ui/card';

interface ModeSelectorProps {
  mode: 'ai-guided' | 'reference-image';
  onModeChange: (mode: 'ai-guided' | 'reference-image') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] p-3 md:p-4">
        <div className="mb-2 md:mb-3 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/40">
          Generation Mode
        </div>
        <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4">
          Choose how you want to generate your product photo
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => onModeChange('ai-guided')}
            className={`relative rounded-[20px] md:rounded-[24px] border p-4 md:p-5 text-left transition-all ${
              mode === 'ai-guided'
                ? 'border-accent bg-accent/20 shadow-lg shadow-accent/20'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
            }`}
          >
            {mode === 'ai-guided' && (
              <div className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent text-slate-950">
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            
            <h3 className={`text-sm md:text-base font-semibold mb-1.5 md:mb-2 ${
              mode === 'ai-guided' ? 'text-accent' : 'text-white'
            }`}>
              AI-Guided Mode
            </h3>
            
            <p className="text-[10px] md:text-xs text-white/60">
              Full AI orchestration with preset selection, concept generation, and creative direction
            </p>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('reference-image')}
            className={`relative rounded-[20px] md:rounded-[24px] border p-4 md:p-5 text-left transition-all ${
              mode === 'reference-image'
                ? 'border-accent bg-accent/20 shadow-lg shadow-accent/20'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
            }`}
          >
            {mode === 'reference-image' && (
              <div className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent text-slate-950">
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            
            <h3 className={`text-sm md:text-base font-semibold mb-1.5 md:mb-2 ${
              mode === 'reference-image' ? 'text-accent' : 'text-white'
            }`}>
              Reference Image Mode
            </h3>
            
            <p className="text-[10px] md:text-xs text-white/60">
              Upload a style reference image for direct style transfer with minimal AI direction
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};


