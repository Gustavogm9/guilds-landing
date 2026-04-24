import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QualificationButton } from "@/components/forms/QualificationButton";
import { ArrowLeft, ExternalLink, Blocks, CheckCircle2 } from "lucide-react";
import { portfolioCases } from "@/data/cases";
import { SEOHead } from "@/components/seo/SEOHead";

const Cases = () => {
  const [activeFilter, setActiveFilter] = useState<string>("Todos");

  // Extrair setores únicos para os filtros
  const sectors = useMemo(() => {
    const uniqueSectors = new Set(portfolioCases.map(c => c.sector));
    return ["Todos", ...Array.from(uniqueSectors).sort()];
  }, []);

  const filteredCases = useMemo(() => {
    if (activeFilter === "Todos") return portfolioCases;
    return portfolioCases.filter(c => c.sector === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <SEOHead 
        title="Portfólio de Projetos | Guilds" 
        description="Conheça os ecossistemas, automações e inteligências artificiais construídas pela equipe de engenharia da Guilds."
      />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 pt-24 pb-24">
        
        {/* Header / Hero */}
        <div className="container mx-auto px-6 max-w-6xl mb-16">
          <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a Home
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Resultados reais.<br />Números mensuráveis.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Nosso portfólio de plataformas, integrações e Inteligências Artificiais em produção. 
            Não somos teóricos — nós construímos as engrenagens da sua operação.
          </p>
        </div>

        {/* Filtros */}
        <div className="container mx-auto px-6 max-w-6xl mb-12">
          <div className="flex flex-wrap gap-2">
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => setActiveFilter(sector)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeFilter === sector 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Projetos */}
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map(project => (
              <div key={project.id} className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col h-full hover:bg-slate-900 transition-colors group">
                
                <div className="flex justify-between items-start mb-6">
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    {project.sector}
                  </Badge>
                  {project.isLive ? (
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Em Produção
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10 gap-1">
                      <Blocks className="w-3 h-3" /> MVP / Proposto
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                  {project.shortDesc}
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 mb-6">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-1 tracking-wider">O Resultado (Impacto)</span>
                  <span className="text-sm text-white font-medium leading-snug">{project.impact}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-xs font-medium text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800/50">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Botão Condicional para Projetos Reais Liberados */}
                <div className="mt-auto pt-4 border-t border-slate-800/50">
                  {project.realProjectLink ? (
                    <Button asChild variant="default" className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                      <a href={project.realProjectLink} target="_blank" rel="noopener noreferrer">
                        Ver Projeto Online <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" disabled className="w-full text-slate-500 bg-slate-900/50 cursor-not-allowed">
                      Acesso Interno B2B
                    </Button>
                  )}
                </div>

              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-24 text-slate-500">
              Nenhum projeto encontrado para este filtro.
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 max-w-4xl mt-24 text-center">
          <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl font-black text-white mb-4">Sua operação precisa de um ecossistema assim?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Seja para automação de tarefas manuais ou para a construção de um portal completo para seus clientes. Nós desenhamos e construímos.
            </p>
            <QualificationButton size="lg" className="bg-white hover:bg-slate-200 text-slate-900 font-bold h-14 px-8 rounded-xl">
              Agendar Discovery B2B
            </QualificationButton>
          </div>
        </div>

      </div>
    </>
  );
};

export default Cases;
