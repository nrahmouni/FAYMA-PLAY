import React, { Suspense } from 'react';
import { Gamepad2 } from 'lucide-react';
import { QuestMissionPanel } from '../components/QuestMissionPanel';
import { GameProps, DifficultyLevel, PlayerProfile } from '../types';

const SafariGame = React.lazy(() => import('../games/SafariGame').then(m => ({ default: m.SafariGame })));
const GardenMatchGame = React.lazy(() => import('../games/GardenMatchGame').then(m => ({ default: m.GardenMatchGame })));
const WordTrainGame = React.lazy(() => import('../games/WordTrainGame').then(m => ({ default: m.WordTrainGame })));

const GAME_TITLES: Record<string, string> = {
  safari: 'Safari de palabras',
  garden_match: 'Jardín de parejas',
  word_train: 'Tren de palabras',
};

const GAME_HELP: Record<string, string> = {
  safari: 'Lee la pista y toca el dibujo que corresponde. ¡Puedes aprender sin prisa!',
  garden_match: 'Gira las flores y encuentra las parejas de dibujos y palabras.',
  word_train: 'Lee la frase y elige la palabra que falta para que el tren pueda salir.',
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
      case 'safari':
        return <SafariGame {...gameProps} />;
      case 'garden_match':
        return <GardenMatchGame {...gameProps} />;
      case 'word_train':
        return <WordTrainGame {...gameProps} />;
      default:
        return <SafariGame {...gameProps} />;
    }
  };

  return (
    <div className="fayma-game-world relative isolate flex w-full flex-col items-center">
      <QuestMissionPanel gameId={gameId} player={player} difficulty={difficulty} />

      <div className="relative z-10 mb-4 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full ring-4 ring-white/5" style={{ backgroundColor: player.color }} />
            <div>
              <div className="text-[9px] font-black uppercase tracking-[.18em] text-emerald-700">¡Vamos a jugar!</div>
              <div className="text-xs font-extrabold text-slate-900 sm:text-sm">{GAME_TITLES[gameId] || 'FAYMA PLAY'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1" title={`Dificultad adaptativa: ${difficulty}/3`} aria-label={`Dificultad ${difficulty} de 3`}>
            <span className="mr-1 text-[9px] font-black uppercase tracking-wider text-slate-500">Estrellas</span>
            {[1, 2, 3].map(level => (
              <span key={level} className={`text-xs ${level <= difficulty ? 'font-bold text-amber-500' : 'text-slate-300'}`}>★</span>
            ))}
          </div>
        </div>
        <p className="text-[11px] leading-5 text-slate-600">{GAME_HELP[gameId] || 'Aprende jugando con palabras sencillas y desafíos divertidos.'}</p>
      </div>

      <Suspense
        fallback={
          <div className="relative z-10 flex h-80 w-full max-w-2xl flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-white p-8">
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
