import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, Trash2, Sparkles, ArrowRight, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';

const PRESET_EMOJIS = ['🦊', '🦁', '🐱', '🐼', '🦄', '🚀', '👑', '⚡', '🥐', '🌴', '⭐', '🐯'];
const PRESET_COLORS = ['#06b6d4', '#f97316', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

export const PlayerSetup: React.FC = () => {
  const profiles = useProfileStore(s => s.profiles);
  const addLocalPlayer = useProfileStore(s => s.addLocalPlayer);
  const removePlayer = useProfileStore(s => s.removePlayer);
  const updateProfile = useProfileStore(s => s.updateProfile);

  const language = useGameStore(s => s.language);
  const setLanguage = useGameStore(s => s.setLanguage);
  const totalRounds = useGameStore(s => s.totalRounds);
  const setTotalRounds = useGameStore(s => s.setTotalRounds);
  const setScreen = useGameStore(s => s.setScreen);

  // New player form
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(PRESET_EMOJIS[0]);

  // Camera capture modal state with sandbox safety
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraTargetUid, setCameraTargetUid] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when closing
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setCameraTargetUid(null);
    setCameraError(null);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const openCameraFor = async (playerUid: string) => {
    setCameraTargetUid(playerUid);
    setCameraError(null);
    setCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('La cámara no está disponible en este navegador o iframe.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable in sandbox:', err);
      setCameraError('Permiso de cámara restringido por el navegador/iframe. Puedes elegir un avatar ilustrado.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraTargetUid) return;
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 160, 160);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

      const target = profiles.find(p => p.uid === cameraTargetUid);
      if (target) {
        updateProfile({ ...target, avatarUrl: dataUrl });
      }
    }
    stopCamera();
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (profiles.length >= 4) return;
    addLocalPlayer(newPlayerName || `Jugador ${profiles.length + 1}`, selectedColor, selectedEmoji);
    setNewPlayerName('');
    // cycle to next color & emoji
    setSelectedColor(PRESET_COLORS[(profiles.length + 1) % PRESET_COLORS.length]);
    setSelectedEmoji(PRESET_EMOJIS[(profiles.length + 1) % PRESET_EMOJIS.length]);
  };

  const handleStartGame = () => {
    if (profiles.length === 0) return;
    setScreen('WORLD_HUB');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Configuración de Sesión Multijugador</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          Prepara tu Equipo
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
          Juega en solitario o por turnos en el mismo dispositivo (1 a 4 jugadores).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player Profiles List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>Jugadores Activos</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold border border-white/5">
                {profiles.length}/4
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {profiles.map((player, idx) => {
              const isCustomPhoto = player.avatarUrl?.startsWith('data:');

              return (
                <div
                  key={player.uid}
                  className="p-3.5 sm:p-4 rounded-2xl glass-card flex items-center justify-between border-2 border-white/10 hover:border-cyan-400/40 transition"
                  style={{ borderLeftColor: player.color, borderLeftWidth: '6px' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar Display */}
                    <div className="relative">
                      {isCustomPhoto ? (
                        <img
                          src={player.avatarUrl}
                          alt={player.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 border-white/20 shadow-md bg-slate-800 select-none"
                        >
                          {player.avatarUrl || '⭐'}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => openCameraFor(player.uid)}
                        className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md transition"
                        title="Cambiar foto o avatar con cámara"
                        aria-label="Cámara"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-100 text-base truncate flex items-center gap-2">
                        <span>{player.displayName}</span>
                        {idx === 0 && (
                          <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            Capitán
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{player.coins} monedas</span>
                        <span>•</span>
                        <span>{player.gems} gemas</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Emoji switcher quick button */}
                    <div className="flex items-center gap-1">
                      {PRESET_EMOJIS.slice(idx * 2, idx * 2 + 2).map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => updateProfile({ ...player, avatarUrl: em })}
                          className="w-7 h-7 rounded-lg glass-panel hover:scale-110 active:scale-95 text-sm flex items-center justify-center border border-white/5"
                          title="Cambiar emoji"
                        >
                          {em}
                        </button>
                      ))}
                    </div>

                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlayer(player.uid)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Eliminar jugador"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Player Form (if < 4) */}
          {profiles.length < 4 && (
            <form
              onSubmit={handleAddPlayer}
              className="p-4 rounded-2xl glass-panel border border-dashed border-cyan-400/40 space-y-3"
            >
              <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
                + Añadir Nuevo Jugador
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={18}
                  placeholder={`Nombre (ej. Explorador ${profiles.length + 1})`}
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm flex items-center gap-1 hover:bg-cyan-400 active:scale-95 transition shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir</span>
                </button>
              </div>

              {/* Color & Emoji pickers */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-bold mr-1">Color:</span>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        selectedColor === c ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 font-bold mr-1">Icono:</span>
                  {PRESET_EMOJIS.slice(0, 5).map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition ${
                        selectedEmoji === em ? 'bg-cyan-500/30 scale-110 border border-cyan-400' : 'glass-card opacity-80'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Language & Rounds Setup */}
        <div className="lg:col-span-5 space-y-5">
          {/* Language Selection */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Idioma Objetivo
            </h3>
            <div className="space-y-2">
              {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
                const meta = LANGUAGES[langKey];
                const isSelected = language === langKey;

                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => setLanguage(langKey)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between transition cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'glass-card border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl select-none">{meta.flag}</span>
                      <div className="text-left">
                        <div className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                          <span>{meta.name}</span>
                          <span className="text-xs text-slate-400 font-normal">({meta.nativeName})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{meta.description}</div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rounds Duration */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Duración de la Partida
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTotalRounds(r)}
                  className={`py-3 rounded-xl font-black text-center transition cursor-pointer border-2 ${
                    totalRounds === r
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                      : 'glass-card border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-lg">{r}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rondas</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA Button */}
          <button
            type="button"
            onClick={handleStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center gap-2 shadow-2xl hover:opacity-95 active:scale-98 transition cursor-pointer shadow-cyan-500/20"
          >
            <span>Iniciar Aventura</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Capture Modal with Fallback */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl glass-panel p-6 border-2 border-cyan-400 text-center relative shadow-2xl">
            <h3 className="text-lg font-black text-slate-100 mb-2">
              Foto de Avatar
            </h3>

            {cameraError ? (
              <div className="py-4 space-y-4">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Selecciona uno de nuestros avatares destacados:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_EMOJIS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        const target = profiles.find(p => p.uid === cameraTargetUid);
                        if (target) updateProfile({ ...target, avatarUrl: em });
                        stopCamera();
                      }}
                      className="text-3xl p-2 rounded-xl glass-card hover:scale-125 transition"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-cyan-400 relative bg-black shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm hover:bg-cyan-400 transition"
                  >
                    Tomar Foto
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl glass-card text-slate-300 text-sm hover:text-white transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={stopCamera}
              className="mt-4 text-xs text-slate-400 hover:text-white underline block mx-auto"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
