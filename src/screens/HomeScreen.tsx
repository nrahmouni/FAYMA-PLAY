import React from 'react';
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
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-3 py-2 sm:px-4 sm:py-4">
      <section className="flex min-h-0 flex-1 flex-col justify-between rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-amber-100 via-emerald-50 to-sky-100 p-3 shadow-[0_20px_50px_rgba(36,107,253,.16)] sm:p-6">
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
              onClick={() => setScreen('AUTH')}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-slate-700 shadow-2xs hover:bg-white"
            >
              ☁️ Google Cloud
            </button>
          </div>
        </header>

        <div className="mt-2 grid min-w-0 grid-cols-2 gap-2 sm:mt-3 sm:gap-2.5">
          {TARGET_OPTIONS.map(lang => {
            const meta = LANGUAGES[lang];
            const isSelected = targetLanguages.includes(lang);

            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleTargetLanguage(lang)}
                aria-pressed={isSelected}
                className={`relative flex min-w-0 items-center gap-2 rounded-xl border-2 p-2.5 text-left transition-colors sm:gap-3 sm:p-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-white shadow-sm ring-2 ring-emerald-300/50'
                    : 'border-white/80 bg-white/70 hover:bg-white/90'
                }`}
              >
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl shadow-2xs sm:h-11 sm:w-11 sm:text-2xl">
                  {meta.flag}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-black text-slate-900 sm:text-base">{meta.name}</span>
                  <span className="block break-words text-[11px] font-bold leading-tight text-slate-500 sm:text-xs">{meta.nativeName}</span>
                </div>

                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}>
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex flex-row gap-2 sm:mt-3 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setScreen('NATIVE_LANG_SETUP')}
            className="flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-xl bg-white px-2.5 text-sm font-black leading-tight text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 sm:gap-1.5 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" /> {copy.back}
          </button>
          <button
            type="button"
            onClick={startAdventure}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-500 px-2 text-sm font-black leading-tight text-white shadow-[0_4px_0_#1e6b37] transition-colors hover:brightness-105 active:brightness-95 sm:gap-2 sm:px-4 sm:text-base"
          >
            {copy.start} 🚀 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
