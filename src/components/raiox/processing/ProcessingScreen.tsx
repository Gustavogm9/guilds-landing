import { useEffect, useState } from 'react';
import { supabaseRaiox } from '@/lib/supabase-raiox';

const PROCESSING_STEPS = [
  { label: 'Analisando respostas', icon: '📊', delay: 0 },
  { label: 'Calculando score G-FORGE', icon: '⚡', delay: 2000 },
  { label: 'Cruzando com benchmarks do setor', icon: '📈', delay: 5000 },
  { label: 'Gerando narrativa personalizada', icon: '✍️', delay: 8000 },
  { label: 'Montando plano de ação', icon: '🎯', delay: 12000 },
  { label: 'Finalizando relatório', icon: '✅', delay: 16000 },
];

export function ProcessingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = PROCESSING_STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i), step.delay)
    );

    // Invoke Edge Function 'raiox-generate-report'
    const runEdgeFunction = async () => {
      try {
        const { data: { session } } = await supabaseRaiox.auth.getSession();
        if (!session?.user) return;

        const { data: diagnostic } = await supabaseRaiox
          .from('diagnostics')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('status', 'processing')
          .single();

        if (diagnostic?.id) {
          // Invoke the Edge Function to generate the report and update status
          await supabaseRaiox.functions.invoke('raiox-generate-report', {
            body: { diagnosticId: diagnostic.id }
          });
        }
      } catch (err) {
        console.error("Error invoking edge function:", err);
      }
    };

    runEdgeFunction();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center py-16 animate-in fade-in duration-700">
      {/* Animated rings */}
      <div className="relative w-32 h-32 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full border-2 border-blue-500/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-blue-500/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-pulse">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="white" strokeWidth="2"/>
              <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="white" strokeWidth="2" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-display text-white mb-3">
        Processando Diagnóstico
      </h2>
      <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">
        Nossa engine de IA está analisando suas respostas e cruzando com dados de <strong className="text-slate-200">47 projetos G-FORGE</strong> realizados.
      </p>

      {/* Processing steps */}
      <div className="text-left space-y-3">
        {PROCESSING_STEPS.map((step, i) => (
          <div 
            key={step.label}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
              i < activeStep 
                ? 'bg-blue-500/5 border border-blue-500/10' 
                : i === activeStep 
                  ? 'bg-blue-500/10 border border-blue-500/20 shadow-sm' 
                  : 'opacity-30'
            }`}
          >
            <span className="text-lg">{step.icon}</span>
            <span className={`text-sm font-medium ${
              i <= activeStep ? 'text-slate-200' : 'text-slate-500'
            }`}>
              {step.label}
            </span>
            <div className="flex-1" />
            {i < activeStep && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-400 animate-in fade-in duration-300">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i === activeStep && (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-600 mt-8">
        Isso pode levar de 1 a 3 minutos. Não feche esta aba.
      </p>
    </div>
  );
}
