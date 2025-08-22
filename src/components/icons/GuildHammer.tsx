import { LucideProps } from "lucide-react";

interface GuildHammerProps extends LucideProps {
  variant?: 'default' | 'crossed' | 'forge';
}

const GuildHammer = ({ variant = 'default', className = '', ...props }: GuildHammerProps) => {
  const baseClasses = `${className}`;
  
  if (variant === 'crossed') {
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
        {/* First hammer */}
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
        {/* Second hammer (crossed) */}
        <path d="M6.3 14.7a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4l-3.77-3.77a6 6 0 0 1 7.94-7.94l6.91 6.91a2.12 2.12 0 0 1-3 3l-6.91-6.91a6 6 0 0 1-7.94 7.94l3.77-3.77z" />
      </svg>
    );
  }
  
  if (variant === 'forge') {
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
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
        {/* Sparks */}
        <circle cx="8" cy="8" r="0.5" fill="currentColor" />
        <circle cx="18" cy="16" r="0.5" fill="currentColor" />
        <circle cx="6" cy="18" r="0.5" fill="currentColor" />
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
    </svg>
  );
};

export default GuildHammer;