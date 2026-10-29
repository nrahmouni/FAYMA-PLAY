import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, Volume2 } from 'lucide-react';
import { DifficultyLevel, GameProps, Language, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';
import { WordIcon } from '../components/WordIcon';

type SortTheme = 'comida' | 'animales';
type SortCategory = 'food' | 'animals';

const CATEGORY_THEME: Record<SortCategory, SortTheme> = {
  food: 'comida',
  animals: 'animales',
};

const CATEGORY_LABELS: Record<Language, Record<SortCategory, string>> = {
  es: { food: 'Comida', animals: 'Animales' },
  fr: { food: 'À manger', animals: 'Animaux' },
  'nl-BE': { food: 'Eten', animals: 'Dieren' },
  ar: { food: 'طعام', animals: 'حيوانات' },
  en: { food: 'Food', animals: 'Animals' },
};

function selectSortWords(language: Language, difficulty: DifficultyLevel): Word[] {
  const languageWords = VOCABULARY_BANK.filter(word =>
    word.language === language && !word.text.trim().includes(' '),
  );
  const byTheme = (theme: SortTheme) => languageWords
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => word.theme === theme)
    .sort((a, b) => (a.word.learningLevel ?? Math.min(15, Math.floor(a.index / 2) + 1)) - (b.word.learningLevel ?? Math.min(15, Math.floor(b.index / 2) + 1)));
  const unlocked = (theme: SortTheme) => byTheme(theme)
    .filter(({ word, index }) => (word.learningLevel ?? Math.min(15, Math.floor(index / 2) + 1)) <= difficulty)
    .map(item => item.word);
  const selectTheme = (theme: SortTheme) => {
    const ready = unlocked(theme);
    return shuffleArray(ready.length >= 2 ? ready : byTheme(theme).map(item => item.word)).slice(0, 3);
  };
  const foods = selectTheme('comida');
  const animals = selectTheme('animales');
  return shuffleArray([...foods, ...animals]);
}

export const WordSortGame: React.FC<GameProps> = ({
  difficulty,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const cards = useMemo(() => selectSortWords(language, difficulty), [difficulty, language]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sorted, setSorted] = useState<Partial<Record<SortCategory, Word[]>>>({});
  const [feedback, setFeedback] = useState<{ word: Word; correct: boolean } | null>(null);
  const { recordAnswer, finish } = useGameProgress('word_sort', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const currentWord = cards[currentIndex];
  const checkedCount = currentIndex;

  useEffect(() => {
    if (!introSpoken || !currentWord) return;
    const timeout = window.setTimeout(() => speak(copy.wordSortHint, language), 250);
    return () => window.clearTimeout(timeout);
  }, [copy.wordSortHint, currentWord, introSpoken, language, speak]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => {
      if (currentIndex + 1 >= cards.length) {
        finish(cards.map(word => word.id));
        return;
      }
      setCurrentIndex(index => index + 1);
      setFeedback(null);
    }, feedback.correct ? 700 : 1100);
    return () => window.clearTimeout(timeout);
  }, [cards, currentIndex, feedback, finish]);

  if (!currentWord || cards.length < 4) return <EmptyGame language={language} />;

  const chooseCategory = (category: SortCategory) => {
    if (feedback) return;
    const correct = currentWord.theme === CATEGORY_THEME[category];
    setFeedback({ word: currentWord, correct });
    recordAnswer(currentWord, correct, currentWord, false);
    if (correct) {
      setSorted(items => ({
        ...items,
        [category]: [...(items[category] || []), currentWord],
      }));
      speak(currentWord.audioText || currentWord.text, language);
    } else {
      speak(copy.tryAgain, language);
    }
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={checkedCount} total={cards.length} label={copy.wordSortProgress} icon="A–Z" language={language} />
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-cyan-100 via-white to-lime-100 p-4 sm:p-6">
        <h2 className="text-xl font-black text-slate-900 sm:text-3xl">{copy.wordSortTitle}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-700">{copy.wordSortHint}</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {(['food', 'animals'] as const).map(category => (
          <div
            key={category}
            className={`min-h-24 rounded-2xl border-2 border-dashed p-3 sm:min-h-28 ${
              category === 'food' ? 'border-orange-300 bg-orange-50' : 'border-sky-300 bg-sky-50'
            }`}
          >
            <p className={`text-center text-sm font-black ${category === 'food' ? 'text-orange-900' : 'text-sky-900'}`}>
              {CATEGORY_LABELS[language][category]}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {(sorted[category] || []).map(word => (
                <span
                  key={word.id}
                  lang={word.language}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-extrabold text-slate-800 shadow-xs"
                >
                  <WordIcon icon={word.imageUrl} esWord={word.translation} size="xs" />
                  <span>{word.text}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`relative mx-auto flex min-h-36 max-w-md flex-col items-center justify-center rounded-3xl border-2 px-4 py-5 text-center transition ${
        feedback
          ? feedback.correct ? 'border-emerald-500 bg-emerald-100' : 'border-rose-500 bg-rose-100'
          : 'border-slate-200 bg-white shadow-sm'
      }`}>
        {!feedback && (
          <button
            type="button"
            onClick={() => speak(currentWord.audioText || currentWord.text, language)}
            aria-label={copy.listen}
            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 disabled:opacity-50"
          >
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {feedback?.correct && <ArrowDownToLine className="mb-1 h-5 w-5 text-emerald-700" aria-hidden="true" />}
        <WordIcon icon={currentWord.imageUrl} esWord={currentWord.translation} size="xl" className="mb-1.5 text-4xl sm:text-5xl" />
        <span className={`text-2xl font-black sm:text-3xl ${feedback && !feedback.correct ? 'text-rose-900 line-through' : 'text-slate-900'}`} lang={currentWord.language}>
          {currentWord.text}
        </span>
        {feedback && (
          <p aria-live="polite" className={`mt-2 text-sm font-black ${feedback.correct ? 'text-emerald-800' : 'text-rose-800'}`}>
            {feedback.correct ? copy.correct : `${copy.tryAgain} ${currentWord.translation}`}
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {(['food', 'animals'] as const).map(category => (
          <button
            key={category}
            type="button"
            disabled={Boolean(feedback)}
            onClick={() => chooseCategory(category)}
            className={`min-h-14 rounded-2xl px-3 text-base font-black text-white shadow-[0_4px_0_rgba(15,23,42,.2)] transition hover:-translate-y-0.5 disabled:opacity-60 sm:text-lg ${
              category === 'food' ? 'bg-orange-500' : 'bg-sky-600'
            }`}
          >
            {CATEGORY_LABELS[language][category]}
          </button>
        ))}
      </div>
    </section>
  );
};
