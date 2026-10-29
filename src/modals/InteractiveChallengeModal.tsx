import React, { Suspense } from 'react';
import { Gamepad2 } from 'lucide-react';
import { GameProps, DifficultyLevel, PlayerProfile } from '../types';
import { FitGame } from '../components/FitGame';

const SafariGame = React.lazy(() => import('../games/SafariGame').then(m => ({ default: m.SafariGame })));
const GardenMatchGame = React.lazy(() => import('../games/GardenMatchGame').then(m => ({ default: m.GardenMatchGame })));
const WordTrainGame = React.lazy(() => import('../games/WordTrainGame').then(m => ({ default: m.WordTrainGame })));
const WordPickerGame = React.lazy(() => import('../games/WordPickerGame').then(m => ({ default: m.WordPickerGame })));
const SoundEchoGame = React.lazy(() => import('../games/SoundEchoGame').then(m => ({ default: m.SoundEchoGame })));
const DinoPicnicGame = React.lazy(() => import('../games/DinoPicnicGame').then(m => ({ default: m.DinoPicnicGame })));
const LineMatchGame = React.lazy(() => import('../games/LineMatchGame').then(m => ({ default: m.LineMatchGame })));
const DrawWordGame = React.lazy(() => import('../games/DrawWordGame').then(m => ({ default: m.DrawWordGame })));
const LetterPuzzleGame = React.lazy(() => import('../games/LetterPuzzleGame').then(m => ({ default: m.LetterPuzzleGame })));
const WordSortGame = React.lazy(() => import('../games/WordSortGame').then(m => ({ default: m.WordSortGame })));
const UnifiedLessonGame = React.lazy(() => import('../games/UnifiedLessonGame').then(m => ({ default: m.UnifiedLessonGame })));
const CometDashGame = React.lazy(() => import('../games/MathArcadeGames').then(m => ({ default: m.CometDashGame })));
const CookieCountGame = React.lazy(() => import('../games/MathArcadeGames').then(m => ({ default: m.CookieCountGame })));
const NumberBridgeGame = React.lazy(() => import('../games/MathArcadeGames').then(m => ({ default: m.NumberBridgeGame })));
const TreasureTrailGame = React.lazy(() => import('../games/MathArcadeGames').then(m => ({ default: m.TreasureTrailGame })));
const BodyDetectiveGame = React.lazy(() => import('../games/SubjectArcadeGames').then(m => ({ default: m.BodyDetectiveGame })));
const HabitatRescueGame = React.lazy(() => import('../games/SubjectArcadeGames').then(m => ({ default: m.HabitatRescueGame })));
const SpaceExplorerGame = React.lazy(() => import('../games/SubjectArcadeGames').then(m => ({ default: m.SpaceExplorerGame })));
const EcoMissionGame = React.lazy(() => import('../games/SubjectArcadeGames').then(m => ({ default: m.EcoMissionGame })));

interface InteractiveChallengeModalProps {
  gameId: string;
  gameProps: GameProps;
  player: PlayerProfile;
  difficulty: DifficultyLevel;
}

export const InteractiveChallengeModal: React.FC<InteractiveChallengeModalProps> = ({
  gameId,
  gameProps,
}) => {
  const renderGame = () => {
    switch (gameId) {
      case 'unified_lesson':
        return <UnifiedLessonGame {...gameProps} />;
      case 'safari':
        return <SafariGame {...gameProps} />;
      case 'garden_match':
        return <GardenMatchGame {...gameProps} />;
      case 'word_train':
        return <WordTrainGame {...gameProps} />;
      case 'word_picker':
        return <WordPickerGame {...gameProps} />;
      case 'sound_echo':
        return <SoundEchoGame {...gameProps} />;
      case 'dino_picnic':
        return <DinoPicnicGame {...gameProps} />;
      case 'line_match':
        return <LineMatchGame {...gameProps} />;
      case 'draw_word':
        return <DrawWordGame {...gameProps} />;
      case 'letter_puzzle':
        return <LetterPuzzleGame {...gameProps} />;
      case 'word_sort':
        return <WordSortGame {...gameProps} />;
      case 'comet_dash':
        return <CometDashGame {...gameProps} />;
      case 'cookie_count':
        return <CookieCountGame {...gameProps} />;
      case 'number_bridge':
        return <NumberBridgeGame {...gameProps} />;
      case 'treasure_trail':
        return <TreasureTrailGame {...gameProps} />;
      case 'body_detective':
        return <BodyDetectiveGame {...gameProps} />;
      case 'habitat_rescue':
        return <HabitatRescueGame {...gameProps} />;
      case 'space_explorer':
        return <SpaceExplorerGame {...gameProps} />;
      case 'eco_mission':
        return <EcoMissionGame {...gameProps} />;
      default:
        return <SafariGame {...gameProps} />;
    }
  };

  return (
    <div className="fayma-game-world relative isolate flex h-full min-h-0 w-full flex-col items-center overflow-hidden">
      <Suspense
        fallback={
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8">
            <Gamepad2 className="mb-3 h-12 w-12 animate-bounce text-emerald-500" />
            <p className="text-sm font-bold text-emerald-800">Preparando el juego...</p>
          </div>
        }
      >
        <FitGame>
          <div className="fayma-game-view relative z-10 w-full">{renderGame()}</div>
        </FitGame>
      </Suspense>
    </div>
  );
};
