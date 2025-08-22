import { Badge } from "./badge";

interface FloatingBadgesProps {
  className?: string;
}

const FloatingBadges = ({ className = '' }: FloatingBadgesProps) => {
  const badges = [
    { text: "REACT", position: "top-1/4 left-[15%]", delay: "0s" },
    { text: "IA", position: "top-1/3 right-[20%]", delay: "0.4s" },
    { text: "AUTOMAÇÃO", position: "top-1/2 left-[8%]", delay: "0.8s" },
    { text: "TYPESCRIPT", position: "bottom-1/3 right-[15%]", delay: "1.2s" },
    { text: "UX/UI", position: "bottom-1/4 left-[25%]", delay: "1.6s" },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {badges.map((badge, index) => (
        <div
          key={badge.text}
          className={`absolute ${badge.position} animate-fade-in opacity-0`}
          style={{
            animationDelay: badge.delay,
            animationFillMode: 'forwards',
          }}
        >
          <Badge
            variant="outline"
            className="text-xs px-3 py-1.5 bg-background/20 backdrop-blur-md border-primary/30 text-primary 
                       hover:bg-primary/20 hover:border-primary/50 hover:scale-105 
                       transition-all duration-500 animate-bounce font-medium tracking-wider"
            style={{
              animationDelay: `calc(${badge.delay} + 3s)`,
              animationDuration: '4s',
              animationIterationCount: 'infinite',
            }}
          >
            {badge.text}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default FloatingBadges;