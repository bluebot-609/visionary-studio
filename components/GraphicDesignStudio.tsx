
import React, { useState } from 'react';
import { TRENDING_STYLES } from '../options';
import { analyzeWebsiteForConcepts } from '../services/geminiService';
// FIX: Imported Concept type from the central types file.
import type { Concept } from '../types';

const GraphicDesignStudio: React.FC = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-100">
          Design Studio
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto">
          Your creative powerhouse. Generate brand identities, analyze assets, and stay ahead of design trends.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <WebsiteAnalyzer />
        </div>
        <div className="lg:col-span-1">
            <TrendingStyles />
        </div>
      </div>
       <OtherTools />
    </div>
  );
};


const WebsiteAnalyzer: React.FC = () => {
    const [url, setUrl] = useState('');
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!url) {
            setError('Please enter a website URL.');
            return;
        }
        setIsLoading(true);
        setError('');
        setConcepts([]);
        try {
            const results = await analyzeWebsiteForConcepts(url);
            setConcepts(results);
        } catch (e) {
            console.error(e);
            setError('Failed to analyze website. The URL might be inaccessible or the format invalid.');
        }
        setIsLoading(false);
    };

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-800 shadow-sm h-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-100">Analyze & Generate Concepts</h3>
            <p className="text-sm text-gray-400 mb-4">Enter a website URL to analyze its brand identity and generate new creative concepts that align with its aesthetic.</p>
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com" 
                    className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
                <button onClick={handleAnalyze} disabled={isLoading} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition-colors">
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            {isLoading && <div className="text-center p-4 text-gray-500">Loading concepts...</div>}

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {concepts.map((concept, index) => (
                    <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-sky-400">{concept.title}</h4>
                        <p className="text-sm text-gray-300">{concept.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const TrendingStyles: React.FC = () => {
    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-800 shadow-sm h-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-100">Trending Styles</h3>
            <div className="flex flex-wrap gap-2">
                {TRENDING_STYLES.map(style => (
                    <span key={style} className="bg-teal-900/50 text-teal-300 text-xs font-medium px-3 py-1 rounded-full border border-teal-800">
                        {style}
                    </span>
                ))}
            </div>
        </div>
    );
};

const OtherTools: React.FC = () => {
    const tools = [
        "Brand Identity", "Logo Generation", "Vector Art",
        "Image Manipulation", "Digital Painting", "3D Models"
    ];

    return (
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-100">Core Design Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {tools.map(tool => (
                    <div key={tool} className="text-center p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <p className="font-semibold text-sm text-gray-200">{tool}</p>
                        <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraphicDesignStudio;
