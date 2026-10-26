import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useProfileStore } from '../../store/profileStore';
import { useSound } from '../../hooks/useSound';
import { LANGUAGES } from '../../data/languages';
import { PWAInstallButton } from './PWAInstallButton';

export const HeaderHUD: React.FC = () => {
  const currentScreen = useGameStore(state => state.currentScreen);
  const setScreen = useGameStore(state => state.setScreen);
  const language = useGameStore(state => state.language);
  const currentRound = useGameStore(state => state.currentRound);
  const totalRounds = useGameStore(state => state.totalRounds);
  const currentPlayerIndex = useGameStore(state => state.currentPlayerIndex);
  const profiles = useProfileStore(state => state.profiles);
  const activePlayer = profiles[currentPlayerIndex] || profiles[0];
  const { isMuted, toggleMute } = useSound();

  if (currentScreen === 'BOOT') return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/80 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setScreen('HOME')}
            aria-label="Volver a elegir idioma"
            className="flex shrink-0 items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-sky-300 text-xl shadow-sm" aria-hidden="true">🌈</span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-black leading-tight text-slate-900">FAYMA PLAY</span>
              <span className="block text-[10px] font-bold text-emerald-700">¡A aprender jugando!</span>
            </span>
          </button>

          {currentScreen !== 'HOME' && (
            <button
              type="button"
              onClick={() => setScreen('HOME')}
              className="flex min-h-9 min-w-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-extrabold text-emerald-900 ring-1 ring-emerald-100"
              aria-label="Cambiar idioma"
            >
              <span className="text-lg">{LANGUAGES[language].flag}</span>
              <span className="truncate">{language === 'nl-BE' ? 'Flandes' : LANGUAGES[language].country}</span>
            </button>
          )}
        </div>

        {currentScreen === 'GAME_SESSION' && (
          <div className="min-w-0 rounded-full bg-sky-50 px-3 py-2 text-center text-xs font-extrabold text-sky-900 ring-1 ring-sky-100">
            <span>Ronda {currentRound}/{totalRounds}</span>
            <span className="mx-1.5 text-sky-300">·</span>
            <span className="truncate">{activePlayer?.displayName}</span>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 transition hover:bg-amber-100"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
