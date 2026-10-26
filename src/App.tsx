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
import { PassportScreen } from './screens/PassportScreen';
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
      setMascotMessage('¡Bienvenido a FAYMA PLAY! Elige tu mundo para empezar.');
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
      if (sessionPhase === 'CHALLENGE_PHASE') {
        setMascotMood('idle');
        setMascotMessage('¡A jugar! Las palabras aparecen dentro de la aventura.');
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
                <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center select-none border border-white/10 shadow-inner">
                  <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 shadow-[0_0_20px_rgba(125,211,252,0.3)]">
                    <div className="absolute inset-2 rounded-xl border border-white/60" />
                    <div className="absolute left-1/2 top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-white/80" />
                    <div className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 bg-white/80" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                FAYMA WORLD
              </h1>
              <p className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mt-1 mb-4">
                4 PAÍSES • 4 IDIOMAS • 1 GRAN AVENTURA
              </p>

              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                Un viaje educativo para niños: explora ciudades, aprende palabras y vive misiones en español, árabe, francés y neerlandés de Flandes.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setScreen(profiles.length === 0 ? 'PLAYER_SETUP' : 'HOME')}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-2xl hover:opacity-95 active:scale-98 transition cursor-pointer shadow-cyan-500/30"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Comenzar el viaje</span>
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
      case 'PASSPORT':
        return <PassportScreen />;
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
    <div className="min-h-screen text-slate-900 flex flex-col relative overflow-x-hidden selection:bg-pink-300 selection:text-slate-900 bg-gradient-to-br from-sky-100 via-pink-50 to-yellow-100 transition-colors duration-700">
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
