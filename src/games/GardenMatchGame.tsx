import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { useSpeech } from '../hooks/useSpeech';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { WordIcon } from '../components/WordIcon';

interface FlowerCard {
  id: string;
  wordId: string;
  kind: 'picture' | 'word';
  content: string;
  language?: string;
}

import { LANGUAGES } from '../data/languages';

export const GardenMatchGame: React.FC<GameProps> = ({ words, difficulty, language, nativeLanguage, onCorrect, onWrong, onComplete }) => {
  const roundWords = useMemo(
    () => words.slice(0, Math.min(6, 2 + Math.floor((difficulty - 1) / 3), words.length)),
    [difficulty, words],
  );
  const cards = useMemo(() => shuffleArray(roundWords.flatMap<FlowerCard>(word => [
    { id: `${word.id}-picture`, wordId: word.id, kind: 'picture', content: word.imageUrl || '🌱' },
    { id: `${word.id}-word`, wordId: word.id, kind: 'word', content: word.text, language: word.language },
  ])), [roundWords]);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const { recordAnswer, finish } = useGameProgress('garden_match', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];

  useEffect(() => {
    if (openIds.length !== 2) return;
    const [firstId, secondId] = openIds;
    const first = cards.find(card => card.id === firstId);
    const second = cards.find(card => card.id === secondId);
    if (!first || !second) return;
    const matched = first.wordId === second.wordId && first.kind !== second.kind;
    setLocked(true);
    setAttempts(count => count + 1);
    setWrongIds(matched ? [] : [first.id, second.id]);
    const timeout = window.setTimeout(() => {
      const matchedWord = roundWords.find(word => word.id === first.wordId);
      if (matchedWord) recordAnswer(matchedWord, matched, matchedWord, false);
      if (matched) {
        const nextMatched = [...matchedIds, first.id, second.id];
        setMatchedIds(nextMatched);
        if (nextMatched.length === cards.length) finish(roundWords.map(word => word.id));
      }
      setOpenIds([]);
      setWrongIds([]);
      setLocked(false);
    }, matched ? 450 : 900);
    return () => window.clearTimeout(timeout);
  }, [cards, finish, matchedIds, openIds, recordAnswer, roundWords]);

  if (!roundWords.length) return <EmptyGame language={language} />;

  const completedPairs = matchedIds.length / 2;
  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffaf4] p-4 shadow-[0_18px_45px_rgba(150,97,58,.13)] ring-1 ring-amber-100 sm:p-6">
      <GameProgress current={completedPairs} total={roundWords.length} label={copy.gardenProgress} icon="🌼" language={language} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-gradient-to-r from-amber-100 via-pink-50 to-lime-100 p-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{copy.gardenTitle}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">{copy.gardenHint}</p>
        </div>
        <div className="flex gap-2">
          {nativeLanguage && (
            <button
              type="button"
              onClick={() => {
                // Simplified help: speak instructions
                speak(copy.gardenHint, nativeLanguage);
              }}
              className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-black text-white shadow-sm"
            >
              ? {LANGUAGES[nativeLanguage].name}
            </button>
          )}
          <div className="rounded-2xl bg-white/80 px-3 py-2 text-sm font-extrabold text-amber-800">{copy.attempts}: {attempts}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-3">
        {cards.map((card, index) => {
          const open = openIds.includes(card.id) || matchedIds.includes(card.id);
          return (
            <motion.button
              key={card.id}
              type="button"
              disabled={locked || matchedIds.includes(card.id) || openIds.includes(card.id)}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setOpenIds(ids => [...ids, card.id]);
                const word = roundWords.find(item => item.id === card.wordId);
                if (word) speak(word.audioText || word.text, language);
              }}
              aria-label={open ? card.content : `${copy.coveredFlower} ${index + 1}`}
              className={`flex aspect-square min-h-20 items-center justify-center rounded-2xl border-2 p-2 text-center shadow-sm transition sm:rounded-3xl ${
                matchedIds.includes(card.id)
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : wrongIds.includes(card.id) ? 'border-rose-500 bg-rose-100 text-rose-900'
                  : open ? 'border-amber-300 bg-white text-slate-800' : 'border-white bg-gradient-to-br from-pink-200 to-amber-200 text-5xl shadow-[0_5px_0_#e8c9a0] hover:-translate-y-1'
              }`}
            >
              {open ? (
                card.kind === 'picture' ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <WordIcon icon={card.content} esWord={roundWords.find(w => w.id === card.wordId)?.translation} size="xl" className="text-3xl sm:text-4xl" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{roundWords.find(w => w.id === card.wordId)?.translation || ''}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <WordIcon icon={roundWords.find(w => w.id === card.wordId)?.imageUrl || '🌱'} esWord={roundWords.find(w => w.id === card.wordId)?.translation} size="md" className="text-2xl sm:text-3xl" />
                    <span className="text-xs font-black sm:text-sm text-slate-800" lang={card.language}>{card.content}</span>
                  </div>
                )
              ) : (
                <span aria-hidden="true">🌷</span>
              )}
            </motion.button>
          );
        })}
      </div>
      {wrongIds.length > 0 && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgain} 💪
        </p>
      )}
    </section>
  );
};
