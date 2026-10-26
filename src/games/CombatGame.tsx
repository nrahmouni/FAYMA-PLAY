import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { GameProps, GameResult, Word } from '../types';

function makeResult(gameId: string, words: Word[], correct: number, wrong: number, startedAt: number): GameResult {
  return { playerId: '', gameId, correct, wrong, timeMs: Date.now() - startedAt, coinsEarned: Math.max(5, correct * 8), wordsSeen: words.map(w => w.id) };
}

export const CombatGame: React.FC<GameProps> = ({ words, onCorrect, onWrong, onComplete, difficulty }) => {
  const deck = useMemo(() => words.slice(0, Math.max(1, Math.min(words.length, 8))), [words]);
  const [index, setIndex] = useState(0);
  const [hp, setHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null);
  const [startedAt] = useState(Date.now);
  const current = deck[index];

  const options = useMemo(() => {
    if (!current) return [];
    const others = deck.filter(w => w.id !== current.id);
    const shuffled = [...others].sort((a,b) => (a.id + current.id).localeCompare(b.id + current.id));
    return [current, ...shuffled.slice(0, 2)].sort((a,b) => (a.id + String(index)).localeCompare(b.id + String(index)));
  }, [current, deck, index]);

  const answer = (word: Word) => {
    if (busy || !current) return;
    setBusy(true);
    if (word.id === current.id) {
      const nextCorrect = correct + 1;
      setCorrect(nextCorrect); setHp(v => Math.max(0, v - Math.ceil(100 / deck.length)));
      setFlash('hit'); onCorrect(current.id);
      window.setTimeout(() => {
        setFlash(null);
        if (index + 1 >= deck.length) onComplete(makeResult('combat', deck, nextCorrect, wrong, startedAt));
        else { setIndex(v => v + 1); setBusy(false); }
      }, 450);
    } else {
      const nextWrong = wrong + 1;
      setWrong(nextWrong); setPlayerHp(v => Math.max(0, v - 15)); setFlash('miss'); onWrong(current.id);
      window.setTimeout(() => { setFlash(null); setBusy(false); }, 450);
    }
  };

  if (!current) return <p className="p-6 text-white">No hay palabras disponibles para este desafío.</p>;
  return <div className="w-full max-w-xl mx-auto p-4 text-white">
    <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-300 mb-2"><span>⚔️ Arena de combate</span><span>Ronda {index + 1}/{deck.length} · Dificultad {difficulty}/5</span></div>
    <div className={`relative overflow-hidden rounded-3xl border p-6 min-h-52 flex items-center justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 ${flash === 'hit' ? 'border-emerald-400' : flash === 'miss' ? 'border-rose-400' : 'border-white/10'}`}>
      <motion.div animate={flash === 'hit' ? { x: [0, 24, 0], rotate: [0, -8, 0] } : {}} className="text-6xl">🥷<div className="w-16 h-2 bg-slate-700 rounded-full mt-3 overflow-hidden"><div className="h-full bg-emerald-400" style={{width:`${playerHp}%`}}/></div></motion.div>
      <div className="z-10 text-center rounded-2xl bg-slate-950/80 border border-white/10 p-4 max-w-[58%]"><p className="text-[10px] font-black uppercase text-amber-300">Traduce para atacar</p><h2 className="text-2xl sm:text-3xl font-black mt-2">{current.text}</h2><p className="text-xs text-slate-400 mt-1">Elige el significado correcto</p></div>
      <motion.div animate={flash === 'hit' ? { x: [0, 8, -8, 0], rotate: [0, 12, -12, 0] } : flash === 'miss' ? { x: [0, -8, 8, 0] } : {}} className="text-6xl">👹<div className="w-16 h-2 bg-slate-700 rounded-full mt-3 overflow-hidden"><div className="h-full bg-rose-500" style={{width:`${hp}%`}}/></div></motion.div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">{options.map(w => <button key={w.id} disabled={busy} onClick={() => answer(w)} className="rounded-2xl border border-rose-300/30 border-b-4 border-b-rose-950 bg-gradient-to-br from-rose-600 to-red-800 p-4 font-extrabold shadow-lg active:translate-y-1 disabled:opacity-60">⚔️ {w.translation}</button>)}</div>
    <p className="text-center text-xs text-slate-400 mt-3">Aciertos: {correct} · Errores: {wrong}</p>
  </div>;
};
