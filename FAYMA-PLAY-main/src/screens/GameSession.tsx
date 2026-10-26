import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useAdaptiveRound } from '../hooks/useAdaptiveRound';
import { SmartLearningModal } from '../modals/SmartLearningModal';
import { InteractiveChallengeModal } from '../modals/InteractiveChallengeModal';
import { TurnResultModal } from '../modals/TurnResultModal';
import { GameProps, GameResult, Word } from '../types';

export const GameSession: React.FC = () => {
  const language = useGameStore(s => s.language);
  const activeGameId = useGameStore(s => s.activeGameId);
  const currentRound = useGameStore(s => s.currentRound);
  const totalRounds = useGameStore(s => s.totalRounds);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const sessionPhase = useGameStore(s => s.sessionPhase);
  const setSessionPhase = useGameStore(s => s.setSessionPhase);
  const recordTurnResult = useGameStore(s => s.recordTurnResult);
  const advanceTurn = useGameStore(s => s.advanceTurn);
  const currentTurnResult = useGameStore(s => s.currentTurnResult);

  const profiles = useProfileStore(s => s.profiles);
  const addRewards = useProfileStore(s => s.addRewards);
  const streakCount = useProfileStore(s => s.streakCount);

  const { selectRoundWords, getPlayerDifficulty, handleAnswer } = useAdaptiveRound();

  const activePlayer = profiles[currentPlayerIndex] || profiles[0];
  const difficulty = getPlayerDifficulty(activePlayer?.uid || '');

  // Select target words for this turn
  const [roundWords, setRoundWords] = useState<Word[]>([]);

  useEffect(() => {
    if (activePlayer) {
      const words = selectRoundWords(activePlayer);
      setRoundWords(words);
    }
  }, [activePlayer, currentRound, currentPlayerIndex, selectRoundWords]);

  const handleGameCorrect = useCallback((wordId: string) => {
    const streak = streakCount[activePlayer.uid] || 0;
    handleAnswer(activePlayer.uid, wordId, true, streak);
  }, [activePlayer.uid, streakCount, handleAnswer]);

  const handleGameWrong = useCallback((wordId: string) => {
    const streak = streakCount[activePlayer.uid] || 0;
    handleAnswer(activePlayer.uid, wordId, false, streak);
  }, [activePlayer.uid, streakCount, handleAnswer]);

  const handleGameComplete = useCallback((result: GameResult) => {
    // Inject active player ID
    const finalizedResult: GameResult = {
      ...result,
      playerId: activePlayer.uid,
    };

    // Credit coins & gems
    addRewards(activePlayer.uid, finalizedResult.coinsEarned, 0);
    recordTurnResult(finalizedResult);
  }, [activePlayer.uid, addRewards, recordTurnResult]);

  const handleContinueNextTurn = () => {
    advanceTurn(profiles.length);
  };

  const gameProps: GameProps = useMemo(() => ({
    words: roundWords,
    difficulty,
    onCorrect: handleGameCorrect,
    onWrong: handleGameWrong,
    onComplete: handleGameComplete,
    language,
  }), [roundWords, difficulty, handleGameCorrect, handleGameWrong, handleGameComplete, language]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      {/* Phase A: Smart Learning Modal */}
      {sessionPhase === 'LEARNING_PHASE' && (
        <SmartLearningModal
          words={roundWords}
          language={language}
          player={activePlayer}
          onReady={() => setSessionPhase('CHALLENGE_PHASE')}
        />
      )}

      {/* Phase B: Interactive Challenge Active */}
      {sessionPhase === 'CHALLENGE_PHASE' && (
        <InteractiveChallengeModal
          gameId={activeGameId}
          gameProps={gameProps}
          player={activePlayer}
          difficulty={difficulty}
        />
      )}

      {/* Phase C: Turn Result Feedback Modal */}
      {sessionPhase === 'RESULT_PHASE' && currentTurnResult && (
        <TurnResultModal
          result={currentTurnResult}
          player={activePlayer}
          language={language}
          onContinue={handleContinueNextTurn}
        />
      )}
    </div>
  );
};
