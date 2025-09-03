import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useConsent, ConsentPreferences } from '@/hooks/useConsent';
import { Shield, BarChart3, Target, Settings } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cookieCategories = [
  {
    key: 'necessary' as keyof ConsentPreferences,
    title: 'Cookies Necessários',
    description: 'Essenciais para o funcionamento básico do site. Não podem ser desativados.',
    icon: Shield,
    required: true,
    examples: 'Autenticação, carrinho de compras, preferências de idioma',
  },
  {
    key: 'analytics' as keyof ConsentPreferences,
    title: 'Cookies de Analytics',
    description: 'Nos ajudam a entender como você usa o site para melhorarmos a experiência.',
    icon: BarChart3,
    required: false,
    examples: 'Google Analytics, métricas de performance, mapas de calor',
  },
  {
    key: 'marketing' as keyof ConsentPreferences,
    title: 'Cookies de Marketing',
    description: 'Utilizados para personalizar anúncios e medir a eficácia de campanhas.',
    icon: Target,
    required: false,
    examples: 'Facebook Pixel, LinkedIn Insight, Google Ads',
  },
  {
    key: 'functionality' as keyof ConsentPreferences,
    title: 'Cookies de Funcionalidade',
    description: 'Melhoram a funcionalidade e personalização, mas não são essenciais.',
    icon: Settings,
    required: false,
    examples: 'Chat ao vivo, preferências de tema, configurações salvas',
  },
];

export const ConsentModal = ({ isOpen, onClose }: ConsentModalProps) => {
  const { preferences, updatePreferences, acceptAll, acceptNecessaryOnly } = useConsent();
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(preferences);

  const handleToggle = (category: keyof ConsentPreferences, value: boolean) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setTempPreferences(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSave = () => {
    updatePreferences(tempPreferences);
    onClose();
  };

  const handleAcceptAll = () => {
    acceptAll();
    onClose();
  };

  const handleNecessaryOnly = () => {
    acceptNecessaryOnly();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Configurações de Privacidade
          </DialogTitle>
          <p className="text-muted-foreground">
            Gerencie suas preferências de cookies e privacidade. Você pode alterar essas configurações 
            a qualquer momento.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {cookieCategories.map((category) => {
            const Icon = category.icon;
            const isEnabled = tempPreferences[category.key];
            
            return (
              <div key={category.key} className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium">
                          {category.title}
                        </Label>
                        {category.required && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Exemplos:</strong> {category.examples}
                      </p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(value) => handleToggle(category.key, value)}
                    disabled={category.required}
                    className="mt-1"
                  />
                </div>
                
                {category.key !== 'functionality' && <Separator />}
              </div>
            );
          })}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Seus direitos:</strong> Você pode solicitar acesso, retificação ou exclusão dos seus dados, 
            bem como revogar seu consentimento a qualquer momento através do nosso{' '}
            <a href="/contact" className="text-primary hover:underline">
              formulário de contato
            </a>
            {' '}ou email: contato@guilds.com.br
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleNecessaryOnly}
              variant="outline"
              className="order-2 sm:order-1"
            >
              Apenas Necessários
            </Button>
            <Button
              onClick={handleSave}
              variant="secondary"
              className="order-1 sm:order-2"
            >
              Salvar Preferências
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="order-3"
            >
              Aceitar Todos
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};