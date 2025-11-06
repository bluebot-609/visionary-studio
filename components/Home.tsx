import React from 'react';
import type { View } from '../App';
import { PaintbrushIcon } from '../icons';

interface HomeProps {
  setView: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-gray-100">
        The Modern Digital Atelier
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
        An intelligent creative suite for generating exceptional visual assets. Elevate your brand with production-quality images.
      </p>

      <div className="flex justify-center w-full max-w-4xl">
        <Card
          onClick={() => setView('imageGeneration')}
          icon={<PaintbrushIcon />}
          title="Image Generation"
          description="Produce photorealistic product shots, lifestyle images, and conceptual art with a guided, professional brief."
        />
      </div>
    </div>
  );
};

interface CardProps {
    onClick: () => void;
    icon: React.ReactElement<{ className?: string }>;
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ onClick, icon, title, description }) => (
    <div
      onClick={onClick}
      className="group relative cursor-pointer p-8 bg-[#1a1a1a] border border-slate-800 rounded-xl shadow-lg hover:shadow-sky-500/10 hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="text-sky-500 mb-4">
        {React.cloneElement(icon, { className: "w-10 h-10" })}
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-100">{title}</h2>
      <p className="text-gray-400">
        {description}
      </p>
    </div>
);

export default Home;