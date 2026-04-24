import { useState, useEffect } from 'react';
import { Block1Profile, Block2Systems, Block3Commercial, Block4Brand, Block5Goals } from './Blocks';
import { useDiagnostic } from '@/hooks/useDiagnostic';
import { Loader2 } from 'lucide-react';

const STEP_LABELS = [
  { num: 1, label: 'Perfil' },
  { num: 2, label: 'Sistemas' },
  { num: 3, label: 'Comercial' },
  { num: 4, label: 'Marca' },
  { num: 5, label: 'Objetivos' },
];

export function OnboardingShell() {
  const { diagnostic, loading, updateCurrentStep } = useDiagnostic();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  useEffect(() => {
    if (diagnostic?.current_step && diagnostic.current_step <= totalSteps) {
      setCurrentStep(diagnostic.current_step);
    }
  }, [diagnostic]);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      await updateCurrentStep(nextStep);
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Block 5 handles its own "finish" flow
  };

  const handlePrev = async () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      await updateCurrentStep(prevStep);
      setCurrentStep(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading || !diagnostic) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {/* Segmented Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-1 mb-3">
          {STEP_LABELS.map((step) => (
            <div key={step.num} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${currentStep === step.num 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : currentStep > step.num
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/5 text-slate-600 border border-white/10'
                  }
                `}
              >
                {currentStep > step.num ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : step.num}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                currentStep >= step.num ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {/* Connector bars */}
        <div className="flex gap-1 px-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: currentStep > i ? '100%' : currentStep === i ? '50%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Block Content */}
      <div className="bg-[#0B1120] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl min-h-[400px]">
        {currentStep === 1 && <Block1Profile diagnosticId={diagnostic.id} onNext={handleNext} />}
        {currentStep === 2 && <Block2Systems diagnosticId={diagnostic.id} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <Block3Commercial diagnosticId={diagnostic.id} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 4 && <Block4Brand diagnosticId={diagnostic.id} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 5 && <Block5Goals diagnosticId={diagnostic.id} onPrev={handlePrev} />}
      </div>

      {/* Trust indicators */}
      <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/></svg>
          Dados protegidos (LGPD)
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Salvo automaticamente
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          ~5 min para completar
        </span>
      </div>
    </div>
  );
}
