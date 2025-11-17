import React from 'react';
import type { UploadedFile } from '../../types';
import { UploadCloudIcon } from '../../icons';

interface ImageUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFile: UploadedFile | null;
  onRemoveFile: () => void;
  textDescription: string;
  onTextChange: (text: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileChange,
  uploadedFile,
  onRemoveFile,
  textDescription,
  onTextChange,
}) => {
  return (
    <section className="glass-card grid overflow-hidden rounded-[32px] md:rounded-[42px] bg-black/30 md:grid-cols-[1.25fr_1fr]">
      <div className="relative flex flex-col justify-between gap-4 md:gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 rounded-l-[32px] md:rounded-l-[42px] bg-[radial-gradient(circle_at_top,_rgba(124,208,255,0.12),_transparent_55%)]" />
        <div className="relative z-10 max-w-md space-y-2 md:space-y-4">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">
            Studio upload
          </p>
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
                <h3 className="text-base md:text-lg font-semibold text-white">
                  Drop imagery or click to upload
                </h3>
                <p className="text-xs md:text-sm text-white/55">
                  PNG, JPG up to 10MB. Use reference shots or sketches.
                </p>
              </div>
              <span className="accent-pill text-[10px] md:text-xs">Upload asset</span>
            </>
          )}
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={onFileChange}
            accept="image/*"
          />
        </label>
        {uploadedFile && (
          <div className="relative z-10 flex items-center justify-between gap-2 rounded-full border border-white/10 bg-black/40 px-4 md:px-5 py-2 text-[10px] md:text-xs text-white/60">
            <span className="truncate min-w-0">{uploadedFile.name}</span>
            <span className="flex-shrink-0">
              {(uploadedFile.base64.length * (3 / 4) / 1024).toFixed(0)} KB
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 bg-black/45 p-4 sm:p-6 md:p-8 lg:p-10 md:border-l md:border-t-0">
        <div className="flex flex-col gap-3 md:gap-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">
            Creative brief
          </span>
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

