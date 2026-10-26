import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { GameProps, Language, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';

interface PhrasePuzzle {
  clue: string;
  phrase: string;
  words: string[];
}

const PHRASES: Record<Language, PhrasePuzzle[]> = {
  es: [
    { clue: 'el sol amarillo', phrase: 'el sol amarillo', words: ['el', 'sol', 'amarillo'] },
    { clue: 'la casa grande', phrase: 'la casa grande', words: ['la', 'casa', 'grande'] },
    { clue: 'el gato pequeño', phrase: 'el gato pequeño', words: ['el', 'gato', 'pequeño'] },
  ],
  fr: [
    { clue: 'el sol amarillo', phrase: 'le soleil jaune', words: ['le', 'soleil', 'jaune'] },
    { clue: 'la casa grande', phrase: 'la grande maison', words: ['la', 'grande', 'maison'] },
    { clue: 'el gato pequeño', phrase: 'le petit chat', words: ['le', 'petit', 'chat'] },
  ],
  'nl-BE': [
    { clue: 'el sol amarillo', phrase: 'de gele zon', words: ['de', 'gele', 'zon'] },
    { clue: 'la casa grande', phrase: 'het grote huis', words: ['het', 'grote', 'huis'] },
    { clue: 'el gato pequeño', phrase: 'de kleine kat', words: ['de', 'kleine', 'kat'] },
  ],
  ar: [
    { clue: 'el sol amarillo', phrase: 'الشمس صفراء', words: ['الشمس', 'صفراء'] },
    { clue: 'la casa grande', phrase: 'البيت كبير', words: ['البيت', 'كبير'] },
    { clue: 'el gato pequeño', phrase: 'القط صغير', words: ['القط', 'صغير'] },
  ],
};

interface PhraseToken {
  id: string;
  text: string;
}

export const WordTrainGame: React.FC<GameProps> = ({ words, difficulty, language, onCorrect, onWrong, onComplete }) => {
  const isPhraseLevel = difficulty >= 13;
  const roundWords = useMemo(
    () => words.slice(0, isPhraseLevel ? PHRASES[language].length : Math.min(6, 2 + Math.floor((difficulty - 1) / 3))),
    [difficulty, isPhraseLevel, language, words],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [placedTokens, setPlacedTokens] = useState<PhraseToken[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
  const { recordAnswer, finish } = useGameProgress('word_train', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const { playError } = useSound();
  const copy = GAME_COPY[language];
  const question = roundWords[questionIndex];
  const phrase = isPhraseLevel ? PHRASES[language][questionIndex] : undefined;
  const phraseTokens = useMemo<PhraseToken[]>(
    () => phrase ? shuffleArray(phrase.words.map((text, index) => ({ id: `${questionIndex}-${index}`, text }))) : [],
    [phrase, questionIndex],
  );
  const options = useMemo(() => {
    if (!question || isPhraseLevel) return [];
    const distractors = shuffleArray(words.filter(word => word.id !== question.id)).slice(0, Math.min(5, Math.ceil(difficulty / 3)));
    return shuffleArray([question, ...distractors]);
  }, [difficulty, isPhraseLevel, question, words]);

  useEffect(() => {
    if (!answerId || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 === roundWords.length) {
        finish(roundWords.map(word => word.id));
        return;
      }
      setAnswerId(null);
      setQuestionIndex(index => index + 1);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [answerId, finish, question, questionIndex, roundWords]);

  useEffect(() => {
    if (feedback !== 'correct' || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 === roundWords.length) {
        finish(roundWords.map(word => word.id));
        return;
      }
      setPlacedTokens([]);
      setFeedback(null);
      setQuestionIndex(index => index + 1);
    }, 1100);
    return () => window.clearTimeout(timeout);
  }, [feedback, finish, question, questionIndex, roundWords]);

  if (!question) return <EmptyGame language={language} />;

  const moveTokenToSentence = (token: PhraseToken, targetIndex = placedTokens.length) => {
    setPlacedTokens(current => {
      const withoutToken = current.filter(item => item.id !== token.id);
      withoutToken.splice(Math.min(targetIndex, withoutToken.length), 0, token);
      return withoutToken;
    });
    setFeedback(null);
    speak(token.text, language);
  };

  const removeTokenFromSentence = (tokenId: string) => {
    const token = placedTokens.find(item => item.id === tokenId);
    setPlacedTokens(current => current.filter(token => token.id !== tokenId));
    setFeedback(null);
    if (token) speak(token.text, language);
  };

  const checkSentence = () => {
    if (!phrase || placedTokens.length !== phrase.words.length) return;
    const correct = placedTokens.map(token => token.text).join(' ') === phrase.phrase;
    if (!correct) {
      setFeedback('wrong');
      playError();
      speak(copy.tryAgain, language);
      return;
    }
    setFeedback('correct');
    recordAnswer(question, true);
    speak(copy.correct, language);
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#f6fbff] p-4 shadow-[0_18px_45px_rgba(51,113,166,.14)] ring-1 ring-sky-100 sm:p-6">
      <GameProgress current={questionIndex + 1} total={roundWords.length} label={isPhraseLevel ? copy.sentenceLevel : copy.wordLevel} icon="🚉" language={language} />
      <div className="mb-5 flex items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-blue-50 to-yellow-100 p-4 sm:gap-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black leading-relaxed text-slate-900 sm:text-3xl">
            {isPhraseLevel ? copy.sentencePrompt : copy.trainTitle}
          </h2>
          {!isPhraseLevel && <p className="mt-2 text-sm font-semibold text-slate-600">{copy.trainHint}</p>}
          {isPhraseLevel ? (
            <p className="mt-3 text-2xl font-black text-blue-800 sm:text-3xl">{phrase?.clue}</p>
          ) : (
            <>
              <p className="mt-3 text-3xl" aria-hidden="true">{question.imageUrl || '✨'}</p>
              <p className="mt-1 text-xl font-black text-blue-800 sm:text-2xl">{question.translation}</p>
            </>
          )}
          <button
            type="button"
            onClick={() => speak(isPhraseLevel ? phrase?.phrase || '' : question.audioText || question.text, language)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-blue-800 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50"
            aria-label={copy.listen}
          >
            <Volume2 className="h-4 w-4" /> {copy.listen}
          </button>
        </div>
        <img src="/games/train.svg" alt="" className="h-16 w-24 shrink-0 object-contain sm:h-28 sm:w-48" />
      </div>

      {isPhraseLevel && phrase ? (
        <>
          <div
            onDragOver={event => event.preventDefault()}
            onDrop={event => {
              event.preventDefault();
              const token = phraseTokens.find(item => item.id === draggedTokenId);
              if (token) moveTokenToSentence(token);
              setDraggedTokenId(null);
            }}
            className="mb-4 flex min-h-20 flex-wrap items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-sky-300 bg-white/80 p-3"
            aria-label={copy.sentencePrompt}
          >
            {placedTokens.map((token, index) => (
              <button
                key={token.id}
                type="button"
                draggable
                onDragStart={() => setDraggedTokenId(token.id)}
                onDragOver={event => event.preventDefault()}
                onDrop={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  const moved = phraseTokens.find(item => item.id === draggedTokenId)
                    || placedTokens.find(item => item.id === draggedTokenId);
                  if (moved) moveTokenToSentence(moved, index);
                  setDraggedTokenId(null);
                }}
                onClick={() => removeTokenFromSentence(token.id)}
                disabled={feedback === 'correct'}
                className="min-h-12 rounded-2xl bg-sky-100 px-4 text-lg font-black text-sky-900 shadow-sm"
                aria-label={`${copy.removeWord}: ${token.text}`}
              >
                {token.text}
              </button>
            ))}
            {placedTokens.length === 0 && <span className="text-sm font-bold text-slate-400">{copy.orderSentence}</span>}
          </div>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {phraseTokens.filter(token => !placedTokens.some(placed => placed.id === token.id)).map(token => (
              <button
                key={token.id}
                type="button"
                draggable
                onDragStart={() => setDraggedTokenId(token.id)}
                onClick={() => moveTokenToSentence(token)}
                disabled={feedback === 'correct'}
                className="min-h-12 rounded-2xl border-2 border-white bg-amber-100 px-4 text-lg font-black text-amber-900 shadow-[0_4px_0_#e6c579]"
              >
                {token.text}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={placedTokens.length !== phrase.words.length || feedback === 'correct'}
            onClick={checkSentence}
            className="min-h-12 w-full rounded-2xl bg-emerald-500 px-5 text-base font-black text-white shadow-[0_4px_0_#328248] disabled:opacity-50"
          >
            {copy.checkOrder}
          </button>
          {feedback && (
            <p aria-live="polite" className="mt-3 text-center text-lg font-black text-emerald-800">
              {feedback === 'correct' ? copy.correct : copy.tryAgain}
            </p>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map(option => {
            const selected = answerId === option.id;
            const correct = option.id === question.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                disabled={answerId !== null}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setAnswerId(option.id);
                  recordAnswer(question, correct, option);
                  speak(`${copy.sayWord} ${option.text}`, language);
                }}
                aria-label={option.translation}
                lang={option.language}
                dir={option.language === 'ar' ? 'rtl' : 'auto'}
                className={`flex min-h-28 flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition sm:min-h-36 ${
                  selected && correct
                    ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                    : selected ? 'border-rose-300 bg-rose-50 text-rose-800'
                      : 'border-white bg-white text-slate-800 shadow-[0_5px_0_#d5e7f4] hover:-translate-y-1 hover:bg-sky-50'
                }`}
              >
                <span className="text-4xl sm:text-5xl" aria-hidden="true">{option.imageUrl || '✨'}</span>
                <span className="mt-2 text-base font-black sm:text-lg">{option.text}</span>
              </motion.button>
            );
          })}
        </div>
      )}
      {answerId && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-blue-800">
          {answerId === question.id ? copy.correct : copy.tryAgain}
        </p>
      )}
    </section>
  );
};
