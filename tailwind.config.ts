import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './{App,components,features,layouts,pages,providers,routes,sections,styles,utils}/**/*.{ts,tsx}',
    './index.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '4rem',
        xl: '6rem',
        '2xl': '8rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Sora', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0f1015',
          elevated: '#151722',
          glass: 'rgba(21, 23, 34, 0.6)',
        },
        accent: {
          DEFAULT: '#ff8d7a',
          hover: '#ff9f8f',
        },
      },
      backgroundImage: {
        'mesh-radial':
          'radial-gradient(circle at 20% 20%, rgba(255, 141, 122, 0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(114, 101, 255, 0.4), transparent 55%), radial-gradient(circle at 50% 80%, rgba(124, 208, 255, 0.35), transparent 55%)',
        'mesh-linear':
          'linear-gradient(135deg, rgba(20, 22, 34, 0.95) 0%, rgba(16, 18, 28, 0.95) 100%)',
      },
      boxShadow: {
        'glass-lg': '0 24px 60px rgba(12, 16, 28, 0.45)',
        'card-hover': '0 18px 40px rgba(13, 111, 216, 0.25)',
      },
      blur: {
        100: '100px',
      },
    },
  },
  plugins: [],
};

export default config;





