import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Shield } from 'lucide-react';
import { useGameStore } from './store/gameStore';
import { useProfileStore } from './store/profileStore';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { AudioUnlocker } from './components/AudioUnlocker';
import { MascotBuddy, MascotMood } from './components/MascotBuddy';
import { LANGUAGES } from './data/languages';
import { testConnection } from './lib/firebase';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { PlayerSetup } from './screens/PlayerSetup';
import { WorldHub } from './screens/WorldHub';
import { GameSession } from './screens/GameSession';
import { PodiumScreen } from './screens/PodiumScreen';
import { GarageShop } from './screens/GarageShop';

export default function App() {
  const currentScreen = useGameStore(s => s.currentScreen);
  const setScreen = useGameStore(s => s.setScreen);
  const language = useGameStore(s => s.language);
  const sessionPhase = useGameStore(s => s.sessionPhase);
  const profiles = useProfileStore(s => s.profiles);

  const langMeta = LANGUAGES[language];
  const [mascotMessage, setMascotMessage] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');

  // Boot initialization
  useEffect(() => {
    testConnection();
  }, []);

  // Contextual Mascot commentary
  useEffect(() => {
    if (currentScreen === 'HOME') {
      setMascotMood('happy');
      setMascotMessage('¡Bienvenido a Juegofy! Elige tu mundo para empezar.');
    } else if (currentScreen === 'WORLD_HUB') {
      setMascotMood('thinking');
      if (language === 'es') {
        setMascotMessage('¡Hola! ¡Vamos a aprender palabras súper divertidas en español!');
      } else if (language === 'ar') {
        setMascotMessage('مَرْحَبًا! ¡El mundo árabe tiene retos fascinantes!');
      } else if (language === 'nl-BE') {
        setMascotMessage('Goeiedag! ¡Explora los canales y dulces de Flandes!');
      } else {
        setMascotMessage('Bonjour! ¡Practica la lengua del arte y la gastronomía!');
      }
    } else if (currentScreen === 'GAME_SESSION') {
      if (sessionPhase === 'LEARNING_PHASE') {
        setMascotMood('thinking');
        setMascotMessage('Escucha la pronunciación con atención antes de empezar.');
      } else if (sessionPhase === 'CHALLENGE_PHASE') {
        setMascotMood('idle');
        setMascotMessage('¡Tú puedes hacerlo! Confía en tu memoria.');
      } else if (sessionPhase === 'RESULT_PHASE') {
        setMascotMood('happy');
        setMascotMessage('¡Excelente turno! Cada palabra dominada suma experiencia.');
      }
    } else if (currentScreen === 'PODIUM') {
      setMascotMood('victory');
      setMascotMessage('¡Felicidades a todos los participantes por llegar a la meta!');
    } else if (currentScreen === 'GARAGE') {
      setMascotMood('happy');
      setMascotMessage('¡Mira qué accesorios tan geniales para personalizarte!');
    }
  }, [currentScreen, language, sessionPhase]);

  const handleMascotTap = () => {
    const funPhrases = [
      '¡Me encanta aprender idiomas contigo!',
      '¿Sabías que repetir palabras a intervalos espaciados (SRS) fija el vocabulario en tu memoria?',
      '¡Sigue acumulando rachas para desbloquear ítems legendarios!',
      '¡Un verdadero políglota practica todos los días!',
    ];
    setMascotMessage(funPhrases[Math.floor(Math.random() * funPhrases.length)]);
    setMascotMood('happy');
  };

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'BOOT':
        return (
          <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border-2 border-cyan-400/40 shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-cyan-500 via-pink-500 to-amber-500 p-1 shadow-2xl animate-float">
                <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-4xl select-none">
                  🎮
                </div>
              </div>

              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                JUEGOFY
              </h1>
              <p className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mt-1 mb-4">
                Plataforma PWA Educativa V1
              </p>

              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                Minijuegos multijugador adaptativos en <strong>Árabe</strong>, <strong>Flamenco</strong> y <strong>Francés</strong> con repetición espaciada y tienda de cosméticos.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setScreen(profiles.length === 0 ? 'PLAYER_SETUP' : 'HOME')}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-2xl hover:opacity-95 active:scale-98 transition cursor-pointer shadow-cyan-500/30"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Entrar a Juegofy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreen('AUTH')}
                  className="w-full py-3 px-4 rounded-xl glass-card text-xs font-bold text-slate-400 hover:text-cyan-300 border border-white/5 flex items-center justify-center gap-1.5 transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Sincronizar con Google (Opcional)</span>
                </button>
              </div>
            </motion.div>
          </div>
        );

      case 'AUTH':
        return <AuthScreen />;
      case 'PLAYER_SETUP':
        return <PlayerSetup />;
      case 'HOME':
        return <HomeScreen />;
      case 'WORLD_HUB':
        return <WorldHub />;
      case 'GAME_SESSION':
        return <GameSession />;
      case 'PODIUM':
        return <PodiumScreen />;
      case 'GARAGE':
        return <GarageShop />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500 selection:text-black bg-gradient-to-br ${langMeta?.bgGradient || 'from-slate-950 to-slate-900'} transition-colors duration-700`}>
      {/* Audio Unlocker & Offline Indicator */}
      <AudioUnlocker />
      <OfflineIndicator />

      {/* Global Top HUD Header */}
      <HeaderHUD />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col justify-start pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="w-full flex-1"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Reactive Animated Companion Mascot (Hidden in BOOT) */}
      {currentScreen !== 'BOOT' && (
        <MascotBuddy
          mood={mascotMood}
          customMessage={mascotMessage}
          onTap={handleMascotTap}
        />
      )}
    </div>
  );
}
