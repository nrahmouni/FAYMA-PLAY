import React, { PointerEvent, useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import { GAME_COPY } from '../data/gameCopy';

interface MagicWorldGameProps {
  language: Language;
}

interface Player {
  name: string;
  emoji: string;
  color: string;
  score: number;
  stars: number;
}

interface Point {
  x: number;
  y: number;
}

interface TrackData {
  samples: Point[];
  obstacles: Point[];
  stars: Point[];
  width: number;
}

const WIDTH = 540;
const HEIGHT = 960;
const ROUNDS = 3;
const EMOJIS = ['🦁', '🦄', '🐸', '🐼'];
const COLORS = ['#ff5a5f', '#9b5de5', '#2ec4b6', '#ffbe0b'];
const TRACK = 'M 90 820 C 170 780 360 730 450 690 S 180 590 90 560 S 350 470 450 430 S 180 340 90 300 S 300 230 410 195';
const THEMES = [
  { sky: ['#8fe3ff', '#e6fbff'], grass: ['#7bd36a', '#4fb35a'], road: '#f6e7b4', edge: '#8a5a2b', decor: ['🌳', '🌷', '🍄', '🌼'] },
  { sky: ['#ffc2e2', '#fff0f7'], grass: ['#ff9ecb', '#f06fa6'], road: '#fff3c4', edge: '#d6457f', decor: ['🍭', '🧁', '🍩', '🍬'] },
  { sky: ['#a5b4ff', '#e3e8ff'], grass: ['#f5f7ff', '#c9d4f2'], road: '#9fb3d9', edge: '#5c6fa8', decor: ['⛄', '🌲', '❄️', '🎿'] },
];

import { MAGIC_WORLD_COPY } from '../data/magicWorldCopy';


const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function offsetPoint(path: SVGPathElement, distanceAlong: number, offset: number): Point {
  const length = path.getTotalLength();
  const center = path.getPointAtLength(distanceAlong);
  const before = path.getPointAtLength(Math.max(0, distanceAlong - 3));
  const after = path.getPointAtLength(Math.min(length, distanceAlong + 3));
  const dx = after.x - before.x;
  const dy = after.y - before.y;
  const magnitude = Math.hypot(dx, dy) || 1;
  return { x: center.x - (dy / magnitude) * offset, y: center.y + (dx / magnitude) * offset };
}

export const MagicWorldGame: React.FC<MagicWorldGameProps> = ({ language }) => {
  const copy = MAGIC_WORLD_COPY[language];
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const samplesRef = useRef<Point[]>([]);
  const obstaclesRef = useRef<Point[]>([]);
  const collectedRef = useRef(new Set<number>());
  const progressRef = useRef(0);
  const startedAtRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const previousPointRef = useRef<Point | null>(null);
  const [phase, setPhase] = useState<'setup' | 'intro' | 'ready' | 'draw' | 'result' | 'podium'>('ready');
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([{
    name: 'Jugador 1',
    emoji: EMOJIS[0],
    color: COLORS[0],
    score: 0,
    stars: 0,
  }]);
  const [round, setRound] = useState(0);
  const [turn, setTurn] = useState(0);
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [trail, setTrail] = useState<Point[]>([]);
  const [collected, setCollected] = useState<number[]>([]);
  const [result, setResult] = useState({ won: false, reason: '', points: 0, stars: 0, seconds: 0 });
  const [message, setMessage] = useState(copy.beginHint);
  const [seconds, setSeconds] = useState(0);
  const theme = THEMES[round % THEMES.length];
  const player = players[turn];
  const gameVisible = phase !== 'setup' && phase !== 'podium';

  useEffect(() => {
    if (!gameVisible || !pathRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    const width = 46 - round * 4;
    const samples = Array.from({ length: 301 }, (_, index) => {
      const point = path.getPointAtLength((index / 300) * length);
      return { x: point.x, y: point.y };
    });
    const obstacles = Array.from({ length: 4 + round * 2 }, (_, index) => {
      const along = length * (0.12 + (index / (3 + round * 2)) * 0.72);
      return offsetPoint(path, along, (index % 2 === 0 ? 1 : -1) * width * 0.95);
    });
    const stars = Array.from({ length: 6 }, (_, index) => {
      const point = path.getPointAtLength(length * (0.08 + index * 0.145));
      return { x: point.x, y: point.y };
    });
    samplesRef.current = samples;
    obstaclesRef.current = obstacles;
    collectedRef.current = new Set();
    progressRef.current = 0;
    setTrackData({ samples, obstacles, stars, width });
    setCollected([]);
  }, [gameVisible, round]);

  useEffect(() => {
    if (phase !== 'draw') return;
    const interval = window.setInterval(() => setSeconds((Date.now() - startedAtRef.current) / 1000), 100);
    return () => window.clearInterval(interval);
  }, [phase]);

  const begin = () => {
    setPlayers(Array.from({ length: playerCount }, (_, index) => ({
      name: `${copy.player} ${index + 1}`,
      emoji: EMOJIS[index],
      color: COLORS[index],
      score: 0,
      stars: 0,
    })));
    setRound(0);
    setTurn(0);
    setMessage('');
    setPhase('intro');
  };

  const finish = (won: boolean, reason: string) => {
    if (phase !== 'draw') return;
    const elapsed = (Date.now() - startedAtRef.current) / 1000;
    const stars = collectedRef.current.size;
    const points = stars * 10 + (won ? 50 + Math.max(0, 30 - Math.floor(elapsed)) : 0);
    setPlayers(current => current.map((item, index) => index === turn
      ? { ...item, score: item.score + points, stars: item.stars + stars }
      : item));
    setResult({ won, reason, points, stars, seconds: elapsed });
    setMessage('');
    pointerIdRef.current = null;
    previousPointRef.current = null;
    setPhase('result');
  };

  const getPoint = (event: { clientX: number; clientY: number }): Point => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const bounds = svg.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(WIDTH, ((event.clientX - bounds.left) / bounds.width) * WIDTH)),
      y: Math.max(0, Math.min(HEIGHT, ((event.clientY - bounds.top) / bounds.height) * HEIGHT)),
    };
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (phase !== 'ready' || !trackData) return;
    const point = getPoint(event);
    if (distance(point, samplesRef.current[0]) > 100) {
      setMessage(copy.beginHint);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerIdRef.current = event.pointerId;
    previousPointRef.current = samplesRef.current[0];
    collectedRef.current = new Set();
    progressRef.current = 0;
    startedAtRef.current = Date.now();
    setSeconds(0);
    setCollected([]);
    setTrail([samplesRef.current[0]]);
    setMessage('');
    setPhase('draw');
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (phase !== 'draw' || pointerIdRef.current !== event.pointerId || !trackData) return;
    const samples = samplesRef.current;
    const coalescedEvents = event.nativeEvent.getCoalescedEvents?.() ?? [];
    const pointerEvents = [...coalescedEvents];
    const lastCoalescedEvent = pointerEvents[pointerEvents.length - 1];
    if (!lastCoalescedEvent
      || lastCoalescedEvent.clientX !== event.nativeEvent.clientX
      || lastCoalescedEvent.clientY !== event.nativeEvent.clientY) {
      pointerEvents.push(event.nativeEvent);
    }

    for (const pointerEvent of pointerEvents) {
      const point = getPoint(pointerEvent);
      const previousPoint = previousPointRef.current ?? point;
      const steps = Math.max(1, Math.ceil(distance(previousPoint, point) / 8));
      let nextProgress = progressRef.current;
      const nextCollected = new Set(collectedRef.current);

      for (let step = 1; step <= steps; step++) {
        const fraction = step / steps;
        const tracePoint = {
          x: previousPoint.x + (point.x - previousPoint.x) * fraction,
          y: previousPoint.y + (point.y - previousPoint.y) * fraction,
        };
        let nearestIndex = nextProgress;
        let nearestDistance = Infinity;
        const first = Math.max(0, nextProgress - 4);
        const last = Math.min(samples.length - 1, nextProgress + 35);
        for (let index = first; index <= last; index++) {
          const currentDistance = distance(samples[index], tracePoint);
          if (currentDistance < nearestDistance) {
            nearestDistance = currentDistance;
            nearestIndex = index;
          }
        }
        // If point skips too far ahead along track without visiting intervening points, it is a cut
        if (nearestIndex > nextProgress + 20) {
          finish(false, copy.edge);
          return;
        }
        if (nearestDistance > trackData.width * 1.02) {
          finish(false, copy.edge);
          return;
        }
        nextProgress = Math.max(nextProgress, nearestIndex);
        if (obstaclesRef.current.some(obstacle => distance(obstacle, tracePoint) < 24)) {
          finish(false, copy.bomb);
          return;
        }
        const starIndex = trackData.stars.findIndex((star, index) => !nextCollected.has(index) && distance(star, tracePoint) < 28);
        if (starIndex >= 0) nextCollected.add(starIndex);
        if (nextProgress >= samples.length - 6) break;
      }

      progressRef.current = nextProgress;
      previousPointRef.current = point;
      if (nextCollected.size !== collectedRef.current.size) {
        collectedRef.current = nextCollected;
        setCollected([...nextCollected]);
      }
      setTrail(current => {
        const lastPoint = current[current.length - 1];
        return distance(lastPoint, point) > 4 ? [...current, point] : current;
      });
      if (nextProgress >= samples.length - 6) {
        finish(true, copy.goal);
        return;
      }
    }
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (phase !== 'draw' || pointerIdRef.current !== event.pointerId) return;
    pointerIdRef.current = null;
    previousPointRef.current = null;
    setTrail([]);
    setMessage(copy.lifted);
    setPhase('ready');
  };

  const nextTurn = () => {
    setMessage('');
    setTrail([]);
    setCollected([]);
    if (turn < players.length - 1) {
      setTurn(current => current + 1);
      setPhase('intro');
    } else if (round < ROUNDS - 1) {
      setTurn(0);
      setRound(current => current + 1);
      setPhase('intro');
    } else {
      setPhase('podium');
    }
  };

  const restart = () => {
    setTrackData(null);
    setPlayers([]);
    setPhase('setup');
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border-4 border-white bg-white/95 p-3 shadow-xl sm:p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-sky-100 to-violet-100 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">{player?.emoji || '🦄'}</span>
          <div>
            <h2 className="font-black text-slate-900">{copy.gameTitle}</h2>
            {player && <p className="text-sm font-bold text-slate-600">{player.name} · {copy.round} {round + 1} {copy.of} {ROUNDS}</p>}
          </div>
        </div>
        {player && (
          <div className="flex items-center gap-3 text-lg font-black text-violet-900" aria-live="polite">
            <span>⭐ {collected.length}</span>
            {phase === 'draw' && <span>{seconds.toFixed(1)} {copy.seconds}</span>}
          </div>
        )}
      </header>

      {phase === 'setup' && (
        <div className="rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-100 px-4 py-8 text-center sm:py-12">
          <div className="mb-4 text-6xl" aria-hidden="true">🌈🦄✨</div>
          <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">{copy.players}</h3>
          <div className="my-6 flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                aria-pressed={playerCount === count}
                onClick={() => setPlayerCount(count)}
                className={`h-14 w-14 rounded-2xl border-4 text-xl font-black shadow-sm transition sm:h-16 sm:w-16 ${
                  playerCount === count ? 'border-white bg-emerald-500 text-white ring-4 ring-emerald-300' : 'border-white bg-white text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <button type="button" onClick={begin} className="min-h-14 rounded-2xl bg-orange-500 px-10 text-xl font-black text-white shadow-[0_4px_0_#c2410c] transition hover:bg-orange-600 active:translate-y-1 active:shadow-none">
            {copy.start}
          </button>
          <p className="mx-auto mt-5 max-w-md text-sm font-bold text-slate-700">{copy.directions}</p>
        </div>
      )}

      {phase === 'podium' && (
        <div className="rounded-3xl bg-gradient-to-b from-violet-100 via-white to-amber-100 p-5 text-center sm:p-8">
          <div className="text-6xl" aria-hidden="true">🏆</div>
          <h3 className="mb-5 mt-2 text-3xl font-black text-violet-950">
            {players.length > 1 ? `${[...players].sort((a, b) => b.score - a.score)[0].name} ${copy.winner}` : copy.great}
          </h3>
          <ol className="mx-auto mb-6 max-w-lg space-y-3">
            {[...players].sort((a, b) => b.score - a.score).map((item, index) => (
              <li key={item.name} className="flex items-center gap-3 rounded-2xl border-2 border-white bg-white/90 p-3 text-left shadow-sm">
                <span className="text-3xl" aria-hidden="true">{['🥇', '🥈', '🥉', '🎖️'][index]}</span>
                <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
                <span className="min-w-0 flex-1 truncate font-black text-slate-900">{item.name}</span>
                <span className="font-black text-rose-600">{item.score} {copy.points}</span>
              </li>
            ))}
          </ol>
          <button type="button" onClick={restart} className="min-h-12 rounded-2xl bg-emerald-500 px-7 font-black text-white shadow-[0_4px_0_#328248] transition hover:bg-emerald-600 active:translate-y-1 active:shadow-none">
            {copy.playAgain}
          </button>
        </div>
      )}

      {gameVisible && (
        <>
          {phase === 'intro' && (
            <div className="mb-3 rounded-2xl bg-amber-50 p-3 text-center">
              <p className="font-black text-slate-900">{player?.emoji} {player?.name} — {copy.round} {round + 1}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{copy.begin}</p>
              <button type="button" onClick={() => { setPhase('ready'); setMessage(copy.beginHint); }} className="mt-3 min-h-11 rounded-xl bg-teal-500 px-8 font-black text-white shadow-[0_3px_0_#0f766e]">
                {copy.ready}
              </button>
            </div>
          )}
          <svg
              ref={svgRef}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              role="img"
              aria-label={copy.directions}
              className={`mx-auto block h-full max-h-[82vh] w-auto max-w-full rounded-3xl shadow-xl aspect-[540/960] ${phase === 'ready' || phase === 'draw' ? 'touch-none' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <defs>
                <linearGradient id="magic-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.sky[0]} />
                  <stop offset="100%" stopColor={theme.sky[1]} />
                </linearGradient>
                <linearGradient id="magic-grass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.grass[0]} />
                  <stop offset="100%" stopColor={theme.grass[1]} />
                </linearGradient>
              </defs>
              <rect width={WIDTH} height={HEIGHT} fill="url(#magic-sky)" />
              <rect y="150" width={WIDTH} height={HEIGHT - 150} rx="40" fill="url(#magic-grass)" />
              {Array.from({ length: 16 }, (_, index) => (
                <text key={index} x={30 + ((index * 137) % 480)} y={190 + ((index * 173) % 700)} fontSize={30 + (index % 3) * 7} textAnchor="middle" aria-hidden="true">
                  {theme.decor[index % theme.decor.length]}
                </text>
              ))}
              <path ref={pathRef} d={TRACK} fill="none" stroke={theme.edge} strokeWidth={2 * ((trackData?.width ?? 46) + 8)} strokeLinecap="round" strokeLinejoin="round" />
              <path d={TRACK} fill="none" stroke={theme.road} strokeWidth={2 * (trackData?.width ?? 46)} strokeLinecap="round" strokeLinejoin="round" />
              <path d={TRACK} fill="none" stroke="#ffffff" strokeWidth="4" strokeDasharray="4 24" strokeLinecap="round" opacity=".8" />
              <circle cx="90" cy="820" r="38" fill="#2ec4b6" stroke="white" strokeWidth="6" />
              <text x="90" y="832" fontSize="36" textAnchor="middle" aria-hidden="true">{player?.emoji || '👉'}</text>
              <text x="410" y="217" fontSize="72" textAnchor="middle" aria-hidden="true">🏁</text>
              {trackData?.obstacles.map((obstacle, index) => (
                <text key={`obstacle-${index}`} x={obstacle.x} y={obstacle.y + 14} fontSize="42" textAnchor="middle" aria-hidden="true">
                  {index % 3 === 0 ? '🪨' : '💣'}
                </text>
              ))}
              {trackData?.stars.map((star, index) => !collected.includes(index) && (
                <text key={`star-${index}`} x={star.x} y={star.y + 14} fontSize="40" textAnchor="middle" aria-hidden="true">⭐</text>
              ))}
              {trail.length > 1 && (
                <polyline points={trail.map(point => `${point.x},${point.y}`).join(' ')} fill="none" stroke={player?.color || '#ff5a5f'} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {phase === 'draw' && trail.length > 0 && (
                <text x={trail[trail.length - 1].x} y={trail[trail.length - 1].y + 14} fontSize="48" textAnchor="middle" aria-hidden="true">{player?.emoji}</text>
              )}
            </svg>
          {message && phase === 'ready' && <p className="mt-3 text-center text-sm font-black text-emerald-800" aria-live="polite">{message}</p>}
          {phase === 'result' && (
            <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{result.won ? '🎉' : '💥'} {result.reason}</p>
              <p className="mt-1 text-lg font-black text-orange-600">+{result.points} {copy.points}</p>
              <p className="text-sm font-bold text-slate-600">⭐ {result.stars} {copy.starsOf} · {result.seconds.toFixed(1)} {copy.seconds}</p>
              <button type="button" onClick={nextTurn} className="mt-3 min-h-12 rounded-xl bg-orange-500 px-8 font-black text-white shadow-[0_3px_0_#c2410c]">
                {turn === players.length - 1 && round === ROUNDS - 1 ? copy.podium : copy.next}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
