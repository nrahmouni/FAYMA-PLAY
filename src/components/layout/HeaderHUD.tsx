import React from 'react';
import { Volume2, VolumeX, Sparkles, Coins, Gem, Home, Compass, ShoppingBag, Users } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useProfileStore } from '../../store/profileStore';
import { useSound } from '../../hooks/useSound';
import { LANGUAGES } from '../../data/languages';
import { PWAInstallButton } from './PWAInstallButton';

export const HeaderHUD: React.FC = () => {
  const currentScreen = useGameStore(s => s.currentScreen);
  const setScreen = useGameStore(s => s.setScreen);
  const language = useGameStore(s => s.language);
  const currentRound = useGameStore(s => s.currentRound);
  const totalRounds = useGameStore(s => s.totalRounds);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);

  const profiles = useProfileStore(s => s.profiles);
  const activePlayer = profiles[currentPlayerIndex] || profiles[0];
  const { isMuted, toggleMute } = useSound();
  const langMeta = LANGUAGES[language];

  // If in BOOT screen, hide HUD
  if (currentScreen === 'BOOT') return null;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-3 sm:px-6 py-2.5 transition">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Language badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setScreen('HOME')}
            className="flex items-center gap-2 group cursor-pointer"
            title="Ir al Menú Principal"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 p-0.5 shadow-lg group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg select-none border border-white/10 shadow-inner">
                <span className="font-black bg-gradient-to-r from-cyan-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">F</span>
              </div>
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                FAYMA PLAY
              </span>
              <div className="text-[10px] text-slate-400 font-medium -mt-0.5">
                Arcade educativo
              </div>
            </div>
          </button>

          {/* Current Language Pill */}
          <button
            onClick={() => setScreen('WORLD_HUB')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold glass-card border border-white/10 hover:border-cyan-400/40 transition"
            title="Cambiar Mundo o Idioma"
          >
            <span className="text-sm select-none">{langMeta?.flag}</span>
            <span className="hidden xs:inline text-slate-200">{langMeta?.name}</span>
          </button>
        </div>

        {/* Center: Session Status or Navigation buttons */}
        {currentScreen === 'GAME_SESSION' ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span className="text-cyan-400">Ronda {currentRound}/{totalRounds}</span>
              <span className="text-slate-500">•</span>
              <span className="truncate max-w-[100px] sm:max-w-none text-slate-100">
                Turno: <strong className="text-amber-400">{activePlayer?.displayName}</strong>
              </span>
            </div>
          </div>
        ) : (
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setScreen('HOME')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentScreen === 'HOME'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Inicio</span>
            </button>

            <button
              onClick={() => setScreen('WORLD_HUB')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentScreen === 'WORLD_HUB'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">Mundos</span>
            </button>

            <button
              onClick={() => setScreen('PLAYER_SETUP')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentScreen === 'PLAYER_SETUP'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Jugadores ({profiles.length})</span>
            </button>

            <button
              onClick={() => setScreen('GARAGE')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentScreen === 'GARAGE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Garaje</span>
            </button>
          </nav>
        )}

        {/* Right: Currency counters, Sound mute & PWA button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coins */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl glass-card border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-extrabold shadow-sm"
            title="Monedas acumuladas"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="tabular-nums">{activePlayer?.coins ?? 0}</span>
          </div>

          {/* Gems */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl glass-card border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-extrabold shadow-sm"
            title="Gemas legendarias"
          >
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="tabular-nums">{activePlayer?.gems ?? 0}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl glass-card text-slate-300 hover:text-white hover:border-cyan-400/50 transition active:scale-95"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            aria-label={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
