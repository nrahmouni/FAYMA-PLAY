import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Users } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { GAME_COPY } from '../data/gameCopy';

const TARGET_OPTIONS: Language[] = ['nl-BE', 'en', 'fr', 'ar', 'es'];

export const HomeScreen: React.FC = () => {
  const language = useGameStore(state => state.language);
  const copy = GAME_COPY[language];
  const setScreen = useGameStore(state => state.setScreen);
  const setLanguage = useGameStore(state => state.setLanguage);
  const targetLanguages = useGameStore(state => state.targetLanguages);
  const setTargetLanguages = useGameStore(state => state.setTargetLanguages);
  const nativeLanguages = useGameStore(state => state.nativeLanguages);
  const profiles = useProfileStore(state => state.profiles);

  const toggleTargetLanguage = (lang: Language) => {
    if (targetLanguages.includes(lang)) {
      if (targetLanguages.length === 1) return;
      const updated = targetLanguages.filter(l => l !== lang);
      setTargetLanguages(updated);
      setLanguage(updated[0] || 'nl-BE');
    } else {
      const updated = targetLanguages.length >= 2 ? [targetLanguages[0], lang] : [...targetLanguages, lang];
      setTargetLanguages(updated);
      setLanguage(updated[0]);
    }
  };

  const startAdventure = () => {
    setScreen('WORLD_HUB');
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-2xl flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-4 overflow-hidden">
      <section className="w-full rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-amber-100 via-emerald-50 to-sky-100 p-4 shadow-[0_20px_50px_rgba(36,107,253,.16)] sm:p-6 flex flex-col justify-between">
        <header className="text-center">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🎯</span>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-black text-emerald-800 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> {copy.stepLabel}
          </div>
          <h1 className="mt-1.5 text-2xl font-black text-slate-900 sm:text-3xl">{copy.title}</h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
            {copy.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setScreen('PLAYER_SETUP')}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-slate-700 shadow-2xs hover:bg-white"
            >
              <Users className="h-3 w-3 text-violet-600" /> {profiles.map(p => p.displayName).join(', ')}
            </button>
            <button
              type="button"
              onClick={() => setScreen('NATIVE_LANG_SETUP')}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-slate-700 shadow-2xs hover:bg-white"
            >
              🏠 {copy.house}: {nativeLanguages.map(l => LANGUAGES[l].flag).join(' ')}
            </button>
          </div>
        </header>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[38vh] overflow-y-auto pr-1">
          {TARGET_OPTIONS.map((lang, index) => {
            const meta = LANGUAGES[lang];
            const isSelected = targetLanguages.includes(lang);

            return (
              <motion.button
                key={lang}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleTargetLanguage(lang)}
                className={`relative flex items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                  isSelected
                    ? 'border-emerald-500 bg-white shadow-sm ring-2 ring-emerald-300/50'
                    : 'border-white/80 bg-white/70 hover:bg-white/90'
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl shadow-2xs">
                  {meta.flag}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block text-base font-black text-slate-900">{meta.name}</span>
                  <span className="block text-xs font-bold text-slate-500">{meta.nativeName}</span>
                </div>

                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}>
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setScreen('NATIVE_LANG_SETUP')}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> {copy.back}
          </button>
          <button
            type="button"
            onClick={startAdventure}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-500 px-4 text-base font-black text-white shadow-[0_4px_0_#1e6b37] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
          >
            {copy.start} 🚀 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
