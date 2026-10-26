import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';

interface StarCatchGameProps {
  language: Language;
}

const COPY: Record<Language, {
  title: string;
  hint: string;
  start: string;
  time: string;
  score: string;
  streak: string;
  bestStreak: string;
  result: string;
  again: string;
  starTarget: string;
  bombTarget: string;
  emptyTarget: string;
}> = {
  es: { title: 'Atrapaestrellas', hint: 'Atrapa estrellas, esquiva bombas y consigue combos. ¡Tienes 30 segundos!', start: '¡Empezar!', time: 'Tiempo', score: 'Puntos', streak: 'Racha', bestStreak: 'Mejor racha', result: '¡Buen trabajo! Has conseguido', again: 'Jugar otra vez', starTarget: 'Atrapar estrella', bombTarget: 'Bomba: resta puntos', emptyTarget: 'Casilla vacía' },
  'nl-BE': { title: 'Sterren vangen', hint: 'Vang sterren, ontwijk bommen en maak combo’s. Je hebt 30 seconden!', start: 'Start!', time: 'Tijd', score: 'Punten', streak: 'Reeks', bestStreak: 'Beste reeks', result: 'Goed gedaan! Je behaalde', again: 'Opnieuw spelen', starTarget: 'Ster vangen', bombTarget: 'Bom: punten aftrek', emptyTarget: 'Leeg vakje' },
  fr: { title: 'Attrape-étoiles', hint: 'Attrape les étoiles, évite les bombes et enchaîne les combos. Tu as 30 secondes !', start: 'Commencer !', time: 'Temps', score: 'Points', streak: 'Série', bestStreak: 'Meilleure série', result: 'Bravo ! Tu as obtenu', again: 'Rejouer', starTarget: 'Attraper une étoile', bombTarget: 'Bombe : points en moins', emptyTarget: 'Case vide' },
  ar: { title: 'التقط النجوم', hint: 'التقط النجوم وتجنب القنابل واجمع النقاط المتتالية. لديك 30 ثانية!', start: 'ابدأ!', time: 'الوقت', score: 'النقاط', streak: 'التتابع', bestStreak: 'أفضل تتابع', result: 'أحسنت! حصلت على', again: 'العب مرة أخرى', starTarget: 'التقط نجمة', bombTarget: 'قنبلة: تخصم نقاطًا', emptyTarget: 'خانة فارغة' },
};

function randomTargets() {
  const positions = Array.from({ length: 20 }, (_, index) => index);
  for (let index = positions.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [positions[index], positions[randomIndex]] = [positions[randomIndex], positions[index]];
  }
  const starCount = 2 + Math.floor(Math.random() * 3);
  return {
    stars: positions.slice(0, starCount),
    bombs: [positions[starCount]],
  };
}

export const StarCatchGame: React.FC<StarCatchGameProps> = ({ language }) => {
  const copy = COPY[language];
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const [bombs, setBombs] = useState<number[]>([]);
  const startedAt = useRef(0);
  const nextSpawnAt = useRef(0);
  const remaining = Math.max(0, 30 - Math.floor(elapsed));

  useEffect(() => {
    if (!active) return;
    startedAt.current = Date.now();
    nextSpawnAt.current = startedAt.current + 900;
    const interval = window.setInterval(() => {
      const now = Date.now();
      const seconds = (now - startedAt.current) / 1000;
      if (seconds >= 30) {
        setElapsed(30);
        setStars([]);
        setBombs([]);
        setActive(false);
        return;
      }
      setElapsed(seconds);
      if (now >= nextSpawnAt.current) {
        const targets = randomTargets();
        setStars(targets.stars);
        setBombs(targets.bombs);
        nextSpawnAt.current = now + 900;
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [active]);

  const start = () => {
    const targets = randomTargets();
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setElapsed(0);
    setStars(targets.stars);
    setBombs(targets.bombs);
    setActive(true);
  };

  const catchStar = (index: number) => {
    if (!active || !stars.includes(index)) return;
    const nextStreak = streak + 1;
    setScore(current => current + (nextStreak % 5 === 0 ? 6 : 1));
    setStreak(nextStreak);
    setBestStreak(current => Math.max(current, nextStreak));
    setStars(current => current.filter(star => star !== index));
  };

  const hitBomb = (index: number) => {
    if (!active || !bombs.includes(index)) return;
    setScore(current => Math.max(0, current - 2));
    setStreak(0);
    setBombs(current => current.filter(bomb => bomb !== index));
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-2xl rounded-[2rem] border-4 border-white bg-white/95 p-4 shadow-xl sm:p-6">
      <header className="mb-4 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900">{copy.title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{copy.hint}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 font-black text-amber-900" aria-live="polite">
          <span>{copy.time}: {remaining}</span>
          <span>⭐ {copy.score}: {score}</span>
          {streak > 1 && <span>🔥 {copy.streak}: {streak}</span>}
        </div>
        <div
          className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-white/80"
          role="progressbar"
          aria-label={copy.time}
          aria-valuemin={0}
          aria-valuemax={30}
          aria-valuenow={remaining}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-200" style={{ width: `${(remaining / 30) * 100}%` }} />
        </div>
      </header>
      <div className="grid grid-cols-4 gap-2 rounded-3xl bg-gradient-to-br from-indigo-950 via-violet-900 to-slate-900 p-3 shadow-inner sm:gap-3 sm:p-4">
        {Array.from({ length: 20 }, (_, index) => {
          const hasStar = stars.includes(index);
          const hasBomb = bombs.includes(index);
          return (
            <button
              key={index}
              type="button"
              disabled={!active || (!hasStar && !hasBomb)}
              aria-label={hasStar ? copy.starTarget : hasBomb ? copy.bombTarget : copy.emptyTarget}
              onClick={() => hasStar ? catchStar(index) : hitBomb(index)}
              className={`flex aspect-square items-center justify-center rounded-2xl text-3xl transition sm:text-5xl ${
                hasStar ? 'animate-pulse bg-indigo-800/60 hover:scale-110 active:scale-95' : ''
              } ${hasBomb ? 'bg-rose-950/70 hover:scale-110 active:scale-95' : ''} disabled:cursor-default`}
            >
              {hasStar ? '🌟' : hasBomb ? '💣' : ''}
            </button>
          );
        })}
      </div>
      {!active && (
        <div className="mt-4 text-center" role="status">
          {elapsed >= 30 && (
            <p className="mb-3 font-black text-emerald-800">
              🎉 {copy.result} {score} ⭐ · {copy.bestStreak}: {bestStreak}
            </p>
          )}
          <button type="button" onClick={start} className="min-h-12 rounded-2xl bg-orange-500 px-8 font-black text-white shadow-[0_4px_0_#c2410c] transition hover:bg-orange-600 active:translate-y-1 active:shadow-none">
            {elapsed >= 30 ? copy.again : copy.start}
          </button>
        </div>
      )}
    </section>
  );
};
