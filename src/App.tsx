import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from './store/gameStore';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { AudioUnlocker } from './components/AudioUnlocker';
import { testConnection } from './lib/firebase';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { PlayerSetup } from './screens/PlayerSetup';
import { WorldHub } from './screens/WorldHub';
import { FlemishLearningScreen } from './screens/FlemishLearningScreen';
import { PassportScreen } from './screens/PassportScreen';
import { GameSession } from './screens/GameSession';
import { PodiumScreen } from './screens/PodiumScreen';
import { GarageShop } from './screens/GarageShop';

export default function App() {
  const currentScreen = useGameStore(s => s.currentScreen);
  // Boot initialization
  useEffect(() => {
    testConnection();
  }, []);

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'BOOT':
        return <PlayerSetup />;

      case 'AUTH':
        return <AuthScreen />;
      case 'PLAYER_SETUP':
        return <PlayerSetup />;
      case 'HOME':
        return <HomeScreen />;
      case 'WORLD_HUB':
        return <WorldHub />;
      case 'LEARN_FLEMISH':
        return <FlemishLearningScreen />;
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
      <main className="flex-1 flex flex-col justify-start pb-4">
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

    </div>
  );
}
