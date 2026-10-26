import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, GameResult, Word } from '../types';

type BubbleColor = 0 | 1 | 2 | 3;
type Bubble = { color: BubbleColor; word: Word };
type Projectile = { x: number; y: number; vx: number; vy: number; color: BubbleColor; word: Word };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const COLORS = ['#22d3ee', '#f472b6', '#a3e635', '#fbbf24'];
const COLS = 8;
const ROWS = 10;

/** A classic aim-and-match bubble shooter where vocabulary travels inside the bubbles. */
export const BubblePopperGame: React.FC<GameProps> = ({ words, difficulty, onCorrect, onWrong, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const callbacks = useRef({ onCorrect, onWrong, onComplete });
  callbacks.current = { onCorrect, onWrong, onComplete };
  const game = useRef({
    grid: Array.from({ length: ROWS }, () => Array<Bubble | null>(COLS).fill(null)),
    projectile: null as Projectile | null,
    particles: [] as Particle[],
    angle: -Math.PI / 2,
    last: 0,
    started: 0,
    done: false,
    score: 0,
    popped: 0,
    misses: 0,
    wordCursor: 0,
    wordsSeen: [] as string[],
    shotNumber: 0,
  });
  const [hud, setHud] = useState({ score: 0, popped: 0, misses: 0, message: 'Apunta y dispara. Combina tres o más burbujas del mismo color.' });
  const deck = useMemo(() => words.slice(0, 12), [words]);

  const finish = useCallback(() => {
    const g = game.current;
    if (g.done) return;
    g.done = true;
    const result: GameResult = {
      playerId: '',
      gameId: 'bubble_popper',
      correct: g.popped,
      wrong: g.misses,
      timeMs: Date.now() - g.started,
      coinsEarned: g.score + g.popped * 3,
      wordsSeen: g.wordsSeen,
    };
    callbacks.current.onComplete(result);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const g = game.current;
    g.grid = Array.from({ length: ROWS }, () => Array<Bubble | null>(COLS).fill(null));
    g.projectile = null;
    g.particles = [];
    g.angle = -Math.PI / 2;
    g.last = performance.now();
    g.started = Date.now();
    g.done = false;
    g.score = 0;
    g.popped = 0;
    g.misses = 0;
    g.wordCursor = 0;
    g.wordsSeen = [];
    g.shotNumber = 0;

    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        if (row > 2 && Math.random() < 0.13) continue;
        const word = deck.length ? deck[(row * COLS + col) % deck.length] : undefined;
        if (word) g.grid[row][col] = { color: Math.floor(Math.random() * COLORS.length) as BubbleColor, word };
      }
    }
    setHud({ score: 0, popped: 0, misses: 0, message: 'Apunta y dispara. Combina tres o más burbujas del mismo color.' });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const radius = (width: number) => Math.min(22, (width - 32) / (COLS * 2 + 1));
    const center = (row: number, col: number, width: number, r: number) => ({
      x: width / 2 + (col - (COLS - 1) / 2) * r * 2 + (row % 2 ? r : 0),
      y: 40 + row * r * 1.72,
    });
    const shooter = (height: number) => ({ x: canvas.clientWidth / 2, y: height - 45 });
    const aimAt = (x: number, y: number) => {
      const { x: sx, y: sy } = shooter(canvas.clientHeight);
      g.angle = Math.max(-Math.PI + 0.3, Math.min(-0.3, Math.atan2(y - sy, x - sx)));
    };
    const fire = () => {
      if (g.done || g.projectile || deck.length === 0) return;
      const { x, y } = shooter(canvas.clientHeight);
      const word = deck[g.wordCursor % deck.length];
      const color = g.shotNumber % COLORS.length as BubbleColor;
      g.shotNumber += 1;
      g.projectile = { x, y, vx: Math.cos(g.angle) * 0.48, vy: Math.sin(g.angle) * 0.48, color, word };
      setHud(value => ({ ...value, message: `${word.text} · ${word.translation}` }));
    };
    const pointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      aimAt(event.clientX - rect.left, event.clientY - rect.top);
    };
    const pointerDown = (event: PointerEvent) => {
      pointerMove(event);
      fire();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.code === 'Space') event.preventDefault();
      if (event.key === 'ArrowLeft') g.angle = Math.max(-Math.PI + 0.3, g.angle - 0.08);
      if (event.key === 'ArrowRight') g.angle = Math.min(-0.3, g.angle + 0.08);
      if (event.code === 'Space' && !event.repeat) fire();
    };
    const neighbors = (row: number, col: number) => {
      const side = row % 2 ? 1 : -1;
      return [
        [row, col - 1], [row, col + 1],
        [row - 1, col], [row - 1, col + side],
        [row + 1, col], [row + 1, col + side],
      ].filter(([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS) as [number, number][];
    };
    const update = (now: number) => {
      const dt = Math.min(34, now - g.last);
      g.last = now;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const r = radius(width);

      if (!g.done && g.projectile) {
        const shot = g.projectile;
        shot.x += shot.vx * dt;
        shot.y += shot.vy * dt;
        if (shot.x < r || shot.x > width - r) shot.vx *= -1;
        shot.x = Math.max(r, Math.min(width - r, shot.x));

        let hit: [number, number] | null = null;
        for (let row = 0; row < ROWS; row += 1) {
          for (let col = 0; col < COLS; col += 1) {
            const bubble = g.grid[row][col];
            if (!bubble) continue;
            const pos = center(row, col, width, r);
            if (Math.hypot(shot.x - pos.x, shot.y - pos.y) < r * 1.82) {
              hit = [row, col];
              break;
            }
          }
          if (hit) break;
        }

        if (hit || shot.y <= 35) {
          let row = hit ? hit[0] : 0;
          let col = hit ? hit[1] : Math.round((shot.x - width / 2) / (2 * r) + (COLS - 1) / 2);
          if (hit) {
            const options = neighbors(row, col)
              .filter(([nr, nc]) => !g.grid[nr][nc])
              .map(([nr, nc]) => ({ row: nr, col: nc, ...center(nr, nc, width, r) }))
              .sort((a, b) => Math.hypot(shot.x - a.x, shot.y - a.y) - Math.hypot(shot.x - b.x, shot.y - b.y));
            if (options[0]) ({ row, col } = options[0]);
          }
          col = Math.max(0, Math.min(COLS - 1, col));
          while (row < ROWS - 1 && g.grid[row][col]) row += 1;
          if (g.grid[row][col]) {
            g.misses += 1;
            callbacks.current.onWrong(shot.word.id);
          } else {
            g.grid[row][col] = { color: shot.color, word: shot.word };
            const group: [number, number][] = [];
            const queue: [number, number][] = [[row, col]];
            const visited = new Set<string>();
            while (queue.length) {
              const [currentRow, currentCol] = queue.pop()!;
              const key = `${currentRow}:${currentCol}`;
              if (visited.has(key)) continue;
              visited.add(key);
              const bubble = g.grid[currentRow][currentCol];
              if (!bubble || bubble.color !== shot.color) continue;
              group.push([currentRow, currentCol]);
              queue.push(...neighbors(currentRow, currentCol));
            }

            if (group.length >= 3) {
              const poppedWords = new Map<string, Word>();
              for (const [bubbleRow, bubbleCol] of group) {
                const bubble = g.grid[bubbleRow][bubbleCol];
                if (!bubble) continue;
                poppedWords.set(bubble.word.id, bubble.word);
                const pos = center(bubbleRow, bubbleCol, width, r);
                for (let i = 0; i < 6; i += 1) {
                  const angle = Math.random() * Math.PI * 2;
                  g.particles.push({
                    x: pos.x,
                    y: pos.y,
                    vx: Math.cos(angle) * (0.06 + Math.random() * 0.2),
                    vy: Math.sin(angle) * (0.06 + Math.random() * 0.2),
                    life: 500,
                    color: COLORS[shot.color],
                  });
                }
                g.grid[bubbleRow][bubbleCol] = null;
              }

              const connected = new Set<string>();
              const topQueue: [number, number][] = [];
              for (let topCol = 0; topCol < COLS; topCol += 1) if (g.grid[0][topCol]) topQueue.push([0, topCol]);
              while (topQueue.length) {
                const [connectedRow, connectedCol] = topQueue.pop()!;
                const key = `${connectedRow}:${connectedCol}`;
                if (connected.has(key) || !g.grid[connectedRow][connectedCol]) continue;
                connected.add(key);
                topQueue.push(...neighbors(connectedRow, connectedCol));
              }
              for (let bubbleRow = 0; bubbleRow < ROWS; bubbleRow += 1) {
                for (let bubbleCol = 0; bubbleCol < COLS; bubbleCol += 1) {
                  if (g.grid[bubbleRow][bubbleCol] && !connected.has(`${bubbleRow}:${bubbleCol}`)) {
                    poppedWords.set(g.grid[bubbleRow][bubbleCol]!.word.id, g.grid[bubbleRow][bubbleCol]!.word);
                    g.grid[bubbleRow][bubbleCol] = null;
                  }
                }
              }

              for (const word of poppedWords.values()) {
                g.wordCursor += 1;
                g.popped += 1;
                g.wordsSeen.push(word.id);
                callbacks.current.onCorrect(word.id);
              }
              g.score += group.length * 10;
              setHud(value => ({
                ...value,
                score: g.score,
                popped: g.popped,
                message: poppedWords.size
                  ? `¡Combo de ${group.length}! ${[...poppedWords.values()].slice(0, 2).map(word => `${word.text} = ${word.translation}`).join(' · ')}`
                  : `¡Combo de ${group.length}!`,
              }));
            } else {
              g.misses += 1;
              callbacks.current.onWrong(shot.word.id);
              setHud(value => ({ ...value, misses: g.misses, message: 'Rebote. Busca un grupo del mismo color.' }));
            }
          }
          g.projectile = null;
        }
        if (g.misses >= 7 || g.grid[ROWS - 1].some(Boolean)) finish();
        if (g.grid.every(gridRow => gridRow.every(bubble => !bubble))) finish();
      }

      g.particles = g.particles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx * dt,
          y: particle.y + particle.vy * dt,
          vy: particle.vy + dt * 0.0004,
          life: particle.life - dt,
        }))
        .filter(particle => particle.life > 0);

      const background = ctx.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, '#111638');
      background.addColorStop(0.6, '#172554');
      background.addColorStop(1, '#020617');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(139,92,246,.16)';
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.5, width * 0.58, height * 0.62, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
          const bubble = g.grid[row][col];
          if (!bubble) continue;
          const pos = center(row, col, width, r);
          ctx.save();
          ctx.shadowColor = COLORS[bubble.color];
          ctx.shadowBlur = 13;
          const fill = ctx.createRadialGradient(pos.x - r * 0.4, pos.y - r * 0.4, 1, pos.x, pos.y, r);
          fill.addColorStop(0, '#ffffff');
          fill.addColorStop(0.18, COLORS[bubble.color]);
          fill.addColorStop(1, '#111827');
          ctx.fillStyle = fill;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r * 0.86, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#fff';
          ctx.font = `bold ${Math.max(7, Math.min(10, r * 0.44))}px system-ui`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bubble.word.text.slice(0, 9), pos.x, pos.y + r * 0.12);
          ctx.restore();
        }
      }

      for (const particle of g.particles) {
        ctx.globalAlpha = Math.min(1, particle.life / 250);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(1.5, particle.life / 90), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const { x: sx, y: sy } = shooter(height);
      const aimLength = Math.min(width * 0.32, 125);
      ctx.save();
      ctx.strokeStyle = 'rgba(226,232,240,.65)';
      ctx.setLineDash([5, 7]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(g.angle) * aimLength, sy + Math.sin(g.angle) * aimLength);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(15,23,42,.9)';
      ctx.beginPath();
      ctx.arc(sx, sy + 10, r * 1.35, Math.PI, 0);
      ctx.fill();
      const nextWord = deck[g.wordCursor % Math.max(1, deck.length)];
      ctx.fillStyle = COLORS[g.shotNumber % COLORS.length];
      ctx.beginPath();
      ctx.arc(sx, sy - 10, r, 0, Math.PI * 2);
      ctx.fill();
      if (nextWord) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(7, r * 0.42)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(nextWord.text.slice(0, 8), sx, sy - 8);
      }
      if (g.projectile) {
        ctx.fillStyle = COLORS[g.projectile.color];
        ctx.shadowColor = COLORS[g.projectile.color];
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(g.projectile.x, g.projectile.y, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      if (!g.done) raf.current = requestAnimationFrame(update);
      else {
        ctx.fillStyle = 'rgba(2,6,23,.72)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.font = '900 25px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(g.misses >= 7 ? '¡FIN DE LA PARTIDA!' : '¡CAMPO DESPEJADO!', width / 2, height / 2);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', keyDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerdown', pointerDown);
    raf.current = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerdown', pointerDown);
    };
  }, [deck, finish]);

  return (
    <div className="mx-auto w-full max-w-2xl p-3 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-fuchsia-300">BUBBLE POPPER · ARCADE</p>
          <h2 className="text-xl font-black">Apunta. Combina. ¡Explota!</h2>
          <p className="text-xs text-slate-400">Las palabras viajan en las burbujas del mismo color.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-right">
          <div className="text-xs font-bold text-amber-300">⭐ {hud.score}</div>
          <div className="text-[10px] text-slate-400">Palabras {hud.popped} · Fallos {hud.misses}/7</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[min(58vh,460px)] min-h-[330px] w-full touch-none rounded-3xl border border-fuchsia-300/30 shadow-2xl shadow-fuchsia-950/30"
        aria-label="Dispara burbujas para combinar tres o más del mismo color"
      />
      <p className="mt-3 text-center text-xs text-slate-300">
        Ratón o pantalla: toca para apuntar y disparar · Teclado: ← → apunta, ESPACIO dispara.
        Forma grupos del mismo color para liberar las palabras.
      </p>
      <p className="mt-2 min-h-5 text-center text-sm font-bold text-fuchsia-200">{hud.message}</p>
    </div>
  );
};
