import { useState } from 'react';
import { RaioXAuth } from '../auth/RaioXAuth';
import { useNavigate } from 'react-router-dom';

export function RaioXIntro() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <RaioXAuth />;
  }

  return (
    <div className="relative">
      {/* Hero section */}
      <div className="max-w-3xl mx-auto text-center py-16 animate-in fade-in duration-700">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 text-blue-300 text-[11px] font-bold tracking-wider uppercase mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="2"/></svg>
          Diagnóstico Estratégico G-FORGE™
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white leading-[1.08] tracking-tight mb-6">
          Descubra quanto sua<br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            ineficiência está custando
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Em <strong className="text-slate-200">~5 minutos</strong>, nosso motor de diagnóstico cruza suas respostas com{' '}
          <strong className="text-slate-200">benchmarks de 47 projetos G-FORGE</strong> e gera um relatório executivo personalizado com score, perda financeira estimada e plano de ação.
        </p>

        <button
          onClick={() => setShowAuth(true)}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          Fazer Raio-X Gratuito
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <p className="text-xs text-slate-600 mt-4">
          Gratuito. Sem cartão de crédito. Resultado em minutos.
        </p>
      </div>

      {/* What you get */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 mb-16">
        {[
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#60A5FA" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/></svg>
            ),
            title: 'Score G-FORGE™',
            desc: 'Nota de 0 a 100 em 4 dimensões (Processos, Sistemas, Dados, Pessoas) com radar visual.',
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M17 7l-5 5-5-5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ),
            title: 'Perda Financeira',
            desc: 'Estimativa em R$ da ineficiência anual, discriminada por categoria com fórmulas transparentes.',
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ),
            title: 'Plano de Ação',
            desc: 'Roadmap priorizado com metas SMART, KPIs sugeridos e análise de mercado personalizada.',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-5 rounded-2xl bg-[#0B1120] border border-white/8 hover:border-white/15 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="max-w-2xl mx-auto text-center border-t border-white/5 pt-10 pb-8">
        <p className="text-slate-500 text-xs mb-4 font-medium tracking-wider uppercase">Metodologia validada com</p>
        <div className="flex items-center justify-center gap-8 text-slate-600">
          <div className="text-center">
            <div className="text-2xl font-black text-blue-400">47</div>
            <div className="text-[10px] mt-1">Projetos G-FORGE</div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="text-center">
            <div className="text-2xl font-black text-blue-400">R$ 18M+</div>
            <div className="text-[10px] mt-1">em ineficiência mapeada</div>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="text-center">
            <div className="text-2xl font-black text-blue-400">92%</div>
            <div className="text-[10px] mt-1">de retenção pós-diagnóstico</div>
          </div>
        </div>
      </div>
    </div>
  );
}
