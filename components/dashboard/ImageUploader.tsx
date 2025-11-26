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

  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
      onFileChange(file);
    }
  };

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
        className={`group relative w-full aspect-[4/3] max-h-64 border-2 border-dashed rounded-lg flex justify-center items-center text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-accent bg-accent/10 scale-[1.02]'
            : 'border-white/10 bg-white/[0.02] hover:border-accent/50'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg p-2"
            />
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
          <div className={`flex flex-col items-center transition-colors duration-200 ${isDragging ? 'text-accent' : 'text-white/50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="mt-2 text-sm font-normal">
              {isDragging ? 'Drop image here' : 'Click or drag to upload image'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

