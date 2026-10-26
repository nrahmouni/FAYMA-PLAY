import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, GameResult } from '../types';

type Lane = 0 | 1 | 2;
type ThingKind = 'obstacle' | 'coin' | 'word' | 'boost';
type Thing = { id: number; y: number; lane: Lane; kind: ThingKind; wordIndex: number; resolved: boolean };

const STAGE_DISTANCE = 700;
const RACE_DISTANCE = STAGE_DISTANCE * 3;

/** Real-time arcade driving with lane changes, jumps, collisions and vocabulary pickups. */
export const DriveGame: React.FC<GameProps> = ({ words, onCorrect, onComplete, difficulty }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const callbacks = useRef({ onCorrect, onComplete });
  callbacks.current = { onCorrect, onComplete };
  const game = useRef({
    lane: 1 as Lane,
    things: [] as Thing[],
    distance: 0,
    score: 0,
    lives: 4,
    collisions: 0,
    spawn: 0,
    last: 0,
    done: false,
    wordCursor: 0,
    wordsSeen: [] as string[],
    combo: 0,
    started: 0,
    jumpStarted: 0,
    jumpUntil: 0,
    boostUntil: 0,
  });
  const [hud, setHud] = useState({
    score: 0,
    lives: 4,
    level: 1,
    combo: 0,
    message: '¡Arranca! Cambia de carril, salta y recoge fichas.',
  });
  const deck = useMemo(() => words.slice(0, 12), [words]);

  const finish = useCallback(() => {
    const g = game.current;
    if (g.done) return;
    g.done = true;
    const result: GameResult = {
      playerId: '',
      gameId: 'drive',
      correct: g.wordCursor,
      wrong: g.collisions,
      timeMs: Date.now() - g.started,
      coinsEarned: g.score * 2 + Math.floor(g.distance / 40),
      wordsSeen: g.wordsSeen,
    };
    callbacks.current.onComplete(result);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const g = game.current;
    g.lane = 1;
    g.things = [];
    g.distance = 0;
    g.score = 0;
    g.lives = 4;
    g.collisions = 0;
    g.spawn = 0;
    g.last = performance.now();
    g.done = false;
    g.wordCursor = 0;
    g.wordsSeen = [];
    g.combo = 0;
    g.started = Date.now();
    g.jumpStarted = 0;
    g.jumpUntil = 0;
    g.boostUntil = 0;
    setHud({ score: 0, lives: 4, level: 1, combo: 0, message: '¡Arranca! Cambia de carril, salta y recoge fichas.' });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(rect.height * pixelRatio));
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    const moveLane = (direction: -1 | 1) => {
      g.lane = Math.max(0, Math.min(2, g.lane + direction)) as Lane;
    };
    const jump = () => {
      const now = performance.now();
      if (now >= g.jumpUntil) {
        g.jumpStarted = now;
        g.jumpUntil = now + 520;
      }
    };
    const down = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'a', 'd', ' ', 'arrowup', 'w'].includes(key)) event.preventDefault();
      if (key === 'arrowleft' || key === 'a') moveLane(-1);
      if (key === 'arrowright' || key === 'd') moveLane(1);
      if (key === ' ' || key === 'arrowup' || key === 'w') jump();
    };
    const pointerDown = (event: PointerEvent) => {
      swipeStart.current = { x: event.clientX, y: event.clientY };
    };
    const pointerUp = (event: PointerEvent) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) moveLane(dx < 0 ? -1 : 1);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', down);
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);

    let lastHudUpdate = 0;
    const draw = (now: number) => {
      const dt = Math.min(34, now - g.last);
      g.last = now;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const stage = Math.min(3, Math.floor(g.distance / STAGE_DISTANCE) + 1);
      const baseSpeed = 0.24 + difficulty * 0.024;
      const speed = baseSpeed * (1 + (stage - 1) * 0.12) * (now < g.boostUntil ? 1.35 : 1);
      const playerY = height - 76;

      if (!g.done) {
        g.distance += dt * speed * 0.2;
        g.spawn -= dt;
        if (g.spawn <= 0) {
          const roll = Math.random();
          const kind: ThingKind = roll < 0.37
            ? 'obstacle'
            : roll < 0.62
              ? 'coin'
              : roll < 0.92 && deck.length > 0
                ? 'word'
                : 'boost';
          const wordIndex = deck.length > 0 ? g.wordCursor % deck.length : 0;
          g.things.push({
            id: now + Math.random(),
            y: -40,
            lane: Math.floor(Math.random() * 3) as Lane,
            kind,
            wordIndex,
            resolved: false,
          });
          g.spawn = Math.max(560, 1200 - difficulty * 60 - (stage - 1) * 70);
        }

        for (const thing of g.things) {
          if (g.done) break;
          thing.y += dt * speed * 1.35;
          if (thing.resolved || thing.y < playerY - 28 || thing.y > playerY + 32) continue;
          thing.resolved = true;
          if (thing.lane !== g.lane) continue;

          if (thing.kind === 'obstacle') {
            if (now < g.jumpUntil) {
              g.score += 5;
              g.combo += 1;
              setHud(value => ({ ...value, message: '¡Buen salto! Esquiva el siguiente obstáculo.' }));
            } else {
              g.lives -= 1;
              g.collisions += 1;
              g.combo = 0;
              setHud(value => ({ ...value, message: '¡Choque! Cambia de carril o salta a tiempo.' }));
              if (g.lives <= 0) finish();
            }
          } else if (thing.kind === 'coin') {
            g.combo += 1;
            g.score += 5 * Math.min(3, 1 + Math.floor(g.combo / 4));
          } else if (thing.kind === 'boost') {
            g.boostUntil = now + 2200;
            g.combo += 1;
            g.score += 3;
            setHud(value => ({ ...value, message: '¡Turbo activado! Aprovecha la velocidad extra.' }));
          } else {
            const word = deck[thing.wordIndex];
            if (word) {
              g.wordCursor += 1;
              g.wordsSeen.push(word.id);
              g.combo += 1;
              g.score += 10 * Math.min(3, 1 + Math.floor(g.combo / 4));
              callbacks.current.onCorrect(word.id);
              setHud(value => ({ ...value, message: `${word.text} · ${word.translation}` }));
            }
          }
        }
        g.things = g.things.filter(thing => thing.y < height + 48);
        if (g.distance >= RACE_DISTANCE) finish();
      }

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#081638');
      sky.addColorStop(0.58, '#4338a4');
      sky.addColorStop(1, '#fb923c');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 20; i += 1) {
        const x = (i * 77 - g.distance * 0.15) % (width + 80);
        ctx.fillStyle = i % 2 ? '#172554' : '#111d42';
        ctx.fillRect(x, height * 0.35 - (i % 4) * 10, 24 + (i % 5) * 8, height * 0.25);
      }

      ctx.fillStyle = '#30394b';
      ctx.beginPath();
      ctx.moveTo(width * 0.08, height);
      ctx.lineTo(width * 0.31, height * 0.33);
      ctx.lineTo(width * 0.69, height * 0.33);
      ctx.lineTo(width * 0.92, height);
      ctx.fill();
      ctx.fillStyle = 'rgba(34,211,238,.07)';
      ctx.beginPath();
      ctx.moveTo(width * 0.31, height * 0.33);
      ctx.lineTo(width * 0.35, height * 0.33);
      ctx.lineTo(width * 0.11, height);
      ctx.lineTo(width * 0.08, height);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.75)';
      ctx.lineWidth = 3;
      ctx.setLineDash([22, 22]);
      ctx.lineDashOffset = -(g.distance % 44);
      [[0.437, 0.34], [0.563, 0.66]].forEach(([top, bottom]) => {
        ctx.beginPath();
        ctx.moveTo(top * width, height * 0.36);
        ctx.lineTo(bottom * width, height);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      for (const thing of g.things) {
        const y = thing.y;
        const depth = Math.max(0, Math.min(1, (y - height * 0.33) / (height * 0.67)));
        const scale = 0.34 + depth * 0.76;
        const x = width * (0.5 + (thing.lane - 1) * (0.055 + depth * 0.275));
        const objectSize = Math.max(7, scale * 18);
        if (thing.kind === 'obstacle') {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.roundRect(x - objectSize, y - objectSize * 1.2, objectSize * 2, objectSize * 2.4, 9 * scale);
          ctx.fill();
          ctx.fillStyle = '#fecdd3';
          ctx.fillRect(x - objectSize * 0.68, y - objectSize * 0.5, objectSize * 1.36, Math.max(2, objectSize * 0.25));
          ctx.fillRect(x - objectSize * 0.68, y + objectSize * 0.27, objectSize * 1.36, Math.max(2, objectSize * 0.25));
        } else if (thing.kind === 'coin') {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(x, y, Math.max(5, scale * 14), 0, Math.PI * 2);
          ctx.fill();
        } else if (thing.kind === 'boost') {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x, y, Math.max(5, scale * 15), 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#082f49';
          ctx.font = `bold ${Math.max(8, scale * 14)}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText('⚡', x, y + Math.max(3, scale * 5));
        } else {
          ctx.fillStyle = '#a3e635';
          ctx.beginPath();
          ctx.roundRect(x - objectSize * 2, y - objectSize, objectSize * 4, objectSize * 2, 10 * scale);
          ctx.fill();
          ctx.fillStyle = '#17320b';
          ctx.font = `bold ${Math.max(6, scale * 11)}px system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText((deck[thing.wordIndex]?.text || '').slice(0, 13), x, y + 4);
        }
      }

      const playerX = width * (0.5 + (g.lane - 1) * 0.33);
      const jumpProgress = g.jumpUntil > now ? (now - g.jumpStarted) / (g.jumpUntil - g.jumpStarted) : 1;
      const jumpHeight = g.jumpUntil > now ? Math.sin(jumpProgress * Math.PI) * 48 : 0;
      ctx.save();
      ctx.translate(playerX, playerY - jumpHeight);
      ctx.shadowColor = now < g.boostUntil ? '#38bdf8' : '#22d3ee';
      ctx.shadowBlur = now < g.boostUntil ? 28 : 18;
      ctx.fillStyle = '#0891b2';
      ctx.beginPath();
      ctx.moveTo(-26, 26);
      ctx.lineTo(-20, -17);
      ctx.quadraticCurveTo(0, -39, 20, -17);
      ctx.lineTo(26, 26);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(-13, -12, 26, 17);
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.moveTo(-19, 11);
      ctx.lineTo(0, 25);
      ctx.lineTo(19, 11);
      ctx.lineTo(16, 23);
      ctx.lineTo(0, 30);
      ctx.lineTo(-16, 23);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-24, 9, 7, 14);
      ctx.fillRect(17, 9, 7, 14);
      ctx.restore();

      ctx.fillStyle = 'rgba(2,6,23,.78)';
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, 50, 14);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '900 13px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`🏁 ${Math.floor(g.distance)} m   ⭐ ${g.score}`, 24, 34);
      ctx.fillText(`NIVEL ${stage}/3`, 24, 52);
      ctx.textAlign = 'right';
      ctx.fillText(`❤️ ${'● '.repeat(Math.max(0, g.lives))}`, width - 24, 42);

      if (now - lastHudUpdate > 250) {
        setHud(value => ({ ...value, score: g.score, lives: g.lives, level: stage, combo: g.combo }));
        lastHudUpdate = now;
      }
      if (!g.done) raf.current = requestAnimationFrame(draw);
      else {
        ctx.fillStyle = 'rgba(2,6,23,.68)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '900 26px system-ui';
        ctx.fillText(g.lives > 0 ? '¡CARRERA COMPLETADA!' : '¡FIN DE CARRERA!', width / 2, height / 2);
      }
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', down);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
    };
  }, [deck, difficulty, finish]);

  const changeLane = (direction: -1 | 1) => {
    const g = game.current;
    g.lane = Math.max(0, Math.min(2, g.lane + direction)) as Lane;
  };
  const jump = () => {
    const g = game.current;
    const now = performance.now();
    if (now >= g.jumpUntil) {
      g.jumpStarted = now;
      g.jumpUntil = now + 520;
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl select-none p-3 text-white">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-cyan-300">FAYMA RUSH · ARCADE</div>
          <div className="text-xl font-black">¡Conduce, esquiva y aprende!</div>
        </div>
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-center">
          <div className="text-[10px] uppercase text-slate-400">Puntos · Nivel {hud.level}/3</div>
          <div className="text-xl font-black">{hud.score}</div>
          {hud.combo >= 3 && <div className="text-xs font-bold text-amber-300">Racha ×{hud.combo}</div>}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[min(58vh,440px)] min-h-[300px] w-full touch-none rounded-3xl border border-cyan-300/30 shadow-2xl shadow-cyan-950/40"
        aria-label="Carrera arcade de tres carriles: desliza para cambiar de carril y esquiva obstáculos"
      />
      <div className="mt-3 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => changeLane(-1)}
          aria-label="Moverse al carril izquierdo"
          className="max-w-32 flex-1 rounded-2xl border border-white/15 bg-slate-800 py-4 text-2xl font-black"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={jump}
          className="max-w-32 flex-1 rounded-2xl border-b-4 border-orange-800 bg-orange-500 py-4 font-black"
        >
          ⬆ SALTAR
        </button>
        <button
          type="button"
          onClick={() => changeLane(1)}
          aria-label="Moverse al carril derecho"
          className="max-w-32 flex-1 rounded-2xl border border-white/15 bg-slate-800 py-4 text-2xl font-black"
        >
          ▶
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-300">
        Teclado: ← → o A/D para cambiar de carril · ESPACIO o ↑ para saltar · desliza en la pista.
        Recoge palabras, monedas y turbos; los obstáculos requieren esquivar o saltar.
      </p>
      <p className="mt-2 min-h-5 text-center text-sm font-bold text-cyan-200">{hud.message}</p>
    </div>
  );
};
