import React, { Suspense } from 'react';
import { Gamepad2 } from 'lucide-react';
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
const CombatGame = React.lazy(() => import('../games/CombatGame').then(m => ({ default: m.CombatGame })));
const DriveGame = React.lazy(() => import('../games/DriveGame').then(m => ({ default: m.DriveGame })));
const FruitNinjaGame = React.lazy(() => import('../games/FruitNinjaGame').then(m => ({ default: m.FruitNinjaGame })));

const GAME_TITLES: Record<string, string> = {
  combat: 'FAYMA BATTLE',
  drive: 'FAYMA RUSH',
  fruit: 'FAYMA SLICE',
  drag_match: 'DRIVE CHALLENGE',
  slingshot: 'SLINGSHOT ADVENTURE',
  memory: 'MEMORY QUEST',
  sentence_builder: 'SENTENCE BUILDER',
  bubble_popper: 'BUBBLE POPPER',
};

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
      case 'combat':
        return <CombatGame {...gameProps} />;
      case 'drive':
        return <DriveGame {...gameProps} />;
      case 'fruit':
        return <FruitNinjaGame {...gameProps} />;
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
    <div className="fayma-game-world relative isolate flex w-full flex-col items-center">
      <div className="relative z-10 mb-4 flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full ring-4 ring-white/5" style={{ backgroundColor: player.color }} />
          <div>
            <div className="text-[9px] font-black uppercase tracking-[.18em] text-cyan-300">En partida</div>
            <div className="text-xs font-extrabold text-slate-100 sm:text-sm">{GAME_TITLES[gameId] || 'FAYMA ARCADE'}</div>
          </div>
        </div>
        <div className="flex items-center gap-1" title={`Dificultad adaptativa: ${difficulty}/5`} aria-label={`Dificultad ${difficulty} de 5`}>
          <span className="mr-1 text-[9px] font-black uppercase tracking-wider text-slate-400">Reto</span>
          {[1, 2, 3, 4, 5].map(level => (
            <span key={level} className={`text-xs ${level <= difficulty ? 'font-bold text-amber-300' : 'text-slate-700'}`}>★</span>
          ))}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="relative z-10 flex h-80 w-full max-w-2xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-950/85 p-8">
            <Gamepad2 className="mb-3 h-12 w-12 animate-bounce text-cyan-400" />
            <p className="text-sm font-bold text-slate-300">Preparando el mundo...</p>
          </div>
        }
      >
        <div className="fayma-game-view relative z-10 w-full">{renderGame()}</div>
      </Suspense>
    </div>
  );
};
