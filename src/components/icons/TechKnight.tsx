import { LucideProps } from "lucide-react";

interface TechKnightProps extends LucideProps {
  variant?: 'default' | 'animated';
}

const TechKnight = ({ variant = 'default', className = '', ...props }: TechKnightProps) => {
  const baseClasses = `${className}`;
  
  return (
    <svg
      viewBox="0 0 200 280"
      fill="none"
      className={baseClasses}
      {...props}
    >
      {/* Knight Body */}
      <g className="knight-body">
        {/* Armor Body */}
        <path 
          d="M100 120 L120 140 L120 200 L80 200 L80 140 Z" 
          fill="url(#armorGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2"
        />
        
        {/* Arms */}
        <ellipse cx="70" cy="150" rx="8" ry="25" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
        <ellipse cx="130" cy="150" rx="8" ry="25" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
        
        {/* Legs */}
        <rect x="85" y="200" width="12" height="40" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
        <rect x="103" y="200" width="12" height="40" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
      </g>

      {/* Shield (Left side) */}
      <g className="shield" transform="translate(45, 130)">
        <path 
          d="M0 0 L25 0 L25 35 L12.5 45 L0 35 Z" 
          fill="url(#shieldGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2"
        />
        {/* Guild Symbol on Shield */}
        <path d="M12.5 8 L8 18 L17 18 Z" fill="hsl(var(--primary))" />
        <circle cx="12.5" cy="25" r="3" fill="hsl(var(--primary))" />
      </g>

      {/* Sword (Right side) */}
      <g className="sword" transform="translate(140, 100)">
        <rect x="0" y="0" width="3" height="50" fill="url(#swordGradient)" stroke="hsl(var(--primary))" strokeWidth="1"/>
        <rect x="-5" y="45" width="13" height="6" fill="hsl(var(--primary))" />
        <circle cx="1.5" cy="55" r="4" fill="hsl(var(--primary))" />
      </g>

      {/* Hammer (Behind, right) */}
      <g className="hammer" transform="translate(125, 90)">
        <rect x="0" y="0" width="2" height="35" fill="url(#hammerGradient)" stroke="hsl(var(--muted-foreground))" strokeWidth="1"/>
        <rect x="-8" y="0" width="18" height="8" fill="hsl(var(--muted-foreground))" rx="2"/>
      </g>

      {/* Helmet */}
      <g className="helmet">
        <ellipse cx="100" cy="100" rx="25" ry="30" fill="url(#helmetGradient)" stroke="hsl(var(--primary))" strokeWidth="2"/>
        
        {/* Visor */}
        <rect x="80" y="95" width="40" height="8" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1"/>
        
        {/* Plume/Feather */}
        <path 
          d="M100 70 Q105 50 110 45 Q108 40 105 42 Q102 45 100 50 Q98 45 95 42 Q92 40 90 45 Q95 50 100 70" 
          fill="url(#plumeGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="1"
        />
      </g>

      {/* Tech Elements */}
      <g className="tech-elements">
        {/* Circuit patterns on armor */}
        <path d="M90 140 L110 140 M95 150 L105 150 M92 160 L108 160" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.7"/>
        
        {/* Glowing core */}
        <circle cx="100" cy="155" r="4" fill="hsl(var(--primary))" className="animate-pulse" opacity="0.8"/>
        
        {/* Digital visor display */}
        <rect x="85" y="96" width="6" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
        <rect x="93" y="96" width="4" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
        <rect x="109" y="96" width="6" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="armorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted))" />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
        </linearGradient>
        
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
        </linearGradient>
        
        <linearGradient id="swordGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--foreground))" />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
        </linearGradient>
        
        <linearGradient id="hammerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" />
        </linearGradient>
        
        <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.9)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
        </linearGradient>
        
        <linearGradient id="plumeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TechKnight;