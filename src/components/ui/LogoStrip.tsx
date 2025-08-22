import React from 'react';

interface Logo {
  name: string;
  src: string;
  alt: string;
}

interface LogoStripProps {
  title?: string;
  logos: Logo[];
  className?: string;
}

export function LogoStrip({ title = "Confiam na Guilds", logos, className = "" }: LogoStripProps) {
  return (
    <section className={`section-sm ${className}`}>
      <div className="container">
        {title && (
          <div className="text-center mb-12">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-foreground">
              {title}
            </h2>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className="group relative flex items-center justify-center p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                loading="lazy"
              />
              
              {/* Tooltip with company name */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {logo.name}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent opacity-50 blur-3xl animate-pulse pointer-events-none" />
      </div>
    </section>
  );
}

// Default logos for quick implementation
export const defaultLogos: Logo[] = [
  { name: "Microsoft", src: "/placeholder-logo-1.svg", alt: "Logo Microsoft" },
  { name: "Google", src: "/placeholder-logo-2.svg", alt: "Logo Google" },
  { name: "Amazon", src: "/placeholder-logo-3.svg", alt: "Logo Amazon" },
  { name: "Meta", src: "/placeholder-logo-4.svg", alt: "Logo Meta" },
  { name: "Apple", src: "/placeholder-logo-5.svg", alt: "Logo Apple" },
  { name: "Netflix", src: "/placeholder-logo-6.svg", alt: "Logo Netflix" },
  { name: "Spotify", src: "/placeholder-logo-7.svg", alt: "Logo Spotify" },
  { name: "Uber", src: "/placeholder-logo-8.svg", alt: "Logo Uber" },
  { name: "Airbnb", src: "/placeholder-logo-9.svg", alt: "Logo Airbnb" },
  { name: "Tesla", src: "/placeholder-logo-10.svg", alt: "Logo Tesla" },
];