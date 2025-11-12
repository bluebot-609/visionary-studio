'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { UploadedFile, GeneratedImage, SeductiveCaptions, AdConcept, UserPreferences, ProductAnalysisResult } from '../types';
import { generateConceptsForSelection, orchestrateAdCreation, generateCaptions } from '../services/aiClient';
import { saveShot } from '../services/shotLibrary';
import Modal from './Modal';
import { DownloadIcon, StarsIcon, SlidersHorizontalIcon } from '../icons';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Stepper,
  LiquidFillLoader,
  ImageUpload,
  ConceptSelection,
  ImageResults,
} from './image-generation';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

// --- SUB-COMPONENTS (Extracted to ./image-generation/) ---
// Stepper, LiquidFillLoader, ImageUpload, ConceptSelection, ImageResults are now in separate files

const PreferencesPanel: React.FC<{
    preferences: UserPreferences;
    onPreferencesChange: (prefs: UserPreferences) => void;
}> = ({ preferences, onPreferencesChange }) => {
    const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
        onPreferencesChange({ ...preferences, [key]: value });
    };
    
    return (
        <section className="glass-card rounded-[32px] md:rounded-[42px] bg-black/35 p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col gap-2 md:gap-3">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">Creative system</span>
                <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
                    <span className="rounded-full border border-white/10 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/50">
                        Optional controls
                    </span>
                </div>
            </div>

            <div className="mt-6 md:mt-10 grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3">
                {[
                    {
                        key: 'modelPreference' as const,
                        label: 'Model presence',
                        options: [
                            { value: 'let-ai-decide', label: 'Let AI decide' },
                            { value: 'with-model', label: 'With model' },
                            { value: 'product-only', label: 'Product only' },
                            { value: 'hybrid', label: 'Hands / hybrid' },
                        ],
                    },
                    {
                        key: 'aestheticStyle' as const,
                        label: 'Aesthetic energy',
                        options: [
                            { value: 'let-ai-decide', label: 'Let AI decide' },
                            { value: 'luxurious', label: 'Luxurious' },
                            { value: 'minimalist', label: 'Minimalist' },
                            { value: 'energetic', label: 'Energetic' },
                            { value: 'calm', label: 'Calm' },
                            { value: 'mysterious', label: 'Mysterious' },
                            { value: 'joyful', label: 'Joyful' },
                        ],
                    },
                    {
                        key: 'styleDirection' as const,
                        label: 'Style direction',
                        options: [
                            { value: 'let-ai-decide', label: 'Let AI decide' },
                            { value: 'modern', label: 'Modern' },
                            { value: 'classic', label: 'Classic' },
                            { value: 'edgy', label: 'Edgy' },
                            { value: 'soft', label: 'Soft' },
                        ],
                    },
                ].map((group) => (
                    <div key={group.key} className="space-y-3 md:space-y-4 rounded-[20px] md:rounded-[28px] border border-white/10 bg-white/[0.02] p-4 md:p-6">
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">{group.label}</span>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {group.options.map((option) => {
                                const isSelected =
                                    (preferences[group.key] ?? 'let-ai-decide') === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            updatePreference(group.key, option.value as UserPreferences[typeof group.key])
                                        }
                                        className={`rounded-full border px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm transition whitespace-nowrap ${
                                            isSelected
                                                ? 'border-accent bg-accent/20 text-accent'
                                                : 'border-white/15 bg-transparent text-white/70 hover:border-white/35 hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Main Component
interface ImageGenerationProps {
    userId?: string;
    onImageSaved?: () => void;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ userId, onImageSaved }) => {
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [textDescription, setTextDescription] = useState<string>('');
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
    const [concepts, setConcepts] = useState<AdConcept[]>([]);
    const [selectedConcept, setSelectedConcept] = useState<AdConcept | null>(null);
    const [productAnalysis, setProductAnalysis] = useState<ProductAnalysisResult | null>(null);
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingConcepts, setIsGeneratingConcepts] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '9:16' | '16:9'>('1:1');
    const [wizardStep, setWizardStep] = useState<0 | 1 | 2 | 3>(0);
    
    const [isViewingImage, setIsViewingImage] = useState<boolean>(false);
    const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
    const [tempColorAdjust, setTempColorAdjust] = useState({ hue: 0, saturation: 100 });
    const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

    const resetProject = () => {
        setUploadedFile(null);
        setTextDescription('');
        setUserPreferences({});
        setConcepts([]);
        setSelectedConcept(null);
        setProductAnalysis(null);
        setGeneratedImage(null);
        setError(null);
        setCurrentStep('');
        setProgress(0);
        setAspectRatio('1:1');
        setWizardStep(0);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setUploadedFile({
                name: file.name,
                type: file.type,
                base64: base64,
            });
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleGenerateConcepts = async () => {
        if (!uploadedFile && !textDescription.trim()) {
            setError('Please provide either an image or text description (or both).');
            return;
        }

        setIsGeneratingConcepts(true);
        setError(null);
        setConcepts([]);
        setSelectedConcept(null);
        setCurrentStep('Analyzing product...');
        setProgress(0);

        try {
            const result = await generateConceptsForSelection(
                {
                    imageFile: uploadedFile || undefined,
                    textDescription: textDescription.trim() || undefined,
                    userPreferences,
                    aspectRatio,
                },
                (step, progressValue) => {
                    setCurrentStep(step);
                    setProgress(progressValue);
                }
            );

            setProductAnalysis(result.productAnalysis);
            setConcepts(result.concepts);
            setWizardStep(2);
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e);
            }
            setError('Failed to generate concepts. Please try again.');
        } finally {
            setIsGeneratingConcepts(false);
            setCurrentStep('');
            setProgress(0);
        }
    };

    const handleGenerateFinal = async () => {
        if (!selectedConcept || !productAnalysis) {
            setError('Please select a concept first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setCurrentStep('Initializing...');
        setProgress(0);

        try {
            const adCreative = await orchestrateAdCreation(
                {
                    imageFile: uploadedFile || undefined,
                    textDescription: textDescription.trim() || undefined,
                    userPreferences,
                    selectedConcept,
                    aspectRatio,
                },
                productAnalysis,
                selectedConcept,
                (step, progressValue) => {
                    setCurrentStep(step);
                    setProgress(progressValue);
                }
            );

            const newImage: GeneratedImage = {
                id: adCreative.id,
                base64: adCreative.base64,
                captions: null,
                hue: 0,
                saturation: 100,
            };
            
            setGeneratedImage(newImage);
            setWizardStep(3);

            // Save to Shot Library if userId is provided
            if (userId) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('Starting to save shot to library...', { userId, imageId: newImage.id });
                }
                try {
                    await saveShot(userId, newImage);
                    if (process.env.NODE_ENV === 'development') {
                        console.log('Shot saved to library successfully');
                    }
                    setShowSaveSuccess(true);
                    setTimeout(() => setShowSaveSuccess(false), 3000);
                    onImageSaved?.();
                } catch (saveError) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('Failed to save shot to library:', saveError);
                    }
                    setError('Image generated successfully but failed to save to library.');
                }
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e);
            }
            setError('Failed to generate image. Please try again.');
        } finally {
            // Clear loading states after all operations complete
            setIsLoading(false);
            setCurrentStep('');
            setProgress(0);
        }
    };

    const fetchCaptions = useCallback(async (imageId: string, imageBase64: string) => {
        try {
            const captions = await generateCaptions(imageBase64);
            if(captions){
                setGeneratedImage(prev => 
                    prev && prev.id === imageId ? { ...prev, captions } : prev
                );
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(`Failed to fetch captions for image ${imageId}:`, e);
            }
        }
    }, []);
    
    const handleOpenColorEditor = (image: GeneratedImage) => {
        setEditingImage(image);
        setTempColorAdjust({ hue: image.hue, saturation: image.saturation });
    };

    const handleSaveColorAdjust = () => {
        if (!editingImage) return;
        setGeneratedImage(prev => 
            prev && prev.id === editingImage.id ? { ...prev, ...tempColorAdjust } : prev
        );
        setEditingImage(null);
    };

    const viewingImage = isViewingImage ? generatedImage : null;

    const canvasAspectStyle = useMemo(() => {
        const map: Record<typeof aspectRatio, string> = {
            '1:1': '1 / 1',
            '3:4': '3 / 4',
            '9:16': '9 / 16',
            '16:9': '16 / 9',
        };
        return { aspectRatio: map[aspectRatio] };
    }, [aspectRatio]);

    return (
        <div className="relative">
            <Card className="relative mx-auto flex w-full max-w-5xl flex-col rounded-[24px] md:rounded-[32px] border-white/10 bg-black/35 p-0 overflow-hidden max-h-[90vh]">
                <div className="flex-shrink-0 flex items-center justify-between border-b border-white/5 px-4 py-4 md:px-8 md:py-6">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-white/[0.06] text-xs md:text-sm font-semibold">
                            VS
                        </div>
                        <button
                            onClick={resetProject}
                            className="rounded-full border border-white/10 px-2 py-1 md:px-3 text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/70 hover:border-white/30 hover:bg-white/[0.06]"
                        >
                            New Project
                        </button>
                    </div>
                    <Stepper current={wizardStep} />
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-4xl">
                        {/* Content area */}
                        <div className="relative w-full">
                            <div className="relative">
                                {/* Liquid fill loading indicator */}
                                <LiquidFillLoader
                                    visible={(isGeneratingConcepts || isLoading) && !!currentStep}
                                    currentStep={currentStep || 'Processing...'}
                                    progress={progress}
                                />
                                {/* Step 1: Input (Image + Brief) */}
                                {wizardStep === 0 && (
                                    <div className="space-y-4 md:space-y-6">
                                        <ImageUpload
                                            onFileChange={handleFileChange}
                                            uploadedFile={uploadedFile}
                                            onRemoveFile={handleRemoveFile}
                                            textDescription={textDescription}
                                            onTextChange={setTextDescription}
                                        />
                                        <div className="flex items-center justify-end gap-2 md:gap-3 pt-4 border-t border-white/5">
                                            <Button
                                                variant="secondary"
                                                onClick={resetProject}
                                                className="rounded-full text-xs md:text-sm px-3 md:px-4"
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={() => setWizardStep(1)}
                                                className="flex items-center gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Aspect ratio + Optional controls */}
                                {wizardStep === 1 && (
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] p-3 md:p-4">
                                            <div className="mb-2 md:mb-3 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/40">Aspect ratio</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(['1:1','3:4','9:16','16:9'] as const).map((r) => {
                                                    const selected = r === aspectRatio;
                                                    return (
                                                        <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() => setAspectRatio(r)}
                                                            className={`rounded-full border px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm ${selected ? 'border-accent bg-accent/20 text-accent' : 'border-white/15 text-white/70 hover:border-white/35 hover:bg-white/[0.06]'}`}
                                                        >
                                                            {r}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="mt-2 md:mt-3 text-[10px] md:text-xs text-white/50">Used directly for rendering. 1:1 is default.</p>
                                        </div>
                                        <PreferencesPanel
                                            preferences={userPreferences}
                                            onPreferencesChange={setUserPreferences}
                                        />
                                        <div className="flex items-center justify-between gap-2 md:gap-3 pt-4 border-t border-white/5">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setWizardStep(0)}
                                                className="rounded-full text-xs md:text-sm px-3 md:px-4"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={handleGenerateConcepts}
                                                disabled={isGeneratingConcepts || (!uploadedFile && !textDescription.trim())}
                                                className="flex items-center gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm"
                                            >
                                                {isGeneratingConcepts ? 'Generating concepts…' : 'Generate concepts'}
                                                <StarsIcon className="h-4 w-4 md:h-5 md:w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Ideas */}
                                {wizardStep === 2 && (
                                    <div className="space-y-4 md:space-y-6">
                                        <ConceptSelection
                                            concepts={concepts}
                                            selectedConcept={selectedConcept}
                                            onSelectConcept={setSelectedConcept}
                                        />
                                        <div className="flex items-center justify-between gap-2 md:gap-3 pt-4 border-t border-white/5">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setWizardStep(1)}
                                                className="rounded-full text-xs md:text-sm px-3 md:px-4"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={handleGenerateFinal}
                                                disabled={isLoading || !selectedConcept}
                                                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm text-slate-950 hover:bg-white/90"
                                            >
                                                {isLoading ? 'Generating…' : 'Generate'}
                                                <StarsIcon className="h-4 w-4 md:h-5 md:w-5 text-slate-950" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Final */}
                                {wizardStep === 3 && (
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="mx-auto w-full max-w-3xl">
                                            <div className="relative overflow-hidden rounded-[20px] md:rounded-[28px] border border-white/10 bg-black/30">
                                                <div className="w-full" style={canvasAspectStyle}>
                                                    {generatedImage ? (
                                                        <ImageResults
                                                            image={generatedImage}
                                                            onGenerateCaptions={fetchCaptions}
                                                            onViewImage={() => setIsViewingImage(true)}
                                                            onEditColor={handleOpenColorEditor}
                                                            userId={userId}
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-white/50">
                                                            Waiting for generation…
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 md:gap-3 pt-4 border-t border-white/5">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setWizardStep(2)}
                                                className="rounded-full text-xs md:text-sm px-3 md:px-4"
                                            >
                                                Back
                                            </Button>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        if (!generatedImage) return;
                                                        const link = document.createElement('a');
                                                        link.href = `data:image/jpeg;base64,${generatedImage.base64}`;
                                                        link.download = `visionary-ai-image-${generatedImage.id}.jpg`;
                                                        link.click();
                                                    }}
                                                    className="flex items-center gap-1.5 md:gap-2 rounded-full text-xs md:text-sm px-3 md:px-4"
                                                >
                                                    <DownloadIcon className="h-3.5 w-3.5 md:h-4 md:w-4" /> Download
                                                </Button>
                                                <Button onClick={resetProject} className="rounded-full text-xs md:text-sm px-3 md:px-4">
                                                    New Project
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error || showSaveSuccess ? (
                    <div className="flex-shrink-0 px-4 pb-4 md:px-8 md:pb-6 space-y-3">
                        {error && (
                            <div className="rounded-[20px] md:rounded-[30px] border border-red-500/30 bg-red-500/10 px-4 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm text-red-200">
                                {error}
                            </div>
                        )}
                        {showSaveSuccess && (
                            <div className="rounded-[20px] md:rounded-[30px] border border-accent/30 bg-accent/10 px-4 py-3 md:px-6 md:py-4 text-center text-xs md:text-sm text-accent">
                                ✓ Shot saved to library successfully
                            </div>
                        )}
                    </div>
                ) : null}
            </Card>


            {editingImage && (
                <Modal isOpen={!!editingImage} onClose={() => setEditingImage(null)} title="Adjust Color Toning">
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-center">
                            <img
                                src={`data:image/jpeg;base64,${editingImage.base64}`}
                                alt="Color editing preview"
                                className="h-48 w-48 md:h-60 md:w-60 rounded-2xl md:rounded-3xl border border-white/10 object-cover"
                                style={{ filter: `hue-rotate(${tempColorAdjust.hue}deg) saturate(${tempColorAdjust.saturation}%)` }}
                            />
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <label className="flex justify-between text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] text-white/50">
                                    <span>Hue</span>
                                    <span>{tempColorAdjust.hue}°</span>
                                </label>
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={tempColorAdjust.hue}
                                    onChange={(e) =>
                                        setTempColorAdjust((p) => ({ ...p, hue: parseInt(e.target.value, 10) }))
                                    }
                                    className="mt-2 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-accent"
                                />
                            </div>
                            <div>
                                <label className="flex justify-between text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] text-white/50">
                                    <span>Saturation</span>
                                    <span>{tempColorAdjust.saturation}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={tempColorAdjust.saturation}
                                    onChange={(e) =>
                                        setTempColorAdjust((p) => ({ ...p, saturation: parseInt(e.target.value, 10) }))
                                    }
                                    className="mt-2 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-accent"
                                />
                            </div>
                        </div>
                        <Button className="w-full rounded-full text-xs md:text-sm" onClick={handleSaveColorAdjust}>
                            Save adjustments
                        </Button>
                    </div>
                </Modal>
            )}

            {viewingImage && (
                <Modal isOpen={isViewingImage} onClose={() => setIsViewingImage(false)} title="Image Preview" size="3xl">
                    <div className="space-y-3 md:space-y-4">
                        <img 
                            src={`data:image/jpeg;base64,${viewingImage.base64}`} 
                            alt="Preview" 
                            className="w-full h-auto rounded-lg md:rounded-xl object-contain max-h-[70vh] md:max-h-[80vh]"
                            style={{ filter: `hue-rotate(${viewingImage.hue}deg) saturate(${viewingImage.saturation}%)` }}
                        />
                        {viewingImage.captions && (
                             <div className="max-h-40 md:max-h-48 space-y-1.5 md:space-y-2 overflow-y-auto rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.05] p-3 md:p-4 text-xs md:text-sm text-white/80">
                                <p><strong className="text-accent">EN:</strong> {viewingImage.captions.english}</p>
                                <p><strong className="text-accent">HI:</strong> {viewingImage.captions.hindi}</p>
                                <p><strong className="text-accent">Hinglish:</strong> {viewingImage.captions.hinglish}</p>
                                <hr className="my-1.5 md:my-2 border-white/10" />
                                <p><strong className="text-white/70">Seductive EN:</strong> {(viewingImage.captions as SeductiveCaptions).seductiveEnglish}</p>
                                <p><strong className="text-white/70">Seductive HI:</strong> {(viewingImage.captions as SeductiveCaptions).seductiveHindi}</p>
                                <p><strong className="text-white/70">Seductive Hinglish:</strong> {(viewingImage.captions as SeductiveCaptions).seductiveHinglish}</p>
                             </div>
                        )}
                        <div className="flex items-center justify-center pt-2 md:pt-3">
                             <Button onClick={() => {
                                 const link = document.createElement('a');
                                 link.href = `data:image/jpeg;base64,${viewingImage.base64}`;
                                 link.download = `visionary-ai-image-${viewingImage.id}.jpg`;
                                 link.click();
                             }} className="flex items-center gap-1.5 md:gap-2 rounded-full bg-accent px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm text-slate-950 hover:bg-accent-hover">
                                 <DownloadIcon className="h-3.5 w-3.5 md:h-4 md:w-4" /> Download
                             </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ImageGeneration;
