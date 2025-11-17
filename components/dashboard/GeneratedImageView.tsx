'use client';

import React from 'react';
import type { GeneratedContent } from '../../types';

interface GeneratedImageViewProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  onBackToConcepts?: () => void;
  onSaveToLibrary?: () => void;
  onStartNewProject?: () => void;
  showBackButton?: boolean;
}

export const GeneratedImageView: React.FC<GeneratedImageViewProps> = ({
  content,
  isLoading,
  onBackToConcepts,
  onSaveToLibrary,
  onStartNewProject,
  showBackButton = false,
}) => {
  const [showFullSize, setShowFullSize] = React.useState(false);

  const handleDownload = () => {
    if (!content) return;
    const link = document.createElement('a');
    const imageSrc = content.image.startsWith('data:') ? content.image : `data:image/png;base64,${content.image}`;
    link.href = imageSrc;
    link.download = 'ai-photoshoot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFullSize = () => {
    setShowFullSize(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/[0.03] rounded-lg p-4">
      <h2 className="font-display text-2xl font-bold text-white mb-4 flex-shrink-0">Generated Output</h2>
      <div className="flex-grow w-full flex flex-col justify-center items-center min-h-0">
        {isLoading ? (
          <div className="text-center text-white/70">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mt-2"></div>
            </div>
            <p className="mt-4 font-semibold text-sm text-white/90">AI is working its magic...</p>
            <p className="text-sm font-normal text-white/60">Generating your photoshoot image...</p>
          </div>
        ) : content ? (
          <div className="w-full h-full flex flex-col gap-4 overflow-hidden">
            <div className="relative w-full bg-black/20 rounded-lg overflow-hidden flex items-center justify-center" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
              <img
                src={content.image.startsWith('data:') ? content.image : `data:image/png;base64,${content.image}`}
                alt="Generated photoshoot"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {showBackButton && onBackToConcepts && (
              <button
                onClick={onBackToConcepts}
                className="px-4 py-2 bg-white/[0.1] text-white/90 rounded-lg border border-white/10 hover:bg-white/[0.15] hover:border-white/20 transition-colors duration-200 text-sm font-semibold"
              >
                Back to Concepts
              </button>
              )}
              <button
                onClick={handleViewFullSize}
                className="px-4 py-2 bg-white/[0.1] text-white/90 rounded-lg border border-white/10 hover:bg-white/[0.15] hover:border-white/20 transition-colors duration-200 text-sm font-semibold"
              >
                View Full Size
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-white/[0.1] text-white/90 rounded-lg border border-white/10 hover:bg-white/[0.15] hover:border-white/20 transition-colors duration-200 text-sm font-semibold"
              >
                Download
              </button>
              {onSaveToLibrary && (
                <button
                  onClick={onSaveToLibrary}
                  className="px-4 py-2 bg-accent text-slate-950 rounded-lg hover:bg-accent-hover transition-colors duration-200 text-sm font-semibold"
                >
                  Save to Library
                </button>
              )}
              {onStartNewProject && (
                <button
                  onClick={onStartNewProject}
                  className="px-4 py-2 bg-white/[0.1] text-white/90 rounded-lg border border-white/10 hover:bg-white/[0.15] hover:border-white/20 transition-colors duration-200 text-sm font-semibold"
                >
                  Start New Project
                </button>
              )}
            </div>
            {showFullSize && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setShowFullSize(false)}
              >
                <button
                  onClick={() => setShowFullSize(false)}
                  className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={content.image.startsWith('data:') ? content.image : `data:image/png;base64,${content.image}`}
                  alt="Generated photoshoot - full size"
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-white/80">Your masterpiece will appear here.</p>
            <p className="text-sm font-normal text-white/50">Upload your images and add a description to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

