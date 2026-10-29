import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronDown, ChevronUp, Play, Sparkles } from 'lucide-react';
import { GameMechanic, useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { GAME_COPY } from '../data/gameCopy';
import { MathGameId, MATH_GAME_COPY } from '../data/mathGameCopy';
import { LearningGameId, LEARNING_GAME_COPY } from '../data/learningGameCopy';
import { useSound } from '../hooks/useSound';
import { Language } from '../types';
import { OriginalGames } from '../games/OriginalGames';

const GAMES: Array<{ id: GameMechanic; art: string; color: string; icon?: string }> = [
  { id: 'safari', art: '/games/safari.png', color: 'from-lime-200 to-emerald-200' },
  { id: 'word_train', art: '/games/train.png', color: 'from-sky-200 to-blue-200' },
  { id: 'garden_match', art: '/games/garden.png', color: 'from-amber-200 to-pink-200' },
  { id: 'word_picker', art: '/games/balloons.png', color: 'from-violet-200 to-pink-200' },
  { id: 'sound_echo', art: '/games/echo.png', color: 'from-fuchsia-200 to-sky-200' },
  { id: 'dino_picnic', art: '/games/dino.png', color: 'from-lime-200 to-yellow-200' },
  { id: 'line_match', art: '/games/lines.png', color: 'from-sky-200 to-indigo-200' },
  { id: 'draw_word', art: '/games/draw.png', color: 'from-teal-200 to-cyan-200' },
  { id: 'letter_puzzle', art: '/games/letters.png', color: 'from-orange-200 to-rose-200' },
  { id: 'word_sort', art: '/games/sort.png', color: 'from-lime-200 to-emerald-200' },
  { id: 'comet_dash', art: '/games/comet.png', color: 'from-indigo-300 to-sky-300' },
  { id: 'cookie_count', art: '/games/cookies.png', color: 'from-amber-300 to-rose-300' },
  { id: 'number_bridge', art: '/games/number-bridge.png', color: 'from-cyan-300 to-blue-300' },
  { id: 'treasure_trail', art: '/games/treasure.png', color: 'from-lime-300 to-yellow-300' },
  { id: 'body_detective', art: '/games/body.png', color: 'from-rose-300 to-pink-300' },
  { id: 'habitat_rescue', art: '/games/habitat.png', color: 'from-lime-200 to-emerald-200' },
  { id: 'space_explorer', art: '/games/space.png', color: 'from-indigo-300 to-violet-300' },
  { id: 'eco_mission', art: '/games/eco.png', color: 'from-emerald-300 to-cyan-300' },
];

const isMathGame = (id: GameMechanic): id is MathGameId =>
  id === 'comet_dash' || id === 'cookie_count' || id === 'number_bridge' || id === 'treasure_trail';

const isLearningGame = (id: GameMechanic): id is LearningGameId =>
  id === 'body_detective' || id === 'habitat_rescue' || id === 'space_explorer' || id === 'eco_mission';

const LEGACY_GAME_COPY_KEYS: Record<Exclude<GameMechanic, MathGameId | LearningGameId>, keyof typeof GAME_COPY.es.gameNames> = {
  unified_lesson: 'safari',
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

type GameSubject = 'all' | 'words' | 'math' | 'body' | 'animals' | 'space' | 'environment';

const SUBJECT_LABELS: Record<Language, Record<GameSubject, string>> = {
  es: { all: 'Todos', words: 'Palabras', math: 'Mates', body: 'Cuerpo', animals: 'Animales', space: 'Espacio', environment: 'Naturaleza' },
  'nl-BE': { all: 'Alle', words: 'Woorden', math: 'Wiskunde', body: 'Lichaam', animals: 'Dieren', space: 'Ruimte', environment: 'Natuur' },
  fr: { all: 'Tout', words: 'Mots', math: 'Maths', body: 'Corps', animals: 'Animaux', space: 'Espace', environment: 'Nature' },
  ar: { all: 'الكل', words: 'الكلمات', math: 'الرياضيات', body: 'الجسم', animals: 'الحيوانات', space: 'الفضاء', environment: 'الطبيعة' },
  en: { all: 'All', words: 'Words', math: 'Maths', body: 'Body', animals: 'Animals', space: 'Space', environment: 'Nature' },
};

const GAME_SUBJECT: Record<GameMechanic, Exclude<GameSubject, 'all'>> = {
  unified_lesson: 'words',
  safari: 'words',
  word_train: 'words',
  garden_match: 'words',
  word_picker: 'words',
  sound_echo: 'words',
  dino_picnic: 'words',
  line_match: 'words',
  draw_word: 'words',
  letter_puzzle: 'words',
  word_sort: 'words',
  comet_dash: 'math',
  cookie_count: 'math',
  number_bridge: 'math',
  treasure_trail: 'math',
  body_detective: 'body',
  habitat_rescue: 'animals',
  space_explorer: 'space',
  eco_mission: 'environment',
};

const SECTION_LABELS: Record<Language, { learning: string; free: string }> = {
  es: { learning: 'Aprendizaje', free: 'Juegos libres' },
  'nl-BE': { learning: 'Leren', free: 'Vrij' },
  fr: { learning: 'Apprentissage', free: 'Libre' },
  ar: { learning: 'تعلم', free: 'ألعاب حرة' },
  en: { learning: 'Learning', free: 'Free Play' },
};

export const WorldHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<GameSubject>('all');
  const [activeSection, setActiveSection] = useState<'learning' | 'free'>('learning');
  const [learningPage, setLearningPage] = useState(0);

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
    if (isLearningGame(game.id)) {
      const learningCopy = LEARNING_GAME_COPY[language][game.id];
      return { ...game, name: learningCopy.name, description: learningCopy.description };
    }
    const key = LEGACY_GAME_COPY_KEYS[game.id];
    return { ...game, name: copy.gameNames[key], description: copy.gameDescriptions[key] };
  });

  const visibleGames = localizedGames.filter(
    game => activeSubject === 'all' || GAME_SUBJECT[game.id] === activeSubject,
  );

  const ITEMS_PER_PAGE = 4;
  const totalLearningPages = Math.ceil(visibleGames.length / ITEMS_PER_PAGE);
  const currentLearningGames = visibleGames.slice(learningPage * ITEMS_PER_PAGE, (learningPage + 1) * ITEMS_PER_PAGE);

  const prevLearningSlide = () => {
    if (learningPage > 0) setLearningPage(p => p - 1);
  };

  const nextLearningSlide = () => {
    if (learningPage < totalLearningPages - 1) setLearningPage(p => p + 1);
  };

  const playGame = (gameId: GameMechanic) => {
    unlockAudio();
    setActiveWorld('arcade', gameId);
    startSession(profiles);
  };

  return (
    <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-3xl flex-col justify-between px-3 py-2 overflow-hidden">
      {/* Unified Ultra-Compact Header */}
      <header className="flex items-center justify-between gap-2 rounded-2xl border-3 border-white bg-gradient-to-r from-yellow-100 via-white to-sky-100 p-2 shadow-xs shrink-0">
        <button
          type="button"
          onClick={() => setScreen('HOME')}
          className="inline-flex min-h-8 items-center gap-1 rounded-xl bg-white px-2.5 text-xs font-black text-slate-700 shadow-2xs hover:bg-slate-50 transition shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {meta.flag} Cambiar
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {(['learning', 'free'] as const).map(section => (
            <button
              key={section}
              type="button"
              aria-pressed={activeSection === section}
              onClick={() => {
                setActiveSection(section);
                setLearningPage(0);
              }}
              className={`min-h-8 rounded-xl px-2.5 text-xs font-black transition ${
                activeSection === section
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-700 hover:bg-white'
              }`}
            >
              {section === 'learning' ? '📚' : '🎮'} {SECTION_LABELS[language][section]}
            </button>
          ))}
        </div>
      </header>

      {activeSection === 'free' ? (
        <div className="flex-1 flex flex-col justify-center w-full">
          <OriginalGames language={language} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between w-full my-1.5">
          <div className="flex items-center justify-between gap-1.5 shrink-0">
            <nav className="flex gap-1 overflow-x-auto pb-0.5 no-scrollbar min-w-0 flex-1" aria-label="Filtro de asignaturas">
              {(['all', 'words', 'math', 'body', 'animals', 'space', 'environment'] as const).map(subject => (
                <button
                  key={subject}
                  type="button"
                  aria-pressed={activeSubject === subject}
                  onClick={() => {
                    setActiveSubject(subject);
                    setLearningPage(0);
                  }}
                  className={`min-h-7 shrink-0 rounded-lg border-2 px-2 text-[11px] font-black transition ${
                    activeSubject === subject
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
                      : 'border-white bg-white/90 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  {subject === 'all' ? '🎮' : subject === 'words' ? '📚' : subject === 'math' ? '🔢' : subject === 'body' ? '🫀' : subject === 'animals' ? '🐾' : subject === 'space' ? '🚀' : '🌱'} {SUBJECT_LABELS[language][subject]}
                </button>
              ))}
            </nav>

            {/* Up / Down Slide Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={prevLearningSlide}
                disabled={learningPage === 0}
                aria-label="Anterior"
                className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition ${
                  learningPage === 0 ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-white bg-white text-slate-700 shadow-2xs hover:bg-slate-50'
                }`}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextLearningSlide}
                disabled={learningPage >= totalLearningPages - 1}
                aria-label="Siguiente"
                className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition ${
                  learningPage >= totalLearningPages - 1 ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-white bg-white text-slate-700 shadow-2xs hover:bg-slate-50'
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 grid-rows-2 gap-2.5 flex-1 my-1">
            {currentLearningGames.map(game => (
              <motion.button
                key={game.id}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playGame(game.id)}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border-3 border-white bg-white p-3 text-left shadow-xs transition h-full w-full"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${game.color}`}>
                    {game.icon
                      ? <span className="text-3xl" aria-hidden="true">{game.icon}</span>
                      : <img src={game.art} alt="" className="h-11 w-11 object-contain" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-black leading-tight text-slate-900 line-clamp-2">{game.name}</h2>
                  </div>
                </div>
                <span className="mt-1 flex min-h-8 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-xs font-black text-white shadow-[0_2px_0_#287b42] transition group-hover:bg-emerald-700 w-full">
                  <Play className="h-3.5 w-3.5 fill-current" /> {copy.play}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1 shrink-0">
            <span>Página {learningPage + 1} de {totalLearningPages}</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-500" /> {profiles.length} {copy.player}</span>
          </div>
        </div>
      )}
    </main>
  );
};
