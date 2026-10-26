import React, { useMemo, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useAdaptiveRound } from '../hooks/useAdaptiveRound';
import { InteractiveChallengeModal } from '../modals/InteractiveChallengeModal';
import { TurnResultModal } from '../modals/TurnResultModal';
import { GameProps, GameResult } from '../types';

export const GameSession: React.FC = () => {
  const language = useGameStore(s => s.language);
  const activeGameId = useGameStore(s => s.activeGameId);
  const currentRound = useGameStore(s => s.currentRound);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const sessionPhase = useGameStore(s => s.sessionPhase);
  const recordTurnResult = useGameStore(s => s.recordTurnResult);
  const advanceTurn = useGameStore(s => s.advanceTurn);
  const currentTurnResult = useGameStore(s => s.currentTurnResult);

  const profiles = useProfileStore(s => s.profiles);
  const addRewards = useProfileStore(s => s.addRewards);
  const { selectRoundWords, getPlayerDifficulty, handleAnswer, adaptDifficultyAfterTurn } = useAdaptiveRound();

  const activePlayer = profiles[currentPlayerIndex] || profiles[0];
  const difficulty = getPlayerDifficulty(activePlayer?.uid || '');
  const turnKey = `${activeGameId}:${currentPlayerIndex}:${currentRound}:${activePlayer?.uid || ''}:${language}`;
  const roundWords = useMemo(
    () => activePlayer ? selectRoundWords(activePlayer) : [],
    [activePlayer?.uid, currentPlayerIndex, currentRound, activeGameId, language, selectRoundWords],
  );
  const assessedWords = useRef({ turnKey, ids: new Map<string, { correct: boolean; wrong: boolean }>() });

  const recordEvidence = useCallback((wordId: string, isCorrect: boolean) => {
    if (!activePlayer || !wordId) return;
    if (assessedWords.current.turnKey !== turnKey) {
      assessedWords.current = { turnKey, ids: new Map<string, { correct: boolean; wrong: boolean }>() };
    }
    const evidence = assessedWords.current.ids.get(wordId) || { correct: false, wrong: false };
    if ((isCorrect && evidence.correct) || (!isCorrect && (evidence.wrong || evidence.correct))) return;
    evidence[isCorrect ? 'correct' : 'wrong'] = true;
    assessedWords.current.ids.set(wordId, evidence);
    handleAnswer(activePlayer.uid, wordId, isCorrect);
  }, [activePlayer?.uid, handleAnswer, turnKey]);

  const handleGameCorrect = useCallback((wordId: string) => recordEvidence(wordId, true), [recordEvidence]);
  const handleGameWrong = useCallback((wordId: string) => recordEvidence(wordId, false), [recordEvidence]);

  const handleGameComplete = useCallback((result: GameResult) => {
    if (!activePlayer) return;
    const finalizedResult: GameResult = {
      ...result,
      playerId: activePlayer.uid,
    };

    adaptDifficultyAfterTurn(activePlayer.uid, result.correct, result.wrong);
    addRewards(activePlayer.uid, finalizedResult.coinsEarned, 0);
    recordTurnResult(finalizedResult);
  }, [activePlayer?.uid, adaptDifficultyAfterTurn, addRewards, recordTurnResult]);

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
      {sessionPhase === 'CHALLENGE_PHASE' && activePlayer && (
        <InteractiveChallengeModal
          key={turnKey}
          gameId={activeGameId}
          gameProps={gameProps}
          player={activePlayer}
          difficulty={difficulty}
        />
      )}

      {sessionPhase === 'RESULT_PHASE' && activePlayer && currentTurnResult && (
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
