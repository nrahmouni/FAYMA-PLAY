import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';
import { WordIcon } from '../components/WordIcon';

interface MatchLine {
  from: string;
  to: string;
  correct: boolean;
}

interface Point {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const LineMatchGame: React.FC<GameProps> = ({
  words,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const pairs = useMemo(() => words.slice(0, 5), [words]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongLine, setWrongLine] = useState<MatchLine | null>(null);
  const [linePoints, setLinePoints] = useState<Array<Point & { id: string; correct: boolean }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { recordAnswer, finish } = useGameProgress('line_match', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const rightWords = useMemo(() => shuffleArray(pairs), [pairs]);
  const completed = matchedIds.length;

  useEffect(() => {
    if (!introSpoken || !pairs.length) return;
    const timeout = window.setTimeout(() => speak(copy.lineMatchHint, language), 250);
    return () => window.clearTimeout(timeout);
  }, [copy.lineMatchHint, introSpoken, language, pairs, speak]);

  useEffect(() => {
    const updateLines = () => {
      const container = containerRef.current;
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      const connections: MatchLine[] = [
        ...matchedIds.map(id => ({ from: id, to: id, correct: true })),
        ...(wrongLine ? [wrongLine] : []),
      ];
      setLinePoints(connections.flatMap(connection => {
        const from = container.querySelector<HTMLElement>(`[data-match-left="${connection.from}"]`);
        const to = container.querySelector<HTMLElement>(`[data-match-right="${connection.to}"]`);
        if (!from || !to) return [];
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        return [{
          id: `${connection.from}-${connection.to}`,
          correct: connection.correct,
          x1: fromRect.right - bounds.left,
          y1: fromRect.top + fromRect.height / 2 - bounds.top,
          x2: toRect.left - bounds.left,
          y2: toRect.top + toRect.height / 2 - bounds.top,
        }];
      }));
    };
    updateLines();
    const observer = new ResizeObserver(updateLines);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateLines);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLines);
    };
  }, [matchedIds, rightWords, wrongLine]);

  useEffect(() => {
    if (completed !== pairs.length || pairs.length === 0) return;
    const timeout = window.setTimeout(() => finish(pairs.map(word => word.id)), 700);
    return () => window.clearTimeout(timeout);
  }, [completed, finish, pairs]);

  if (!pairs.length) return <EmptyGame language={language} />;

  const chooseRight = (word: Word) => {
    if (!selectedId || matchedIds.includes(word.id)) return;
    const prompt = pairs.find(item => item.id === selectedId);
    if (!prompt) return;
    const correct = prompt.id === word.id;
    setWrongLine({ from: prompt.id, to: word.id, correct });
    setSelectedId(null);
    speak(word.audioText || word.text, language);
    if (correct) {
      recordAnswer(prompt, true, word, false);
      setMatchedIds(ids => [...ids, prompt.id]);
      window.setTimeout(() => setWrongLine(null), 500);
    } else {
      recordAnswer(prompt, false, word, false);
      window.setTimeout(() => setWrongLine(null), 850);
    }
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={completed} total={pairs.length} label={copy.lineMatchProgress} icon="↔" language={language} />
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-sky-100 via-white to-violet-100 p-4 sm:p-6">
        <h2 className="text-xl font-black text-slate-900 sm:text-3xl">{copy.lineMatchTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-700">{copy.lineMatchHint}</p>
        <p className="mt-2 text-xs font-extrabold text-sky-800">{copy.lineMatchLeft} ← → {copy.lineMatchRight}</p>
      </div>

      <div ref={containerRef} className="relative grid min-h-72 grid-cols-2 gap-5 sm:gap-12">
        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" aria-hidden="true">
          {linePoints.map(line => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.correct ? '#10b981' : '#f43f5e'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={line.correct ? undefined : '8 7'}
            />
          ))}
        </svg>
        <div className="z-0 flex flex-col gap-3">
          {pairs.map(word => {
            const matched = matchedIds.includes(word.id);
            return (
              <button
                key={word.id}
                type="button"
                data-match-left={word.id}
                disabled={matched}
                onClick={() => setSelectedId(word.id)}
                className={`min-h-14 rounded-2xl border-2 px-3 text-left text-sm font-black transition sm:min-h-16 sm:px-4 sm:text-lg ${
                  matched
                    ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                    : selectedId === word.id
                      ? 'border-sky-500 bg-sky-100 text-sky-950 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-sky-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {word.imageUrl && <WordIcon icon={word.imageUrl} esWord={word.translation} size="sm" className="text-xl sm:text-2xl" />}
                  <span className="truncate">
                    {word.language === 'es' && word.english ? `${word.translation} · ${word.english}` : word.translation}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="z-0 flex flex-col gap-3">
          {rightWords.map(word => {
            const matched = matchedIds.includes(word.id);
            return (
              <button
                key={word.id}
                type="button"
                data-match-right={word.id}
                disabled={matched}
                onClick={() => chooseRight(word)}
                lang={word.language}
                className={`min-h-14 rounded-2xl border-2 px-3 text-right text-sm font-black transition sm:min-h-16 sm:px-4 sm:text-lg ${
                  matched
                    ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-violet-300'
                }`}
              >
                {word.text}
              </button>
            );
          })}
        </div>
      </div>
      {wrongLine && (
        <p aria-live="polite" className="mt-4 text-center font-black text-rose-700">
          {copy.tryAgain} {copy.lineMatchHint}
        </p>
      )}
      {completed === pairs.length && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">{copy.correct} {copy.lineMatchDone}</p>
      )}
    </section>
  );
};
