'use client';

import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ThemeSelector } from './ThemeSelector';
import type { ShotType } from '../../types';

interface InputPanelProps {
  productImage: File | null;
  referenceImage: File | null;
  productImagePreview: string | null;
  referenceImagePreview: string | null;
  prompt: string;
  theme: string;
  modelAppearance: string;
  shotType: ShotType;
  aspectRatio: '1:1' | '9:16' | '4:3' | '3:4' | '16:9';
  onProductImageChange: (file: File | null) => void;
  onReferenceImageChange: (file: File | null) => void;
  onPromptChange: (text: string) => void;
  onThemeChange: (theme: string) => void;
  onModelAppearanceChange: (text: string) => void;
  onShotTypeChange: (type: ShotType) => void;
  onAspectRatioChange: (ratio: '1:1' | '9:16' | '4:3' | '3:4' | '16:9') => void;
  onGenerateClick: () => void;
  onGenerateConceptsClick: () => void;
  isLoading: boolean;
  isGeneratingConcepts: boolean;
  error: string | null;
  // New props for reference-style controls
  isProMode: boolean;
  onProModeChange: (isProMode: boolean) => void;
  resolution: '1K' | '2K' | '4K';
  onResolutionChange: (resolution: '1K' | '2K' | '4K') => void;
  overlayText: string;
  onOverlayTextChange: (text: string) => void;
  autoGenerateText: boolean;
  onAutoGenerateTextChange: (auto: boolean) => void;
  availableCredits: number;
  creditsLoading: boolean;
}

const ASPECT_RATIOS: Array<{ value: '1:1' | '9:16' | '4:3' | '3:4' | '16:9'; label: string }> = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '3:4', label: 'Portrait (3:4)' },
  { value: '4:3', label: 'Landscape (4:3)' },
  { value: '9:16', label: 'Story (9:16)' },
  { value: '16:9', label: 'Wide (16:9)' },
];

const RESOLUTIONS: Array<{ value: '1K' | '2K' | '4K'; label: string; sublabel: string; credits: number }> = [
  { value: '1K', label: '1K', sublabel: 'Standard', credits: 3 },
  { value: '2K', label: '2K', sublabel: 'High', credits: 3 },
  { value: '4K', label: '4K', sublabel: 'Ultra', credits: 4 },
];

export const InputPanel: React.FC<InputPanelProps> = ({
  productImage,
  referenceImage,
  productImagePreview,
  referenceImagePreview,
  prompt,
  theme,
  modelAppearance,
  shotType,
  aspectRatio,
  onProductImageChange,
  onReferenceImageChange,
  onPromptChange,
  onThemeChange,
  onModelAppearanceChange,
  onShotTypeChange,
  onAspectRatioChange,
  onGenerateClick,
  onGenerateConceptsClick,
  isLoading,
  isGeneratingConcepts,
  error,
  isProMode,
  onProModeChange,
  resolution,
  onResolutionChange,
  overlayText,
  onOverlayTextChange,
  autoGenerateText,
  onAutoGenerateTextChange,
  availableCredits,
  creditsLoading,
}) => {
  const canGenerateDirectly = productImage && referenceImage;
  const canGenerateConcepts = productImage && !referenceImage;

  // Credit cost calculation
  const creditCost = isProMode ? (resolution === '4K' ? 4 : 3) : 1;
  const insufficientCredits = !creditsLoading && availableCredits > -1 && availableCredits < creditCost;

  // Handle text overlay change - uncheck autoGenerateText when user types
  const handleOverlayTextChange = (text: string) => {
    onOverlayTextChange(text);
    if (text.length > 0 && autoGenerateText) {
      onAutoGenerateTextChange(false);
    }
  };

  // Handle autoGenerateText toggle - clear text when enabled
  const handleAutoGenerateTextChange = (checked: boolean) => {
    onAutoGenerateTextChange(checked);
    if (checked) {
      onOverlayTextChange('');
    }
  };

  return (
    <div className="bg-white/[0.05] p-6 md:p-8 rounded-2xl shadow-lg border border-white/10 w-full flex flex-col gap-6 max-h-full overflow-y-auto custom-scrollbar">
      {/* Header with Standard/Pro Toggle */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="font-display text-2xl font-bold text-white">Configuration</h2>
        
        {/* Standard / Pro Toggle */}
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${!isProMode ? 'text-white font-bold' : 'text-white/50'}`}>
            Standard
          </span>
          <button
            onClick={() => onProModeChange(!isProMode)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-slate-900 ${
              isProMode ? 'bg-accent' : 'bg-white/20'
            }`}
            role="switch"
            aria-checked={isProMode}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isProMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isProMode ? 'text-accent font-bold' : 'text-white/50'}`}>
            Pro
            {isProMode && (
              <span className="ml-1 text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                BETA
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Image Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader
          id="product-image"
          label="Product Image (Required)"
          onFileChange={onProductImageChange}
          previewUrl={productImagePreview}
          required
        />
        <ImageUploader
          id="reference-image"
          label="Reference Image (Optional)"
          onFileChange={onReferenceImageChange}
          previewUrl={referenceImagePreview}
        />
      </div>

      {/* Shot Type Selector */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Shot Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onShotTypeChange('product')}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ease-in-out hover:bg-white/[0.05] focus:outline-none ${
              shotType === 'product'
                ? 'border-accent bg-accent/10 text-white shadow-sm ring-1 ring-accent'
                : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 mb-1.5 ${shotType === 'product' ? 'text-accent' : 'text-white/40'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="font-bold text-sm">Product Hero Shot</span>
            <span className="text-xs mt-1 text-center opacity-80">Focus purely on the item</span>
            {shotType === 'product' && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-accent rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => onShotTypeChange('model')}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ease-in-out hover:bg-white/[0.05] focus:outline-none ${
              shotType === 'model'
                ? 'border-accent bg-accent/10 text-white shadow-sm ring-1 ring-accent'
                : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 mb-1.5 ${shotType === 'model' ? 'text-accent' : 'text-white/40'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-bold text-sm">On Model</span>
            <span className="text-xs mt-1 text-center opacity-80">Lifestyle & context</span>
            {shotType === 'model' && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-accent rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Model Description (optional, visible when shot type is model) */}
      {shotType === 'model' && (
        <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
          <label htmlFor="model-appearance" className="block text-sm font-bold text-white mb-2">
            Model Description <span className="text-xs font-normal text-white/50">(Optional)</span>
          </label>
          <textarea
            id="model-appearance"
            rows={2}
            className="w-full p-3 border border-white/10 rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-white/[0.05] text-white placeholder-white/40"
            placeholder="e.g., “A young woman with curly hair”, “A professional business man in a suit”"
            value={modelAppearance}
            onChange={(e) => onModelAppearanceChange(e.target.value)}
          />
          <p className="text-xs text-white/50 mt-2">
            Describe the model appearance. Leave blank to let AI decide.
          </p>
        </div>
      )}

      {/* Theme Selector */}
      <ThemeSelector selectedTheme={theme} onSelectTheme={onThemeChange} />

      {/* Aspect Ratio Selector */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Aspect Ratio</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => {
            const isSelected = aspectRatio === ratio.value;
            return (
              <button
                key={ratio.value}
                onClick={() => onAspectRatioChange(ratio.value)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ease-in-out text-center shadow-sm ${
                  isSelected
                    ? 'bg-accent text-slate-950 border-accent'
                    : 'bg-white/[0.05] text-white/80 border-white/10 hover:bg-white/[0.1] hover:border-white/20'
                }`}
              >
                {ratio.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Resolution (Pro mode only) */}
      {isProMode && (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Image Resolution</label>
          <div className="flex gap-2">
            {RESOLUTIONS.map((res) => {
              const isSelected = resolution === res.value;
              return (
                <button
                  key={res.value}
                  onClick={() => onResolutionChange(res.value)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ease-in-out shadow-sm whitespace-nowrap ${
                    isSelected
                      ? 'bg-accent text-slate-950 border-accent'
                      : 'bg-white/[0.05] text-white/80 border-white/10 hover:bg-white/[0.1] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{res.label}</span>
                    <span className="text-xs opacity-70">({res.sublabel})</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${isSelected ? 'bg-slate-950/20' : 'bg-white/10'}`}>
                      {res.credits} credits
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-white/50 mt-2">
            Higher resolutions may take longer to generate. 4K is ideal for print or large displays.
          </p>
        </div>
      )}

      {/* Text Overlay (Pro mode only) */}
      {isProMode && (
        <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="text-overlay" className="block text-sm font-bold text-white">
              Text Overlay{' '}
              <span className="text-xs font-normal text-white/60">(Processed by AI)</span>
            </label>
            <div className="flex items-center">
              <input
                id="auto-text"
                type="checkbox"
                className="h-4 w-4 text-accent focus:ring-accent border-white/30 rounded bg-white/10"
                checked={autoGenerateText}
                onChange={(e) => handleAutoGenerateTextChange(e.target.checked)}
              />
              <label htmlFor="auto-text" className="ml-2 text-sm text-white/70 select-none">
                Let AI decide
              </label>
            </div>
          </div>
          <textarea
            id="text-overlay"
            rows={2}
            className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-shadow ${
              autoGenerateText
                ? 'bg-white/[0.02] text-white/40 border-white/5'
                : 'bg-white/[0.05] text-white border-white/10'
            }`}
            placeholder={
              autoGenerateText
                ? 'AI will generate creative text for you.'
                : "e.g., 'Summer Sale', 'New Arrival', 'Limited Edition'"
            }
            value={overlayText}
            onChange={(e) => handleOverlayTextChange(e.target.value)}
            disabled={autoGenerateText}
          />
        </div>
      )}

      {/* Additional Instructions */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-white/80 mb-2">
          Additional Instructions
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="w-full p-3 border border-white/10 rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-white/[0.05] text-white placeholder-white/40"
          placeholder="e.g., 'The product on a sleek marble surface, with dramatic side lighting.'"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-4 rounded-lg" role="alert">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-sm font-normal mt-1">{error}</p>
        </div>
      )}

      {/* Insufficient Credits Warning */}
      {insufficientCredits && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
          You need {creditCost} credits for this render but only have {availableCredits}. Purchase
          credits to continue.
        </div>
      )}

      {/* Generate Buttons */}
      <div className="flex flex-col gap-2">
        {canGenerateDirectly && (
          <button
            onClick={onGenerateClick}
            disabled={!productImage || isLoading || isGeneratingConcepts || insufficientCredits}
            className="w-full font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none disabled:bg-white/20 disabled:cursor-not-allowed disabled:text-white/50 flex items-center justify-center bg-accent hover:bg-accent-hover focus:ring-accent/30 text-slate-950"
          >
            {isLoading || isGeneratingConcepts ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isGeneratingConcepts ? 'Brainstorming Concepts...' : 'Generating Photoshoot...'}
              </>
            ) : (
              <>
                {isProMode && <span className="mr-2">✨</span>}
                {isProMode ? 'Generate with Pro' : 'Generate Photoshoot'}
              </>
            )}
          </button>
        )}
        {canGenerateConcepts && (
          <button
            onClick={onGenerateConceptsClick}
            disabled={!productImage || isLoading || isGeneratingConcepts}
            className="w-full font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none disabled:bg-white/20 disabled:cursor-not-allowed disabled:text-white/50 flex items-center justify-center bg-accent hover:bg-accent-hover focus:ring-accent/30 text-slate-950"
          >
            {isLoading || isGeneratingConcepts ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Brainstorming Concepts...
              </>
            ) : (
              <>
                {isProMode && <span className="mr-2">✨</span>}
                {isProMode ? 'Generate with Pro' : 'Generate Photoshoot'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
