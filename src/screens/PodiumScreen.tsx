import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, RotateCcw, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';

export const PodiumScreen: React.FC = () => {
  const scores = useGameStore(state => state.scores);
  const setScreen = useGameStore(state => state.setScreen);
  const resetSession = useGameStore(state => state.resetSession);
  const startSession = useGameStore(state => state.startSession);
  const profiles = useProfileStore(state => state.profiles);
  const { playFanfare } = useSound();
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    playFanfare();
    setBurst(true);
  }, [playFanfare]);

  const playAgain = () => {
    resetSession();
    startSession(profiles);
  };

  const chooseAnotherGame = () => {
    setScreen('WORLD_HUB');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-2xl flex-col justify-center px-4 py-6 sm:px-8">
      <JuiceBurst trigger={burst} type="victory" />
      <section className="rounded-[2rem] border-4 border-white bg-gradient-to-br from-yellow-200 via-rose-100 to-sky-200 p-5 text-center shadow-[0_20px_50px_rgba(36,107,253,.16)] sm:p-8">
        <motion.div
          initial={{ scale: 0.7, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-7xl sm:text-8xl"
          aria-hidden="true"
        >
          🎉
        </motion.div>
        <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">¡Partida terminada!</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600 sm:text-base">¡Lo habéis hecho genial! Cada ronda os enseñó algo nuevo.</p>

        <div className="mt-6 space-y-3">
          {profiles.map((player, index) => (
            <motion.div
              key={player.uid}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3 rounded-2xl border-2 border-white bg-white/90 p-3 text-left shadow-sm sm:p-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-3xl" aria-hidden="true">
                {player.avatarUrl?.startsWith('data:') || player.avatarUrl?.startsWith('/')
                  ? <img src={player.avatarUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                  : player.avatarUrl || '⭐'}
              </span>
              <span className="min-w-0 flex-1 truncate font-black text-slate-900">{player.displayName}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-black text-amber-900">⭐ {scores[player.uid] || 0}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={playAgain}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-[0_4px_0_#328248] transition hover:bg-emerald-700 active:translate-y-1 active:shadow-none"
          >
            <RotateCcw className="h-4 w-4" /> Otra partida
          </button>
          <button
            type="button"
            onClick={chooseAnotherGame}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 text-sm font-black text-white shadow-[0_4px_0_#367cad] transition hover:bg-sky-600 active:translate-y-1 active:shadow-none"
          >
            <Play className="h-4 w-4 fill-current" /> Otro juego
          </button>
          <button
            type="button"
            onClick={() => setScreen('PLAYER_SETUP')}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-violet-100 px-4 text-sm font-black text-violet-900 transition hover:bg-violet-200"
          >
            <Users className="h-4 w-4" /> Jugadores
          </button>
        </div>
        <button
          type="button"
          onClick={() => setScreen('HOME')}
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-600 transition hover:bg-white/70"
        >
          <ArrowLeft className="h-4 w-4" /> Cambiar idioma
        </button>
      </section>
    </main>
  );
};
