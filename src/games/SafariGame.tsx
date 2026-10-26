import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';

export const SafariGame: React.FC<GameProps> = ({ words, difficulty, language, onCorrect, onWrong, onComplete }) => {
  const roundWords = useMemo(() => words.slice(0, Math.min(6, difficulty + 3)), [difficulty, words]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const { recordAnswer, finish } = useGameProgress('safari', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const question = roundWords[questionIndex];
  const options = useMemo(() => {
    if (!question) return [];
    const otherWords = words.filter(word => word.id !== question.id);
    return shuffleArray([question, ...shuffleArray(otherWords).slice(0, Math.min(3, difficulty))]);
  }, [difficulty, question, words]);

  useEffect(() => {
    if (!answerId || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 === roundWords.length) {
        finish(roundWords.map(word => word.id));
        return;
      }
      setAnswerId(null);
      setQuestionIndex(index => index + 1);
    }, 850);
    return () => window.clearTimeout(timeout);
  }, [answerId, finish, question, questionIndex, roundWords]);

  if (!question) return <EmptyGame language={language} />;

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6">
      <GameProgress current={questionIndex + 1} total={roundWords.length} label={copy.safariProgress} icon="🧭" language={language} />
      <div className="mb-5 flex items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-lime-100 via-emerald-50 to-sky-100 p-4 sm:gap-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wider text-emerald-800">{copy.safariPrompt}</p>
          <h2 className="mt-1 text-xl font-black leading-tight text-slate-900 sm:text-3xl">
            <span className="text-emerald-700">{question.translation}</span>
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">{copy.safariHint}</p>
          <button
            type="button"
            onClick={() => speak(question.audioText || question.text, language)}
            className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-extrabold text-emerald-800 shadow-sm"
            aria-label={copy.listen}
          >
            🔊 {copy.listen}
          </button>
        </div>
        <img src="/games/safari.svg" alt="" className="h-16 w-20 shrink-0 object-contain sm:h-32 sm:w-40" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {options.map((option, index) => {
          const selected = answerId === option.id;
          const correct = option.id === question.id;
          const revealed = answerId !== null && selected;
          return (
            <motion.button
              key={`${question.id}-${option.id}`}
              type="button"
              disabled={answerId !== null}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setAnswerId(option.id);
                recordAnswer(question, correct);
              }}
              aria-label={`${option.imageUrl || ''}${revealed ? `: ${option.text}` : ''}`}
              lang={option.language}
              dir={option.language === 'ar' ? 'rtl' : 'auto'}
              className={`flex min-h-28 flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition sm:min-h-36 ${
                revealed
                  ? correct ? 'border-emerald-400 bg-emerald-100' : 'border-rose-200 bg-rose-50'
                  : 'border-white bg-white shadow-[0_5px_0_#d9e9c9] hover:-translate-y-1 hover:bg-lime-50'
              }`}
            >
              <span className="text-4xl sm:text-5xl" aria-hidden="true">{option.imageUrl || '✨'}</span>
              {revealed && <span className="mt-1 text-sm font-black text-emerald-800" lang={option.language}>{option.text}</span>}
              <span className="sr-only">Opción {index + 1}</span>
            </motion.button>
          );
        })}
      </div>
      {answerId && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-emerald-800">
          {answerId === question.id ? `${copy.correct} ${question.text} · ${question.translation}` : `${copy.tryAgain} ${question.text} · ${question.translation}`}
        </p>
      )}
    </section>
  );
};
