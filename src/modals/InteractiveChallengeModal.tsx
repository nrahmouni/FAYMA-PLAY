import React, { Suspense } from 'react';
import { Sparkles, Gamepad2 } from 'lucide-react';
import { GameProps, DifficultyLevel, PlayerProfile } from '../types';

// Lazy loading minigames
const DragMatchGame = React.lazy(() =>
  import('../games/DragMatchGame').then(m => ({ default: m.DragMatchGame }))
);
const SlingshotGame = React.lazy(() =>
  import('../games/SlingshotGame').then(m => ({ default: m.SlingshotGame }))
);
const MemoryGame = React.lazy(() =>
  import('../games/MemoryGame').then(m => ({ default: m.MemoryGame }))
);
const SentenceBuilderGame = React.lazy(() =>
  import('../games/SentenceBuilderGame').then(m => ({ default: m.SentenceBuilderGame }))
);
const BubblePopperGame = React.lazy(() =>
  import('../games/BubblePopperGame').then(m => ({ default: m.BubblePopperGame }))
);

interface InteractiveChallengeModalProps {
  gameId: string;
  gameProps: GameProps;
  player: PlayerProfile;
  difficulty: DifficultyLevel;
}

export const InteractiveChallengeModal: React.FC<InteractiveChallengeModalProps> = ({
  gameId,
  gameProps,
  player,
  difficulty,
}) => {
  const renderGame = () => {
    switch (gameId) {
      case 'drag_match':
        return <DragMatchGame {...gameProps} />;
      case 'slingshot':
        return <SlingshotGame {...gameProps} />;
      case 'memory':
        return <MemoryGame {...gameProps} />;
      case 'sentence_builder':
        return <SentenceBuilderGame {...gameProps} />;
      case 'bubble_popper':
        return <BubblePopperGame {...gameProps} />;
      default:
        return <DragMatchGame {...gameProps} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header Information */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4 px-3 py-2 rounded-2xl glass-panel border border-white/10">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <span className="text-xs sm:text-sm font-extrabold text-slate-200">
            {player.displayName}
          </span>
        </div>

        {/* Difficulty Stars */}
        <div className="flex items-center gap-1" title={`Dificultad adaptativa: ${difficulty}/5`}>
          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1 hidden xs:inline">
            Nivel
          </span>
          {[1, 2, 3, 4, 5].map(lvl => (
            <span
              key={lvl}
              className={`text-xs ${
                lvl <= difficulty ? 'text-amber-400 font-bold' : 'text-slate-600'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Game Viewport with Suspense fallback */}
      <Suspense
        fallback={
          <div className="w-full max-w-xl h-80 rounded-3xl glass-panel flex flex-col items-center justify-center p-8 border border-white/10">
            <Gamepad2 className="w-12 h-12 text-cyan-400 animate-bounce mb-3" />
            <p className="text-slate-300 font-bold text-sm">Cargando desafío interactivo...</p>
          </div>
        }
      >
        {renderGame()}
      </Suspense>
    </div>
  );
};
