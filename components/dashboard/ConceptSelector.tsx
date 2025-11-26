'use client';

import React from 'react';
import type { CreativeConcept } from '../../types';

interface ConceptSelectorProps {
  concepts: CreativeConcept[];
  selectedConcept: CreativeConcept | null;
  onSelectConcept: (concept: CreativeConcept) => void;
  onGenerateFromConcept: () => void;
  isLoading?: boolean;
  isGenerating?: boolean;
  isProMode?: boolean;
}

export const ConceptSelector: React.FC<ConceptSelectorProps> = ({
  concepts,
  selectedConcept,
  onSelectConcept,
  onGenerateFromConcept,
  isLoading = false,
  isGenerating = false,
  isProMode = false,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/10 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
        <p className="mt-4 font-semibold text-sm text-white/80">Brainstorming creative concepts...</p>
        <p className="text-sm font-normal text-white/50">The AI is acting as your creative director.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="font-display text-2xl font-bold text-white mb-4 flex-shrink-0">Choose a Creative Direction</h2>
      <div className="flex-grow grid grid-cols-1 gap-3 overflow-y-auto pr-1">
        {concepts.map((concept, index) => {
          const isSelected = selectedConcept?.title === concept.title;
          return (
            <div
              key={index}
              className={`bg-white/[0.05] p-4 rounded-lg border shadow-sm transition-all duration-300 flex flex-col cursor-pointer ${
                isSelected
                  ? 'border-accent shadow-lg ring-1 ring-accent'
                  : 'border-white/10 hover:shadow-lg hover:border-white/20'
              }`}
              onClick={() => onSelectConcept(concept)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectConcept(concept);
                }
              }}
            >
              <h3 className={`text-base font-bold ${isSelected ? 'text-accent' : 'text-white/90'}`}>{concept.title}</h3>
              <p className="text-sm font-normal text-white/70 mt-1.5 flex-grow">
                <strong className="font-semibold text-white/90">Scene:</strong> {concept.scene_description}
              </p>
              <div className="text-xs font-normal text-white/60 mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-x-3 gap-y-1">
                <span><strong className="font-semibold text-white/80">Lighting:</strong> {concept.lighting}</span>
                <span><strong className="font-semibold text-white/80">Arrangement:</strong> {concept.product_arrangement}</span>
                <span className="col-span-2"><strong className="font-semibold text-white/80">Mood:</strong> {concept.mood}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Single Generate Image button at bottom */}
      <div className="flex-shrink-0 pt-4 border-t border-white/10 mt-4">
        <button
          onClick={onGenerateFromConcept}
          disabled={!selectedConcept || isGenerating}
          className="w-full bg-accent text-slate-950 font-bold text-sm py-2.5 px-4 rounded-lg hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent/30 disabled:bg-white/20 disabled:cursor-not-allowed disabled:text-white/50 transition-all duration-200 flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              {isProMode && <span className="mr-2">✨</span>}
              {isProMode ? 'Generate with Pro' : 'Generate Image'}
            </>
          )}
        </button>
        <p className="text-xs font-normal text-white/50 mt-2 text-center">
          {selectedConcept ? `Selected: "${selectedConcept.title}"` : 'Select a concept above to generate'}
        </p>
      </div>
    </div>
  );
};
