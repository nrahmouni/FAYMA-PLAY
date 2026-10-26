import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps, Word } from '../types';
import { LearningGameId, LearningQuestion, LEARNING_GAME_COPY } from '../data/learningGameCopy';
import { GameProgress } from './GameProgress';
import { useGameProgress } from './useGameProgress';

interface PreparedQuestion extends LearningQuestion {
  id: string;
}

const GAME_STYLE: Record<LearningGameId, { icon: string; colors: string; button: string; banner: string }> = {
  body_detective: {
    icon: '🩺',
    colors: 'from-rose-100 via-orange-50 to-pink-100',
    button: 'hover:bg-rose-50 shadow-[0_5px_0_#f2d3d9]',
    banner: 'text-rose-950',
  },
  habitat_rescue: {
    icon: '🧭',
    colors: 'from-lime-100 via-emerald-50 to-yellow-100',
    button: 'hover:bg-lime-50 shadow-[0_5px_0_#d9e9c9]',
    banner: 'text-emerald-950',
  },
  space_explorer: {
    icon: '🪐',
    colors: 'from-indigo-950 via-violet-900 to-sky-800',
    button: 'hover:bg-indigo-50 shadow-[0_5px_0_#d9e9c9]',
    banner: 'text-white',
  },
  eco_mission: {
    icon: '🌱',
    colors: 'from-emerald-100 via-lime-50 to-cyan-100',
    button: 'hover:bg-emerald-50 shadow-[0_5px_0_#cce5ca]',
    banner: 'text-emerald-950',
  },
};

function prepareQuestions(id: LearningGameId, source: LearningQuestion[]): PreparedQuestion[] {
  return source.map((question, index) => {
    const order = question.options.map((_, optionIndex) => optionIndex);
    for (let current = order.length - 1; current > 0; current -= 1) {
      const swap = Math.floor(Math.random() * (current + 1));
      [order[current], order[swap]] = [order[swap], order[current]];
    }
    return {
      id: `${id}-${index}`,
      prompt: question.prompt,
      options: order.map(optionIndex => question.options[optionIndex]),
      answer: order.indexOf(question.answer),
    };
  });
}

interface SubjectArcadeGameProps extends GameProps {
  gameId: LearningGameId;
}

const SubjectArcadeGame: React.FC<SubjectArcadeGameProps> = ({
  gameId,
  language,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const copy = LEARNING_GAME_COPY[language][gameId];
  const questions = useMemo(() => prepareQuestions(gameId, copy.questions), [copy.questions, gameId]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [eliminatedAnswers, setEliminatedAnswers] = useState<number[]>([]);
  const { recordAnswer, finish } = useGameProgress(gameId, { onCorrect, onWrong, onComplete });
  const question = questions[questionIndex];
  const style = GAME_STYLE[gameId];

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
    }, 850);
    return () => window.clearTimeout(timeout);
  }, [finish, question, questionIndex, questions, selectedAnswer]);

  if (!question) return null;

  const chooseAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || eliminatedAnswers.includes(answerIndex)) return;
    const correct = answerIndex === question.answer;
    const answerWord: Word = {
      id: question.id,
      text: question.prompt,
      translation: question.options[question.answer],
      language,
      theme: gameId,
    };
    recordAnswer(answerWord, correct, answerWord, false);
    if (correct) setSelectedAnswer(answerIndex);
    else setEliminatedAnswers(values => [...values, answerIndex]);
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-emerald-100 sm:p-6">
      <GameProgress current={questionIndex + 1} total={questions.length} label={copy.progress} icon={style.icon} language={language} />

      {gameId === 'body_detective' && (
        <div className={`mb-5 rounded-3xl bg-gradient-to-br ${style.colors} p-5 sm:p-7`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className={`text-2xl font-black ${style.banner} sm:text-3xl`}>{copy.title}</h2>
              <p className="mt-2 font-semibold text-rose-900">{copy.hint}</p>
            </div>
            <motion.span animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl" aria-hidden="true">🩺</motion.span>
          </div>
          <p className="mt-5 rounded-2xl bg-white/80 p-4 text-center text-xl font-black text-rose-950 sm:text-2xl">{question.prompt}</p>
          <p className="mt-3 text-center text-3xl" aria-hidden="true">🧠　🫀　🫁</p>
        </div>
      )}

      {gameId === 'habitat_rescue' && (
        <div className={`mb-5 rounded-3xl bg-gradient-to-br ${style.colors} p-5 sm:p-7`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className={`text-2xl font-black ${style.banner} sm:text-3xl`}>{copy.title}</h2>
              <p className="mt-2 font-semibold text-emerald-900">{copy.hint}</p>
            </div>
            <span className="text-6xl" aria-hidden="true">🐾</span>
          </div>
          <div className="mt-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-white/80 p-5 text-center">
            <p className="text-2xl font-black text-emerald-950 sm:text-3xl">{question.prompt}</p>
            <p className="mt-3 text-3xl" aria-hidden="true">🌳　🌿　💧　🌴</p>
          </div>
        </div>
      )}

      {gameId === 'space_explorer' && (
        <div className={`mb-5 rounded-3xl bg-gradient-to-br ${style.colors} p-5 text-white sm:p-7`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">{copy.title}</h2>
              <p className="mt-2 font-semibold text-indigo-100">{copy.hint}</p>
            </div>
            <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl" aria-hidden="true">🚀</motion.span>
          </div>
          <div className="my-5 flex items-center justify-center gap-2 text-2xl sm:gap-5 sm:text-4xl" aria-label={`${questionIndex + 1} ${copy.progress}`}>
            {questions.map((item, index) => <span key={item.id} aria-current={index === questionIndex ? 'step' : undefined}>{index < questionIndex ? '🌟' : index === questionIndex ? '🚀' : '·'}</span>)}
            <span aria-hidden="true">🪐</span>
          </div>
          <p className="rounded-2xl bg-white/15 p-4 text-center text-xl font-black sm:text-2xl">{question.prompt}</p>
        </div>
      )}

      {gameId === 'eco_mission' && (
        <div className={`mb-5 rounded-3xl bg-gradient-to-br ${style.colors} p-5 sm:p-7`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className={`text-2xl font-black ${style.banner} sm:text-3xl`}>{copy.title}</h2>
              <p className="mt-2 font-semibold text-emerald-900">{copy.hint}</p>
            </div>
            <span className="text-6xl" aria-hidden="true">🌍</span>
          </div>
          <p className="mt-5 rounded-2xl bg-white/80 p-4 text-center text-xl font-black text-emerald-950 sm:text-2xl">{question.prompt}</p>
          <p className="mt-3 text-center text-3xl" aria-hidden="true">🌱　💧　♻️</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isEliminated = eliminatedAnswers.includes(index);
          return (
            <motion.button
              key={`${question.id}-${index}`}
              type="button"
              disabled={selectedAnswer !== null || isEliminated}
              whileTap={{ scale: 0.96 }}
              onClick={() => chooseAnswer(index)}
              className={`min-h-16 rounded-2xl border-2 px-4 py-3 text-lg font-black text-slate-900 transition sm:min-h-20 sm:text-xl ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-950'
                  : isEliminated
                    ? 'border-rose-300 bg-rose-100 text-rose-800 opacity-70'
                    : `border-white bg-white ${style.button}`
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {selectedAnswer !== null && <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">{copy.correctMessage} ✨</p>}
      {eliminatedAnswers.length > 0 && selectedAnswer === null && <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">{copy.tryAgainMessage} 💪</p>}
    </section>
  );
};

export const BodyDetectiveGame: React.FC<GameProps> = props => <SubjectArcadeGame {...props} gameId="body_detective" />;
export const HabitatRescueGame: React.FC<GameProps> = props => <SubjectArcadeGame {...props} gameId="habitat_rescue" />;
export const SpaceExplorerGame: React.FC<GameProps> = props => <SubjectArcadeGame {...props} gameId="space_explorer" />;
export const EcoMissionGame: React.FC<GameProps> = props => <SubjectArcadeGame {...props} gameId="eco_mission" />;
