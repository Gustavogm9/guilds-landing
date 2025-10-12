import { Button } from '@/components/ui/button';
import { useQualification } from './QualificationProvider';
import { useAnalytics } from '@/hooks/useAnalytics';
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
  const { openModal } = useQualification();
  const { trackCTAClick } = useAnalytics();

  const handleClick = (e: React.MouseEvent) => {
    // Only prevent default if not using asChild (which would make it a link)
    if (!props.asChild) {
      e.preventDefault();
    }
    
    // Track CTA click with context
    trackCTAClick(children?.toString() || 'Qualification CTA', {
      cta_type: variant as any,
      section: 'cta_button',
    });
    
    openModal();
  };

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};