import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { GameProps } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { useSpeech } from '../hooks/useSpeech';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';

export const WordTrainGame: React.FC<GameProps> = ({ words, difficulty, language, onCorrect, onWrong, onComplete }) => {
  const roundWords = useMemo(() => words.slice(0, Math.min(6, difficulty + 3)), [difficulty, words]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const { recordAnswer, finish } = useGameProgress('word_train', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const question = roundWords[questionIndex];
  const options = useMemo(() => {
    if (!question) return [];
    const distractors = shuffleArray(words.filter(word => word.id !== question.id)).slice(0, Math.min(3, difficulty));
    return shuffleArray([question, ...distractors]);
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
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [answerId, finish, question, questionIndex, roundWords]);

  if (!question) return <EmptyGame language={language} />;

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#f6fbff] p-4 shadow-[0_18px_45px_rgba(51,113,166,.14)] ring-1 ring-sky-100 sm:p-6">
      <GameProgress current={questionIndex + 1} total={roundWords.length} label={copy.trainProgress} icon="🚉" language={language} />
      <div className="mb-5 flex items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-blue-50 to-yellow-100 p-4 sm:gap-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black leading-relaxed text-slate-900 sm:text-3xl">{copy.trainTitle}</h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">{copy.trainHint}</p>
          <p className="mt-3 text-2xl font-black text-blue-800 sm:text-3xl">{question.translation}</p>
          <button
            type="button"
            onClick={() => speak(question.audioText || question.text, language)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-blue-800 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
            aria-label={copy.listen}
          >
            <Volume2 className="h-4 w-4" /> {copy.listen}
          </button>
        </div>
        <img src="/games/train.svg" alt="" className="h-16 w-24 shrink-0 object-contain sm:h-28 sm:w-48" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map(option => {
          const selected = answerId === option.id;
          const correct = option.id === question.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={answerId !== null}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setAnswerId(option.id);
                recordAnswer(question, correct);
              }}
              aria-label={option.translation}
              lang={option.language}
              dir={option.language === 'ar' ? 'rtl' : 'auto'}
              className={`flex min-h-28 flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition sm:min-h-36 ${
                selected && correct
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                  : selected ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-white bg-white text-slate-800 shadow-[0_5px_0_#d5e7f4] hover:-translate-y-1 hover:bg-sky-50'
              }`}
            >
              <span className="text-4xl sm:text-5xl" aria-hidden="true">{option.imageUrl || '✨'}</span>
              <span className="mt-2 text-base font-black sm:text-lg">{option.text}</span>
            </motion.button>
          );
        })}
      </div>
      {answerId && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-blue-800">
          {answerId === question.id ? copy.correct : copy.tryAgain}
        </p>
      )}
    </section>
  );
};
