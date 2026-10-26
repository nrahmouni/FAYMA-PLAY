import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface JuiceBurstProps {
  trigger: boolean;
  type?: 'correct' | 'victory' | 'coin';
  x?: number; // normalized 0-1
  y?: number;
}

export const JuiceBurst: React.FC<JuiceBurstProps> = ({
  trigger,
  type = 'correct',
  x = 0.5,
  y = 0.5,
}) => {
  useEffect(() => {
    if (!trigger) return;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    try {
      if (type === 'victory') {
        // Grand victory barrage
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#38bdf8', '#f59e0b', '#ec4899', '#10b981', '#a855f7'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.7 },
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.7 },
          });
        }, 200);
      } else if (type === 'coin') {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { x, y },
          colors: ['#fbbf24', '#f59e0b', '#fde047'],
          shapes: ['circle'],
          ticks: 120,
        });
      } else {
        // Quick juicy hit
        confetti({
          particleCount: 35,
          spread: 70,
          origin: { x, y },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
          ticks: 150,
        });
      }
    } catch {
      // Fallback silently if canvas unavailable
    }
  }, [trigger, type, x, y]);

  return null;
};
