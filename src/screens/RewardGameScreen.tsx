import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock3, Play, Sparkles, Star } from 'lucide-react';
import { Language } from '../types';
import { useGameStore } from '../store/gameStore';

const REWARD_COPY: Record<Language, { title: string; subtitle: string; start: string; exit: string; time: string; score: string; target: string; finished: string; back: string }> = {
  es: { title: 'Lluvia de estrellas', subtitle: '¡Toca las estrellas para atraparlas!', start: 'Empezar 10 minutos', exit: 'Salir', time: 'Tiempo de juego', score: 'Estrellas', target: 'Atrapar estrella', finished: '¡Misión cumplida!', back: 'Volver al camino' },
  en: { title: 'Star shower', subtitle: 'Tap the stars to catch them!', start: 'Start 10 minutes', exit: 'Exit', time: 'Play time', score: 'Stars', target: 'Catch star', finished: 'Mission complete!', back: 'Back to the path' },
  fr: { title: 'Pluie d’étoiles', subtitle: 'Touche les étoiles pour les attraper !', start: 'Jouer 10 minutes', exit: 'Quitter', time: 'Temps de jeu', score: 'Étoiles', target: 'Attraper une étoile', finished: 'Mission accomplie !', back: 'Retour au parcours' },
  'nl-BE': { title: 'Sterrenregen', subtitle: 'Tik op de sterren om ze te vangen!', start: '10 minuten spelen', exit: 'Stoppen', time: 'Speeltijd', score: 'Sterren', target: 'Ster vangen', finished: 'Missie voltooid!', back: 'Terug naar het pad' },
  ar: { title: 'مطر النجوم', subtitle: 'المس النجوم لالتقاطها!', start: 'ابدأ عشر دقائق', exit: 'خروج', time: 'وقت اللعب', score: 'النجوم', target: 'التقط نجمة', finished: 'اكتملت المهمة!', back: 'العودة إلى المسار' },
};

export const RewardGameScreen: React.FC = () => {
  const language = useGameStore(state => state.language);
  const setScreen = useGameStore(state => state.setScreen);
  const copy = REWARD_COPY[language];
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ left: 50, top: 50 });
  const isFinished = secondsLeft === 0;

  useEffect(() => {
    if (!isPlaying) return;
    const deadline = Date.now() + secondsLeft * 1000;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) setIsPlaying(false);
    }, 250);
    return () => window.clearInterval(timer);
  }, [isPlaying, secondsLeft]);

  const catchStar = () => {
    if (!isPlaying) return;
    setScore(value => value + 1);
    setPosition({ left: 12 + Math.random() * 76, top: 12 + Math.random() * 70 });
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <main lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-3 py-3 sm:px-6 sm:py-5">
      <section className="flex min-h-[min(74dvh,42rem)] flex-1 flex-col overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 p-4 shadow-xl sm:p-6">
        <header className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setScreen('WORLD_HUB')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/90 px-3 font-black text-slate-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
            <ArrowLeft className="h-4 w-4" /> {copy.exit}
          </button>
          <div className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 font-black tabular-nums text-white" aria-label={`${copy.time}: ${formatTime(secondsLeft)}`}>
            <Clock3 className="h-4 w-4" /> {formatTime(secondsLeft)}
          </div>
        </header>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white/75 px-4 py-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 sm:text-2xl">{copy.title}</h1>
            <p className="mt-1 text-sm font-bold text-slate-600">{isFinished ? copy.finished : copy.subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 font-black text-amber-950" aria-label={`${copy.score}: ${score}`}>
            <Star className="h-5 w-5 fill-amber-400 text-amber-600" /> {score}
          </div>
        </div>

        <div className="relative mt-3 min-h-56 flex-1 overflow-hidden rounded-2xl border-2 border-white/80 bg-gradient-to-b from-indigo-700 via-blue-700 to-slate-900 shadow-inner" aria-label={copy.title}>
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950/70 to-transparent" aria-hidden="true" />
          {!isPlaying && !isFinished && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/25 p-5 text-center">
              <span className="text-6xl" aria-hidden="true">🌠</span>
              <button type="button" onClick={() => setIsPlaying(true)} className="mt-4 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 text-lg font-black text-slate-950 shadow-[0_5px_0_#b7791f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <Play className="h-5 w-5 fill-current" /> {copy.start}
              </button>
            </div>
          )}
          {isPlaying && (
            <button type="button" onClick={catchStar} aria-label={copy.target} className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-amber-300/20 text-5xl transition-[left,top] duration-300 ease-out focus-visible:outline focus-visible:outline-4 focus-visible:outline-white" style={{ left: `${position.left}%`, top: `${position.top}%`, transform: 'translate(-50%, -50%)' }}>
              <span aria-hidden="true">⭐</span>
            </button>
          )}
          {isFinished && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/35 p-5 text-center text-white">
              <Sparkles className="h-12 w-12 text-amber-300" />
              <h2 className="mt-3 text-2xl font-black">{copy.finished}</h2>
              <p className="mt-1 font-bold">{copy.score}: {score}</p>
              <button type="button" onClick={() => setScreen('WORLD_HUB')} className="mt-4 min-h-12 rounded-xl bg-white px-5 font-black text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">{copy.back}</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
