'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Camera,
  MousePointerClick,
  Sparkles,
  UploadCloud,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BackgroundBlobs } from '../components/background-blobs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../hooks/use-auth';
import { PricingSection } from '../components/PricingSection';
import { MagneticButton } from '../components/MagneticButton';
import { GlowCard } from '../components/GlowCard';
import { ShowcaseSection } from '../components/showcase/ShowcaseSection';

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    title: 'Creative Direction AI',
    description:
      'Art-directs your shoot with luxury campaign sensibility and cinematic composition.',
    icon: Sparkles,
  },
  {
    title: 'One-click Stylized Sets',
    description:
      'Generate environments, backdrops, and lighting blueprints that look production-ready.',
    icon: Camera,
  },
  {
    title: 'Reference-to-Render',
    description:
      'Drop a single reference shot and evolve it into a full editorial storyline.',
    icon: UploadCloud,
  },
];

const testimonials = [
  {
    quote:
      "The fastest way we've achieved premium campaign visuals without booking a studio. It feels like collaborating with a patient art director.",
    name: 'Sanya Kapoor',
    role: 'Founder, Alchemy Atelier',
  },
  {
    quote:
      'Our launch had 4X social traction after running AdShotAI renders. The lighting fidelity is insane.',
    name: 'Kabir Mehta',
    role: 'Creative at Laguna Maison',
  },
];

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      // Give auth provider time to set cookie via API route
      // The middleware will allow navigation requests even if cookie isn't set yet
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-linear text-slate-100">
      <BackgroundBlobs />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(124,208,255,0.12),_transparent_60%)]" />
      <div className="relative z-10">
        <header className="sticky top-6 z-50 mx-auto flex w-[95%] max-w-5xl flex-col items-start gap-4 rounded-full border border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl transition-all duration-300 sm:w-fit sm:flex-row sm:items-center sm:justify-between sm:gap-12 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white sm:h-12 sm:w-12 sm:text-2xl">
              AS
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base leading-tight text-white sm:text-lg">
                AdShotAI
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 sm:text-xs sm:tracking-[0.25em]">
                AI Product Photography
              </span>
            </div>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                signInWithGoogle();
              }}
              disabled={loading}
              className="flex-1 sm:flex-none"
              type="button"
            >
              {loading ? 'Launching…' : 'Sign in'}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                signInWithGoogle();
              }}
              disabled={loading}
              className="flex-1 sm:flex-none"
              type="button"
            >
              Start free trial
            </Button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-4 pb-12 sm:gap-16 sm:px-6 sm:pb-16 md:gap-20 md:px-8 md:pb-24 lg:gap-24 lg:px-12 xl:px-16">
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] px-6 py-10 backdrop-blur-3xl sm:rounded-[40px] sm:px-8 sm:py-12 md:rounded-[48px] md:px-10 md:py-16 lg:px-14 lg:py-20">
            <motion.div
              className="flex flex-col gap-6 sm:gap-8 md:gap-10"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.12 }}
            >
              <motion.div variants={heroVariants}>
                <Badge variant="translucent" className="text-[10px] sm:text-xs">Luxury Visual Automation</Badge>
              </motion.div>
              <motion.div variants={heroVariants} className="max-w-3xl">
                <h1 className="font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl lg:text-6xl xl:text-[68px] xl:leading-[1.05]">
                  Turn a single reference into a full luxury photoshoot in minutes.
                </h1>
              </motion.div>
              <motion.p
                variants={heroVariants}
                className="max-w-2xl text-sm text-white/80 sm:text-base md:text-lg lg:text-xl"
              >
                AdShotAI pairs AI guidance with cinematic lighting, pro styling,
                and intuitive editing—so every render feels editorial-worthy.
              </motion.p>
              <motion.div
                variants={heroVariants}
                className="flex flex-col items-stretch gap-3 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              >
                <MagneticButton
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    signInWithGoogle();
                  }}
                  disabled={loading}
                  className="w-full sm:w-auto"
                  type="button"
                >
                  {loading ? 'Preparing your studio…' : 'Launch the Studio'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </MagneticButton>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault();
                    signInWithGoogle();
                  }}
                  className="w-full sm:w-auto"
                  type="button"
                >
                  Watch interactive demo
                </Button>
                <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-white/60 sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.3em]">
                  <Users className="h-3 w-3 flex-shrink-0 text-white/50 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">Trusted by 180+ brands</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:mt-14 md:grid-cols-3 md:gap-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {features.map((feature) => (
                <GlowCard key={feature.title} className="bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white sm:h-12 sm:w-12">
                    <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-white sm:mt-6 sm:text-xl">{feature.title}</h3>
                  <p className="mt-2 text-xs text-white/70 sm:mt-3 sm:text-sm">{feature.description}</p>
                </GlowCard>
              ))}
            </motion.div>
          </section>

          <section className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-2xl sm:gap-6 sm:rounded-[32px] sm:px-8 sm:py-10 md:rounded-[36px] md:px-10 md:py-12">
              <Badge variant="translucent" className="text-[10px] sm:text-xs">How it works</Badge>
              <h2 className="font-display text-2xl text-white sm:text-3xl md:text-[40px]">
                Your creative pipeline, orchestrated.
              </h2>
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
                {[
                  {
                    title: '01. Upload',
                    copy: 'Drop a product shot or mood board. Studio decodes materials, finish, and mood instantly.',
                    icon: UploadCloud,
                  },
                  {
                    title: '02. Direct',
                    copy: 'Pick a creative vibe—Visionary builds camera setups and lighting for that aesthetic.',
                    icon: MousePointerClick,
                  },
                  {
                    title: '03. Generate',
                    copy: 'Render multiple editorial shots, each with consistent styling and luxury polish.',
                    icon: Sparkles,
                  },
                  {
                    title: '04. Deliver',
                    copy: 'Download in ultra-clean resolution, ready for campaign drops, lookbooks, or ads.',
                    icon: Camera,
                  },
                ].map((step) => (
                  <GlowCard
                    key={step.title}
                    className="relative overflow-hidden bg-white/[0.05] p-5 transition hover:translate-y-[-6px] hover:bg-white/[0.08] sm:p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent sm:h-12 sm:w-12">
                      <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-white sm:mt-5 sm:text-base">{step.title}</h3>
                    <p className="mt-2 text-xs text-white/65 sm:mt-3 sm:text-sm">{step.copy}</p>
                  </GlowCard>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent p-6 backdrop-blur-xl sm:gap-6 sm:rounded-[32px] sm:p-8 md:rounded-[36px] md:p-10">
              <Badge variant="accent" className="self-start text-[10px] tracking-[0.3em] sm:text-xs sm:tracking-[0.4em]">
                Key Features
              </Badge>
              <h3 className="font-display text-xl leading-tight text-white sm:text-2xl md:text-3xl">
                Everything you need for professional product photography.
              </h3>
              <p className="text-xs text-white/70 sm:text-sm">
                Generate professional images with AI-powered creative concepts, reference-based rendering, and flexible aspect ratios—all in one place.
              </p>
              <div className="grid gap-2 sm:gap-3">
                {[
                  'AI-generated creative concepts',
                  'Reference image-based rendering',
                  'Multiple aspect ratio options',
                  'Save images to your library',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <Sparkles className="h-3 w-3 flex-shrink-0 text-accent sm:h-4 sm:w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                className="mt-4 w-full self-start sm:mt-6 sm:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  signInWithGoogle();
                }}
                type="button"
              >
                Start Creating
              </Button>
            </div>
          </section>

          {/* Showcase Section */}
          <ShowcaseSection />

          <section className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-white/[0.04] p-6 sm:p-8 md:p-10">
                <p className="text-sm text-white/90 sm:text-base md:text-lg">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-white/60 sm:mt-6 sm:text-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-white sm:h-12 sm:w-12 sm:text-sm">
                    {testimonial.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </section>

          <section className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-4 text-center sm:gap-6">
              <Badge variant="translucent" className="self-center text-[10px] sm:text-xs">
                Flexible Pricing
              </Badge>
              <h2 className="font-display text-2xl text-white sm:text-3xl md:text-[40px]">
                Choose the plan that fits your needs
              </h2>
              <p className="max-w-2xl self-center text-sm text-white/70 sm:text-base md:text-lg">
                Start with 3 free credits, then purchase credit packages as you need them.
                No subscriptions, no commitments—pay only for what you use.
              </p>
            </div>
            <PricingSection onSignUp={signInWithGoogle} />
          </section>

          <section className="relative overflow-hidden rounded-[24px] border border-white/15 bg-white/[0.04] px-6 py-10 text-center backdrop-blur-xl sm:rounded-[32px] sm:px-8 sm:py-12 md:rounded-[36px] md:px-10 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,141,122,0.18),_transparent_65%)]" />
            <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
              <Badge variant="translucent" className="text-[10px] sm:text-xs">Ready to shoot</Badge>
              <h2 className="max-w-3xl font-display text-2xl text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Produce campaign-grade imagery without booking a set.
              </h2>
              <p className="max-w-2xl text-sm text-white/75 sm:text-base md:text-lg">
                Launch AdShotAI, upload a reference, and watch the system build a
                fully art-directed shoot. It&apos;s the modern creative atelier—powered by AI.
              </p>
              <MagneticButton
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  signInWithGoogle();
                }}
                className="w-full sm:w-auto"
                type="button"
              >
                Enter the studio
              </MagneticButton>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-black/30 py-6 backdrop-blur-xl sm:py-8 md:py-10">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-4 text-xs text-white/60 sm:gap-4 sm:px-6 sm:text-sm md:flex-row md:items-center md:justify-between md:px-8 lg:px-12 xl:px-16">
            <span>© {new Date().getFullYear()} AdShotAI. All rights reserved.</span>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

