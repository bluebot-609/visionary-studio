'use client';

import React from 'react';

const themes = [
  {
    name: 'Minimalist',
    description: 'Clean, simple aesthetics with emphasis on negative space and essential elements. Perfect for modern, elegant products.',
  },
  {
    name: 'Vintage',
    description: 'Retro-inspired styling with classic color palettes and nostalgic atmosphere. Great for timeless or heritage products.',
  },
  {
    name: 'Futuristic',
    description: 'Modern, tech-forward aesthetic with sleek lines and cutting-edge visuals. Ideal for technology and innovation products.',
  },
  {
    name: 'Nature',
    description: 'Organic, earthy tones with natural elements and sustainable vibes. Perfect for eco-friendly and wellness products.',
  },
  {
    name: 'Urban',
    description: 'Contemporary city aesthetic with industrial elements and metropolitan energy. Great for lifestyle and streetwear products.',
  },
  {
    name: 'Luxury',
    description: 'Premium, sophisticated styling with elegant details and high-end atmosphere. Ideal for luxury and premium products.',
  },
  {
    name: 'Playful',
    description: 'Vibrant, energetic aesthetic with bold colors and fun elements. Perfect for creative and youthful products.',
  },
  {
    name: 'Abstract',
    description: 'Artistic, creative styling with unique compositions and experimental visuals. Great for avant-garde and artistic products.',
  },
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-2">
        Select a Theme (Optional)
      </label>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.name;
          return (
            <div key={theme.name} className="relative group">
              <button
                onClick={() => onSelectTheme(isSelected ? '' : theme.name)}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors duration-200 ease-in-out ${
                  isSelected
                    ? 'bg-accent text-slate-950 border-accent'
                    : 'bg-white/[0.05] text-white/80 border-white/10 hover:bg-white/[0.1] hover:border-white/20'
                }`}
              >
                {theme.name}
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-black/95 border border-white/20 rounded-lg text-xs text-white/90 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                {theme.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/20"></div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs font-normal text-white/50 mt-2">
        Selecting a theme will guide the AI's creative direction.
      </p>
    </div>
  );
};

