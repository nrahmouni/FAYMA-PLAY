import React from 'react';
import { motion } from 'motion/react';
import { Gift, LockKeyhole, Users, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

const LANGUAGE_ORDER: Language[] = ['es', 'fr', 'ar', 'nl-BE'];

const FLAG_ART: Record<Language, string> = {
  es: 'from-rose-200 to-orange-200',
  fr: 'from-sky-200 to-blue-200',
  ar: 'from-amber-200 to-orange-200',
  'nl-BE': 'from-yellow-200 to-lime-200',
};

export const HomeScreen: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);
  const setLanguage = useGameStore(state => state.setLanguage);
  const totalRounds = useGameStore(state => state.totalRounds);
  const profiles = useProfileStore(state => state.profiles);
  const [lockedLanguage, setLockedLanguage] = useState<Language | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const chooseLanguage = (language: Language) => {
    if (language !== 'nl-BE') {
      setLockedLanguage(language);
      setPassword('');
      setPasswordError(false);
      return;
    }
    setLanguage(language);
    setScreen('WORLD_HUB');
  };

  const unlockLanguage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== '332233' || !lockedLanguage) {
      setPasswordError(true);
      return;
    }
    setLanguage(lockedLanguage);
    setLockedLanguage(null);
    setPassword('');
    setScreen('WORLD_HUB');
  };

  const closePasswordPrompt = () => {
    setLockedLanguage(null);
    setPassword('');
    setPasswordError(false);
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-5xl flex-col justify-center px-4 py-6 sm:px-8 sm:py-10">
      <header className="mb-6 text-center sm:mb-9">
        <div className="mb-3 text-5xl sm:text-6xl" aria-hidden="true">🌈</div>
        <h1 className="text-3xl font-black text-slate-900 sm:text-5xl">¿Qué idioma aprendemos?</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600 sm:text-lg">¡Hoy aprendemos flamenco! Los otros idiomas necesitan la clave de un adulto.</p>
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
                <span className={`mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 text-xs font-black shadow-sm ${language === 'nl-BE' ? 'bg-white/85 text-slate-700' : 'bg-slate-800/85 text-white'}`}>
                  {language === 'nl-BE'
                    ? <>¡Vamos! <span className="transition-transform group-hover:translate-x-1">→</span></>
                    : <><LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" /> Clave de adulto</>}
                </span>
              </span>
            </motion.button>
          );
        })}
      </section>

      <footer className="mt-7 text-center text-xs font-semibold text-slate-500">
        {profiles.length > 1 ? `${profiles.length} jugadores · ${totalRounds} rondas` : `${totalRounds} rondas · ¡Juega a tu ritmo!`}
      </footer>
      <button
        type="button"
        onClick={() => setScreen('REWARDS')}
        className="mx-auto mt-3 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-bold text-slate-500 transition hover:bg-white/70 hover:text-amber-800"
      >
        <Gift className="h-4 w-4" /> Premios y rangos
      </button>
      {lockedLanguage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="presentation">
          <form
            onSubmit={unlockLanguage}
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-lock-title"
            className="w-full max-w-sm rounded-[2rem] border-4 border-white bg-[#fffdf4] p-6 text-center shadow-2xl sm:p-8"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <LockKeyhole className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 id="language-lock-title" className="mt-4 text-2xl font-black text-slate-900">
              Idioma bloqueado 🔒
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Por ahora toca aprender flamenco. Un adulto puede abrir {LANGUAGES[lockedLanguage].name} con la contraseña.
            </p>
            <label htmlFor="language-password" className="mt-5 block text-left text-sm font-extrabold text-slate-700">
              Contraseña de adulto
            </label>
            <input
              id="language-password"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="off"
              value={password}
              onChange={event => {
                setPassword(event.target.value.replace(/\D/g, '').slice(0, 6));
                setPasswordError(false);
              }}
              aria-invalid={passwordError}
              aria-describedby={passwordError ? 'language-password-error' : undefined}
              className="mt-2 min-h-14 w-full rounded-2xl border-2 border-amber-200 bg-white px-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 outline-none focus:border-emerald-400"
            />
            {passwordError && (
              <p id="language-password-error" role="alert" className="mt-2 text-sm font-bold text-rose-700">
                Esa contraseña no es correcta. ¡Prueba otra vez!
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closePasswordPrompt}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 font-extrabold text-slate-700"
              >
                <X className="h-4 w-4" aria-hidden="true" /> Volver
              </button>
              <button
                type="submit"
                disabled={password.length !== 6}
                className="min-h-12 rounded-2xl bg-emerald-500 px-3 font-black text-white shadow-[0_4px_0_#16834f] disabled:bg-slate-300 disabled:shadow-none"
              >
                Abrir idioma
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
