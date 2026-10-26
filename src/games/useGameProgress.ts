import { useCallback, useRef } from 'react';
import { GameProps, Word } from '../types';

export function useGameProgress(
  gameId: string,
  { onCorrect, onWrong, onComplete }: Pick<GameProps, 'onCorrect' | 'onWrong' | 'onComplete'>,
) {
  const startedAt = useRef(Date.now());
  const stats = useRef({ correct: 0, wrong: 0 });
  const completed = useRef(false);
  const callbacks = useRef({ onCorrect, onWrong, onComplete });
  callbacks.current = { onCorrect, onWrong, onComplete };

  const recordAnswer = useCallback((word: Word, isCorrect: boolean) => {
    if (isCorrect) {
      stats.current.correct += 1;
      callbacks.current.onCorrect(word.id);
    } else {
      stats.current.wrong += 1;
      callbacks.current.onWrong(word.id);
    }
  }, []);

  const finish = useCallback((wordsSeen: string[]) => {
    if (completed.current) return;
    completed.current = true;
    callbacks.current.onComplete({
      playerId: '',
      gameId,
      correct: stats.current.correct,
      wrong: stats.current.wrong,
      timeMs: Date.now() - startedAt.current,
      coinsEarned: 10 + stats.current.correct * 5,
      wordsSeen,
    });
  }, [gameId]);

  return { recordAnswer, finish };
}
