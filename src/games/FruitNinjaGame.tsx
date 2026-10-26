import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps, GameResult, Word } from '../types';

const FRUITS = ['🍉','🍎','🍓','🍌','🍊','🍍','🥝','🍒'];
export const FruitNinjaGame: React.FC<GameProps> = ({ words, onCorrect, onWrong, onComplete, difficulty }) => {
  const deck = useMemo(() => words.slice(0, Math.max(1, Math.min(words.length, 8))), [words]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [sliced, setSliced] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [startedAt] = useState(Date.now);
  const current = deck[index];
  const options = useMemo(() => {
    if (!current) return [];
    const others = deck.filter(w => w.id !== current.id);
    return [current, ...others].slice(0, Math.min(5, deck.length)).sort((a,b) => (a.id + String(index)).localeCompare(b.id + String(index)));
  }, [current, deck, index]);

  const slice = (word: Word) => {
    if (busy || sliced.includes(word.id) || !current) return;
    if (word.id === current.id) {
      setBusy(true); setSliced(v => [...v, word.id]); const n = correct + 1; setCorrect(n); onCorrect(current.id);
      window.setTimeout(() => {
        if (index + 1 >= deck.length) {
          const result: GameResult = { playerId: '', gameId: 'fruit', correct: n, wrong, timeMs: Date.now() - startedAt, coinsEarned: n * 9, wordsSeen: deck.map(w => w.id) };
          onComplete(result);
        } else { setIndex(v => v + 1); setSliced([]); setBusy(false); }
      }, 350);
    } else {
      setSliced(v => [...v, word.id]); setWrong(v => v + 1); onWrong(current.id);
      window.setTimeout(() => setSliced(v => v.filter(id => id !== word.id)), 500);
    }
  };

  if (!current) return <p className="p-6 text-white">No hay palabras disponibles para este desafío.</p>;
  return <div className="w-full max-w-xl mx-auto p-4 text-white">
    <div className="rounded-2xl border border-amber-400/30 bg-amber-950/30 p-4 text-center mb-4"><p className="text-xs font-black uppercase tracking-widest text-amber-300">🍉 Corta la traducción correcta</p><h2 className="text-3xl font-black mt-1">{current.text}</h2><p className="text-xs text-slate-300 mt-1">Toca la fruta que tenga su significado</p></div>
    <div className="relative min-h-64 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 p-4">
      <div className="absolute inset-x-0 bottom-0 h-8 bg-emerald-500/10 border-t border-emerald-400/20"/>
      <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3">{options.map((w,i) => <motion.button key={w.id} animate={{y:[0,-8,0], rotate:[-3,3,-3], scale:sliced.includes(w.id)?0.8:1, opacity:sliced.includes(w.id)?0.3:1}} transition={{y:{repeat:Infinity,duration:1.4+i*.13,ease:'easeInOut'}}} disabled={busy || sliced.includes(w.id)} onClick={() => slice(w)} className="min-h-24 rounded-2xl border border-white/10 bg-slate-800/80 p-3 flex flex-col items-center justify-center gap-1 shadow-xl disabled:cursor-default"><span className="text-4xl">{FRUITS[i % FRUITS.length]}</span><span className="text-xs font-black text-center">{w.translation}</span></motion.button>)}</div>
    </div>
    <p className="text-center text-xs text-slate-400 mt-3">Aciertos: {correct} · Errores: {wrong} · Dificultad: {difficulty}/5</p>
  </div>;
};
