import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import './lib/initLogos.ts' // Initialize logos system
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { initializePerformanceOptimizations } from '@/lib/serviceWorker'
import heroImage from './assets/hero-image.jpg'

// Preload critical LCP image immediately in main thread with size hints
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'image';
link.href = heroImage;
link.fetchPriority = 'high';
link.media = '(max-width: 768px)';
document.head.appendChild(link);

// Preload larger image for desktop
const linkDesktop = document.createElement('link');
linkDesktop.rel = 'preload';
linkDesktop.as = 'image';
linkDesktop.href = heroImage;
linkDesktop.fetchPriority = 'high';
linkDesktop.media = '(min-width: 769px)';
document.head.appendChild(linkDesktop);

// Component to handle favicon initialization
function AppWithFavicon() {
  useDynamicFavicon();
  return <App />;
}

// Initialize performance optimizations
initializePerformanceOptimizations();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWithFavicon />
  </StrictMode>
);
