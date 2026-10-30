import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUp, Volume2 } from 'lucide-react';
import { GameProps, Language, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';

interface TrainChallenge {
  id: string;
  clue: string;
  words: string[];
}

interface TrainToken {
  id: string;
  text: string;
}

const CHALLENGE_ICONS: Record<string, string> = {
  sun: '☀️',
  house: '🏡',
  cat: '🐱',
  dog: '🐶',
  girl: '👧',
  ball: '⚽',
  brother: '👦',
  book: '📖',
  outside: '🏃',
};

const WORD_TOKEN_ICONS: Record<string, string> = {
  sol: '☀️', soleil: '☀️', zon: '☀️', sun: '☀️', yellow: '💛', amarillo: '💛', jaune: '💛', gele: '💛',
  casa: '🏡', maison: '🏡', huis: '🏡', house: '🏡', grande: '🏰', big: '🏰', grote: '🏰',
  gato: '🐱', chat: '🐱', kat: '🐱', cat: '🐱', duerme: '💤', dort: '💤', slaapt: '💤', sleeps: '💤',
  perro: '🐶', chien: '🐶', hond: '🐶', dog: '🐶', bebe: '🥛', drinkt: '🥛', drinks: '🥛', agua: '💧', water: '💧',
  niña: '👧', fille: '👧', meisje: '👧', girl: '👧', come: '🍎', eet: '🍎', eats: '🍎', pan: '🍞', pain: '🍞', brood: '🍞', bread: '🍞',
  hermano: '👦', frère: '👦', broer: '👦', brother: '👦', pelota: '⚽', ballon: '⚽', bal: '⚽', ball: '⚽', juega: '🎮', joue: '🎮', speelt: '🎮', plays: '🎮',
  libro: '📖', livre: '📖', boek: '📖', book: '📖', lee: '👓', lit: '👓', leest: '👓', reads: '👓',
  corre: '👟', court: '👟', loopt: '👟', runs: '👟', rápido: '⚡', vite: '⚡', snel: '⚡', fast: '⚡',
};

const getTokenIcon = (wordText: string, challengeId: string): string => {
  const clean = wordText.toLowerCase().trim();
  return WORD_TOKEN_ICONS[clean] || CHALLENGE_ICONS[challengeId] || '✨';
};

const CHALLENGES: Record<Language, [TrainChallenge[], TrainChallenge[], TrainChallenge[]]> = {
  es: [
    [
      { id: 'sun', clue: 'El sol amarillo', words: ['el', 'sol', 'amarillo'] },
      { id: 'house', clue: 'La casa grande', words: ['la', 'casa', 'grande'] },
      { id: 'cat', clue: 'El gato duerme', words: ['el', 'gato', 'duerme'] },
    ],
    [
      { id: 'dog', clue: 'Mi perro bebe agua', words: ['mi', 'perro', 'bebe', 'agua'] },
      { id: 'girl', clue: 'La niña come pan', words: ['la', 'niña', 'come', 'pan'] },
      { id: 'ball', clue: 'El niño tiene pelota', words: ['el', 'niño', 'tiene', 'pelota'] },
    ],
    [
      { id: 'brother', clue: 'Mi hermano juega al fútbol', words: ['mi', 'hermano', 'juega', 'al', 'fútbol'] },
      { id: 'book', clue: 'La niña lee un libro', words: ['la', 'niña', 'lee', 'un', 'libro'] },
      { id: 'outside', clue: 'El perro corre muy rápido', words: ['el', 'perro', 'corre', 'muy', 'rápido'] },
    ],
  ],
  fr: [
    [
      { id: 'sun', clue: 'El sol amarillo', words: ['le', 'soleil', 'jaune'] },
      { id: 'house', clue: 'La casa grande', words: ['la', 'grande', 'maison'] },
      { id: 'cat', clue: 'El gato duerme', words: ['le', 'chat', 'dort'] },
    ],
    [
      { id: 'dog', clue: 'Mi perro duerme mucho', words: ['mon', 'chien', 'dort', 'beaucoup'] },
      { id: 'girl', clue: 'La niña lee bien', words: ['la', 'fille', 'lit', 'bien'] },
      { id: 'ball', clue: 'Mi hermano juega fuera', words: ['mon', 'frère', 'joue', 'dehors'] },
    ],
    [
      { id: 'brother', clue: 'Mi hermano juega al balón', words: ['mon', 'frère', 'joue', 'au', 'ballon'] },
      { id: 'book', clue: 'La niña lee un libro', words: ['la', 'fille', 'lit', 'un', 'livre'] },
      { id: 'outside', clue: 'El perro corre muy rápido', words: ['le', 'chien', 'court', 'très', 'vite'] },
    ],
  ],
  'nl-BE': [
    [
      { id: 'sun', clue: 'El sol amarillo', words: ['de', 'gele', 'zon'] },
      { id: 'house', clue: 'La casa grande', words: ['het', 'grote', 'huis'] },
      { id: 'cat', clue: 'El gato duerme', words: ['de', 'kat', 'slaapt'] },
    ],
    [
      { id: 'dog', clue: 'Mi perro bebe agua', words: ['mijn', 'hond', 'drinkt', 'water'] },
      { id: 'girl', clue: 'La niña come pan', words: ['het', 'meisje', 'eet', 'brood'] },
      { id: 'ball', clue: 'Mi hermano juega hoy', words: ['mijn', 'broer', 'speelt', 'vandaag'] },
    ],
    [
      { id: 'brother', clue: 'Mi hermano tiene una pelota', words: ['mijn', 'broer', 'heeft', 'een', 'bal'] },
      { id: 'book', clue: 'La niña lee un libro', words: ['het', 'meisje', 'leest', 'een', 'boek'] },
      { id: 'outside', clue: 'El perro corre muy rápido', words: ['de', 'hond', 'loopt', 'heel', 'snel'] },
    ],
  ],
  ar: [
    [
      { id: 'sun', clue: 'El sol amarillo', words: ['شمس', 'صفراء', 'جميلة'] },
      { id: 'house', clue: 'La casa grande', words: ['بيت', 'كبير', 'جميل'] },
      { id: 'cat', clue: 'El gato duerme', words: ['قط', 'صغير', 'نائم'] },
    ],
    [
      { id: 'dog', clue: 'Mi perro bebe agua', words: ['كلبي', 'يشرب', 'ماءً', 'بارداً'] },
      { id: 'girl', clue: 'La niña come pan', words: ['الطفلة', 'تأكل', 'خبزاً', 'لذيذاً'] },
      { id: 'ball', clue: 'Mi hermano tiene una pelota', words: ['أخي', 'يملك', 'كرة', 'جديدة'] },
    ],
    [
      { id: 'brother', clue: 'Mi hermano juega con la pelota', words: ['أخي', 'يلعب', 'بالكرة', 'في', 'الحديقة'] },
      { id: 'book', clue: 'La niña pequeña lee un libro', words: ['الطفلة', 'الصغيرة', 'تقرأ', 'كتاباً', 'جميلاً'] },
      { id: 'outside', clue: 'El perro corre muy rápido', words: ['الكلب', 'يجري', 'بسرعة', 'كبيرة', 'جداً'] },
    ],
  ],
  en: [
    [
      { id: 'sun', clue: 'The yellow sun', words: ['the', 'yellow', 'sun'] },
      { id: 'house', clue: 'The big house', words: ['the', 'big', 'house'] },
      { id: 'cat', clue: 'The cat sleeps', words: ['the', 'cat', 'sleeps'] },
    ],
    [
      { id: 'dog', clue: 'My dog drinks water', words: ['my', 'dog', 'drinks', 'water'] },
      { id: 'girl', clue: 'The girl eats bread', words: ['the', 'girl', 'eats', 'bread'] },
      { id: 'ball', clue: 'My brother plays today', words: ['my', 'brother', 'plays', 'today'] },
    ],
    [
      { id: 'brother', clue: 'My brother has a ball', words: ['my', 'brother', 'has', 'a', 'ball'] },
      { id: 'book', clue: 'The girl reads a book', words: ['the', 'girl', 'reads', 'a', 'book'] },
      { id: 'outside', clue: 'The dog runs very fast', words: ['the', 'dog', 'runs', 'very', 'fast'] },
    ],
  ],
};

function getDifficultyGroup(difficulty: number): number {
  if (difficulty <= 5) return 0;
  if (difficulty <= 10) return 1;
  return 2;
}

function createSentence(challenge: TrainChallenge): string {
  return challenge.words.join(' ');
}

export const WordTrainGame: React.FC<GameProps> = ({
  words,
  difficulty,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const challenges = useMemo(
    () => CHALLENGES[language][getDifficultyGroup(difficulty)].slice(0, Math.min(3, Math.max(2, words.length))),
    [difficulty, language, words.length],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [placedState, setPlacedState] = useState<{ questionIndex: number; slots: Array<string | null> }>({
    questionIndex: 0,
    slots: [],
  });
  const [solved, setSolved] = useState(false);
  const [orderWrong, setOrderWrong] = useState(false);
  const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
  const errorReported = useRef(-1);
  const { recordAnswer, finish } = useGameProgress('word_train', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const challenge = challenges[questionIndex];
  const question = words[questionIndex % Math.max(1, words.length)];
  const slots = placedState.questionIndex === questionIndex && placedState.slots.length === (challenge?.words.length || 0)
    ? placedState.slots
    : Array<string | null>(challenge?.words.length || 0).fill(null);
  const tokens = useMemo<TrainToken[]>(
    () => challenge
      ? shuffleArray(challenge.words.map((text, index) => ({ id: `${questionIndex}-${index}`, text })))
      : [],
    [challenge, questionIndex],
  );
  const sentence = challenge ? createSentence(challenge) : '';
  const isCorrectOrder = Boolean(challenge) && slots.every((tokenId, index) => (
    tokens.find(token => token.id === tokenId)?.text === challenge.words[index]
  ));

  useEffect(() => {
    if (!challenge || !introSpoken) return;
    const timeout = window.setTimeout(() => speak(sentence, language), 350);
    return () => window.clearTimeout(timeout);
  }, [challenge, introSpoken, language, sentence, speak]);

  const updateSlots = (nextSlots: Array<string | null>) => {
    setPlacedState({ questionIndex, slots: nextSlots });
    setOrderWrong(false);
  };

  const placeToken = (tokenId: string, targetIndex: number) => {
    if (solved) return;
    const nextSlots = [...slots];
    const previousIndex = nextSlots.indexOf(tokenId);
    if (previousIndex === targetIndex) return;
    const displacedToken = nextSlots[targetIndex];

    if (previousIndex >= 0) {
      nextSlots[previousIndex] = displacedToken;
    }
    nextSlots[targetIndex] = tokenId;
    updateSlots(nextSlots);
    const token = tokens.find(item => item.id === tokenId);
    if (token) speak(token.text, language);
  };

  const placeNextToken = (tokenId: string) => {
    const emptyIndex = slots.findIndex(tokenIdInSlot => tokenIdInSlot === null);
    if (emptyIndex >= 0) placeToken(tokenId, emptyIndex);
  };

  const moveToken = (slotIndex: number, direction: -1 | 1) => {
    if (solved) return;
    const targetIndex = slotIndex + direction;
    if (targetIndex < 0 || targetIndex >= slots.length) return;
    const nextSlots = [...slots];
    [nextSlots[slotIndex], nextSlots[targetIndex]] = [nextSlots[targetIndex], nextSlots[slotIndex]];
    updateSlots(nextSlots);
  };

  const checkOrder = () => {
    if (!challenge || !question || solved || slots.some(tokenId => tokenId === null)) return;
    if (!isCorrectOrder) {
      if (errorReported.current !== questionIndex) {
        errorReported.current = questionIndex;
        recordAnswer(question, false, question, false);
      }
      setOrderWrong(true);
      speak(copy.tryAgain, language);
      return;
    }

    setSolved(true);
    recordAnswer(question, true, question, false);
    speak(`${copy.correct} ${sentence}`, language);
    window.setTimeout(() => {
      if (questionIndex + 1 >= challenges.length) {
        finish(words.slice(0, challenges.length).map(word => word.id));
        return;
      }
      errorReported.current = -1;
      setPlacedState({ questionIndex: questionIndex + 1, slots: [] });
      setQuestionIndex(index => index + 1);
      setSolved(false);
      setOrderWrong(false);
    }, 1300);
  };

  if (!challenge || !question) return <EmptyGame language={language} />;

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={questionIndex + 1} total={challenges.length} label={copy.trainProgress} icon="🚂" language={language} />

      <div className="mb-5 rounded-3xl bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl drop-shadow-sm select-none" role="img" aria-hidden="true">
              {CHALLENGE_ICONS[challenge.id] || '🚂'}
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-800">{copy.trainTitle}</p>
              <h2 className="mt-1 text-xl font-black leading-tight text-slate-900 sm:text-2xl">{copy.sentencePrompt}</h2>
              <p className="mt-1 text-lg font-extrabold text-orange-800 sm:text-xl">{challenge.clue}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => speak(sentence, language)}
            aria-label={copy.listenPhrase}
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-4 font-extrabold text-amber-900 shadow-sm hover:bg-amber-50"
          >
            <Volume2 size={20} aria-hidden="true" />
            <span className="hidden sm:inline">{copy.listenPhrase}</span>
          </button>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700">{copy.orderSentence}</p>
      </div>

      <div className="mb-5 grid gap-2" aria-label={copy.orderSentence}>
        {slots.map((tokenId, slotIndex) => {
          const token = tokens.find(item => item.id === tokenId);
          const misplaced = Boolean(token && token.text !== challenge.words[slotIndex]);
          return (
            <div key={`${questionIndex}-slot-${slotIndex}`} className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                disabled={!token || solved}
                onClick={() => {
                  if (!token) return;
                  const nextSlots = [...slots];
                  nextSlots[slotIndex] = null;
                  updateSlots(nextSlots);
                  speak(token.text, language);
                }}
                onDragOver={event => event.preventDefault()}
                onDrop={event => {
                  event.preventDefault();
                  if (draggedTokenId) placeToken(draggedTokenId, slotIndex);
                  setDraggedTokenId(null);
                }}
                aria-label={token ? `${copy.removeWord}: ${token.text}` : `${copy.emptySlot} ${slotIndex + 1}`}
                className={`flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-3 text-lg font-black transition sm:min-h-16 sm:text-xl ${
                  token
                    ? solved ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                      : orderWrong && misplaced ? 'border-rose-500 bg-rose-100 text-rose-900'
                        : 'border-orange-300 bg-white text-slate-900'
                    : 'border-amber-300 bg-amber-50 text-amber-700'
                }`}
              >
                {token ? (
                  <>
                    <span className="text-xl sm:text-2xl" aria-hidden="true">{getTokenIcon(token.text, challenge.id)}</span>
                    <span>{token.text}</span>
                  </>
                ) : `${copy.emptySlot} ${slotIndex + 1} ⬇️`}
              </button>
              {token && !solved && (
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveToken(slotIndex, -1)}
                    disabled={slotIndex === 0}
                    aria-label={copy.moveEarlier}
                    className="flex h-7 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-900 disabled:opacity-30"
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveToken(slotIndex, 1)}
                    disabled={slotIndex === slots.length - 1}
                    aria-label={copy.moveLater}
                    className="flex h-7 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-900 disabled:opacity-30"
                  >
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-sky-50 p-3 sm:p-4">
        <p className="mb-3 text-center text-sm font-black text-sky-900">{copy.orderSentence}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {tokens.map(token => {
            const isPlaced = slots.includes(token.id);
            return (
              <motion.button
                key={token.id}
                type="button"
                draggable={!solved}
                disabled={solved || isPlaced}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  if (isPlaced) return;
                  placeNextToken(token.id);
                }}
                onDragStart={() => setDraggedTokenId(token.id)}
                onDragEnd={() => setDraggedTokenId(null)}
                className={`inline-flex items-center gap-2 min-h-12 rounded-2xl border-2 px-4 py-2 text-base sm:text-lg font-black shadow-[0_4px_0_#c7dfeb] transition ${
                  isPlaced ? 'border-transparent bg-transparent text-transparent shadow-none' : 'border-white bg-white text-sky-900 hover:-translate-y-0.5 hover:bg-sky-100'
                }`}
                aria-label={token.text}
                aria-hidden={isPlaced}
              >
                {isPlaced ? '\u00a0' : (
                  <>
                    <span className="text-xl" aria-hidden="true">{getTokenIcon(token.text, challenge.id)}</span>
                    <span>{token.text}</span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {solved && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">
          {copy.correct} {challenge.clue} 🎉
        </p>
      )}
      {orderWrong && !solved && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgain} 💪
        </p>
      )}

      <button
        type="button"
        onClick={checkOrder}
        disabled={solved || slots.some(tokenId => tokenId === null)}
        className="mt-5 min-h-14 w-full rounded-2xl bg-emerald-500 px-5 text-lg font-black text-white shadow-[0_5px_0_#16834f] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:text-xl"
      >
        {copy.checkOrder} ✅
      </button>
    </section>
  );
};
