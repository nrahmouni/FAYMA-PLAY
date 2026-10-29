import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Globe2, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { NativeLanguage } from '../types';
import { useGameStore } from '../store/gameStore';

const NATIVE_OPTIONS: NativeLanguage[] = ['es', 'ar', 'fr', 'nl-BE', 'en'];

export const NativeLangSetup: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);
  const nativeLanguages = useGameStore(state => state.nativeLanguages);
  const setNativeLanguages = useGameStore(state => state.setNativeLanguages);

  const toggleNativeLanguage = (lang: NativeLanguage) => {
    if (nativeLanguages.includes(lang)) {
      if (nativeLanguages.length === 1) return;
      setNativeLanguages(nativeLanguages.filter(l => l !== lang));
    } else {
      if (nativeLanguages.length >= 2) {
        setNativeLanguages([nativeLanguages[0], lang]);
      } else {
        setNativeLanguages([...nativeLanguages, lang]);
      }
    }
  };

  const continueToTargetLang = () => {
    setScreen('HOME');
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-2xl flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-4 overflow-hidden">
      <section className="w-full rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-sky-100 via-indigo-50 to-pink-100 p-4 shadow-[0_20px_50px_rgba(36,107,253,.16)] sm:p-6 flex flex-col justify-between">
        <header className="text-center">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🏠</span>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-black text-indigo-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Paso 2 de 3 · Idioma de origen
          </div>
          <h1 className="mt-1.5 text-2xl font-black text-slate-900 sm:text-3xl">¿Qué idioma(s) habláis en casa?</h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
            Elegid 1 o 2 idiomas nativos o de apoyo para las explicaciones.
          </p>
        </header>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[42vh] overflow-y-auto pr-1">
          {NATIVE_OPTIONS.map((lang, index) => {
            const meta = LANGUAGES[lang];
            const isSelected = nativeLanguages.includes(lang);

            return (
              <motion.button
                key={lang}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleNativeLanguage(lang)}
                className={`relative flex items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                  isSelected
                    ? 'border-indigo-500 bg-white shadow-sm ring-2 ring-indigo-300/50'
                    : 'border-white/80 bg-white/70 hover:bg-white/90'
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl shadow-xs">
                  {meta.flag}
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block text-base font-black text-slate-900">{meta.name}</span>
                  <span className="block text-xs font-bold text-slate-500">{meta.nativeName}</span>
                </div>

                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}>
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl bg-white/80 p-2 text-center text-xs font-black text-indigo-900 border border-indigo-100 flex items-center justify-center gap-1.5">
          <Globe2 className="h-4 w-4 text-indigo-600 shrink-0" />
          <span className="truncate">Seleccionados: {nativeLanguages.map(l => LANGUAGES[l].name).join(' y ')} {nativeLanguages.length === 2 ? '(Bilingüe)' : ''}</span>
        </div>

        <div className="mt-3 flex flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setScreen('PLAYER_SETUP')}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </button>
          <button
            type="button"
            onClick={continueToTargetLang}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-base font-black text-white shadow-[0_4px_0_#3730a3] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
          >
            Siguiente <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
