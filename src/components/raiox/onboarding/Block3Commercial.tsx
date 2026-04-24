import { useState } from 'react';
import { useSaveAnswer } from '@/hooks/useSaveAnswer';
import { Button } from '@/components/ui/button';
import { OptionCard } from './fields/OptionCard';
import { MultiSelectCard } from './fields/MultiSelectCard';
import { TextAreaField } from './fields/TextAreaField';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface BlockProps {
  diagnosticId: string;
  onNext: () => void;
  onPrev: () => void;
}

const TEAM_SIZES = [
  'Não existe equipe dedicada',
  '1 pessoa faz tudo',
  'Equipe pequena (2–5)',
  'Equipe estruturada (6+)',
  'Agência externa',
];

const LEAD_SOURCES = [
  'Indicação / boca a boca',
  'Google (SEO / Ads)',
  'Instagram / TikTok / Redes sociais',
  'LinkedIn',
  'E-mail marketing',
  'Eventos / feiras',
  'Parcerias estratégicas',
  'Outbound / prospecção ativa',
  'Não sei de onde vêm',
];

const CRM_TOOLS = [
  'HubSpot',
  'Pipedrive',
  'RD Station CRM',
  'Salesforce',
  'Planilhas / Excel',
  'WhatsApp informalmente',
  'Nenhum CRM',
  'Outro',
];

export function Block3Commercial({ diagnosticId, onNext, onPrev }: BlockProps) {
  const { saveAnswers } = useSaveAnswer();
  const [loading, setLoading] = useState(false);

  const [teamSize, setTeamSize] = useState('');
  const [leadSources, setLeadSources] = useState<string[]>([]);
  const [objections, setObjections] = useState('');
  const [crmTools, setCrmTools] = useState<string[]>([]);

  const toggleLeadSource = (src: string) => {
    setLeadSources(prev => prev.includes(src) ? prev.filter(s => s !== src) : [...prev, src]);
  };

  const toggleCrm = (tool: string) => {
    setCrmTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
  };

  const handleNext = async () => {
    if (!teamSize || leadSources.length === 0) {
      alert("Preencha ao menos o tamanho da equipe e a origem dos leads.");
      return;
    }

    setLoading(true);
    const { success } = await saveAnswers(diagnosticId, 3, [
      { question_key: 'q_equipe_marketing', value_text: teamSize },
      { question_key: 'q_origem_leads', value_array: leadSources },
      { question_key: 'q_objecoes', value_free: objections || null },
      { question_key: 'q_stack_comercial', value_array: crmTools },
    ]);
    setLoading(false);

    if (success) onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">Comercial & Marketing</h2>
        <p className="text-slate-400 text-sm">Como sua empresa atrai e converte clientes hoje? Vamos mapear o funil.</p>
      </div>

      <div className="space-y-6">
        {/* Tamanho da equipe de marketing */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Como é a estrutura de marketing e vendas?</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEAM_SIZES.map(ts => (
              <OptionCard
                key={ts}
                label={ts}
                selected={teamSize === ts}
                onClick={() => setTeamSize(ts)}
              />
            ))}
          </div>
        </div>

        {/* Origem dos leads */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">De onde vêm os seus leads/clientes?</label>
          <p className="text-xs text-slate-500">Selecione todos os canais relevantes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LEAD_SOURCES.map(src => (
              <MultiSelectCard
                key={src}
                label={src}
                selected={leadSources.includes(src)}
                onClick={() => toggleLeadSource(src)}
              />
            ))}
          </div>
        </div>

        {/* Stack comercial */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Que ferramentas de CRM / vendas vocês usam?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CRM_TOOLS.map(tool => (
              <MultiSelectCard
                key={tool}
                label={tool}
                selected={crmTools.includes(tool)}
                onClick={() => toggleCrm(tool)}
              />
            ))}
          </div>
        </div>

        {/* Objeções */}
        <TextAreaField
          label="Quais são as objeções mais comuns dos seus clientes?"
          placeholder="Ex: 'Está caro', 'Já tentei algo parecido e não funcionou', 'Não tenho tempo agora'..."
          value={objections}
          onChange={setObjections}
          hint="Opcional. Quanto mais detalhes, melhor o diagnóstico."
        />
      </div>

      <div className="pt-6 mt-6 border-t border-white/10 flex justify-between">
        <Button variant="ghost" onClick={onPrev} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={loading || !teamSize || leadSources.length === 0}
          className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px]"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Salvar e Continuar
        </Button>
      </div>
    </div>
  );
}
