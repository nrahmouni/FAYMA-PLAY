import React from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

const LANGUAGE_ORDER: Language[] = ['es', 'fr', 'ar', 'nl-BE'];

const FLAG_ART: Record<Language, string> = {
  es: 'from-rose-100 to-amber-100',
  fr: 'from-sky-100 to-indigo-100',
  ar: 'from-amber-100 to-orange-100',
  'nl-BE': 'from-yellow-100 to-lime-100',
};

export const HomeScreen: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);
  const setLanguage = useGameStore(state => state.setLanguage);
  const totalRounds = useGameStore(state => state.totalRounds);
  const profiles = useProfileStore(state => state.profiles);

  const chooseLanguage = (language: Language) => {
    setLanguage(language);
    setScreen('WORLD_HUB');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-5xl flex-col justify-center px-4 py-6 sm:px-8 sm:py-10">
      <header className="mb-6 text-center sm:mb-9">
        <div className="mb-3 text-5xl sm:text-6xl" aria-hidden="true">🌈</div>
        <h1 className="text-3xl font-black text-slate-900 sm:text-5xl">¿A qué país viajamos?</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600 sm:text-lg">¡Elige una bandera para empezar a jugar!</p>
        <button
          type="button"
          onClick={() => setScreen('PLAYER_SETUP')}
          className="mx-auto mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-xs font-extrabold text-slate-700 shadow-sm ring-1 ring-slate-100 transition hover:bg-white"
        >
          <Users className="h-4 w-4 text-violet-600" />
          Juegan: {profiles.map(profile => profile.displayName).join(' y ')}
          <span className="text-emerald-700">· Cambiar</span>
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5" aria-label="Elige un idioma">
        {LANGUAGE_ORDER.map((language, index) => {
          const meta = LANGUAGES[language];
          return (
            <motion.button
              key={language}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => chooseLanguage(language)}
              className={`group relative flex min-h-32 items-center gap-5 overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br ${FLAG_ART[language]} p-5 text-left shadow-[0_8px_0_rgba(71,85,105,.12),0_16px_32px_rgba(71,85,105,.08)] transition sm:min-h-40 sm:p-7`}
            >
              <span className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl bg-white text-6xl shadow-sm sm:h-24 sm:w-28 sm:text-7xl" aria-hidden="true">
                {meta.flag}
              </span>
              <span className="min-w-0">
                <span className="block text-2xl font-black text-slate-900 sm:text-3xl">{meta.country === 'Bélgica / Flandes' ? 'Flandes' : meta.country}</span>
                <span className="mt-1 block text-sm font-bold text-slate-600 sm:text-base">
                  {language === 'nl-BE' ? 'Flamenco · Nederlands' : meta.name}
                </span>
                <span className="mt-3 inline-flex min-h-9 items-center rounded-full bg-white/85 px-4 text-xs font-black text-slate-700 shadow-sm">
                  ¡Vamos! <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </section>

      <footer className="mt-7 text-center text-xs font-semibold text-slate-500">
        {profiles.length > 1 ? `${profiles.length} jugadores · ${totalRounds} rondas` : `${totalRounds} rondas · ¡Juega a tu ritmo!`}
      </footer>
    </main>
  );
};
