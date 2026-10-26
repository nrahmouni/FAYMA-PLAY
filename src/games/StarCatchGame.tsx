import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';

interface StarCatchGameProps {
  language: Language;
}

const COPY: Record<Language, { title: string; hint: string; start: string; time: string; score: string; result: string; again: string }> = {
  es: { title: 'Atrapaestrellas', hint: 'Toca las estrellas fugaces. ¡Tienes 30 segundos!', start: '¡Empezar!', time: 'Tiempo', score: 'Estrellas', result: '¡Buen trabajo! Has atrapado', again: 'Jugar otra vez' },
  'nl-BE': { title: 'Sterren vangen', hint: 'Tik op de vallende sterren. Je hebt 30 seconden!', start: 'Start!', time: 'Tijd', score: 'Sterren', result: 'Goed gedaan! Je ving', again: 'Opnieuw spelen' },
  fr: { title: 'Attrape-étoiles', hint: 'Touche les étoiles filantes. Tu as 30 secondes !', start: 'Commencer !', time: 'Temps', score: 'Étoiles', result: 'Bravo ! Tu as attrapé', again: 'Rejouer' },
  ar: { title: 'التقط النجوم', hint: 'المس النجوم المتساقطة. لديك 30 ثانية!', start: 'ابدأ!', time: 'الوقت', score: 'النجوم', result: 'أحسنت! لقد التقطت', again: 'العب مرة أخرى' },
};

function randomStars() {
  const count = 2 + Math.floor(Math.random() * 3);
  return Array.from({ length: 20 }, (_, index) => index).sort(() => Math.random() - 0.5).slice(0, count);
}

export const StarCatchGame: React.FC<StarCatchGameProps> = ({ language }) => {
  const copy = COPY[language];
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const startedAt = useRef(0);
  const remaining = Math.max(0, 30 - Math.floor(elapsed));

  useEffect(() => {
    if (!active) return;
    startedAt.current = Date.now();
    const interval = window.setInterval(() => {
      const seconds = (Date.now() - startedAt.current) / 1000;
      setElapsed(seconds);
      setStars(randomStars());
      if (seconds >= 30) setActive(false);
    }, 700);
    return () => window.clearInterval(interval);
  }, [active]);

  const start = () => {
    setScore(0);
    setElapsed(0);
    setStars(randomStars());
    setActive(true);
  };

  const catchStar = (index: number) => {
    if (!active || !stars.includes(index)) return;
    setScore(current => current + 1);
    setStars(current => current.filter(star => star !== index));
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-2xl rounded-[2rem] border-4 border-white bg-white/95 p-4 shadow-xl sm:p-6">
      <header className="mb-4 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900">{copy.title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{copy.hint}</p>
        <div className="mt-3 flex justify-center gap-6 font-black text-amber-900">
          <span>{copy.time}: {remaining}</span>
          <span>⭐ {copy.score}: {score}</span>
        </div>
      </header>
      <div className="grid grid-cols-4 gap-2 rounded-3xl bg-gradient-to-br from-indigo-900 via-violet-800 to-slate-900 p-3 sm:gap-3 sm:p-4">
        {Array.from({ length: 20 }, (_, index) => (
          <button
            key={index}
            type="button"
            disabled={!active || !stars.includes(index)}
            aria-label={stars.includes(index) ? '⭐' : ' '}
            onClick={() => catchStar(index)}
            className="flex aspect-square items-center justify-center rounded-2xl text-3xl transition hover:scale-110 disabled:cursor-default sm:text-5xl"
          >
            {stars.includes(index) ? '🌟' : ''}
          </button>
        ))}
      </div>
      {!active && (
        <div className="mt-4 text-center" role="status">
          {elapsed >= 30 && <p className="mb-3 font-black text-emerald-800">🎉 {copy.result} {score} ⭐</p>}
          <button type="button" onClick={start} className="min-h-12 rounded-2xl bg-orange-500 px-8 font-black text-white shadow-[0_4px_0_#c2410c] transition hover:bg-orange-600 active:translate-y-1 active:shadow-none">
            {elapsed >= 30 ? copy.again : copy.start}
          </button>
        </div>
      )}
    </section>
  );
};
