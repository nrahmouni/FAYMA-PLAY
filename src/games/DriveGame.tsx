import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps, GameResult, Word } from '../types';

export const DriveGame: React.FC<GameProps> = ({ words, onCorrect, onWrong, onComplete, difficulty }) => {
  const deck = useMemo(() => words.slice(0, Math.max(1, Math.min(words.length, 8))), [words]);
  const [index, setIndex] = useState(0);
  const [lane, setLane] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [busy, setBusy] = useState(false);
  const [startedAt] = useState(Date.now);
  const current = deck[index];
  const options = useMemo(() => {
    if (!current) return [];
    const others = deck.filter(w => w.id !== current.id).slice(0, 2);
    return [current, ...others].sort((a,b) => (a.id + String(index)).localeCompare(b.id + String(index)));
  }, [current, deck, index]);

  const choose = (word: Word, laneIndex: number) => {
    if (busy || !current) return;
    setBusy(true); setLane(laneIndex);
    window.setTimeout(() => {
      if (word.id === current.id) {
        const n = correct + 1; setCorrect(n); onCorrect(current.id);
        if (index + 1 >= deck.length) {
          const result: GameResult = { playerId: '', gameId: 'drive', correct: n, wrong, timeMs: Date.now() - startedAt, coinsEarned: n * 7, wordsSeen: deck.map(w => w.id) };
          onComplete(result);
        } else { setIndex(v => v + 1); setBusy(false); }
      } else { setWrong(v => v + 1); onWrong(current.id); setBusy(false); }
    }, 260);
  };
  return <DriveGameView current={current} options={options} lane={lane} index={index} total={deck.length} correct={correct} wrong={wrong} difficulty={difficulty} busy={busy} onChoose={choose} />;
};

const DriveGameView: React.FC<{current?:Word; options:Word[]; lane:number; index:number; total:number; correct:number; wrong:number; difficulty:number; busy:boolean; onChoose:(w:Word,lane:number)=>void}> = ({current, options, lane, index, total, correct, wrong, difficulty, busy, onChoose}) => <div className="w-full max-w-xl mx-auto p-4 text-white">
  <div className="flex justify-between text-xs font-black uppercase text-slate-300 mb-3"><span>🏁 Carrera de palabras</span><span>{index + 1}/{total} · Nivel {difficulty}/5</span></div>
  <div className="relative h-72 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 p-3">
    <div className="absolute inset-0 grid grid-cols-3">{[0,1,2].map(i => <div key={i} className={`border-r border-dashed border-white/20 ${i === lane ? 'bg-cyan-400/10' : ''}`}/>)}</div>
    <motion.div animate={{ y:[-12,12,-12] }} transition={{repeat:Infinity,duration:1.6}} className="absolute bottom-4 text-4xl z-10" style={{left:`calc(${(lane+0.5)*33.333}% - 20px)`}}>🏎️</motion.div>
    <div className="relative z-10 mx-auto max-w-xs rounded-2xl bg-slate-950/85 border border-white/10 p-4 text-center"><p className="text-xs font-black uppercase text-cyan-300">¡Encuentra la traducción!</p><p className="text-3xl font-black mt-2">{current?.text ?? '¡Meta!'}</p></div>
    <div className="absolute top-28 inset-x-2 grid grid-cols-3 gap-2">{options.map((w,i) => <button key={w.id} disabled={busy} onClick={() => onChoose(w,i)} className="min-h-16 rounded-xl bg-cyan-950/95 border border-cyan-300/40 p-2 text-xs sm:text-sm font-black shadow-lg disabled:opacity-60">🚧<br/>{w.translation}</button>)}</div>
  </div>
  <p className="text-center text-xs text-slate-400 mt-3">Aciertos: {correct} · Errores: {wrong}</p>
</div>;
