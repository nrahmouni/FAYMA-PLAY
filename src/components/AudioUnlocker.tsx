import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';

export const AudioUnlocker: React.FC = () => {
  const { unlockAudio } = useSound();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handleGesture = () => {
      if (!unlocked) {
        unlockAudio();
        // Warm up speech synthesis if available
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.getVoices();
          } catch {
            // ignore
          }
        }
        setUnlocked(true);
      }
    };

    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [unlockAudio, unlocked]);

  return null;
};
