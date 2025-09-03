import React, { useEffect } from "react";
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
import Home from "./pages/Home";
import Services from "./pages/Services";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NewAbout from "./pages/NewAbout";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import SoftwareApps from "./pages/SoftwareApps";
import AutomacaoIA from "./pages/AutomacaoIA";
import JogosGamificacao from "./pages/JogosGamificacao";
import Consultoria from "./pages/Consultoria";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Lab from "./pages/Lab";
import LabWorkshop from "./pages/LabWorkshop";
import Craft from "./pages/Craft";
import CraftIdea from "./pages/CraftIdea";
import CraftPortfolio from "./pages/CraftPortfolio";

const queryClient = new QueryClient();

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
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <SkipLinks />
                  <SEOHead />
                  <SitemapGenerator />
                  <ScrollToTop />
                  <Layout>
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
                <Route path="/carreiras" element={<Careers />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/obrigado" element={<ThankYou />} />
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
                <Route path="/en/careers" element={<Careers />} />
                <Route path="/en/contact" element={<Contact />} />
                <Route path="/en/thank-you" element={<ThankYou />} />
                <Route path="/en/privacy" element={<Privacy />} />
                <Route path="/en/terms" element={<Terms />} />
                <Route path="/en/cookies" element={<CookiePolicy />} />
                
                {/* Admin and Auth Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <QualificationTrigger />
              <ConsentBanner />
                  </Layout>
                </BrowserRouter>
              </QualificationProvider>
            </TranslationProvider>
          </AuthProvider>
        </ConsentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
