import React from 'react';
import { motion } from 'motion/react';
import { Play, Lock, CheckCircle, Sparkles, MapPin, Gamepad2, ArrowRight } from 'lucide-react';
import { useGameStore, WorldNode } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { ThemeVocabularyBanner } from '../components/ThemeVocabularyBanner';
import { Language } from '../types';

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
                Mundo de {langMeta.name}
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

      {/* Nodes Map Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-200 font-extrabold text-base">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Niveles y Minijuegos Disponibles</span>
          </div>
          <span className="text-xs text-slate-400">
            {nodes.length} aventuras disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node, index) => {
            return (
              <motion.div
                key={node.id}
                whileHover={{ y: -4 }}
                className="rounded-3xl glass-card p-5 border-2 border-white/10 hover:border-cyan-400/50 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group"
              >
                {/* Node Top */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl select-none p-2 rounded-2xl bg-slate-800/80 border border-white/10">
                      {node.icon}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span
                          key={s}
                          className={`text-xs ${
                            s <= node.minDifficulty ? 'text-amber-400' : 'text-slate-700'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-100 group-hover:text-cyan-300 transition">
                    {node.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-bold mt-1">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Minijuego: {node.gameName}</span>
                  </div>

                  <span className="inline-block mt-2 text-[10px] uppercase font-extrabold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                    Tema: {node.theme}
                  </span>
                </div>

                {/* Node Action CTA */}
                <button
                  type="button"
                  onClick={() => handleSelectNode(node)}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Jugar Este Nivel</span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
