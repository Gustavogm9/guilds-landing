import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTAStickyMobileProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  whatsappMessage?: string;
  showOnDesktop?: boolean;
  className?: string;
}

export function CTAStickyMobile({ 
  whatsappNumber = "5511999999999",
  phoneNumber = "tel:+5511999999999",
  whatsappMessage = "Olá! Gostaria de saber mais sobre os serviços da Guilds.",
  showOnDesktop = false,
  className = ""
}: CTAStickyMobileProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Hide/show based on scroll position
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneClick = () => {
    window.location.href = phoneNumber;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`
      fixed bottom-4 right-4 z-50 transition-all duration-300 transform
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
      ${showOnDesktop ? '' : 'lg:hidden'}
      ${className}
    `}>
      {/* Expanded State */}
      {isExpanded && (
        <div className="mb-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-large border border-neutral-200 dark:border-neutral-700 p-4 min-w-[280px] animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="font-medium text-sm text-foreground">Como podemos ajudar?</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Fechar menu de contato"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Contact Options */}
          <div className="space-y-2">
            <Button
              onClick={handleWhatsAppClick}
              className="w-full justify-start space-x-3 bg-[#25D366] hover:bg-[#22C55E] text-white border-0 h-12"
            >
              <MessageCircle className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">WhatsApp</div>
                <div className="text-xs opacity-90">Resposta rápida</div>
              </div>
            </Button>

            <Button
              onClick={handlePhoneClick}
              variant="outline"
              className="w-full justify-start space-x-3 h-12 border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            >
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">Telefone</div>
                <div className="text-xs text-muted-foreground">Ligue agora</div>
              </div>
            </Button>
          </div>

          {/* Quick Message */}
          <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Dica:</strong> Conte-nos sobre seu projeto no WhatsApp para um atendimento mais ágil!
            </p>
          </div>
        </div>
      )}

      {/* Main Button */}
      <div className="relative">
        <Button
          onClick={toggleExpanded}
          className="h-14 w-14 rounded-full shadow-large bg-brand-primary hover:bg-brand-primary/90 text-white border-0 p-0 hover:scale-105 transition-all duration-200"
          aria-label={isExpanded ? "Fechar menu de contato" : "Abrir menu de contato"}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-brand-primary animate-ping opacity-75"></div>
            </>
          )}
        </Button>

        {/* Notification Badge */}
        {!isExpanded && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Accessibility Helper */}
      <div className="sr-only">
        Botão de contato rápido. Clique para abrir opções de WhatsApp e telefone.
      </div>
    </div>
  );
}