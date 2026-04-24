import { useState } from 'react';
import { useSaveAnswer } from '@/hooks/useSaveAnswer';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { Button } from '@/components/ui/button';
import { OptionCard } from './fields/OptionCard';
import { MultiSelectCard } from './fields/MultiSelectCard';
import { TextAreaField } from './fields/TextAreaField';
import { ArrowLeft, Loader2, Check, Shield } from 'lucide-react';

interface BlockProps {
  diagnosticId: string;
  onNext?: () => void;
  onPrev: () => void;
}

const OBJECTIVES = [
  'Aumentar alcance de marca',
  'Gerar mais leads qualificados',
  'Aumentar receita / ticket médio',
  'Reduzir custos operacionais',
  'Melhorar retenção de clientes',
  'Diferenciar da concorrência',
  'Automatizar processos manuais',
  'Lançar produto / serviço novo',
];

const ABANDONMENT_HISTORY = [
  'Nunca abandonamos um sistema',
  'Sim, 1 vez',
  'Sim, 2+ vezes',
  'Já perdi a conta',
];

const TECH_RESPONSIBLE = [
  'CEO / Sócio decide tudo',
  'Gerente / Coordenador de TI',
  'Equipe operacional escolhe',
  'Agência / consultoria externa',
  'Não tem responsável definido',
];

export function Block5Goals({ diagnosticId, onPrev }: BlockProps) {
  const { saveAnswers } = useSaveAnswer();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [objectives, setObjectives] = useState<string[]>([]);
  const [abandonment, setAbandonment] = useState('');
  const [techResponsible, setTechResponsible] = useState('');
  const [biggestPain, setBiggestPain] = useState('');
  const [consent, setConsent] = useState(false);

  // Lead capture
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const toggleObjective = (obj: string) => {
    setObjectives(prev => prev.includes(obj) ? prev.filter(o => o !== obj) : [...prev, obj]);
  };

  const handleFinish = async () => {
    if (objectives.length === 0 || !abandonment || !techResponsible || !name || !company || !consent) {
      alert("Preencha os campos obrigatórios e aceite os termos para continuar.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save block 5 answers
      const { success } = await saveAnswers(diagnosticId, 5, [
        { question_key: 'q_objetivos_12m', value_array: objectives },
        { question_key: 'q_abandono_historico', value_text: abandonment },
        { question_key: 'q_responsavel_tech', value_text: techResponsible },
        { question_key: 'q_maior_dor', value_free: biggestPain || null },
      ]);

      if (!success) throw new Error('Failed to save answers');

      // 2. Update diagnostic with lead info and transition to processing
      const { error: updateError } = await supabaseRaiox
        .from('diagnostics')
        .update({
          status: 'processing',
          current_step: 6,
          metadata: {
            lead_name: name,
            lead_company: company,
            lead_phone: phone || null,
            consent_at: new Date().toISOString(),
            consent_version: '1.0',
          },
        })
        .eq('id', diagnosticId);

      if (updateError) throw updateError;

      setSubmitted(true);

      // Reload the page after a moment to show processing state
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (err) {
      console.error('Error finishing diagnostic:', err);
      alert("Erro ao finalizar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-white mb-3">Diagnóstico enviado!</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Nossa IA está analisando as suas respostas e cruzando com benchmarks de mercado. 
          Você será redirecionado em instantes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">Objetivos & Histórico</h2>
        <p className="text-slate-400 text-sm">Última etapa. Entender aonde você quer chegar e o que já tentou.</p>
      </div>

      <div className="space-y-6">
        {/* Objetivos 12 meses */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Quais são os seus principais objetivos nos próximos 12 meses?</label>
          <p className="text-xs text-slate-500">Selecione até 4 prioridades.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {OBJECTIVES.map(obj => (
              <MultiSelectCard
                key={obj}
                label={obj}
                selected={objectives.includes(obj)}
                onClick={() => {
                  if (objectives.includes(obj) || objectives.length < 4) toggleObjective(obj);
                }}
              />
            ))}
          </div>
        </div>

        {/* Histórico de abandono */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Já abandonaram um sistema ou projeto de digitalização no passado?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ABANDONMENT_HISTORY.map(opt => (
              <OptionCard
                key={opt}
                label={opt}
                selected={abandonment === opt}
                onClick={() => setAbandonment(opt)}
              />
            ))}
          </div>
        </div>

        {/* Responsável por tech */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Quem decide sobre adoção de tecnologia na sua empresa?</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TECH_RESPONSIBLE.map(opt => (
              <OptionCard
                key={opt}
                label={opt}
                selected={techResponsible === opt}
                onClick={() => setTechResponsible(opt)}
              />
            ))}
          </div>
        </div>

        {/* Maior dor */}
        <TextAreaField
          label="Qual é a maior dor operacional da sua empresa hoje?"
          placeholder="Ex: 'Perdemos tempo demais em relatórios manuais', 'O CRM não é usado pela equipe', 'Não sei de onde vêm meus melhores clientes'..."
          value={biggestPain}
          onChange={setBiggestPain}
          hint="Opcional. Essa resposta enriquece muito o diagnóstico personalizado."
        />

        {/* Separator - Lead capture */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-1">Dados para o relatório</h3>
          <p className="text-xs text-slate-500 mb-4">Seu diagnóstico será associado a essas informações.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Nome completo *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 text-sm p-3 transition-colors outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Empresa *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nome da empresa"
                required
                className="w-full rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 text-sm p-3 transition-colors outline-none"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="text-xs font-semibold text-slate-300">Telefone / WhatsApp (opcional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 text-sm p-3 transition-colors outline-none"
            />
          </div>
        </div>

        {/* LGPD Consent */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <button
            type="button"
            onClick={() => setConsent(!consent)}
            className={`mt-0.5 w-5 h-5 min-w-[20px] rounded border flex items-center justify-center transition-all ${
              consent ? 'bg-blue-500 border-blue-500' : 'border-slate-500'
            }`}
          >
            {consent && <Check className="w-3 h-3 text-white" />}
          </button>
          <div className="text-xs text-slate-400 leading-relaxed">
            <Shield className="w-3 h-3 inline mr-1 text-slate-500" />
            Autorizo a Guilds a armazenar e processar as informações fornecidas neste diagnóstico para gerar o relatório personalizado, conforme a{' '}
            <a href="/privacidade" target="_blank" className="text-blue-400 hover:underline">Política de Privacidade</a>. 
            Seus dados são protegidos e nunca compartilhados com terceiros sem consentimento.
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-white/10 flex justify-between">
        <Button variant="ghost" onClick={onPrev} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button 
          onClick={handleFinish} 
          disabled={loading || objectives.length === 0 || !abandonment || !techResponsible || !name || !company || !consent}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white min-w-[200px] shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Gerar Meu Diagnóstico
        </Button>
      </div>
    </div>
  );
}
