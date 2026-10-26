import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { GameProps, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';
import { shuffleArray } from '../lib/utils';
import { VOCABULARY_BANK } from '../data/vocabulary';

export const DragMatchGame: React.FC<GameProps> = ({
  words,
  difficulty,
  onCorrect,
  onWrong,
  onComplete,
  language,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [burst, setBurst] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(difficulty >= 4 ? 12 : 20);

  const startTimeRef = useRef<number>(Date.now());
  const wordsSeenRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { speak, hasVoiceForLanguage } = useSpeech();
  const { playSuccess, playError, playCardFlip } = useSound();

  const currentWord = words[currentIndex] || words[0];
  const isArabic = language === 'ar';

  // Build options for current target word with distractors
  useEffect(() => {
    if (!currentWord) return;

    if (!wordsSeenRef.current.includes(currentWord.id)) {
      wordsSeenRef.current.push(currentWord.id);
    }

    // Number of options based on difficulty: 2 to 4
    const optionCount = difficulty >= 3 ? 4 : difficulty >= 2 ? 3 : 2;

    // Get distractors from entire vocabulary of the same language
    const otherWords = VOCABULARY_BANK.filter(
      w => w.language === language && w.id !== currentWord.id
    );
    const distractors = shuffleArray(otherWords).slice(0, optionCount - 1);
    const merged = shuffleArray([currentWord, ...distractors]);

    setOptions(merged);
    setFeedback(null);
    setIsShaking(false);

    // Auto pronunciation of new word
    speak(currentWord.audioText || currentWord.text, language);
  }, [currentIndex, currentWord, difficulty, language, speak]);

  // Countdown timer for higher difficulty
  useEffect(() => {
    if (difficulty >= 3) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleOptionSelect({ id: 'timeout' } as Word);
            return difficulty >= 4 ? 12 : 20;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, difficulty]);

  const handleOptionSelect = (selected: Word) => {
    if (feedback !== null) return; // Prevent spam

    if (selected.id === currentWord.id) {
      // Correct!
      playSuccess();
      setBurst(true);
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      onCorrect(currentWord.id);

      setTimeout(() => {
        setBurst(false);
        advanceToNextWord(correctCount + 1, wrongCount);
      }, 1100);
    } else {
      // Wrong!
      playError();
      setIsShaking(true);
      setFeedback('wrong');
      setWrongCount(w => w + 1);
      onWrong(currentWord.id);

      setTimeout(() => {
        setIsShaking(false);
        setFeedback(null);
      }, 1000);
    }
  };

  const advanceToNextWord = (finalCorrect: number, finalWrong: number) => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(i => i + 1);
      setTimeLeft(difficulty >= 4 ? 12 : 20);
    } else {
      // Finished all words in round
      const totalTime = Date.now() - startTimeRef.current;
      const coinsEarned = 10 + finalCorrect * 5;
      onComplete({
        playerId: '', // Handled by session
        gameId: 'drag_match',
        correct: finalCorrect,
        wrong: finalWrong,
        timeMs: totalTime,
        coinsEarned,
        wordsSeen: wordsSeenRef.current,
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <JuiceBurst trigger={burst} type="correct" />

      {/* Header bar: Progress + Timer */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Palabra {currentIndex + 1} de {words.length}</span>
        </div>

        {difficulty >= 3 && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
            timeLeft <= 4 ? 'bg-rose-500/30 text-rose-400 border border-rose-500 animate-pulse' : 'glass-card text-slate-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Target Word Card (Hero Prominence) */}
      <motion.div
        animate={isShaking ? { x: [-12, 12, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`w-full rounded-3xl glass-panel p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl relative border-2 ${
          feedback === 'correct'
            ? 'border-emerald-400 bg-emerald-950/20'
            : feedback === 'wrong'
            ? 'border-rose-500 bg-rose-950/20'
            : 'border-cyan-400/40 hover:border-cyan-400/70'
        } transition-all`}
      >
        <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mb-2">
          ¿Cuál es la traducción correcta?
        </span>

        {/* Word Text in native script */}
        <h2
          className={`font-black text-center text-slate-100 mb-3 tracking-wide select-none ${
            isArabic ? 'text-4xl sm:text-5xl font-arabic py-2' : 'text-3xl sm:text-4xl'
          }`}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {currentWord.text}
        </h2>

        {/* Phonetic transcription badge */}
        {currentWord.phonetic && (
          <div className="px-3 py-1 rounded-full bg-slate-800/80 text-cyan-300 text-xs sm:text-sm font-mono border border-cyan-500/20 mb-4">
            /{currentWord.phonetic}/
          </div>
        )}

        {/* Audio Listen Button */}
        <button
          type="button"
          onClick={() => {
            playCardFlip();
            speak(currentWord.audioText || currentWord.text, language);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/40 transition active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-xs font-bold">Escuchar de nuevo</span>
        </button>

        {/* Feedback Icon Overlay */}
        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-4 right-4 text-emerald-400"
            >
              <CheckCircle2 className="w-8 h-8" />
            </motion.div>
          )}
          {feedback === 'wrong' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-4 right-4 text-rose-500"
            >
              <XCircle className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Options Grid / Drop Targets */}
      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((option, idx) => {
          const isTarget = option.id === currentWord.id;
          const showSuccess = feedback === 'correct' && isTarget;

          return (
            <motion.button
              key={option.id + idx}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOptionSelect(option)}
              className={`p-4 rounded-2xl glass-card flex items-center justify-between border-2 transition cursor-pointer select-none text-left min-h-[72px] ${
                showSuccess
                  ? 'border-emerald-400 bg-emerald-500/20 shadow-emerald-500/20'
                  : 'border-white/10 hover:border-cyan-400/50 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{option.imageUrl || '✨'}</span>
                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                    {option.translation}
                  </div>
                  {option.theme && (
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {option.theme}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-cyan-400">
                {idx + 1}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
