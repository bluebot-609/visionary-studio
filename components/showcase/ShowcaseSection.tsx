'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Badge } from '../ui/badge';

// Before/After comparison data
// To add new pairs: 
// 1. Upload before image to public/showcase/ (e.g., before-3.jpeg)
// 2. Upload after image to public/showcase/ (e.g., after-3.png)
// 3. Add a new object to this array with the file paths
const comparisons = [
  {
    id: 1,
    before: '/showcase/before-1.jpeg',
    after: '/showcase/after-1.png',
    beforeLabel: 'Product',
    afterLabel: 'Ad Ready',
  },
  {
    id: 2,
    before: '/showcase/before-2.jpeg',
    after: '/showcase/after-2.jpg',
    beforeLabel: 'Product',
    afterLabel: 'Ad Ready',
  },
  // Add more pairs here:
  // {
  //   id: 3,
  //   before: '/showcase/before-3.jpeg',
  //   after: '/showcase/after-3.png',
  //   beforeLabel: 'Product',
  //   afterLabel: 'Ad Ready',
  // },
];

// Gallery images with original source photos for reverse reveal
const galleryImages = [
  { 
    id: 1, 
    src: '/showcase/gallery-4.png', 
    originalSrc: '/showcase/gallery-src-4.webp',
    alt: 'Editorial style' 
  },
  { 
    id: 2, 
    src: '/showcase/gallery-1.png', 
    originalSrc: '/showcase/gallery-src-1.webp',
    alt: 'Fashion photoshoot' 
  },
  { 
    id: 3, 
    src: '/showcase/gallery-2.png', 
    originalSrc: '/showcase/gallery-src-2.jpg',
    alt: 'Product photography' 
  },
  { 
    id: 4, 
    src: '/showcase/gallery-3.png', 
    originalSrc: '/showcase/gallery-src-3.jpeg',
    alt: 'Lifestyle shot' 
  },
  { 
    id: 5, 
    src: '/showcase/gallery-5.png', 
    originalSrc: '/showcase/gallery-src-5.jpg',
    alt: 'Campaign visual' 
  },
  { 
    id: 6, 
    src: '/showcase/gallery-6.jpg', 
    originalSrc: '/showcase/gallery-src-6.jpg',
    alt: 'Cosmetics shot' 
  },
];

export const ShowcaseSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] px-6 py-10 backdrop-blur-3xl sm:rounded-[32px] sm:px-8 sm:py-12 md:rounded-[40px] md:px-10 md:py-16 lg:px-14 lg:py-20">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,141,122,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(124,208,255,0.08),_transparent_50%)]" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="translucent" className="self-center text-[10px] sm:text-xs">
            See the Magic
          </Badge>
          <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl lg:text-[44px]">
            From Product to Campaign-Ready
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-white/70 sm:text-base md:text-lg">
            Watch ordinary product photos transform into stunning, ad-ready visuals with just one click.
          </p>
        </motion.div>

        {/* Before/After Comparisons */}
        <motion.div
          className="grid gap-6 sm:gap-8 md:grid-cols-2 mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {comparisons.map((comparison) => (
            <BeforeAfterSlider
              key={comparison.id}
              beforeImage={comparison.before}
              afterImage={comparison.after}
              beforeLabel={comparison.beforeLabel}
              afterLabel={comparison.afterLabel}
              className="border border-white/10 shadow-2xl shadow-black/20"
            />
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/50 mb-6 sm:mb-8">
            More Stunning Results
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative aspect-square overflow-visible rounded-xl sm:rounded-2xl border border-white/10 bg-black/20"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                {/* Main generated ad image */}
                <div className="relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                  />
                </div>

                {/* Polaroid popup with original photo - appears on group hover */}
                {image.originalSrc && (
                  <div className="absolute bottom-2 right-2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                    <div className="relative bg-white rounded-lg shadow-2xl p-2 w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 transform rotate-[-3deg] group-hover:rotate-[-2deg] transition-transform duration-300">
                      {/* Polaroid white border effect */}
                      <div className="absolute inset-0 bg-white rounded-lg" />
                      <div className="relative w-full h-full rounded-md overflow-hidden">
                        <img
                          src={image.originalSrc}
                          alt="Original photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Polaroid bottom label area */}
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-b-lg flex items-center justify-center">
                        <div className="w-12 h-0.5 bg-gray-300 rounded-full" />
                      </div>
                      {/* Subtle shadow for depth */}
                      <div className="absolute inset-0 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] pointer-events-none" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

