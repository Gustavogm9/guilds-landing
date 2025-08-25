import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletter } from '@/hooks/useNewsletter';

interface NewsletterProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'footer' | 'inline' | 'modal';
  buttonText?: string;
}

export function Newsletter({ 
  title = "Newsletter", 
  description = "Receba insights sobre tecnologia e inovação direto no seu e-mail.",
  className = "",
  variant = 'footer',
  buttonText = "Inscrever-se"
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const { subscribe, isLoading } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    const success = await subscribe(email, window.location.pathname);
    
    if (success) {
      setEmail(''); // Clear form on success
    }
  };

  const inputStyles = {
    footer: "bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand-accent",
    inline: "border-input bg-background",
    modal: "border-input bg-background"
  };

  const buttonStyles = {
    footer: "btn-accent w-full",
    inline: "btn-primary",
    modal: "btn-primary w-full"
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="font-sora font-semibold text-lg flex items-center gap-2">
          <Mail className="h-5 w-5 text-brand-accent" />
          {title}
        </h3>
      )}
      
      {description && (
        <p className={`text-sm ${
          variant === 'footer' ? 'text-neutral-400' : 'text-muted-foreground'
        }`}>
          {description}
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyles[variant]}
          required
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          className={buttonStyles[variant]}
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? 'Inscrevendo...' : buttonText}
        </Button>
      </form>
      
      {variant === 'footer' && (
        <p className="text-xs text-neutral-500">
          Ao se inscrever, você concorda em receber nossos e-mails. 
          <br />
          Você pode cancelar a qualquer momento.
        </p>
      )}
    </div>
  );
}