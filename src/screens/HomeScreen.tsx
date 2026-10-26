import React from 'react';
import { motion } from 'motion/react';
import { Play, Users, ShoppingBag, Sparkles, Compass, ShieldCheck, Globe } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';

export const HomeScreen: React.FC = () => {
  const setScreen = useGameStore(s => s.setScreen);
  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);
  const profiles = useProfileStore(s => s.profiles);
  const langMeta = LANGUAGES[language];

  // Keyboard shortcut listener for Game Craft standard
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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center text-center">
      {/* Decorative Aura */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-pink-500 to-amber-500 rounded-full blur-2xl opacity-30 animate-pulse-glow" />

        {/* Bespoke SVG Title Lockup */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-pink-500 to-amber-500 p-1 shadow-2xl mb-4 transform hover:rotate-6 transition">
            <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-4xl sm:text-5xl select-none">
              🎮
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 bg-clip-text text-transparent filter drop-shadow-md">
            JUEGOFY
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-md mt-2">
            Plataforma interactiva de minijuegos educativos en Árabe, Flamenco y Francés.
          </p>
        </div>
      </div>

      {/* Language Quick Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 mb-8 shadow-xl">
        {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
          const meta = LANGUAGES[langKey];
          const isSelected = language === langKey;

          return (
            <button
              key={langKey}
              onClick={() => setLanguage(langKey)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-400 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span className="text-base select-none">{meta.flag}</span>
              <span>{meta.name}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          type="button"
          onClick={() => setScreen('WORLD_HUB')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center gap-2.5 shadow-2xl hover:opacity-95 active:scale-98 transition cursor-pointer shadow-cyan-500/25 group"
        >
          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          <span>JUGAR AVENTURA</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setScreen('PLAYER_SETUP')}
            className="py-3 px-4 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Jugadores ({profiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setScreen('GARAGE')}
            className="py-3 px-4 rounded-xl glass-panel hover:bg-slate-800/80 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Garaje Cosmético</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setScreen('AUTH')}
          className="w-full py-2.5 px-4 rounded-xl glass-card hover:bg-slate-800/60 text-slate-400 hover:text-cyan-300 border border-white/5 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sincronización en la Nube (Google Auth)</span>
        </button>
      </div>

      {/* Flat Control-Hint line (Game Craft Standard) */}
      <div className="mt-8 text-xs font-mono text-slate-500 select-none">
        Pulsa <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-cyan-300">Enter</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-cyan-300">Espacio</kbd> para Iniciar • Compatible con Pantalla Táctil y PWA
      </div>
    </div>
  );
};
