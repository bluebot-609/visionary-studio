import React from 'react';
import type { PhotographyPreset } from '../../services/presets';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface PresetSelectionProps {
  presets: PhotographyPreset[];
  recommendedPresets: string[];
  selectedPreset: string | null;
  onSelectPreset: (presetId: string) => void;
}

export const PresetSelection: React.FC<PresetSelectionProps> = ({
  presets,
  recommendedPresets,
  selectedPreset,
  onSelectPreset,
}) => {
  const isRecommended = (presetId: string) => recommendedPresets.includes(presetId);
  const isSelected = (presetId: string) => selectedPreset === presetId;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] p-3 md:p-4">
        <div className="mb-2 md:mb-3 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/40">
          Photography Aesthetic Presets
        </div>
        <p className="text-[10px] md:text-xs text-white/50">
          Select an aesthetic preset to guide the creative direction. AI will interpret the preset and create tailored settings for your product.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {presets.map((preset) => {
          const recommended = isRecommended(preset.id);
          const selected = isSelected(preset.id);

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`relative rounded-[20px] md:rounded-[24px] border p-4 md:p-5 text-left transition-all ${
                selected
                  ? 'border-accent bg-accent/20 shadow-lg shadow-accent/20'
                  : recommended
                  ? 'border-accent/30 bg-white/[0.05] hover:border-accent/50 hover:bg-white/[0.08]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              {recommended && (
                <Badge
                  variant="accent"
                  className="absolute top-2 right-2 text-[9px] md:text-[10px] px-2 py-0.5 md:px-2.5 md:py-1"
                >
                  Recommended
                </Badge>
              )}
              
              <div className="pr-16 md:pr-20">
                <h3 className={`text-sm md:text-base font-semibold mb-1.5 md:mb-2 ${
                  selected ? 'text-accent' : 'text-white'
                }`}>
                  {preset.name}
                </h3>
                
                <p className="text-[10px] md:text-xs text-white/60 mb-2 md:mb-3 line-clamp-2">
                  {preset.mood}
                </p>

                <div className="space-y-1.5 md:space-y-2">
                  <div className="text-[9px] md:text-[10px] text-white/50">
                    <span className="font-medium text-white/70">Best for:</span>{' '}
                    <span className="text-white/50">{preset.bestFor.slice(0, 2).join(', ')}</span>
                    {preset.bestFor.length > 2 && (
                      <span className="text-white/40"> +{preset.bestFor.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>

              {selected && (
                <div className="absolute bottom-3 right-3 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent text-slate-950">
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

