import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { GameProps } from '../types';
import { shuffleArray } from '../lib/utils';
import { useSpeech } from '../hooks/useSpeech';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';

export const WordTrainGame: React.FC<GameProps> = ({ words, language, onCorrect, onWrong, onComplete }) => {
  const roundWords = useMemo(() => words.slice(0, 6), [words]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const { recordAnswer, finish } = useGameProgress('word_train', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const question = roundWords[questionIndex];
  const options = useMemo(() => {
    if (!question) return [];
    return shuffleArray([question, ...shuffleArray(words.filter(word => word.id !== question.id)).slice(0, 2)]);
  }, [question, words]);

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

  if (!question) return <EmptyGame />;

  const example = question.exampleSentence || question.text;
  const missingWord = example.includes(question.text)
    ? example.replace(question.text, '＿＿＿')
    : `＿＿＿ ${example}`;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#f6fbff] p-4 shadow-[0_18px_45px_rgba(51,113,166,.14)] ring-1 ring-sky-100 sm:p-6">
      <GameProgress current={questionIndex + 1} total={roundWords.length} label="Paradas del tren" icon="🚉" />
      <div className="mb-5 flex items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-blue-50 to-yellow-100 p-4 sm:gap-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wider text-blue-800">Frase de la estación</p>
          <h2 className="mt-2 text-xl font-black leading-relaxed text-slate-900 sm:text-3xl" lang={language} dir={language === 'ar' ? 'rtl' : 'auto'}>
            {missingWord}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Pista: en español significa <strong className="text-blue-800">{question.translation}</strong>
          </p>
          <button
            type="button"
            onClick={() => speak(question.audioText || question.text, language)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-blue-800 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
            aria-label="Escuchar la palabra"
          >
            <Volume2 className="h-4 w-4" /> Escuchar pista
          </button>
        </div>
        <img src="/games/train.svg" alt="Chispa el tren de colores listo para viajar" className="h-16 w-24 shrink-0 object-contain sm:h-28 sm:w-48" />
      </div>

      <div className="mb-3 text-center text-sm font-extrabold text-slate-700">¿Qué palabra ayuda a completar la frase?</div>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(option => {
          const selected = answerId === option.id;
          const correct = option.id === question.id;
          return (
            <motion.button
              key={`${question.id}-${option.id}`}
              type="button"
              disabled={answerId !== null}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setAnswerId(option.id);
                recordAnswer(question, correct);
              }}
              lang={option.language}
              dir={option.language === 'ar' ? 'rtl' : 'auto'}
              className={`min-h-16 rounded-2xl border-2 px-4 py-3 text-lg font-black transition sm:min-h-20 sm:text-xl ${
                selected && correct
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                  : selected ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-white bg-white text-slate-800 shadow-[0_5px_0_#d5e7f4] hover:-translate-y-1 hover:bg-sky-50'
              }`}
            >
              {option.text}
            </motion.button>
          );
        })}
      </div>
      {answerId && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-blue-800">
          {answerId === question.id ? `¡El tren sigue! ${question.text} significa ${question.translation}.` : '¡Buen intento! El tren espera un momento más.'}
        </p>
      )}
    </section>
  );
};
