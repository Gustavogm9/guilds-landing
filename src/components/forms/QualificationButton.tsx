import { Button } from '@/components/ui/button';
import { useQualification } from './QualificationProvider';
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
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