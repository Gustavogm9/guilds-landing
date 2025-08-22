import { LucideProps } from "lucide-react";

interface GuildShieldProps extends LucideProps {
  variant?: 'default' | 'filled' | 'outline';
}

const GuildShield = ({ variant = 'default', className = '', ...props }: GuildShieldProps) => {
  const baseClasses = `${className}`;
  
  if (variant === 'filled') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={baseClasses}
        {...props}
      >
        <path 
          d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" 
          fill="currentColor" 
          stroke="none"
        />
        <path 
          d="M9 12l2 2 4-4" 
          stroke="white" 
          strokeWidth="2"
        />
      </svg>
    );
  }
  
  if (variant === 'outline') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={baseClasses}
        {...props}
      >
        <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={baseClasses}
      {...props}
    >
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
    </svg>
  );
};

export default GuildShield;