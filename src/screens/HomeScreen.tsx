import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Gamepad2, Play, ShieldCheck, ShoppingBag, Sparkles, Users } from 'lucide-react';
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

  return (
    <div className="fayma-home relative mx-auto flex w-full max-w-6xl flex-col gap-8 overflow-hidden px-4 py-8 sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute -right-28 -top-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-[110px]" />

      <section className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div className="z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.22em] text-indigo-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            4 países • 4 idiomas • 1 aventura global
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[.95] tracking-[-.06em] text-slate-900 sm:text-7xl">
            FAYMA <span className="fayma-title-gradient">WORLD</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            Conquista rutas, ciudades y culturas reales mientras aprendes español, árabe, francés y flamenco. Cada misión convierte palabras en un viaje épico para niños.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setScreen('WORLD_HUB')}
              className="fayma-primary-button inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-base font-black text-slate-900 sm:text-lg"
            >
              <Play className="h-5 w-5 fill-current" />
              EMPEZAR EL VIAJE
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            <div className="rounded-2xl border border-indigo-200 bg-white/80 px-4 py-3 text-left shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Explorador</div>
              <div className="font-black text-slate-900">{activePlayer?.displayName || 'Crea tu perfil'}</div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotateY: -18, rotateX: 8, y: 18 }}
          animate={{ opacity: 1, rotateY: -10, rotateX: 4, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fayma-hero-stage relative mx-auto flex aspect-[1.15] w-full max-w-lg items-center justify-center"
          aria-label="Escenario de aventura global"
        >
          <div className="fayma-orbit fayma-orbit-back" />
          <div className="fayma-orbit fayma-orbit-front" />
          <div className="fayma-stage-platform" />
          <motion.div
            animate={{ y: [-8, 8, -8], rotateZ: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="fayma-hero-arcade"
          >
            <div className="fayma-arcade-screen">
              <span className="text-7xl drop-shadow-[0_12px_24px_rgba(0,0,0,.45)] sm:text-8xl">🗺️</span>
              <span className="mt-1 text-[10px] font-black uppercase tracking-[.28em] text-slate-800">world passport</span>
            </div>
            <div className="fayma-arcade-controls">
              <span className="fayma-arcade-stick" />
              <span className="fayma-arcade-button fayma-arcade-button-pink" />
              <span className="fayma-arcade-button fayma-arcade-button-cyan" />
            </div>
          </motion.div>
          <div className="absolute left-[9%] top-[22%] rounded-2xl border border-sky-200 bg-white/80 px-3 py-2 text-xs font-black text-sky-700 shadow-xl backdrop-blur">
            <Gamepad2 className="mr-1 inline h-4 w-4" /> 4 MUNDOS
          </div>
          <div className="absolute bottom-[21%] right-[1%] rounded-2xl border border-amber-200 bg-white/80 px-3 py-2 text-xs font-black text-amber-700 shadow-xl backdrop-blur">
            ✦ APRENDE JUGANDO
          </div>
        </motion.div>
      </section>

      <section className="relative grid gap-4 rounded-[2rem] border border-indigo-200 bg-white/70 p-4 shadow-[0_20px_50px_rgba(59,130,246,0.12)] backdrop-blur-xl sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-slate-600">
            <span className="text-lg">{langMeta.flag}</span>
            País principal: {langMeta.country}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
              const meta = LANGUAGES[langKey];
              const selected = language === langKey;
              return (
                <motion.button
                  key={langKey}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setLanguage(langKey)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
                    selected
                      ? 'border-indigo-300 bg-gradient-to-r from-sky-100 to-pink-100 text-slate-900 shadow-[0_0_22px_rgba(125,211,252,.18)]'
                      : 'border-slate-200 bg-white/80 text-slate-600 hover:border-indigo-200 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xl">{meta.flag}</span>
                  <span className="text-left text-[10px] font-black leading-tight">
                    <span className="block">{meta.country}</span>
                    <span className="text-[9px] uppercase tracking-wide text-slate-500">{meta.name}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:min-w-56 sm:grid-cols-1">
          <button
            type="button"
            onClick={() => setScreen('PLAYER_SETUP')}
            className="fayma-secondary-action"
          >
            <Users className="h-4 w-4 text-cyan-300" /> Jugadores
            <span className="ml-auto text-slate-400">{profiles.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setScreen('GARAGE')}
            className="fayma-secondary-action"
          >
            <ShoppingBag className="h-4 w-4 text-amber-300" /> Garaje
          </button>
          <button
            type="button"
            onClick={() => setScreen('AUTH')}
            className="fayma-secondary-action col-span-2 sm:col-span-1"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-300" /> Sincronizar progreso
          </button>
        </div>
      </section>
    </div>
  );
};
