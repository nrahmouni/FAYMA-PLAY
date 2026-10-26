import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Sparkles, Trophy } from 'lucide-react';
import { GameProps, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';
import { shuffleArray } from '../lib/utils';
import { VOCABULARY_BANK } from '../data/vocabulary';

interface Bubble {
  id: string;
  word: Word;
  isCorrect: boolean;
  x: number; // percentage 10-85
  y: number; // percentage 10-100
  speed: number;
  size: number;
  color: string;
  popped: boolean;
}

export const BubblePopperGame: React.FC<GameProps> = ({
  words,
  difficulty,
  onCorrect,
  onWrong,
  onComplete,
  language,
}) => {
  const [targetWordIndex, setTargetWordIndex] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [burst, setBurst] = useState(false);
  const [burstPos, setBurstPos] = useState({ x: 0.5, y: 0.5 });
  const [correctTotal, setCorrectTotal] = useState(0);
  const [wrongTotal, setWrongTotal] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const wordsSeenRef = useRef<string[]>([]);
  const isArabic = language === 'ar';

  const { speak } = useSpeech();
  const { playPop, playSuccess, playError } = useSound();

  const currentWord = words[targetWordIndex] || words[0];
  const requiredPopsPerTarget = 2; // Needs 2 pops to clear each word

  const spawnBubbles = useCallback(() => {
    if (!currentWord) return;

    if (!wordsSeenRef.current.includes(currentWord.id)) {
      wordsSeenRef.current.push(currentWord.id);
    }

    const otherWords = VOCABULARY_BANK.filter(
      w => w.language === language && w.id !== currentWord.id
    );
    const distractors = shuffleArray(otherWords).slice(0, 3);

    const bubbleList: Bubble[] = [];
    // 3 correct bubbles + 3 distractor bubbles
    const bubbleColors = [
      'from-cyan-400 to-blue-500',
      'from-pink-500 to-purple-600',
      'from-amber-400 to-orange-500',
      'from-emerald-400 to-teal-500',
    ];

    for (let i = 0; i < 3; i++) {
      bubbleList.push({
        id: `correct_${i}_${Date.now()}`,
        word: currentWord,
        isCorrect: true,
        x: 15 + i * 25 + (Math.random() * 8 - 4),
        y: 80 + i * 15,
        speed: 0.12 + Math.random() * 0.08,
        size: 72 + Math.random() * 12,
        color: bubbleColors[i % bubbleColors.length],
        popped: false,
      });
    }

    distractors.forEach((d, i) => {
      bubbleList.push({
        id: `distractor_${i}_${Date.now()}`,
        word: d,
        isCorrect: false,
        x: 20 + i * 22 + (Math.random() * 8 - 4),
        y: 85 + i * 18,
        speed: 0.12 + Math.random() * 0.08,
        size: 68 + Math.random() * 10,
        color: bubbleColors[(i + 2) % bubbleColors.length],
        popped: false,
      });
    });

    setBubbles(shuffleArray(bubbleList));
    setPoppedCount(0);
    speak(currentWord.audioText || currentWord.text, language);
  }, [currentWord, language, speak]);

  useEffect(() => {
    spawnBubbles();
  }, [targetWordIndex, spawnBubbles]);

  // Rising bubble physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      setBubbles(prev =>
        prev.map(b => {
          if (b.popped) return b;
          let nextY = b.y - b.speed * dt * 60;
          // Loop around if it floats off top
          if (nextY < -15) {
            nextY = 105;
          }
          return { ...b, y: nextY };
        })
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePopBubble = (bubble: Bubble) => {
    if (bubble.popped) return;

    playPop();
    setBurstPos({ x: bubble.x / 100, y: bubble.y / 100 });
    setBurst(true);

    setBubbles(prev =>
      prev.map(b => (b.id === bubble.id ? { ...b, popped: true } : b))
    );

    if (bubble.isCorrect) {
      playSuccess();
      setCorrectTotal(c => c + 1);
      onCorrect(currentWord.id);
      const nextPopped = poppedCount + 1;
      setPoppedCount(nextPopped);

      if (nextPopped >= requiredPopsPerTarget) {
        // Cleared this target word!
        setTimeout(() => {
          setBurst(false);
          if (targetWordIndex + 1 < words.length) {
            setTargetWordIndex(i => i + 1);
          } else {
            // Completed all!
            const totalTime = Date.now() - startTimeRef.current;
            onComplete({
              playerId: '',
              gameId: 'bubble_popper',
              correct: correctTotal + 1,
              wrong: wrongTotal,
              timeMs: totalTime,
              coinsEarned: 15 + (correctTotal + 1) * 5,
              wordsSeen: wordsSeenRef.current,
            });
          }
        }, 600);
      }
    } else {
      playError();
      setWrongTotal(w => w + 1);
      onWrong(currentWord.id);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <JuiceBurst trigger={burst} type="correct" x={burstPos.x} y={burstPos.y} />

      {/* Target prompt */}
      <div className="w-full rounded-2xl glass-panel p-4 mb-3 flex items-center justify-between border border-cyan-400/40 shadow-lg">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            ¡Explota las burbujas que digan:
          </span>
          <div className={`font-black text-slate-100 ${isArabic ? 'text-2xl font-arabic' : 'text-xl'}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {currentWord.text} <span className="text-sm font-normal text-slate-400">({currentWord.translation})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => speak(currentWord.audioText || currentWord.text, language)}
            className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
            title="Escuchar palabra"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <div className="px-3 py-1.5 rounded-xl glass-card text-xs font-bold text-amber-400 border border-amber-500/30">
            {poppedCount}/{requiredPopsPerTarget} explotadas
          </div>
        </div>
      </div>

      {/* Bubble Arena */}
      <div
        ref={containerRef}
        className="w-full h-[400px] sm:h-[440px] rounded-3xl glass-panel relative overflow-hidden border-2 border-white/10 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      >
        <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono pointer-events-none">
          TOCA LAS BURBUJAS CORRECTAS ANTES DE QUE ESCAPEN
        </div>

        {bubbles.map(bubble => {
          if (bubble.popped) return null;

          return (
            <button
              key={bubble.id}
              type="button"
              onClick={() => handlePopBubble(bubble)}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute rounded-full bg-gradient-to-tr ${bubble.color} p-1 shadow-xl flex items-center justify-center text-center cursor-pointer hover:scale-110 active:scale-90 transition-transform border-2 border-white/40 animate-pulse-glow`}
            >
              <div className="w-full h-full rounded-full bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center p-1">
                <span
                  className={`font-black text-white leading-tight drop-shadow-md ${
                    isArabic ? 'text-sm sm:text-base font-arabic' : 'text-xs sm:text-sm'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {bubble.word.text}
                </span>
                <span className="text-[10px] text-white/80 select-none">
                  {bubble.word.imageUrl}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
