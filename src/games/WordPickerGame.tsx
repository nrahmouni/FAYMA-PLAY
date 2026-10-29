import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { GameProps, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';
import { WordIcon } from '../components/WordIcon';

export const WordPickerGame: React.FC<GameProps> = ({
  words,
  difficulty,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const roundWords = useMemo(
    () => words.slice(0, Math.min(6, 2 + Math.floor((difficulty - 1) / 3))),
    [difficulty, words],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const { recordAnswer, finish } = useGameProgress('word_picker', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const question = roundWords[questionIndex];
  const options = useMemo(() => {
    if (!question) return [];
    const distractors = shuffleArray(roundWords.filter(word => word.id !== question.id));
    return shuffleArray([question, ...distractors.slice(0, Math.min(3, distractors.length))]);
  }, [question, roundWords]);

  useEffect(() => {
    if (!question || !introSpoken) return;
    const timeout = window.setTimeout(() => speak(question.audioText || question.text, language), 350);
    return () => window.clearTimeout(timeout);
  }, [introSpoken, language, question, speak]);

  useEffect(() => {
    if (!answerId || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 >= roundWords.length) {
        finish(roundWords.map(word => word.id));
        return;
      }
      setQuestionIndex(index => index + 1);
      setWrongIds([]);
      setAnswerId(null);
    }, 850);
    return () => window.clearTimeout(timeout);
  }, [answerId, finish, question, questionIndex, roundWords]);

  if (!question) return <EmptyGame language={language} />;

  const chooseWord = (option: Word) => {
    if (answerId || wrongIds.includes(option.id)) return;
    const correct = option.id === question.id;
    if (correct) setAnswerId(option.id);
    else setWrongIds(ids => [...ids, option.id]);
    recordAnswer(question, correct, option);
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={questionIndex + 1} total={roundWords.length} label={copy.wordPickerProgress} icon="🎈" language={language} />
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100 p-4 sm:p-6">
        <p className="text-xs font-black uppercase tracking-wider text-violet-800">{copy.wordPickerTitle}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {question.imageUrl && <WordIcon icon={question.imageUrl} esWord={question.translation} size="lg" className="text-3xl sm:text-4xl" />}
            <h2 className="text-2xl font-black text-slate-900 sm:text-4xl">{question.translation}</h2>
          </div>
          <button
            type="button"
            onClick={() => speak(question.audioText || question.text, language)}
            aria-label={copy.listen}
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-4 font-extrabold text-violet-900 shadow-sm hover:bg-violet-50"
          >
            <Volume2 size={20} aria-hidden="true" />
            <span className="hidden sm:inline">{copy.listen}</span>
          </button>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-700">{copy.wordPickerHint}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {options.map((option, index) => {
          const selectedCorrect = answerId === option.id;
          const eliminated = wrongIds.includes(option.id);
          return (
            <motion.button
              key={`${question.id}-${option.id}`}
              type="button"
              disabled={Boolean(answerId) || eliminated}
              whileTap={{ scale: 0.96 }}
              onClick={() => chooseWord(option)}
              lang={option.language}
              dir={option.language === 'ar' ? 'rtl' : 'auto'}
              className={`flex min-h-16 items-center justify-center rounded-3xl border-2 px-4 py-3 text-xl font-black transition sm:min-h-20 sm:text-2xl ${
                selectedCorrect
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  : eliminated
                    ? 'border-rose-500 bg-rose-100 text-rose-900 opacity-70'
                    : 'border-white bg-white text-slate-900 shadow-[0_5px_0_#d9e9c9] hover:-translate-y-1 hover:bg-violet-50'
              }`}
            >
              <span>{option.text}</span>
              <span className="sr-only">{copy.optionLabel} {index + 1}</span>
            </motion.button>
          );
        })}
      </div>

      {answerId && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">
          {copy.correct} {question.text} · {question.translation} 🎉
        </p>
      )}
      {!answerId && wrongIds.length > 0 && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgain} ¡Puedes probar otra! 💪
        </p>
      )}
    </section>
  );
};
