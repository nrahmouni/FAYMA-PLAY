import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useAdaptiveRound } from '../hooks/useAdaptiveRound';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { InteractiveChallengeModal } from '../modals/InteractiveChallengeModal';
import { TurnResultModal } from '../modals/TurnResultModal';
import { GameProps, GameResult } from '../types';
import { GAME_COPY } from '../data/gameCopy';
import { MathGameId, MATH_GAME_COPY } from '../data/mathGameCopy';
import { LearningGameId, LEARNING_GAME_COPY } from '../data/learningGameCopy';

function isMathGameId(value: string): value is MathGameId {
  return value === 'comet_dash' || value === 'cookie_count' || value === 'number_bridge' || value === 'treasure_trail';
}

function isLearningGameId(value: string): value is LearningGameId {
  return value === 'body_detective' || value === 'habitat_rescue' || value === 'space_explorer' || value === 'eco_mission';
}

function isNonVocabularyGame(value: string) {
  return isMathGameId(value) || isLearningGameId(value);
}

export const GameSession: React.FC = () => {
  const language = useGameStore(s => s.language);
  const activeGameId = useGameStore(s => s.activeGameId);
  const currentRound = useGameStore(s => s.currentRound);
  const totalRounds = useGameStore(s => s.totalRounds);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const sessionPhase = useGameStore(s => s.sessionPhase);
  const recordTurnResult = useGameStore(s => s.recordTurnResult);
  const advanceTurn = useGameStore(s => s.advanceTurn);
  const currentTurnResult = useGameStore(s => s.currentTurnResult);
  const activeWorldNodeId = useGameStore(s => s.activeWorldNodeId);
  const worldNodes = useGameStore(s => s.worldNodes);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [levelAdvanced, setLevelAdvanced] = useState(false);
  const [introSpokenForTurn, setIntroSpokenForTurn] = useState<string | null>(null);

  const profiles = useProfileStore(s => s.profiles);
  const { speak } = useSpeech();
  const { playTurnStart } = useSound();
  const copy = GAME_COPY[language];
  const addRewards = useProfileStore(s => s.addRewards);
  const { selectRoundWords, getPlayerDifficulty, handleAnswer, adaptDifficultyAfterTurn } = useAdaptiveRound();

  const activePlayer = profiles[currentPlayerIndex] || profiles[0];
  const difficulty = getPlayerDifficulty(activePlayer?.uid || '');
  const turnKey = `${activeGameId}:${currentPlayerIndex}:${currentRound}:${activePlayer?.uid || ''}:${language}`;
  const announcedTurn = useRef('');

  useEffect(() => {
    if (sessionPhase !== 'CHALLENGE_PHASE' || !activePlayer || announcedTurn.current === turnKey) return;
    announcedTurn.current = turnKey;
    playTurnStart();
    const guide = isMathGameId(activeGameId)
      ? MATH_GAME_COPY[language][activeGameId].voiceGuide
      : isLearningGameId(activeGameId)
        ? LEARNING_GAME_COPY[language][activeGameId].voiceGuide
        : activeGameId === 'safari'
      ? copy.safariVoiceGuide
      : activeGameId === 'garden_match'
        ? copy.gardenVoiceGuide
        : activeGameId === 'word_picker'
          ? copy.wordPickerVoiceGuide
          : activeGameId === 'sound_echo'
            ? copy.soundEchoVoiceGuide
            : activeGameId === 'dino_picnic'
              ? copy.dinoPicnicVoiceGuide
              : activeGameId === 'line_match'
                ? copy.lineMatchVoiceGuide
                : activeGameId === 'draw_word'
                  ? copy.drawWordVoiceGuide
                  : activeGameId === 'letter_puzzle'
                    ? copy.letterPuzzleVoiceGuide
                    : activeGameId === 'word_sort'
                      ? copy.wordSortVoiceGuide
                      : copy.trainVoiceGuide;
    speak(
      `${copy.ready.replace('{name}', activePlayer.displayName)} ${copy.startTurn} ${guide}`,
      language,
      () => setIntroSpokenForTurn(turnKey),
    );
  }, [activeGameId, activePlayer?.displayName, copy, difficulty, language, playTurnStart, sessionPhase, speak, turnKey]);

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

  const handleGameCorrect = useCallback((wordId: string) => {
    if (!isNonVocabularyGame(activeGameId)) recordEvidence(wordId, true);
  }, [activeGameId, recordEvidence]);
  const handleGameWrong = useCallback((wordId: string) => {
    if (!isNonVocabularyGame(activeGameId)) recordEvidence(wordId, false);
  }, [activeGameId, recordEvidence]);

  const handleGameComplete = useCallback((result: GameResult) => {
    if (!activePlayer) return;
    const totalAnswers = result.correct + result.wrong;
    const alreadyCompleted = worldNodes[language]?.find(node => node.id === activeWorldNodeId)?.completed ?? false;
    setMissionCompleted(
      Boolean(activeWorldNodeId) &&
      !alreadyCompleted &&
      totalAnswers > 0 &&
      result.correct / totalAnswers >= 0.45,
    );
    setLevelAdvanced(
      !isNonVocabularyGame(activeGameId) &&
      totalAnswers >= 2 &&
      difficulty < 15 &&
      result.correct / totalAnswers >= 0.5,
    );
    const finalizedResult: GameResult = {
      ...result,
      playerId: activePlayer.uid,
    };

    if (!isNonVocabularyGame(activeGameId)) {
      adaptDifficultyAfterTurn(activePlayer.uid, result.correct, result.wrong);
    }
    addRewards(activePlayer.uid, finalizedResult.coinsEarned, 0);
    recordTurnResult(finalizedResult);
  }, [activeGameId, activePlayer?.uid, activeWorldNodeId, worldNodes, language, difficulty, adaptDifficultyAfterTurn, addRewards, recordTurnResult]);

  const handleContinueNextTurn = () => {
    setMissionCompleted(false);
    setLevelAdvanced(false);
    advanceTurn(profiles.length);
  };

  const gameProps: GameProps = useMemo(() => ({
    words: roundWords,
    difficulty,
    onCorrect: handleGameCorrect,
    onWrong: handleGameWrong,
    onComplete: handleGameComplete,
    language,
    introSpoken: introSpokenForTurn === turnKey,
  }), [roundWords, difficulty, handleGameCorrect, handleGameWrong, handleGameComplete, language, introSpokenForTurn, turnKey]);

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-2 py-2 sm:px-4 sm:py-3">
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
          missionCompleted={missionCompleted}
          levelAdvanced={levelAdvanced}
          isFinalTurn={currentRound >= totalRounds && currentPlayerIndex >= profiles.length - 1}
          nextPlayerName={
            currentRound >= totalRounds && currentPlayerIndex >= profiles.length - 1
              ? undefined
              : profiles[(currentPlayerIndex + 1) % profiles.length]?.displayName
          }
          onContinue={handleContinueNextTurn}
        />
      )}
    </div>
  );
};
