import React, { Suspense, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Play, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { FitGame } from '../components/FitGame';

const MagicWorldGame = React.lazy(() => import('./MagicWorldGame').then(module => ({ default: module.MagicWorldGame })));
const MagicMemoryGame = React.lazy(() => import('./MagicMemoryGame').then(module => ({ default: module.MagicMemoryGame })));
const StarCatchGame = React.lazy(() => import('./StarCatchGame').then(module => ({ default: module.StarCatchGame })));
const ColorEchoGame = React.lazy(() => import('./ColorEchoGame').then(module => ({ default: module.ColorEchoGame })));
const MoleDashGame = React.lazy(() => import('./MoleDashGame').then(module => ({ default: module.MoleDashGame })));

type OriginalGameId = 'magic-world' | 'magic-memory' | 'star-catch' | 'color-echo' | 'mole-dash';

const FREE_GAME_ART: Partial<Record<OriginalGameId, string>> = {
  'magic-world': '/games/magic-world.png',
  'magic-memory': '/games/magic-memory.png',
  'star-catch': '/games/star-catch.png',
  'color-echo': '/games/color-echo.png',
};

const COPY: Record<Language, {
  title: string;
  subtitle: string;
  back: string;
  play: string;
  games: Record<OriginalGameId, { title: string; description: string; icon: string; color: string }>;
}> = {
  es: {
    title: 'Juegos libres',
    subtitle: '¡Juega a tu manera!',
    back: 'Volver a los juegos',
    play: '¡Jugar!',
    games: {
      'magic-world': { title: 'Mundo Mágico', description: 'Sigue el camino y recoge estrellas.', icon: '🦄', color: 'from-sky-300 via-cyan-200 to-emerald-200' },
      'magic-memory': { title: 'Memoria mágica', description: 'Encuentra las parejas de criaturas.', icon: '🪄', color: 'from-violet-300 via-fuchsia-200 to-pink-200' },
      'star-catch': { title: 'Atrapaestrellas', description: 'Toca tantas estrellas como puedas.', icon: '🌟', color: 'from-amber-300 via-yellow-200 to-orange-200' },
      'color-echo': { title: 'Eco de colores', description: 'Observa los colores y repite.', icon: '🎨', color: 'from-sky-300 via-blue-200 to-fuchsia-200' },
      'mole-dash': { title: '¡Topo al hoyo!', description: 'Atrapa los topos y evita bombas.', icon: '🐹', color: 'from-lime-300 via-emerald-200 to-amber-200' },
    },
  },
  'nl-BE': {
    title: 'Vrije spelletjes',
    subtitle: 'Speel op jouw manier!',
    back: 'Terug',
    play: 'Spelen!',
    games: {
      'magic-world': { title: 'Magische wereld', description: 'Volg het pad en verzamel sterren.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'Magisch geheugen', description: 'Zoek de paren.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'Sterren vangen', description: 'Tik vallende sterren aan!', icon: '🌟', color: 'from-amber-300 via-yellow-200 to-orange-100' },
      'color-echo': { title: 'Kleuren-echo', description: 'Onthoud de kleuren.', icon: '🎨', color: 'from-sky-300 via-violet-100 to-fuchsia-100' },
      'mole-dash': { title: 'Molletje-mep!', description: 'Tik de molletjes.', icon: '🐹', color: 'from-lime-300 via-emerald-100 to-amber-100' },
    },
  },
  fr: {
    title: 'Jeux libres',
    subtitle: 'Joue à ta façon !',
    back: 'Retour',
    play: 'Jouer !',
    games: {
      'magic-world': { title: 'Monde magique', description: 'Suis le chemin et ramasse des étoiles.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'Mémoire magique', description: 'Retrouve les paires.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'Attrape-étoiles', description: 'Touche les étoiles !', icon: '🌟', color: 'from-amber-300 via-yellow-200 to-orange-100' },
      'color-echo': { title: 'Écho des couleurs', description: 'Répète la séquence.', icon: '🎨', color: 'from-sky-300 via-violet-100 to-fuchsia-100' },
      'mole-dash': { title: 'Tape-taupe !', description: 'Attrape les taupes.', icon: '🐹', color: 'from-lime-300 via-emerald-100 to-amber-100' },
    },
  },
  ar: {
    title: 'ألعاب حرة',
    subtitle: 'العب بطريقتك!',
    back: 'العودة',
    play: 'العب!',
    games: {
      'magic-world': { title: 'العالم السحري', description: 'اجمع النجوم.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'الذاكرة السحرية', description: 'اعثر على الأزواج.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'التقط النجوم', description: 'المس النجوم!', icon: '🌟', color: 'from-amber-300 via-yellow-200 to-orange-100' },
      'color-echo': { title: 'صدى الألوان', description: 'كرر التسلسل.', icon: '🎨', color: 'from-sky-300 via-blue-200 to-fuchsia-200' },
      'mole-dash': { title: 'اضرب الخلد!', description: 'أمسك الخلد.', icon: '🐹', color: 'from-lime-300 via-emerald-200 to-amber-100' },
    },
  },
  en: {
    title: 'Free Play Games',
    subtitle: 'Play your way!',
    back: 'Back',
    play: 'Play!',
    games: {
      'magic-world': { title: 'Magic World', description: 'Follow path and collect stars.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'Magic Memory', description: 'Find matching pairs.', icon: '🪄', color: 'from-violet-300 via-fuchsia-200 to-pink-200' },
      'star-catch': { title: 'Star Catcher', description: 'Catch falling stars!', icon: '🌟', color: 'from-amber-300 via-yellow-200 to-orange-200' },
      'color-echo': { title: 'Color Echo', description: 'Repeat the sequence.', icon: '🎨', color: 'from-sky-300 via-blue-200 to-fuchsia-200' },
      'mole-dash': { title: 'Whack-a-Mole!', description: 'Catch moles and avoid bombs.', icon: '🐹', color: 'from-lime-300 via-emerald-200 to-amber-100' },
    },
  },
};

interface OriginalGamesProps {
  language: Language;
}

export const OriginalGames: React.FC<OriginalGamesProps> = ({ language }) => {
  const [activeGame, setActiveGame] = useState<OriginalGameId | null>(null);
  const [page, setPage] = useState(0);
  const copy = COPY[language];
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  const gameEntries = Object.entries(copy.games) as Array<[OriginalGameId, typeof copy.games[OriginalGameId]]>;
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(gameEntries.length / ITEMS_PER_PAGE);
  const visibleGames = gameEntries.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const prevSlide = () => {
    if (page > 0) setPage(p => p - 1);
  };

  const nextSlide = () => {
    if (page < totalPages - 1) setPage(p => p + 1);
  };

  return (
    <section lang={language} dir={direction} className="mx-auto flex w-full flex-col justify-between h-full">
      {activeGame ? (
        <div className="fixed inset-x-0 bottom-0 top-[60px] z-30 flex flex-col overflow-hidden bg-gradient-to-br from-sky-100 via-pink-50 to-yellow-100 p-2 sm:p-4">
          <button
            type="button"
            onClick={() => setActiveGame(null)}
            className="mb-1 inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-xl px-3 text-sm font-bold text-slate-700 transition hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4" /> {copy.back}
          </button>
          <FitGame>
            <Suspense fallback={<div className="rounded-3xl bg-white p-8 text-center font-black text-slate-700">✨</div>}>
              {activeGame === 'magic-world' && <MagicWorldGame language={language} />}
              {activeGame === 'magic-memory' && <MagicMemoryGame language={language} />}
              {activeGame === 'star-catch' && <StarCatchGame language={language} />}
              {activeGame === 'color-echo' && <ColorEchoGame language={language} />}
              {activeGame === 'mole-dash' && <MoleDashGame language={language} />}
            </Suspense>
          </FitGame>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-between h-full">
          <div className="mb-1.5 flex items-center justify-between gap-1.5 shrink-0">
            <span className="text-xs font-black text-slate-700">🎮 {copy.title}</span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={prevSlide}
                disabled={page === 0}
                aria-label="Anterior"
                className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition ${
                  page === 0 ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-white bg-white text-slate-700 shadow-2xs hover:bg-slate-50'
                }`}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={page === totalPages - 1}
                aria-label="Siguiente"
                className={`flex h-8 w-8 items-center justify-center rounded-xl border-2 transition ${
                  page === totalPages - 1 ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' : 'border-white bg-white text-slate-700 shadow-2xs hover:bg-slate-50'
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 grid-rows-2 gap-2.5 flex-1 my-1">
            {visibleGames.map(([id, game]) => (
              <article key={id} className="group flex flex-col justify-between overflow-hidden rounded-2xl border-3 border-white bg-white p-3 text-left shadow-xs transition h-full w-full">
                <div className="flex items-center gap-2.5">
                  <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${game.color}`}>
                    {FREE_GAME_ART[id]
                      ? <img src={FREE_GAME_ART[id]} alt="" className="h-11 w-11 object-contain p-0.5" />
                      : <span className="text-3xl" aria-hidden="true">{game.icon}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black leading-tight text-slate-900 line-clamp-2">{game.title}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveGame(id)}
                  className="mt-1 flex min-h-8 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-xs font-black text-white shadow-[0_2px_0_#328248] transition hover:bg-emerald-600 w-full"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> {copy.play}
                </button>
              </article>
            ))}
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 px-1 shrink-0">
            <span>Página {page + 1} de {totalPages}</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-500" /> {copy.subtitle}</span>
          </div>
        </div>
      )}
    </section>
  );
};
