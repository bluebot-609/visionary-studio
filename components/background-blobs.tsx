import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface BackgroundBlobsProps {
  className?: string;
}

const blobTransition = {
  duration: 18,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: 'easeInOut' as const,
};

export const BackgroundBlobs = ({ className }: BackgroundBlobsProps) => (
  <div
    className={cn(
      'pointer-events-none absolute inset-0 overflow-hidden opacity-70',
      className,
    )}
  >
    <motion.div
      className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#ff8d7a]/30 blur-3xl"
      animate={{ x: ['0%', '20%', '-10%'], y: ['0%', '10%', '-15%'] }}
      transition={blobTransition}
    />
    <motion.div
      className="absolute right-[-15%] top-1/3 h-80 w-80 rounded-full bg-[#7265ff]/30 blur-3xl"
      animate={{ x: ['0%', '-15%', '10%'], y: ['0%', '20%', '-10%'] }}
      transition={{ ...blobTransition, duration: 22 }}
    />
    <motion.div
      className="absolute left-1/3 bottom-[-10%] h-72 w-72 rounded-full bg-[#7cd0ff]/25 blur-3xl"
      animate={{ x: ['0%', '10%', '-12%'], y: ['0%', '-20%', '5%'] }}
      transition={{ ...blobTransition, duration: 20 }}
    />
  </div>
);





