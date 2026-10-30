import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { GameProps, Word } from '../types';
import { WordIcon } from '../components/WordIcon';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { useGameProgress } from './useGameProgress';
import { Volume2, Sparkles, HelpCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LANGUAGES } from '../data/languages';

import { VOCABULARY_BANK } from '../data/vocabulary';

export const SpaceLaserBlaster: React.FC<GameProps> = ({
  words,
  language,
  nativeLanguage,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const roundWords = useMemo(() => (words.length > 0 ? words.slice(0, 4) : VOCABULARY_BANK.slice(0, 4)), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blastedId, setBlastedId] = useState<string | null>(null);
  const [missId, setMissId] = useState<string | null>(null);
  const [gemsEarned, setGemsEarned] = useState(0);

  const { recordAnswer } = useGameProgress('space_blaster', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const { playSuccess, playError } = useSound();

  const currentWord = roundWords[currentIndex] || roundWords[0] || VOCABULARY_BANK[0];

  const options = useMemo(() => {
    if (!currentWord) return [];
    const pool = words.length >= 4 ? words : VOCABULARY_BANK;
    const currentText = currentWord.text.trim().toLowerCase();

    const available = pool.filter(w =>
      w.id !== currentWord.id &&
      w.text.trim().toLowerCase() !== currentText
    );

    const chosen: Word[] = [currentWord];
    const seenTexts = new Set<string>([currentText]);

    const shuffled = [...available].sort(() => 0.5 - Math.random());

    for (const w of shuffled) {
      const txt = w.text.trim().toLowerCase();
      if (!seenTexts.has(txt)) {
        seenTexts.add(txt);
        chosen.push(w);
        if (chosen.length >= 4) break;
      }
    }

    return [...chosen].sort(() => 0.5 - Math.random());
  }, [currentWord, words]);

  const playTargetAudio = useCallback(() => {
    if (!currentWord) return;
    speak(currentWord.audioText || currentWord.text, language);
  }, [currentWord, language, speak]);

  const playNativeHelp = useCallback(() => {
    if (!currentWord || !nativeLanguage) return;
    speak(`En tu idioma: ${currentWord.translation}`, nativeLanguage);
  }, [currentWord, nativeLanguage, speak]);

  useEffect(() => {
    playTargetAudio();
  }, [currentIndex, playTargetAudio]);

  const handleBlast = (option: typeof currentWord) => {
    if (blastedId !== null) return;

    if (option.id === currentWord.id) {
      setBlastedId(option.id);
      setGemsEarned(g => g + 1);
      playSuccess();
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.6 },
      });
      recordAnswer(currentWord, true, option);

      setTimeout(() => {
        setBlastedId(null);
        if (currentIndex < roundWords.length - 1) {
          setCurrentIndex(i => i + 1);
        }
      }, 700);
    } else {
      setMissId(option.id);
      playError();
      recordAnswer(currentWord, false, option);
      setTimeout(() => setMissId(null), 500);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col items-center justify-between p-2 sm:p-4 min-h-[480px]">
      {/* Space HUD Bar */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border-2 border-indigo-500/50 text-white mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🚀</span>
          <div className="text-left">
            <h2 className="text-base sm:text-lg font-black text-cyan-400 leading-tight">
              ¡Disparador Láser Espacial!
            </h2>
            <p className="text-xs font-bold text-slate-400">
              Sector {currentIndex + 1} de {roundWords.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-indigo-950/80 text-cyan-300 px-3.5 py-1.5 rounded-full font-black text-xs border border-cyan-400/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>💎 {gemsEarned} Gemas</span>
        </div>
      </div>

      {/* Target Mission Card with 3D Space Artwork */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-4 sm:p-5 text-white shadow-2xl flex items-center justify-between gap-4 border-2 border-cyan-400/40 mb-5 relative overflow-hidden">
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-cyan-300 mb-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Apunta y dispara con tu cohete:</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black mt-1 text-white drop-shadow-md">
            {currentWord.translation}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={playTargetAudio}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-black text-xs shadow-md hover:bg-cyan-300 active:scale-95 transition"
            >
              <Volume2 className="w-4 h-4 text-slate-950" />
              <span>Escuchar en {LANGUAGES[language].name}</span>
            </button>

            {nativeLanguage && (
              <button
                type="button"
                onClick={playNativeHelp}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-cyan-200 font-bold text-xs hover:bg-white/20 active:scale-95 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ayuda</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D Space Art Thumbnail */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-md shrink-0">
          <img
            src="/src/assets/images/words_space_adventure_1793373486904.jpg"
            alt="Space Adventure"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Cosmic Target Meteors: Word + Image Always Displayed Together! */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
        {options.map((option, idx) => {
          const isBlasted = blastedId === option.id;
          const isMiss = missId === option.id;

          return (
            <motion.button
              key={`${currentWord.id}-${option.id}`}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isBlasted
                  ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                  : isMiss
                  ? { x: [-8, 8, -6, 6, 0] }
                  : {}
              }
              disabled={blastedId !== null}
              onClick={() => handleBlast(option)}
              className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border-3 transition-all select-none cursor-pointer min-h-[170px] sm:min-h-[200px] ${
                isBlasted
                  ? 'border-cyan-400 bg-cyan-900/60 text-white shadow-[0_6px_0_#06b6d4] ring-4 ring-cyan-400'
                  : isMiss
                  ? 'border-rose-500 bg-rose-950/60 text-rose-300 opacity-60'
                  : 'border-indigo-400/60 bg-slate-900/90 text-white shadow-[0_6px_0_#4338ca] hover:border-cyan-400'
              }`}
            >
              {/* Target Aim Icon */}
              <div className="text-sm font-black text-cyan-400/80 mb-1">
                🎯 ALBO #{idx + 1}
              </div>

              {/* Word Image Icon - ALWAYS DISPLAYED */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-950/80 border border-cyan-400/30 flex items-center justify-center p-2 shadow-inner">
                <WordIcon
                  icon={option.imageUrl}
                  esWord={option.translation}
                  size="xl"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>

              {/* Target Word Text in target language */}
              <div className="w-full text-center mt-2">
                <span className="block font-black text-xs sm:text-sm md:text-base text-cyan-100 leading-tight break-words whitespace-normal">
                  {option.text}
                </span>
                {option.phonetic && (
                  <span className="block text-[11px] font-bold text-cyan-300/70">
                    {option.phonetic}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
