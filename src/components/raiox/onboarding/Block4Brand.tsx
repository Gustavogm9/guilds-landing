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

const CHANNELS = [
  'Site institucional',
  'Instagram',
  'LinkedIn',
  'Facebook',
  'TikTok',
  'YouTube',
  'Blog / conteúdo próprio',
  'Google Meu Negócio',
  'Nenhum canal ativo',
];

const POSITIONING_REVIEW = [
  'Nos últimos 6 meses',
  'Entre 6 meses e 1 ano',
  'Mais de 1 ano atrás',
  'Nunca foi formalizado',
];

export function Block4Brand({ diagnosticId, onNext, onPrev }: BlockProps) {
  const { saveAnswers } = useSaveAnswer();
  const [loading, setLoading] = useState(false);

  const [siteUrl, setSiteUrl] = useState('');
  const [channels, setChannels] = useState<string[]>([]);
  const [differentials, setDifferentials] = useState('');
  const [positioningReview, setPositioningReview] = useState('');

  const toggleChannel = (ch: string) => {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleNext = async () => {
    if (channels.length === 0 || !positioningReview) {
      alert("Selecione ao menos um canal e quando revisou o posicionamento.");
      return;
    }

    setLoading(true);
    const { success } = await saveAnswers(diagnosticId, 4, [
      { question_key: 'q_site_url', value_text: siteUrl || null },
      { question_key: 'q_canais_ativos', value_array: channels },
      { question_key: 'q_diferenciais', value_free: differentials || null },
      { question_key: 'q_posicionamento', value_text: positioningReview },
    ]);
    setLoading(false);

    if (success) onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">Marca & Comunicação</h2>
        <p className="text-slate-400 text-sm">A clareza da sua mensagem impacta diretamente a conversão. Vamos auditar.</p>
      </div>

      <div className="space-y-6">
        {/* URL do site */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-200">URL do seu site</label>
          <p className="text-xs text-slate-500">Se não tiver, deixe em branco.</p>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://suaempresa.com.br"
            className="w-full rounded-xl bg-slate-900/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 text-white placeholder:text-slate-600 text-sm p-4 transition-colors outline-none"
          />
        </div>

        {/* Canais ativos */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Onde sua marca está presente digitalmente?</label>
          <p className="text-xs text-slate-500">Selecione todos os canais que vocês mantêm ativos.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHANNELS.map(ch => (
              <MultiSelectCard
                key={ch}
                label={ch}
                selected={channels.includes(ch)}
                onClick={() => toggleChannel(ch)}
              />
            ))}
          </div>
        </div>

        {/* Diferenciais */}
        <TextAreaField
          label="Se um cliente perguntasse 'por que contratar vocês e não o concorrente?', o que responderia?"
          placeholder="Ex: 'Somos os únicos com certificação X na região', 'Nosso atendimento é 24h', 'Temos 15 anos no mercado com taxa de retenção de 92%'..."
          value={differentials}
          onChange={setDifferentials}
          hint="Quanto mais específico, melhor a análise de posicionamento."
        />

        {/* Última revisão de posicionamento */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200">Quando foi a última vez que vocês revisaram formalmente o posicionamento de marca?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POSITIONING_REVIEW.map(opt => (
              <OptionCard
                key={opt}
                label={opt}
                selected={positioningReview === opt}
                onClick={() => setPositioningReview(opt)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-white/10 flex justify-between">
        <Button variant="ghost" onClick={onPrev} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={loading || channels.length === 0 || !positioningReview}
          className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px]"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Salvar e Continuar
        </Button>
      </div>
    </div>
  );
}
