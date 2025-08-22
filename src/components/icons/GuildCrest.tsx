import { LucideProps } from "lucide-react";

interface GuildCrestProps extends LucideProps {
  variant?: 'default' | 'heraldic' | 'crown';
}

const GuildCrest = ({ variant = 'default', className = '', ...props }: GuildCrestProps) => {
  const baseClasses = `${className}`;
  
  if (variant === 'heraldic') {
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
        {/* Shield base */}
        <path d="M12 2L4 6v6c0 5.5 3.5 10.5 8 12 4.5-1.5 8-6.5 8-12V6l-8-4z" />
        {/* Heraldic cross */}
        <path d="M12 6v12M8 12h8" strokeWidth="1.5" />
        {/* Crown at top */}
        <path d="M8 4l1 2 2-2 2 2 1-2" strokeWidth="1" />
      </svg>
    );
  }
  
  if (variant === 'crown') {
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
        <path d="M2 12l3-3 3 3 3-3 3 3 3-3 3 3v6H2v-6z" />
        <circle cx="7" cy="9" r="1" />
        <circle cx="12" cy="6" r="1" />
        <circle cx="17" cy="9" r="1" />
        <path d="M5 16h14v2H5v-2z" />
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
      {/* Basic crest/emblem */}
      <path d="M12 2L4 6v6c0 5.5 3.5 10.5 8 12 4.5-1.5 8-6.5 8-12V6l-8-4z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9v6M9 12h6" strokeWidth="1" />
    </svg>
  );
};

export default GuildCrest;