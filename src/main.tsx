import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import './lib/initLogos.ts' // Initialize logos system
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import heroImage from './assets/hero-image.jpg'

// Preload critical LCP image immediately in main thread
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'image';
link.href = heroImage;
link.fetchPriority = 'high';
document.head.appendChild(link);

// Component to handle favicon initialization
function AppWithFavicon() {
  useDynamicFavicon();
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWithFavicon />
  </StrictMode>
);
