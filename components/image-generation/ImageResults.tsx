import React from 'react';
import type { GeneratedImage } from '../../types';
import { Button } from '../ui/button';
import { SlidersHorizontalIcon } from '../../icons';

interface ImageResultsProps {
  image: GeneratedImage;
  onGenerateCaptions?: (id: string, base64: string) => void;
  onViewImage: () => void;
  onEditColor: (image: GeneratedImage) => void;
  userId?: string;
}

export const ImageResults: React.FC<ImageResultsProps> = ({
  image,
  onViewImage,
  onEditColor,
  userId,
}) => (
  <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 md:gap-6 p-4 md:p-0">
    <div className="group relative aspect-square w-full overflow-hidden rounded-[24px] md:rounded-[40px] border border-white/10 bg-black/30 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <img
        src={`data:image/jpeg;base64,${image.base64}`}
        alt="Generated image"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        style={{ filter: `hue-rotate(${image.hue}deg) saturate(${image.saturation}%)` }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 bg-black/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          variant="secondary"
          onClick={onViewImage}
          className="rounded-full bg-white/10 px-4 py-1.5 md:px-6 md:py-2 text-xs md:text-sm"
        >
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

