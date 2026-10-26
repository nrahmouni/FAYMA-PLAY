import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Play, Sparkles } from 'lucide-react';
import { GameMechanic, useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { GAME_COPY } from '../data/gameCopy';
import { MathGameId, MATH_GAME_COPY } from '../data/mathGameCopy';
import { useSound } from '../hooks/useSound';

const GAMES: Array<{ id: GameMechanic; art: string; color: string; icon?: string }> = [
  { id: 'safari', art: '/games/safari.svg', color: 'from-lime-100 to-emerald-100' },
  { id: 'word_train', art: '/games/train.svg', color: 'from-sky-100 to-blue-100' },
  { id: 'garden_match', art: '/games/garden.svg', color: 'from-amber-100 to-pink-100' },
  { id: 'word_picker', art: '/games/balloons.svg', color: 'from-violet-100 to-pink-100' },
  { id: 'sound_echo', art: '/games/echo.svg', color: 'from-fuchsia-100 to-sky-100' },
  { id: 'dino_picnic', art: '/games/dino.svg', color: 'from-lime-100 to-yellow-100' },
  { id: 'line_match', art: '/games/lines.svg', color: 'from-sky-100 to-indigo-100' },
  { id: 'draw_word', art: '/games/draw.svg', color: 'from-teal-100 to-cyan-100' },
  { id: 'letter_puzzle', art: '/games/letters.svg', color: 'from-orange-100 to-rose-100' },
  { id: 'word_sort', art: '/games/sort.svg', color: 'from-lime-100 to-emerald-100' },
  { id: 'comet_dash', art: '', icon: '🚀', color: 'from-indigo-200 to-sky-200' },
  { id: 'cookie_count', art: '', icon: '🍪', color: 'from-amber-200 to-rose-200' },
  { id: 'number_bridge', art: '', icon: '🌉', color: 'from-cyan-200 to-blue-200' },
  { id: 'treasure_trail', art: '', icon: '🗺️', color: 'from-lime-200 to-yellow-200' },
];

const isMathGame = (id: GameMechanic): id is MathGameId =>
  id === 'comet_dash' || id === 'cookie_count' || id === 'number_bridge' || id === 'treasure_trail';

const LEGACY_GAME_COPY_KEYS: Record<Exclude<GameMechanic, MathGameId>, keyof typeof GAME_COPY.es.gameNames> = {
  safari: 'safari',
  word_train: 'train',
  garden_match: 'garden',
  word_picker: 'wordPicker',
  sound_echo: 'soundEcho',
  dino_picnic: 'dinoPicnic',
  line_match: 'lineMatch',
  draw_word: 'drawWord',
  letter_puzzle: 'letterPuzzle',
  word_sort: 'wordSort',
};

export const WorldHub: React.FC = () => {
  const language = useGameStore(state => state.language);
  const setScreen = useGameStore(state => state.setScreen);
  const setActiveWorld = useGameStore(state => state.setActiveWorld);
  const startSession = useGameStore(state => state.startSession);
  const profiles = useProfileStore(state => state.profiles);
  const { unlockAudio } = useSound();
  const meta = LANGUAGES[language];
  const copy = GAME_COPY[language];
  const localizedGames = GAMES.map(game => {
    if (isMathGame(game.id)) {
      const mathCopy = MATH_GAME_COPY[language][game.id];
      return { ...game, name: mathCopy.name, description: mathCopy.description };
    }
    const key = LEGACY_GAME_COPY_KEYS[game.id];
    return { ...game, name: copy.gameNames[key], description: copy.gameDescriptions[key] };
  });

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
              {game.icon
                ? <span className="flex h-24 w-24 items-center justify-center text-6xl transition-transform duration-300 group-hover:scale-110 sm:h-36 sm:w-full sm:text-8xl lg:h-44" aria-hidden="true">{game.icon}</span>
                : <img src={game.art} alt="" className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-full lg:h-44" />}
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
