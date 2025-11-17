'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import type { CreativeConcept, GeneratedContent, ImageData } from '../../types';
import { saveShot } from '../../services/shotLibrary';
import type { GeneratedImage } from '../../types';

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

const fileToImageData = async (file: File): Promise<ImageData> => {
  const base64 = await fileToBase64(file);
  return {
    mimeType: file.type,
    data: base64,
  };
};

export const DashboardMain: React.FC<DashboardMainProps> = ({ userId, onImageSaved }) => {
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

  const [currentView, setCurrentView] = useState<ViewState>('input');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

    setError(null);
    setGeneratedContent(null);
    // Don't clear concepts - preserve them
    // setCreativeConcepts(null);
    setIsLoading(true);
    setCurrentView('generated');

    try {
      const productImageBase64 = await fileToBase64(productImage);
      const referenceImageBase64 = referenceImage ? await fileToBase64(referenceImage) : null;

      let combinedPrompt = prompt || '';
      if (theme) {
        combinedPrompt = `Use a "${theme}" theme. ${combinedPrompt}`.trim();
      }

      const productImageData = await fileToImageData(productImage);
      const referenceImageData = referenceImage ? await fileToImageData(referenceImage) : null;

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
          aspectRatio: aspectRatio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate image');
      }

      const result = await response.json();
      setGeneratedContent({
        image: `data:image/png;base64,${result.image}`,
        description: result.description || '',
      });
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      setCurrentView('input');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, referenceImage, prompt, theme, modelAppearance, aspectRatio]);

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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate concepts');
      }

      const data = await response.json();
      setCreativeConcepts(data.concepts);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      setCurrentView('input');
    } finally {
      setIsGeneratingConcepts(false);
    }
  }, [productImage, theme, prompt]);

  const handleConceptSelect = useCallback((concept: CreativeConcept) => {
    setSelectedConcept(concept);
    setError(null);
    // Don't clear concepts - preserve them for navigation back
    // Don't navigate immediately - let user click generate button
  }, []);

  const handleGenerateFromConcept = useCallback(async () => {
    if (!productImage || !selectedConcept) return;

    setIsLoading(true);
    setError(null);
    setCurrentView('generated');

    try {
      const fullConceptPrompt = `Title: ${selectedConcept.title}. Scene: ${selectedConcept.scene_description}. Lighting: ${selectedConcept.lighting}. Arrangement: ${selectedConcept.product_arrangement}. Mood: ${selectedConcept.mood}.`;
      const productImageBase64 = await fileToBase64(productImage);

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
          aspectRatio: aspectRatio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate image');
      }

      const result = await response.json();
      setGeneratedContent({
        image: `data:image/png;base64,${result.image}`,
        description: result.description || '',
      });
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      setCurrentView(creativeConcepts ? 'concepts' : 'input');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, selectedConcept, aspectRatio, creativeConcepts]);

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

  // Cleanup object URLs on unmount
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

  const handleBackToConcepts = useCallback(() => {
    if (creativeConcepts) {
      setCurrentView('concepts');
    }
  }, [creativeConcepts]);

  const handleGenerateNewConcepts = useCallback(() => {
    handleGenerateConceptsClick();
  }, [handleGenerateConceptsClick]);

  const handleSaveToLibrary = useCallback(async () => {
    if (!generatedContent || !userId) return;

    try {
      const generatedImage: GeneratedImage = {
        id: `generated-${Date.now()}`,
        base64: generatedContent.image.split(',')[1] || generatedContent.image,
        captions: null,
        hue: 0,
        saturation: 100,
      };

      await saveShot(userId, generatedImage);
      onImageSaved?.();
    } catch (e: any) {
      setError(e.message || 'Failed to save to library');
    }
  }, [generatedContent, userId, onImageSaved]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
      <InputPanel
        productImage={productImage}
        referenceImage={referenceImage}
        productImagePreview={productImagePreview}
        referenceImagePreview={referenceImagePreview}
        prompt={prompt}
        theme={theme}
        modelAppearance={modelAppearance}
        aspectRatio={aspectRatio}
        onProductImageChange={handleProductImageChange}
        onReferenceImageChange={handleReferenceImageChange}
        onPromptChange={setPrompt}
        onThemeChange={setTheme}
        onModelAppearanceChange={setModelAppearance}
        onAspectRatioChange={setAspectRatio}
        onGenerateClick={handleGenerateClick}
        onGenerateConceptsClick={handleGenerateConceptsClick}
        isLoading={isLoading}
        isGeneratingConcepts={isGeneratingConcepts}
        error={error}
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
      />
    </div>
  );
};

