import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QualificationButton } from "@/components/forms/QualificationButton";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  AlertTriangle,
  Users,
  BarChart3,
  Clock,
  Rocket,
  Zap,
  BookOpen,
  Layers,
} from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";

const Home = () => {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
        {/* 1. HERO SECTION */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden border-b border-white/5">
          {/* Subtle Glow Backgrounds */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl pointer-events-none">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-6 max-w-5xl text-center">
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-8 px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">
              Consultoria em Adoção Digital
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
              Sua equipe vai{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                realmente usar
              </span>
              <br className="hidden md:block" />o sistema que você vai
              implementar.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              A Guilds aplica o <strong>G-FORGE™</strong> — metodologia que
              garante <strong>90%+ de adoção</strong> em PMEs de 20 a 150
              funcionários. Esqueça as planilhas paralelas. Entregamos ROI
              mensurável em 90 dias.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 rounded-xl font-bold w-full sm:w-auto"
              >
                <Link to="/raio-x">
                  Raio-X G-FORGE Gratuito
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <QualificationButton
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-xl font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white w-full sm:w-auto"
              >
                Agendar Discovery B2B
              </QualificationButton>
            </div>
          </div>
        </section>

        {/* 2. O PROBLEMA (A DOR) */}
        <section className="py-24 bg-slate-900/50 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                Você implementou o sistema.
                <br />
                <span className="text-red-400">
                  A equipe voltou para a planilha.
                </span>
              </h2>
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 max-w-2xl mx-auto p-4 rounded-xl text-sm font-medium flex items-start gap-3 text-left">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Dado âncora:</strong> 7 em cada 10 implementações
                  digitais falham por falta de método de adoção — não por causa
                  da tecnologia falha (McKinsey, 2026).
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <Users className="w-10 h-10 text-slate-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Adoção abaixo de 30%</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Você paga licenças caras, mas os funcionários continuam usando
                  e-mail e WhatsApp para os processos críticos.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <TrendingUp className="w-10 h-10 text-slate-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Investimento sem ROI</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  O sistema era pra economizar tempo, mas gerou mais trabalho
                  manual para "alimentar o software".
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <Shield className="w-10 h-10 text-slate-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Equipe resiste</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  "O jeito antigo era mais rápido". Sem um método de gestão da
                  mudança, a cultura engole o sistema.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MÉTODO G-FORGE */}
        <section className="py-24 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 mb-6 px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">
                A Nossa Solução
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                Metodologia G-FORGE™
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Ciência comportamental aplicada à digitalização de PMEs. Não
                entregamos apenas software, construímos o hábito de uso.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                {
                  l: "F",
                  title: "Foundry",
                  desc: "Mapear antes de implementar.",
                },
                {
                  l: "O",
                  title: "Observe",
                  desc: "Entender como a equipe aprende.",
                },
                {
                  l: "R",
                  title: "Refine",
                  desc: "Ajuste contínuo até o hábito formar.",
                },
                {
                  l: "G",
                  title: "Generate",
                  desc: "Operação gera resultado sozinha.",
                },
                { l: "E", title: "Empower", desc: "Equipe defende o sistema." },
                {
                  l: "G",
                  title: "Govern",
                  desc: "Escala sem depender de heróis.",
                },
              ].map((phase, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-2xl font-black mx-auto mb-4 border border-blue-500/20">
                    {phase.l}
                  </div>
                  <h4 className="font-bold text-white mb-2">{phase.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {phase.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/metodo"
                className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center text-sm uppercase tracking-wider"
              >
                Ver o método detalhado <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. RESULTADOS & NÚMEROS */}
        <section className="py-24 bg-slate-900/30 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl md:text-6xl font-black text-white mb-4">
                  90 <span className="text-blue-500">%+</span>
                </div>
                <div className="text-slate-400 font-medium">
                  De adoção média nos projetos executados pela Guilds.
                </div>
              </div>
              <div className="relative before:hidden md:before:block before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-px before:h-16 before:bg-slate-800 after:hidden md:after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-16 after:bg-slate-800">
                <div className="text-5xl md:text-6xl font-black text-white mb-4">
                  14 <span className="text-blue-500 text-3xl">dias</span>
                </div>
                <div className="text-slate-400 font-medium">
                  Para ver os primeiros resultados e métricas.
                </div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-black text-white mb-4">
                  20 <span className="text-blue-500">+</span>
                </div>
                <div className="text-slate-400 font-medium">
                  PMEs otimizadas em múltiplos setores (Brasil e Canadá).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4.5. ESCOPO TÉCNICO & PORTFÓLIO */}
        <section className="py-24 border-b border-white/5 bg-slate-950">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-6 px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">
                O que construímos
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                Ecossistemas de Alta Performance
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Não somos apenas consultores teóricos. Nossa engenharia constrói
                e integra desde automações de back-office até Inteligências
                Artificiais e CRMs completos.
              </p>
            </div>

            {/* Escopo Técnico */}
            <div className="grid md:grid-cols-3 gap-4 mb-16">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <Zap className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">
                  Automação de Processos (RPA)
                </h3>
                <p className="text-sm text-slate-400">
                  Eliminação de tarefas manuais repetitivas via integrações
                  avançadas.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <Rocket className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">
                  Sistemas sob Medida (SaaS)
                </h3>
                <p className="text-sm text-slate-400">
                  Desenvolvimento de portais de clientes, CRMs customizados e
                  dashboards B2B.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <BookOpen className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">
                  Soluções de Inteligência Artificial
                </h3>
                <p className="text-sm text-slate-400">
                  Agentes conversacionais para WhatsApp, IA para análise de
                  dados e qualificação.
                </p>
              </div>
            </div>

            {/* Portfólio (Casos) */}
            <h3 className="text-2xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">
              Projetos Executados (Destaques)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    LegalTech
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  CRM Jurídico + Qualificação IA
                </h4>
                <p className="text-sm text-slate-400 mb-6">
                  Substituição de 3 ferramentas (Inbox, CRM, E-sign) por uma
                  única plataforma. Um robô de IA qualifica leads 24/7 via
                  WhatsApp e gera contratos automaticamente para os advogados.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">
                    Impacto
                  </span>
                  <span className="text-sm text-emerald-300 font-medium">
                    Economia de R$ 3.000+/mês em assinaturas e atendimento 24/7.
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    HealthTech
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Motor de Engajamento de Pacientes
                </h4>
                <p className="text-sm text-slate-400 mb-6">
                  Portal completo para clínicas com um agente de IA no WhatsApp
                  que acompanha os pacientes diariamente, responde dúvidas sobre
                  a dieta e emite alertas de risco de abandono.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">
                    Impacto
                  </span>
                  <span className="text-sm text-blue-300 font-medium">
                    Redução de abandono e previsibilidade de recompra no 3º mês.
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                    PropTech / Real Estate
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Inteligência de Mercado e Dados
                </h4>
                <p className="text-sm text-slate-400 mb-6">
                  Pipeline de extração automática de dados de 7+ portais
                  imobiliários. A inteligência cruza os dados e os envia a um
                  dashboard interativo para análise de viabilidade e tendências.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">
                    Impacto
                  </span>
                  <span className="text-sm text-amber-300 font-medium">
                    Extração de milhares de pontos de dados sem intervenção
                    humana.
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-900 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    SST / Saúde Ocupacional
                  </Badge>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Plataforma White-label B2B2C
                </h4>
                <p className="text-sm text-slate-400 mb-6">
                  SaaS onde clínicas de SST administram empresas, médicos e
                  funcionários. Geração de relatórios, leitura via QR Code e
                  gestão de conformidade em um só ambiente.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">
                    Impacto
                  </span>
                  <span className="text-sm text-indigo-300 font-medium">
                    Digitalização total da operação da clínica para os clientes
                    corporativos.
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                variant="outline"
                className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Link to="/cases">
                  Ver Portfólio Completo (16 Projetos){" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. ICP - PARA QUEM É */}
        <section className="py-24 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                Isso é para você?
              </h2>
              <p className="text-lg text-slate-400">
                Criado para gestores de empresas de 20 a 150 funcionários.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
                <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-8">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <p className="text-xl font-bold text-white mb-4">
                  "Você já investiu em sistema. A equipe não aderiu."
                </p>
                <p className="text-slate-400">
                  Você quer entender exatamente por que o investimento anterior
                  virou peso morto e precisa resolver de vez antes de comprar um
                  novo software.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-8">
                  <Layers className="w-7 h-7" />
                </div>
                <p className="text-xl font-bold text-white mb-4">
                  "Sua empresa cresce, mas o processo vive na sua cabeça."
                </p>
                <p className="text-slate-400">
                  Você é o gargalo. Se você tirar 15 dias de férias, a operação
                  inteira trava. Você não consegue escalar porque a operação
                  depende do seu micro-gerenciamento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PRODUTOS DE ENTRADA (RAIO-X e DIAGNÓSTICO) */}
        <section className="py-24 bg-slate-900/50 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                Como começar
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Dois caminhos diretos para transformar a sua operação.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Produto A */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">
                      Raio-X de Adoção
                    </h3>
                    <p className="text-blue-400 font-bold">R$ 97,00</p>
                  </div>
                  <div className="bg-slate-800 text-slate-300 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                    Automático
                  </div>
                </div>

                <p className="text-slate-400 mb-8 h-12">
                  Um diagnóstico instantâneo para quem precisa descobrir o maior
                  gargalo operacional agora.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-blue-500" /> 15 minutos para
                    responder
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <BarChart3 className="w-4 h-4 text-blue-500" /> Score
                    G-FORGE™ de Maturidade
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <AlertTriangle className="w-4 h-4 text-blue-500" /> Top 3
                    maiores gargalos da operação
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Zap className="w-4 h-4 text-blue-500" /> Roadmap prático de
                    90 dias
                  </li>
                </ul>

                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl"
                >
                  <Link to="/raio-x">Fazer o Raio-X</Link>
                </Button>
              </div>

              {/* Produto B */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-blue-900/10">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">
                      Diagnóstico Completo
                    </h3>
                    <p className="text-blue-400 font-bold">R$ 2.500,00</p>
                  </div>
                  <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                    Recomendado
                  </div>
                </div>

                <p className="text-slate-400 mb-8 h-12 relative z-10">
                  Abatível se fechar um projeto em 15 dias. Ideal antes de
                  investir R$ 15k+ em sistemas.
                </p>

                <ul className="space-y-4 mb-8 relative z-10">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-blue-400" /> 2h de Call
                    profunda com Gustavo Macedo
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <BookOpen className="w-4 h-4 text-blue-400" /> Relatório
                    G-FORGE de 15 páginas
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Rocket className="w-4 h-4 text-blue-400" /> Proposta de
                    arquitetura de integração
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Shield className="w-4 h-4 text-blue-400" /> Redução direta
                    de risco de software
                  </li>
                </ul>

                <QualificationButton
                  className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold h-12 rounded-xl relative z-10"
                >
                  Solicitar Consultoria
                </QualificationButton>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CTA FINAL */}
        <section className="py-24 bg-blue-600 border-t border-blue-500">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Qual é o maior gargalo
              <br />
              da sua operação hoje?
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              5 minutos para descobrir. 100% gratuito.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-slate-950 hover:bg-slate-900 text-white font-bold h-14 px-8 rounded-xl shadow-xl shadow-slate-950/20"
              >
                <Link to="/raio-x">
                  Fazer o Raio-X <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <QualificationButton
                variant="outline"
                size="lg"
                className="border-none bg-white hover:bg-slate-200 text-blue-900 font-bold h-14 px-8 rounded-xl"
              >
                Agendar Discovery B2B
              </QualificationButton>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
