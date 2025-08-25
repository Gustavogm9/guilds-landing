import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QualificationModal } from './QualificationModal';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QualificationButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  [key: string]: any;
}

export const QualificationButton = ({ 
  children, 
  className, 
  variant = "default",
  size = "default",
  ...props 
}: QualificationButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    
    // Track conversion event for analytics
    if (typeof window !== 'undefined' && 'gtag' in window && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'qualification_form_opened', {
        event_category: 'engagement',
        event_label: location.pathname,
        value: 1
      });
    }
  };

  return (
    <>
      <Button
        {...props}
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={handleClick}
      >
        {children}
      </Button>
      
      <QualificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        sourcePage={location.pathname}
      />
    </>
  );
};