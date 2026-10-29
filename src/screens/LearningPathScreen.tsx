import React from 'react';
import { ArrowLeft, BookOpen, Gift, Play, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES } from '../data/languages';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

const PATH_COPY: Record<Language, { title: string; intro: string; reward: string; start: string; lesson: string; progress: string; back: string; completed: string }> = {
  es: { title: 'Ruta de palabras', intro: 'Una lección breve. Cuatro formas de aprender.', reward: 'Cada 5 lecciones superadas: 10 minutos de juego', start: 'Empezar lección', lesson: 'Lecciones', progress: 'Progreso hacia el juego', back: 'Idiomas', completed: 'completadas' },
  en: { title: 'Word path', intro: 'One short lesson. Four ways to learn.', reward: 'Every 5 passed lessons: 10 minutes of play', start: 'Start lesson', lesson: 'Lessons', progress: 'Progress to your game', back: 'Languages', completed: 'completed' },
  fr: { title: 'Parcours des mots', intro: 'Une courte leçon. Quatre façons d’apprendre.', reward: 'Toutes les 5 leçons réussies : 10 minutes de jeu', start: 'Commencer la leçon', lesson: 'Leçons', progress: 'Progrès vers le jeu', back: 'Langues', completed: 'terminées' },
  'nl-BE': { title: 'Woordenpad', intro: 'Een korte les. Vier manieren om te leren.', reward: 'Na 5 geslaagde lessen: 10 minuten spelen', start: 'Start de les', lesson: 'Lessen', progress: 'Voortgang naar je spel', back: 'Talen', completed: 'voltooid' },
  ar: { title: 'مسار الكلمات', intro: 'درس قصير وأربع طرق للتعلّم.', reward: 'بعد كل 5 دروس ناجحة: 10 دقائق من اللعب', start: 'ابدأ الدرس', lesson: 'الدروس', progress: 'التقدم نحو اللعبة', back: 'اللغات', completed: 'مكتملة' },
};

export const LearningPathScreen: React.FC = () => {
  const language = useGameStore(state => state.language);
  const lessonProgress = useGameStore(state => state.lessonProgress);
  const setScreen = useGameStore(state => state.setScreen);
  const setActiveWorld = useGameStore(state => state.setActiveWorld);
  const setTotalRounds = useGameStore(state => state.setTotalRounds);
  const startSession = useGameStore(state => state.startSession);
  const profiles = useProfileStore(state => state.profiles);
  const copy = PATH_COPY[language];

  const startLesson = () => {
    setTotalRounds(1);
    setActiveWorld('saludos', 'unified_lesson');
    startSession(profiles);
  };

  return (
    <main lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-4 sm:px-7 sm:py-6">
      <button type="button" onClick={() => setScreen('HOME')} className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl px-2 text-sm font-black text-slate-600 transition-colors hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
        <ArrowLeft className="h-4 w-4" /> {copy.back}
      </button>

      <section className="mt-3 flex flex-1 flex-col rounded-[2rem] border-2 border-white bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 shadow-[0_16px_38px_rgba(16,120,88,.12)] sm:mt-4 sm:p-7">
        <header className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-[0_4px_0_#166534]" aria-hidden="true"><BookOpen className="h-7 w-7" /></span>
          <h1 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{copy.title}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">{copy.intro}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-xs font-black text-amber-950 sm:text-sm">
            <Gift className="h-4 w-4 shrink-0" /> {copy.reward}
          </p>
        </header>

        <div className="mt-6 space-y-3" role="list" aria-label={copy.progress}>
          {profiles.map((profile, profileIndex) => {
            const progress = lessonProgress[profile.uid] || { completed: 0, towardReward: 0 };
            const hasImage = profile.avatarUrl?.startsWith('data:') || profile.avatarUrl?.startsWith('/');
            return (
              <article key={profile.uid} role="listitem" className="rounded-2xl border border-white bg-white/90 p-3 shadow-sm sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 text-2xl" aria-hidden="true">
                    {hasImage ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" /> : profile.avatarUrl || '⭐'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                      <h2 className="break-words font-black text-slate-900">{profile.displayName || `${copy.lesson} ${profileIndex + 1}`}</h2>
                      <span className="text-xs font-bold text-slate-500">{progress.completed} {copy.completed}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2" aria-label={`${copy.progress}: ${progress.towardReward} de 5`}>
                      <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index} className={`h-2.5 flex-1 rounded-full ${index < progress.towardReward ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                      <span className="shrink-0 text-xs font-black tabular-nums text-emerald-800">{progress.towardReward}/5</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
          <Sparkles className="h-4 w-4 text-amber-500" /> {copy.lesson} · {LANGUAGES[language].flag} {LANGUAGES[language].name}
        </div>
        <button type="button" onClick={startLesson} disabled={profiles.length === 0} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-lg font-black text-white shadow-[0_5px_0_#166534] transition-colors hover:bg-emerald-700 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
          <Play className="h-5 w-5 fill-current" /> {copy.start}
        </button>
      </section>
    </main>
  );
};
