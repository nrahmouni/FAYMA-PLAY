import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameProps, Word } from '../types';
import { WordIcon } from '../components/WordIcon';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { useGameProgress } from './useGameProgress';
import { Volume2, Sparkles, HelpCircle, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LANGUAGES } from '../data/languages';

import { VOCABULARY_BANK } from '../data/vocabulary';

export const MonsterSnackFeast: React.FC<GameProps> = ({
  words,
  language,
  nativeLanguage,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const roundWords = useMemo(() => (words.length > 0 ? words.slice(0, 4) : VOCABULARY_BANK.slice(0, 4)), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fedId, setFedId] = useState<string | null>(null);
  const [yuckId, setYuckId] = useState<string | null>(null);
  const [hearts, setHearts] = useState(3);

  const { recordAnswer } = useGameProgress('monster_snack', { onCorrect, onWrong, onComplete });
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

  const handleFeed = (option: typeof currentWord) => {
    if (fedId !== null) return;

    if (option.id === currentWord.id) {
      setFedId(option.id);
      playSuccess();
      confetti({
        particleCount: 35,
        spread: 65,
        origin: { y: 0.6 },
      });
      recordAnswer(currentWord, true, option);

      setTimeout(() => {
        setFedId(null);
        if (currentIndex < roundWords.length - 1) {
          setCurrentIndex(i => i + 1);
        }
      }, 700);
    } else {
      setYuckId(option.id);
      playError();
      recordAnswer(currentWord, false, option);
      setTimeout(() => setYuckId(null), 500);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col items-center justify-between p-2 sm:p-4 min-h-[480px]">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border-2 border-rose-200 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍕</span>
          <div className="text-left">
            <h2 className="text-base sm:text-lg font-black text-rose-950 leading-tight">
              ¡El Banquete del Monstruo Glotón!
            </h2>
            <p className="text-xs font-bold text-rose-700">
              Plato {currentIndex + 1} de {roundWords.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-rose-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className="w-5 h-5 fill-rose-500 text-rose-500" />
          ))}
        </div>
      </div>

      {/* Monster Prompt Card with 3D Food Artwork */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-rose-500 via-orange-400 to-amber-500 p-4 sm:p-5 text-white shadow-xl flex items-center justify-between gap-4 mb-5 overflow-hidden relative">
        <div className="min-w-0 flex-1 text-left">
          <span className="text-xs font-black uppercase tracking-wider text-rose-100">
            ¡El monstruito tiene hambre de esto!
          </span>
          <h3 className="text-2xl sm:text-4xl font-black mt-1 drop-shadow-md text-white">
            {currentWord.translation}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={playTargetAudio}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-rose-950 font-black text-xs shadow-md hover:bg-rose-50 active:scale-95 transition"
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span>Escuchar en {LANGUAGES[language].name}</span>
            </button>

            {nativeLanguage && (
              <button
                type="button"
                onClick={playNativeHelp}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/25 text-white font-bold text-xs hover:bg-black/40 active:scale-95 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ayuda</span>
              </button>
            )}
          </div>
        </div>

        {/* 3D Food Artwork Thumbnail */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md shrink-0">
          <img
            src="/src/assets/images/words_food_market_1793373486245.jpg"
            alt="Food Market"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Food Plates Grid: Word + Image ALWAYS Together! */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
        {options.map((option, idx) => {
          const isFed = fedId === option.id;
          const isYuck = yuckId === option.id;

          return (
            <motion.button
              key={`${currentWord.id}-${option.id}`}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isFed
                  ? { scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }
                  : isYuck
                  ? { x: [-8, 8, -6, 6, 0] }
                  : {}
              }
              disabled={fedId !== null}
              onClick={() => handleFeed(option)}
              className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border-3 transition-all select-none cursor-pointer min-h-[170px] sm:min-h-[200px] ${
                isFed
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-[0_6px_0_#059669] ring-4 ring-emerald-300'
                  : isYuck
                  ? 'border-rose-400 bg-rose-50 text-rose-950 opacity-60'
                  : 'border-orange-300/80 bg-white shadow-[0_6px_0_#f97316] hover:bg-orange-50/50'
              }`}
            >
              {/* Plate label */}
              <div className="text-xs font-black text-orange-600 mb-1">
                🍽️ Plato #{idx + 1}
              </div>

              {/* Word Image Icon - ALWAYS DISPLAYED */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-50/70 border border-orange-200 flex items-center justify-center p-2 shadow-inner">
                <WordIcon
                  icon={option.imageUrl}
                  esWord={option.translation}
                  size="xl"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>

              {/* Target Word in target language */}
              <div className="w-full text-center mt-2">
                <span className="block font-black text-xs sm:text-sm md:text-base text-slate-900 leading-tight break-words whitespace-normal">
                  {option.text}
                </span>
                {option.phonetic && (
                  <span className="block text-[11px] font-bold text-slate-500">
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
