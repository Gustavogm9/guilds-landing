import { LucideProps } from "lucide-react";

interface TechKnightProps extends LucideProps {
  variant?: 'default' | 'animated';
}

const TechKnight = ({ variant = 'default', className = '', ...props }: TechKnightProps) => {
  const baseClasses = `${className}`;
  
  return (
    <svg
      viewBox="0 0 240 320"
      fill="none"
      className={baseClasses}
      {...props}
    >
      {/* Knight Body - Enhanced */}
      <g className="knight-body">
        {/* Main Torso */}
        <path 
          d="M120 130 L140 150 L140 220 L100 220 L100 150 Z" 
          fill="url(#armorGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3"
        />
        
        {/* Chest Plate Detail */}
        <path 
          d="M110 145 L130 145 L135 165 L105 165 Z" 
          fill="url(#chestGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2"
        />
        
        {/* Arms - More Dynamic */}
        <ellipse cx="85" cy="160" rx="12" ry="30" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="2" transform="rotate(-15 85 160)"/>
        <ellipse cx="155" cy="160" rx="12" ry="30" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="2" transform="rotate(15 155 160)"/>
        
        {/* Legs - Stronger Stance */}
        <rect x="105" y="220" width="15" height="50" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="2" rx="3"/>
        <rect x="125" y="220" width="15" height="50" fill="url(#armorGradient)" stroke="hsl(var(--primary))" strokeWidth="2" rx="3"/>
        
        {/* Cape */}
        <path 
          d="M95 140 Q80 160 85 200 Q90 220 100 220 L100 150 Z" 
          fill="url(#capeGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="1.5" 
          opacity="0.8"
        />
      </g>

      {/* Shield (Left side) - Enhanced */}
      <g className="shield" transform="translate(50, 140)">
        <path 
          d="M0 0 L35 0 L35 45 L17.5 60 L0 45 Z" 
          fill="url(#shieldGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3"
        />
        {/* Tech Pattern on Shield */}
        <path d="M17.5 10 L12 22 L23 22 Z" fill="hsl(var(--primary))" />
        <circle cx="17.5" cy="32" r="4" fill="hsl(var(--primary))" className="animate-pulse" />
        <path d="M8 15 L27 15 M8 38 L27 38" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.7"/>
        {/* Digital Edge Glow */}
        <rect x="2" y="2" width="31" height="2" fill="hsl(var(--primary))" opacity="0.6" className="animate-pulse" />
      </g>

      {/* Sword (Right side) - Enhanced */}
      <g className="sword" transform="translate(165, 110) rotate(10)">
        <rect x="0" y="0" width="4" height="65" fill="url(#swordGradient)" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
        <rect x="-8" y="60" width="20" height="8" fill="hsl(var(--primary))" rx="2" />
        <circle cx="2" cy="72" r="6" fill="hsl(var(--primary))" />
        {/* Energy Blade */}
        <rect x="1" y="5" width="2" height="50" fill="hsl(var(--primary))" opacity="0.8" className="animate-pulse" />
        <path d="M2 0 L2 -15" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.9" />
      </g>

      {/* Hammer (Behind, left) - Enhanced */}
      <g className="hammer" transform="translate(75, 100) rotate(-5)">
        <rect x="0" y="0" width="3" height="45" fill="url(#hammerGradient)" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"/>
        <rect x="-12" y="0" width="27" height="12" fill="hsl(var(--muted-foreground))" rx="3"/>
        {/* Tech Hammer Head */}
        <rect x="-10" y="2" width="23" height="3" fill="hsl(var(--primary))" opacity="0.7" className="animate-pulse" />
        <rect x="-10" y="7" width="23" height="3" fill="hsl(var(--primary))" opacity="0.7" className="animate-pulse" />
      </g>

      {/* Helmet - Enhanced */}
      <g className="helmet">
        <ellipse cx="120" cy="110" rx="35" ry="40" fill="url(#helmetGradient)" stroke="hsl(var(--primary))" strokeWidth="3"/>
        
        {/* Tech Visor */}
        <rect x="95" y="105" width="50" height="12" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" rx="6"/>
        <rect x="100" y="107" width="40" height="8" fill="url(#visorGradient)" rx="4"/>
        
        {/* Plume/Feather - Enhanced */}
        <path 
          d="M120 70 Q127 45 135 35 Q132 28 127 32 Q122 38 120 45 Q118 38 113 32 Q108 28 105 35 Q113 45 120 70" 
          fill="url(#plumeGradient)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2"
        />
        
        {/* Helmet Details */}
        <path d="M100 85 L140 85" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6"/>
        <circle cx="120" cy="95" r="3" fill="hsl(var(--primary))" className="animate-pulse" />
      </g>

      {/* Tech Elements - Enhanced */}
      <g className="tech-elements">
        {/* Advanced Circuit patterns */}
        <path d="M110 150 L130 150 M115 165 L125 165 M112 180 L128 180" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.8"/>
        <path d="M110 155 L115 160 L125 160 L130 165" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.7" fill="none"/>
        
        {/* Power Core */}
        <circle cx="120" cy="170" r="6" fill="url(#coreGradient)" className="animate-pulse" />
        <circle cx="120" cy="170" r="3" fill="hsl(var(--primary))" className="animate-pulse" opacity="0.9"/>
        
        {/* Digital HUD Elements */}
        <rect x="100" y="108" width="8" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
        <rect x="110" y="108" width="6" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
        <rect x="118" y="108" width="4" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
        <rect x="132" y="108" width="8" height="2" fill="hsl(var(--primary))" className="animate-pulse"/>
        
        {/* Energy Lines */}
        <path d="M85 145 Q120 160 155 145" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" fill="none" className="animate-pulse"/>
        
        {/* Holographic Elements */}
        <circle cx="135" cy="130" r="2" fill="hsl(var(--primary))" opacity="0.6" className="animate-pulse" />
        <circle cx="105" cy="135" r="1.5" fill="hsl(var(--primary))" opacity="0.6" className="animate-pulse" />
      </g>

      {/* Enhanced Gradients */}
      <defs>
        <linearGradient id="armorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted) / 0.9)" />
          <stop offset="50%" stopColor="hsl(var(--muted-foreground) / 0.8)" />
          <stop offset="100%" stopColor="hsl(var(--foreground) / 0.7)" />
        </linearGradient>
        
        <linearGradient id="chestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.3)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
        </linearGradient>
        
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.9)" />
          <stop offset="50%" stopColor="hsl(var(--primary) / 0.7)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
        </linearGradient>
        
        <linearGradient id="swordGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--foreground))" />
          <stop offset="50%" stopColor="hsl(var(--muted-foreground))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
        </linearGradient>
        
        <linearGradient id="hammerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" />
        </linearGradient>
        
        <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.95)" />
          <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
        </linearGradient>
        
        <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.8)" />
          <stop offset="50%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
        </linearGradient>
        
        <linearGradient id="plumeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
        </linearGradient>
        
        <linearGradient id="capeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground) / 0.6)" />
          <stop offset="100%" stopColor="hsl(var(--muted) / 0.3)" />
        </linearGradient>
        
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="70%" stopColor="hsl(var(--primary) / 0.5)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default TechKnight;