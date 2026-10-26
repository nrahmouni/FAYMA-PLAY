import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Volume2 } from 'lucide-react';
import { GameProps, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';

interface LetterTile {
  id: string;
  letter: string;
}

function splitLetters(text: string): string[] {
  return Array.from(text.normalize('NFC').replace(/[\u064B-\u065F\u0670]/g, ''));
}

export const LetterPuzzleGame: React.FC<GameProps> = ({
  words,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const questions = useMemo(
    () => words.filter(word => !word.text.trim().includes(' ')).slice(0, 5),
    [words],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [wrongOrder, setWrongOrder] = useState(false);
  const [solved, setSolved] = useState(false);
  const wrongReported = useRef(false);
  const { recordAnswer, finish } = useGameProgress('letter_puzzle', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const question = questions[questionIndex];
  const targetLetters = useMemo(() => question ? splitLetters(question.text) : [], [question]);
  const tiles = useMemo<LetterTile[]>(() => {
    if (!question) return [];
    return shuffleArray(targetLetters.map((letter, index) => ({ id: `${question.id}-${index}`, letter })));
  }, [question, targetLetters]);
  const placedTiles = placedIds.map(id => tiles.find(tile => tile.id === id)).filter((tile): tile is LetterTile => Boolean(tile));
  const isCorrect = placedTiles.length === targetLetters.length &&
    placedTiles.every((tile, index) => tile.letter === targetLetters[index]);

  useEffect(() => {
    if (!introSpoken || !question) return;
    const timeout = window.setTimeout(() => speak(copy.letterPuzzleHint, language), 250);
    return () => window.clearTimeout(timeout);
  }, [copy.letterPuzzleHint, introSpoken, language, question, speak]);

  useEffect(() => {
    if (!solved || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        finish(questions.map(word => word.id));
        return;
      }
      setQuestionIndex(index => index + 1);
      setPlacedIds([]);
      setWrongOrder(false);
      setSolved(false);
      wrongReported.current = false;
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [finish, question, questionIndex, questions, solved]);

  if (!question || targetLetters.length < 2) return <EmptyGame language={language} />;

  const addTile = (tile: LetterTile) => {
    if (solved || placedIds.includes(tile.id) || placedIds.length >= targetLetters.length) return;
    const nextIds = [...placedIds, tile.id];
    setPlacedIds(nextIds);
    setWrongOrder(false);
    speak(tile.letter, language);
  };

  const removeTile = (index: number) => {
    if (solved) return;
    setPlacedIds(ids => ids.filter((_, tileIndex) => tileIndex !== index));
    setWrongOrder(false);
  };

  const checkWord = () => {
    if (solved || placedTiles.length !== targetLetters.length) return;
    if (!isCorrect) {
      if (!wrongReported.current) {
        recordAnswer(question, false, question, false);
        wrongReported.current = true;
      }
      setWrongOrder(true);
      speak(copy.tryAgain, language);
      return;
    }
    setSolved(true);
    recordAnswer(question, true, question, false);
    speak(`${copy.correct} ${question.text}`, language);
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={questionIndex + 1} total={questions.length} label={copy.letterPuzzleProgress} icon="ABC" language={language} />
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-orange-100 via-white to-rose-100 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-orange-800">{copy.letterPuzzleTitle}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-4xl">{question.translation}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">{copy.letterPuzzleHint}</p>
          </div>
          <button
            type="button"
            onClick={() => speak(question.audioText || question.text, language)}
            aria-label={copy.listen}
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-4 font-extrabold text-orange-900 shadow-sm hover:bg-orange-50"
          >
            <Volume2 size={20} aria-hidden="true" /><span className="hidden sm:inline">{copy.listen}</span>
          </button>
        </div>
      </div>

      <div className="mb-5 flex min-h-16 flex-wrap items-center justify-center gap-2 rounded-3xl bg-slate-100 p-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {targetLetters.map((_, index) => (
          <button
            key={`${question.id}-slot-${index}`}
            type="button"
            onClick={() => removeTile(index)}
            aria-label={copy.letterPuzzleSlot.replace('{number}', String(index + 1))}
            className={`flex h-12 min-w-10 items-center justify-center rounded-xl border-2 px-2 text-xl font-black sm:h-14 sm:min-w-12 sm:text-2xl ${
              placedTiles[index]
                ? solved ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                  : wrongOrder ? 'border-rose-400 bg-rose-100 text-rose-900'
                    : 'border-orange-200 bg-white text-slate-900'
                : 'border-dashed border-slate-300 bg-white/70 text-slate-300'
            }`}
          >
            {placedTiles[index]?.letter || ''}
          </button>
        ))}
      </div>

      <div className="flex min-h-16 flex-wrap justify-center gap-2">
        {tiles.map(tile => {
          const used = placedIds.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              disabled={used || solved}
              onClick={() => addTile(tile)}
              aria-label={tile.letter}
              className={`h-12 min-w-12 rounded-2xl border-2 px-3 text-xl font-black transition sm:h-14 sm:min-w-14 sm:text-2xl ${
                used ? 'border-transparent bg-transparent text-transparent' : 'border-white bg-white text-orange-900 shadow-[0_4px_0_#e8c9a0] hover:-translate-y-0.5 hover:bg-orange-50'
              }`}
            >
              {used ? '\u00a0' : tile.letter}
            </button>
          );
        })}
      </div>

      {wrongOrder && !solved && (
        <p aria-live="polite" className="mt-4 text-center font-black text-rose-700">{copy.tryAgain}</p>
      )}
      {solved && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">{copy.correct} {question.text}</p>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setPlacedIds([]);
            setWrongOrder(false);
          }}
          disabled={solved || placedIds.length === 0}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 font-extrabold text-slate-700 disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> {copy.letterPuzzleReset}
        </button>
        <button
          type="button"
          onClick={checkWord}
          disabled={solved || placedIds.length !== targetLetters.length}
          className="min-h-12 rounded-2xl bg-orange-500 px-3 font-black text-white shadow-[0_4px_0_#c2410c] disabled:bg-slate-300 disabled:shadow-none"
        >
          {copy.checkOrder}
        </button>
      </div>
    </section>
  );
};
