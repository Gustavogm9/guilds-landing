import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";
import SoftwareApps from "./pages/SoftwareApps";
import AutomacaoIA from "./pages/AutomacaoIA";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/servicos/software-apps" element={<SoftwareApps />} />
            <Route path="/servicos/automacao-ia" element={<AutomacaoIA />} />
            <Route path="/servicos/jogos-gamificacao" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Jogos & Gamificação</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
            <Route path="/servicos/consultoria" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Consultoria</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
            <Route path="/cases" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Cases</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
            <Route path="/lab" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Guilds Lab</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
            <Route path="/craft" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Guilds Craft</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
            <Route path="/conteudo" element={<div className="min-h-screen py-24 container"><h1 className="text-4xl font-bold">Conteúdo</h1><p className="mt-4">Em desenvolvimento...</p></div>} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
