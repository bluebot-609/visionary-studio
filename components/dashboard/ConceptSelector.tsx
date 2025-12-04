'use client';

import React, { useState } from 'react';
import type { CreativeConcept } from '../../types';
import Modal from '../Modal';

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
  const [selectedCardForDetails, setSelectedCardForDetails] = useState<number | null>(null);

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
      <div className="flex-grow grid grid-cols-1 gap-2 overflow-y-auto pr-1">
        {concepts.map((concept, index) => {
          const isSelected = selectedConcept?.title === concept.title;
          
          return (
            <div
              key={index}
              className={`bg-white/[0.05] px-3 py-2.5 rounded-lg border shadow-sm transition-all duration-300 cursor-pointer ${
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
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`text-xl font-bold flex-grow ${isSelected ? 'text-accent' : 'text-white'}`}>
                  {concept.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCardForDetails(index);
                  }}
                  className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                  aria-label="Show details"
                  title="Show details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Technical Details Section: Grid Layout */}
              <div className="mt-2 pt-3 border-t border-white/10 bg-white/[0.03] -mx-3 px-3 pb-2.5 rounded-b-lg">
                <div className="grid grid-cols-3 gap-3">
                  {/* Mood */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3 w-3 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      <span className="text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">
                        Mood
                      </span>
                    </div>
                    <div className="bg-white/10 rounded px-2 py-1">
                      <span className="text-xs font-bold text-white/90">{concept.mood_summary || concept.mood}</span>
                    </div>
                    {concept.mood_bullets && concept.mood_bullets.length > 0 ? (
                      <ul className="text-[0.7rem] text-white/60 leading-tight space-y-0.5 list-none">
                        {concept.mood_bullets.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/40 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : concept.mood ? (
                      <ul className="text-[0.7rem] text-white/60 leading-tight space-y-0.5 list-none">
                        {concept.mood.split(/[.,;]/).filter(p => p.trim().length > 0).slice(0, 3).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/40 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{point.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  
                  {/* Lighting */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3 w-3 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                      </svg>
                      <span className="text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">
                        Lighting
                      </span>
                    </div>
                    <div className="bg-white/10 rounded px-2 py-1">
                      <span className="text-xs font-bold text-white/90">{concept.lighting_summary || concept.lighting}</span>
                    </div>
                    {concept.lighting_bullets && concept.lighting_bullets.length > 0 ? (
                      <ul className="text-[0.7rem] text-white/60 leading-tight space-y-0.5 list-none">
                        {concept.lighting_bullets.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/40 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : concept.lighting ? (
                      <ul className="text-[0.7rem] text-white/60 leading-tight space-y-0.5 list-none">
                        {concept.lighting.split(/[.,;]/).filter(p => p.trim().length > 0).slice(0, 3).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/40 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{point.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  
                  {/* Product Arrangement */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3 w-3 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                      <span className="text-[0.75rem] font-bold text-white/50 uppercase tracking-wide">
                        Layout
                      </span>
                    </div>
                    <div className="bg-white/10 rounded px-2 py-1">
                      <span className="text-xs font-bold text-white/90">
                        {concept.arrangement_summary || concept.product_arrangement.split('.')[0] || concept.product_arrangement.substring(0, 30)}
                      </span>
                    </div>
                    {concept.arrangement_bullets && concept.arrangement_bullets.length > 0 ? (
                      <ul className="text-[0.7rem] text-white/60 leading-tight space-y-0.5 list-none">
                        {concept.arrangement_bullets.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/40 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : concept.product_arrangement ? (
                      <ul className="text-[0.7rem] text-white/60 leading-tight space-y-0.5 list-none">
                        {concept.product_arrangement.split(/[.,;]/).filter(p => p.trim().length > 0).slice(0, 3).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/40 mt-0.5 flex-shrink-0">•</span>
                            <span className="flex-1">{point.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Details Modal */}
      {selectedCardForDetails !== null && concepts[selectedCardForDetails] && (
        <Modal
          isOpen={selectedCardForDetails !== null}
          onClose={() => setSelectedCardForDetails(null)}
          title={concepts[selectedCardForDetails].title}
          size="lg"
        >
          <div className="space-y-4 text-white/80">
            <div>
              <h4 className="font-semibold text-white mb-2">Scene</h4>
              <p className="text-white/70 leading-relaxed">{concepts[selectedCardForDetails].scene_description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Lighting</h4>
              <p className="text-white/70">{concepts[selectedCardForDetails].lighting}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Product Arrangement</h4>
              <p className="text-white/70">{concepts[selectedCardForDetails].product_arrangement}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Mood</h4>
              <p className="text-white/70">{concepts[selectedCardForDetails].mood}</p>
            </div>
          </div>
        </Modal>
      )}
      
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
