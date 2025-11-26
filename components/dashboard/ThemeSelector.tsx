'use client';

import React from 'react';

const themes = [
  'Minimalist',
  'Editorial',
  'Cinematic',
  'Nature',
  'Urban',
  'Luxury',
  'Surrealist',
  'Vibrant',
  'Cyberpunk',
  'Vintage',
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
          const isSelected = selectedTheme === theme;
          return (
            <button
              key={theme}
              onClick={() => onSelectTheme(isSelected ? '' : theme)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-colors duration-200 ease-in-out
                ${
                  isSelected
                    ? 'bg-accent text-slate-950 border-accent'
                    : 'bg-white/[0.05] text-white/80 border-white/10 hover:bg-white/[0.1] hover:border-white/20'
                }`}
            >
              {theme}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-white/50 mt-2">
        Themes like 'Editorial' and 'Cinematic' work best with Pro mode.
      </p>
    </div>
  );
};
