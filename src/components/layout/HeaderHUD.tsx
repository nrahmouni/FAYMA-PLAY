import React, { useState, useEffect } from 'react';
import { ArrowLeft, Maximize, Minimize, Music2, Volume2, VolumeX, Cloud } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useProfileStore } from '../../store/profileStore';
import { useSound } from '../../hooks/useSound';
import { LANGUAGES } from '../../data/languages';
import { PWAInstallButton } from './PWAInstallButton';
import { GAME_COPY } from '../../data/gameCopy';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth?.currentUser || null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, u => setCurrentUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

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
            <img
              src="/src/assets/images/faymaplay_app_logo_1793375218520.jpg"
              alt="FaymaPlay Logo"
              className="h-10 w-10 rounded-2xl border-2 border-white object-cover shadow-sm hover:scale-105 transition-transform"
            />
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
          <div className="hidden lg:flex min-w-0 items-center justify-center rounded-full bg-sky-50 px-3 py-1.5 text-center text-xs font-extrabold text-sky-900 ring-1 ring-sky-100">
            <span>{copy.wordLevel} {difficulties[activePlayer?.uid || ''] || 1}/15</span>
            <span className="mx-1.5 text-sky-300">·</span>
            <span>{copy.round} {currentRound}/{totalRounds}</span>
            <span className="mx-1.5 text-sky-300">·</span>
            <span className="truncate max-w-[100px]">{activePlayer?.displayName && !activePlayer.displayName.startsWith('http') ? activePlayer.displayName : 'Aventurero'}</span>
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
            onClick={toggleFullscreen}
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
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
            className={`hidden md:flex h-10 w-10 items-center justify-center rounded-2xl transition ${musicOn ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}
            title={musicOn ? copy.musicOn : copy.musicOff}
            aria-label={musicOn ? copy.musicOn : copy.musicOff}
            aria-pressed={musicOn}
          >
            <Music2 className="h-5 w-5" />
          </button>
          {/* Kids & Profile Settings Button */}
          <button
            type="button"
            onClick={() => setScreen('PLAYER_SETUP')}
            className="flex h-10 items-center justify-center gap-1 rounded-2xl bg-amber-100 text-amber-950 px-2 sm:px-3 text-xs font-black border border-amber-300 hover:bg-amber-200 transition shadow-2xs cursor-pointer"
            title="Configurar niños, edades e idiomas"
            aria-label="Perfil y Niños"
          >
            <span className="text-base">👤</span>
            <span className="hidden md:inline">Perfil</span>
          </button>

          {/* Google Cloud Account Button */}
          <button
            type="button"
            onClick={() => setScreen('AUTH')}
            className={`flex h-10 items-center justify-center gap-1.5 rounded-2xl px-2.5 sm:px-3 text-xs font-black transition ${
              currentUser
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
            title={currentUser ? `Google Cloud: ${currentUser.displayName || currentUser.email}` : 'Conectar con Google Cloud'}
            aria-label="Cuenta Google Cloud"
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                className="w-5 h-5 rounded-full object-cover border border-emerald-400"
              />
            ) : (
              <Cloud className={`h-4 w-4 ${currentUser ? 'text-emerald-600' : 'text-sky-600'}`} />
            )}
            <span className="hidden md:inline">
              {currentUser ? 'Nube Google' : 'Google'}
            </span>
            {currentUser && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {currentScreen !== 'GAME_SESSION' && <PWAInstallButton />}
        </div>
      </div>
    </header>
  );
};
