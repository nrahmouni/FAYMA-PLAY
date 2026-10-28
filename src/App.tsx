import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from './store/gameStore';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { AudioUnlocker } from './components/AudioUnlocker';
import { testConnection } from './lib/firebase';
import { useSound } from './hooks/useSound';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { PlayerSetup } from './screens/PlayerSetup';
import { WorldHub } from './screens/WorldHub';
import { FlemishLearningScreen } from './screens/FlemishLearningScreen';
import { RewardsMenu } from './screens/RewardsMenu';
import { PassportScreen } from './screens/PassportScreen';
import { GameSession } from './screens/GameSession';
import { PodiumScreen } from './screens/PodiumScreen';
import { GarageShop } from './screens/GarageShop';

export default function App() {
  const currentScreen = useGameStore(s => s.currentScreen);
  const { playClick } = useSound();
  const isGameSession = currentScreen === 'GAME_SESSION';
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
      case 'REWARDS':
        return <RewardsMenu />;
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
    <div
      onClickCapture={event => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest('button');
        if (button && !button.disabled && !button.hasAttribute('data-silent-click')) playClick();
      }}
      className="fayma-app-shell relative flex h-dvh min-h-0 flex-col overflow-hidden text-slate-900 selection:bg-amber-300 selection:text-slate-900 transition-colors duration-700"
    >
      {/* Audio Unlocker & Offline Indicator */}
      <AudioUnlocker />
      <OfflineIndicator />

      {/* Global Top HUD Header */}
      <HeaderHUD />

      {/* Main Viewport */}
      <main className={`flex min-h-0 flex-1 flex-col justify-start ${isGameSession ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain pb-4'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={`w-full flex-1 ${isGameSession ? 'min-h-0' : ''}`}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
