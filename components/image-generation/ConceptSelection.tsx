import React, { useState, useCallback } from 'react';
import type { AdConcept } from '../../types';
import { Card } from '../ui/card';
import { CheckIcon } from '../../icons';

interface ConceptSelectionProps {
  concepts: AdConcept[];
  selectedConcept: AdConcept | null;
  onSelectConcept: (concept: AdConcept) => void;
}

export const ConceptSelection: React.FC<ConceptSelectionProps> = ({
  concepts,
  selectedConcept,
  onSelectConcept,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">
          Concept board
        </span>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[38px] text-white leading-tight">
          Select the direction that anchors your campaign narrative.
        </h2>
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
                        <h3 className="text-base md:text-lg font-semibold text-white break-words">
                          {concept.title}
                        </h3>
                        <p className="text-xs md:text-sm text-white/65 break-words">{concept.description}</p>
                      </div>
                      <div
                        className={`flex h-7 w-7 md:h-8 md:w-8 flex-shrink-0 items-center justify-center rounded-full border ${
                          conceptSelected
                            ? 'border-accent bg-accent text-slate-950'
                            : 'border-white/10 bg-white/[0.05] text-white/60'
                        }`}
                      >
                        <CheckIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </div>
                    </div>
                    <div className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-[10px] md:text-xs text-white/70">
                      <div className="flex items-center justify-between gap-2">
                        <span className="uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/40">
                          Mood
                        </span>
                        <span className="text-right break-words">{concept.mood}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/40">
                          Aesthetic
                        </span>
                        <span className="text-right break-words">{concept.aesthetic}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="uppercase tracking-[0.2em] md:tracking-[0.25em] text-white/40">
                          Model
                        </span>
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
        <div className="flex justify-center gap-2 mt-4 md:mt-6">
          {concepts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full transition ${
                idx === currentIndex ? 'bg-accent' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to concept ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

