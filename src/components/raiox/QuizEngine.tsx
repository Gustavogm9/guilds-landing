import React, { useState } from 'react';
import { QuizAnswers, calcScore, calcLoss, getDynamicRoadmap, getGaps, getPhase, getBenchmark } from '@/utils/raiox-logic';
import { ChevronRight, ChevronLeft, Check, Lock, ShieldCheck, Mail, User, Sparkles, Building2, BarChart3, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Extracted UI Components
const OptionCard = ({ selected, onClick, label, isSmall }: { selected: boolean, onClick: () => void, label: string, isSmall?: boolean }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-blue-500/50 ${selected ? 'border-blue-500 bg-blue-500/10' : ''} ${isSmall ? 'p-3' : ''}`}
  >
    <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-blue-500 bg-blue-500' : 'border-white/30'}`}>
      {selected && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}>{label}</span>
  </div>
);

const CheckCard = ({ selected, onClick, label }: { selected: boolean, onClick: () => void, label: string }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-blue-500/50 ${selected ? 'border-blue-500 bg-blue-500/10' : ''}`}
  >
    <div className={`w-5 h-5 flex-shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-all ${selected ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}>
      {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
    </div>
    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-slate-300'}`}>{label}</span>
  </div>
);

export function QuizEngine() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [leadData, setLeadData] = useState({ name: '', email: '' });

  const setAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const toggleCheck = (key: string, value: string) => {
    setAnswers(prev => {
      const current = (prev[key] as string[]) || [];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [key]: isSelected ? current.filter(v => v !== value) : [...current, value]
      };
    });
    setError('');
  };

  const getRequiredForStep = (s: number) => {
    switch(s) {
      case 1: return ['q_setor', 'q_funcionarios', 'q_faturamento'];
      case 2: return ['q_adocao', 'q_fantasmas', 'q_integracao'];
      case 3: return ['q_horas', 'q_processos', 'q_relatorios'];
      case 4: return ['q_historico', 'q_motivo', 'q_dedicado'];
      case 5: return ['q_setor1', 'q_setor2', 'q_setor3'];
      case 6: return ['lead_name', 'lead_email']; // Lead Capture
      default: return [];
    }
  };

  const handleNext = () => {
    if (step === 6) {
      if (!leadData.name || !leadData.email || !leadData.email.includes('@')) {
        setError('Por favor, preencha um nome e e-mail válido.');
        return;
      }
      startProcessing();
      return;
    }

    const required = getRequiredForStep(step);
    const missing = required.filter(q => !answers[q]);
    
    if (missing.length > 0) {
      setError('Responda todas as perguntas para continuar.');
      return;
    }
    setError('');
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startProcessing = () => {
    setIsProcessing(true);
    // Simulate API call and processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 4500);
  };

  if (showResults) {
    return <QuizResultsPremium answers={answers} />;
  }

  if (isProcessing) {
    return <QuizProcessing />;
  }

  const progress = (step / 6) * 100;
  const sectionNames = ['Perfil', 'Sistemas', 'Processos', 'Histórico', 'Setor', 'Finalização'];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header / Progress */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-widest text-sm text-slate-100">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            GUILDS
          </div>
          <div className="flex-1 ml-8 max-w-[240px]">
            <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              <span>{sectionNames[step-1]}</span>
              <span>Seção {step} de 6</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out" style={{ width: `\${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-10 pb-24 px-6">
        <div className="w-full max-w-2xl">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Perfil da empresa</h2>
              <p className="text-slate-400 mb-10">Para calibrar os resultados ao seu contexto real.</p>
              
              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Qual é o setor principal da sua empresa?</div>
                <div className="grid gap-3">
                  <OptionCard selected={answers.q_setor === 'saude_ocup'} onClick={() => setAnswer('q_setor', 'saude_ocup')} label="Saúde Ocupacional / Medicina do Trabalho" />
                  <OptionCard selected={answers.q_setor === 'clinica'} onClick={() => setAnswer('q_setor', 'clinica')} label="Clínica Médica / Hospital / Saúde" />
                  <OptionCard selected={answers.q_setor === 'fintech'} onClick={() => setAnswer('q_setor', 'fintech')} label="Fintech / Seguros / Financeiro" />
                  <OptionCard selected={answers.q_setor === 'operacoes'} onClick={() => setAnswer('q_setor', 'operacoes')} label="Operações / Logística / Serviços" />
                  <OptionCard selected={answers.q_setor === 'outro'} onClick={() => setAnswer('q_setor', 'outro')} label="Outro setor" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Quantos funcionários tem sua empresa?</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <OptionCard isSmall selected={answers.q_funcionarios === '10-20'} onClick={() => setAnswer('q_funcionarios', '10-20')} label="10 a 20" />
                  <OptionCard isSmall selected={answers.q_funcionarios === '21-50'} onClick={() => setAnswer('q_funcionarios', '21-50')} label="21 a 50" />
                  <OptionCard isSmall selected={answers.q_funcionarios === '51-100'} onClick={() => setAnswer('q_funcionarios', '51-100')} label="51 a 100" />
                  <OptionCard isSmall selected={answers.q_funcionarios === '101-150'} onClick={() => setAnswer('q_funcionarios', '101-150')} label="101 a 150" />
                  <OptionCard isSmall selected={answers.q_funcionarios === '150mais'} onClick={() => setAnswer('q_funcionarios', '150mais')} label="Mais de 150" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Qual é o faturamento anual aproximado?</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <OptionCard isSmall selected={answers.q_faturamento === 'ate1m'} onClick={() => setAnswer('q_faturamento', 'ate1m')} label="Até R$ 1 milhão" />
                  <OptionCard isSmall selected={answers.q_faturamento === '1m-5m'} onClick={() => setAnswer('q_faturamento', '1m-5m')} label="R$ 1 a 5 milhões" />
                  <OptionCard isSmall selected={answers.q_faturamento === '5m-20m'} onClick={() => setAnswer('q_faturamento', '5m-20m')} label="R$ 5 a 20 milhões" />
                  <OptionCard isSmall selected={answers.q_faturamento === 'acima20m'} onClick={() => setAnswer('q_faturamento', 'acima20m')} label="Acima de R$ 20 milhões" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Seus sistemas digitais</h2>
              <p className="text-slate-400 mb-10">Vamos mapear o que existe e como a equipe realmente usa.</p>
              
              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-2">Quais sistemas sua empresa utiliza?</div>
                <div className="text-xs text-slate-500 mb-4">(pode marcar mais de um)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CheckCard selected={(answers.q_sistemas as string[] || []).includes('crm')} onClick={() => toggleCheck('q_sistemas', 'crm')} label="CRM / Gestão" />
                  <CheckCard selected={(answers.q_sistemas as string[] || []).includes('erp')} onClick={() => toggleCheck('q_sistemas', 'erp')} label="ERP / Sistema" />
                  <CheckCard selected={(answers.q_sistemas as string[] || []).includes('financeiro')} onClick={() => toggleCheck('q_sistemas', 'financeiro')} label="Financeiro" />
                  <CheckCard selected={(answers.q_sistemas as string[] || []).includes('rh')} onClick={() => toggleCheck('q_sistemas', 'rh')} label="RH / Folha" />
                  <CheckCard selected={(answers.q_sistemas as string[] || []).includes('bi')} onClick={() => toggleCheck('q_sistemas', 'bi')} label="BI / Relatórios" />
                  <CheckCard selected={(answers.q_sistemas as string[] || []).includes('automacao')} onClick={() => toggleCheck('q_sistemas', 'automacao')} label="Automações" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Qual % da sua equipe usa os sistemas diariamente como deveria?</div>
                <div className="grid gap-3">
                  <OptionCard isSmall selected={answers.q_adocao === 'menos20'} onClick={() => setAnswer('q_adocao', 'menos20')} label="Menos de 20% da equipe" />
                  <OptionCard isSmall selected={answers.q_adocao === '20-40'} onClick={() => setAnswer('q_adocao', '20-40')} label="20% a 40% da equipe" />
                  <OptionCard isSmall selected={answers.q_adocao === '40-60'} onClick={() => setAnswer('q_adocao', '40-60')} label="40% a 60% da equipe" />
                  <OptionCard isSmall selected={answers.q_adocao === '60-80'} onClick={() => setAnswer('q_adocao', '60-80')} label="60% a 80% da equipe" />
                  <OptionCard isSmall selected={answers.q_adocao === 'mais80'} onClick={() => setAnswer('q_adocao', 'mais80')} label="Mais de 80% da equipe" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Quantos sistemas sua empresa paga mas a equipe raramente usa?</div>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard isSmall selected={answers.q_fantasmas === 'nenhum'} onClick={() => setAnswer('q_fantasmas', 'nenhum')} label="Nenhum" />
                  <OptionCard isSmall selected={answers.q_fantasmas === '1'} onClick={() => setAnswer('q_fantasmas', '1')} label="1 sistema" />
                  <OptionCard isSmall selected={answers.q_fantasmas === '2'} onClick={() => setAnswer('q_fantasmas', '2')} label="2 sistemas" />
                  <OptionCard isSmall selected={answers.q_fantasmas === '3mais'} onClick={() => setAnswer('q_fantasmas', '3mais')} label="3 ou mais" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Seus sistemas se integram ou sua equipe copia dados manualmente?</div>
                <div className="grid gap-3">
                  <OptionCard isSmall selected={answers.q_integracao === 'sim'} onClick={() => setAnswer('q_integracao', 'sim')} label="Sim, a maioria está integrada automaticamente" />
                  <OptionCard isSmall selected={answers.q_integracao === 'parcial'} onClick={() => setAnswer('q_integracao', 'parcial')} label="Parcialmente — algumas integrações funcionam" />
                  <OptionCard isSmall selected={answers.q_integracao === 'nao'} onClick={() => setAnswer('q_integracao', 'nao')} label="Não — copiamos dados manualmente entre sistemas" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Processos Manuais</h2>
              <p className="text-slate-400 mb-10">Onde sua equipe trabalha para o processo, em vez do inverso.</p>
              
              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Quantas horas por semana cada funcionário gasta em tarefas repetitivas?</div>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard isSmall selected={answers.q_horas === 'menos2'} onClick={() => setAnswer('q_horas', 'menos2')} label="Menos de 2h" />
                  <OptionCard isSmall selected={answers.q_horas === '2-5'} onClick={() => setAnswer('q_horas', '2-5')} label="2 a 5 horas" />
                  <OptionCard isSmall selected={answers.q_horas === '5-10'} onClick={() => setAnswer('q_horas', '5-10')} label="5 a 10 horas" />
                  <OptionCard isSmall selected={answers.q_horas === 'mais10'} onClick={() => setAnswer('q_horas', 'mais10')} label="Mais de 10h" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Quantos processos críticos ainda rodam em planilha ou WhatsApp?</div>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard isSmall selected={answers.q_processos === 'nenhum'} onClick={() => setAnswer('q_processos', 'nenhum')} label="Nenhum" />
                  <OptionCard isSmall selected={answers.q_processos === '1-2'} onClick={() => setAnswer('q_processos', '1-2')} label="1 a 2 processos" />
                  <OptionCard isSmall selected={answers.q_processos === '3-5'} onClick={() => setAnswer('q_processos', '3-5')} label="3 a 5 processos" />
                  <OptionCard isSmall selected={answers.q_processos === 'mais5'} onClick={() => setAnswer('q_processos', 'mais5')} label="Mais de 5" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Quanto tempo leva para gerar um relatório gerencial completo?</div>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard isSmall selected={answers.q_relatorios === 'automatico'} onClick={() => setAnswer('q_relatorios', 'automatico')} label="Tempo real" />
                  <OptionCard isSmall selected={answers.q_relatorios === 'dias'} onClick={() => setAnswer('q_relatorios', 'dias')} label="Alguns dias" />
                  <OptionCard isSmall selected={answers.q_relatorios === '1semana'} onClick={() => setAnswer('q_relatorios', '1semana')} label="1 semana" />
                  <OptionCard isSmall selected={answers.q_relatorios === 'mais1sem'} onClick={() => setAnswer('q_relatorios', 'mais1sem')} label="Mais de 1 semana" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Histórico e Risco</h2>
              <p className="text-slate-400 mb-10">Padrões do passado determinam os riscos futuros.</p>
              
              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Sua empresa já implementou um sistema que a equipe abandonou?</div>
                <div className="grid gap-3">
                  <OptionCard isSmall selected={answers.q_historico === 'nao'} onClick={() => setAnswer('q_historico', 'nao')} label="Nunca — todos adotados" />
                  <OptionCard isSmall selected={answers.q_historico === '1x'} onClick={() => setAnswer('q_historico', '1x')} label="Sim, uma vez" />
                  <OptionCard isSmall selected={answers.q_historico === 'mais1x'} onClick={() => setAnswer('q_historico', 'mais1x')} label="Sim, mais de uma vez" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Se sim, qual foi o principal motivo?</div>
                <div className="grid gap-3">
                  <OptionCard isSmall selected={answers.q_motivo === 'treinamento'} onClick={() => setAnswer('q_motivo', 'treinamento')} label="Treinamento insuficiente" />
                  <OptionCard isSmall selected={answers.q_motivo === 'processo'} onClick={() => setAnswer('q_motivo', 'processo')} label="Sistema não refletia a realidade" />
                  <OptionCard isSmall selected={answers.q_motivo === 'resistencia'} onClick={() => setAnswer('q_motivo', 'resistencia')} label="Resistência da equipe" />
                  <OptionCard isSmall selected={answers.q_motivo === 'naoaplica'} onClick={() => setAnswer('q_motivo', 'naoaplica')} label="Não se aplica" />
                </div>
              </div>

              <div className="mb-10">
                <div className="text-sm font-bold text-slate-200 mb-4">Existe alguém focado em garantir a adoção de novas tecnologias?</div>
                <div className="grid gap-3">
                  <OptionCard isSmall selected={answers.q_dedicado === 'sim'} onClick={() => setAnswer('q_dedicado', 'sim')} label="Sim — pessoa dedicada" />
                  <OptionCard isSmall selected={answers.q_dedicado === 'parcial'} onClick={() => setAnswer('q_dedicado', 'parcial')} label="Parcialmente — acumula funções" />
                  <OptionCard isSmall selected={answers.q_dedicado === 'nao'} onClick={() => setAnswer('q_dedicado', 'nao')} label="Não — sem responsável" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Especificidades</h2>
              <p className="text-slate-400 mb-10">Últimas perguntas específicas para a sua operação.</p>
              
              {['saude_ocup', 'clinica'].includes(answers.q_setor || '') ? (
                <>
                  <div className="mb-10">
                    <div className="text-sm font-bold text-slate-200 mb-4">Tempo gasto preenchendo registros por atendimento?</div>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard isSmall selected={answers.q_setor1 === 'menos5'} onClick={() => setAnswer('q_setor1', 'menos5')} label="Menos de 5 min" />
                      <OptionCard isSmall selected={answers.q_setor1 === '10-20'} onClick={() => setAnswer('q_setor1', '10-20')} label="10 a 20 min" />
                    </div>
                  </div>
                  <div className="mb-10">
                    <div className="text-sm font-bold text-slate-200 mb-4">Adequação à NR-01 (riscos psicossociais)?</div>
                    <div className="grid gap-3">
                      <OptionCard isSmall selected={answers.q_setor2 === 'adequados'} onClick={() => setAnswer('q_setor2', 'adequados')} label="Sim, adequados" />
                      <OptionCard isSmall selected={answers.q_setor2 === 'naoiniciou'} onClick={() => setAnswer('q_setor2', 'naoiniciou')} label="Não iniciamos" />
                    </div>
                  </div>
                  <div className="mb-10">
                    <div className="text-sm font-bold text-slate-200 mb-4">Sistemas usados por dia pela equipe?</div>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard isSmall selected={answers.q_setor3 === '1'} onClick={() => setAnswer('q_setor3', '1')} label="1 sistema" />
                      <OptionCard isSmall selected={answers.q_setor3 === 'mais5'} onClick={() => setAnswer('q_setor3', 'mais5')} label="Mais de 5" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-10">
                    <div className="text-sm font-bold text-slate-200 mb-4">Tempo de onboarding de um novo cliente?</div>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard isSmall selected={answers.q_setor1 === 'ate2'} onClick={() => setAnswer('q_setor1', 'ate2')} label="Até 2 dias" />
                      <OptionCard isSmall selected={answers.q_setor1 === 'mais14'} onClick={() => setAnswer('q_setor1', 'mais14')} label="Mais de 14 dias" />
                    </div>
                  </div>
                  <div className="mb-10">
                    <div className="text-sm font-bold text-slate-200 mb-4">% de aprovações via e-mail ou WhatsApp?</div>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard isSmall selected={answers.q_setor2 === 'menos20'} onClick={() => setAnswer('q_setor2', 'menos20')} label="Menos de 20%" />
                      <OptionCard isSmall selected={answers.q_setor2 === 'mais80'} onClick={() => setAnswer('q_setor2', 'mais80')} label="Mais de 80%" />
                    </div>
                  </div>
                  <div className="mb-10">
                    <div className="text-sm font-bold text-slate-200 mb-4">Erros por dados desatualizados entre sistemas?</div>
                    <div className="grid grid-cols-2 gap-3">
                      <OptionCard isSmall selected={answers.q_setor3 === 'raramente'} onClick={() => setAnswer('q_setor3', 'raramente')} label="Raramente" />
                      <OptionCard isSmall selected={answers.q_setor3 === 'diario'} onClick={() => setAnswer('q_setor3', 'diario')} label="Diariamente" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-b from-blue-900/40 to-transparent border border-blue-500/20 rounded-2xl p-8 text-center max-w-md mx-auto">
                <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                <h2 className="text-2xl font-black mb-3 tracking-tight text-white">Pronto para o Resultado!</h2>
                <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                  Calculamos o seu Score de Maturidade e a perda financeira anual da sua operação. Para onde devemos enviar o seu relatório?
                </p>
                
                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Seu Nome</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input 
                        value={leadData.name}
                        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                        className="pl-10 bg-slate-900/50 border-slate-700 h-12 text-white placeholder:text-slate-600 focus:border-blue-500" 
                        placeholder="João Silva" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">E-mail Profissional</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <Input 
                        value={leadData.email}
                        onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                        type="email"
                        className="pl-10 bg-slate-900/50 border-slate-700 h-12 text-white placeholder:text-slate-600 focus:border-blue-500" 
                        placeholder="joao@empresa.com.br" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
            {step > 1 ? (
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5" onClick={() => setStep(s => s - 1)}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            ) : <div />}
            
            <div className="flex items-center gap-4">
              {error && <span className="text-red-400 text-sm font-medium animate-in fade-in">{error}</span>}
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-8 rounded-xl">
                {step === 6 ? 'Gerar Meu Raio-X' : 'Continuar'} 
                {step !== 6 && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PROCESSING ANIMATION
// ----------------------------------------------------
function QuizProcessing() {
  const [activeStep, setActiveStep] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s < 4 ? s + 1 : s));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    'Analisando perfil operacional...',
    'Calculando ineficiências em Reais (R$)...',
    'Mapeando gargalos críticos do processo...',
    'Gerando Score de Maturidade G-FORGE...',
    'Montando roadmap de 90 dias...'
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex gap-2 mb-10">
        {['G', 'F', 'O', 'R', 'G', 'E'].map((letter, i) => (
          <div key={i} className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 text-xl font-black transition-all duration-700 ${activeStep >= i * 0.8 ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-700'}`}>
            {letter}
          </div>
        ))}
      </div>
      
      <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-8" />
      <h2 className="text-2xl font-black text-white mb-8">Processando Diagnóstico</h2>
      
      <div className="space-y-4 text-left max-w-sm mx-auto w-full">
        {steps.map((text, i) => (
          <div key={i} className="flex items-center gap-4 text-sm font-medium">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${activeStep > i ? 'bg-green-500' : activeStep === i ? 'bg-blue-500 animate-pulse' : 'bg-slate-800'}`} />
            <span className={activeStep >= i ? 'text-slate-200' : 'text-slate-600'}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// PREMIUM RESULTS & PAYWALL
// ----------------------------------------------------
function QuizResultsPremium({ answers }: { answers: QuizAnswers }) {
  const score = calcScore(answers);
  const loss = calcLoss(answers);
  const phase = getPhase(score);
  const benchmark = getBenchmark(answers.q_setor || '');
  const gaps = getGaps(answers);
  const roadmap = getDynamicRoadmap(score);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [price, setPrice] = useState(97);

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c === 'GUILDS50') {
      setPrice(47);
      setCouponError('');
    } else if (c === 'FREE100' || c === 'LABGUEST') {
      setPrice(0);
      setCouponError('');
      setIsUnlocked(true); // Auto unlock if 100% off
    } else {
      setCouponError('Cupom inválido');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Navbar Result */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold tracking-widest text-sm text-slate-100">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            GUILDS
          </div>
          <div className="text-xs text-slate-500 font-medium">Raio-X Finalizado</div>
        </div>
      </div>

      {/* Hero Teaser */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-b border-white/5 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-6">Diagnóstico de Maturidade Digital</div>
          <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">O custo da ineficiência.</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Perda Anual Estimada</div>
              <div className="text-4xl font-black text-red-400 mb-2">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(loss.total)}
              </div>
              <div className="text-sm text-red-300/70">Em horas manuais, sistemas pagos sem uso e retrabalho.</div>
            </div>
            
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Score G-FORGE™</div>
              <div className="text-4xl font-black text-blue-400 mb-2">{score}/100</div>
              <div className="text-sm text-slate-400">Classificação: <strong className="text-slate-200">{phase.name}</strong></div>
            </div>

            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Benchmarking ({benchmark.label})</div>
              <div className="text-4xl font-black text-amber-400 mb-2">{score - benchmark.score > 0 ? '+' : ''}{score - benchmark.score} pts</div>
              <div className="text-sm text-slate-400">Em relação à média do seu setor ({benchmark.score}/100).</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Paywall Gate) */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          Análise Detalhada
        </h2>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40">
          <div className={`p-8 transition-all duration-1000 ${!isUnlocked ? 'filter blur-[8px] opacity-40 pointer-events-none select-none' : ''}`}>
            {/* The Locked Content */}
            <div className="space-y-16">
              
              {/* Gaps Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-wider text-sm">Gargalos Críticos Identificados</h3>
                <div className="grid gap-4">
                  {gaps.map((g, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-white text-lg">{g.title}</h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{g.impact}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{g.desc}</p>
                          <div className="text-xs font-medium text-blue-400 bg-blue-500/10 inline-flex items-center px-3 py-1.5 rounded-md">
                            Ação Recomendada: {g.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roadmap Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-6 uppercase tracking-wider text-sm">Roadmap de Ação (90 Dias)</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:to-transparent">
                  {roadmap.map((r, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-blue-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                        {i + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-xl bg-slate-800/40 border border-white/5">
                        <div className="text-xs font-bold text-blue-400 mb-1">{r.period}</div>
                        <h4 className="font-bold text-white mb-2">{r.title}</h4>
                        <p className="text-sm text-slate-400 mb-3">{r.desc}</p>
                        <div className="text-xs font-medium text-green-400">↑ Ganho esperado: {r.gain}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Paywall Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 p-6 text-center">
              <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <Lock className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Desbloqueie o Diagnóstico</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Para acessar a lista detalhada dos gargalos da sua operação, o mapa dos seus sistemas e o roadmap estratégico de 90 dias gerado sob medida.
                </p>
                
                <div className="bg-slate-950 rounded-xl p-4 mb-6 text-left border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-300">Relatório Completo Raio-X</span>
                    <span className="font-bold text-white">R$ 97,00</span>
                  </div>
                  {price < 97 && (
                    <div className="flex justify-between items-center text-green-400 text-sm font-medium">
                      <span>Desconto Aplicado</span>
                      <span>- R$ {97 - price},00</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-white uppercase text-xs">Total</span>
                    <span className="font-black text-xl text-blue-400">R$ {price},00</span>
                  </div>
                </div>

                {price > 0 && (
                  <Button 
                    onClick={() => {
                      // Redirect to Hotmart here in production
                      setIsUnlocked(true); // Mocking successful payment
                    }} 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl mb-4"
                  >
                    Prosseguir para Pagamento Segura
                  </Button>
                )}

                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500 mb-2">Possui um cupom de parceiro?</p>
                  <div className="flex gap-2">
                    <Input 
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      placeholder="CUPOM" 
                      className="bg-slate-950 border-slate-800 text-center uppercase focus:border-blue-500 text-sm h-10" 
                    />
                    <Button onClick={applyCoupon} variant="outline" className="h-10 text-xs border-slate-700 hover:bg-slate-800">
                      Aplicar
                    </Button>
                  </div>
                  {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
