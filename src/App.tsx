import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from './store/gameStore';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { AudioUnlocker } from './components/AudioUnlocker';
import { testConnection } from './lib/firebase';
import { useSound } from './hooks/useSound';

import { useProfileStore } from './store/profileStore';
import { MainLoginScreen } from './screens/MainLoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerSetup } from './screens/PlayerSetup';
import { NativeLangSetup } from './screens/NativeLangSetup';
import { TargetLangSetup } from './screens/TargetLangSetup';
import { LearningPathScreen } from './screens/LearningPathScreen';
import { FlemishLearningScreen } from './screens/FlemishLearningScreen';
import { RewardsMenu } from './screens/RewardsMenu';
import { PassportScreen } from './screens/PassportScreen';
import { GameSession } from './screens/GameSession';
import { PodiumScreen } from './screens/PodiumScreen';
import { GarageShop } from './screens/GarageShop';
import { RewardGameScreen } from './screens/RewardGameScreen';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const currentScreen = useGameStore(s => s.currentScreen);
  const setScreen = useGameStore(s => s.setScreen);
  const linkGoogleUser = useProfileStore(s => s.linkGoogleUser);
  const { playClick } = useSound();
  const isGameSession = currentScreen === 'GAME_SESSION';

  // Boot initialization and Google Auth state observer
  useEffect(() => {
    testConnection().catch(() => {});
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await linkGoogleUser(user);
          // If on BOOT, automatically proceed (WORLD_HUB if setup done, else PLAYER_SETUP)
          const current = useGameStore.getState().currentScreen;
          if (current === 'BOOT') {
            useGameStore.getState().proceedAfterLogin();
          }
        } catch (err) {
          console.warn('Auto-login sync error:', err);
        }
      }
    });

    return () => unsub();
  }, [linkGoogleUser]);

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'BOOT':
        return <MainLoginScreen />;

      case 'AUTH':
        return <MainLoginScreen />;
      case 'PLAYER_SETUP':
        return <PlayerSetup />;
      case 'NATIVE_LANG_SETUP':
        return <NativeLangSetup />;
      case 'TARGET_LANG_SETUP':
        return <TargetLangSetup />;
      case 'HOME':
        return <HomeScreen />;
      case 'WORLD_HUB':
        return <LearningPathScreen />;
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
      case 'REWARD_GAME':
        return <RewardGameScreen />;
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
