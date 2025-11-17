import React from 'react';
import type { ReferenceImageRefinements } from '../../types';

interface ReferenceSettingsProps {
  aspectRatio: '1:1' | '3:4' | '9:16' | '16:9';
  onAspectRatioChange: (ratio: '1:1' | '3:4' | '9:16' | '16:9') => void;
  refinements: ReferenceImageRefinements;
  onRefinementsChange: (refinements: ReferenceImageRefinements) => void;
}

export const ReferenceSettings: React.FC<ReferenceSettingsProps> = ({
  aspectRatio,
  onAspectRatioChange,
  refinements,
  onRefinementsChange,
}) => {
  const updateRefinement = <K extends keyof ReferenceImageRefinements>(
    key: K,
    value: ReferenceImageRefinements[K]
  ) => {
    onRefinementsChange({ ...refinements, [key]: value });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] p-3 md:p-4">
        <div className="mb-2 md:mb-3 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/40">
          Aspect Ratio
        </div>
        <div className="flex flex-wrap gap-2">
          {(['1:1', '3:4', '9:16', '16:9'] as const).map((r) => {
            const selected = r === aspectRatio;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onAspectRatioChange(r)}
                className={`rounded-full border px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm transition ${
                  selected
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-white/15 text-white/70 hover:border-white/35 hover:bg-white/[0.06]'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
        <p className="mt-2 md:mt-3 text-[10px] md:text-xs text-white/50">
          Used directly for rendering. 1:1 is default.
        </p>
      </div>

      <div className="rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] p-3 md:p-4">
        <div className="mb-2 md:mb-3 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/40">
          Optional Refinements
        </div>
        <p className="mb-3 md:mb-4 text-[10px] md:text-xs text-white/50">
          Fine-tune the style transfer with these optional adjustments
        </p>

        <div className="space-y-4 md:space-y-5">
          <div className="space-y-2 md:space-y-3">
            <label className="text-[10px] md:text-xs text-white/70">
              Lighting Intensity
            </label>
            <div className="flex flex-wrap gap-2">
              {(['subtle', 'moderate', 'strong'] as const).map((intensity) => {
                const selected = refinements.lightingIntensity === intensity;
                return (
                  <button
                    key={intensity}
                    type="button"
                    onClick={() => updateRefinement('lightingIntensity', intensity)}
                    className={`rounded-full border px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm transition capitalize ${
                      selected
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-white/15 text-white/70 hover:border-white/35 hover:bg-white/[0.06]'
                    }`}
                  >
                    {intensity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="text-[10px] md:text-xs text-white/70">
              Background Color Adjustment
            </label>
            <input
              type="text"
              value={refinements.backgroundColorAdjustment || ''}
              onChange={(e) => updateRefinement('backgroundColorAdjustment', e.target.value)}
              placeholder="e.g., 'warmer tones', 'cooler palette', 'darker background'"
              className="w-full rounded-[12px] md:rounded-[16px] border border-white/10 bg-white/[0.02] px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 rounded-[12px] md:rounded-[16px] border border-white/10 bg-white/[0.02] p-3 md:p-4">
            <input
              type="checkbox"
              id="face-replacement"
              checked={refinements.faceReplacement ?? true}
              onChange={(e) => updateRefinement('faceReplacement', e.target.checked)}
              className="h-4 w-4 md:h-5 md:w-5 rounded border-white/20 bg-white/[0.02] text-accent focus:ring-2 focus:ring-accent/40"
            />
            <label htmlFor="face-replacement" className="flex-1 cursor-pointer">
              <div className="text-xs md:text-sm font-medium text-white mb-1">
                Replace Model Face
              </div>
              <div className="text-[10px] md:text-xs text-white/60">
                Replace the model's face with an AI-generated face to avoid copyright issues (recommended)
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};


