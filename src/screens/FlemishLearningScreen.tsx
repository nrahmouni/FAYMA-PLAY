import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Check, Search, Sparkles, Volume2 } from 'lucide-react';
import { FLEMISH_PHRASES } from '../data/flemish';
import { RAW_1000_WORDS, VOCABULARY_1000_CATEGORIES } from '../data/words1000';
import { LANGUAGES } from '../data/languages';
import { useSpeech } from '../hooks/useSpeech';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { shuffleArray } from '../lib/utils';
import { Language } from '../types';
import { WordIcon } from '../components/WordIcon';

type LearningMode = 'words' | 'phrases' | 'quiz';
const PAGE_SIZE = 24;

interface DisplayWord {
  id: string;
  word: string;
  meaning: string;
  emoji: string;
  category: string;
  language: Language;
}

export const FlemishLearningScreen: React.FC = () => {
  const currentStoreLang = useGameStore(state => state.language);
  const setScreen = useGameStore(state => state.setScreen);
  const profiles = useProfileStore(state => state.profiles);
  const recordWordAttempt = useProfileStore(state => state.recordWordAttempt);
  const player = profiles[0];
  const { speak } = useSpeech();

  const [activeLang, setActiveLang] = useState<Language>(currentStoreLang);
  const [mode, setMode] = useState<LearningMode>('words');
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);

  // Map 1000 words to the active language display
  const wordsForLang = useMemo<DisplayWord[]>(() => {
    return RAW_1000_WORDS.map(w => {
      let wordText = w.nl;
      let meaningText = w.es;
      if (activeLang === 'fr') {
        wordText = w.fr;
        meaningText = w.es;
      } else if (activeLang === 'ar') {
        wordText = w.ar;
        meaningText = w.es;
      } else if (activeLang === 'es') {
        wordText = w.es;
        meaningText = w.en ? `${w.es} · ${w.en}` : w.es;
      } else {
        wordText = w.nl;
        meaningText = w.es;
      }
      return {
        id: `vocab_${activeLang}_${w.id}`,
        word: wordText,
        meaning: meaningText,
        emoji: w.emoji,
        category: w.cat,
        language: activeLang,
      };
    });
  }, [activeLang]);

  const quizDeck = useMemo(() => shuffleArray(wordsForLang), [wordsForLang]);
  const categories = useMemo(() => ['Todos', ...VOCABULARY_1000_CATEGORIES], []);
  const knownCount = wordsForLang.filter(word => player?.mastery[word.id]).length;
  const totalCount = wordsForLang.length;

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredWords = useMemo(() => {
    return wordsForLang.filter(word =>
      (category === 'Todos' || word.category === category) &&
      (!normalizedSearch || `${word.word} ${word.meaning} ${word.category}`.toLocaleLowerCase().includes(normalizedSearch)),
    );
  }, [category, normalizedSearch, wordsForLang]);

  const currentQuizWord = quizDeck[quizIndex % quizDeck.length];
  const quizOptions = useMemo(() => {
    if (!currentQuizWord) return [];
    return shuffleArray([
      currentQuizWord,
      ...shuffleArray(wordsForLang.filter(word => word.id !== currentQuizWord.id)).slice(0, 3),
    ]);
  }, [currentQuizWord, wordsForLang]);

  const chooseQuizAnswer = (wordId: string) => {
    if (!player || quizChoice) return;
    setQuizChoice(wordId);
    recordWordAttempt(player.uid, currentQuizWord.id, wordId === currentQuizWord.id);
  };

  const nextQuizQuestion = () => {
    setQuizIndex(index => index + 1);
    setQuizChoice(null);
  };

  const learnWord = (wordId: string) => {
    if (!player?.mastery[wordId]) recordWordAttempt(player.uid, wordId, true);
  };

  const activeMeta = LANGUAGES[activeLang];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:gap-7 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setScreen('WORLD_HUB')}
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 text-sm font-bold text-emerald-800 transition hover:bg-white/70"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al juego
        </button>

        {/* Language selector tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
          {(['nl-BE', 'fr', 'ar', 'es'] as Language[]).map(langCode => {
            const m = LANGUAGES[langCode];
            const isSelected = activeLang === langCode;
            return (
              <button
                key={langCode}
                type="button"
                onClick={() => {
                  setActiveLang(langCode);
                  setCategory('Todos');
                  setSearch('');
                  setVisibleCount(PAGE_SIZE);
                  setQuizIndex(0);
                  setQuizChoice(null);
                }}
                className={`flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-black transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-emerald-50'
                }`}
              >
                <span>{m.flag}</span>
                <span className="hidden sm:inline">{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500 p-5 text-white shadow-[0_20px_45px_rgba(27,110,62,.2)] sm:p-8">
        <span className="absolute -right-8 -top-10 text-[9rem] opacity-20 sm:right-8 sm:top-0 sm:text-[12rem]" aria-hidden="true">
          {activeLang === 'nl-BE' ? '🦁' : activeLang === 'fr' ? '🥐' : activeLang === 'ar' ? '🌴' : '☀️'}
        </span>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> Gran Banco de Vocabulario Oficial · {activeMeta.country}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
            {activeLang === 'nl-BE'
              ? '¡Diccionario de Flamenco!'
              : activeLang === 'fr'
                ? '¡Dictionnaire de Français!'
                : activeLang === 'ar'
                  ? '¡قاموس الكلمات العربية!'
                  : '¡Diccionario de Español!'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/95 sm:text-base">
            {activeLang === 'nl-BE'
              ? 'Las 1.000 palabras oficiales organizadas en 49 temas cotidianos (familia, animales, comida, naturaleza, colegio, deportes y más). ¡Escucha el audio nativo y practica!'
              : `Explora el vocabulario de 1.000 palabras en ${activeMeta.name} con audio nativo y mini quiz interactivo.`}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-emerald-800 shadow-sm">
            <BookOpen className="h-4 w-4" /> {totalCount} palabras cargadas · {categories.length - 1} temas
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500">Palabras aprendidas</div>
          <div className="mt-1 text-2xl font-black text-emerald-800">{knownCount}<span className="text-sm font-bold text-slate-400"> / {totalCount}</span></div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500">Tu progreso</div>
          <div className="mt-1 text-2xl font-black text-amber-700">{Math.round((knownCount / Math.max(1, totalCount)) * 100)}%</div>
        </div>
        <div className="col-span-2 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:col-span-1">
          <div className="text-xs font-bold text-slate-500">¡Consejo de aprendizaje!</div>
          <div className="mt-1 text-sm font-extrabold text-sky-800">Toca el altavoz para escuchar la pronunciación auténtica.</div>
        </div>
      </section>

      <div
        className="h-3 overflow-hidden rounded-full bg-white shadow-inner"
        role="progressbar"
        aria-label="Progreso de palabras"
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-valuenow={knownCount}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-[width]" style={{ width: `${(knownCount / Math.max(1, totalCount)) * 100}%` }} />
      </div>

      <nav className="grid grid-cols-3 gap-2 rounded-2xl bg-white/80 p-2 shadow-sm" aria-label="Secciones de aprendizaje">
        {([
          ['words', `Palabras (${totalCount})`, '📚'],
          ['phrases', 'Frases útiles', '💬'],
          ['quiz', 'Mini quiz', '⭐'],
        ] as const).map(([value, label, emoji]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className={`min-h-12 rounded-xl px-2 py-2 text-xs font-black transition sm:text-sm ${
              mode === value ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <span className="mr-1.5" aria-hidden="true">{emoji}</span>{label}
          </button>
        ))}
      </nav>

      {mode === 'words' && (
        <section>
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-emerald-700" />
              <span className="sr-only">Buscar palabra o traducción</span>
              <input
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder={`Busca en ${activeMeta.name} o español…`}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 text-xs font-extrabold text-emerald-900">
              Mostrando {Math.min(visibleCount, filteredWords.length)} de {filteredWords.length}
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {categories.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-pressed={category === item}
                className={`min-h-10 shrink-0 rounded-full px-4 text-xs font-black transition ${
                  category === item ? 'bg-lime-500 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-lime-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {filteredWords.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center font-bold text-slate-600">No encontramos esa palabra. Prueba otra búsqueda. 🔎</div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredWords.slice(0, visibleCount).map((word, index) => {
                  const learned = Boolean(player?.mastery[word.id]);
                  return (
                    <motion.article
                      key={word.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % PAGE_SIZE) * 0.012 }}
                      className="rounded-2xl border border-white bg-white p-4 shadow-sm ring-1 ring-emerald-50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-100 to-emerald-100 p-1" aria-hidden="true">
                          <WordIcon icon={word.emoji} esWord={word.meaning} size="md" className="text-3xl" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase tracking-wide text-emerald-700">{word.category}</span>
                          <h2
                            className="break-words text-xl font-black text-slate-900"
                            lang={word.language}
                            dir={word.language === 'ar' ? 'rtl' : 'ltr'}
                          >
                            {word.word}
                          </h2>
                          <p className="text-sm font-semibold text-slate-600">{word.meaning}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => speak(word.word, word.language)}
                          aria-label={`Escuchar ${word.word}`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-800 transition hover:bg-sky-100"
                        >
                          <Volume2 className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={learned || !player}
                        onClick={() => learnWord(word.id)}
                        className={`mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-black transition ${
                          learned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        {learned ? <><Check className="h-4 w-4" /> ¡Ya la aprendí!</> : 'Marcar como aprendida'}
                      </button>
                    </motion.article>
                  );
                })}
              </div>
              {visibleCount < filteredWords.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                  className="mx-auto mt-5 flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Cargar más palabras ({filteredWords.length - visibleCount} restantes)
                </button>
              )}
            </>
          )}
        </section>
      )}

      {mode === 'phrases' && (
        <section>
          <div className="mb-4 rounded-3xl bg-gradient-to-r from-sky-100 to-indigo-100 p-5">
            <h2 className="text-xl font-black text-slate-900">Frases para usar cada día</h2>
            <p className="mt-1 text-sm text-slate-700">Escucha, practica y úsalas en tus aventuras de conversación.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {FLEMISH_PHRASES.map(item => (
              <article key={item.phrase} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-50">
                <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black text-slate-900" lang="nl-BE">{item.phrase}</h2>
                  <p className="text-sm text-slate-600">{item.meaning}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speak(item.phrase, 'nl-BE')}
                  aria-label={`Escuchar: ${item.phrase}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-800 hover:bg-sky-100"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {mode === 'quiz' && currentQuizWord && (
        <section className="mx-auto w-full max-w-3xl rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-lime-50 p-5 shadow-sm ring-1 ring-amber-100 sm:p-8">
          <div className="text-xs font-black uppercase tracking-wider text-amber-800">
            Mini quiz · {activeMeta.name} · palabra {quizIndex + 1}
          </div>
          <div className="mt-5 flex flex-col items-center text-center">
            <span className="flex h-20 w-20 items-center justify-center p-1" aria-hidden="true">
              <WordIcon icon={currentQuizWord.emoji} esWord={currentQuizWord.meaning} size="3xl" className="text-6xl" />
            </span>
            <h2
              className="mt-3 text-3xl font-black text-slate-900"
              lang={currentQuizWord.language}
              dir={currentQuizWord.language === 'ar' ? 'rtl' : 'ltr'}
            >
              {currentQuizWord.word}
            </h2>
            <button
              type="button"
              onClick={() => speak(currentQuizWord.word, currentQuizWord.language)}
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-sky-800 shadow-sm"
            >
              <Volume2 className="h-4 w-4" /> Escuchar pronunciación
            </button>
            <p className="mt-5 text-sm font-bold text-slate-600">¿Qué significa esta palabra?</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quizOptions.map(option => {
              const selected = quizChoice === option.id;
              const correct = option.id === currentQuizWord.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={quizChoice !== null}
                  onClick={() => chooseQuizAnswer(option.id)}
                  className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold transition ${
                    selected && correct ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                      : selected ? 'border-rose-300 bg-rose-50 text-rose-800'
                        : 'border-white bg-white text-slate-800 shadow-sm hover:bg-amber-50'
                  }`}
                >
                  {option.meaning}
                </button>
              );
            })}
          </div>
          {quizChoice && (
            <div aria-live="polite" className="mt-5 text-center">
              <p className="font-black text-emerald-800">
                {quizChoice === currentQuizWord.id ? '¡Muy bien! 🌟' : `¡Buen intento! ${currentQuizWord.word} significa «${currentQuizWord.meaning}».`}
              </p>
              <button
                type="button"
                onClick={nextQuizQuestion}
                className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-black text-white hover:bg-emerald-700"
              >
                Siguiente palabra <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
