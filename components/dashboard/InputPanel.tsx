'use client';

import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ThemeSelector } from './ThemeSelector';

interface InputPanelProps {
  productImage: File | null;
  referenceImage: File | null;
  productImagePreview: string | null;
  referenceImagePreview: string | null;
  prompt: string;
  theme: string;
  modelAppearance: string;
  aspectRatio: '1:1' | '9:16' | '4:3' | '3:4' | '16:9';
  onProductImageChange: (file: File | null) => void;
  onReferenceImageChange: (file: File | null) => void;
  onPromptChange: (text: string) => void;
  onThemeChange: (theme: string) => void;
  onModelAppearanceChange: (text: string) => void;
  onAspectRatioChange: (ratio: '1:1' | '9:16' | '4:3' | '3:4' | '16:9') => void;
  onGenerateClick: () => void;
  onGenerateConceptsClick: () => void;
  isLoading: boolean;
  isGeneratingConcepts: boolean;
  error: string | null;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  productImage,
  referenceImage,
  productImagePreview,
  referenceImagePreview,
  prompt,
  theme,
  modelAppearance,
  aspectRatio,
  onProductImageChange,
  onReferenceImageChange,
  onPromptChange,
  onThemeChange,
  onModelAppearanceChange,
  onAspectRatioChange,
  onGenerateClick,
  onGenerateConceptsClick,
  isLoading,
  isGeneratingConcepts,
  error,
}) => {
  const canGenerateDirectly = productImage && referenceImage;
  const canGenerateConcepts = productImage && !referenceImage;

  return (
    <div className="bg-white/[0.05] p-6 md:p-8 rounded-2xl shadow-lg border border-white/10 w-full flex flex-col gap-6">
      <h2 className="font-display text-2xl font-bold text-white border-b border-white/10 pb-4">Create Your Scene</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader
          id="product-image"
          label="Product Image"
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

      {referenceImage && (
        <div>
          <label htmlFor="model-appearance" className="block text-sm font-medium text-white/80 mb-2">
            Model Appearance (Optional)
          </label>
          <textarea
            id="model-appearance"
            rows={2}
            className="w-full p-3 border border-white/10 rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-white/[0.05] text-white placeholder-white/40"
            placeholder="e.g., 'A model with long red hair and green eyes.'"
            value={modelAppearance}
            onChange={(e) => onModelAppearanceChange(e.target.value)}
          />
          <p className="text-xs font-normal text-white/50 mt-2">
            If your reference includes a person, you can describe a new model here to override their appearance. Leave blank to let the AI decide.
          </p>
        </div>
      )}

      <ThemeSelector selectedTheme={theme} onSelectTheme={onThemeChange} />

      <div>
        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-white/80 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-5 gap-2">
          {(['1:1', '9:16', '4:3', '3:4', '16:9'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors duration-200 ${
                aspectRatio === ratio
                  ? 'bg-accent text-slate-950 border-accent hover:bg-accent-hover'
                  : 'bg-white/[0.05] text-white/80 border-white/10 hover:bg-white/[0.1] hover:border-white/20'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-white/80 mb-2">
          Text Description (Optional)
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full p-3 border border-white/10 rounded-lg shadow-sm focus:ring-2 focus:ring-accent focus:border-accent transition-shadow bg-white/[0.05] text-white placeholder-white/40"
          placeholder="e.g., 'The product on a sleek marble surface, with dramatic side lighting, minimalist style.'"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={!productImage}
        />
        <p className="text-xs font-normal text-white/50 mt-2">
          {referenceImage 
            ? "This field is not used when a reference image is provided."
            : "Describe the desired scene, composition, and lighting. This will guide the AI in generating creative concepts for your product."}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-4 rounded-lg" role="alert">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-sm font-normal mt-1">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {canGenerateDirectly && (
          <button
            onClick={onGenerateClick}
            disabled={!productImage || isLoading || isGeneratingConcepts}
            className="w-full bg-accent text-slate-950 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent/30 disabled:bg-white/20 disabled:cursor-not-allowed disabled:text-white/50 transition-colors duration-200 flex items-center justify-center"
          >
            {(isLoading || isGeneratingConcepts) ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isGeneratingConcepts ? 'Brainstorming Concepts...' : 'Generating...'}
              </>
            ) : (
              'Generate Photoshoot'
            )}
          </button>
        )}
        {canGenerateConcepts && (
          <button
            onClick={onGenerateConceptsClick}
            disabled={!productImage || isLoading || isGeneratingConcepts}
            className="w-full bg-white/[0.1] text-white/90 font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-white/[0.15] hover:border-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:bg-white/5 disabled:cursor-not-allowed disabled:text-white/30 transition-colors duration-200 flex items-center justify-center"
          >
            {(isLoading || isGeneratingConcepts) ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Brainstorming Concepts...
              </>
            ) : (
              'Generate Creative Concepts'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

