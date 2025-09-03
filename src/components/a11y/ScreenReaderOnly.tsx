import { cn } from '@/lib/utils';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ScreenReaderOnly({ 
  children, 
  className, 
  as: Component = 'span' 
}: ScreenReaderOnlyProps) {
  return (
    <Component 
      className={cn('sr-only', className)}
    >
      {children}
    </Component>
  );
}

// Utility component for screen reader descriptions
export function SRDescription({ 
  children, 
  id 
}: { 
  children: React.ReactNode; 
  id: string;
}) {
  return (
    <ScreenReaderOnly as="div" className="sr-only">
      <div id={id}>{children}</div>
    </ScreenReaderOnly>
  );
}