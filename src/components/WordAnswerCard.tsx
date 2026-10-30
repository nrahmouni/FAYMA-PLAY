import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { WordIcon } from './WordIcon';
import { Volume2, Sparkles } from 'lucide-react';
import { getCachedAiImage, fetchAiWordImage } from '../lib/ai-image';

interface WordAnswerCardProps {
  word: {
    id: string;
    text: string;
    translation: string;
    phonetic?: string;
    imageUrl?: string;
    language?: string;
    theme?: string;
  };
  onClick: () => void;
  selected?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  showTranslation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WordAnswerCard: React.FC<WordAnswerCardProps> = ({
  word,
  onClick,
  selected = false,
  isCorrect = false,
  disabled = false,
  showTranslation = false,
  size = 'md',
  className = '',
}) => {
  const isAr = word.language === 'ar';
  const [aiImage, setAiImage] = useState<string | null>(() => getCachedAiImage(word.text, word.translation));

  useEffect(() => {
    let active = true;
    const cached = getCachedAiImage(word.text, word.translation);
    if (cached) {
      setAiImage(cached);
      return;
    }

    // If word doesn't have an asset image, fetch AI illustration
    if (!word.imageUrl || word.imageUrl.length < 5) {
      fetchAiWordImage(word.text, word.translation, word.language).then(img => {
        if (active && img) setAiImage(img);
      });
    }

    return () => {
      active = false;
    };
  }, [word.text, word.translation, word.language, word.imageUrl]);

  // Card size variants
  const sizeClasses = {
    sm: 'p-2 min-h-24 sm:min-h-28 text-sm',
    md: 'p-3 sm:p-4 min-h-32 sm:min-h-40 text-base',
    lg: 'p-4 sm:p-6 min-h-40 sm:min-h-52 text-lg',
  }[size];

  // Visual state styling
  let borderBgClass = 'border-white bg-white hover:border-emerald-300 hover:bg-emerald-50/50 shadow-[0_6px_0_#d1e7dd] text-slate-900';
  if (selected) {
    if (isCorrect) {
      borderBgClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-[0_6px_0_#059669] scale-105 ring-4 ring-emerald-300/60';
    } else {
      borderBgClass = 'border-rose-400 bg-rose-50 text-rose-950 shadow-[0_4px_0_#e11d48] opacity-60';
    }
  }

  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { scale: 1.04, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.96, y: 3 } : {}}
      disabled={disabled}
      onClick={onClick}
      lang={word.language}
      dir={isAr ? 'rtl' : 'ltr'}
      className={`relative flex flex-col items-center justify-between rounded-3xl border-3 transition-all duration-150 cursor-pointer select-none active:shadow-none ${sizeClasses} ${borderBgClass} ${className}`}
    >
      {/* Visual Image / Icon Container - Always Present */}
      <div className="relative flex items-center justify-center w-full flex-1 mb-1.5 py-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/80 flex items-center justify-center shadow-xs border border-amber-200/50 p-1.5 group-hover:scale-110 transition-transform">
          <WordIcon
            icon={aiImage || word.imageUrl}
            esWord={word.translation}
            size="2xl"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
        </div>
      </div>

      {/* Target Word Text */}
      <div className="w-full text-center px-1">
        <span
          className={`block font-black leading-tight text-slate-900 break-words whitespace-normal ${
            size === 'lg' ? 'text-lg sm:text-2xl' : size === 'md' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
          }`}
        >
          {word.text}
        </span>

        {/* Phonetic or native translation hint */}
        {word.phonetic && (
          <span className="block text-[11px] font-bold text-slate-400 mt-0.5 truncate">
            {word.phonetic}
          </span>
        )}

        {showTranslation && (
          <span className="block text-xs font-extrabold text-emerald-700 mt-0.5 truncate">
            {word.translation}
          </span>
        )}
      </div>

      {/* Selection indicator pill */}
      {selected && isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-black shadow-md border-2 border-white"
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
};
