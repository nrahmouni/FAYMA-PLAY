import React, { Suspense } from 'react';
import { Gamepad2 } from 'lucide-react';
import { GameProps, DifficultyLevel, PlayerProfile } from '../types';
import { FitGame } from '../components/FitGame';

const BalloonPopGame = React.lazy(() => import('../games/BalloonPopGame').then(m => ({ default: m.BalloonPopGame })));
const SafariAnimalDash = React.lazy(() => import('../games/SafariAnimalDash').then(m => ({ default: m.SafariAnimalDash })));
const SpaceLaserBlaster = React.lazy(() => import('../games/SpaceLaserBlaster').then(m => ({ default: m.SpaceLaserBlaster })));
const MonsterSnackFeast = React.lazy(() => import('../games/MonsterSnackFeast').then(m => ({ default: m.MonsterSnackFeast })));
const GardenMatchGame = React.lazy(() => import('../games/GardenMatchGame').then(m => ({ default: m.GardenMatchGame })));
const WordTrainGame = React.lazy(() => import('../games/WordTrainGame').then(m => ({ default: m.WordTrainGame })));
const AiMagicQuestGame = React.lazy(() => import('../games/AiMagicQuestGame').then(m => ({ default: m.AiMagicQuestGame })));

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
      case 'balloon_pop':
      case 'unified_lesson':
        return <BalloonPopGame {...gameProps} />;
      case 'safari_dash':
      case 'safari':
      case 'word_picker':
        return <SafariAnimalDash {...gameProps} />;
      case 'space_blaster':
      case 'comet_dash':
      case 'space_explorer':
      case 'sound_echo':
        return <SpaceLaserBlaster {...gameProps} />;
      case 'monster_snack':
      case 'cookie_count':
      case 'dino_picnic':
        return <MonsterSnackFeast {...gameProps} />;
      case 'ai_quest':
        return <AiMagicQuestGame {...gameProps} />;
      case 'garden_match':
        return <GardenMatchGame {...gameProps} />;
      case 'word_train':
        return <WordTrainGame {...gameProps} />;
      default:
        return <BalloonPopGame {...gameProps} />;
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
