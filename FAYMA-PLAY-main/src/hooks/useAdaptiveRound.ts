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

  // Select 2-3 target words tailored to the current player's SRS status
  const selectRoundWords = useCallback((player: PlayerProfile): Word[] => {
    if (!worldPool.length) return [];

    const newOrLearning: Word[] = [];
    const reviewWords: Word[] = [];
    const masteredWords: Word[] = [];

    worldPool.forEach(word => {
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

    // Aim for 60% new/learning (approx 2 words)
    const shuffledNew = shuffleArray(newOrLearning);
    const shuffledReview = shuffleArray(reviewWords);
    const shuffledMastered = shuffleArray(masteredWords);

    if (shuffledNew.length > 0) {
      selected.push(...shuffledNew.slice(0, 2));
    }

    if (shuffledReview.length > 0 && selected.length < 3) {
      selected.push(shuffledReview[0]);
    }

    // Fill remaining spots if needed
    if (selected.length < 3) {
      const remaining = [...shuffledNew.slice(2), ...shuffledReview.slice(1), ...shuffledMastered];
      for (const w of remaining) {
        if (!selected.some(s => s.id === w.id)) {
          selected.push(w);
          if (selected.length >= 3) break;
        }
      }
    }

    // Fallback if pool is small
    if (selected.length === 0) {
      return worldPool.slice(0, 3);
    }

    return selected;
  }, [worldPool]);

  // Get current difficulty for player
  const getPlayerDifficulty = useCallback((playerUid: string): DifficultyLevel => {
    return (difficulties[playerUid] || 2) as DifficultyLevel;
  }, [difficulties]);

  // Process attempt & update adaptive difficulty + SRS
  const handleAnswer = useCallback((
    playerUid: string,
    wordId: string,
    isCorrect: boolean,
    streak: number
  ) => {
    recordWordAttempt(playerUid, wordId, isCorrect);

    if (isCorrect) {
      if (streak >= 3) {
        adjustDifficulty(playerUid, 1);
      }
    } else {
      adjustDifficulty(playerUid, -1);
    }
  }, [recordWordAttempt, adjustDifficulty]);

  return {
    worldPool,
    selectRoundWords,
    getPlayerDifficulty,
    handleAnswer,
  };
}
