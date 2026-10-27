import React from 'react';
import { ArrowLeft, Music2, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useProfileStore } from '../../store/profileStore';
import { useSound } from '../../hooks/useSound';
import { LANGUAGES } from '../../data/languages';
import { PWAInstallButton } from './PWAInstallButton';
import { GAME_COPY } from '../../data/gameCopy';

export const HeaderHUD: React.FC = () => {
  const currentScreen = useGameStore(state => state.currentScreen);
  const setScreen = useGameStore(state => state.setScreen);
  const language = useGameStore(state => state.language);
  const currentRound = useGameStore(state => state.currentRound);
  const totalRounds = useGameStore(state => state.totalRounds);
  const difficulties = useGameStore(state => state.difficulties);
  const currentPlayerIndex = useGameStore(state => state.currentPlayerIndex);
  const profiles = useProfileStore(state => state.profiles);
  const activePlayer = profiles[currentPlayerIndex] || profiles[0];
  const { isMuted, toggleMute, musicOn, toggleMusic } = useSound();
  const copy = GAME_COPY[language];

  if (currentScreen === 'BOOT') return null;

  return (
    <header className="sticky top-0 z-40 h-[60px] w-full shrink-0 border-b border-white/80 bg-white/85 px-3 py-2 shadow-sm backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setScreen('HOME')}
            aria-label={copy.changeFlag}
            className="flex shrink-0 items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-pink-300 to-sky-300 text-xl shadow-sm" aria-hidden="true">🌈</span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-black leading-tight text-slate-900">FAYMA PLAY</span>
              <span className="block text-[10px] font-bold text-emerald-700">{copy.appTagline}</span>
            </span>
          </button>

          {currentScreen !== 'HOME' && (
            <button
              type="button"
              onClick={() => setScreen('HOME')}
              className="flex min-h-9 min-w-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-extrabold text-emerald-900 ring-1 ring-emerald-100"
              aria-label={copy.changeFlag}
            >
              <span className="text-lg">{LANGUAGES[language].flag}</span>
              <span className="truncate">{copy.place}</span>
            </button>
          )}
        </div>

        {currentScreen === 'GAME_SESSION' && (
          <div className="min-w-0 rounded-full bg-sky-50 px-3 py-2 text-center text-xs font-extrabold text-sky-900 ring-1 ring-sky-100">
            <span>{copy.wordLevel} {difficulties[activePlayer?.uid || ''] || 1}/15</span>
            <span className="mx-1.5 text-sky-300">·</span>
            <span>{copy.round} {currentRound}/{totalRounds}</span>
            <span className="mx-1.5 text-sky-300">·</span>
            <span className="truncate">{activePlayer?.displayName}</span>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {currentScreen === 'GAME_SESSION' && (
            <button
              type="button"
              onClick={() => setScreen('WORLD_HUB')}
              className="flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-rose-50 px-3 text-xs font-black text-rose-700 transition hover:bg-rose-100"
              aria-label={copy.leaveGame}
              title={copy.leaveGame}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{copy.leaveGame}</span>
            </button>
          )}
          <button
            type="button"
            onClick={toggleMute}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-800 transition hover:bg-amber-100"
            title={isMuted ? copy.soundOn : copy.soundOff}
            aria-label={isMuted ? copy.soundOn : copy.soundOff}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={toggleMusic}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${musicOn ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-500'}`}
            title={musicOn ? copy.musicOn : copy.musicOff}
            aria-label={musicOn ? copy.musicOn : copy.musicOff}
            aria-pressed={musicOn}
          >
            <Music2 className="h-5 w-5" />
          </button>
          {currentScreen !== 'GAME_SESSION' && <PWAInstallButton />}
        </div>
      </div>
    </header>
  );
};
