import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { GameProps, Word } from '../types';
import { shuffleArray } from '../lib/utils';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';

export const SoundEchoGame: React.FC<GameProps> = ({
  words,
  difficulty,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const sequence = useMemo(
    () => shuffleArray(words.filter(word => !word.text.trim().includes(' ')))
      .slice(0, Math.min(words.length, 2 + Math.floor((difficulty - 1) / 4))),
    [difficulty, words],
  );
  const [position, setPosition] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [echoedWords, setEchoedWords] = useState<Word[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const { recordAnswer, finish } = useGameProgress('sound_echo', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const target = sequence[position];
  const options = useMemo(() => {
    if (!target) return [];
    const distractors = shuffleArray(
      VOCABULARY_BANK.filter(word =>
        word.language === language &&
        word.id !== target.id &&
        !word.text.trim().includes(' '),
      ),
    );
    return shuffleArray([target, ...distractors.slice(0, 3)]);
  }, [language, target]);

  const playSequence = () => {
    if (!sequence.length || isPlayingSequence) return;
    setIsPlayingSequence(true);
    const playAt = (index: number) => {
      if (index >= sequence.length) {
        setIsPlayingSequence(false);
        return;
      }
      const word = sequence[index];
      speak(word.audioText || word.text, language, () => {
        window.setTimeout(() => playAt(index + 1), 350);
      });
    };
    playAt(0);
  };

  useEffect(() => {
    if (!introSpoken || !sequence.length) return;
    const timeout = window.setTimeout(playSequence, 350);
    return () => window.clearTimeout(timeout);
  }, [introSpoken, sequence]);

  useEffect(() => {
    if (feedback !== 'correct') return;
    const timeout = window.setTimeout(() => {
      setEchoedWords(current => [...current, sequence[position]]);
      if (position + 1 >= sequence.length) {
        window.setTimeout(() => finish(sequence.map(word => word.id)), 700);
        return;
      }
      setPosition(index => index + 1);
      setWrongIds([]);
      setFeedback(null);
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [feedback, finish, position, sequence]);

  if (!sequence.length || !target) return <EmptyGame language={language} />;

  const chooseWord = (option: Word) => {
    if (feedback || wrongIds.includes(option.id)) return;
    const correct = option.id === target.id;
    recordAnswer(target, correct, option);
    if (correct) {
      setFeedback('correct');
    } else {
      setWrongIds(ids => [...ids, option.id]);
      setFeedback('wrong');
      window.setTimeout(() => setFeedback(null), 650);
    }
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={position + 1} total={sequence.length} label={copy.echoProgress} icon="🎵" language={language} />
      <div className="mb-5 rounded-3xl bg-gradient-to-br from-violet-100 via-sky-50 to-pink-100 p-4 sm:p-6">
        <p className="text-xs font-black uppercase tracking-wider text-violet-800">{copy.echoTitle}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{copy.echoHint} 🧠</h2>
        <div className="mt-4 flex min-h-14 flex-wrap items-center justify-center gap-2 rounded-2xl bg-white/75 p-2">
          {sequence.map((word, index) => {
            const echoed = index < echoedWords.length;
            return (
              <span
                key={`${word.id}-${index}`}
                className={`flex h-11 min-w-11 items-center justify-center rounded-xl px-2 text-2xl transition ${
                  echoed ? 'bg-emerald-100' : 'bg-slate-100 text-slate-400'
                }`}
                aria-label={echoed ? word.translation : copy.echoHidden}
              >
                {echoed ? word.imageUrl || '✨' : '❔'}
              </span>
            );
          })}
        </div>
        <button
          type="button"
          onClick={playSequence}
          disabled={isPlayingSequence}
          aria-label={copy.echoReplay}
          className="mx-auto mt-3 flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 font-extrabold text-violet-900 shadow-sm transition hover:bg-violet-50 disabled:opacity-60"
        >
          <Volume2 size={20} aria-hidden="true" /> {copy.echoReplay}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {options.map((option, index) => {
          const selected = feedback === 'correct' && option.id === target.id;
          const eliminated = wrongIds.includes(option.id);
          return (
            <motion.button
              key={`${target.id}-${option.id}`}
              type="button"
              disabled={Boolean(feedback) || eliminated || isPlayingSequence}
              whileTap={{ scale: 0.94 }}
              onClick={() => chooseWord(option)}
              aria-label={option.translation}
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-3xl border-2 p-3 transition sm:min-h-32 ${
                selected
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  : eliminated
                    ? 'border-rose-500 bg-rose-100 text-rose-900 opacity-70'
                    : 'border-white bg-white text-slate-900 shadow-[0_5px_0_#d9e9c9] hover:-translate-y-1 hover:bg-violet-50'
              }`}
            >
              <span className="text-4xl sm:text-5xl" aria-hidden="true">{option.imageUrl || '✨'}</span>
              <span className="text-sm font-black">{option.translation}</span>
              <span className="sr-only">{copy.optionLabel} {index + 1}</span>
            </motion.button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <p aria-live="polite" className="mt-4 text-center text-xl font-black text-emerald-800">
          {copy.correct} {target.text} 🎉
        </p>
      )}
      {feedback === 'wrong' && (
        <p aria-live="polite" className="mt-4 text-center text-lg font-black text-rose-700">
          {copy.tryAgain} 💪
        </p>
      )}
    </section>
  );
};
