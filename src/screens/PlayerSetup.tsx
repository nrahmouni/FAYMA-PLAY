import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Plus, Trash2, Sparkles, ArrowRight, Check, AlertCircle, Users } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';

const KID_AVATARS = [
  { emoji: '🦊', name: 'Zorrito' },
  { emoji: '🦁', name: 'Leoncito' },
  { emoji: '🐱', name: 'Gatito' },
  { emoji: '🐼', name: 'Pandita' },
  { emoji: '🦄', name: 'Unicornio' },
  { emoji: '🚀', name: 'Cohete' },
  { emoji: '🐯', name: 'Tigrecito' },
  { emoji: '🐶', name: 'Perrito' },
];

const KID_COLORS = ['#06b6d4', '#f97316', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

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

  // New player fields
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(KID_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(KID_AVATARS[0].emoji);

  // Camera capture with fallback
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraTargetUid, setCameraTargetUid] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
        throw new Error('La cámara no está disponible en este navegador.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Cámara bloqueada por el navegador. ¡Elige un emoji divertido!');
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

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (profiles.length >= 4) return;
    const fallbackName = KID_AVATARS[profiles.length % KID_AVATARS.length].name;
    addLocalPlayer(newPlayerName.trim() || fallbackName, selectedColor, selectedEmoji);
    setNewPlayerName('');
    setSelectedColor(KID_COLORS[(profiles.length + 1) % KID_COLORS.length]);
    setSelectedEmoji(KID_AVATARS[(profiles.length + 1) % KID_AVATARS.length].emoji);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Friendly Header for Kids */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 border border-amber-500/30">
          <Sparkles className="w-4 h-4" />
          <span>¡Configura tus Jugadores!</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100">
          ¿Quiénes van a jugar? 🎮
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Elige tus avatares favoritos. ¡Pueden jugar de 1 a 4 amigos en el mismo dispositivo!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
              <span>Amigos en la partida:</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-black border border-cyan-500/30">
                {profiles.length} de 4
              </span>
            </h2>
          </div>

          {/* List of current players */}
          <div className="space-y-3">
            {profiles.map((player, idx) => {
              const isCustomPhoto = player.avatarUrl?.startsWith('data:');

              return (
                <div
                  key={player.uid}
                  className="p-4 rounded-3xl glass-card flex items-center justify-between border-2 border-white/10 hover:border-cyan-400/40 transition shadow-lg"
                  style={{ borderLeftColor: player.color, borderLeftWidth: '8px' }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Big Avatar */}
                    <div className="relative">
                      {isCustomPhoto ? (
                        <img
                          src={player.avatarUrl}
                          alt={player.displayName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-2 border-white/20 shadow-md bg-slate-800 select-none">
                          {player.avatarUrl || '🦊'}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => openCameraFor(player.uid)}
                        className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md transition cursor-pointer"
                        title="Foto de cámara"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="font-black text-slate-100 text-lg flex items-center gap-2 truncate">
                        <span>{player.displayName}</span>
                        {idx === 0 && (
                          <span className="text-[10px] uppercase font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Jugador 1
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-amber-300 font-bold flex items-center gap-2">
                        <span>🪙 {player.coins} monedas</span>
                        <span>•</span>
                        <span>⭐ {player.gems} gemas</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Avatar Emoji Switcher */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {KID_AVATARS.slice(0, 3).map(av => (
                        <button
                          key={av.emoji}
                          type="button"
                          onClick={() => updateProfile({ ...player, avatarUrl: av.emoji })}
                          className="w-8 h-8 rounded-xl glass-panel hover:scale-115 text-lg flex items-center justify-center border border-white/10 active:scale-90 transition"
                          title={`Elegir ${av.name}`}
                        >
                          {av.emoji}
                        </button>
                      ))}
                    </div>

                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlayer(player.uid)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Quitar jugador"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Player Card (if < 4) */}
          {profiles.length < 4 && (
            <div className="p-4 rounded-3xl glass-panel border-2 border-dashed border-cyan-400/40 space-y-3">
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
                + ¡Añade otro amigo a la partida!
              </span>

              {/* Ready-made avatar picker for kids */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {KID_AVATARS.map(av => (
                  <button
                    key={av.emoji}
                    type="button"
                    onClick={() => {
                      setSelectedEmoji(av.emoji);
                      setNewPlayerName(av.name);
                    }}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition border-2 flex-shrink-0 cursor-pointer ${
                      selectedEmoji === av.emoji
                        ? 'bg-cyan-500/30 border-cyan-400 scale-110 shadow-lg'
                        : 'glass-card border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-2xl select-none">{av.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-300 mt-0.5">{av.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Nombre del jugador"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/20 rounded-2xl px-4 py-2.5 text-base font-bold text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddPlayer()}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-400 text-slate-950 font-black text-base flex items-center gap-1.5 hover:bg-cyan-300 active:scale-95 transition shadow-lg shadow-cyan-400/20 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Language & Duration */}
        <div className="lg:col-span-5 space-y-4">
          {/* Language Selector Card */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
              Idioma para Jugar:
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(LANGUAGES) as Language[]).map(langKey => {
                const meta = LANGUAGES[langKey];
                const isSelected = language === langKey;

                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => setLanguage(langKey)}
                    className={`p-3 rounded-2xl flex items-center gap-2.5 transition cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                        : 'glass-card border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{meta.flag}</span>
                    <div className="text-left">
                      <div className="font-black text-sm">{meta.name}</div>
                      <div className="text-[10px] text-slate-400">{meta.nativeName}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rounds */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-cyan-300">
              Número de Rondas:
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTotalRounds(r)}
                  className={`py-3 rounded-2xl font-black text-center transition cursor-pointer border-2 ${
                    totalRounds === r
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-md'
                      : 'glass-card border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-2xl">{r}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rondas</div>
                </button>
              ))}
            </div>
          </div>

          {/* Big Start Adventure Button */}
          <button
            type="button"
            onClick={() => setScreen('WORLD_HUB')}
            className="w-full py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-xl flex items-center justify-center gap-2.5 shadow-2xl shadow-emerald-500/30 cursor-pointer active:scale-96 transition"
          >
            <span>¡LISTO, VAMOS A JUGAR!</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl glass-panel p-6 border-3 border-cyan-400 text-center relative shadow-2xl">
            <h3 className="text-xl font-black text-slate-100 mb-2">
              ¡Sonríe a la Cámara! 📸
            </h3>

            {cameraError ? (
              <div className="py-4 space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {KID_AVATARS.map(av => (
                    <button
                      key={av.emoji}
                      type="button"
                      onClick={() => {
                        const target = profiles.find(p => p.uid === cameraTargetUid);
                        if (target) updateProfile({ ...target, avatarUrl: av.emoji });
                        stopCamera();
                      }}
                      className="text-3xl p-2.5 rounded-2xl glass-card hover:scale-125 transition"
                    >
                      {av.emoji}
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
                    className="flex-1 py-3 rounded-2xl bg-cyan-400 text-slate-950 font-black text-base hover:bg-cyan-300 transition"
                  >
                    ¡Tomar Foto!
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-3 rounded-2xl glass-card text-slate-300 text-sm hover:text-white transition"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
