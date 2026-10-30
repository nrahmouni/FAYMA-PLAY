import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Wand2, Gamepad2, Volume2, ShieldCheck, Zap } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useSound } from '../hooks/useSound';

const TARGET_OPTIONS: {
  code: Language;
  tagline: string;
  badge: string;
  color: string;
  accentBg: string;
}[] = [
  {
    code: 'en',
    tagline: '¡Aprende inglés jugando misiones arcade y descubriendo imágenes mágicas con IA!',
    badge: '¡El más popular!',
    color: '#3b82f6',
    accentBg: 'from-blue-500 to-indigo-600',
  },
  {
    code: 'nl-BE',
    tagline: '¡Descubre el neerlandés y flamenco con aventuras y animales simpáticos!',
    badge: '¡Especial Flandes!',
    color: '#f97316',
    accentBg: 'from-amber-500 to-orange-600',
  },
  {
    code: 'es',
    tagline: '¡Español divertido con juegos de reflejos, globos y vocabulario ilustrado!',
    badge: '¡Súper divertido!',
    color: '#10b981',
    accentBg: 'from-emerald-500 to-teal-600',
  },
  {
    code: 'fr',
    tagline: '¡Aprende francés con retos rápidos de palabras y pronunciación clara!',
    badge: '¡Aventura mágica!',
    color: '#8b5cf6',
    accentBg: 'from-violet-500 to-purple-600',
  },
  {
    code: 'ar',
    tagline: '¡Aprende las palabras y letras del árabe con sonidos y soporte bilingüe!',
    badge: '¡Bilingüe!',
    color: '#06b6d4',
    accentBg: 'from-cyan-500 to-teal-600',
  },
];

export const TargetLangSetup: React.FC = () => {
  const currentLanguage = useGameStore(state => state.language);
  const setLanguage = useGameStore(state => state.setLanguage);
  const setScreen = useGameStore(state => state.setScreen);
  const completeSetup = useGameStore(state => state.completeSetup);
  const activePlayer = useProfileStore(state => state.getActivePlayer());
  const { playSuccess, unlockAudio } = useSound();

  const [selectedLang, setSelectedLang] = useState<Language>(currentLanguage || 'en');

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleStartAdventure = () => {
    unlockAudio();
    playSuccess();
    setLanguage(selectedLang);
    completeSetup();
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-2xl flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-4 overflow-hidden">
      <section className="w-full rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-indigo-100 via-sky-50 to-emerald-100 p-4 shadow-[0_20px_50px_rgba(36,107,253,.18)] sm:p-6 flex flex-col justify-between">
        <header className="text-center">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🎯</span>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-black text-indigo-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Paso 3 de 3 · Idioma a Aprender
          </div>
          <h1 className="mt-1.5 text-2xl font-black text-slate-900 sm:text-3xl">
            ¿Qué idioma aprenderá {activePlayer?.displayName || 'el explorador'}?
          </h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
            Elige el idioma objetivo. ¡Todas las respuestas tendrán imágenes generadas por IA y voz nativa!
          </p>
        </header>

        {/* Language Options Grid */}
        <div className="mt-3 space-y-2 max-h-[38vh] overflow-y-auto pr-1">
          {TARGET_OPTIONS.map(opt => {
            const meta = LANGUAGES[opt.code];
            const isSelected = selectedLang === opt.code;

            return (
              <motion.button
                key={opt.code}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectLanguage(opt.code)}
                className={`relative flex items-center gap-3 w-full rounded-2xl border-2 p-3 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-white shadow-md ring-3 ring-indigo-300/60'
                    : 'border-white/90 bg-white/70 hover:bg-white/95'
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-3xl shadow-xs">
                  {meta.flag}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">{meta.name}</span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-slate-500 line-clamp-1">{opt.tagline}</p>
                </div>

                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* AI & Arcade Highlights banner */}
        <div className="mt-3 rounded-2xl bg-white/90 p-2.5 border border-indigo-200/60 shadow-xs flex items-center justify-around text-center">
          <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold text-[11px]">
            <Wand2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Imágenes con IA</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px]">
            <Gamepad2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Juegos Arcade Rápidos</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-sky-900 font-extrabold text-[11px]">
            <Volume2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Voz Nativa Clara</span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="mt-3 flex flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setScreen('NATIVE_LANG_SETUP')}
            className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </button>
          <button
            type="button"
            onClick={handleStartAdventure}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-500 px-4 text-base font-black text-white shadow-[0_4px_0_#1e6b37] transition hover:brightness-105 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            <Zap className="h-5 w-5 text-yellow-300" />
            <span>¡Entrar al Mundo de Juegos con IA!</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </main>
  );
};
