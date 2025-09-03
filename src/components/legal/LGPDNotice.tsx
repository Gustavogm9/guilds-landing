import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, ExternalLink } from 'lucide-react';

interface LGPDNoticeProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  purpose: 'lead' | 'newsletter' | 'contact' | 'workshop';
  required?: boolean;
  className?: string;
}

const purposeTexts = {
  lead: {
    title: 'Consentimento para processamento de dados',
    description: 'Autorizo o uso dos meus dados pessoais para fins de qualificação comercial, contato sobre serviços e envio de propostas comerciais.',
    details: 'Seus dados serão utilizados exclusivamente para entrar em contato sobre nossos serviços de desenvolvimento de software, automação e workshops.',
  },
  newsletter: {
    title: 'Consentimento para marketing por email',
    description: 'Autorizo o envio de newsletters, conteúdos educacionais e informações sobre workshops e eventos da Guilds.',
    details: 'Você receberá conteúdos relevantes sobre tecnologia, desenvolvimento e oportunidades de aprendizado. Pode cancelar a qualquer momento.',
  },
  contact: {
    title: 'Consentimento para atendimento',
    description: 'Autorizo o uso dos meus dados pessoais para responder à minha solicitação e fornecer o suporte necessário.',
    details: 'Seus dados serão utilizados exclusivamente para responder sua mensagem e prestar o atendimento solicitado.',
  },
  workshop: {
    title: 'Consentimento para inscrição em workshop',
    description: 'Autorizo o uso dos meus dados pessoais para inscrição no workshop, comunicações relacionadas ao evento e certificação.',
    details: 'Seus dados serão utilizados para gestão da sua participação, comunicações sobre o workshop e emissão de certificado.',
  },
};

export const LGPDNotice = ({
  checked,
  onCheckedChange,
  purpose,
  required = true,
  className = '',
}: LGPDNoticeProps) => {
  const purposeText = purposeTexts[purpose];

  return (
    <div className={`space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50 ${className}`}>
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-medium text-foreground">
            {purposeText.title}
            {required && <span className="text-destructive ml-1">*</span>}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {purposeText.details}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id={`lgpd-consent-${purpose}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-0.5"
        />
        <Label
          htmlFor={`lgpd-consent-${purpose}`}
          className="text-sm leading-relaxed cursor-pointer flex-1"
        >
          {purposeText.description}
        </Label>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Seus direitos:</strong> Acesso, retificação, exclusão e portabilidade dos dados conforme LGPD.
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <a 
            href="/privacidade" 
            className="inline-flex items-center gap-1 text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade
            <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Solicitar dados
            <ExternalLink className="h-3 w-3" />
          </a>
          <span>DPO: contato@guilds.com.br</span>
        </div>
      </div>
    </div>
  );
};