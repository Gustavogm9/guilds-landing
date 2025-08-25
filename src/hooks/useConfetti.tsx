import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: string[];
  gravity?: number;
  scalar?: number;
  drift?: number;
  ticks?: number;
}

export const useConfetti = () => {
  // Guild-themed confetti with brand colors
  const fireGuildConfetti = useCallback((options: ConfettiOptions = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06d6a0', '#f72585', '#ffba08', '#8338ec'],
      shapes: ['square', 'circle'],
      scalar: 1.2,
      gravity: 0.8,
      drift: 0,
      ticks: 200
    };

    const config = { ...defaults, ...options };
    
    confetti({
      ...config,
      particleCount: config.particleCount,
      spread: config.spread,
      origin: config.origin,
      colors: config.colors,
      shapes: config.shapes,
      scalar: config.scalar,
      gravity: config.gravity,
      drift: config.drift,
      ticks: config.ticks
    });
  }, []);

  // Success celebration - multiple bursts
  const celebrateSuccess = useCallback(() => {
    // First burst from left
    fireGuildConfetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.25, y: 0.7 }
    });

    // Second burst from right
    setTimeout(() => {
      fireGuildConfetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.75, y: 0.7 }
      });
    }, 200);

    // Central burst
    setTimeout(() => {
      fireGuildConfetti({
        particleCount: 75,
        spread: 80,
        origin: { x: 0.5, y: 0.6 }
      });
    }, 400);
  }, [fireGuildConfetti]);

  // Form submission success
  const celebrateFormSubmission = useCallback(() => {
    // Gentle upward burst
    fireGuildConfetti({
      particleCount: 80,
      spread: 50,
      origin: { x: 0.5, y: 0.8 },
      colors: ['hsl(240, 85%, 55%)', 'hsl(165, 85%, 45%)'],
      scalar: 0.8,
      gravity: 0.6
    });

    // Delayed sparkle effect
    setTimeout(() => {
      fireGuildConfetti({
        particleCount: 30,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        colors: ['hsl(240, 85%, 55%)', 'hsl(165, 85%, 45%)'],
        shapes: ['circle'],
        scalar: 0.6,
        gravity: 0.3,
        ticks: 100
      });
    }, 500);
  }, [fireGuildConfetti]);

  // Project forged celebration (for major CTAs)
  const celebrateProjectForged = useCallback(() => {
    // Multiple sequential bursts with guild colors
    const colors = ['hsl(240, 85%, 55%)', 'hsl(165, 85%, 45%)', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        fireGuildConfetti({
          particleCount: 40,
          spread: 70,
          origin: { x: Math.random(), y: 0.6 + Math.random() * 0.2 },
          colors: colors,
          scalar: 1 + Math.random() * 0.5,
          gravity: 0.7
        });
      }, i * 150);
    }
  }, [fireGuildConfetti]);

  // Cannon blast (dramatic effect)
  const cannonBlast = useCallback((side: 'left' | 'right' | 'both' = 'both') => {
    const fire = (x: number) => {
      confetti({
        particleCount: 100,
        spread: 26,
        startVelocity: 55,
        origin: { x, y: 0.8 },
        colors: ['hsl(240, 85%, 55%)', 'hsl(165, 85%, 45%)']
      });
    };

    if (side === 'left' || side === 'both') {
      fire(0.1);
    }
    
    if (side === 'right' || side === 'both') {
      setTimeout(() => fire(0.9), side === 'both' ? 200 : 0);
    }
  }, []);

  return {
    fireGuildConfetti,
    celebrateSuccess,
    celebrateFormSubmission,
    celebrateProjectForged,
    cannonBlast
  };
};