import { useState } from 'react';
import { useSaveAnswer } from '@/hooks/useSaveAnswer';
import { Button } from '@/components/ui/button';
import { OptionCard } from './fields/OptionCard';
import { MultiSelectCard } from './fields/MultiSelectCard';
import { SliderField } from './fields/SliderField';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface BlockProps {
  diagnosticId: string;
  onNext: () => void;
  onPrev: () => void;
}

const SYSTEMS = [
  'ERP (Totvs, SAP, Omie, Bling, etc.)',
  'CRM (HubSpot, Pipedrive, RD Station, etc.)',
  'Planilhas (Excel / Google Sheets)',
  'WhatsApp Business / Grupos',
  'Sistema Próprio / Legado',
  'Ferramentas de Projeto (Trello, Monday, Notion)',
  'BI / Analytics (Power BI, Looker, GA4)',
  'Nenhum sistema formal',
];

const INTEGRATION_LEVELS = [
  { label: 'Nada integrado', description: 'Cada sistema é uma ilha. Dados são copiados manualmente.' },
  { label: 'Parcialmente integrado', description: 'Algumas integrações pontuais (ex: CRM↔e-mail), mas não entre todos.' },
  { label: 'Bem integrado', description: 'Os principais sistemas conversam. Poucos processos manuais.' },
  { label: 'Totalmente integrado', description: 'API-first, dados fluem automaticamente entre todos os pontos.' },
];

export function Block2Systems({ diagnosticId, onNext, onPrev }: BlockProps) {
  const { saveAnswers } = useSaveAnswer();
  const [loading, setLoading] = useState(false);
  
  const [systems, setSystems] = useState<string[]>([]);
  const [adoption, setAdoption] = useState(50);
  const [ghostSystems, setGhostSystems] = useState<string>('');
  const [integration, setIntegration] = useState<string>('');
  const [manualHours, setManualHours] = useState(10);

  const toggleSystem = (sys: string) => {
    setSystems(prev => prev.includes(sys) ? prev.filter(s => s !== sys) : [...prev, sys]);
  };

  const handleNext = async () => {
    if (systems.length === 0 || !integration) {
      alert("Selecione pelo menos um sistema e o nível de integração.");
      return;
    }

    setLoading(true);
    const { success } = await saveAnswers(diagnosticId, 2, [
      { question_key: 'q_sistemas', value_array: systems },
      { question_key: 'q_adocao', value_text: `${adoption}%` },
      { question_key: 'q_fantasmas', value_text: ghostSystems },
      { question_key: 'q_integracao', value_text: integration },
      { question_key: 'q_horas_manuais', value_text: `${manualHours}h/semana` },
    ]);
    setLoading(false);

    if (success) onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">Operações & Sistemas</h2>
        <p className="text-slate-400 text-sm">Entender a infraestrutura digital que sustenta (ou trava) sua operação.</p>
      </div>

      <div className="space-y-6">
        {/* Sistemas usados */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Quais sistemas a operação usa no dia a dia?</label>
          <p className="text-xs text-slate-500">Selecione todos que se aplicam.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SYSTEMS.map(s => (
              <MultiSelectCard
                key={s}
                label={s}
                selected={systems.includes(s)}
                onClick={() => toggleSystem(s)}
              />
            ))}
          </div>
        </div>

        {/* Adoção */}
        <SliderField
          label="Qual o nível de adoção real dos sistemas pela equipe?"
          value={adoption}
          onChange={setAdoption}
          min={0}
          max={100}
          step={5}
          suffix="%"
          labels={{ min: '0% — Ninguém usa', max: '100% — Todos usam' }}
        />

        {/* Sistemas fantasmas */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Existem sistemas contratados que quase ninguém usa?</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Sim, 1 ou 2', 'Sim, vários', 'Não'].map(opt => (
              <OptionCard
                key={opt}
                label={opt}
                selected={ghostSystems === opt}
                onClick={() => setGhostSystems(opt)}
              />
            ))}
          </div>
        </div>

        {/* Integração */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Qual o nível de integração entre os sistemas?</label>
          <div className="grid grid-cols-1 gap-3">
            {INTEGRATION_LEVELS.map(lvl => (
              <OptionCard
                key={lvl.label}
                label={lvl.label}
                description={lvl.description}
                selected={integration === lvl.label}
                onClick={() => setIntegration(lvl.label)}
              />
            ))}
          </div>
        </div>

        {/* Horas manuais */}
        <SliderField
          label="Quantas horas por semana a equipe gasta em tarefas manuais repetitivas?"
          value={manualHours}
          onChange={setManualHours}
          min={0}
          max={60}
          step={2}
          suffix="h"
          labels={{ min: '0h', max: '60h+/semana' }}
        />
      </div>

      <div className="pt-6 mt-6 border-t border-white/10 flex justify-between">
        <Button variant="ghost" onClick={onPrev} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={loading || systems.length === 0 || !integration}
          className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px]"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Salvar e Continuar
        </Button>
      </div>
    </div>
  );
}
