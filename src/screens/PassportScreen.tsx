import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Globe2, Star, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';

export const PassportScreen: React.FC = () => {
  const worldNodes = useGameStore(state => state.worldNodes);
  const setScreen = useGameStore(state => state.setScreen);
  const languages = Object.keys(LANGUAGES) as Language[];
  const allNodes = languages.flatMap(language => worldNodes[language] ?? []);
  const completedRoutes = allNodes.filter(node => node.completed).length;
  const totalStars = allNodes.reduce((sum, node) => sum + (node.stars ?? (node.completed ? 1 : 0)), 0);
  const completedCountries = languages.filter(language => {
    const nodes = worldNodes[language] ?? [];
    return nodes.length > 0 && nodes.every(node => node.completed);
  }).length;
  const progress = Math.round((completedRoutes / Math.max(1, allNodes.length)) * 100);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:py-8">
      <button
        type="button"
        onClick={() => setScreen('WORLD_HUB')}
        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-black text-indigo-800 shadow-sm transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al mapa
      </button>

      <section className="relative overflow-hidden rounded-[2rem] border border-indigo-200 bg-gradient-to-br from-indigo-700 via-violet-700 to-pink-600 p-6 text-white shadow-[0_24px_60px_rgba(79,70,229,0.24)] sm:p-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-amber-200">
              <Globe2 className="h-4 w-4" /> FAYMA WORLD
            </div>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Pasaporte de aventura</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              Cada ruta completada deja una estrella en tu pasaporte. ¡Explora los cuatro países y consigue sus medallas!
            </p>
            <div className="mt-5 h-3 max-w-lg overflow-hidden rounded-full bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-100"
              />
            </div>
            <div className="mt-2 text-xs font-bold text-indigo-100">{completedRoutes}/{allNodes.length} rutas · {progress}% del viaje</div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <div className="text-5xl" aria-hidden="true">{completedCountries === 4 ? '🏆' : '🛂'}</div>
            <div>
              <div className="text-2xl font-black">{totalStars}</div>
              <div className="text-xs font-bold text-indigo-100">estrellas</div>
              <div className="mt-1 text-xs font-bold text-amber-200">{completedCountries}/4 medallas de país</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {languages.map((language, countryIndex) => {
          const meta = LANGUAGES[language];
          const nodes = worldNodes[language] ?? [];
          const finished = nodes.length > 0 && nodes.every(node => node.completed);
          const countryStars = nodes.reduce((sum, node) => sum + (node.stars ?? (node.completed ? 1 : 0)), 0);

          return (
            <motion.section
              key={language}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: countryIndex * 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-indigo-200 bg-white/85 shadow-[0_18px_42px_rgba(59,130,246,0.1)]"
            >
              <div className="flex items-center justify-between gap-3 border-b border-indigo-100 bg-gradient-to-r from-sky-50 to-pink-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.flag}</span>
                  <div>
                    <h2 className="font-black text-slate-900">{meta.country}</h2>
                    <p className="text-xs font-semibold text-slate-500">{meta.nativeName}</p>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1.5 text-xs font-black ${finished ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                  {finished ? '🏅 Medalla conseguida' : `${nodes.filter(node => node.completed).length}/${nodes.length} rutas`}
                </div>
              </div>

              <div className="space-y-2 p-4">
                {nodes.map((node, index) => {
                  const stars = node.stars ?? (node.completed ? 1 : 0);
                  return (
                    <div key={node.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${node.completed ? 'bg-gradient-to-br from-amber-200 to-orange-300 shadow-sm' : 'bg-slate-200 grayscale'}`}>
                        {node.completed ? (index === nodes.length - 1 ? '🏁' : node.icon) : '🔒'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-black text-slate-800">{node.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          {node.completed ? 'Ruta completada' : node.unlocked ? 'Lista para explorar' : 'Sigue el camino para desbloquearla'}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5" aria-label={`${stars} de 3 estrellas`}>
                        {[1, 2, 3].map(star => (
                          <Star key={star} className={`h-4 w-4 ${star <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Trophy className="h-4 w-4 text-amber-500" /> Sello del país</span>
                <span>{countryStars}/{nodes.length * 3} estrellas</span>
              </div>
            </motion.section>
          );
        })}
      </div>
    </main>
  );
};
