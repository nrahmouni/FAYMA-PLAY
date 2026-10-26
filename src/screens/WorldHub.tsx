import React from 'react';
import { motion } from 'motion/react';
import { Play, Lock, MapPin, Gamepad2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { GameMechanic, useGameStore, WorldNode } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { LANGUAGES } from '../data/languages';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { ThemeVocabularyBanner } from '../components/ThemeVocabularyBanner';
import { Language } from '../types';

const ARCADE_GAMES: { id: GameMechanic; name: string; description: string; icon: string; accent: string; artwork: string }[] = [
  { id: 'safari', name: 'Safari de palabras', description: 'Explora la selva y encuentra el animal o el objeto que te pide Lila.', icon: '🦒', accent: 'from-lime-300 to-emerald-400', artwork: '/games/safari.svg' },
  { id: 'word_train', name: 'Tren de palabras', description: 'Ayuda a Chispa a completar frases y llevar cada palabra a su destino.', icon: '🚂', accent: 'from-sky-300 to-blue-400', artwork: '/games/train.svg' },
  { id: 'garden_match', name: 'Jardín de parejas', description: 'Gira las flores, encuentra las parejas y haz crecer el jardín.', icon: '🌼', accent: 'from-amber-200 to-pink-300', artwork: '/games/garden.svg' },
];

const WORLD_STORIES: Record<Language, { title: string; story: string; reward: string; accent: string }> = {
  es: {
    title: 'España · Fiesta del barrio',
    story: 'Hoy ayudamos a preparar la plaza, la playa y la cocina del pueblo. Cada palabra nos lleva a un nuevo lugar de la aventura.',
    reward: 'Medalla de la plaza',
    accent: 'from-amber-400 to-orange-500',
  },
  ar: {
    title: 'Marruecos · Mercado del desierto',
    story: 'En el zoco, cada palabra nos abre un rincón del viaje: té, colores, gente y caminos del desierto.',
    reward: 'Cofre del zoco',
    accent: 'from-rose-400 to-orange-500',
  },
  'nl-BE': {
    title: 'Flandes · Canales y bicicletas',
    story: 'Recorremos canales, puentes y chocolaterías con rutas sencillas para aprender palabras del día a día.',
    reward: 'Insignia de los canales',
    accent: 'from-teal-400 to-cyan-500',
  },
  fr: {
    title: 'Francia · Café y arte',
    story: 'En cada café, parque y calle de París, las palabras cobran vida y nos permiten hablar con confianza.',
    reward: 'Estrella del boulevard',
    accent: 'from-pink-400 to-violet-500',
  },
};

const PASSPORT_TIERS = [
  { tier: 'Bronce', icon: '🥉', title: 'Primera conquista', target: 1, accent: 'from-amber-300 to-orange-500', description: 'Completa la primera misión del viaje.' },
  { tier: 'Plata', icon: '🥈', title: 'Ronda segura', target: 2, accent: 'from-slate-300 to-slate-500', description: 'Termina dos rutas del mapa.' },
  { tier: 'Oro', icon: '🥇', title: 'Explorador experto', target: 3, accent: 'from-yellow-300 to-amber-500', description: 'Supera la mitad de los mundos.' },
  { tier: 'Legendario', icon: '👑', title: 'Gran viajero', target: 4, accent: 'from-violet-400 to-pink-500', description: 'Completa todos los países del pasaporte.' },
];

export const WorldHub: React.FC = () => {
  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);
  const setScreen = useGameStore(s => s.setScreen);
  const worldNodes = useGameStore(s => s.worldNodes);
  const setActiveWorld = useGameStore(s => s.setActiveWorld);
  const startSession = useGameStore(s => s.startSession);
  const profiles = useProfileStore(s => s.profiles);

  const langMeta = LANGUAGES[language];
  const nodes = worldNodes[language] || [];
  const themeWords = VOCABULARY_BANK.filter(w => w.language === language).slice(0, 6);

  const handleSelectNode = (node: WorldNode) => {
    if (!node.unlocked) return;
    setActiveWorld(node.theme, node.gameId, node.id, node.minDifficulty);
    startSession(profiles);
  };

  const startArcadeGame = (gameId: GameMechanic) => {
    setActiveWorld('arcade', gameId);
    startSession(profiles);
  };

  const completedCount = nodes.filter(node => node.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, nodes.length)) * 100);
  const nextReward = PASSPORT_TIERS.find(tier => completedCount < tier.target) ?? PASSPORT_TIERS[PASSPORT_TIERS.length - 1];

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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setScreen('PASSPORT')}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-indigo-800 shadow-sm transition hover:bg-white"
        >
          <BookOpen className="h-4 w-4" /> Ver mi pasaporte
        </button>
      </div>

      <ThemeVocabularyBanner
        words={themeWords}
        title={`Vocabulario destacado · ${langMeta.name}`}
        themeColor={langMeta.themeColor}
      />

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[2rem] border border-indigo-200 bg-white/75 p-4 shadow-[0_20px_40px_rgba(59,130,246,0.08)] backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" /> Narrativa del mundo
          </div>
          <h3 className="text-xl font-black text-slate-900">{WORLD_STORIES[language].title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{WORLD_STORIES[language].story}</p>
          <div className={`mt-4 inline-flex rounded-full bg-gradient-to-r ${WORLD_STORIES[language].accent} px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-white shadow-lg`}>
            {WORLD_STORIES[language].reward}
          </div>
        </div>

        <div className="rounded-[2rem] border border-indigo-200 bg-slate-900 p-4 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Progreso</div>
          <div className="mt-3 text-3xl font-black">{completedCount}/{nodes.length}</div>
          <p className="mt-1 text-sm text-slate-300">Mundos completados • rutas guardadas en el pasaporte</p>
          <div className="mt-4 h-2 rounded-full bg-slate-700">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[2rem] border border-indigo-200 bg-white/80 p-4 shadow-[0_20px_40px_rgba(59,130,246,0.08)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-indigo-700">
              <MapPin className="h-4 w-4" /> Pasaporte de aventura
            </div>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.18em] text-indigo-700">
              {progressPercent}%
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {PASSPORT_TIERS.map((tier) => {
              const unlocked = completedCount >= tier.target;
              return (
                <div
                  key={tier.tier}
                  className={`rounded-2xl border p-3 transition ${unlocked ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white shadow-sm' : 'border-slate-200 bg-slate-50/90 text-slate-500'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tier.accent} text-xl shadow-sm`}>
                      {tier.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[.18em] text-slate-500">{tier.tier}</span>
                  </div>
                  <h4 className="mt-3 text-base font-black text-slate-900">{tier.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{tier.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[.18em] text-slate-500">
                    <span>Meta</span>
                    <span>{tier.target}/4</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${tier.accent}`}
                      style={{ width: `${Math.min(100, (completedCount / tier.target) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-indigo-200 bg-slate-900 p-4 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
          <div className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Siguiente premio</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-pink-500 text-2xl shadow-lg">{nextReward.icon}</div>
            <div>
              <div className="text-lg font-black">{nextReward.title}</div>
              <div className="text-xs text-slate-300">{completedCount} / {nextReward.target} rutas</div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            {completedCount >= nextReward.target
              ? '¡Has desbloqueado este premio del pasaporte!'
              : `Falta ${Math.max(0, nextReward.target - completedCount)} misión más para reclamar tu siguiente recompensa.`}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-indigo-700">
              <Gamepad2 className="h-4 w-4" /> Modo aventura
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">¡Tres juegos nuevos para aprender jugando!</h2>
          </div>
          <span className="hidden rounded-full border border-indigo-200 bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-slate-600 sm:block">
            Para peques exploradores
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
              className="fayma-game-card group relative overflow-hidden rounded-[1.75rem] border-2 border-white bg-white p-4 text-left shadow-[0_12px_28px_rgba(64,115,62,.12)] sm:p-5"
            >
              <div className={`relative -mx-1 -mt-1 mb-4 overflow-hidden rounded-2xl bg-gradient-to-br ${game.accent}`}>
                <img src={game.artwork} alt="" className="h-36 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-40" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">¡JUGAR!</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">{game.icon}</span>
                <h3 className="text-lg font-black text-slate-900">{game.name}</h3>
              </div>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{game.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <Sparkles className="h-4 w-4" /> Sin prisas, ¡a tu ritmo!
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
                    <p className="mt-1 text-xs font-bold text-emerald-700">{node.gameName}</p>
                    <div className={`mt-2 flex items-center gap-1.5 ${index % 2 ? 'sm:justify-end' : ''}`}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-xs ${star <= node.minDifficulty ? 'text-amber-400' : 'text-slate-300'}`}>★</span>
                      ))}
                      <span className="ml-1 text-[10px] uppercase tracking-wide text-slate-500">{node.theme}</span>
                    </div>
                    {node.completed && (
                      <div className={`mt-2 flex items-center gap-1 ${index % 2 ? 'sm:justify-end' : ''}`} aria-label={`${node.stars ?? 1} estrellas ganadas`}>
                        <span className="mr-1 text-[9px] font-black uppercase tracking-wide text-slate-500">Pasaporte</span>
                        {[1, 2, 3].map(star => (
                          <span key={star} className={`text-sm ${star <= (node.stars ?? 1) ? 'text-amber-400' : 'text-slate-300'}`}>★</span>
                        ))}
                      </div>
                    )}
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
