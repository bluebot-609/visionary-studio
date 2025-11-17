'use client';

import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  label,
  onFileChange,
  previewUrl,
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onFileChange(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-white/80 mb-2">
        {label} {required && <span className="text-accent font-semibold">*</span>}
      </label>
      <div
        className="group relative w-full h-64 border-2 border-dashed border-white/10 rounded-lg flex justify-center items-center text-center cursor-pointer hover:border-accent/50 transition-colors duration-200 bg-white/[0.02]"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-white/50 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="mt-2 text-sm font-normal">Click to upload image</span>
          </div>
        )}
      </div>
    </div>
  );
};

