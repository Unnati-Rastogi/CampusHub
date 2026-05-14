import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Raise warning limit slightly — Firebase is legitimately large
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Vite 8 / rolldown requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              if (id.includes('firebase/auth') || id.includes('@firebase/auth')) return 'vendor-firebase-auth';
              if (id.includes('firebase/firestore') || id.includes('@firebase/firestore')) return 'vendor-firebase-firestore';
              return 'vendor-firebase-app';
            }
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react-router-dom') || id.includes('react-router')) return 'vendor-router';
            if (id.includes('react-dom')) return 'vendor-react';
          }
        },
      },
    },
  },

  // Optimise dev server cold start by pre-bundling heavy deps
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
    ],
  },
});
