'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import type { CreativeConcept, GeneratedContent, ImageData, ShotType } from '../../types';
import { saveShot } from '../../services/shotLibrary';
import type { GeneratedImage } from '../../types';
import { useCredits } from '../../hooks/use-credits';

type ViewState = 'input' | 'concepts' | 'generated';

interface DashboardMainProps {
  userId?: string;
  onImageSaved?: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export const DashboardMain: React.FC<DashboardMainProps> = ({ userId, onImageSaved }) => {
  const { balance, loading: creditsLoading, refresh: refreshCredits } = useCredits();
  const [productImage, setProductImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [modelAppearance, setModelAppearance] = useState<string>('');

  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [creativeConcepts, setCreativeConcepts] = useState<CreativeConcept[] | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<CreativeConcept | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '4:3' | '3:4' | '16:9'>('1:1');
  const [shotType, setShotType] = useState<ShotType>('product');

  // New state for reference-style controls
  const [isProMode, setIsProMode] = useState<boolean>(false);
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('1K');
  const [overlayText, setOverlayText] = useState('');
  const [autoGenerateText, setAutoGenerateText] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<ViewState>('input');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Credit cost: Standard = 1, Pro 1K/2K = 3, Pro 4K = 4
  const creditCost = useMemo(() => {
    if (!isProMode) return 1;
    return resolution === '4K' ? 4 : 3;
  }, [isProMode, resolution]);

  const handleProductImageChange = (file: File | null) => {
    if (productImagePreview) {
      URL.revokeObjectURL(productImagePreview);
    }
    setProductImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setProductImagePreview(url);
    } else {
      setProductImagePreview(null);
    }
  };

  const handleReferenceImageChange = (file: File | null) => {
    if (referenceImagePreview) {
      URL.revokeObjectURL(referenceImagePreview);
    }
    setReferenceImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setReferenceImagePreview(url);
    } else {
      setReferenceImagePreview(null);
      setModelAppearance('');
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!productImage) {
      setError('A product image is required to start.');
      return;
    }

    if (!referenceImage) {
      setError('A reference image is required for direct shot generation. Please use concept generation instead.');
      return;
    }

    if (!creditsLoading && balance < creditCost) {
      setError(`You need ${creditCost} credits for this render, but only have ${balance}.`);
      return;
    }

    setError(null);
    setGeneratedContent(null);
    setIsLoading(true);
    setCurrentView('generated');

    try {
      const productImageBase64 = await fileToBase64(productImage);
      const referenceImageBase64 = referenceImage ? await fileToBase64(referenceImage) : null;

      let combinedPrompt = prompt || '';
      if (theme) {
        combinedPrompt = `Use a "${theme}" theme. ${combinedPrompt}`.trim();
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage: {
            name: productImage.name,
            type: productImage.type,
            base64: productImageBase64,
          },
          referenceImage: referenceImage ? {
            name: referenceImage.name,
            type: referenceImage.type,
            base64: referenceImageBase64,
          } : undefined,
          prompt: combinedPrompt,
          modelAppearance: modelAppearance || undefined,
          aspectRatio,
          isProMode,
          resolution,
          textOverlay: overlayText.trim() || undefined,
          autoGenerateText,
          shotType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate image');
      }

      const result = await response.json();
      setGeneratedContent(result as GeneratedContent);

      if (result.credits?.deducted) {
        await refreshCredits();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(message);
      setCurrentView('input');
    } finally {
      setIsLoading(false);
    }
  }, [
    productImage,
    referenceImage,
    prompt,
    theme,
    modelAppearance,
    aspectRatio,
    isProMode,
    resolution,
    overlayText,
    autoGenerateText,
    shotType,
    creditCost,
    balance,
    creditsLoading,
    refreshCredits,
  ]);

  const handleGenerateConceptsClick = useCallback(async () => {
    if (!productImage) {
      setError('A product image is required to generate concepts.');
      return;
    }

    setError(null);
    setGeneratedContent(null);
    setCreativeConcepts(null);
    setIsGeneratingConcepts(true);
    setCurrentView('concepts');

    try {
      const productImageBase64 = await fileToBase64(productImage);

      const response = await fetch('/api/ai/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage: {
            name: productImage.name,
            type: productImage.type,
            base64: productImageBase64,
          },
          theme: theme || undefined,
          prompt: prompt || undefined,
          isProMode,
          autoGenerateText,
          shotType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate concepts');
      }

      const data = await response.json();
      setCreativeConcepts(data.concepts);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(message);
      setCurrentView('input');
    } finally {
      setIsGeneratingConcepts(false);
    }
  }, [productImage, theme, prompt, isProMode, autoGenerateText, shotType]);

  const handleConceptSelect = useCallback((concept: CreativeConcept) => {
    setSelectedConcept(concept);
    setError(null);
  }, []);

  const handleGenerateFromConcept = useCallback(async () => {
    if (!productImage || !selectedConcept) return;

    if (!creditsLoading && balance < creditCost) {
      setError(`You need ${creditCost} credits for this render, but only have ${balance}.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentView('generated');

    try {
      const fullConceptPrompt = `Title: ${selectedConcept.title}. Scene: ${selectedConcept.scene_description}. Lighting: ${selectedConcept.lighting}. Arrangement: ${selectedConcept.product_arrangement}. Mood: ${selectedConcept.mood}.`;
      const productImageBase64 = await fileToBase64(productImage);

      // Use text overlay suggestion from concept if autoGenerateText is enabled
      let conceptTextOverlay = overlayText;
      if (isProMode && autoGenerateText && selectedConcept.text_overlay_suggestion) {
        conceptTextOverlay = selectedConcept.text_overlay_suggestion.text_content;
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage: {
            name: productImage.name,
            type: productImage.type,
            base64: productImageBase64,
          },
          prompt: fullConceptPrompt,
          aspectRatio,
          isProMode,
          resolution,
          textOverlay: conceptTextOverlay?.trim() || undefined,
          autoGenerateText,
          shotType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate image');
      }

      const result = await response.json();
      setGeneratedContent(result as GeneratedContent);

      if (result.credits?.deducted) {
        await refreshCredits();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(message);
      setCurrentView(creativeConcepts ? 'concepts' : 'input');
    } finally {
      setIsLoading(false);
    }
  }, [
    productImage,
    selectedConcept,
    aspectRatio,
    creativeConcepts,
    isProMode,
    resolution,
    overlayText,
    autoGenerateText,
    shotType,
    creditCost,
    balance,
    creditsLoading,
    refreshCredits,
  ]);

  const handleBack = useCallback(() => {
    if (currentView === 'generated') {
      if (creativeConcepts) {
        setCurrentView('concepts');
      } else {
        setCurrentView('input');
      }
    } else if (currentView === 'concepts') {
      setCurrentView('input');
    }
  }, [currentView, creativeConcepts]);

  const handleStartNewProject = useCallback(() => {
    if (productImagePreview) {
      URL.revokeObjectURL(productImagePreview);
    }
    if (referenceImagePreview) {
      URL.revokeObjectURL(referenceImagePreview);
    }
    setProductImage(null);
    setReferenceImage(null);
    setPrompt('');
    setTheme('');
    setModelAppearance('');
    setAspectRatio('1:1');
    setIsProMode(false);
    setResolution('1K');
    setOverlayText('');
    setAutoGenerateText(false);
    setShotType('product');
    setProductImagePreview(null);
    setReferenceImagePreview(null);
    setGeneratedContent(null);
    setCreativeConcepts(null);
    setSelectedConcept(null);
    setCurrentView('input');
    setError(null);
    setIsLoading(false);
    setIsGeneratingConcepts(false);
  }, [productImagePreview, referenceImagePreview]);

  useEffect(() => {
    return () => {
      if (productImagePreview) {
        URL.revokeObjectURL(productImagePreview);
      }
      if (referenceImagePreview) {
        URL.revokeObjectURL(referenceImagePreview);
      }
    };
  }, [productImagePreview, referenceImagePreview]);

  // Warn user if they try to refresh/close during generation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading || isGeneratingConcepts) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoading, isGeneratingConcepts]);

  const handleBackToConcepts = useCallback(() => {
    if (creativeConcepts) {
      setCurrentView('concepts');
    }
  }, [creativeConcepts]);

  const handleSaveToLibrary = useCallback(async () => {
    if (!generatedContent || !userId) return;

    try {
      const generatedImage: GeneratedImage = {
        id: `generated-${Date.now()}`,
        base64: generatedContent.imageUrl
          ? generatedContent.imageUrl.split(',')[1] || generatedContent.imageUrl
          : '',
        captions: null,
        hue: 0,
        saturation: 100,
      };

      await saveShot(userId, generatedImage);
      onImageSaved?.();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save to library';
      setError(message);
    }
  }, [generatedContent, userId, onImageSaved]);

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 pt-8 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start min-w-0 overflow-hidden">
      <InputPanel
        productImage={productImage}
        referenceImage={referenceImage}
        productImagePreview={productImagePreview}
        referenceImagePreview={referenceImagePreview}
        prompt={prompt}
        theme={theme}
        modelAppearance={modelAppearance}
        shotType={shotType}
        aspectRatio={aspectRatio}
        onProductImageChange={handleProductImageChange}
        onReferenceImageChange={handleReferenceImageChange}
        onPromptChange={setPrompt}
        onThemeChange={setTheme}
        onModelAppearanceChange={setModelAppearance}
        onShotTypeChange={setShotType}
        onAspectRatioChange={setAspectRatio}
        onGenerateClick={handleGenerateClick}
        onGenerateConceptsClick={handleGenerateConceptsClick}
        isLoading={isLoading}
        isGeneratingConcepts={isGeneratingConcepts}
        error={error}
        isProMode={isProMode}
        onProModeChange={setIsProMode}
        resolution={resolution}
        onResolutionChange={setResolution}
        overlayText={overlayText}
        onOverlayTextChange={setOverlayText}
        autoGenerateText={autoGenerateText}
        onAutoGenerateTextChange={setAutoGenerateText}
        availableCredits={balance}
        creditsLoading={creditsLoading}
      />
      <OutputPanel
        currentView={currentView}
        concepts={creativeConcepts}
        generatedContent={generatedContent}
        selectedConcept={selectedConcept}
        isLoading={isLoading}
        isGeneratingConcepts={isGeneratingConcepts}
        onSelectConcept={handleConceptSelect}
        onGenerateFromConcept={handleGenerateFromConcept}
        onBack={handleBack}
        onStartNewProject={handleStartNewProject}
        onBackToConcepts={handleBackToConcepts}
        onSaveToLibrary={handleSaveToLibrary}
        isProMode={isProMode}
      />
    </div>
  );
};
