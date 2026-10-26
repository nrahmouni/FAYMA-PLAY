import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera, Check, Minus, Plus, Sparkles, Users, X } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';

const PLAYER_COLORS = ['#0f9f6e', '#f97316', '#ec4899', '#6366f1'];
const PLAYER_AVATARS = ['🦊', '🦁', '🐼', '🦄', '🐸', '🐯', '🐶', '🐱'];
const ROUND_OPTIONS = [1, 3, 5];

export const PlayerSetup: React.FC = () => {
  const profiles = useProfileStore(state => state.profiles);
  const addLocalPlayer = useProfileStore(state => state.addLocalPlayer);
  const removePlayer = useProfileStore(state => state.removePlayer);
  const updateProfile = useProfileStore(state => state.updateProfile);
  const updateLocalAvatar = useProfileStore(state => state.updateLocalAvatar);
  const totalRounds = useGameStore(state => state.totalRounds);
  const setTotalRounds = useGameStore(state => state.setTotalRounds);
  const setScreen = useGameStore(state => state.setScreen);
  const { unlockAudio } = useSound();
  const [names, setNames] = useState<Record<string, string>>({});
  const [cameraPlayerId, setCameraPlayerId] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraPlayerId(null);
  };

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  useEffect(() => {
    if (cameraPlayerId && cameraRef.current && streamRef.current) {
      cameraRef.current.srcObject = streamRef.current;
    }
  }, [cameraPlayerId]);

  useEffect(() => {
    setNames(current => Object.fromEntries(profiles.map(profile => [
      profile.uid,
      current[profile.uid] ?? profile.displayName,
    ])));
  }, [profiles]);

  const addPlayer = () => {
    const avatar = PLAYER_AVATARS[profiles.length % PLAYER_AVATARS.length];
    const player = addLocalPlayer(`Jugador ${profiles.length + 1}`, PLAYER_COLORS[profiles.length % PLAYER_COLORS.length], avatar);
    setNames(current => ({ ...current, [player.uid]: '' }));
  };

  const continueToLanguages = () => {
    unlockAudio();
    profiles.forEach((profile, index) => {
      const displayName = names[profile.uid]?.trim() || `Jugador ${index + 1}`;
      if (displayName !== profile.displayName) {
        updateProfile({ ...profile, displayName });
      }
    });
    setScreen('HOME');
  };

  const openCamera = async (playerId: string) => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Esta cámara no está disponible en el navegador. Puedes seguir jugando con un avatar.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraPlayerId(playerId);
    } catch {
      setCameraError('No se pudo abrir la cámara. Revisa el permiso de cámara e inténtalo otra vez.');
    }
  };

  const capturePhoto = () => {
    const video = cameraRef.current;
    const player = profiles.find(item => item.uid === cameraPlayerId);
    if (!video || !player || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError('La cámara aún se está preparando. Espera un momento e inténtalo de nuevo.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('No se pudo preparar la foto. Puedes seguir jugando con un avatar.');
      return;
    }
    const side = Math.min(video.videoWidth, video.videoHeight);
    const left = (video.videoWidth - side) / 2;
    const top = (video.videoHeight - side) / 2;
    context.drawImage(video, left, top, side, side, 0, 0, 320, 320);
    const avatarUrl = canvas.toDataURL('image/jpeg', 0.72);
    updateLocalAvatar(player.uid, avatarUrl);
    stopCamera();
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl flex-col justify-center px-4 py-6 sm:px-8 sm:py-10">
      <section className="overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-yellow-100 via-pink-50 to-sky-100 p-5 shadow-[0_20px_50px_rgba(83,111,155,.14)] sm:p-8">
        <header className="text-center">
          <span className="text-5xl" aria-hidden="true">🎈</span>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
            <Sparkles className="h-4 w-4" /> ¡A jugar juntos!
          </div>
          <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">¿Quién juega hoy?</h1>
          <p className="mt-2 text-sm font-semibold text-slate-600 sm:text-base">Escribe vuestros nombres y prepara la partida.</p>
        </header>

        <div className="mt-6 space-y-3">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.uid}
              layout
              className="flex items-center gap-3 rounded-2xl border-2 border-white bg-white/90 p-3 shadow-sm sm:gap-4 sm:p-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-3xl" aria-hidden="true">
                {profile.avatarUrl?.startsWith('data:')
                  ? <img src={profile.avatarUrl} alt={`Foto de ${names[profile.uid] || `jugador ${index + 1}`}`} className="h-12 w-12 rounded-2xl object-cover" />
                  : profile.avatarUrl || '⭐'}
              </span>
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-xs font-black text-slate-500">Jugador {index + 1}</span>
                <input
                  value={names[profile.uid] ?? ''}
                  onChange={event => setNames(current => ({ ...current, [profile.uid]: event.target.value }))}
                  maxLength={16}
                  autoComplete="off"
                  placeholder={`Nombre del jugador ${index + 1}`}
                  aria-label={`Nombre del jugador ${index + 1}`}
                  className="min-h-11 w-full rounded-xl border-2 border-sky-100 bg-sky-50 px-3 text-base font-extrabold text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400"
                />
              </label>
              <button
                type="button"
                onClick={() => openCamera(profile.uid)}
                aria-label={`Hacer una selfie para ${names[profile.uid] || `jugador ${index + 1}`}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition hover:bg-sky-100"
              >
                <Camera className="h-5 w-5" />
              </button>
              {profiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(profile.uid)}
                  aria-label={`Quitar jugador ${index + 1}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {profiles.length < 4 && (
          <button
            type="button"
            onClick={addPlayer}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/80 px-4 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
          >
            <Plus className="h-5 w-5" /> Añadir jugador
          </button>
        )}

        {cameraError && (
          <div role="status" className="mt-3 flex items-start justify-between gap-3 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">
            <span>{cameraError}</span>
            <button type="button" onClick={() => setCameraError(null)} aria-label="Cerrar aviso" className="shrink-0 rounded-lg p-1 hover:bg-rose-100"><X className="h-4 w-4" /></button>
          </div>
        )}

        <section className="mt-6 rounded-2xl bg-white/80 p-4 sm:p-5" aria-labelledby="rounds-heading">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            <h2 id="rounds-heading" className="text-base font-black text-slate-900">¿Cuántas rondas jugamos?</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ROUND_OPTIONS.map(round => (
              <button
                key={round}
                type="button"
                onClick={() => {
                  setTotalRounds(round);
                }}
                aria-pressed={totalRounds === round}
                className={`min-h-16 rounded-2xl border-2 text-center transition ${
                  totalRounds === round
                    ? 'border-violet-400 bg-violet-100 text-violet-900 shadow-sm'
                    : 'border-slate-100 bg-white text-slate-700 hover:border-violet-200'
                }`}
              >
                <span className="block text-2xl font-black">{round}</span>
                <span className="text-xs font-bold">{round === 1 ? 'ronda' : 'rondas'}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={continueToLanguages}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-5 text-lg font-black text-white shadow-[0_5px_0_#35824a] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
        >
          ¡Listos! Elegir idioma <ArrowRight className="h-5 w-5" />
        </button>
      </section>
      {cameraPlayerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-[2rem] border-4 border-white bg-white p-4 shadow-2xl sm:p-6">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">¡Sonríe para tu selfie!</h2>
                <p className="text-sm font-semibold text-slate-600">La foto se queda guardada en este dispositivo.</p>
              </div>
              <button type="button" onClick={stopCamera} aria-label="Cerrar cámara" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"><X className="h-5 w-5" /></button>
            </header>
            <video ref={cameraRef} autoPlay playsInline muted className="aspect-square w-full rounded-3xl bg-slate-900 object-cover" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={stopCamera} className="min-h-12 rounded-2xl bg-slate-100 text-sm font-black text-slate-700">Ahora no</button>
              <button type="button" onClick={capturePhoto} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-black text-white"><Check className="h-4 w-4" /> ¡Usar foto!</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};
