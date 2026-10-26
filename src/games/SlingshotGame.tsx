import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, GameResult, Word } from '../types';

type Target = { word: Word; x: number; y: number; hit: boolean; sway: number };
type WoodBlock = { x: number; y: number; width: number; height: number; broken: boolean };
type Shot = { x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[] };

/** Slingshot physics adventure: drag, aim, calculate the arc, and smash word crates. */
export const SlingshotGame: React.FC<GameProps> = ({ words, difficulty, onCorrect, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const callbacks = useRef({ onCorrect, onComplete });
  callbacks.current = { onCorrect, onComplete };
  const game = useRef({
    targets: [] as Target[],
    blocks: [] as WoodBlock[],
    shot: null as Shot | null,
    pull: null as { x: number; y: number } | null,
    score: 0,
    correct: 0,
    misses: 0,
    wordIndex: 0,
    level: 1,
    last: 0,
    started: 0,
    done: false,
    wordsSeen: [] as string[],
    aim: -0.65,
  });
  const [hud, setHud] = useState({
    score: 0,
    level: 1,
    message: 'Tira de la goma hacia atrás y suelta para lanzar.',
  });
  const deck = useMemo(() => words.slice(0, 12), [words]);

  const finish = useCallback(() => {
    const g = game.current;
    if (g.done) return;
    g.done = true;
    const result: GameResult = {
      playerId: '',
      gameId: 'slingshot',
      correct: g.correct,
      wrong: g.misses,
      timeMs: Date.now() - g.started,
      coinsEarned: g.score + g.correct * 5,
      wordsSeen: g.wordsSeen,
    };
    callbacks.current.onComplete(result);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const g = game.current;
    g.targets = [];
    g.blocks = [];
    g.shot = null;
    g.pull = null;
    g.score = 0;
    g.correct = 0;
    g.misses = 0;
    g.wordIndex = 0;
    g.level = 1;
    g.last = performance.now();
    g.started = Date.now();
    g.done = false;
    g.wordsSeen = [];
    g.aim = -0.65;
    setHud({ score: 0, level: 1, message: 'Tira de la goma hacia atrás y suelta para lanzar.' });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const launchPoint = (width: number, height: number) => ({ x: width * 0.16, y: height * 0.76 });
    const loadLevel = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const remaining = deck.slice(g.wordIndex);
      if (remaining.length === 0) {
        finish();
        return;
      }
      const targetCount = Math.min(3, remaining.length);
      g.targets = remaining.slice(0, targetCount).map((word, index) => ({
        word,
        x: width * (0.62 + index * 0.105),
        y: height * (0.42 + (index % 2) * 0.11),
        hit: false,
        sway: Math.random() * Math.PI * 2,
      }));
      g.blocks = [
        { x: width * 0.48, y: height * 0.68, width: 42, height: 20, broken: false },
        { x: width * 0.55, y: height * 0.61, width: 54, height: 18, broken: false },
        { x: width * 0.57, y: height * 0.75, width: 48, height: 20, broken: false },
        { x: width * 0.76, y: height * 0.72, width: 68, height: 20, broken: false },
      ];
    };
    loadLevel();

    const releaseShot = (pullX?: number, pullY?: number) => {
      if (g.done || g.shot) return;
      const { x, y } = launchPoint(canvas.clientWidth, canvas.clientHeight);
      if (pullX !== undefined && pullY !== undefined) {
        const dx = x - pullX;
        const dy = y - pullY;
        const power = Math.min(1, Math.hypot(dx, dy) / 145);
        if (power < 0.08) return;
        g.aim = Math.atan2(dy, dx);
        const velocity = 560 * power * (1 + difficulty * 0.045);
        g.shot = { x, y, vx: Math.cos(g.aim) * velocity, vy: Math.sin(g.aim) * velocity, trail: [] };
      } else {
        const velocity = 470 * (1 + difficulty * 0.045);
        g.shot = { x, y, vx: Math.cos(g.aim) * velocity, vy: Math.sin(g.aim) * velocity, trail: [] };
      }
      setHud(value => ({ ...value, message: `¡Vuelo! Ajusta el ángulo para el próximo disparo.` }));
    };
    const pointerDown = (event: PointerEvent) => {
      if (g.shot || g.done) return;
      const rect = canvas.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      g.pull = point;
      canvas.setPointerCapture(event.pointerId);
    };
    const pointerMove = (event: PointerEvent) => {
      if (!g.pull) return;
      const rect = canvas.getBoundingClientRect();
      g.pull = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const pointerUp = () => {
      if (!g.pull) return;
      const point = g.pull;
      g.pull = null;
      releaseShot(point.x, point.y);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.code === 'Space' || event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault();
      if (event.key === 'ArrowUp') g.aim = Math.max(-1.35, g.aim - 0.06);
      if (event.key === 'ArrowDown') g.aim = Math.min(-0.15, g.aim + 0.06);
      if (event.code === 'Space' && !event.repeat) releaseShot();
    };
    const hitTarget = (shot: Shot) => g.targets.find(target =>
      !target.hit && Math.abs(shot.x - target.x) < 46 && Math.abs(shot.y - target.y) < 32
    );

    const draw = (now: number) => {
      const dt = Math.min(0.034, (now - g.last) / 1000);
      g.last = now;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const { x: slingX, y: slingY } = launchPoint(width, height);
      const gravity = 600;

      if (!g.done && g.shot) {
        const shot = g.shot;
        shot.trail.push({ x: shot.x, y: shot.y });
        if (shot.trail.length > 14) shot.trail.shift();
        shot.x += shot.vx * dt;
        shot.y += shot.vy * dt;
        shot.vy += gravity * dt;
        const target = hitTarget(shot);
        if (target) {
          target.hit = true;
          g.wordIndex += 1;
          g.correct += 1;
          g.score += 25;
          g.wordsSeen.push(target.word.id);
          callbacks.current.onCorrect(target.word.id);
          setHud(value => ({ ...value, score: g.score, message: `${target.word.text} = ${target.word.translation} · ¡Diana!` }));
          g.shot = null;
          if (g.targets.every(item => item.hit)) {
            g.level += 1;
            if (g.wordIndex >= deck.length) finish();
            else {
              loadLevel();
              setHud(value => ({ ...value, level: g.level, message: `¡Nivel ${g.level - 1} superado! Derriba las cajas de palabras.` }));
            }
          }
        } else {
          const block = g.blocks.find(item =>
            !item.broken && Math.abs(shot.x - item.x) < item.width / 2 + 9 && Math.abs(shot.y - item.y) < item.height / 2 + 9
          );
          if (block) {
            block.broken = true;
            g.score += 3;
            shot.vx *= -0.38;
            shot.vy *= -0.38;
            setHud(value => ({ ...value, score: g.score, message: '¡Madera rota! Ahora apunta a una caja con palabra.' }));
          }
          if (shot.x > width + 15 || shot.x < -15 || shot.y > height + 15 || shot.y < -height) {
            g.shot = null;
            g.misses += 1;
            setHud(value => ({ ...value, message: 'El disparo ha pasado de largo. Prueba otro ángulo.' }));
            if (g.misses >= 8) finish();
          }
        }
      }

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#60a5fa');
      sky.addColorStop(0.6, '#c4b5fd');
      sky.addColorStop(1, '#fde68a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255,255,255,.42)';
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.ellipse(width * (0.14 + i * 0.24), height * (0.2 + (i % 2) * 0.1), 44, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#365d51';
      ctx.beginPath();
      ctx.moveTo(0, height * 0.66);
      ctx.quadraticCurveTo(width * 0.3, height * 0.5, width * 0.56, height * 0.67);
      ctx.quadraticCurveTo(width * 0.8, height * 0.76, width, height * 0.59);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#36533e';
      ctx.fillRect(0, height * 0.82, width, height * 0.18);
      ctx.fillStyle = 'rgba(255,255,255,.12)';
      ctx.beginPath();
      ctx.moveTo(width * 0.35, height);
      ctx.lineTo(width * 0.51, height * 0.77);
      ctx.lineTo(width * 0.84, height * 0.77);
      ctx.lineTo(width, height);
      ctx.fill();

      for (const block of g.blocks) {
        if (block.broken) continue;
        ctx.fillStyle = '#92400e';
        ctx.fillRect(block.x - block.width / 2, block.y - block.height / 2, block.width, block.height);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(block.x - block.width / 2, block.y - block.height / 2, block.width, 4);
        ctx.strokeStyle = 'rgba(69,26,3,.7)';
        ctx.strokeRect(block.x - block.width / 2, block.y - block.height / 2, block.width, block.height);
      }
      for (const target of g.targets) {
        if (target.hit) continue;
        const bob = Math.sin(now / 450 + target.sway) * 3;
        const x = target.x;
        const y = target.y + bob;
        const boxWidth = 84;
        const boxHeight = 54;
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.moveTo(x - boxWidth / 2, y - boxHeight / 2);
        ctx.lineTo(x + boxWidth / 2, y - boxHeight / 2);
        ctx.lineTo(x + boxWidth / 2 + 10, y - boxHeight / 2 - 8);
        ctx.lineTo(x + 10, y - boxHeight / 2 - 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(x - boxWidth / 2 + 5, y - boxHeight / 2 + 5, boxWidth - 10, boxHeight - 10);
        ctx.fillStyle = '#451a03';
        ctx.font = 'bold 12px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(target.word.text.slice(0, 13), x, y + 1);
      }

      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.moveTo(slingX - 21, slingY + 22);
      ctx.lineTo(slingX - 11, slingY - 31);
      ctx.lineTo(slingX - 2, slingY - 27);
      ctx.lineTo(slingX - 10, slingY + 22);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(slingX + 21, slingY + 22);
      ctx.lineTo(slingX + 11, slingY - 31);
      ctx.lineTo(slingX + 2, slingY - 27);
      ctx.lineTo(slingX + 10, slingY + 22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(slingX - 10, slingY - 28);
      ctx.lineTo(g.pull?.x ?? slingX, g.pull?.y ?? slingY);
      ctx.lineTo(slingX + 10, slingY - 28);
      ctx.stroke();

      if (g.pull) {
        const dx = slingX - g.pull.x;
        const dy = slingY - g.pull.y;
        const magnitude = Math.min(1, Math.hypot(dx, dy) / 145);
        const vx = Math.cos(Math.atan2(dy, dx)) * 560 * magnitude;
        const vy = Math.sin(Math.atan2(dy, dx)) * 560 * magnitude;
        ctx.fillStyle = 'rgba(255,255,255,.65)';
        for (let t = 0.08; t < 0.64; t += 0.09) {
          const px = slingX + vx * t;
          const py = slingY + vy * t + 0.5 * gravity * t * t;
          if (py > height) break;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (g.shot) {
        g.shot.trail.forEach((point, index) => {
          ctx.globalAlpha = index / g.shot!.trail.length * 0.45;
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fef3c7';
        ctx.shadowColor = '#fb923c';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(g.shot.x, g.shot.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = 'rgba(2,6,23,.73)';
      ctx.beginPath();
      ctx.roundRect(12, 12, width - 24, 42, 12);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '900 13px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`🏹 NIVEL ${g.level}/3 · 🎯 ${g.correct}/${deck.length}`, 24, 38);
      ctx.textAlign = 'right';
      ctx.fillText(`⭐ ${g.score} · DISPAROS ${g.misses}`, width - 24, 38);

      if (!g.done) raf.current = requestAnimationFrame(draw);
      else {
        ctx.fillStyle = 'rgba(2,6,23,.7)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.font = '900 25px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(g.correct === deck.length ? '¡AVENTURA COMPLETADA!' : '¡FIN DE LA AVENTURA!', width / 2, height / 2);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', keyDown);
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keyDown);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
    };
  }, [deck, difficulty, finish]);

  return (
    <div className="mx-auto w-full max-w-2xl p-3 text-white">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-amber-300">SLINGSHOT ADVENTURE · FÍSICA</p>
          <h2 className="text-xl font-black">Calcula el arco y derriba las cajas</h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-right text-sm font-black">
          Nivel {hud.level}/3 <span className="text-amber-300">· ⭐ {hud.score}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[min(58vh,450px)] min-h-[330px] w-full touch-none rounded-3xl border border-amber-200/30 shadow-2xl shadow-orange-950/30"
        aria-label="Apunta con el tirachinas arrastrando hacia atrás y lanza para derribar cajas de vocabulario"
      />
      <p className="mt-3 text-center text-xs text-slate-300">
        Ratón o pantalla: tira de la goma hacia atrás y suelta · Teclado: ↑/↓ ajusta el ángulo y ESPACIO lanza.
        La trayectoria punteada muestra el efecto de la gravedad.
      </p>
      <p className="mt-2 min-h-5 text-center text-sm font-bold text-amber-200">{hud.message}</p>
    </div>
  );
};
