import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameProps, Word } from '../types';
import { WordIcon } from '../components/WordIcon';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { useGameProgress } from './useGameProgress';
import { Volume2, Sparkles, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LANGUAGES } from '../data/languages';

const ANIMAL_AVATARS = ['🦁', '🐶', '🐱', '🐘', '🐼', '🦊', '🐵', '🐨'];

import { VOCABULARY_BANK } from '../data/vocabulary';

export const SafariAnimalDash: React.FC<GameProps> = ({
  words,
  language,
  nativeLanguage,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const roundWords = useMemo(() => (words.length > 0 ? words.slice(0, 4) : VOCABULARY_BANK.slice(0, 4)), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hitId, setHitId] = useState<string | null>(null);
  const [missId, setMissId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const { recordAnswer } = useGameProgress('safari_dash', { onCorrect, onWrong, onComplete });
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

  const handleCatch = (option: typeof currentWord) => {
    if (hitId !== null) return;

    if (option.id === currentWord.id) {
      setHitId(option.id);
      setScore(s => s + 50);
      playSuccess();
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
      });
      recordAnswer(currentWord, true, option);

      setTimeout(() => {
        setHitId(null);
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
      {/* Header bar */}
      <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border-2 border-amber-200 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐾</span>
          <div className="text-left">
            <h2 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
              ¡Safari Atrapa-Palabras!
            </h2>
            <p className="text-xs font-bold text-amber-700">
              Ronda {currentIndex + 1} de {roundWords.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full font-black text-xs shadow-xs border border-amber-300">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>{score} pts</span>
        </div>
      </div>

      {/* Safari Prompt Card with Generated 3D Animal Art Preview */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 p-4 sm:p-5 text-white shadow-xl flex items-center justify-between gap-4 mb-5 overflow-hidden relative">
        <div className="min-w-0 flex-1 text-left">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
            ¡Encuentra al animal con la palabra!
          </span>
          <h3 className="text-2xl sm:text-4xl font-black mt-1 drop-shadow-md text-white">
            {currentWord.translation}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={playTargetAudio}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-emerald-950 font-black text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
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

        {/* 3D Animal Artwork illustration thumbnail */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md shrink-0">
          <img
            src="/src/assets/images/words_animals_safari_1793373484977.jpg"
            alt="Safari Animals"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Safari Bushes / Burrow Cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
        {options.map((option, idx) => {
          const isHit = hitId === option.id;
          const isMiss = missId === option.id;
          const mascot = ANIMAL_AVATARS[idx % ANIMAL_AVATARS.length];

          return (
            <motion.button
              key={`${currentWord.id}-${option.id}`}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              animate={
                isHit
                  ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }
                  : isMiss
                  ? { x: [-8, 8, -6, 6, 0] }
                  : {}
              }
              disabled={hitId !== null}
              onClick={() => handleCatch(option)}
              className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl border-3 transition-all select-none cursor-pointer min-h-[170px] sm:min-h-[200px] ${
                isHit
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-[0_6px_0_#059669] ring-4 ring-emerald-300'
                  : isMiss
                  ? 'border-rose-400 bg-rose-50 text-rose-950 opacity-60'
                  : 'border-amber-300/80 bg-white shadow-[0_6px_0_#f59e0b] hover:bg-amber-50/50'
              }`}
            >
              {/* Mascot animal head peeking out */}
              <div className="text-2xl sm:text-3xl mb-1 filter drop-shadow-sm">
                {mascot}
              </div>

              {/* Word Image Icon - ALWAYS PRESENT */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center p-2 shadow-inner">
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
