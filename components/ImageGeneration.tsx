import React, { useState, useCallback } from 'react';
import type { UploadedFile, GeneratedImage, SeductiveCaptions, AdConcept, UserPreferences, ProductAnalysisResult } from '../types';
import { generateConceptsForSelection, orchestrateAdCreation } from '../services/adCreativeOrchestrator';
import { generateCaptions } from '../services/geminiService';
import Modal from './Modal';
import { UploadCloudIcon, StarsIcon, DownloadIcon, SlidersHorizontalIcon, CopyIcon, CheckIcon } from '../icons';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

// --- SUB-COMPONENTS ---

const InputSection: React.FC<{
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploadedFile: UploadedFile | null;
    onRemoveFile: () => void;
    textDescription: string;
    onTextChange: (text: string) => void;
}> = ({ onFileChange, uploadedFile, onRemoveFile, textDescription, onTextChange }) => {
        return (
        <div className="space-y-6">
            <div className="text-center bg-[#1a1a1a] p-8 rounded-xl border border-slate-800 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">What would you like to create?</h2>
                <p className="text-gray-400 mb-6">Provide an image, text description, or both</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="text-description" className="block text-sm font-medium text-gray-400 mb-2 text-left">
                            Product Description (Optional)
                        </label>
                        <textarea
                            id="text-description"
                            value={textDescription}
                            onChange={(e) => onTextChange(e.target.value)}
                            placeholder="Describe the product or scene you want to create..."
                            rows={3}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-gray-500"
                        />
                    </div>

                    {uploadedFile ? (
                        <div className="text-center bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-lg font-bold text-gray-100 mb-4">Reference Image</h3>
                <div className="relative inline-block">
                    <img 
                        src={`data:${uploadedFile.type};base64,${uploadedFile.base64}`} 
                        alt="Uploaded preview" 
                        className="max-h-64 w-auto mx-auto rounded-lg shadow-lg"
                    />
                    <button 
                        onClick={onRemoveFile} 
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 leading-none hover:bg-red-700 transition-colors shadow-md"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 flex justify-center items-center gap-4">
                    <p className="text-sm text-gray-400 truncate max-w-[200px]">{uploadedFile.name}</p>
                    <label htmlFor="file-upload" className="cursor-pointer text-sm font-semibold text-sky-500 hover:text-sky-400 transition-colors">
                        Change Image
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                    </label>
                </div>
            </div>
                    ) : (
                        <div className="text-center bg-slate-800 p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-sky-500 transition-colors">
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <UploadCloudIcon className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                                <h3 className="text-lg font-bold text-gray-100 mb-2">Upload Reference Image (Optional)</h3>
                                <p className="text-gray-400 text-sm">An optional starting point for the AI</p>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
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
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-gray-100 mb-4">Personalize Your Ad (Optional)</h3>
            <p className="text-sm text-gray-400 mb-4">These preferences guide the AI - you can still choose from generated concepts</p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Model Presence</label>
                        <select
                        value={preferences.modelPreference || 'let-ai-decide'}
                        onChange={(e) => updatePreference('modelPreference', e.target.value as UserPreferences['modelPreference'])}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        >
                        <option value="let-ai-decide">Let AI Decide</option>
                        <option value="with-model">With Model/Person</option>
                        <option value="product-only">Product Only</option>
                        <option value="hybrid">Hybrid (Hands/Partial)</option>
                        </select>
                    </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Aesthetic Style</label>
                    <select
                        value={preferences.aestheticStyle || 'let-ai-decide'}
                        onChange={(e) => updatePreference('aestheticStyle', e.target.value as UserPreferences['aestheticStyle'])}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    >
                        <option value="let-ai-decide">Let AI Decide</option>
                        <option value="luxurious">Luxurious</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="energetic">Energetic</option>
                        <option value="calm">Calm</option>
                        <option value="mysterious">Mysterious</option>
                        <option value="joyful">Joyful</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Style Direction</label>
                    <select
                        value={preferences.styleDirection || 'let-ai-decide'}
                        onChange={(e) => updatePreference('styleDirection', e.target.value as UserPreferences['styleDirection'])}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    >
                        <option value="let-ai-decide">Let AI Decide</option>
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="edgy">Edgy</option>
                        <option value="soft">Soft</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const ConceptSelection: React.FC<{
    concepts: AdConcept[];
    selectedConcept: AdConcept | null;
    onSelectConcept: (concept: AdConcept) => void;
}> = ({ concepts, selectedConcept, onSelectConcept }) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Choose Your Ad Concept</h2>
                <p className="text-gray-400">Select the concept that best matches your vision</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
                {concepts.map((concept) => (
                    <div
                        key={concept.id}
                        onClick={() => onSelectConcept(concept)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedConcept?.id === concept.id
                                ? 'border-sky-500 bg-sky-500/10'
                                : 'border-slate-700 bg-[#1a1a1a] hover:border-slate-600'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-100">{concept.title}</h3>
                            {selectedConcept?.id === concept.id && (
                                <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                                    <CheckIcon className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{concept.description}</p>
                        
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Mood:</span>
                                <span className="text-gray-300">{concept.mood}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Style:</span>
                                <span className="text-gray-300">{concept.aesthetic}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Model:</span>
                                <span className="text-gray-300">{concept.modelRequired ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-slate-800 rounded-md">
                            <p className="text-xs text-gray-400 italic">{concept.visualDescription}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AgentProgressIndicator: React.FC<{ currentStep: string; progress: number }> = ({ currentStep, progress }) => {
    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">{currentStep}</span>
                <span className="text-sm font-medium text-sky-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                    className="bg-gradient-to-r from-sky-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500"></div>
    </div>
);

const ImageResults: React.FC<{
    image: GeneratedImage;
    onGenerateCaptions: (id: string, base64: string) => void;
    onViewImage: () => void;
    onEditColor: (image: GeneratedImage) => void;
}> = ({ image, onGenerateCaptions, onViewImage, onEditColor }) => (
    <div className="flex justify-center">
        <div key={image.id} className="group relative rounded-lg overflow-hidden border border-slate-800 aspect-square w-full max-w-lg">
            <img
                src={`data:image/jpeg;base64,${image.base64}`}
                alt={`Generated image`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{ filter: `hue-rotate(${image.hue}deg) saturate(${image.saturation}%)` }}
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-2">
                <button onClick={onViewImage} className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full hover:bg-sky-500 transition-colors">View</button>
                <button onClick={() => onGenerateCaptions(image.id, image.base64)} disabled={!!image.captions} className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-sky-500 transition-colors">{image.captions ? 'Captions Ready' : 'Get Captions'}</button>
                <button onClick={() => onEditColor(image)} className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full flex items-center gap-1 hover:bg-sky-500 transition-colors"><SlidersHorizontalIcon className="w-4 h-4" /> Adjust</button>
            </div>
        </div>
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
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-slate-800 shadow-sm mt-4 max-w-lg mx-auto">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <h3 className="text-lg font-bold text-gray-200">View Generation Prompt</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </div>
            {isExpanded && (
                <div className="mt-4">
                    <div className="relative">
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap bg-slate-800 p-3 rounded-md font-mono max-h-60 overflow-y-auto">
                            {prompt}
                        </pre>
                        <button 
                            onClick={copyToClipboard}
                            className="absolute top-2 right-2 p-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors"
                            aria-label="Copy prompt"
                        >
                            {isCopied ? 
                                <CheckIcon className="w-4 h-4 text-green-400" /> : 
                                <CopyIcon className="w-4 h-4 text-gray-300" />
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Component
const ImageGeneration: React.FC = () => {
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
    
    const [isViewingImage, setIsViewingImage] = useState<boolean>(false);
    const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
    const [tempColorAdjust, setTempColorAdjust] = useState({ hue: 0, saturation: 100 });

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
                },
                (step, progressValue) => {
                    setCurrentStep(step);
                    setProgress(progressValue);
                }
            );

            setProductAnalysis(result.productAnalysis);
            setConcepts(result.concepts);
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
            setGeneratedPrompt(adCreative.prompt);
        } catch (e) {
            console.error(e);
            setError('Failed to generate image. Please check the console for details.');
        } finally {
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

    return (
        <div className="space-y-12">
            <InputSection 
                onFileChange={handleFileChange} 
                uploadedFile={uploadedFile} 
                onRemoveFile={handleRemoveFile}
                textDescription={textDescription}
                onTextChange={setTextDescription}
            />

            <PreferencesPanel 
                preferences={userPreferences}
                onPreferencesChange={setUserPreferences}
            />
            
            <div className="text-center">
                <button
                    onClick={handleGenerateConcepts}
                    disabled={isGeneratingConcepts || (!uploadedFile && !textDescription.trim())}
                    className="bg-sky-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-sky-600 hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                    {isGeneratingConcepts ? 'Generating Concepts...' : 'Generate Concepts'}
                    <StarsIcon className="w-5 h-5"/>
                </button>
            </div>
            
            {isGeneratingConcepts && currentStep && (
                <AgentProgressIndicator currentStep={currentStep} progress={progress} />
            )}
            
            {concepts.length > 0 && (
                <ConceptSelection 
                    concepts={concepts}
                    selectedConcept={selectedConcept}
                    onSelectConcept={setSelectedConcept}
                />
            )}

            {selectedConcept && (
                <div className="text-center">
                    <button
                        onClick={handleGenerateFinal}
                        disabled={isLoading}
                        className="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-600 hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                        {isLoading ? 'Generating...' : 'Generate Final Ad Creative'}
                        <StarsIcon className="w-5 h-5"/>
                    </button>
                </div>
            )}

            {isLoading && currentStep && (
                <AgentProgressIndicator currentStep={currentStep} progress={progress} />
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {generatedImage && (
                <div>
                    <ImageResults 
                        image={generatedImage} 
                        onGenerateCaptions={fetchCaptions}
                        onViewImage={() => setIsViewingImage(true)}
                        onEditColor={handleOpenColorEditor}
                    />
                    {generatedPrompt && <GeneratedPromptDisplay prompt={generatedPrompt} />}
                </div>
            )}

            {editingImage && (
                <Modal isOpen={!!editingImage} onClose={() => setEditingImage(null)} title="Adjust Image Colors">
                    <div className="space-y-4">
                        <div className="flex justify-center">
                           <img 
                                src={`data:image/jpeg;base64,${editingImage.base64}`} 
                                alt="Color editing preview" 
                                className="w-60 h-60 rounded-lg object-cover border-2 border-slate-700" 
                                style={{ filter: `hue-rotate(${tempColorAdjust.hue}deg) saturate(${tempColorAdjust.saturation}%)` }}
                            />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-gray-400 flex justify-between"><span>Hue</span><span>{tempColorAdjust.hue}°</span></label>
                                <input type="range" min="-180" max="180" value={tempColorAdjust.hue} onChange={(e) => setTempColorAdjust(p => ({...p, hue: parseInt(e.target.value)}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 flex justify-between"><span>Saturation</span><span>{tempColorAdjust.saturation}%</span></label>
                                <input type="range" min="0" max="200" value={tempColorAdjust.saturation} onChange={(e) => setTempColorAdjust(p => ({...p, saturation: parseInt(e.target.value)}))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                            </div>
                        </div>
                        <button onClick={handleSaveColorAdjust} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            Save Changes
                        </button>
                    </div>
                </Modal>
            )}

            {viewingImage && (
                <Modal isOpen={isViewingImage} onClose={() => setIsViewingImage(false)} title="Image Preview" size="3xl">
                    <div className="space-y-4">
                        <img 
                            src={`data:image/jpeg;base64,${viewingImage.base64}`} 
                            alt="Preview" 
                            className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
                            style={{ filter: `hue-rotate(${viewingImage.hue}deg) saturate(${viewingImage.saturation}%)` }}
                        />
                        {viewingImage.captions && (
                             <div className="text-sm bg-slate-800 p-3 rounded-md space-y-2 max-h-40 overflow-y-auto">
                                <p><strong className="text-sky-400">EN:</strong> {viewingImage.captions.english}</p>
                                <p><strong className="text-sky-400">HI:</strong> {viewingImage.captions.hindi}</p>
                                <p><strong className="text-sky-400">Hinglish:</strong> {viewingImage.captions.hinglish}</p>
                                <hr className="border-slate-700 my-2" />
                                <p><strong className="text-teal-400">Seductive EN:</strong> {(viewingImage.captions as SeductiveCaptions).seductiveEnglish}</p>
                                <p><strong className="text-teal-400">Seductive HI:</strong> {(viewingImage.captions as SeductiveCaptions).seductiveHindi}</p>
                                <p><strong className="text-teal-400">Seductive Hinglish:</strong> {(viewingImage.captions as SeductiveCaptions).seductiveHinglish}</p>
                             </div>
                        )}
                        <div className="flex justify-center items-center pt-2">
                             <button onClick={() => {
                                 const link = document.createElement('a');
                                 link.href = `data:image/jpeg;base64,${viewingImage.base64}`;
                                 link.download = `visionary-ai-image-${viewingImage.id}.jpg`;
                                 link.click();
                             }} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors"><DownloadIcon className="w-4 h-4"/> Download</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ImageGeneration;
