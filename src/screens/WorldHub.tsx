import React from 'react';
import { motion } from 'motion/react';
import { Play, Lock, MapPin, Gamepad2, ArrowRight, Sparkles } from 'lucide-react';
import { GameMechanic, useGameStore, WorldNode } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { ThemeVocabularyBanner } from '../components/ThemeVocabularyBanner';
import { Language } from '../types';

const ARCADE_GAMES: { id: GameMechanic; name: string; description: string; icon: string; accent: string }[] = [
  { id: 'drive', name: 'FAYMA RUSH', description: 'Viaja por la ciudad aprendiendo palabras en movimiento', icon: '🚗', accent: 'from-cyan-400 to-blue-600' },
  { id: 'memory', name: 'MEMORY QUEST', description: 'Encuentra parejas de palabras e imágenes para memorizar', icon: '🧠', accent: 'from-violet-400 to-indigo-700' },
  { id: 'sentence_builder', name: 'SENTENCE BUILDER', description: 'Construye frases útiles para cada aventura', icon: '🏗️', accent: 'from-sky-400 to-cyan-700' },
  { id: 'bubble_popper', name: 'BUBBLE POPPER', description: 'Pica burbujas con la respuesta correcta y crea cadenas', icon: '🫧', accent: 'from-pink-400 to-violet-700' },
];

export const WorldHub: React.FC = () => {
  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);
  const worldNodes = useGameStore(s => s.worldNodes);
  const setActiveWorld = useGameStore(s => s.setActiveWorld);
  const startSession = useGameStore(s => s.startSession);
  const profiles = useProfileStore(s => s.profiles);

  const langMeta = LANGUAGES[language];
  const nodes = worldNodes[language] || [];
  const themeWords = VOCABULARY_BANK.filter(w => w.language === language).slice(0, 6);

  const handleSelectNode = (node: WorldNode) => {
    setActiveWorld(node.theme, node.gameId, node.id, node.minDifficulty);
    startSession(profiles);
  };

  const startArcadeGame = (gameId: GameMechanic) => {
    setActiveWorld('arcade', gameId);
    startSession(profiles);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:py-8">
      <div className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-[2rem] border border-indigo-200 bg-white/70 p-5 shadow-[0_24px_60px_rgba(59,130,246,0.14)] backdrop-blur-xl sm:flex-row sm:items-center">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: langMeta.themeColor }}
        />

        <div className="relative flex items-center gap-3.5">
          <span className="text-4xl sm:text-5xl">{langMeta.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{langMeta.country}</h1>
              <span className="rounded-full border border-indigo-200 bg-white/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[.18em] text-indigo-700">
                {langMeta.nativeName}
              </span>
            </div>
            <p className="mt-0.5 max-w-lg text-xs text-slate-600 sm:text-sm">{langMeta.description}</p>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 self-start rounded-2xl border border-indigo-200 bg-white/80 p-1 sm:self-auto">
          {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
            const meta = LANGUAGES[langKey];
            const isActive = language === langKey;
            return (
              <button
                key={langKey}
                onClick={() => setLanguage(langKey)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
                  isActive ? 'border border-indigo-200 bg-gradient-to-r from-sky-100 to-pink-100 text-slate-900 shadow-md' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span>{meta.flag}</span>
                <span>{meta.country}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ThemeVocabularyBanner
        words={themeWords}
        title={`Vocabulario destacado · ${langMeta.name}`}
        themeColor={langMeta.themeColor}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-indigo-700">
              <Gamepad2 className="h-4 w-4" /> Modo aventura
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Cuatro mini-juegos. Una gran misión.</h2>
          </div>
          <span className="hidden rounded-full border border-indigo-200 bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-slate-600 sm:block">
            4 experiencias premium
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ARCADE_GAMES.map((game, index) => (
            <motion.button
              key={game.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5, rotateX: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startArcadeGame(game.id)}
              className="fayma-game-card group relative overflow-hidden rounded-2xl border border-indigo-200 p-4 text-left"
            >
              <span className={`absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${game.accent} opacity-20 blur-2xl transition group-hover:opacity-40`} />
              <div className="relative flex items-start justify-between">
                <span className={`fayma-game-icon bg-gradient-to-br ${game.accent}`}>{game.icon}</span>
                <span className="rounded-full border border-indigo-200 bg-white/80 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-600">
                  JUGAR
                </span>
              </div>
              <h3 className="relative mt-4 text-sm font-black tracking-wide text-slate-900">{game.name}</h3>
              <p className="relative mt-1 min-h-10 text-xs leading-5 text-slate-600">{game.description}</p>
              <div className="relative mt-3 flex items-center gap-1 text-[10px] font-bold text-indigo-700">
                <Sparkles className="h-3 w-3" /> Aprende mientras juegas
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-base font-extrabold text-slate-800">
            <MapPin className="h-4 w-4 text-indigo-600" />
            <span>Mapa del viaje</span>
          </div>
          <span className="text-xs text-slate-600">
            {nodes.filter(n => n.unlocked).length}/{nodes.length} rutas desbloqueadas
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-indigo-200 bg-white/60 px-4 py-8 sm:px-8">
          <div className="absolute inset-y-8 left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-400 via-indigo-500 to-pink-400 opacity-40" />
          <div className="relative z-10 space-y-8 sm:space-y-10">
            {nodes.map((node, index) => {
              const locked = !node.unlocked;
              const gameNames: Record<string, string> = {
                drive: 'FAYMA RUSH',
                memory: 'MEMORY QUEST',
                sentence_builder: 'SENTENCE BUILDER',
                bubble_popper: 'BUBBLE POPPER',
              };

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className={`flex items-center gap-3 sm:gap-5 ${index % 2 ? 'sm:flex-row-reverse' : ''}`}
                >
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => handleSelectNode(node)}
                    aria-label={`${node.name}${locked ? ', bloqueado' : ', jugar'}`}
                    className={`relative h-[76px] w-[76px] shrink-0 rounded-full border-4 shadow-xl transition-transform sm:h-24 sm:w-24 ${locked ? 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500' : node.completed ? 'border-emerald-200 bg-gradient-to-br from-emerald-400 to-green-500 text-white hover:scale-105' : 'border-cyan-200 bg-gradient-to-br from-cyan-400 to-indigo-600 text-white hover:scale-105 active:scale-95'}`}
                  >
                    <span className="text-3xl sm:text-4xl">{node.completed ? '🏆' : locked ? <Lock className="h-6 w-6" /> : node.icon}</span>
                    <span className="mt-0.5 text-[9px] font-black uppercase">{node.completed ? 'Listo' : `Ruta ${index + 1}`}</span>
                  </button>

                  <div className={`min-w-0 flex-1 max-w-sm rounded-2xl border p-3 sm:p-4 backdrop-blur ${locked ? 'border-slate-200 bg-slate-100/80 opacity-80' : 'border-indigo-200 bg-white/80 shadow-lg'} ${index % 2 ? 'sm:text-right' : ''}`}>
                    <div className={`flex items-center gap-2 ${index % 2 ? 'sm:flex-row-reverse' : ''}`}>
                      <span className="text-xl">{node.icon}</span>
                      <h3 className="text-sm font-black text-slate-900 sm:text-base">{node.name}</h3>
                    </div>
                    <p className="mt-1 text-xs font-bold text-indigo-700">{gameNames[node.gameId] ?? node.gameName}</p>
                    <div className={`mt-2 flex items-center gap-1.5 ${index % 2 ? 'sm:justify-end' : ''}`}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-xs ${star <= node.minDifficulty ? 'text-amber-400' : 'text-slate-300'}`}>★</span>
                      ))}
                      <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-500">{node.theme}</span>
                    </div>
                    {!locked && (
                      <button type="button" onClick={() => handleSelectNode(node)} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-3 py-2 text-xs font-black text-white transition active:scale-95">
                        <Play className="h-3 w-3 fill-current" /> Jugar ruta <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    {locked && <p className="mt-2 text-[10px] font-bold text-slate-500">🔒 Completa la ruta anterior para desbloquearla</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
