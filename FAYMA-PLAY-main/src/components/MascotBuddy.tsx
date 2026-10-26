import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';

export type MascotMood = 'idle' | 'happy' | 'thinking' | 'sad' | 'victory';

interface MascotBuddyProps {
  mood?: MascotMood;
  customMessage?: string | null;
  onTap?: () => void;
  language?: string;
}

export const MascotBuddy: React.FC<MascotBuddyProps> = ({
  mood = 'idle',
  customMessage,
  onTap,
}) => {
  const activePlayer = useProfileStore(s => s.getActivePlayer());
  const equippedSkin = activePlayer?.equippedSkin;
  const [bubbleText, setBubbleText] = useState<string | null>(customMessage || null);

  useEffect(() => {
    if (customMessage) {
      setBubbleText(customMessage);
      const timer = setTimeout(() => {
        setBubbleText(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [customMessage]);

  // Skin accessory icon
  const getSkinAccessory = () => {
    if (equippedSkin === 'skin_cyber_shades') return '🕶️';
    if (equippedSkin === 'skin_beret_france') return '🎨';
    if (equippedSkin === 'skin_oriental_turban') return '👳';
    if (equippedSkin === 'skin_astro_helmet') return '👨‍🚀';
    return null;
  };

  // Face emoji based on mood
  const getMascotFace = () => {
    switch (mood) {
      case 'happy':
        return '😺';
      case 'victory':
        return '🦁';
      case 'thinking':
        return '🧐';
      case 'sad':
        return '🥺';
      default:
        return '🦊';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="mb-2 max-w-xs pointer-events-auto rounded-2xl glass-panel px-4 py-2.5 shadow-2xl border border-cyan-500/40 text-slate-100 text-xs sm:text-sm font-medium relative"
          >
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-0.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>JuegoBuddy</span>
            </div>
            <p className="leading-snug">{bubbleText}</p>
            {/* Speech pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar Container */}
      <motion.button
        type="button"
        onClick={onTap}
        aria-label="Interactuar con la mascota"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          y: mood === 'happy' || mood === 'victory' ? [-4, -14, -4] : [-2, -6, -2],
          rotate: mood === 'happy' ? [-4, 4, -4] : [0, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: mood === 'happy' ? 0.8 : 2.4,
          ease: 'easeInOut',
        }}
        className="pointer-events-auto relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl glass-card flex items-center justify-center shadow-2xl border-2 border-cyan-400/50 cursor-pointer overflow-visible group"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-pink-500/20 to-amber-500/20 blur-md group-hover:opacity-100 opacity-60 transition" />

        {/* Mascot Face */}
        <span className="text-3xl sm:text-4xl select-none z-10 transition-transform group-hover:scale-110">
          {getMascotFace()}
        </span>

        {/* Accessory on top */}
        {getSkinAccessory() && (
          <span className="absolute -top-3.5 -right-2 text-xl sm:text-2xl z-20 drop-shadow-md select-none animate-bounce">
            {getSkinAccessory()}
          </span>
        )}

        {/* Level / status indicator */}
        <span className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-slate-950 border border-cyan-400 flex items-center justify-center text-[10px] text-cyan-300 font-bold z-20">
          ★
        </span>
      </motion.button>
    </div>
  );
};
