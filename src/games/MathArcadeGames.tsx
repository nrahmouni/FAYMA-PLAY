import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps, Word } from '../types';
import { MathGameId, MATH_GAME_COPY } from '../data/mathGameCopy';
import { GameProgress } from './GameProgress';
import { useGameProgress } from './useGameProgress';

interface MathQuestion {
  id: string;
  left: number;
  right: number;
  operation: '+' | '−';
  answer: number;
  missing: 'left' | 'right' | 'answer';
  options: number[];
}

const ROUND_LENGTH = 6;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeOptions(answer: number, max: number) {
  const candidates = new Set<number>([answer]);
  const nearby = [answer - 2, answer - 1, answer + 1, answer + 2, answer + 3];
  while (candidates.size < 4) {
    const candidate = nearby.length ? nearby.splice(randomInt(0, nearby.length - 1), 1)[0] : randomInt(0, max);
    if (candidate >= 0 && candidate <= max) candidates.add(candidate);
  }
  return [...candidates].sort(() => Math.random() - 0.5);
}

function createQuestion(gameId: MathGameId, index: number, max: number): MathQuestion {
  const operation: MathQuestion['operation'] = gameId === 'cookie_count'
    ? '−'
    : (randomInt(0, 1) ? '+' : '−');
  let left: number;
  let right: number;

  if (operation === '+') {
    left = randomInt(1, max - 1);
    right = randomInt(1, max - left);
  } else {
    left = randomInt(2, max);
    right = randomInt(1, left);
  }

  const answer = operation === '+' ? left + right : left - right;
  const missing = gameId === 'number_bridge'
    ? (['left', 'right', 'answer'] as const)[index % 3]
    : 'answer';
  const correctChoice = missing === 'left' ? left : missing === 'right' ? right : answer;

  return {
    id: `${gameId}-${index}`,
    left,
    right,
    operation,
    answer,
    missing,
    options: makeOptions(correctChoice, max),
  };
}

function expressionFor(question: MathQuestion) {
  const left = question.missing === 'left' ? '?' : question.left;
  const right = question.missing === 'right' ? '?' : question.right;
  const answer = question.missing === 'answer' ? '?' : question.answer;
  return `${left} ${question.operation} ${right} = ${answer}`;
}

const COOKIE_EMOJIS = Array.from({ length: 20 }, (_, index) => index);

interface MathArcadeGameProps extends GameProps {
  gameId: MathGameId;
}

const MathArcadeGame: React.FC<MathArcadeGameProps> = ({
  gameId,
  difficulty,
  language,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const maxNumber = difficulty < 6 ? 10 : 20;
  const questions = useMemo(
    () => Array.from({ length: ROUND_LENGTH }, (_, index) => createQuestion(gameId, index, maxNumber)),
    [gameId, maxNumber],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [eliminatedAnswers, setEliminatedAnswers] = useState<number[]>([]);
  const { recordAnswer, finish } = useGameProgress(gameId, { onCorrect, onWrong, onComplete });
  const copy = MATH_GAME_COPY[language][gameId];
  const question = questions[questionIndex];

  useEffect(() => {
    if (selectedAnswer === null || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        finish(questions.map(item => item.id));
        return;
      }
      setQuestionIndex(index => index + 1);
      setSelectedAnswer(null);
      setEliminatedAnswers([]);
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [finish, question, questionIndex, questions, selectedAnswer]);

  if (!question) return null;

  const displayExpression = expressionFor(question);
  const answerWord: Word = {
    id: question.id,
    text: displayExpression,
    translation: String(question.answer),
    language,
    theme: 'math',
  };

  const chooseAnswer = (answer: number) => {
    if (selectedAnswer !== null || eliminatedAnswers.includes(answer)) return;
    const correctChoice = question.missing === 'left'
      ? question.left
      : question.missing === 'right'
        ? question.right
        : question.answer;
    const correct = answer === correctChoice;
    recordAnswer(answerWord, correct, answerWord, false);
    if (correct) setSelectedAnswer(answer);
    else setEliminatedAnswers(values => [...values, answer]);
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-amber-100 sm:p-6"
    >
      <GameProgress current={questionIndex + 1} total={questions.length} label={copy.progress} icon={gameId === 'comet_dash' ? '🚀' : gameId === 'cookie_count' ? '🍪' : gameId === 'number_bridge' ? '🌉' : '🗺️'} language={language} />

      {gameId === 'comet_dash' && (
        <div className="mb-5 rounded-3xl bg-gradient-to-br from-indigo-950 via-violet-900 to-sky-700 p-5 text-white sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">{copy.title}</h2>
              <p className="mt-2 font-semibold text-indigo-100">{copy.hint}</p>
            </div>
            <motion.span animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl" aria-hidden="true">🚀</motion.span>
          </div>
          <div dir="ltr" className="mt-5 rounded-2xl bg-white/15 px-4 py-5 text-center text-4xl font-black tracking-widest sm:text-5xl">{displayExpression}</div>
        </div>
      )}

      {gameId === 'cookie_count' && (
        <div className="mb-5 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="text-5xl" aria-hidden="true">👩‍🍳</span>
            <div>
              <h2 className="text-2xl font-black text-amber-950 sm:text-3xl">{copy.title}</h2>
              <p className="mt-1 font-semibold text-amber-900">{copy.hint}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-white/80 p-4 text-center">
            <div>
              <p className="text-xs font-black uppercase text-amber-800">{question.left} 🍪</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1" aria-label={`${question.left} ${copy.cookieLabel}`}>
                {COOKIE_EMOJIS.slice(0, question.left).map(cookie => <span key={cookie} aria-hidden="true">🍪</span>)}
              </div>
            </div>
            <span className="text-3xl font-black text-orange-700" aria-hidden="true">−</span>
            <div>
              <p className="text-xs font-black uppercase text-rose-800">{question.right} 🍴</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1" aria-label={`${question.right} ${copy.eatenLabel}`}>
                {COOKIE_EMOJIS.slice(0, question.right).map(cookie => <span key={cookie} aria-hidden="true">😋</span>)}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-3xl font-black text-amber-950">? 🍪</p>
        </div>
      )}

      {gameId === 'number_bridge' && (
        <div className="mb-5 rounded-3xl bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-sky-950 sm:text-3xl">{copy.title}</h2>
              <p className="mt-2 font-semibold text-sky-900">{copy.hint}</p>
            </div>
            <span className="text-5xl" aria-hidden="true">🌉</span>
          </div>
          <div dir="ltr" className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sky-800 p-4 text-3xl font-black text-white sm:gap-4 sm:p-6 sm:text-5xl">
            {displayExpression.split(' ').map((part, index) => (
              <span key={`${part}-${index}`} className={part === '?' ? 'rounded-xl bg-yellow-300 px-3 py-2 text-sky-950' : ''}>{part}</span>
            ))}
          </div>
          <p className="mt-3 text-center text-sm font-black text-sky-900">🪵 ━━━ 🪵 ━━━ 🪵</p>
        </div>
      )}

      {gameId === 'treasure_trail' && (
        <div className="mb-5 rounded-3xl bg-gradient-to-br from-emerald-100 via-lime-50 to-yellow-100 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-emerald-950 sm:text-3xl">{copy.title}</h2>
              <p className="mt-2 font-semibold text-emerald-900">{copy.hint}</p>
            </div>
            <span className="text-5xl" aria-hidden="true">🧭</span>
          </div>
          <div className="my-5 flex items-center justify-center gap-1 text-2xl sm:gap-3 sm:text-4xl" aria-label={`${questionIndex} de ${questions.length} pasos`}>
            {questions.map((item, index) => (
              <React.Fragment key={item.id}>
                <span aria-current={index === questionIndex ? 'step' : undefined}>{index < questionIndex ? '🟢' : index === questionIndex ? '🧍' : '⚪'}</span>
                {index < questions.length - 1 && <span className="text-amber-700" aria-hidden="true">〰️</span>}
              </React.Fragment>
            ))}
            <span aria-hidden="true">🏴‍☠️</span>
          </div>
          <p dir="ltr" className="rounded-2xl bg-white/80 p-4 text-center text-4xl font-black text-emerald-950 sm:text-5xl">{displayExpression}</p>
        </div>
      )}

      <div className={`grid gap-3 ${gameId === 'treasure_trail' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const eliminated = eliminatedAnswers.includes(option);
          const correctOption = question.missing === 'left'
            ? question.left
            : question.missing === 'right'
              ? question.right
              : question.answer;
          return (
            <motion.button
              key={`${question.id}-${option}`}
              type="button"
              disabled={selectedAnswer !== null || eliminated}
              whileTap={{ scale: 0.95 }}
              onClick={() => chooseAnswer(option)}
              className={`flex min-h-16 items-center justify-center rounded-2xl border-2 text-2xl font-black transition sm:min-h-20 sm:text-3xl ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  : eliminated
                    ? 'border-rose-300 bg-rose-100 text-rose-800 opacity-65'
                    : gameId === 'treasure_trail'
                      ? 'border-amber-200 bg-amber-50 text-amber-950 shadow-[0_5px_0_#e8c76a] hover:-translate-y-1 hover:bg-amber-100'
                      : 'border-white bg-white text-slate-900 shadow-[0_5px_0_#d9e9c9] hover:-translate-y-1 hover:bg-sky-50'
              }`}
            >
              {gameId === 'treasure_trail' && <span className="mr-2" aria-hidden="true">{isSelected ? '💰' : '🪙'}</span>}
              {option}
              <span className="sr-only">{copy.optionLabel} {index + 1}</span>
              {isSelected && option === correctOption && <span className="sr-only">✓</span>}
            </motion.button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">
          {copy.correctMessage} ✨
        </p>
      )}
      {eliminatedAnswers.length > 0 && selectedAnswer === null && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgainMessage} 💪
        </p>
      )}
    </section>
  );
};

export const CometDashGame: React.FC<GameProps> = props => <MathArcadeGame {...props} gameId="comet_dash" />;
export const CookieCountGame: React.FC<GameProps> = props => <MathArcadeGame {...props} gameId="cookie_count" />;
export const NumberBridgeGame: React.FC<GameProps> = props => <MathArcadeGame {...props} gameId="number_bridge" />;
export const TreasureTrailGame: React.FC<GameProps> = props => <MathArcadeGame {...props} gameId="treasure_trail" />;
