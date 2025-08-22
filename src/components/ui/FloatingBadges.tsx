import { Badge } from "./badge";

interface FloatingBadgesProps {
  className?: string;
}

const FloatingBadges = ({ className = '' }: FloatingBadgesProps) => {
  const badges = [
    { text: "REACT", position: "top-20 left-1/4", delay: "0s" },
    { text: "IA", position: "top-32 right-1/3", delay: "0.3s" },
    { text: "AUTOMAÇÃO", position: "top-1/2 left-1/6", delay: "0.6s" },
    { text: "UX/UI", position: "bottom-1/3 right-1/4", delay: "0.9s" },
    { text: "TYPESCRIPT", position: "bottom-20 left-1/3", delay: "1.2s" },
    { text: "API", position: "top-40 right-1/6", delay: "1.5s" },
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
            className="text-xs px-2 py-1 bg-background/10 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary/10 transition-all duration-300 animate-bounce"
            style={{
              animationDelay: `calc(${badge.delay} + 2s)`,
              animationDuration: '3s',
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