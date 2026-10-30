import React, { useMemo, useState } from 'react';
import { Check, Volume2, X } from 'lucide-react';
import { GameProps } from '../types';
import { GAME_COPY } from '../data/gameCopy';
import { shuffleArray } from '../lib/utils';
import { WordIcon } from '../components/WordIcon';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';
import { AiCompanionWidget } from '../components/AiCompanionWidget';

const LESSON_UI = {
  es: { title: 'Lección de palabras', image: 'Elige el dibujo', meaning: 'Elige el significado', listen: 'Escucha y responde', spell: 'Forma la palabra', build: 'Tus letras', listenButton: 'Escuchar', step: 'Reto' },
  en: { title: 'Word lesson', image: 'Choose the picture', meaning: 'Choose the meaning', listen: 'Listen and answer', spell: 'Build the word', build: 'Your letters', listenButton: 'Listen', step: 'Challenge' },
  fr: { title: 'Leçon de mots', image: 'Choisis le dessin', meaning: 'Choisis le sens', listen: 'Écoute et réponds', spell: 'Forme le mot', build: 'Tes lettres', listenButton: 'Écouter', step: 'Défi' },
  'nl-BE': { title: 'Woordles', image: 'Kies het plaatje', meaning: 'Kies de betekenis', listen: 'Luister en antwoord', spell: 'Maak het woord', build: 'Jouw letters', listenButton: 'Luisteren', step: 'Oefening' },
  ar: { title: 'درس الكلمات', image: 'اختر الصورة', meaning: 'اختر المعنى', listen: 'استمع وأجب', spell: 'كوّن الكلمة', build: 'حروفك', listenButton: 'استمع', step: 'تحدٍ' },
} as const;

type AnswerState = 'correct' | 'wrong' | null;

export const UnifiedLessonGame: React.FC<GameProps> = ({ words, language, nativeLanguage, onCorrect, onWrong, onComplete }) => {
  const questions = useMemo(() => words.slice(0, Math.min(6, words.length)), [words]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [usedLetters, setUsedLetters] = useState<number[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const { recordAnswer, finish } = useGameProgress('unified_lesson', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const ui = LESSON_UI[language];
  const gameCopy = GAME_COPY[language];
  const question = questions[questionIndex];
  const mode = questionIndex % 4;
  const options = useMemo(() => {
    if (!question) return [];
    return shuffleArray([question, ...shuffleArray(words.filter(word => word.id !== question.id)).slice(0, 3)]);
  }, [question, words]);
  const letterTiles = useMemo(() => question ? shuffleArray(Array.from(question.text.toLocaleLowerCase(language))) : [], [language, question]);

  const submitAnswer = (correct: boolean, selectedWord = question) => {
    if (!question || answerState) return;
    setAnswerState(correct ? 'correct' : 'wrong');
    recordAnswer(question, correct, selectedWord, mode !== 2);
  };

  const advance = () => {
    if (questionIndex + 1 >= questions.length) {
      finish(questions.map(word => word.id));
      return;
    }
    setQuestionIndex(index => index + 1);
    setAnswerState(null);
    setUsedLetters([]);
    setSelectedLetters([]);
  };

  const chooseLetter = (tileIndex: number) => {
    if (answerState || usedLetters.includes(tileIndex)) return;
    const nextUsed = [...usedLetters, tileIndex];
    const nextLetters = [...selectedLetters, letterTiles[tileIndex]];
    setUsedLetters(nextUsed);
    setSelectedLetters(nextLetters);
    if (nextUsed.length === letterTiles.length) {
      const correct = nextLetters.join('') === question.text.toLocaleLowerCase(language);
      setAnswerState(correct ? 'correct' : 'wrong');
      recordAnswer(question, correct, question, false);
    }
  };

  if (!question) {
    return <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 text-center font-bold text-slate-700">No hay palabras disponibles para esta lección.</section>;
  }

  const prompt = mode === 0 ? ui.image : mode === 1 ? ui.meaning : mode === 2 ? ui.listen : ui.spell;

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto flex w-full max-w-2xl flex-col rounded-3xl border-2 border-white bg-white p-4 shadow-xl sm:p-6">
      <header className="mb-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black text-emerald-800">
          <div className="flex items-center gap-2">
            <span>{ui.title}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-900">{questionIndex + 1}/{questions.length}</span>
          </div>
          <AiCompanionWidget
            currentWord={question}
            language={language}
            nativeLanguage={nativeLanguage || 'es'}
            compact
          />
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-emerald-100" role="progressbar" aria-label={`${ui.step} ${questionIndex + 1}`} aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={questionIndex + 1}>
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-300" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </header>

      <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-lime-50 via-emerald-50 to-sky-50 p-4 text-center">
        <p className="text-xs font-black text-emerald-800">{prompt}</p>
        {mode === 0 && <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{question.translation}</h1>}
        {mode === 1 && <h1 lang={language} dir={language === 'ar' ? 'rtl' : 'auto'} className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">{question.text}</h1>}
        {mode === 2 && (
          <button type="button" onClick={() => speak(question.audioText || question.text, language)} className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-black text-emerald-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            <Volume2 className="h-5 w-5" /> {ui.listenButton}
          </button>
        )}
        {mode === 3 && (
          <div className="mt-2 flex items-center gap-3">
            <WordIcon icon={question.imageUrl} esWord={question.translation} size="xl" className="text-4xl" />
            <span className="text-lg font-black text-slate-900">{question.translation}</span>
          </div>
        )}
      </div>

      {mode === 3 ? (
        <div className="mt-4">
          <div className="mb-3 flex min-h-12 flex-wrap items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-2" aria-label={ui.build}>
            {selectedLetters.length ? selectedLetters.map((letter, index) => <span key={`${letter}-${index}`} className="rounded-lg bg-white px-2 py-1 text-lg font-black text-slate-900 shadow-sm">{letter}</span>) : <span className="text-xs font-bold text-slate-500">{ui.build}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {letterTiles.map((letter, index) => (
              <button key={`${letter}-${index}`} type="button" disabled={usedLetters.includes(index) || answerState !== null} onClick={() => chooseLetter(index)} className="flex h-11 min-w-10 items-center justify-center rounded-xl border-2 border-emerald-100 bg-white px-2 text-lg font-black text-slate-900 shadow-sm disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" aria-label={`${ui.build}: ${letter}`}>
                {letter}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
          {options.map((option, index) => {
            const correct = option.id === question.id;
            const revealed = answerState !== null;
            const label = mode === 0 ? option.text : option.translation;
            return (
              <button key={`${question.id}-${option.id}`} type="button" disabled={revealed} onClick={() => submitAnswer(correct, option)} lang={mode === 0 ? option.language : undefined} dir={mode === 0 && option.language === 'ar' ? 'rtl' : 'auto'} className={`flex min-h-20 items-center gap-2 rounded-2xl border-2 p-2.5 text-left font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:min-h-24 sm:p-3 ${revealed && correct ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : revealed ? 'border-slate-100 bg-slate-50 text-slate-500 opacity-60' : 'border-slate-100 bg-white text-slate-900 hover:border-emerald-300 hover:bg-emerald-50'}`}>
                {mode === 0 && <WordIcon icon={option.imageUrl} esWord={option.translation} size="lg" className="shrink-0 text-3xl" />}
                <span className="min-w-0 break-words text-sm sm:text-base">{label}</span>
                <span className="sr-only">{gameCopy.optionLabel} {index + 1}</span>
              </button>
            );
          })}
        </div>
      )}

      {answerState && (
        <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 ${answerState === 'correct' ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`} aria-live="polite">
          <p className="flex items-center gap-2 font-black">
            {answerState === 'correct' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            {answerState === 'correct' ? gameCopy.correct : `${gameCopy.tryAgain} ${question.text}`}
          </p>
          <button type="button" onClick={advance} className="min-h-11 rounded-xl bg-emerald-700 px-5 font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
            {gameCopy.continue}
          </button>
        </div>
      )}
    </section>
  );
};
