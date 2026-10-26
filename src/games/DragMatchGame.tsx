import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, GameResult } from '../types';

type RunnerObject = { x: number; y: number; kind: 'hazard' | 'coin' | 'word'; wordIndex: number; collected: boolean; seed: number };

const COURSE_LENGTH = 1800;

/** Side-scrolling word runner: jump over hazards and collect vocabulary on the course. */
export const DragMatchGame: React.FC<GameProps> = ({ words, difficulty, onCorrect, onWrong, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const callbacks = useRef({ onCorrect, onWrong, onComplete });
  callbacks.current = { onCorrect, onWrong, onComplete };
  const game = useRef({
    objects: [] as RunnerObject[],
    distance: 0,
    score: 0,
    lives: 3,
    misses: 0,
    wordIndex: 0,
    spawn: 0,
    playerY: 0,
    velocityY: 0,
    grounded: true,
    started: 0,
    last: 0,
    done: false,
    wordsSeen: [] as string[],
    invulnerable: 0,
    combo: 0,
  });
  const [hud, setHud] = useState({ score: 0, lives: 3, distance: 0, message: '¡Corre! Salta sobre los obstáculos y recoge las palabras.' });
  const deck = useMemo(() => words.slice(0, 12), [words]);

  const finish = useCallback(() => {
    const g = game.current;
    if (g.done) return;
    g.done = true;
    const result: GameResult = {
      playerId: '',
      gameId: 'drag_match',
      correct: g.wordIndex,
      wrong: g.misses,
      timeMs: Date.now() - g.started,
      coinsEarned: g.score * 2 + Math.floor(g.distance / 45),
      wordsSeen: g.wordsSeen,
    };
    callbacks.current.onComplete(result);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const g = game.current;
    g.objects = [];
    g.distance = 0;
    g.score = 0;
    g.lives = 3;
    g.misses = 0;
    g.wordIndex = 0;
    g.spawn = 250;
    g.playerY = 0;
    g.velocityY = 0;
    g.grounded = true;
    g.started = Date.now();
    g.last = performance.now();
    g.done = false;
    g.wordsSeen = [];
    g.invulnerable = 0;
    g.combo = 0;
    setHud({ score: 0, lives: 3, distance: 0, message: '¡Corre! Salta sobre los obstáculos y recoge las palabras.' });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const jump = () => {
      if (!g.grounded || g.done) return;
      g.velocityY = -0.66;
      g.grounded = false;
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.code === 'Space' || event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') event.preventDefault();
      if (!event.repeat && (event.code === 'Space' || event.key === 'ArrowUp' || event.key.toLowerCase() === 'w')) jump();
    };
    const pointerDown = () => jump();
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', keyDown);
    canvas.addEventListener('pointerdown', pointerDown);

    let lastHud = 0;
    const draw = (now: number) => {
      const dt = Math.min(34, now - g.last);
      g.last = now;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ground = height - 66;
      const playerX = width * 0.2;
      const speed = 0.34 + difficulty * 0.04 + Math.min(0.18, g.distance / 9000);

      if (!g.done) {
        g.distance += dt * speed * 0.11;
        g.velocityY += 0.0019 * dt;
        g.playerY += g.velocityY * dt;
        if (g.playerY >= 0) {
          g.playerY = 0;
          g.velocityY = 0;
          g.grounded = true;
        }
        g.spawn -= dt;
        g.invulnerable = Math.max(0, g.invulnerable - dt);
        if (g.spawn <= 0) {
          const roll = Math.random();
          const kind: RunnerObject['kind'] = roll < 0.4 ? 'hazard' : roll < 0.57 ? 'coin' : deck.length > 0 ? 'word' : 'coin';
          const wordIndex = deck.length ? g.wordIndex % deck.length : 0;
          g.objects.push({
            x: width + 28,
            y: kind === 'word' && Math.random() > 0.55 ? ground - 112 : ground - (kind === 'hazard' ? 23 : 62),
            kind,
            wordIndex,
            collected: false,
            seed: Math.random() * Math.PI * 2,
          });
          g.spawn = Math.max(420, 820 - difficulty * 52);
        }

        for (const object of g.objects) {
          object.x -= dt * speed;
          if (object.collected || Math.abs(object.x - playerX) > 28) continue;
          const playerCenterY = ground - 26 + g.playerY;
          if (Math.abs(object.y - playerCenterY) > (object.kind === 'hazard' ? 40 : 36)) continue;
          object.collected = true;
          if (object.kind === 'hazard') {
            if (g.invulnerable === 0 && g.grounded) {
              g.lives -= 1;
              g.misses += 1;
              g.combo = 0;
              g.invulnerable = 900;
              callbacks.current.onWrong(deck[g.wordIndex % Math.max(1, deck.length)]?.id || '');
              setHud(value => ({ ...value, lives: g.lives, message: '¡Golpe! Salta antes del siguiente obstáculo.' }));
              if (g.lives <= 0) finish();
            } else {
              g.score += 5;
              g.combo += 1;
              setHud(value => ({ ...value, message: '¡Salto perfecto! Evitaste el obstáculo.' }));
            }
          } else if (object.kind === 'coin') {
            g.score += 5 * Math.min(3, 1 + Math.floor(g.combo / 4));
            g.combo += 1;
          } else {
            const word = deck[object.wordIndex];
            if (!word) continue;
            g.wordIndex += 1;
            g.wordsSeen.push(word.id);
            g.score += 12 * Math.min(3, 1 + Math.floor(g.combo / 4));
            g.combo += 1;
            callbacks.current.onCorrect(word.id);
            setHud(value => ({ ...value, message: `${word.text} = ${word.translation} · ¡Sigue corriendo!` }));
          }
        }
        g.objects = g.objects.filter(object => !object.collected && object.x > -80);
        if (g.distance >= COURSE_LENGTH) finish();
      }

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#7dd3fc');
      sky.addColorStop(0.52, '#c4b5fd');
      sky.addColorStop(1, '#fbbf24');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);
      for (let layer = 0; layer < 3; layer += 1) {
        ctx.fillStyle = ['#334155', '#365c65', '#1e3a4b'][layer];
        ctx.beginPath();
        ctx.moveTo(0, height * (0.52 + layer * 0.08));
        for (let x = 0; x <= width + 50; x += 50) {
          const y = height * (0.44 + layer * 0.08) + Math.sin((x + g.distance * (0.28 - layer * 0.06)) / (75 + layer * 25)) * 18;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, ground + 14);
      ctx.lineTo(width, ground + 14);
      ctx.lineTo(width * 0.94, height);
      ctx.lineTo(width * 0.06, height);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, ground + 12, width, 6);
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([26, 24]);
      ctx.lineDashOffset = -g.distance * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, ground + 47);
      ctx.lineTo(width, ground + 47);
      ctx.stroke();
      ctx.setLineDash([]);

      for (const object of g.objects) {
        const bob = object.kind === 'word' ? Math.sin(now / 250 + object.seed) * 4 : 0;
        ctx.save();
        ctx.translate(object.x, object.y + bob);
        if (object.kind === 'hazard') {
          ctx.fillStyle = '#fb7185';
          ctx.shadowColor = '#fb7185';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.roundRect(-25, -17, 48, 31, 8);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#fecdd3';
          ctx.beginPath();
          ctx.roundRect(-13, -14, 21, 12, 5);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(-15, 13, 6, 0, Math.PI * 2);
          ctx.arc(12, 13, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.fillRect(19, -8, 5, 7);
        } else if (object.kind === 'coin') {
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const word = deck[object.wordIndex];
          ctx.fillStyle = '#a3e635';
          ctx.shadowColor = '#84cc16';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.roundRect(-38, -18, 76, 36, 10);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#1a2e05';
          ctx.font = 'bold 11px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText((word?.text || '').slice(0, 11), 0, 4);
        }
        ctx.restore();
      }

      const playerBaseY = ground - 24 + g.playerY;
      const bounce = g.grounded ? Math.sin(now / 75) * 1.5 : 0;
      ctx.fillStyle = 'rgba(2,6,23,.4)';
      ctx.beginPath();
      ctx.ellipse(playerX, ground - 3, 23 - Math.min(12, Math.abs(g.playerY) / 5), 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(playerX, playerBaseY + bounce);
      if (g.invulnerable > 0 && Math.floor(now / 80) % 2 === 0) ctx.globalAlpha = 0.45;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(-28, 4);
      ctx.lineTo(-23, -11);
      ctx.quadraticCurveTo(-19, -21, -7, -21);
      ctx.lineTo(7, -21);
      ctx.quadraticCurveTo(19, -20, 23, -10);
      ctx.lineTo(28, 4);
      ctx.quadraticCurveTo(28, 10, 20, 10);
      ctx.lineTo(-21, 10);
      ctx.quadraticCurveTo(-28, 10, -28, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#cffafe';
      ctx.beginPath();
      ctx.moveTo(-13, -16);
      ctx.lineTo(-7, -20);
      ctx.lineTo(7, -20);
      ctx.quadraticCurveTo(15, -18, 17, -9);
      ctx.lineTo(-16, -9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-15, 9, 7, 0, Math.PI * 2);
      ctx.arc(14, 9, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(-15, 9, 3, 0, Math.PI * 2);
      ctx.arc(14, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(2,6,23,.76)';
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, 46, 14);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '900 13px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`🏃 ${Math.floor(g.distance)} m   ⭐ ${g.score}`, 24, 40);
      ctx.textAlign = 'right';
      ctx.fillText(`❤️ ${g.lives}   ✦ ${g.combo}`, width - 24, 40);
      if (!g.done) raf.current = requestAnimationFrame(draw);
      else {
        ctx.fillStyle = 'rgba(2,6,23,.7)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = '900 26px system-ui';
        ctx.fillText(g.lives > 0 ? '¡LLEGASTE A LA META!' : '¡FIN DE LA CARRERA!', width / 2, height / 2);
      }
      if (now - lastHud >= 300) {
        setHud(value => ({ ...value, score: g.score, lives: g.lives, distance: Math.floor(g.distance) }));
        lastHud = now;
      }
    };
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('pointerdown', pointerDown);
    };
  }, [deck, difficulty, finish]);

  return (
    <div className="mx-auto w-full max-w-2xl p-3 text-white">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-rose-300">DRIVE CHALLENGE · CALLEJERO</p>
          <h2 className="text-xl font-black">Conduce por la ciudad y esquiva el tráfico</h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-right">
          <div className="font-black text-amber-300">⭐ {hud.score}</div>
          <div className="text-[10px] text-slate-400">{hud.distance}/{COURSE_LENGTH} m</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[min(58vh,440px)] min-h-[320px] w-full touch-none rounded-3xl border border-rose-300/30 shadow-2xl shadow-rose-950/30"
        aria-label="Conducción callejera lateral: toca o pulsa espacio para saltar obstáculos y recoger palabras"
      />
      <button
        type="button"
        onClick={() => {
          const g = game.current;
          if (g.grounded && !g.done) {
            g.velocityY = -0.66;
            g.grounded = false;
          }
        }}
        className="mt-3 w-full rounded-2xl border-b-4 border-orange-800 bg-orange-500 py-3 font-black text-slate-950 active:translate-y-1 active:border-b-0"
      >
        ⬆ SALTAR
      </button>
      <p className="mt-2 text-center text-xs text-slate-300">
        Pulsa ESPACIO, ↑, W o SALTAR para esquivar tráfico. Recoge monedas y palabras en el recorrido.
      </p>
      <p className="mt-2 min-h-5 text-center text-sm font-bold text-rose-200">{hud.message}</p>
    </div>
  );
};
