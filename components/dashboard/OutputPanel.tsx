'use client';

import React from 'react';
import { NavigationBar } from './NavigationBar';
import { ConceptSelector } from './ConceptSelector';
import { GeneratedImageView } from './GeneratedImageView';
import type { CreativeConcept, GeneratedContent } from '../../types';

interface OutputPanelProps {
  currentView: 'input' | 'concepts' | 'generated';
  concepts: CreativeConcept[] | null;
  generatedContent: GeneratedContent | null;
  selectedConcept: CreativeConcept | null;
  isLoading: boolean;
  isGeneratingConcepts: boolean;
  onSelectConcept: (concept: CreativeConcept) => void;
  onGenerateFromConcept: () => void;
  onBack: () => void;
  onStartNewProject: () => void;
  onBackToConcepts?: () => void;
  onSaveToLibrary?: () => void;
  isProMode?: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  currentView,
  concepts,
  generatedContent,
  selectedConcept,
  isLoading,
  isGeneratingConcepts,
  onSelectConcept,
  onGenerateFromConcept,
  onBack,
  onStartNewProject,
  onBackToConcepts,
  onSaveToLibrary,
  isProMode = false,
}) => {
  return (
    <div className="bg-white/[0.05] p-6 md:p-8 rounded-2xl shadow-lg border border-white/10 w-full h-full flex flex-col min-w-0 overflow-hidden">
      <NavigationBar
        currentView={currentView}
        onBack={currentView !== 'input' ? onBack : undefined}
        onStartNewProject={onStartNewProject}
      />
      <div className="flex-1 overflow-hidden">
        {currentView === 'concepts' && (
          <ConceptSelector
            concepts={concepts || []}
            selectedConcept={selectedConcept}
            onSelectConcept={onSelectConcept}
            onGenerateFromConcept={onGenerateFromConcept}
            isLoading={isGeneratingConcepts}
            isGenerating={isLoading}
            isProMode={isProMode}
          />
        )}
        {currentView === 'generated' && (
          <GeneratedImageView
            content={generatedContent}
            isLoading={isLoading}
            onBackToConcepts={onBackToConcepts}
            onSaveToLibrary={onSaveToLibrary}
            onStartNewProject={onStartNewProject}
            showBackButton={!!concepts}
          />
        )}
        {currentView === 'input' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 p-8">
            <div className="relative w-full max-w-md aspect-video mb-8 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8 opacity-30 transform rotate-12 scale-110">
                  <div className="w-32 h-40 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '0s' }} />
                  <div className="w-32 h-40 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-32 h-40 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="w-32 h-40 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-2xl shadow-accent/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-display font-medium text-white mb-2">Ready to Create?</h3>
                <p className="text-sm text-white/60 text-center max-w-xs">
                  Upload a product image to start generating campaign-ready visuals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

