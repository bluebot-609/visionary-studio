import React from 'react';
import type { UploadedFile } from '../../types';
import { UploadCloudIcon } from '../../icons';

interface ReferenceImageUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFile: UploadedFile | null;
  onRemoveFile: () => void;
  referenceNotes: string;
  onNotesChange: (text: string) => void;
}

export const ReferenceImageUpload: React.FC<ReferenceImageUploadProps> = ({
  onFileChange,
  uploadedFile,
  onRemoveFile,
  referenceNotes,
  onNotesChange,
}) => {
  return (
    <section className="glass-card rounded-[32px] md:rounded-[42px] bg-black/30 p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 md:space-y-6">
      <div className="space-y-2 md:space-y-3">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/40">
          Reference Image
        </p>
        <p className="text-[10px] md:text-xs text-white/50">
          Upload a style reference image (e.g., model shoot, aesthetic inspiration) to guide the product photo generation
        </p>
      </div>

      <label
        htmlFor="reference-file-upload"
        className="relative flex h-[200px] sm:h-[250px] md:h-[300px] cursor-pointer flex-col items-center justify-center gap-4 md:gap-6 overflow-hidden rounded-[24px] md:rounded-[30px] border border-dashed border-white/20 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent text-center transition hover:border-white/40 hover:bg-white/[0.08]"
      >
        {uploadedFile ? (
          <>
            <img
              src={`data:${uploadedFile.type};base64,${uploadedFile.base64}`}
              alt="Reference preview"
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
            <UploadCloudIcon className="h-8 w-8 md:h-10 md:w-10 text-white/40" />
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-white/70">
                Click to upload reference image
              </p>
              <p className="text-[10px] md:text-xs text-white/50">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          </>
        )}
        <input
          id="reference-file-upload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </label>

      <div className="space-y-2 md:space-y-3">
        <label htmlFor="reference-notes" className="text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em] text-white/40">
          Optional Notes
        </label>
        <textarea
          id="reference-notes"
          value={referenceNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add specific guidance (e.g., 'keep the lighting style but change background color')"
          className="w-full rounded-[16px] md:rounded-[20px] border border-white/10 bg-white/[0.02] px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
          rows={3}
        />
      </div>
    </section>
  );
};


