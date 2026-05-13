/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode base — warm lavender/cream palette
        petal: {
          50:  '#fdf8ff',
          100: '#f5eeff',
          200: '#ecdeff',
          300: '#dcc6ff',
          400: '#c8a7f8',
          500: '#b388ef',
          600: '#9b64e3',
          700: '#8047d0',
          800: '#6935ad',
          900: '#552d8c',
        },
        // Soft rose accent
        bloom: {
          50:  '#fff4f7',
          100: '#ffe4ec',
          200: '#ffccd9',
          300: '#ffa3bc',
          400: '#ff6e97',
          500: '#f84278',
          600: '#e51f5d',
          700: '#c01249',
          800: '#9e123f',
          900: '#85133b',
        },
        // Warm peach / amber
        sand: {
          50:  '#fffbf4',
          100: '#fff3e0',
          200: '#ffe4b8',
          300: '#ffd08a',
          400: '#ffb555',
          500: '#f99a2b',
          600: '#e07d10',
          700: '#b96010',
          800: '#954c13',
          900: '#7a3e12',
        },
        // Mint/teal accent
        mint: {
          50:  '#f0fdf9',
          100: '#ccfbee',
          200: '#99f5dd',
          300: '#5ae8c6',
          400: '#26d4aa',
          500: '#09bb92',
          600: '#059877',
          700: '#077960',
          800: '#0a5f4c',
          900: '#0b4d3f',
        },
        // Sky blue
        sky: {
          50:  '#f0f8ff',
          100: '#ddeeff',
          200: '#b5dcff',
          300: '#82c4ff',
          400: '#48a3ff',
          500: '#1c7eff',
          600: '#065cef',
          700: '#0548d4',
          800: '#0a3dad',
          900: '#103688',
        },
        // Dark mode — deep purple-charcoal
        void: {
          800: '#16121f',
          850: '#110e1c',
          900: '#0c0a15',
          950: '#07060f',
        },
        // Muted purple for dark surfaces
        grape: {
          700: '#2a1f3d',
          800: '#1e1630',
          900: '#140f22',
          950: '#0e0b18',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'petal':    '0 4px 24px -4px rgba(180, 130, 240, 0.18), 0 1px 4px rgba(0,0,0,0.04)',
        'petal-lg': '0 8px 40px -8px rgba(155, 100, 220, 0.25), 0 2px 8px rgba(0,0,0,0.06)',
        'bloom':    '0 4px 24px -4px rgba(248, 66, 120, 0.18)',
        'glow':     '0 0 30px rgba(180, 130, 240, 0.25)',
        'glow-mint':'0 0 30px rgba(9, 187, 146, 0.2)',
        'glass':    '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':     '0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-petal':  'linear-gradient(135deg, #f5eeff 0%, #ffe4ec 50%, #fff3e0 100%)',
        'gradient-void':   'linear-gradient(135deg, #0c0a15 0%, #140f22 50%, #0c0a15 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #dcc6ff 0%, #ffa3bc 50%, #ffd08a 100%)',
        'gradient-glow':   'radial-gradient(ellipse at 60% 0%, rgba(180,130,240,0.2) 0%, transparent 60%)',
        'gradient-hero-light': 'linear-gradient(160deg, #f5eeff 0%, #fdf4ff 35%, #fff0f8 70%, #fff8f0 100%)',
        'gradient-hero-dark':  'linear-gradient(160deg, #0c0a15 0%, #140f22 35%, #1a0e2a 70%, #0c0a15 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out both',
        'fade-in':    'fadeIn 0.4s ease-out both',
        'float':      'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
