import { useMemo, useCallback } from 'react';
import { Word, DifficultyLevel, PlayerProfile } from '../types';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { shuffleArray } from '../lib/utils';

export function useAdaptiveRound() {
  const language = useGameStore(s => s.language);
  const activeWorldId = useGameStore(s => s.activeWorldId);
  const difficulties = useGameStore(s => s.difficulties);
  const adjustDifficulty = useGameStore(s => s.adjustDifficulty);
  const recordWordAttempt = useProfileStore(s => s.recordWordAttempt);
  const addRewards = useProfileStore(s => s.addRewards);

  // Pool of words for the current language & theme/world
  const worldPool = useMemo(() => {
    const matchesLang = VOCABULARY_BANK.filter(w => w.language === language);
    const matchesTheme = matchesLang.filter(w => w.theme === activeWorldId);
    return matchesTheme.length >= 3 ? matchesTheme : matchesLang;
  }, [language, activeWorldId]);

  // Keep a larger deck so each level offers enough varied practice.
  const selectRoundWords = useCallback((player: PlayerProfile): Word[] => {
    if (!worldPool.length) return [];

    const difficulty = difficulties[player.uid] || 1;
    const beginnerWords = worldPool.filter(word =>
      ['animales', 'comida', 'colores'].includes(word.theme) && !word.text.trim().includes(' '),
    );
    const singleWords = worldPool.filter(word => !word.text.trim().includes(' '));
    const practicePool = difficulty === 1 && beginnerWords.length >= 3
      ? beginnerWords
      : difficulty <= 2 && singleWords.length >= 3
        ? singleWords
        : worldPool;
    const newOrLearning: Word[] = [];
    const reviewWords: Word[] = [];
    const masteredWords: Word[] = [];

    practicePool.forEach(word => {
      const m = player.mastery[word.id];
      if (!m || m.level === 'new' || m.level === 'learning') {
        newOrLearning.push(word);
      } else if (m.level === 'review') {
        reviewWords.push(word);
      } else {
        masteredWords.push(word);
      }
    });

    const selected: Word[] = [];

    // Balance new vocabulary with spaced review.
    const shuffledNew = shuffleArray(newOrLearning);
    const shuffledReview = shuffleArray(reviewWords);
    const shuffledMastered = shuffleArray(masteredWords);

    // Child-friendly sessions: start with a short, encouraging deck of 4-6 words
    // so levels feel readable, fair, and actually teach the target vocabulary.
    const targetCount = Math.min(6, difficulty + 2, practicePool.length);

    if (shuffledNew.length > 0) {
      selected.push(...shuffledNew.slice(0, Math.min(3, targetCount)));
    }

    if (shuffledReview.length > 0 && selected.length < targetCount) {
      selected.push(...shuffledReview.slice(0, Math.min(2, targetCount - selected.length)));
    }

    // Fill remaining spots if needed
    if (selected.length < targetCount) {
      const remaining = [...shuffledNew.slice(3), ...shuffledReview.slice(2), ...shuffledMastered];
      for (const w of remaining) {
        if (!selected.some(s => s.id === w.id)) {
          selected.push(w);
          if (selected.length >= targetCount) break;
        }
      }
    }

    // Fallback if pool is small
    if (selected.length === 0) {
      return practicePool.slice(0, targetCount);
    }

    return selected;
  }, [difficulties, worldPool]);

  // Get current difficulty for player
  const getPlayerDifficulty = useCallback((playerUid: string): DifficultyLevel => {
    return (difficulties[playerUid] || 1) as DifficultyLevel;
  }, [difficulties]);

  // Keep game difficulty fixed during a turn; update it once the level is complete.
  const handleAnswer = useCallback((
    playerUid: string,
    wordId: string,
    isCorrect: boolean
  ) => {
    if (!wordId) return;
    recordWordAttempt(playerUid, wordId, isCorrect);
  }, [recordWordAttempt]);

  const adaptDifficultyAfterTurn = useCallback((playerUid: string, correct: number, wrong: number) => {
    const total = correct + wrong;
    if (total < 2) return;

    const accuracy = correct / total;
    if (accuracy >= 0.5) {
      adjustDifficulty(playerUid, 1);
    } else if (accuracy <= 0.25) {
      adjustDifficulty(playerUid, -1);
    }
  }, [adjustDifficulty]);

  return {
    worldPool,
    selectRoundWords,
    getPlayerDifficulty,
    handleAnswer,
    adaptDifficultyAfterTurn,
  };
}
