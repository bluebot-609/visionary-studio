'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { detectLocationFromBrowser, getLocation, type Currency } from '@/lib/location';
import { useAuth } from '@/hooks/use-auth';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  currency: Currency;
  popular?: boolean;
}

type CreditPackageConfig = Omit<CreditPackage, 'pricePerCredit'>;

const createPackage = (pkg: CreditPackageConfig): CreditPackage => ({
  ...pkg,
  pricePerCredit: parseFloat(
    (pkg.price / pkg.credits).toFixed(pkg.currency === 'INR' ? 2 : 3)
  ),
});

// India pricing (INR)
const INDIA_PACKAGES: CreditPackage[] = [
  createPackage({
    id: 'starter',
    name: 'Starter',
    credits: 120,
    price: 199,
    currency: 'INR',
  }),
  createPackage({
    id: 'popular',
    name: 'Popular',
    credits: 240,
    price: 299,
    currency: 'INR',
    popular: true,
  }),
  createPackage({
    id: 'pro',
    name: 'Pro',
    credits: 480,
    price: 549,
    currency: 'INR',
  }),
];

// International pricing (USD)
const INTERNATIONAL_PACKAGES: CreditPackage[] = [
  createPackage({
    id: 'starter',
    name: 'Starter',
    credits: 120,
    price: 3.99,
    currency: 'USD',
  }),
  createPackage({
    id: 'popular',
    name: 'Popular',
    credits: 240,
    price: 6.99,
    currency: 'USD',
    popular: true,
  }),
  createPackage({
    id: 'pro',
    name: 'Pro',
    credits: 480,
    price: 9.99,
    currency: 'USD',
  }),
];

interface PricingSectionProps {
  onSignUp?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSignUp }) => {
  const { signInWithGoogle, loading } = useAuth();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [packages, setPackages] = useState<CreditPackage[]>(INTERNATIONAL_PACKAGES);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    // Detect location on mount
    const detect = async () => {
      setDetecting(true);
      
      // First, try browser detection immediately (more reliable for local dev)
      const browserLocation = detectLocationFromBrowser();
      
      // If browser detection suggests India, use it immediately
      if (browserLocation.isIndia) {
        console.log('📍 Location detected (browser): India - Using INR pricing');
        setCurrency(browserLocation.currency);
        setPackages(INDIA_PACKAGES);
        setDetecting(false);
        return;
      }
      
      // Otherwise, try IP-based detection
      try {
        const location = await getLocation();

        // Check if API suggests using browser detection (for localhost/private IPs)
        if (location.useBrowserDetection) {
          // Use browser-based detection result we already got
          console.log('📍 Location detected (browser fallback):', browserLocation.isIndia ? 'India (INR)' : 'International (USD)');
          setCurrency(browserLocation.currency);
          setPackages(browserLocation.isIndia ? INDIA_PACKAGES : INTERNATIONAL_PACKAGES);
        } else {
          console.log('📍 Location detected (IP):', location.isIndia ? 'India (INR)' : 'International (USD)');
          setCurrency(location.currency);
          setPackages(location.isIndia ? INDIA_PACKAGES : INTERNATIONAL_PACKAGES);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to browser detection
        console.log('📍 Location detected (browser fallback after error):', browserLocation.isIndia ? 'India (INR)' : 'International (USD)');
        setCurrency(browserLocation.currency);
        setPackages(browserLocation.isIndia ? INDIA_PACKAGES : INTERNATIONAL_PACKAGES);
      } finally {
        setDetecting(false);
      }
    };

    detect();
  }, []);

  const formatPrice = (price: number, curr: Currency) => {
    if (curr === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSignUp) {
      onSignUp();
    } else {
      signInWithGoogle();
    }
  };

  return (
    <section className="grid gap-6 sm:gap-8 lg:grid-cols-3">
      {/* Credit Packages */}
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`p-6 sm:p-8 md:p-10 ${
              pkg.popular
                ? 'border-white/20 bg-white/[0.08] relative'
                : 'bg-white/[0.04]'
            }`}
          >
            {pkg.popular && (
              <Badge
                variant="accent"
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-slate-950 sm:text-xs sm:tracking-[0.4em]"
              >
                Most Popular
              </Badge>
            )}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="font-display text-xl text-white sm:text-2xl">{pkg.name}</h3>
                <p className="mt-2 text-xs text-white/65 sm:text-sm">
                  {currency === 'INR'
                    ? 'Perfect for small campaigns and testing'
                    : 'Perfect for small campaigns and testing'}
                </p>
              </div>
              <div className="mt-6 flex items-baseline gap-2 text-white sm:mt-8">
                <span className="text-3xl font-semibold sm:text-4xl">
                  {formatPrice(pkg.price, pkg.currency)}
                </span>
                <span className="text-xs text-white/60 sm:text-sm">
                  for {pkg.credits} credits
                </span>
              </div>
              <ul className="mt-6 space-y-2 text-xs text-white/75 sm:mt-8 sm:space-y-3 sm:text-sm">
                <li className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 sm:gap-3 sm:px-4">
                  <Sparkles className="h-3 w-3 flex-shrink-0 text-accent sm:h-4 sm:w-4" />
                  <span>Up to {Math.floor(pkg.credits / 10)} professional image generations</span>
                </li>
                <li className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 sm:gap-3 sm:px-4">
                  <Sparkles className="h-3 w-3 flex-shrink-0 text-accent sm:h-4 sm:w-4" />
                  <span>Concept-to-render pipeline</span>
                </li>
              </ul>
              <Button
                className="mt-6 w-full sm:mt-8"
                variant={pkg.popular ? 'primary' : 'secondary'}
                onClick={handleGetStarted}
                disabled={loading || detecting}
                type="button"
              >
                {loading ? 'Launching…' : pkg.popular ? 'Get Started' : 'Choose Plan'}
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Enterprise Card (shown separately or as part of footer note) */}
      <div className="lg:col-span-3 mt-4">
        <Card className="bg-white/[0.03] border-white/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-white sm:text-xl">Need more credits?</h3>
              <p className="mt-2 text-xs text-white/65 sm:text-sm">
                For Enterprise packages and custom pricing, our team can create a tailored plan for
                your needs.
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = 'mailto:sales@visionarystudio.com?subject=Enterprise Pricing Inquiry';
              }}
              type="button"
            >
              Contact Sales
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

