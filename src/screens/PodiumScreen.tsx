import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, ShoppingBag, Compass, Sparkles, Gem, Coins, Medal } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';

export const PodiumScreen: React.FC = () => {
  const scores = useGameStore(s => s.scores);
  const results = useGameStore(s => s.results);
  const setScreen = useGameStore(s => s.setScreen);
  const resetSession = useGameStore(s => s.resetSession);
  const startSession = useGameStore(s => s.startSession);

  const profiles = useProfileStore(s => s.profiles);
  const addRewards = useProfileStore(s => s.addRewards);

  const { playFanfare } = useSound();
  const [burst, setBurst] = useState(false);

  // Sort players by score descending
  const rankedPlayers = [...profiles].sort((a, b) => (scores[b.uid] || 0) - (scores[a.uid] || 0));
  const winner = rankedPlayers[0];

  useEffect(() => {
    playFanfare();
    setBurst(true);

    // Award bonus gem to the winner
    if (winner) {
      addRewards(winner.uid, 20, 1);
    }
  }, []);

  const handleRematch = () => {
    resetSession();
    startSession(profiles);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      <JuiceBurst trigger={burst} type="victory" />

      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>¡Fin de la Partida!</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          Podio de Campeones
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          ¡Gran esfuerzo en todos los desafíos lingüísticos!
        </p>
      </div>

      {/* Olympic Podium Display */}
      <div className="w-full max-w-2xl flex items-end justify-center gap-3 sm:gap-6 my-6 min-h-[300px]">
        {/* 2nd Place (Silver) */}
        {rankedPlayers.length > 1 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col items-center max-w-[160px]"
          >
            <div className="text-3xl mb-1 select-none">🥈</div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 border-slate-300 bg-slate-800 shadow-lg select-none mb-2"
              style={{ borderColor: rankedPlayers[1].color }}
            >
              {rankedPlayers[1].avatarUrl || '🥈'}
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-200 truncate max-w-full text-center">
              {rankedPlayers[1].displayName}
            </span>
            <span className="text-xs font-black text-cyan-400 mb-2">
              {scores[rankedPlayers[1].uid] || 0} pts
            </span>

            {/* Silver pedestal */}
            <div className="w-full h-32 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-4 border-slate-300 flex items-center justify-center text-slate-400 font-black text-2xl shadow-xl">
              2
            </div>
          </motion.div>
        )}

        {/* 1st Place (Gold Champion) */}
        {winner && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 flex flex-col items-center max-w-[190px] z-10"
          >
            <div className="text-4xl mb-1 select-none animate-bounce">👑</div>
            <div
              className="w-18 h-18 rounded-full flex items-center justify-center text-3xl border-4 border-amber-400 bg-slate-800 shadow-2xl shadow-amber-500/30 select-none mb-2"
              style={{ borderColor: winner.color }}
            >
              {winner.avatarUrl || '🥇'}
            </div>
            <span className="text-sm sm:text-base font-black text-amber-300 truncate max-w-full text-center">
              {winner.displayName}
            </span>
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 mb-2">
              <span>{scores[winner.uid] || 0} pts</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-purple-300">
                <Gem className="w-3 h-3 text-purple-400" /> +1
              </span>
            </div>

            {/* Gold pedestal */}
            <div className="w-full h-44 rounded-t-2xl bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-slate-800 border-t-4 border-amber-400 flex flex-col items-center justify-center text-amber-300 font-black shadow-2xl">
              <span className="text-4xl">1</span>
              <span className="text-[10px] uppercase font-bold text-amber-200">Campeón</span>
            </div>
          </motion.div>
        )}

        {/* 3rd Place (Bronze) */}
        {rankedPlayers.length > 2 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 flex flex-col items-center max-w-[160px]"
          >
            <div className="text-3xl mb-1 select-none">🥉</div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 border-amber-700 bg-slate-800 shadow-lg select-none mb-2"
              style={{ borderColor: rankedPlayers[2].color }}
            >
              {rankedPlayers[2].avatarUrl || '🥉'}
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-200 truncate max-w-full text-center">
              {rankedPlayers[2].displayName}
            </span>
            <span className="text-xs font-black text-cyan-400 mb-2">
              {scores[rankedPlayers[2].uid] || 0} pts
            </span>

            {/* Bronze pedestal */}
            <div className="w-full h-24 rounded-t-2xl bg-gradient-to-t from-slate-900 to-amber-950/50 border-t-4 border-amber-700 flex items-center justify-center text-amber-600 font-black text-2xl shadow-xl">
              3
            </div>
          </motion.div>
        )}
      </div>

      {/* Rewards & Summary Card */}
      <div className="w-full max-w-lg p-5 rounded-3xl glass-panel border border-white/10 my-4 space-y-3">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 text-center">
          Resumen de Aprendizaje
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl glass-card flex items-center gap-3">
            <Coins className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-sm font-bold text-slate-100">Monedas Ganadas</div>
              <div className="text-xs text-slate-400">Canjeables en el Garaje</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl glass-card flex items-center gap-3">
            <Gem className="w-6 h-6 text-purple-400" />
            <div>
              <div className="text-sm font-bold text-slate-100">Bono de Victoria</div>
              <div className="text-xs text-purple-300 font-bold">+1 Gema exclusiva</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
        <button
          type="button"
          onClick={handleRematch}
          className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revancha</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('GARAGE')}
          className="py-3 px-4 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500/30 active:scale-95 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Ir al Garaje</span>
        </button>

        <button
          type="button"
          onClick={() => setScreen('WORLD_HUB')}
          className="py-3 px-4 rounded-xl glass-card text-slate-300 hover:text-white border border-white/10 font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
        >
          <Compass className="w-4 h-4" />
          <span>Mundos</span>
        </button>
      </div>
    </div>
  );
};
