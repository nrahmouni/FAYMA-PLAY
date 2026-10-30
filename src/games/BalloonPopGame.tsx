import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameProps, Word } from '../types';
import { WordIcon } from '../components/WordIcon';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { useGameProgress } from './useGameProgress';
import { Volume2, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LANGUAGES } from '../data/languages';

const BALLOON_COLORS = [
  { bg: 'from-rose-400 to-red-500', border: 'border-red-600', shadow: 'shadow-red-500/30' },
  { bg: 'from-sky-400 to-blue-500', border: 'border-blue-600', shadow: 'shadow-blue-500/30' },
  { bg: 'from-amber-400 to-orange-500', border: 'border-orange-600', shadow: 'shadow-orange-500/30' },
  { bg: 'from-emerald-400 to-green-500', border: 'border-green-600', shadow: 'shadow-green-500/30' },
  { bg: 'from-purple-400 to-violet-500', border: 'border-violet-600', shadow: 'shadow-violet-500/30' },
  { bg: 'from-pink-400 to-rose-400', border: 'border-rose-500', shadow: 'shadow-pink-500/30' },
];

import { VOCABULARY_BANK } from '../data/vocabulary';

export const BalloonPopGame: React.FC<GameProps> = ({
  words,
  language,
  nativeLanguage,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const roundWords = useMemo(() => (words.length > 0 ? words.slice(0, 4) : VOCABULARY_BANK.slice(0, 4)), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);

  const { recordAnswer } = useGameProgress('balloon_pop', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const { playSuccess, playError, playPop } = useSound();

  const currentWord = roundWords[currentIndex] || roundWords[0] || VOCABULARY_BANK[0];

  // Pick options (current + 3 others without duplicate texts)
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

  // Audio prompt
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

  const handlePop = (option: typeof currentWord) => {
    if (poppedId !== null) return;

    if (option.id === currentWord.id) {
      // Correct!
      setPoppedId(option.id);
      setCombo(c => c + 1);
      playPop();
      playSuccess();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
      });
      recordAnswer(currentWord, true, option);

      setTimeout(() => {
        setPoppedId(null);
        if (currentIndex < roundWords.length - 1) {
          setCurrentIndex(i => i + 1);
        }
      }, 700);
    } else {
      // Wrong balloon
      setWrongShakeId(option.id);
      setCombo(0);
      playError();
      recordAnswer(currentWord, false, option);
      setTimeout(() => setWrongShakeId(null), 500);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col items-center justify-between p-2 sm:p-4 min-h-[480px]">
      {/* Game Header Bar */}
      <div className="w-full flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md border-2 border-white mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎈</span>
          <div className="text-left">
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              ¡Explota el Globo Correcto!
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Ronda {currentIndex + 1} de {roundWords.length}
            </p>
          </div>
        </div>

        {combo > 1 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-black text-xs shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> ¡Racha x{combo}!
          </motion.div>
        )}
      </div>

      {/* Target Word Center Stage */}
      <div className="w-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl text-center mb-6 relative overflow-hidden">
        <p className="text-xs font-extrabold uppercase tracking-widest text-sky-200 mb-1">
          Busca y explota la palabra:
        </p>

        {/* Translation & Large Prompt */}
        <h3 className="text-2xl sm:text-4xl font-black drop-shadow-md">
          {currentWord.translation}
        </h3>

        {/* Audio helper buttons */}
        <div className="mt-3 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={playTargetAudio}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-indigo-900 font-black text-xs shadow-md hover:bg-sky-50 active:scale-95 transition"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>Escuchar en {LANGUAGES[language].name}</span>
          </button>

          {nativeLanguage && (
            <button
              type="button"
              onClick={playNativeHelp}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-indigo-900/40 text-white font-bold text-xs hover:bg-indigo-900/60 active:scale-95 transition"
              title="Pista en idioma nativo"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ayuda</span>
            </button>
          )}
        </div>
      </div>

      {/* Balloons Grid: Every single balloon ALWAYS has word + image! */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
        <AnimatePresence mode="popLayout">
          {options.map((option, idx) => {
            const isPopping = poppedId === option.id;
            const isShaking = wrongShakeId === option.id;
            const color = BALLOON_COLORS[idx % BALLOON_COLORS.length];

            return (
              <motion.button
                key={`${currentWord.id}-${option.id}`}
                layout
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isPopping
                    ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] }
                    : isShaking
                    ? { x: [-8, 8, -6, 6, 0] }
                    : { y: [0, -6, 0] }
                }
                transition={
                  isPopping
                    ? { duration: 0.4 }
                    : isShaking
                    ? { duration: 0.4 }
                    : { repeat: Infinity, duration: 2.2 + idx * 0.3, ease: 'easeInOut' }
                }
                disabled={poppedId !== null}
                onClick={() => handlePop(option)}
                className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-[2.5rem] bg-gradient-to-b ${color.bg} border-4 border-white ${color.shadow} shadow-lg text-white cursor-pointer select-none min-h-[160px] sm:min-h-[190px]`}
              >
                {/* Visual Image / Custom SVG inside balloon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/95 flex items-center justify-center p-2 shadow-inner mt-1">
                  <WordIcon
                    icon={option.imageUrl}
                    esWord={option.translation}
                    size="xl"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </div>

                {/* Target Word Text */}
                <div className="w-full text-center mt-2">
                  <span className="block font-black text-xs sm:text-sm md:text-base text-white drop-shadow-md leading-tight break-words whitespace-normal">
                    {option.text}
                  </span>
                  {option.phonetic && (
                    <span className="block text-[10px] font-bold text-white/80">
                      {option.phonetic}
                    </span>
                  )}
                </div>

                {/* Balloon Knot at bottom */}
                <div className="w-3 h-3 bg-white/80 rotate-45 rounded-xs mt-1 shadow-xs" />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
