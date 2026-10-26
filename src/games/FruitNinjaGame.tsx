import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, GameResult } from '../types';

type Fruit = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  wordIndex: number;
  cut: boolean;
  radius: number;
  tint: string;
};
type TrailPoint = { x: number; y: number; life: number };
type SliceParticle = { x: number; y: number; vx: number; vy: number; life: number; tint: string };

const FRUIT = [
  { emoji: '🍉', tint: '#fb7185' },
  { emoji: '🍎', tint: '#ef4444' },
  { emoji: '🍓', tint: '#f43f5e' },
  { emoji: '🍌', tint: '#fde047' },
  { emoji: '🍊', tint: '#fb923c' },
  { emoji: '🍍', tint: '#facc15' },
  { emoji: '🥝', tint: '#84cc16' },
  { emoji: '🍒', tint: '#e11d48' },
];

/** Swipe-to-slice arcade with bombs, timed levels, score combos, and vocabulary. */
export const FruitNinjaGame: React.FC<GameProps> = ({ words, onCorrect, onWrong, onComplete, difficulty }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const pointer = useRef<{ x: number; y: number; down: boolean }>({ x: 0, y: 0, down: false });
  const trail = useRef<TrailPoint[]>([]);
  const callbacks = useRef({ onCorrect, onWrong, onComplete });
  callbacks.current = { onCorrect, onWrong, onComplete };
  const game = useRef({
    fruits: [] as Fruit[],
    particles: [] as SliceParticle[],
    last: 0,
    spawn: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    started: 0,
    elapsed: 0,
    done: false,
    cursor: 0,
    missed: 0,
    lives: 3,
    combo: 0,
    bestCombo: 0,
  });
  const deck = useMemo(() => words.slice(0, 12), [words]);
  const [hud, setHud] = useState({ score: 0, level: 1, combo: 0, lives: 3, missed: 0, message: 'Desliza el dedo o el ratón sobre las frutas para cortarlas.' });

  const finish = useCallback(() => {
    const g = game.current;
    if (g.done) return;
    g.done = true;
    const result: GameResult = {
      playerId: '',
      gameId: 'fruit',
      correct: g.correct,
      wrong: g.wrong,
      timeMs: Date.now() - g.started,
      coinsEarned: g.score + g.correct * 4 + g.bestCombo * 2,
      wordsSeen: deck.slice(0, g.cursor).map(word => word.id),
    };
    callbacks.current.onComplete(result);
  }, [deck]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const g = game.current;
    g.fruits = [];
    g.particles = [];
    g.last = performance.now();
    g.spawn = 0;
    g.score = 0;
    g.correct = 0;
    g.wrong = 0;
    g.started = Date.now();
    g.elapsed = 0;
    g.done = false;
    g.cursor = 0;
    g.missed = 0;
    g.lives = 3;
    g.combo = 0;
    g.bestCombo = 0;
    trail.current = [];
    pointer.current.down = false;
    setHud({ score: 0, level: 1, combo: 0, lives: 3, missed: 0, message: 'Desliza el dedo o el ratón sobre las frutas para cortarlas.' });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const coords = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const down = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      const point = coords(event);
      pointer.current = { ...point, down: true };
      trail.current.push({ ...point, life: 190 });
    };
    const move = (event: PointerEvent) => {
      const point = coords(event);
      if (!pointer.current.down) return;
      const previous = pointer.current;
      trail.current.push({ ...point, life: 220 });
      const dx = point.x - previous.x;
      const dy = point.y - previous.y;
      const lengthSquared = dx * dx + dy * dy;
      for (const fruit of g.fruits) {
        if (fruit.cut) continue;
        const projection = lengthSquared
          ? Math.max(0, Math.min(1, ((fruit.x - previous.x) * dx + (fruit.y - previous.y) * dy) / lengthSquared))
          : 0;
        const closestX = previous.x + projection * dx;
        const closestY = previous.y + projection * dy;
        if (Math.hypot(fruit.x - closestX, fruit.y - closestY) >= fruit.radius + 10) continue;
        fruit.cut = true;
        if (fruit.emoji === '💣') {
          g.wrong += 1;
          g.lives -= 1;
          g.combo = 0;
          callbacks.current.onWrong(deck[fruit.wordIndex]?.id || '');
          setHud(value => ({ ...value, lives: g.lives, combo: 0, message: '💥 ¡Bomba! La racha se ha roto. Evita las bombas.' }));
          if (g.lives <= 0) finish();
          continue;
        }
        const word = deck[fruit.wordIndex];
        g.combo += 1;
        g.bestCombo = Math.max(g.bestCombo, g.combo);
        g.correct += 1;
        g.cursor += 1;
        g.score += 10 * Math.min(5, 1 + Math.floor((g.combo - 1) / 3));
        if (word) {
          callbacks.current.onCorrect(word.id);
          setHud(value => ({
            ...value,
            score: g.score,
            combo: g.combo,
            message: `${g.combo > 2 ? `COMBO ×${g.combo} · ` : ''}${word.text} = ${word.translation}`,
          }));
        }
        for (let index = 0; index < 10; index += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.08 + Math.random() * 0.22;
          g.particles.push({
            x: fruit.x,
            y: fruit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 480,
            tint: fruit.tint,
          });
        }
      }
      pointer.current = { ...point, down: true };
    };
    const up = () => { pointer.current.down = false; };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    window.addEventListener('resize', resize);
    resize();
    let lastHud = 0;

    const draw = (now: number) => {
      const dt = Math.min(34, now - g.last);
      g.last = now;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const level = Math.min(5, Math.floor(g.elapsed / 9000) + 1);

      if (!g.done) {
        g.elapsed += dt;
        g.spawn -= dt;
        if (g.spawn <= 0 && deck.length > 0) {
          const count = Math.random() < 0.2 ? 2 : 1;
          for (let index = 0; index < count; index += 1) {
            const bomb = Math.random() < 0.13;
            const fruit = FRUIT[Math.floor(Math.random() * FRUIT.length)];
            const wordIndex = g.cursor % deck.length;
            g.fruits.push({
              id: now + Math.random(),
              x: 45 + Math.random() * (width - 90),
              y: height + 30,
              vx: (Math.random() - 0.5) * 0.22,
              vy: -(0.45 + Math.random() * 0.18 + difficulty * 0.035 + (level - 1) * 0.025),
              emoji: bomb ? '💣' : fruit.emoji,
              wordIndex,
              cut: false,
              radius: bomb ? 23 : 25,
              tint: fruit.tint,
            });
          }
          g.spawn = Math.max(390, 980 - difficulty * 75 - (level - 1) * 85);
        }
        for (const fruit of g.fruits) {
          fruit.x += fruit.vx * dt;
          fruit.y += fruit.vy * dt;
          fruit.vy += 0.00072 * dt;
          if (fruit.y > height + 60 && !fruit.cut && fruit.emoji !== '💣') {
            fruit.cut = true;
            g.missed += 1;
            g.wrong += 1;
            const word = deck[fruit.wordIndex];
            if (word) callbacks.current.onWrong(word.id);
            if (g.missed >= 5) finish();
          }
        }
        g.fruits = g.fruits.filter(fruit => !fruit.cut && fruit.y < height + 80);
        g.particles = g.particles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx * dt,
            y: particle.y + particle.vy * dt,
            vy: particle.vy + dt * 0.0005,
            life: particle.life - dt,
          }))
          .filter(particle => particle.life > 0);
        trail.current = trail.current.map(point => ({ ...point, life: point.life - dt })).filter(point => point.life > 0);
        if (g.elapsed > 45000) finish();
      }

      const background = ctx.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, '#064e3b');
      background.addColorStop(0.58, '#022c22');
      background.addColorStop(1, '#020617');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      for (let index = 0; index < 28; index += 1) {
        ctx.fillStyle = 'rgba(74,222,128,.08)';
        ctx.beginPath();
        ctx.arc((index * 71) % width, (index * 97 + g.elapsed * 0.03) % height, 2 + (index % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      for (const fruit of g.fruits) {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.font = `${fruit.radius * 1.8}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = fruit.emoji === '💣' ? '#fb7185' : fruit.tint;
        ctx.shadowBlur = 18;
        ctx.fillText(fruit.emoji, 0, 0);
        ctx.shadowBlur = 0;
        if (fruit.emoji !== '💣') {
          const word = deck[fruit.wordIndex];
          ctx.font = 'bold 11px system-ui';
          const label = (word?.text || '').slice(0, 13);
          const labelWidth = ctx.measureText(label).width + 12;
          ctx.fillStyle = 'rgba(2,6,23,.82)';
          ctx.beginPath();
          ctx.roundRect(-labelWidth / 2, fruit.radius + 4, labelWidth, 22, 7);
          ctx.fill();
          ctx.fillStyle = '#d9f99d';
          ctx.fillText(label, 0, fruit.radius + 15);
        }
        ctx.restore();
      }
      for (const particle of g.particles) {
        ctx.globalAlpha = Math.min(1, particle.life / 220);
        ctx.fillStyle = particle.tint;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(2, particle.life / 100), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (let index = 1; index < trail.current.length; index += 1) {
        const previous = trail.current[index - 1];
        const current = trail.current[index];
        ctx.strokeStyle = `rgba(103,232,249,${Math.min(1, current.life / 150)})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(2,6,23,.76)';
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, 48, 13);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '900 13px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`🍉 NIVEL ${level}/5 · ${Math.max(0, 45 - Math.floor(g.elapsed / 1000))}s · ⭐ ${g.score}`, 24, 32);
      ctx.fillText(g.combo > 1 ? `🔥 COMBO ×${g.combo}` : '✂️ SLICE', 24, 50);
      ctx.textAlign = 'right';
      ctx.fillText(`❤️ ${g.lives}   ❌ ${g.missed}/5`, width - 24, 42);
      if (g.done) {
        ctx.fillStyle = 'rgba(2,6,23,.72)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '900 25px system-ui';
        ctx.fillText(g.lives <= 0 || g.missed >= 5 ? '¡FIN DE LA PARTIDA!' : '¡BUEN CORTE!', width / 2, height / 2);
      }
      if (now - lastHud > 250) {
        setHud(value => ({ ...value, score: g.score, level, combo: g.combo, lives: g.lives, missed: g.missed }));
        lastHud = now;
      }
      if (!g.done) raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, [deck, difficulty, finish]);

  return (
    <div className="mx-auto w-full max-w-2xl select-none p-3 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-lime-300">FAYMA SLICE · ARCADE</p>
          <h2 className="text-xl font-black">¡Corta las frutas, no las bombas!</h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-right">
          <div className="font-black text-amber-300">⭐ {hud.score}</div>
          <div className="text-[10px] text-slate-400">Nivel {hud.level}/5 · ❤️ {hud.lives}</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[min(58vh,440px)] min-h-[320px] w-full touch-none rounded-3xl border border-lime-300/30 shadow-2xl shadow-emerald-950/40"
        aria-label="Corta frutas deslizando el dedo o el ratón, evita bombas y encadena combos"
      />
      <p className="mt-3 text-center text-xs text-slate-300">
        Desliza para cortar · Evita las bombas · Encadena cortes para multiplicar tu puntuación.
        Cada fruta lleva una palabra de la aventura.
      </p>
      <p className="mt-2 min-h-5 text-center text-sm font-bold text-lime-200">{hud.message}</p>
    </div>
  );
};
