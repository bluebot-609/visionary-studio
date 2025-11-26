'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Badge } from '../ui/badge';

// Before/After comparison data
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
];

// Gallery images
const galleryImages = [
  { id: 1, src: '/showcase/gallery-4.png', alt: 'Editorial style' },
  { id: 2, src: '/showcase/gallery-1.png', alt: 'Fashion photoshoot' },
  { id: 3, src: '/showcase/gallery-2.png', alt: 'Product photography' },
  { id: 4, src: '/showcase/gallery-3.png', alt: 'Lifestyle shot' },
  { id: 5, src: '/showcase/gallery-5.png', alt: 'Campaign visual' },
  { id: 6, src: '/showcase/gallery-6.jpg', alt: 'Cosmetics shot' },
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
                className="group relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/20"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs sm:text-sm font-medium text-white">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

