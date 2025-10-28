import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
// CSS loaded asynchronously to prevent render blocking
import('./index.css');
import './lib/initLogos.ts' // Initialize logos system
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { initializePerformanceOptimizations } from '@/lib/serviceWorker'
import { AuthProvider } from '@/contexts/AuthContext';
import { MultiProductProvider } from '@/contexts/MultiProductContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Component to handle favicon initialization
function AppWithFavicon() {
  useDynamicFavicon();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MultiProductProvider>
            <Toaster />
            <Sonner />
            <App />
          </MultiProductProvider>
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
