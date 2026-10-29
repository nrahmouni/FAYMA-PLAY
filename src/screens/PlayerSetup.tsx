import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Cake, Minus, Plus, Sparkles, Users, X } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';

const PLAYER_COLORS = ['#0f9f6e', '#f97316', '#ec4899', '#6366f1'];
const ROUND_OPTIONS = [1, 3, 5];

export const ANIMAL_AVATARS = [
  { emoji: '🦊', name: 'Zorrito' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐯', name: 'Tigre' },
  { emoji: '🦄', name: 'Unicornio' },
  { emoji: '🐸', name: 'Ranita' },
  { emoji: '🐶', name: 'Perrito' },
  { emoji: '🐱', name: 'Gatito' },
  { emoji: '🦁', name: 'León' },
  { emoji: '🐘', name: 'Elefante' },
  { emoji: '🐰', name: 'Conejito' },
  { emoji: '🐵', name: 'Monito' },
  { emoji: '🐻', name: 'Osito' },
  { emoji: '🐧', name: 'Pingüino' },
  { emoji: '🐬', name: 'Delfín' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🦉', name: 'Búho' },
  { emoji: '🦒', name: 'Jirafa' },
  { emoji: '🐝', name: 'Abejita' },
  { emoji: '🦋', name: 'Mariposa' },
  { emoji: '🐢', name: 'Tortuga' },
  { emoji: '🐙', name: 'Pulpo' },
  { emoji: '🦩', name: 'Flamenco' },
];

export const PlayerSetup: React.FC = () => {
  const profiles = useProfileStore(state => state.profiles);
  const addLocalPlayer = useProfileStore(state => state.addLocalPlayer);
  const removePlayer = useProfileStore(state => state.removePlayer);
  const updateProfile = useProfileStore(state => state.updateProfile);
  const updateLocalAvatar = useProfileStore(state => state.updateLocalAvatar);
  const updatePlayerAge = useProfileStore(state => state.updatePlayerAge);
  const totalRounds = useGameStore(state => state.totalRounds);
  const setTotalRounds = useGameStore(state => state.setTotalRounds);
  const setScreen = useGameStore(state => state.setScreen);
  const { unlockAudio } = useSound();

  const [names, setNames] = useState<Record<string, string>>({});
  const [selectingAvatarPlayerId, setSelectingAvatarPlayerId] = useState<string | null>(null);

  useEffect(() => {
    setNames(current => Object.fromEntries(profiles.map(profile => [
      profile.uid,
      current[profile.uid] ?? profile.displayName,
    ])));
  }, [profiles]);

  const addPlayer = () => {
    const avatar = ANIMAL_AVATARS[profiles.length % ANIMAL_AVATARS.length].emoji;
    const player = addLocalPlayer(`Jugador ${profiles.length + 1}`, PLAYER_COLORS[profiles.length % PLAYER_COLORS.length], avatar, 6);
    setNames(current => ({ ...current, [player.uid]: '' }));
  };

  const continueToLanguages = () => {
    unlockAudio();
    profiles.forEach((profile, index) => {
      const displayName = names[profile.uid]?.trim() || `Jugador ${index + 1}`;
      if (displayName !== profile.displayName) {
        updateProfile({ ...profile, displayName });
      }
    });
    setScreen('NATIVE_LANG_SETUP');
  };

  const handleSelectAnimal = (emoji: string) => {
    if (selectingAvatarPlayerId) {
      updateLocalAvatar(selectingAvatarPlayerId, emoji);
      setSelectingAvatarPlayerId(null);
    }
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-2xl flex-col items-center justify-center px-3 py-2 sm:px-4 sm:py-4 overflow-hidden">
      <section className="w-full rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-yellow-200 via-rose-100 to-sky-200 p-4 shadow-[0_20px_50px_rgba(36,107,253,.16)] sm:p-6 flex flex-col justify-between">
        <header className="text-center">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">🎈</span>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-black text-violet-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Paso 1 de 3 · Jugadores
          </div>
          <h1 className="mt-1.5 text-2xl font-black text-slate-900 sm:text-3xl">¿Quién juega hoy?</h1>
          <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
            Escribid el nombre, animalito y edad de cada niño (1 a 13 años).
          </p>
        </header>

        <div className="mt-3 space-y-2.5 max-h-[38vh] overflow-y-auto pr-1">
          {profiles.map((profile, index) => {
            const currentAge = profile.age ?? 6;
            return (
              <motion.div
                key={profile.uid}
                layout
                className="rounded-xl border-2 border-white bg-white/95 p-3 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectingAvatarPlayerId(profile.uid)}
                    aria-label={`Cambiar animal para ${names[profile.uid] || `jugador ${index + 1}`}`}
                    className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-3xl shadow-xs ring-2 ring-amber-300/60 transition hover:scale-105"
                  >
                    <span>{profile.avatarUrl || '🦊'}</span>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] text-white">
                      ✏️
                    </span>
                  </button>

                  <div className="min-w-0 flex-1">
                    <input
                      value={names[profile.uid] ?? ''}
                      onChange={event => setNames(current => ({ ...current, [profile.uid]: event.target.value }))}
                      maxLength={18}
                      autoComplete="off"
                      placeholder={`Nombre del jugador ${index + 1}`}
                      aria-label={`Nombre del jugador ${index + 1}`}
                      className="min-h-11 w-full rounded-xl border-2 border-sky-100 bg-sky-50 px-3.5 text-base font-extrabold text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400"
                    />
                  </div>

                  {profiles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlayer(profile.uid)}
                      aria-label={`Quitar jugador ${index + 1}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 px-1">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                    <Cake className="h-3.5 w-3.5 text-violet-600" /> Edad:
                  </span>
                  <div className="flex items-center gap-2 rounded-xl bg-violet-50/80 px-2.5 py-1">
                    <button
                      type="button"
                      onClick={() => updatePlayerAge(profile.uid, Math.max(1, currentAge - 1))}
                      aria-label="Restar edad"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-violet-800 font-black shadow-xs hover:bg-violet-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-16 text-center text-xs font-black text-slate-900">
                      {currentAge} {currentAge === 1 ? 'año' : 'años'}
                    </span>
                    <button
                      type="button"
                      onClick={() => updatePlayerAge(profile.uid, Math.min(13, currentAge + 1))}
                      aria-label="Sumar edad"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-violet-800 font-black shadow-xs hover:bg-violet-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {profiles.length < 4 && (
          <button
            type="button"
            onClick={addPlayer}
            className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/80 px-3 text-xs font-black text-emerald-800 hover:bg-emerald-100"
          >
            <Plus className="h-4 w-4" /> Añadir jugador
          </button>
        )}

        <div className="mt-2 rounded-xl bg-white/80 p-2 sm:p-2.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-slate-900">
            <Users className="h-4 w-4 text-violet-600" /> ¿Cuántas rondas jugamos?
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ROUND_OPTIONS.map(round => (
              <button
                key={round}
                type="button"
                onClick={() => setTotalRounds(round)}
                aria-pressed={totalRounds === round}
                className={`min-h-10 rounded-xl border-2 text-center transition ${
                  totalRounds === round
                    ? 'border-violet-400 bg-violet-100 text-violet-900 shadow-xs'
                    : 'border-slate-100 bg-white text-slate-700 hover:border-violet-200'
                }`}
              >
                <span className="text-xs font-black">{round} {round === 1 ? 'ronda' : 'rondas'}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={continueToLanguages}
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 px-4 text-base font-black text-white shadow-[0_4px_0_#287b42] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
        >
          Siguiente: Idiomas de casa <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      {/* Animal Avatar Picker Modal */}
      {selectingAvatarPlayerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm">
          <section className="w-full max-w-md max-h-[90vh] flex flex-col rounded-[2rem] border-4 border-white bg-white p-4 shadow-2xl sm:p-6">
            <header className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">Elige tu animal 🐾</h2>
                <p className="text-xs font-bold text-slate-500">Haz clic en el animal que quieras para tu foto de perfil</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectingAvatarPlayerId(null)}
                aria-label="Cerrar modal de animales"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-3 p-1">
              {ANIMAL_AVATARS.map(animal => (
                <button
                  key={animal.emoji}
                  type="button"
                  onClick={() => handleSelectAnimal(animal.emoji)}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-amber-50/50 p-2 text-center transition hover:scale-110 hover:border-amber-300 hover:bg-amber-100 active:scale-95"
                >
                  <span className="text-3xl">{animal.emoji}</span>
                  <span className="mt-1 text-[10px] font-black text-slate-700 truncate w-full">{animal.name}</span>
                </button>
              ))}
            </div>

            <footer className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setSelectingAvatarPlayerId(null)}
                className="min-h-11 w-full rounded-2xl bg-slate-100 text-xs font-extrabold text-slate-700 hover:bg-slate-200"
              >
                Cerrar
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
};
