import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

export function TestimonialCarousel({ 
  testimonials, 
  autoRotate = true, 
  rotateInterval = 6000,
  className = "" 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-rotate functionality
  useEffect(() => {
    if (autoRotate && testimonials.length > 1) {
      const interval = setInterval(goToNext, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [autoRotate, rotateInterval, testimonials.length]);

  if (!testimonials.length) return null;

  const currentTestimonial = testimonials[currentIndex];
  
  // Safety check for currentTestimonial
  if (!currentTestimonial || !currentTestimonial.author || !currentTestimonial.author.name) {
    return null;
  }

  return (
    <section className={`section ${className}`} aria-label="Depoimentos de clientes">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Quote Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-brand-primary/10 rounded-full">
              <Quote className="h-8 w-8 text-brand-primary" />
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-8">
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-foreground">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author Info */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={currentTestimonial.author.avatar} 
                  alt={`Foto de ${currentTestimonial.author.name}`}
                />
                <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-semibold">
                  {currentTestimonial.author.name?.split(' ').map(n => n[0]).join('') || 'XX'}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="font-sora font-semibold text-lg text-foreground">
                  {currentTestimonial.author.name}
                </div>
                <div className="text-muted-foreground">
                  {currentTestimonial.author.role} • {currentTestimonial.author.company}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center space-x-6 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="p-2 h-10 w-10 rounded-full border-neutral-300 hover:border-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex space-x-2" role="tablist">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-brand-primary scale-110' 
                        : 'bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    aria-label={`Ir para depoimento ${index + 1}`}
                    role="tab"
                    aria-selected={index === currentIndex}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="p-2 h-10 w-10 rounded-full border-neutral-300 hover:border-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Progress Bar */}
          {autoRotate && testimonials.length > 1 && (
            <div className="mt-6 w-full max-w-xs mx-auto bg-neutral-200 rounded-full h-1">
              <div className="h-full bg-brand-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Default testimonials for quick implementation
export const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    quote: "A Guilds transformou completamente nossos processos internos. O sistema que desenvolveram aumentou nossa produtividade em 40% no primeiro mês.",
    author: {
      name: "Ana Silva",
      role: "CEO",
      company: "TechCorp",
      avatar: "/placeholder-avatar-1.jpg"
    }
  },
  {
    id: "2", 
    quote: "Profissionais excepcionais com uma visão estratégica incomparável. Eles não apenas entregaram um produto, mas uma solução completa para nossos desafios.",
    author: {
      name: "Carlos Santos",
      role: "CTO",
      company: "Inovação Digital",
      avatar: "/placeholder-avatar-2.jpg"
    }
  },
  {
    id: "3",
    quote: "O workshop de automação da Guilds mudou a forma como nossa equipe trabalha. Reduzimos tarefas manuais em 60% e aumentamos a satisfação da equipe.",
    author: {
      name: "Mariana Costa",
      role: "Gerente de Operações",
      company: "LogisticaPro",
      avatar: "/placeholder-avatar-3.jpg"
    }
  }
];