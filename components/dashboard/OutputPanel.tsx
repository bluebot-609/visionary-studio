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
}) => {
  return (
    <div className="bg-white/[0.05] p-6 md:p-8 rounded-2xl shadow-lg border border-white/10 w-full h-full min-h-[400px] lg:min-h-[700px] flex flex-col">
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
          <div className="w-full h-full flex items-center justify-center text-white/50">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-normal text-white/60">Your generated content will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

