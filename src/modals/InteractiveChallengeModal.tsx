import React, { Suspense } from 'react';
import { Gamepad2 } from 'lucide-react';
import { GameProps, DifficultyLevel, PlayerProfile } from '../types';

const SafariGame = React.lazy(() => import('../games/SafariGame').then(m => ({ default: m.SafariGame })));
const GardenMatchGame = React.lazy(() => import('../games/GardenMatchGame').then(m => ({ default: m.GardenMatchGame })));
const WordTrainGame = React.lazy(() => import('../games/WordTrainGame').then(m => ({ default: m.WordTrainGame })));
const WordPickerGame = React.lazy(() => import('../games/WordPickerGame').then(m => ({ default: m.WordPickerGame })));

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
      case 'safari':
        return <SafariGame {...gameProps} />;
      case 'garden_match':
        return <GardenMatchGame {...gameProps} />;
      case 'word_train':
        return <WordTrainGame {...gameProps} />;
      case 'word_picker':
        return <WordPickerGame {...gameProps} />;
      default:
        return <SafariGame {...gameProps} />;
    }
  };

  return (
    <div className="fayma-game-world relative isolate flex w-full flex-col items-center">
      <Suspense
        fallback={
          <div className="relative z-10 flex h-48 w-full max-w-2xl flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8">
            <Gamepad2 className="mb-3 h-12 w-12 animate-bounce text-emerald-500" />
            <p className="text-sm font-bold text-emerald-800">Preparando el juego...</p>
          </div>
        }
      >
        <div className="fayma-game-view relative z-10 w-full">{renderGame()}</div>
      </Suspense>
    </div>
  );
};
