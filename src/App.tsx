import React, { useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import { SEOHead } from "./components/seo/SEOHead";
import { SitemapGenerator } from "./components/seo/SitemapGenerator";
import { QualificationProvider } from "./components/forms/QualificationProvider";
import { QualificationTrigger } from "./components/forms/QualificationTrigger";
import { ConsentProvider } from "./hooks/useConsent";
import { ConsentBanner } from "./components/legal/ConsentBanner";
import { AuthProvider } from "./contexts/AuthContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SkipLinks } from "./components/a11y/SkipLink";
import { initPerformanceMonitoring } from "./lib/performanceMonitor";
import ErrorBoundary from "./components/error/ErrorBoundary";

// Critical pages - loaded immediately
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages for better code splitting - PHASE 1 COMPLETION
const Services = React.lazy(() => import("./pages/Services"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const CookiePolicy = React.lazy(() => import("./pages/CookiePolicy"));
const Contact = React.lazy(() => import("./pages/Contact"));
const About = React.lazy(() => import("./pages/About"));
const NewAbout = React.lazy(() => import("./pages/NewAbout"));
const Team = React.lazy(() => import("./pages/Team"));
const TeamCurriculum = React.lazy(() => import("./pages/TeamCurriculum").then(module => ({ default: module.TeamCurriculum })));
const Careers = React.lazy(() => import("./pages/Careers"));
const SoftwareApps = React.lazy(() => import("./pages/SoftwareApps"));
const AutomacaoIA = React.lazy(() => import("./pages/AutomacaoIA"));
const JogosGamificacao = React.lazy(() => import("./pages/JogosGamificacao"));
const Consultoria = React.lazy(() => import("./pages/Consultoria"));
const ThankYou = React.lazy(() => import("./pages/ThankYou"));
const Search = React.lazy(() => import("./pages/Search"));
const ServerError = React.lazy(() => import("./pages/ServerError"));

// Admin and auth pages - separate chunks with preloading strategy
const Admin = React.lazy(() => import("./pages/Admin"));
const Auth = React.lazy(() => import("./pages/Auth"));

// Lab and Craft pages - feature-specific chunks with priority loading
const Lab = React.lazy(() => import("./pages/Lab"));
const LabWorkshop = React.lazy(() => import("./pages/LabWorkshop"));
const Craft = React.lazy(() => import("./pages/Craft"));
const CraftIdea = React.lazy(() => import("./pages/CraftIdea"));
const CraftPortfolio = React.lazy(() => import("./pages/CraftPortfolio"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Implement aggressive caching to prevent duplicate requests
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in newer versions)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      // Deduplicate identical requests
      refetchInterval: false,
      retry: 1,
      // Optimize network performance
      refetchIntervalInBackground: false,
    },
  },
});

const App = () => {
  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConsentProvider>
          <AuthProvider>
            <TranslationProvider>
              <QualificationProvider>
                <ErrorBoundary>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <SkipLinks />
                    <SEOHead />
                    <SitemapGenerator />
                    <ScrollToTop />
                    
                    <Routes>
                      {/* Admin Routes - WITHOUT site layout */}
                      <Route 
                        path="/admin/*" 
                        element={
                          <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                              <Admin />
                            </Suspense>
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Auth Routes - WITHOUT site layout */}
                      <Route path="/auth" element={
                        <Suspense fallback={<PageLoader />}>
                          <Auth />
                        </Suspense>
                      } />
                      
                      {/* Public Routes - WITH site layout */}
                      <Route path="/*" element={
                        <Layout>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              {/* Portuguese Routes (Default - no prefix) */}
                              <Route path="/" element={<Home />} />
                              <Route path="/servicos" element={<Services />} />
                              <Route path="/servicos/software-apps" element={<SoftwareApps />} />
                              <Route path="/servicos/automacao-ia" element={<AutomacaoIA />} />
                              <Route path="/servicos/jogos-gamificacao" element={<JogosGamificacao />} />
                              <Route path="/servicos/consultoria" element={<Consultoria />} />
                              <Route path="/cases" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Cases</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
                              <Route path="/lab" element={<Lab />} />
                              <Route path="/lab/workshops/:slug" element={<LabWorkshop />} />
                              <Route path="/craft" element={<Craft />} />
                              <Route path="/craft/ideias/:slug" element={<CraftIdea />} />
                              <Route path="/craft/portfolio" element={<CraftPortfolio />} />
                              <Route path="/conteudo" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Conteúdo</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
                              <Route path="/sobre" element={<NewAbout />} />
                              <Route path="/equipe" element={<Team />} />
                              <Route path="/team/:slug/curriculum" element={<TeamCurriculum />} />
                              <Route path="/carreiras" element={<Careers />} />
                              <Route path="/contato" element={<Contact />} />
                              <Route path="/obrigado" element={<ThankYou />} />
                              <Route path="/busca" element={<Search />} />
                              <Route path="/erro-500" element={<ServerError />} />
                              <Route path="/privacidade" element={<Privacy />} />
                              <Route path="/termos" element={<Terms />} />
                              <Route path="/cookies" element={<CookiePolicy />} />
                              
                              {/* English Routes (with /en prefix) */}
                              <Route path="/en" element={<Home />} />
                              <Route path="/en/services" element={<Services />} />
                              <Route path="/en/services/software-apps" element={<SoftwareApps />} />
                              <Route path="/en/services/automation-ai" element={<AutomacaoIA />} />
                              <Route path="/en/services/games-gamification" element={<JogosGamificacao />} />
                              <Route path="/en/services/consulting" element={<Consultoria />} />
                              <Route path="/en/cases" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Cases</h1><p className="mt-4">Under development...</p></div>} />
                              <Route path="/en/lab" element={<Lab />} />
                              <Route path="/en/lab/workshops/:slug" element={<LabWorkshop />} />
                              <Route path="/en/craft" element={<Craft />} />
                              <Route path="/en/craft/ideas/:slug" element={<CraftIdea />} />
                              <Route path="/en/craft/portfolio" element={<CraftPortfolio />} />
                              <Route path="/en/content" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Content</h1><p className="mt-4">Under development...</p></div>} />
                              <Route path="/en/about" element={<NewAbout />} />
                              <Route path="/en/team" element={<Team />} />
                              <Route path="/en/team/:slug/curriculum" element={<TeamCurriculum />} />
                              <Route path="/en/careers" element={<Careers />} />
                              <Route path="/en/contact" element={<Contact />} />
                              <Route path="/en/thank-you" element={<ThankYou />} />
                              <Route path="/en/search" element={<Search />} />
                              <Route path="/en/server-error" element={<ServerError />} />
                              <Route path="/en/privacy" element={<Privacy />} />
                              <Route path="/en/terms" element={<Terms />} />
                              <Route path="/en/cookies" element={<CookiePolicy />} />
                              
                              {/* Catch-all for 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </Layout>
                      } />
                    </Routes>
                    <QualificationTrigger />
                    <ConsentBanner />
                  </BrowserRouter>
                </ErrorBoundary>
              </QualificationProvider>
            </TranslationProvider>
          </AuthProvider>
        </ConsentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;