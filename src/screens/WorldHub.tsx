import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Play, Sparkles } from 'lucide-react';
import { GameMechanic, useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { GAME_COPY } from '../data/gameCopy';
import { useSound } from '../hooks/useSound';

const GAMES: Array<{ id: GameMechanic; emoji: string; art: string; color: string }> = [
  { id: 'safari', emoji: '🦒', art: '/games/safari.svg', color: 'from-lime-100 to-emerald-100' },
  { id: 'word_train', emoji: '🚂', art: '/games/train.svg', color: 'from-sky-100 to-blue-100' },
  { id: 'garden_match', emoji: '🌼', art: '/games/garden.svg', color: 'from-amber-100 to-pink-100' },
  { id: 'word_picker', emoji: '🎈', art: '/games/balloons.svg', color: 'from-violet-100 to-pink-100' },
];

export const WorldHub: React.FC = () => {
  const language = useGameStore(state => state.language);
  const setScreen = useGameStore(state => state.setScreen);
  const setActiveWorld = useGameStore(state => state.setActiveWorld);
  const startSession = useGameStore(state => state.startSession);
  const profiles = useProfileStore(state => state.profiles);
  const { unlockAudio } = useSound();
  const meta = LANGUAGES[language];
  const copy = GAME_COPY[language];
  const localizedGames = GAMES.map(game => ({
    ...game,
    name: game.id === 'safari'
      ? copy.gameNames.safari
      : game.id === 'word_train'
        ? copy.gameNames.train
        : game.id === 'garden_match'
          ? copy.gameNames.garden
          : copy.gameNames.wordPicker,
    description: game.id === 'safari'
      ? copy.gameDescriptions.safari
      : game.id === 'word_train'
        ? copy.gameDescriptions.train
        : game.id === 'garden_match'
          ? copy.gameDescriptions.garden
          : copy.gameDescriptions.wordPicker,
  }));

  const playGame = (gameId: GameMechanic) => {
    unlockAudio();
    setActiveWorld('arcade', gameId);
    startSession(profiles);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-5 sm:px-8 sm:py-8">
      <button
        type="button"
        onClick={() => setScreen('HOME')}
        className="mb-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-700 transition hover:bg-white/80"
      >
        <ArrowLeft className="h-4 w-4" /> {copy.changeFlag}
      </button>

      <header className="mb-6 flex items-center gap-4 rounded-[2rem] border-4 border-white bg-gradient-to-r from-yellow-50 via-white to-sky-50 p-4 shadow-sm sm:mb-8 sm:p-6">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-5xl shadow-sm sm:h-20 sm:w-20 sm:text-6xl" aria-hidden="true">
          {meta.flag}
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700">{copy.welcome} {profiles.map(profile => profile.displayName).join(copy.joiner)}</span>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-4xl">
            {copy.chooseGame}
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">{copy.place} · {meta.nativeName}</p>
        </div>
        <span className="hidden text-4xl sm:block" aria-hidden="true">🎈</span>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={`${copy.gamesIn} ${meta.nativeName}`}>
        {localizedGames.map((game, index) => (
          <motion.button
            key={game.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => playGame(game.id)}
            className="group flex items-center gap-3 overflow-hidden rounded-[1.5rem] border-4 border-white bg-white p-2.5 text-left shadow-[0_5px_0_rgba(71,85,105,.1),0_12px_24px_rgba(71,85,105,.08)] transition sm:block sm:rounded-[2rem] sm:p-4"
          >
            <div className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${game.color}`}>
              <img src={game.art} alt="" className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-full lg:h-44" />
              <span className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm shadow-sm sm:right-3 sm:top-3 sm:h-11 sm:w-11 sm:text-xl" aria-hidden="true">{game.emoji}</span>
            </div>
            <div className="min-w-0 flex-1 sm:block">
              <h2 className="text-base font-black leading-tight text-slate-900 sm:mt-4 sm:text-xl">{game.name}</h2>
              <p className="mt-1 hidden min-h-12 text-sm leading-6 text-slate-600 sm:block">{game.description}</p>
            <span className="mt-2 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-black text-white shadow-[0_3px_0_#328248] transition group-hover:bg-emerald-600 group-active:translate-y-1 group-active:shadow-none sm:mt-3 sm:min-h-12 sm:rounded-2xl sm:text-base">
              <Play className="h-5 w-5 fill-current" /> {copy.play}
            </span>
            </div>
          </motion.button>
        ))}
      </section>

      {language === 'nl-BE' && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setScreen('LEARN_FLEMISH')}
          className="mt-5 flex min-h-20 items-center gap-4 rounded-[1.75rem] border-4 border-white bg-gradient-to-r from-yellow-100 via-lime-50 to-emerald-100 p-4 text-left shadow-sm transition hover:-translate-y-1 sm:p-5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm" aria-hidden="true">🦁</span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-black text-slate-900">{copy.learn}</span>
            <span className="mt-0.5 block text-sm font-semibold text-slate-600">{copy.learnDescription}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm" aria-hidden="true">
            <BookOpen className="h-5 w-5" />
          </span>
        </motion.button>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-500">
        <Sparkles className="h-4 w-4 text-amber-500" /> {profiles.length} {profiles.length === 1 ? copy.player : copy.players} · {copy.turnsNote}
      </div>
    </main>
  );
};
