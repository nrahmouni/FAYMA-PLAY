import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { GameProps } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';
import { WordIcon } from '../components/WordIcon';
import { Volume2 } from 'lucide-react';
import { LANGUAGES } from '../data/languages';

export const SafariGame: React.FC<GameProps> = ({ words, difficulty, language, nativeLanguage, onCorrect, onWrong, onComplete }) => {
  const roundWords = useMemo(
    () => words.slice(0, Math.min(6, 2 + Math.floor((difficulty - 1) / 3))),
    [difficulty, words],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const { recordAnswer } = useGameProgress('safari', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const question = roundWords[questionIndex];

  const options = useMemo(() => {
    const others = shuffleArray(words.filter(w => w.id !== question.id)).slice(0, 3);
    return shuffleArray([question, ...others]);
  }, [question, words]);

  const speakQuestion = useCallback(() => {
    if (!question) return;
    speak(question.audioText || question.text, language);
  }, [language, question, speak]);

  const speakNativeHelp = useCallback(() => {
    if (!question || !nativeLanguage) return;
    speak(question.translation, nativeLanguage);
  }, [nativeLanguage, question, speak]);

  return (
    <section className="mx-auto w-full max-w-3xl rounded-[2rem] border-4 border-white bg-white/95 p-3 shadow-xl sm:p-5">
      <div className="mb-5 flex items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-lime-100 via-emerald-50 to-sky-100 p-4 sm:gap-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-800">{copy.safariPrompt}</p>
          <h2 className="mt-1 flex items-center gap-3 text-xl font-black leading-tight text-slate-900 sm:text-3xl">
            <span className="text-emerald-700">{question.translation}</span>
          </h2>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={speakQuestion}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-extrabold text-emerald-800 shadow-sm"
            >
              <Volume2 className="h-4 w-4" /> {copy.listen}
            </button>
            {nativeLanguage && (
              <button
                type="button"
                onClick={speakNativeHelp}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-extrabold text-sky-800 shadow-sm"
              >
                <Volume2 className="h-4 w-4" /> ? {LANGUAGES[nativeLanguage].name}
              </button>
            )}
          </div>
        </div>
        <img src="/games/safari.svg" alt="" className="h-16 w-20 shrink-0 object-contain sm:h-32 sm:w-40" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {options.map((option, index) => {
          const selected = answerId === option.id;
          const correct = option.id === question.id;
          const eliminated = wrongIds.includes(option.id);
          const revealed = selected || eliminated;
          return (
            <motion.button
              key={`${question.id}-${option.id}`}
              type="button"
              disabled={answerId !== null || eliminated}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (!correct) setWrongIds(ids => [...ids, option.id]);
                else setAnswerId(option.id);
                recordAnswer(question, correct, option);
              }}
              aria-label={`${option.imageUrl || ''}${revealed ? `: ${option.text}` : ''}`}
              lang={option.language}
              dir={option.language === 'ar' ? 'rtl' : 'auto'}
              className={`flex min-h-28 flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition sm:min-h-36 ${
                revealed
                  ? correct && selected
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                    : 'border-rose-500 bg-rose-100 text-rose-900 opacity-70'
                  : 'border-white bg-white shadow-[0_5px_0_#d9e9c9] hover:-translate-y-1 hover:bg-lime-50'
              }`}
            >
              <WordIcon icon={option.imageUrl} esWord={option.translation} size="xl" className="text-4xl sm:text-5xl" />
              <span className={`mt-2 text-base font-black ${revealed && correct && selected ? 'text-emerald-800' : 'text-slate-900'}`} lang={option.language}>
                {option.text}
              </span>
              {option.phonetic && (
                <span className="text-[10px] font-bold text-slate-500">
                  {option.phonetic}
                </span>
              )}
              <span className="sr-only">{copy.optionLabel} {index + 1}</span>
            </motion.button>
          );
        })}
      </div>
      {answerId && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-emerald-800">
          {`${copy.correct} ${question.text} · ${question.translation} 🎉`}
        </p>
      )}
      {!answerId && wrongIds.length > 0 && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgain} 💪
        </p>
      )}
    </section>
  );
};
