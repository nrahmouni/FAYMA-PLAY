import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';

interface MoleDashGameProps {
  language: Language;
}

const COPY: Record<Language, {
  title: string;
  hint: string;
  start: string;
  again: string;
  time: string;
  score: string;
  streak: string;
  bestStreak: string;
  result: string;
  mole: string;
  bomb: string;
  emptyHole: string;
}> = {
  es: { title: '¡Topo al hoyo!', hint: 'Atrapa los topos y evita las bombas. ¡Tienes 30 segundos!', start: '¡A jugar!', again: 'Otra partida', time: 'Tiempo', score: 'Puntos', streak: 'Racha', bestStreak: 'Mejor racha', result: '¡Tu puntuación!', mole: 'Topo: suma puntos', bomb: 'Bomba: resta puntos', emptyHole: 'Hoyo vacío' },
  'nl-BE': { title: 'Molletje-mep!', hint: 'Tik de molletjes en ontwijk de bommen. Je hebt 30 seconden!', start: 'Spelen!', again: 'Opnieuw spelen', time: 'Tijd', score: 'Punten', streak: 'Reeks', bestStreak: 'Beste reeks', result: 'Jouw score!', mole: 'Mol: punten erbij', bomb: 'Bom: punten eraf', emptyHole: 'Leeg holletje' },
  fr: { title: 'Tape-taupe !', hint: 'Attrape les taupes et évite les bombes. Tu as 30 secondes !', start: 'Jouer !', again: 'Rejouer', time: 'Temps', score: 'Points', streak: 'Série', bestStreak: 'Meilleure série', result: 'Ton score !', mole: 'Taupe : des points en plus', bomb: 'Bombe : des points en moins', emptyHole: 'Trou vide' },
  ar: { title: 'اضرب الخلد!', hint: 'أمسك حيوانات الخلد وتجنب القنابل. لديك 30 ثانية!', start: 'هيا نلعب!', again: 'العب مرة أخرى', time: 'الوقت', score: 'النقاط', streak: 'التتابع', bestStreak: 'أفضل تتابع', result: 'نتيجتك!', mole: 'الخلد: نقاط إضافية', bomb: 'القنبلة: تخصم نقاطًا', emptyHole: 'حفرة فارغة' },
};

type Target = { hole: number; type: 'mole' | 'bomb' };
const HOLE_COUNT = 12;
const ROUND_SECONDS = 30;

export const MoleDashGame: React.FC<MoleDashGameProps> = ({ language }) => {
  const copy = COPY[language];
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [target, setTarget] = useState<Target | null>(null);
  const startedAtRef = useRef(0);
  const nextSpawnAtRef = useRef(0);
  const remaining = Math.max(0, ROUND_SECONDS - Math.floor(elapsed));

  useEffect(() => {
    if (!active) return;
    startedAtRef.current = Date.now();
    nextSpawnAtRef.current = startedAtRef.current + 400;
    const interval = window.setInterval(() => {
      const now = Date.now();
      const seconds = (now - startedAtRef.current) / 1000;
      if (seconds >= ROUND_SECONDS) {
        setElapsed(ROUND_SECONDS);
        setTarget(null);
        setActive(false);
        return;
      }

      setElapsed(seconds);
      if (now >= nextSpawnAtRef.current) {
        setTarget({
          hole: Math.floor(Math.random() * HOLE_COUNT),
          type: Math.random() < 0.2 ? 'bomb' : 'mole',
        });
        nextSpawnAtRef.current = now + 700 + Math.random() * 250;
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [active]);

  const start = () => {
    setElapsed(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTarget(null);
    setActive(true);
  };

  const hit = (hole: number) => {
    if (!active || target?.hole !== hole) return;
    if (target.type === 'bomb') {
      setScore(current => Math.max(0, current - 2));
      setStreak(0);
    } else {
      const nextStreak = streak + 1;
      setScore(current => current + (nextStreak % 5 === 0 ? 3 : 1));
      setStreak(nextStreak);
      setBestStreak(current => Math.max(current, nextStreak));
    }
    setTarget(null);
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-2xl rounded-[2rem] border-4 border-white bg-white/95 p-4 shadow-xl sm:p-6">
      <header className="mb-4 rounded-2xl bg-gradient-to-r from-lime-100 to-amber-100 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900">{copy.title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{copy.hint}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 font-black text-emerald-900" aria-live="polite">
          <span>{copy.time}: {remaining}</span>
          <span>⭐ {copy.score}: {score}</span>
          {streak > 1 && <span>🔥 {copy.streak}: {streak}</span>}
        </div>
        <div className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-white/80" role="progressbar" aria-label={copy.time} aria-valuemin={0} aria-valuemax={ROUND_SECONDS} aria-valuenow={remaining}>
          <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-[width] duration-200" style={{ width: `${(remaining / ROUND_SECONDS) * 100}%` }} />
        </div>
      </header>
      <div className="grid grid-cols-3 gap-2 rounded-3xl bg-gradient-to-br from-lime-100 via-emerald-100 to-amber-100 p-3 shadow-inner sm:grid-cols-4 sm:gap-3 sm:p-4">
        {Array.from({ length: HOLE_COUNT }, (_, index) => {
          const isTarget = target?.hole === index;
          const isBomb = isTarget && target.type === 'bomb';
          return (
            <button
              key={index}
              type="button"
              disabled={!active || !isTarget}
              aria-label={isTarget ? (isBomb ? copy.bomb : copy.mole) : copy.emptyHole}
              onClick={() => hit(index)}
              className={`flex aspect-square items-center justify-center rounded-full border-4 border-emerald-900/15 text-4xl transition sm:text-5xl ${
                isTarget ? isBomb ? 'animate-bounce bg-rose-100' : 'animate-bounce bg-lime-200' : 'bg-emerald-900/10'
              } disabled:cursor-default`}
            >
              {isTarget ? isBomb ? '💣' : '🐹' : '🕳️'}
            </button>
          );
        })}
      </div>
      {!active && (
        <div className="mt-4 text-center" role="status">
          {elapsed >= ROUND_SECONDS && <p className="mb-3 font-black text-emerald-800">🎉 {copy.result} {score} ⭐ · {copy.bestStreak}: {bestStreak}</p>}
          <button type="button" onClick={start} className="min-h-12 rounded-2xl bg-emerald-600 px-8 font-black text-white shadow-[0_4px_0_#166534] transition hover:bg-emerald-700 active:translate-y-1 active:shadow-none">
            {elapsed >= ROUND_SECONDS ? copy.again : copy.start}
          </button>
        </div>
      )}
    </section>
  );
};
