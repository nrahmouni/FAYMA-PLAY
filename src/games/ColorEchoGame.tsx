import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';

interface ColorEchoGameProps {
  language: Language;
}

const COPY: Record<Language, {
  title: string;
  hint: string;
  start: string;
  watch: string;
  repeat: string;
  level: string;
  best: string;
  gameOver: string;
  again: string;
  colors: string[];
}> = {
  es: { title: 'Eco de colores', hint: 'Mira la secuencia y repítela sin equivocarte.', start: '¡Empezar!', watch: '¡Mira bien!', repeat: '¡Tu turno!', level: 'Nivel', best: 'Mejor nivel', gameOver: '¡Se acabó la secuencia!', again: 'Jugar otra vez', colors: ['Rojo', 'Azul', 'Verde', 'Amarillo'] },
  'nl-BE': { title: 'Kleuren-echo', hint: 'Kijk goed naar de reeks en herhaal ze zonder fouten.', start: 'Start!', watch: 'Kijk goed!', repeat: 'Jouw beurt!', level: 'Niveau', best: 'Beste niveau', gameOver: 'De reeks is voorbij!', again: 'Opnieuw spelen', colors: ['Rood', 'Blauw', 'Groen', 'Geel'] },
  fr: { title: 'Écho des couleurs', hint: 'Observe la séquence et répète-la sans te tromper.', start: 'Commencer !', watch: 'Regarde bien !', repeat: 'À toi !', level: 'Niveau', best: 'Meilleur niveau', gameOver: 'La séquence est terminée !', again: 'Rejouer', colors: ['Rouge', 'Bleu', 'Vert', 'Jaune'] },
  ar: { title: 'صدى الألوان', hint: 'شاهد التسلسل وكرره دون أخطاء.', start: 'ابدأ!', watch: 'راقب جيدًا!', repeat: 'دورك!', level: 'المستوى', best: 'أفضل مستوى', gameOver: 'انتهى التسلسل!', again: 'العب مرة أخرى', colors: ['أحمر', 'أزرق', 'أخضر', 'أصفر'] },
};

const COLORS = [
  'border-rose-800 bg-rose-500 shadow-[0_5px_0_#9f1239]',
  'border-sky-800 bg-sky-500 shadow-[0_5px_0_#075985]',
  'border-emerald-800 bg-emerald-500 shadow-[0_5px_0_#166534]',
  'border-amber-800 bg-amber-400 shadow-[0_5px_0_#92400e]',
];

export const ColorEchoGame: React.FC<ColorEchoGameProps> = ({ language }) => {
  const copy = COPY[language];
  const sequenceRef = useRef<number[]>([]);
  const inputIndexRef = useRef(0);
  const nextRoundTimeoutRef = useRef<number | undefined>(undefined);
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'pause' | 'over'>('idle');
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [litColor, setLitColor] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [bestLevel, setBestLevel] = useState(0);
  const [wrongColor, setWrongColor] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== 'showing') return;
    if (playbackIndex >= sequence.length) {
      const timeout = window.setTimeout(() => {
        setLitColor(null);
        setPhase('input');
      }, 400);
      return () => window.clearTimeout(timeout);
    }

    setLitColor(sequence[playbackIndex]);
    const timeout = window.setTimeout(() => {
      setLitColor(null);
      setPlaybackIndex(index => index + 1);
    }, 560);
    return () => window.clearTimeout(timeout);
  }, [phase, playbackIndex, sequence]);

  const nextRound = () => {
    const nextSequence = [...sequenceRef.current, Math.floor(Math.random() * COLORS.length)];
    sequenceRef.current = nextSequence;
    inputIndexRef.current = 0;
    setSequence(nextSequence);
    setLevel(nextSequence.length);
    setBestLevel(current => Math.max(current, nextSequence.length));
    setPlaybackIndex(0);
    setWrongColor(null);
    setPhase('showing');
  };

  const start = () => {
    window.clearTimeout(nextRoundTimeoutRef.current);
    sequenceRef.current = [];
    setSequence([]);
    setLevel(0);
    nextRound();
  };

  const chooseColor = (color: number) => {
    if (phase !== 'input') return;
    if (sequence[inputIndexRef.current] !== color) {
      setWrongColor(color);
      setPhase('over');
      return;
    }

    inputIndexRef.current += 1;
    if (inputIndexRef.current === sequence.length) {
      setPhase('pause');
      nextRoundTimeoutRef.current = window.setTimeout(nextRound, 650);
    }
  };

  useEffect(() => () => window.clearTimeout(nextRoundTimeoutRef.current), []);

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-2xl rounded-[2rem] border-4 border-white bg-white/95 p-4 shadow-xl sm:p-6">
      <header className="mb-5 rounded-2xl bg-gradient-to-r from-sky-100 to-violet-100 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900">{copy.title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{copy.hint}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 font-black text-violet-900" aria-live="polite">
          <span>{copy.level}: {level}</span>
          <span>🏆 {copy.best}: {bestLevel}</span>
        </div>
        {phase === 'showing' && <p className="mt-2 font-black text-violet-700" role="status">{copy.watch}</p>}
        {phase === 'input' && <p className="mt-2 font-black text-emerald-700" role="status">{copy.repeat}</p>}
      </header>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
        {COLORS.map((colorClass, index) => (
          <button
            key={colorClass}
            type="button"
            aria-label={copy.colors[index]}
            disabled={phase !== 'input'}
            onClick={() => chooseColor(index)}
            className={`aspect-square rounded-[2rem] border-4 transition duration-150 disabled:cursor-default ${
              litColor === index
                ? 'scale-105 brightness-150 ring-8 ring-white'
                : wrongColor === index
                  ? 'animate-pulse brightness-75'
                  : colorClass
            } ${phase === 'input' ? 'hover:brightness-110 active:scale-95' : ''}`}
          />
        ))}
      </div>
      {(phase === 'idle' || phase === 'over') && (
        <div className="mt-5 text-center" role="status">
          {phase === 'over' && <p className="mb-3 font-black text-rose-700">🙈 {copy.gameOver} {level > 1 ? `${copy.level}: ${level - 1}` : ''}</p>}
          <button type="button" onClick={start} className="min-h-12 rounded-2xl bg-violet-600 px-8 font-black text-white shadow-[0_4px_0_#5b21b6] transition hover:bg-violet-700 active:translate-y-1 active:shadow-none">
            {phase === 'over' ? copy.again : copy.start}
          </button>
        </div>
      )}
    </section>
  );
};
