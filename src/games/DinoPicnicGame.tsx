import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps } from '../types';
import { shuffleArray } from '../lib/utils';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';
import { WordIcon } from '../components/WordIcon';

export const DinoPicnicGame: React.FC<GameProps> = ({
  difficulty,
  language,
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const picnic = useMemo(() => {
    const languageWords = VOCABULARY_BANK.filter(word => word.language === language && word.imageUrl);
    const food = shuffleArray(languageWords.filter(word => word.theme === 'comida')).slice(0, 3);
    const otherItems = shuffleArray(languageWords.filter(word => word.theme !== 'comida'));
    const distractorCount = difficulty < 6 ? 3 : difficulty < 11 ? 5 : 7;
    return {
      food,
      cards: shuffleArray([...food, ...otherItems.slice(0, distractorCount)]),
    };
  }, [difficulty, language]);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [discardedIds, setDiscardedIds] = useState<string[]>([]);
  const { recordAnswer, finish } = useGameProgress('dino_picnic', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];

  useEffect(() => {
    if (!picnic.food.length || collectedIds.length !== picnic.food.length) return;
    const timeout = window.setTimeout(() => finish(picnic.food.map(word => word.id)), 800);
    return () => window.clearTimeout(timeout);
  }, [collectedIds.length, finish, picnic.food]);

  if (picnic.food.length < 2) return <EmptyGame language={language} />;

  const chooseCard = (word: typeof picnic.cards[number]) => {
    if (collectedIds.includes(word.id) || discardedIds.includes(word.id)) return;
    const correct = word.theme === 'comida';
    recordAnswer(word, correct, word);
    if (correct) setCollectedIds(ids => [...ids, word.id]);
    else setDiscardedIds(ids => [...ids, word.id]);
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={collectedIds.length} total={picnic.food.length} label={copy.dinoProgress} icon="🦕" language={language} />
      <div className="mb-5 flex items-center gap-3 rounded-3xl bg-gradient-to-br from-lime-100 via-emerald-50 to-yellow-100 p-4 sm:gap-5 sm:p-6">
        <span className="shrink-0 text-6xl sm:text-8xl" aria-hidden="true">🦖</span>
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-900 sm:text-3xl">{copy.dinoTitle}</h2>
          <p className="mt-1 text-sm font-bold text-emerald-900 sm:text-base">{copy.dinoHint}</p>
        </div>
      </div>

      <div className="mb-4 flex min-h-16 items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-lime-300 bg-lime-50 p-3">
        <span className="text-sm font-black text-emerald-900">{copy.dinoPlate}</span>
        {collectedIds.map(id => {
          const word = picnic.food.find(item => item.id === id);
          return <WordIcon key={id} icon={word?.imageUrl} esWord={word?.translation} size="md" className="text-3xl" />;
        })}
        {collectedIds.length === 0 && <span className="text-2xl" aria-hidden="true">🍽️</span>}
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {picnic.cards.map(word => {
          const collected = collectedIds.includes(word.id);
          const discarded = discardedIds.includes(word.id);
          return (
            <motion.button
              key={word.id}
              type="button"
              disabled={collected || discarded}
              whileTap={{ scale: 0.92 }}
              onClick={() => chooseCard(word)}
              aria-label={word.translation}
              className={`flex aspect-square min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 transition sm:rounded-3xl ${
                collected
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  : discarded
                    ? 'border-rose-500 bg-rose-100 text-rose-900 opacity-65'
                    : 'border-white bg-white shadow-[0_5px_0_#d9e9c9] hover:-translate-y-1 hover:bg-lime-50'
              }`}
            >
              <WordIcon icon={word.imageUrl} esWord={word.translation} size="xl" className="text-4xl sm:text-5xl" />
              {(collected || discarded) && <span className="text-xs font-black">{word.text}</span>}
            </motion.button>
          );
        })}
      </div>
      {discardedIds.length > 0 && collectedIds.length < picnic.food.length && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgain} {copy.dinoCheer} 💪
        </p>
      )}
      {collectedIds.length === picnic.food.length && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">
          {copy.correct} {copy.dinoYum} 🎉
        </p>
      )}
    </section>
  );
};
