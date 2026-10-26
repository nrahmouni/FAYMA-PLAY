import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sparkles, Target, RotateCcw } from 'lucide-react';
import { GameProps, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';
import { shuffleArray } from '../lib/utils';
import { VOCABULARY_BANK } from '../data/vocabulary';

interface FloatingTarget {
  word: Word;
  x: number; // percentage 10-90
  y: number; // percentage 15-50
  vx: number;
  vy: number;
  radius: number;
  hit: boolean;
}

export const SlingshotGame: React.FC<GameProps> = ({
  words,
  difficulty,
  onCorrect,
  onWrong,
  onComplete,
  language,
}) => {
  const [targetIndex, setTargetIndex] = useState(0);
  const [targets, setTargets] = useState<FloatingTarget[]>([]);
  const [burst, setBurst] = useState(false);
  const [burstPos, setBurstPos] = useState({ x: 0.5, y: 0.5 });
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Slingshot drag state
  const [isAiming, setIsAiming] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [projectile, setProjectile] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const wordsSeenRef = useRef<string[]>([]);

  const { speak } = useSpeech();
  const { playSlingshot, playSuccess, playError, playPop } = useSound();

  const currentWord = words[targetIndex] || words[0];
  const isArabic = language === 'ar';

  // Spawn floating targets
  const spawnTargets = useCallback(() => {
    if (!currentWord) return;

    if (!wordsSeenRef.current.includes(currentWord.id)) {
      wordsSeenRef.current.push(currentWord.id);
    }

    const distractorPool = VOCABULARY_BANK.filter(
      w => w.language === language && w.id !== currentWord.id
    );
    const count = difficulty >= 3 ? 4 : 3;
    const pickedDistractors = shuffleArray(distractorPool).slice(0, count - 1);
    const all = shuffleArray([currentWord, ...pickedDistractors]);

    const newTargets: FloatingTarget[] = all.map((word, idx) => {
      const step = 80 / all.length;
      return {
        word,
        x: 15 + idx * step + (Math.random() * 8 - 4),
        y: 18 + (idx % 2) * 16 + (Math.random() * 6 - 3),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        radius: 38,
        hit: false,
      };
    });

    setTargets(newTargets);
    setProjectile(null);
    speak(currentWord.audioText || currentWord.text, language);
  }, [currentWord, difficulty, language, speak]);

  useEffect(() => {
    spawnTargets();
  }, [targetIndex, spawnTargets]);

  // Animation loop for floating targets & projectile
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Update targets floating
      setTargets(prev =>
        prev.map(t => {
          let nx = t.x + t.vx * dt * 60;
          let ny = t.y + t.vy * dt * 60;
          let nvx = t.vx;
          let nvy = t.vy;

          if (nx < 8 || nx > 88) nvx = -nvx;
          if (ny < 12 || ny > 52) nvy = -nvy;

          return { ...t, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );

      // Update projectile flight
      setProjectile(p => {
        if (!p || !p.active) return null;
        const nx = p.x + p.vx * dt * 60;
        const ny = p.y + p.vy * dt * 60 + 0.3 * dt * 60; // faux gravity

        // Check if out of bounds
        if (nx < 0 || nx > 100 || ny < 0 || ny > 100) {
          return null;
        }

        // Check collision with targets
        targets.forEach(target => {
          if (target.hit) return;
          const dx = (nx - target.x);
          const dy = (ny - target.y);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 10) {
            handleHitTarget(target);
          }
        });

        return { ...p, x: nx, y: ny };
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targets]);

  const handleHitTarget = (target: FloatingTarget) => {
    setProjectile(null);

    if (target.word.id === currentWord.id) {
      // Hit correct target!
      playSuccess();
      playPop();
      setBurstPos({ x: target.x / 100, y: target.y / 100 });
      setBurst(true);
      setCorrectCount(c => c + 1);
      onCorrect(currentWord.id);

      setTargets(prev => prev.map(t => (t.word.id === target.word.id ? { ...t, hit: true } : t)));

      setTimeout(() => {
        setBurst(false);
        if (targetIndex + 1 < words.length) {
          setTargetIndex(i => i + 1);
        } else {
          // Finished!
          const totalTime = Date.now() - startTimeRef.current;
          onComplete({
            playerId: '',
            gameId: 'slingshot',
            correct: correctCount + 1,
            wrong: wrongCount,
            timeMs: totalTime,
            coinsEarned: 10 + (correctCount + 1) * 5,
            wordsSeen: wordsSeenRef.current,
          });
        }
      }, 1000);
    } else {
      // Hit wrong target!
      playError();
      setWrongCount(w => w + 1);
      onWrong(currentWord.id);
    }
  };

  // Touch / Mouse controls for Slingshot
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current || projectile?.active) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Only allow starting drag in the lower slingshot area (y > 60)
    if (y > 60) {
      setIsAiming(true);
      setDragOrigin({ x: 50, y: 82 }); // Center of slingshot base
      setDragCurrent({ x, y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isAiming || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDragCurrent({ x, y });
  };

  const handlePointerUp = () => {
    if (!isAiming) return;
    setIsAiming(false);

    // Calculate velocity vector (drag direction opposite to shoot direction)
    const dx = dragOrigin.x - dragCurrent.x;
    const dy = dragOrigin.y - dragCurrent.y;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy), 24);

    if (power > 3) {
      playSlingshot();
      setProjectile({
        x: dragOrigin.x,
        y: dragOrigin.y,
        vx: dx * 0.18,
        vy: dy * 0.18,
        active: true,
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <JuiceBurst trigger={burst} type="correct" x={burstPos.x} y={burstPos.y} />

      {/* Target Prompt Box */}
      <div className="w-full rounded-2xl glass-panel p-4 mb-3 flex items-center justify-between border border-cyan-500/40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Target className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-400">
              Dispara a la traducción de:
            </span>
            <div className={`font-black text-slate-100 ${isArabic ? 'text-2xl font-arabic' : 'text-xl'}`} dir={isArabic ? 'rtl' : 'ltr'}>
              {currentWord.text} {currentWord.phonetic ? `(${currentWord.phonetic})` : ''}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => speak(currentWord.audioText || currentWord.text, language)}
          className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
          title="Escuchar audio"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Arena / Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-[380px] sm:h-[420px] rounded-3xl glass-panel relative overflow-hidden border-2 border-white/10 shadow-2xl cursor-crosshair touch-none"
      >
        {/* Sky / Grid background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-900/80 pointer-events-none" />
        <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono pointer-events-none">
          OBJETIVO {targetIndex + 1}/{words.length} • ARRASTRA EL PROYECTIL HACIA ATRÁS
        </div>

        {/* Floating Targets */}
        {targets.map(target => {
          if (target.hit) return null;
          return (
            <button
              key={target.word.id}
              type="button"
              onClick={() => handleHitTarget(target)} // Direct tap fallback
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-20 px-3 py-2 rounded-2xl glass-card border border-cyan-400/50 flex items-center gap-1.5 shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <span className="text-xl">{target.word.imageUrl || '🎯'}</span>
              <span className="text-xs sm:text-sm font-bold text-slate-100 whitespace-nowrap">
                {target.word.translation}
              </span>
            </button>
          );
        })}

        {/* Flying Projectile */}
        {projectile && projectile.active && (
          <div
            style={{
              left: `${projectile.x}%`,
              top: `${projectile.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 shadow-lg shadow-pink-500/50 pointer-events-none animate-pulse"
          />
        )}

        {/* Slingshot Base & Rubber Bands */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
          {/* Elastic line if aiming */}
          {isAiming && (
            <svg className="absolute -top-16 w-32 h-24 overflow-visible pointer-events-none">
              <line
                x1="24"
                y1="30"
                x2={64 + (dragCurrent.x - dragOrigin.x) * 2}
                y2={30 + (dragCurrent.y - dragOrigin.y) * 2}
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="104"
                y1="30"
                x2={64 + (dragCurrent.x - dragOrigin.x) * 2}
                y2={30 + (dragCurrent.y - dragOrigin.y) * 2}
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Slingshot Ball / Grip */}
          <div
            style={
              isAiming
                ? {
                    transform: `translate(${Math.min(
                      Math.max((dragCurrent.x - dragOrigin.x) * 1.5, -40),
                      40
                    )}px, ${Math.min(
                      Math.max((dragCurrent.y - dragOrigin.y) * 1.5, -20),
                      35
                    )}px)`,
                  }
                : {}
            }
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center text-white font-black shadow-xl shadow-cyan-500/40 cursor-grab active:cursor-grabbing border-2 border-white pointer-events-auto"
          >
            🚀
          </div>

          <div className="mt-1 text-[11px] font-extrabold text-cyan-300 uppercase tracking-widest">
            {isAiming ? '¡Suelta para disparar!' : 'Tensa la honda'}
          </div>
        </div>
      </div>
    </div>
  );
};
