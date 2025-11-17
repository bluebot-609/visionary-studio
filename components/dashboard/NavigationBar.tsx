'use client';

import React from 'react';

interface NavigationBarProps {
  currentView: 'input' | 'concepts' | 'generated';
  onBack?: () => void;
  onStartNewProject: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentView,
  onBack,
  onStartNewProject,
}) => {
  const breadcrumbItems = ['Input'];
  if (currentView === 'concepts' || currentView === 'generated') {
    breadcrumbItems.push('Concepts');
  }
  if (currentView === 'generated') {
    breadcrumbItems.push('Generated');
  }

  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && <span className="text-white/40 mx-1">/</span>}
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              index === breadcrumbItems.length - 1
                ? 'text-white'
                : 'text-white/50'
            }`}>
              {item}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-colors duration-200"
          >
            Back
          </button>
        )}
        <button
          onClick={onStartNewProject}
          className="px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
        >
          Start New Project
        </button>
      </div>
    </div>
  );
};

