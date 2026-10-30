import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Cloud, Database, ArrowRight, LogOut, CheckCircle2, Star, Trophy, BookOpen, User, RefreshCw } from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, testConnection } from '../lib/firebase';
import { fetchUserStatsFromCloudSQL } from '../lib/cloudsql-client';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export const MainLoginScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth?.currentUser || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudStats, setCloudStats] = useState<{ sessions: any[]; words: any[] } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const setScreen = useGameStore(s => s.setScreen);
  const proceedAfterLogin = useGameStore(s => s.proceedAfterLogin);
  const linkGoogleUser = useProfileStore(s => s.linkGoogleUser);
  const activePlayer = useProfileStore(s => s.getActivePlayer());

  useEffect(() => {
    testConnection().catch(() => {});
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          await linkGoogleUser(user);
          const stats = await fetchUserStatsFromCloudSQL();
          if (stats) setCloudStats(stats);
        } catch (err) {
          console.warn('Sync on auth change notice:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsub();
  }, [linkGoogleUser]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        await linkGoogleUser(user);
        const stats = await fetchUserStatsFromCloudSQL();
        if (stats) setCloudStats(stats);
        // Smart route: if setup is done -> WORLD_HUB, else -> PLAYER_SETUP
        proceedAfterLogin();
      }
    } catch (err: any) {
      console.warn('Google Sign-In notice:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('No pudimos iniciar sesión con Google. Puedes intentar de nuevo o jugar en Modo Invitado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setCloudStats(null);
    } catch (err) {
      console.warn('Logout notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    // Smart route: if setup is done -> WORLD_HUB, else -> PLAYER_SETUP
    proceedAfterLogin();
  };

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-3 py-4 sm:px-6 sm:py-8">
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full rounded-[2rem] border-4 border-white bg-gradient-to-br from-amber-100 via-sky-50 to-emerald-100 p-5 shadow-[0_25px_60px_rgba(36,107,253,.18)] sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Decorative background badges */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />

        {/* Mascot & Hero Title */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300 border-4 border-white bg-white">
            <img
              src="/src/assets/images/faymaplay_app_logo_1793375218520.jpg"
              alt="Logo FaymaPlay"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm shadow-md text-white border-2 border-white">
            ✨
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 text-xs font-black text-emerald-800 shadow-sm mb-2 border border-emerald-200">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Aventuras Arcade de Idiomas con IA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          FAYMA PLAY
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-600 max-w-md">
          Aprende español, inglés, árabe, neerlandés y francés jugando. ¡Todo tu progreso protegido en Google Cloud!
        </p>

        {/* Google Cloud Integration Pill */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-700 bg-white/80 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-sky-100 shadow-xs">
          <span className="flex items-center gap-1 text-sky-700">
            <Cloud className="w-3.5 h-3.5 text-sky-500" /> Google Cloud Firestore
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-indigo-700">
            <Database className="w-3.5 h-3.5 text-indigo-500" /> Cloud SQL PostgreSQL
          </span>
        </div>

        {/* Auth Box */}
        <div className="mt-6 w-full max-w-md">
          {currentUser ? (
            /* Logged-In User View */
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-emerald-300/80 bg-white/95 p-4 shadow-sm text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'Avatar'}
                        className="w-12 h-12 rounded-2xl border-2 border-emerald-400 object-cover shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {activePlayer?.avatarUrl || '🦁'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-slate-900 truncate">
                          {currentUser.displayName || activePlayer?.displayName || 'Aventurero'}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Cerrar sesión de Google"
                    aria-label="Cerrar sesión de Google"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Cloud Sync Status */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sincronizado con Google Cloud
                  </span>
                  {cloudStats && (
                    <span className="font-extrabold text-slate-600">
                      {cloudStats.sessions?.length || 0} partidas · {cloudStats.words?.length || 0} palabras
                    </span>
                  )}
                </div>
              </div>

              {/* Continue to Game CTA */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setScreen('PLAYER_SETUP')}
                  className="w-full min-h-12 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#1e6b37] transition hover:brightness-105 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  <span>Paso 2: Configurar Niños e Idiomas</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('WORLD_HUB')}
                  className="w-full min-h-10 py-2 px-4 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-extrabold text-xs border border-slate-200 transition"
                >
                  O ir directo a los Juegos Arcade 🎮
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out / Guest View */
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-left">
                  {error}
                </div>
              )}

              {/* Primary Google Login Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="group relative w-full min-h-14 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-base flex items-center justify-center gap-3 border-2 border-slate-200 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                {/* Official Google 'G' Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>

                <span>{loading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
              </button>

              <div className="flex items-center gap-3 my-2 text-xs font-bold text-slate-400">
                <div className="flex-1 h-px bg-slate-300/60" />
                <span>O TAMBIÉN</span>
                <div className="flex-1 h-px bg-slate-300/60" />
              </div>

              {/* Guest / Offline Mode */}
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full min-h-11 py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-200/80 transition cursor-pointer shadow-xs"
              >
                Jugar como Invitado (Modo local)
              </button>

              <p className="text-[11px] font-semibold text-slate-500">
                🔒 Iniciar sesión con Google te permite guardar tus partidas, estrellas y palabras aprendidas en la nube de forma segura.
              </p>
            </div>
          )}
        </div>

        {/* Highlights Grid */}
        <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-md pt-4 border-t border-slate-200/60 text-left">
          <div className="rounded-xl bg-white/75 p-2.5 border border-white">
            <span className="text-xl">☁️</span>
            <div className="text-xs font-black text-slate-900 mt-1">Nube Google</div>
            <div className="text-[10px] font-bold text-slate-500 leading-tight">Guarda logros y partidas</div>
          </div>
          <div className="rounded-xl bg-white/75 p-2.5 border border-white">
            <span className="text-xl">🧠</span>
            <div className="text-xs font-black text-slate-900 mt-1">SRS Vocabulario</div>
            <div className="text-[10px] font-bold text-slate-500 leading-tight">Repetición espaciada</div>
          </div>
          <div className="rounded-xl bg-white/75 p-2.5 border border-white">
            <span className="text-xl">🦉</span>
            <div className="text-xs font-black text-slate-900 mt-1">Mascota IA</div>
            <div className="text-[10px] font-bold text-slate-500 leading-tight">Pistas dinámicas</div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};
