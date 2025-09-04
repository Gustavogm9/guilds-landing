import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance budgets
    chunkSizeWarningLimit: 180, // 180KB chunks
    rollupOptions: {
      output: {
        // Asset naming for long-term caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          
          // Organize assets by type for better caching
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash].[ext]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
        manualChunks: {
          // Core React dependencies
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          
          // UI library chunks - split by size and usage
          'radix-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip'
          ],
          'radix-forms': [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-select',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch'
          ],
          'radix-layout': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator'
          ],
          
          // Form handling
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          
          // Heavy libraries - separate chunks
          icons: ['lucide-react'],
          charts: ['recharts'],
          query: ['@tanstack/react-query'],
          
          // Utilities
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          
          // Animation and effects
          animations: ['canvas-confetti', 'embla-carousel-react'],
          
          // Development tools (only in dev builds)
          ...(mode === 'development' && {
            'dev-tools': ['rollup-plugin-visualizer']
          })
        },
        
        // Dynamic imports for route-based code splitting
        ...(mode === 'production' && {
          dynamicImportVarsOptions: {
            include: ['src/pages/**'],
            exclude: ['node_modules/**']
          }
        })
      }
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react'
      ]
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
    // Source maps for debugging (but smaller)
    sourcemap: mode === 'development',
  },
  // CSS optimization
  css: {
    devSourcemap: mode === 'development',
  },
}));
