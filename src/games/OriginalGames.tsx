import React, { Suspense, useState } from 'react';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { FitGame } from '../components/FitGame';

const MagicWorldGame = React.lazy(() => import('./MagicWorldGame').then(module => ({ default: module.MagicWorldGame })));
const MagicMemoryGame = React.lazy(() => import('./MagicMemoryGame').then(module => ({ default: module.MagicMemoryGame })));
const StarCatchGame = React.lazy(() => import('./StarCatchGame').then(module => ({ default: module.StarCatchGame })));
const ColorEchoGame = React.lazy(() => import('./ColorEchoGame').then(module => ({ default: module.ColorEchoGame })));
const MoleDashGame = React.lazy(() => import('./MoleDashGame').then(module => ({ default: module.MoleDashGame })));

type OriginalGameId = 'magic-world' | 'magic-memory' | 'star-catch' | 'color-echo' | 'mole-dash';

const COPY: Record<Language, {
  title: string;
  subtitle: string;
  back: string;
  play: string;
  games: Record<OriginalGameId, { title: string; description: string; icon: string; color: string }>;
}> = {
  es: {
    title: 'Juegos libres',
    subtitle: '¡Juega a tu manera! Elige una aventura para empezar.',
    back: 'Volver a los juegos',
    play: '¡Jugar!',
    games: {
      'magic-world': { title: 'Mundo Mágico', description: 'Sigue el camino, esquiva obstáculos y recoge estrellas con tus amigos.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'Memoria mágica', description: 'Encuentra las parejas de criaturas mágicas y entrena tu memoria.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'Atrapaestrellas', description: '¡Toca tantas estrellas fugaces como puedas antes de que se acabe el tiempo!', icon: '🌟', color: 'from-amber-200 via-yellow-100 to-orange-100' },
      'color-echo': { title: 'Eco de colores', description: 'Observa los colores y repite la secuencia. ¿Hasta qué nivel llegarás?', icon: '🎨', color: 'from-sky-200 via-violet-100 to-fuchsia-100' },
      'mole-dash': { title: '¡Topo al hoyo!', description: 'Atrapa los topos antes de que se escondan y no pulses las bombas.', icon: '🐹', color: 'from-lime-200 via-emerald-100 to-amber-100' },
    },
  },
  'nl-BE': {
    title: 'Vrije spelletjes',
    subtitle: 'Kies een avontuur en speel op jouw manier!',
    back: 'Terug naar de spelletjes',
    play: 'Spelen!',
    games: {
      'magic-world': { title: 'Magische wereld', description: 'Volg het pad, ontwijk hindernissen en verzamel sterren met je vrienden.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'Magisch geheugen', description: 'Zoek de paren van magische wezens en train je geheugen.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'Sterren vangen', description: 'Tik zoveel mogelijk vallende sterren aan voor de tijd om is!', icon: '🌟', color: 'from-amber-200 via-yellow-100 to-orange-100' },
      'color-echo': { title: 'Kleuren-echo', description: 'Onthoud de kleuren en herhaal de reeks. Hoe ver geraak jij?', icon: '🎨', color: 'from-sky-200 via-violet-100 to-fuchsia-100' },
      'mole-dash': { title: 'Molletje-mep!', description: 'Tik de molletjes voordat ze weg zijn en blijf van de bommen af.', icon: '🐹', color: 'from-lime-200 via-emerald-100 to-amber-100' },
    },
  },
  fr: {
    title: 'Jeux libres',
    subtitle: 'Choisis une aventure et joue à ta façon !',
    back: 'Retour aux jeux',
    play: 'Jouer !',
    games: {
      'magic-world': { title: 'Monde magique', description: 'Suis le chemin, évite les obstacles et ramasse des étoiles avec tes amis.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'Mémoire magique', description: 'Retrouve les paires de créatures magiques et entraîne ta mémoire.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'Attrape-étoiles', description: 'Touche autant d’étoiles filantes que possible avant la fin du temps !', icon: '🌟', color: 'from-amber-200 via-yellow-100 to-orange-100' },
      'color-echo': { title: 'Écho des couleurs', description: 'Observe les couleurs et répète la séquence. Jusqu’à quel niveau iras-tu ?', icon: '🎨', color: 'from-sky-200 via-violet-100 to-fuchsia-100' },
      'mole-dash': { title: 'Tape-taupe !', description: 'Attrape les taupes avant qu’elles se cachent et évite les bombes.', icon: '🐹', color: 'from-lime-200 via-emerald-100 to-amber-100' },
    },
  },
  ar: {
    title: 'ألعاب حرة',
    subtitle: 'اختر مغامرة والعب بطريقتك!',
    back: 'العودة إلى الألعاب',
    play: 'العب!',
    games: {
      'magic-world': { title: 'العالم السحري', description: 'اتبع الطريق وتجنب العوائق واجمع النجوم مع أصدقائك.', icon: '🦄', color: 'from-sky-200 via-cyan-100 to-emerald-100' },
      'magic-memory': { title: 'الذاكرة السحرية', description: 'اعثر على أزواج المخلوقات السحرية ودرب ذاكرتك.', icon: '🪄', color: 'from-violet-200 via-fuchsia-100 to-pink-100' },
      'star-catch': { title: 'التقط النجوم', description: 'المس أكبر عدد من النجوم قبل انتهاء الوقت!', icon: '🌟', color: 'from-amber-200 via-yellow-100 to-orange-100' },
      'color-echo': { title: 'صدى الألوان', description: 'شاهد الألوان وكرر التسلسل. إلى أي مستوى ستصل؟', icon: '🎨', color: 'from-sky-200 via-violet-100 to-fuchsia-100' },
      'mole-dash': { title: 'اضرب الخلد!', description: 'أمسك حيوانات الخلد قبل اختفائها وتجنب القنابل.', icon: '🐹', color: 'from-lime-200 via-emerald-100 to-amber-100' },
    },
  },
};

interface OriginalGamesProps {
  language: Language;
}

export const OriginalGames: React.FC<OriginalGamesProps> = ({ language }) => {
  const [activeGame, setActiveGame] = useState<OriginalGameId | null>(null);
  const copy = COPY[language];
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <section lang={language} dir={direction} className="mx-auto w-full max-w-5xl">
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
        <>
          <header className="mb-5 rounded-[2rem] border-4 border-white bg-gradient-to-r from-sky-50 via-white to-violet-50 p-5 shadow-sm sm:p-7">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">{copy.title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600 sm:text-base">{copy.subtitle}</p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(copy.games) as Array<[OriginalGameId, typeof copy.games[OriginalGameId]]>).map(([id, game]) => (
              <article key={id} className="overflow-hidden rounded-[1.75rem] border-4 border-white bg-white p-3 shadow-[0_5px_0_rgba(71,85,105,.1),0_12px_24px_rgba(71,85,105,.08)]">
                <div className={`flex h-32 items-center justify-center rounded-[1.3rem] bg-gradient-to-br text-7xl sm:h-40 ${game.color}`} aria-hidden="true">
                  {game.icon}
                </div>
                <h3 className="mt-3 text-lg font-black text-slate-900">{game.title}</h3>
                <p className="mt-1 min-h-12 text-sm leading-6 text-slate-600">{game.description}</p>
                <button
                  type="button"
                  onClick={() => setActiveGame(id)}
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-base font-black text-white shadow-[0_3px_0_#328248] transition hover:bg-emerald-600 active:translate-y-1 active:shadow-none"
                >
                  <Play className="h-5 w-5 fill-current" /> {copy.play}
                </button>
              </article>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-500">
            <Sparkles className="h-4 w-4 text-amber-500" /> {copy.subtitle}
          </div>
        </>
      )}
    </section>
  );
};
