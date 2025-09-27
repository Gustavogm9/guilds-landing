import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
// CSS loaded asynchronously to prevent render blocking
import('./index.css');
import './lib/initLogos.ts' // Initialize logos system
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { initializePerformanceOptimizations } from '@/lib/serviceWorker'
import heroImage from './assets/hero-image.jpg'
import { AuthProvider } from '@/contexts/AuthContext';
import { PermissionsProvider } from '@/contexts/PermissionsContext';
import { MultiProductProvider } from '@/contexts/MultiProductContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PermissionsProvider>
            <MultiProductProvider>
              <Toaster />
              <Sonner />
              <App />
            </MultiProductProvider>
          </PermissionsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Initialize performance optimizations
initializePerformanceOptimizations();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWithFavicon />
  </StrictMode>
);
