import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps } from '../types';

type FlyingItem = {
  id: number; x: number; y: number; vx: number; vy: number; radius: number;
  wordIndex: number; kind: 'fruit' | 'bomb'; sliced: boolean;
};

/**
 * FAYMA SLICE: gesture-based arcade. Slice flying fruit with a pointer swipe,
 * avoid bombs, and learn the word attached to each fruit without stopping for quizzes.
 */
export const FruitNinjaGame: React.FC<GameProps> = ({ words, difficulty, onCorrect, onWrong, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const stateRef = useRef({
    items: [] as FlyingItem[], last: 0, started: 0, spawn: 0, score: 0, sliced: 0,
    missed: 0, done: false, cursor: { x: -100, y: -100 }, trail: [] as { x: number; y: number; t: number }[],
    pointerDown: false, wordCursor: 0, lastSpawn: 0,
  });
  const [hud, setHud] = useState({ score: 0, time: 45, message: 'Desliza el dedo o el ratón para cortar frutas. ¡Evita las bombas!' });
  const deck = useMemo(() => words.slice(0, Math.max(1, Math.min(words.length, 16))), [words]);

  const finish = useCallback(() => {
    const g = stateRef.current;
    if (g.done) return;
    g.done = true;
    onComplete({
      playerId: '',
      gameId: 'fruit',
      correct: g.sliced,
      wrong: g.missed,
      timeMs: Date.now() - g.started,
      coinsEarned: Math.max(0, g.score + Math.floor(g.sliced / 2)),
      wordsSeen: deck.slice(0, Math.min(g.wordCursor, deck.length)).map(w => w.id),
    });
  }, [deck, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const g = stateRef.current;
    g.started = Date.now();
    g.last = performance.now();
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      g.cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (e.type === 'pointerdown') g.pointerDown = true;
      if (e.type === 'pointerup' || e.type === 'pointercancel' || e.type === 'pointerleave') g.pointerDown = false;
    };
    canvas.addEventListener('pointerdown', pointer);
    canvas.addEventListener('pointermove', pointer);
    canvas.addEventListener('pointerup', pointer);
    canvas.addEventListener('pointercancel', pointer);
    canvas.addEventListener('pointerleave', pointer);

    const draw = (now: number) => {
      const dt = Math.min(32, now - g.last);
      g.last = now;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const elapsed = (Date.now() - g.started) / 1000;
      const remaining = Math.max(0, 45 - elapsed);
      if (!g.done) {
        g.spawn -= dt;
        if (g.spawn <= 0) {
          const count = Math.random() < 0.24 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            const wordIndex = g.wordCursor % deck.length;
            g.items.push({
              id: Math.random(), x: w * (.18 + Math.random() * .64), y: h + 35,
              vx: (Math.random() - .5) * (1.5 + difficulty * .25),
              vy: -(5.1 + Math.random() * 2.2 + difficulty * .3),
              radius: 23 + Math.random() * 7, wordIndex,
              kind: Math.random() < .13 ? 'bomb' : 'fruit', sliced: false,
            });
            g.wordCursor++;
          }
          g.spawn = Math.max(380, 950 - difficulty * 100);
        }
        for (const item of g.items) {
          if (item.sliced) continue;
          item.x += item.vx * dt * .12;
          item.y += item.vy * dt * .12;
          item.vy += .012 * dt;
          if (item.y > h + 45) { item.sliced = true; if (item.kind === 'fruit') g.missed++; }
          if (g.pointerDown && Math.hypot(item.x - g.cursor.x, item.y - g.cursor.y) < item.radius + 13) {
            item.sliced = true;
            if (item.kind === 'bomb') {
              g.score = Math.max(0, g.score - 10);
              g.missed++;
              const word = deck[item.wordIndex % deck.length];
              if (word) onWrong(word.id);
              setHud(v => ({ ...v, message: '💣 ¡Bomba! Evítalas para mantener tu combo.' }));
            } else {
              const word = deck[item.wordIndex % deck.length];
              g.score += 10;
              g.sliced++;
              if (word) onCorrect(word.id);
              setHud(v => ({ ...v, message: word ? `+10 · ${word.text} — ${word.translation}` : '+10 · ¡Buen corte!' }));
            }
          }
        }
        g.items = g.items.filter(i => !i.sliced || now - g.last < 0);
        g.trail.push({ ...g.cursor, t: now });
        g.trail = g.trail.filter(p => now - p.t < 160);
        if (remaining <= 0) finish();
      }

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#101b46'); bg.addColorStop(.58, '#30266f'); bg.addColorStop(1, '#7c2d6a');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      // Decorative glowing orbs and stars.
      for (let i = 0; i < 24; i++) {
        const x = (i * 83 + 19) % w, y = (i * 47 + 25) % h;
        ctx.fillStyle = i % 3 ? 'rgba(196,181,253,.17)' : 'rgba(253,224,71,.22)';
        ctx.beginPath(); ctx.arc(x, y, 2 + i % 4, 0, Math.PI * 2); ctx.fill();
      }
      for (const item of g.items) {
        if (item.sliced) continue;
        ctx.save(); ctx.shadowBlur = 18; ctx.shadowColor = item.kind === 'bomb' ? '#fb7185' : '#86efac';
        ctx.fillStyle = item.kind === 'bomb' ? '#be123c' : ['#f97316', '#ef4444', '#a3e635', '#38bdf8', '#c084fc'][item.wordIndex % 5];
        ctx.beginPath(); ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        if (item.kind === 'bomb') {
          ctx.fillStyle = '#fff'; ctx.font = 'bold 25px system-ui'; ctx.textAlign = 'center'; ctx.fillText('💣', item.x, item.y + 9);
        } else {
          ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
          ctx.fillText((deck[item.wordIndex % deck.length]?.text || '¡CORTE!').slice(0, 12), item.x, item.y + 4);
        }
        ctx.restore();
      }
      if (g.trail.length > 1) {
        ctx.beginPath(); ctx.moveTo(g.trail[0].x, g.trail[0].y);
        for (const p of g.trail.slice(1)) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = '#e0f2fe'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowBlur = 14; ctx.shadowColor = '#67e8f9'; ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.fillStyle = 'rgba(2,6,23,.72)'; ctx.beginPath(); ctx.roundRect(12, 12, w - 24, 48, 14); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = '900 14px system-ui'; ctx.fillText(`⭐ ${g.score} puntos`, 24, 41);
      ctx.textAlign = 'right'; ctx.fillStyle = remaining < 10 ? '#fda4af' : '#fff'; ctx.fillText(`⏱ ${Math.ceil(remaining)} s`, w - 24, 41);
      if (now - g.lastSpawn > 250) { setHud(v => ({ ...v, score: g.score, time: Math.ceil(remaining) })); g.lastSpawn = now; }
      if (g.done) {
        ctx.fillStyle = 'rgba(2,6,23,.68)'; ctx.fillRect(0, 0, w, h);
        ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = '900 28px system-ui'; ctx.fillText('¡TIEMPO!', w / 2, h / 2 - 8);
        ctx.font = 'bold 17px system-ui'; ctx.fillText(`Puntuación: ${g.score}`, w / 2, h / 2 + 25);
      }
      if (!g.done) rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', pointer);
      canvas.removeEventListener('pointermove', pointer);
      canvas.removeEventListener('pointerup', pointer);
      canvas.removeEventListener('pointercancel', pointer);
      canvas.removeEventListener('pointerleave', pointer);
    };
  }, [deck, difficulty, finish, onCorrect, onWrong]);

  return <div className="w-full max-w-2xl mx-auto p-3 text-white select-none">
    <div className="flex items-center justify-between mb-3 gap-3">
      <div><div className="text-xs uppercase tracking-widest font-black text-fuchsia-300">FAYMA SLICE · ARCADE</div><div className="text-xl font-black">¡Corta frutas, evita bombas!</div></div>
      <div className="rounded-xl bg-slate-900 px-3 py-2 text-center min-w-20"><div className="text-[10px] text-slate-400 uppercase">Puntos</div><div className="text-xl font-black">{hud.score}</div></div>
    </div>
    <canvas ref={canvasRef} className="w-full h-[min(58vh,440px)] min-h-[300px] rounded-3xl border border-fuchsia-300/30 shadow-2xl shadow-fuchsia-950/40 touch-none cursor-crosshair" aria-label="Corta las frutas deslizando el dedo o el ratón"/>
    <p className="text-center text-xs text-slate-300 mt-3">Desliza por las frutas para cortarlas · Evita las bombas · ¡Tienes 45 segundos!</p>
    <p className="text-center text-sm font-bold text-fuchsia-200 mt-2 min-h-5">{hud.message}</p>
  </div>;
};
