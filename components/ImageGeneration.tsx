import React, { useState, useCallback, useMemo } from 'react';
import type { UploadedFile, GeneratedImage, SeductiveCaptions, AdConcept, UserPreferences, ProductAnalysisResult } from '../types';
import { generateConceptsForSelection, orchestrateAdCreation } from '../services/adCreativeOrchestrator';
import { generateCaptions } from '../services/geminiService';
import { saveShot } from '../services/shotLibrary';
import Modal from './Modal';
import { UploadCloudIcon, StarsIcon, DownloadIcon, SlidersHorizontalIcon, CopyIcon, CheckIcon } from '../icons';
import { Card } from './ui/card';
import { Button } from './ui/button';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

// --- SUB-COMPONENTS ---

const Stepper: React.FC<{ current: 0 | 1 | 2 | 3 }> = ({ current }) => {
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

const LiquidFillLoader: React.FC<{ 
    visible: boolean; 
    currentStep: string; 
    progress: number 
}> = ({ visible, currentStep, progress }) => {
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

const InputSection: React.FC<{
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploadedFile: UploadedFile | null;
    onRemoveFile: () => void;
    textDescription: string;
    onTextChange: (text: string) => void;
}> = ({ onFileChange, uploadedFile, onRemoveFile, textDescription, onTextChange }) => {
    return (
        <section className="glass-card grid overflow-hidden rounded-[32px] md:rounded-[42px] bg-black/30 md:grid-cols-[1.25fr_1fr]">
            <div className="relative flex flex-col justify-between gap-4 md:gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="pointer-events-none absolute inset-0 rounded-l-[32px] md:rounded-l-[42px] bg-[radial-gradient(circle_at_top,_rgba(124,208,255,0.12),_transparent_55%)]" />
                <div className="relative z-10 max-w-md space-y-2 md:space-y-4">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">Studio upload</p>
                </div>

                <label
                    htmlFor="file-upload"
                    className="relative z-10 flex h-[200px] sm:h-[250px] md:h-[300px] cursor-pointer flex-col items-center justify-center gap-4 md:gap-6 overflow-hidden rounded-[24px] md:rounded-[30px] border border-dashed border-white/20 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent text-center transition hover:border-white/40 hover:bg-white/[0.08]"
                >
                    {uploadedFile ? (
                        <>
                            <img
                                src={`data:${uploadedFile.type};base64,${uploadedFile.base64}`}
                                alt="Uploaded preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    onRemoveFile();
                                }}
                                className="absolute right-3 top-3 md:right-4 md:top-4 rounded-full bg-black/70 px-3 py-1 md:px-4 text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] md:tracking-[0.35em] text-white transition hover:bg-black/90"
                            >
                                Remove
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-white/20 bg-white/[0.05]">
                                <UploadCloudIcon className="h-6 w-6 md:h-7 md:w-7 text-white/70" />
                            </div>
                            <div className="space-y-1 px-4">
                                <h3 className="text-base md:text-lg font-semibold text-white">Drop imagery or click to upload</h3>
                                <p className="text-xs md:text-sm text-white/55">PNG, JPG up to 10MB. Use reference shots or sketches.</p>
                            </div>
                            <span className="accent-pill text-[10px] md:text-xs">Upload asset</span>
                        </>
                    )}
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                </label>
                {uploadedFile && (
                    <div className="relative z-10 flex items-center justify-between gap-2 rounded-full border border-white/10 bg-black/40 px-4 md:px-5 py-2 text-[10px] md:text-xs text-white/60">
                        <span className="truncate min-w-0">{uploadedFile.name}</span>
                        <span className="flex-shrink-0">{(uploadedFile.base64.length * (3 / 4) / 1024).toFixed(0)} KB</span>
                    </div>
                )}
            </div>

            <div className="border-t border-white/5 bg-black/45 p-4 sm:p-6 md:p-8 lg:p-10 md:border-l md:border-t-0">
                <div className="flex flex-col gap-3 md:gap-4">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">Creative brief</span>
                    <textarea
                        id="text-description"
                        value={textDescription}
                        onChange={(e) => onTextChange(e.target.value)}
                        placeholder="Describe the narrative, lighting, color palette, or campaign moment you're targeting…"
                        rows={10}
                        className="min-h-[200px] md:min-h-[240px] w-full rounded-[20px] md:rounded-[28px] border border-white/10 bg-white/[0.02] px-4 py-4 md:px-6 md:py-5 text-xs md:text-sm text-white/80 placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none break-words"
                    />
                </div>
            </div>
        </section>
    );
};

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

const CarouselConceptSelection: React.FC<{
    concepts: AdConcept[];
    selectedConcept: AdConcept | null;
    onSelectConcept: (concept: AdConcept) => void;
}> = ({ concepts, selectedConcept, onSelectConcept }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Minimum swipe distance (in px) to trigger navigation
    const minSwipeDistance = 50;

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % concepts.length);
    }, [concepts.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
    }, [concepts.length]);

    const goToIndex = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    const currentConcept = concepts[currentIndex];
    const isSelected = selectedConcept?.id === currentConcept?.id;

    if (!currentConcept) return null;

    return (
        <section className="glass-card rounded-[32px] md:rounded-[40px] bg-black/30 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col">
            <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">Concept board</span>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[38px] text-white leading-tight">
                    Select the direction that anchors your campaign narrative.
                </h2>
                {/* <p className="text-xs md:text-sm text-white/65">
                    We synthesize multiple sets built from your brief. Swipe or use arrows to explore.
                </p> */}
            </div>
            
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Previous Button */}
                {concepts.length > 1 && (
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/70 transition hover:bg-black/80 hover:text-white hover:border-white/40"
                        aria-label="Previous concept"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Carousel Content */}
                <div
                    className="w-full max-w-2xl overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {concepts.map((concept) => {
                            const conceptSelected = selectedConcept?.id === concept.id;
                            return (
                                <div key={concept.id} className="w-full flex-shrink-0 px-2">
                                    <Card
                                        onClick={() => onSelectConcept(concept)}
                                        className={`cursor-pointer rounded-[20px] md:rounded-[28px] border-2 p-4 sm:p-5 md:p-6 transition ${
                                            conceptSelected
                                                ? 'border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
                                                : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.06]'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3 md:gap-4">
                                            <div className="space-y-2 min-w-0 flex-1">
                                                <span className="inline-block rounded-full border border-white/10 px-2 py-1 md:px-3 text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/50">
                                                    {concept.adType}
                                                </span>
                                                <h3 className="text-base md:text-lg font-semibold text-white break-words">{concept.title}</h3>
                                                <p className="text-xs md:text-sm text-white/65 break-words">{concept.description}</p>
                                            </div>
                                            <div
                                                className={`flex h-7 w-7 md:h-8 md:w-8 flex-shrink-0 items-center justify-center rounded-full border ${
                                                    conceptSelected ? 'border-accent bg-accent text-slate-950' : 'border-white/10 bg-white/[0.05] text-white/60'
                                                }`}
                                            >
                                                <CheckIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-[10px] md:text-xs text-white/70">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/40">Mood</span>
                                                <span className="text-right break-words">{concept.mood}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/40">Aesthetic</span>
                                                <span className="text-right break-words">{concept.aesthetic}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/40">Model</span>
                                                <span>{concept.modelRequired ? 'Required' : 'Not needed'}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next Button */}
                {concepts.length > 1 && (
                    <button
                        onClick={goToNext}
                        className="absolute right-0 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/70 transition hover:bg-black/80 hover:text-white hover:border-white/40"
                        aria-label="Next concept"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Dot Indicators */}
            {concepts.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 md:mt-6">
                    {concepts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'w-8 bg-accent'
                                    : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Go to concept ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

const ImageResults: React.FC<{
    image: GeneratedImage;
    onGenerateCaptions: (id: string, base64: string) => void;
    onViewImage: () => void;
    onEditColor: (image: GeneratedImage) => void;
    userId?: string;
}> = ({ image, onGenerateCaptions, onViewImage, onEditColor, userId }) => (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 md:gap-6 p-4 md:p-0">
        <div className="group relative aspect-square w-full overflow-hidden rounded-[24px] md:rounded-[40px] border border-white/10 bg-black/30 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
            <img
                src={`data:image/jpeg;base64,${image.base64}`}
                alt={`Generated image`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                style={{ filter: `hue-rotate(${image.hue}deg) saturate(${image.saturation}%)` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 bg-black/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button variant="secondary" onClick={onViewImage} className="rounded-full bg-white/10 px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm">
                    View full
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => onEditColor(image)}
                    className="flex items-center gap-1.5 md:gap-2 rounded-full bg-white/10 px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm"
                >
                    <SlidersHorizontalIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    Adjust tones
                </Button>
            </div>
        </div>
        {userId && (
            <p className="text-xs md:text-sm text-white/55 text-center px-4">
                Hover to access quick actions. This shot will be saved to your Shot Library automatically.
            </p>
        )}
    </div>
);

const GeneratedPromptDisplay: React.FC<{ prompt: string }> = ({ prompt }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(prompt).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <div className="glass-card mx-auto mt-6 md:mt-10 w-full max-w-4xl rounded-[20px] md:rounded-[34px] bg-black/35 p-4 md:p-6">
            <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-sm md:text-base font-semibold text-white">View master prompt</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 md:h-5 md:w-5 text-white/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
            {isExpanded && (
                <div className="mt-3 md:mt-4">
                    <div className="relative">
                        <pre className="max-h-48 md:max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.04] p-3 md:p-4 text-[10px] md:text-xs text-white/70">
                            {prompt}
                        </pre>
                        <button
                            onClick={copyToClipboard}
                            className="absolute right-3 top-3 md:right-4 md:top-4 rounded-full border border-white/10 bg-white/[0.08] p-1.5 md:p-2 text-white transition hover:bg-white/[0.12]"
                            aria-label="Copy prompt"
                        >
                            {isCopied ? (
                                <CheckIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                            ) : (
                                <CopyIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white/70" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
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
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
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
        setGeneratedPrompt(null);
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
            console.error(e);
            setError('Failed to generate concepts. Please check the console for details.');
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
        setGeneratedPrompt(null);
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
            
            // Clear loading states before updating UI
            setIsLoading(false);
            setCurrentStep('');
            setProgress(0);
            
            setGeneratedImage(newImage);
            setGeneratedPrompt(adCreative.prompt);
            setWizardStep(3);

            // Save to Shot Library if userId is provided
            if (userId) {
                console.log('Starting to save shot to library...', { userId, imageId: newImage.id });
                try {
                    await saveShot(userId, newImage);
                    console.log('Shot saved to library successfully');
                    setShowSaveSuccess(true);
                    setTimeout(() => setShowSaveSuccess(false), 3000);
                    onImageSaved?.();
                } catch (saveError) {
                    console.error('Failed to save shot to library:', saveError);
                    setError('Image generated successfully but failed to save to library. Check console for details.');
                }
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate image. Please check the console for details.');
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
            console.error(`Failed to fetch captions for image ${imageId}:`, e);
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
                                        <InputSection
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
                                        <CarouselConceptSelection
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

            {generatedPrompt && wizardStep === 2 && (
                <div className="mx-auto mt-4 w-full max-w-5xl">
                    {/* Keep prompt display below the card for clarity in final step */}
                </div>
            )}

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
