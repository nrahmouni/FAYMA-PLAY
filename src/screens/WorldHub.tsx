import React from 'react';
import { motion } from 'motion/react';
import { Play, Lock, CheckCircle, Sparkles, MapPin, Gamepad2, ArrowRight, Trophy } from 'lucide-react';
import { GameMechanic, useGameStore, WorldNode } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { ThemeVocabularyBanner } from '../components/ThemeVocabularyBanner';
import { Language } from '../types';

const ARCADE_GAMES: { id: GameMechanic; name: string; description: string; icon: string; accent: string }[] = [
  { id: 'drive', name: 'FAYMA RUSH', description: 'Carrera de carriles, turbo y derrapes', icon: '🏎️', accent: 'from-cyan-400 to-blue-600' },
  { id: 'combat', name: 'FAYMA BATTLE', description: 'Arena de acción, esquivas y jefes', icon: '⚔️', accent: 'from-fuchsia-400 to-violet-700' },
  { id: 'fruit', name: 'FAYMA SLICE', description: 'Corta fruta, encadena combos y esquiva bombas', icon: '🍉', accent: 'from-lime-300 to-emerald-600' },
  { id: 'slingshot', name: 'SLINGSHOT ADVENTURE', description: 'Apunta, calcula y derriba estructuras', icon: '🏹', accent: 'from-amber-300 to-orange-600' },
  { id: 'memory', name: 'MEMORY QUEST', description: 'Explora, recuerda y descubre parejas', icon: '🧠', accent: 'from-violet-300 to-indigo-700' },
  { id: 'sentence_builder', name: 'SENTENCE BUILDER', description: 'Construye frases para abrir caminos', icon: '🏗️', accent: 'from-sky-300 to-cyan-700' },
  { id: 'bubble_popper', name: 'BUBBLE POPPER', description: 'Apunta, combina colores y crea cadenas', icon: '🫧', accent: 'from-pink-300 to-purple-700' },
  { id: 'drag_match', name: 'DRIVE CHALLENGE', description: 'Conduce por la ciudad: esquiva tráfico y recoge palabras', icon: '🚗', accent: 'from-rose-300 to-red-700' },
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

  // Theme words preview for this language
  const themeWords = VOCABULARY_BANK.filter(w => w.language === language).slice(0, 6);

  const handleSelectNode = (node: WorldNode) => {
    setActiveWorld(node.theme, node.gameId);
    startSession(profiles);
  };
  const startArcadeGame = (gameId: GameMechanic) => {
    setActiveWorld('arcade', gameId);
    startSession(profiles);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Banner: World Language Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow tint */}
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: langMeta.themeColor }}
        />

        <div className="flex items-center gap-3.5">
          <span className="text-4xl sm:text-5xl select-none filter drop-shadow">
            {langMeta.flag}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
                {language === 'es' ? 'España' : language === 'fr' ? 'Francia' : language === 'ar' ? 'Marruecos' : 'Bélgica'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono border border-cyan-500/20">
                {langMeta.nativeName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mt-0.5">
              {langMeta.description}
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-card border border-white/10 self-start sm:self-auto">
          {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
            const meta = LANGUAGES[langKey];
            const isActive = language === langKey;
            return (
              <button
                key={langKey}
                onClick={() => setLanguage(langKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-400 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{meta.flag}</span>
                <span>{meta.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thematic Vocabulary Quick Preview Banner */}
      <ThemeVocabularyBanner
        words={themeWords}
        title={`Vocabulario Destacado — ${langMeta.name}`}
        themeColor={langMeta.themeColor}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-300">
              <Gamepad2 className="h-4 w-4" /> Selección arcade
            </div>
            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Elige cómo quieres jugar</h2>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs font-bold text-slate-400 sm:block">
            8 juegos · aprendizaje integrado
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ARCADE_GAMES.map((game, index) => (
            <motion.button
              key={game.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              whileHover={{ y: -5, rotateX: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startArcadeGame(game.id)}
              className="fayma-game-card group relative overflow-hidden rounded-2xl border border-white/10 p-4 text-left"
            >
              <span className={`absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${game.accent} opacity-20 blur-2xl transition group-hover:opacity-40`} />
              <div className="relative flex items-start justify-between">
                <span className={`fayma-game-icon bg-gradient-to-br ${game.accent}`}>{game.icon}</span>
                <span className="rounded-full border border-white/10 bg-slate-950/60 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  JUGAR
                </span>
              </div>
              <h3 className="relative mt-4 text-sm font-black tracking-wide text-white">{game.name}</h3>
              <p className="relative mt-1 min-h-10 text-xs leading-5 text-slate-400">{game.description}</p>
              <div className="relative mt-3 flex items-center gap-1 text-[10px] font-bold text-cyan-200">
                <Sparkles className="h-3 w-3" /> Aprende mientras juegas
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Nodes Map Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-200 font-extrabold text-base">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Mapa de aventuras</span>
          </div>
          <span className="text-xs text-slate-400">
            {nodes.filter(n => n.unlocked).length}/{nodes.length} niveles desbloqueados
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 px-4 sm:px-8 py-8">
          <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-1 rounded-full bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-amber-400 opacity-40" />
          <div className="relative z-10 space-y-8 sm:space-y-10">
            {nodes.map((node, index) => {
              const gameNames: Record<string, string> = {
                drive: 'FAYMA RUSH', fruit: 'FAYMA SLICE', combat: 'FAYMA BATTLE',
                slingshot: 'SLINGSHOT ADVENTURE', memory: 'MEMORY QUEST',
                drag_match: 'DRIVE CHALLENGE', sentence_builder: 'SENTENCE BUILDER',
                bubble_popper: 'BUBBLE POPPER'
              };
              const locked = !node.unlocked;
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
                    className={`relative shrink-0 w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-xl transition-transform ${locked ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : node.completed ? 'bg-emerald-500 border-emerald-200 text-white hover:scale-105' : 'bg-gradient-to-br from-cyan-400 to-indigo-600 border-cyan-200 text-white hover:scale-105 active:scale-95'}`}
                  >
                    <span className="text-3xl sm:text-4xl">{node.completed ? '🏆' : locked ? <Lock className="w-6 h-6" /> : node.icon}</span>
                    <span className="text-[9px] font-black uppercase mt-0.5">{node.completed ? 'Completado' : `Nivel ${index + 1}`}</span>
                  </button>
                  <div className={`min-w-0 flex-1 max-w-sm rounded-2xl border p-3 sm:p-4 backdrop-blur ${locked ? 'border-white/5 bg-slate-900/70 opacity-70' : 'border-white/10 bg-slate-900/90 shadow-lg'} ${index % 2 ? 'sm:text-right' : ''}`}>
                    <div className={`flex items-center gap-2 ${index % 2 ? 'sm:flex-row-reverse' : ''}`}>
                      <span className="text-xl">{node.icon}</span>
                      <h3 className="font-black text-sm sm:text-base text-white">{node.name}</h3>
                    </div>
                    <p className="text-xs text-cyan-300 font-bold mt-1">{gameNames[node.gameId] ?? node.gameName}</p>
                    <div className={`flex items-center gap-1.5 mt-2 ${index % 2 ? 'sm:justify-end' : ''}`}>
                      {[1,2,3,4,5].map(star => <span key={star} className={`text-xs ${star <= node.minDifficulty ? 'text-amber-400' : 'text-slate-700'}`}>★</span>)}
                      <span className="text-[10px] text-slate-400 ml-1 uppercase tracking-wide">{node.theme}</span>
                    </div>
                    {!locked && <button type="button" onClick={() => handleSelectNode(node)} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3 py-2 text-xs font-black text-slate-950 transition active:scale-95"><Play className="w-3 h-3 fill-current"/> Jugar nivel <ArrowRight className="w-3 h-3"/></button>}
                    {locked && <p className="mt-2 text-[10px] text-slate-500 font-bold">🔒 Supera el nivel anterior para desbloquearlo</p>}
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
