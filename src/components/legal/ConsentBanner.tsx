import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useConsent } from '@/hooks/useConsent';
import { ConsentModal } from './ConsentModal';
import { X, Settings, Cookie } from 'lucide-react';

export const ConsentBanner = () => {
  const { showBanner, acceptAll, acceptNecessaryOnly, closeBanner, hasConsented } = useConsent();
  const [showModal, setShowModal] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Card className="max-w-6xl mx-auto p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Utilizamos cookies e tecnologias similares
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Respeitamos sua privacidade. Utilizamos cookies essenciais para o funcionamento do site e, 
                  com seu consentimento, cookies para analytics e marketing para melhorar sua experiência. 
                  Você pode gerenciar suas preferências a qualquer momento.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  onClick={acceptAll}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Aceitar Todos
                </Button>
                
                <Button
                  onClick={acceptNecessaryOnly}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  Apenas Necessários
                </Button>
                
                <Button
                  onClick={() => setShowModal(true)}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Ao continuar navegando, você concorda com nossa{' '}
                <a href="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade
                </a>
                {' '}e{' '}
                <a href="/cookies" className="text-primary hover:underline">
                  Política de Cookies
                </a>
              </div>
            </div>

            {hasConsented && (
              <Button
                onClick={closeBanner}
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>

      <ConsentModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};