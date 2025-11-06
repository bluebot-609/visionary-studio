
import React, { useState } from 'react';
import ImageGeneration from './components/ImageGeneration';
import Home from './components/Home';
import { VisionaryIcon } from './icons';

// FIX: Export the View type to be used for view switching.
export type View = 'home' | 'imageGeneration';


const App: React.FC = () => {
  // FIX: Add state to manage the current view.
  const [view, setView] = useState<View>('home');

  // FIX: Create a function to render the component based on the current view state.
  const renderView = () => {
    switch (view) {
      case 'imageGeneration':
        return <ImageGeneration />;
      case 'home':
      default:
        return <Home setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans antialiased">
      <header className="p-4 border-b border-slate-800 bg-[#121212]/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('home')}
          >
            <VisionaryIcon className="w-8 h-8 text-sky-500" />
            <h1 className="text-xl font-bold text-gray-100 tracking-wide">
              Visionary
            </h1>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
