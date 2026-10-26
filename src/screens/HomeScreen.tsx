import React from 'react';
import { motion } from 'motion/react';
import { Play, Users, ShoppingBag, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';

export const HomeScreen: React.FC = () => {
  const setScreen = useGameStore(s => s.setScreen);
  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);
  const profiles = useProfileStore(s => s.profiles);
  const activePlayer = profiles[0];
  const langMeta = LANGUAGES[language];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        setScreen('WORLD_HUB');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setScreen]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-12 flex flex-col items-center justify-center text-center">
      {/* Friendly Children Welcome Lockup */}
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 rounded-full blur-3xl opacity-35 animate-pulse-glow" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Mascot / Gamepad Icon */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-cyan-400 p-1 shadow-2xl mb-3"
          >
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-5xl sm:text-6xl select-none">
              🦊
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent filter drop-shadow">
            ¡JUEGOFY!
          </h1>
          <p className="text-base sm:text-lg text-amber-200 font-extrabold mt-1">
            ¡Aprende palabras mágicas jugando con amigos!
          </p>
        </div>
      </div>

      {/* Language Selector: Big Friendly Flags for Kids */}
      <div className="w-full max-w-md my-4">
        <span className="text-xs uppercase font-black text-cyan-300 tracking-wider block mb-2">
          🌍 Elige tu idioma para jugar:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
            const meta = LANGUAGES[langKey];
            const isSelected = language === langKey;

            return (
              <motion.button
                key={langKey}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(langKey)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer border-3 ${
                  isSelected
                    ? 'bg-amber-500/30 border-amber-400 text-white shadow-xl shadow-amber-500/30 scale-105'
                    : 'glass-card border-white/10 text-slate-300 hover:border-white/30'
                }`}
              >
                <span className="text-3xl mb-1 select-none filter drop-shadow">{meta.flag}</span>
                <span className="font-black text-xs sm:text-sm tracking-wide">{meta.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Giant Primary Action Button for Kids */}
      <div className="w-full max-w-sm space-y-3 mt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen('WORLD_HUB')}
          className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/40 border-2 border-white/40 cursor-pointer"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>¡A JUGAR AHORA!</span>
        </motion.button>

        {/* Big Colorful Secondary Cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setScreen('PLAYER_SETUP')}
            className="p-3.5 rounded-2xl glass-panel hover:bg-slate-800 border-2 border-cyan-400/40 text-cyan-200 font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span className="text-2xl">👥</span>
            <span>Jugadores ({profiles.length})</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setScreen('GARAGE')}
            className="p-3.5 rounded-2xl glass-panel hover:bg-slate-800 border-2 border-amber-400/40 text-amber-200 font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span className="text-2xl">🛍️</span>
            <span>Tienda de Premios</span>
          </motion.button>
        </div>

        <button
          type="button"
          onClick={() => setScreen('AUTH')}
          className="w-full py-2.5 px-4 rounded-xl glass-card text-slate-400 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Guardar progreso en la nube (Opcional)</span>
        </button>
      </div>

      {/* Control Hint for Kids */}
      <div className="mt-6 text-xs text-slate-400 font-bold select-none">
        🎮 ¡Toca la pantalla para jugar! • Funciona en móviles, tablets y computadoras
      </div>
    </div>
  );
};
