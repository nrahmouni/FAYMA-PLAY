import { create } from 'zustand';
import { PlayerProfile, WordMastery, MasteryLevel } from '../types';
import { syncUserProfile } from '../lib/firebase';

interface ProfileState {
  profiles: PlayerProfile[];
  activePlayerIndex: number;
  streakCount: Record<string, number>; // playerUid -> streak

  setProfiles: (profiles: PlayerProfile[]) => void;
  setActivePlayerIndex: (idx: number) => void;
  getActivePlayer: () => PlayerProfile | null;
  addLocalPlayer: (name: string, color: string, avatarUrl?: string) => PlayerProfile;
  removePlayer: (uid: string) => void;
  recordWordAttempt: (playerUid: string, wordId: string, isCorrect: boolean) => void;
  addRewards: (playerUid: string, coins: number, gems: number) => void;
  equipItem: (playerUid: string, category: 'avatar_frame' | 'mascot_skin' | 'badge', itemId: string) => void;
  updateProfile: (updated: PlayerProfile) => void;
}

const DEFAULT_PROFILES: PlayerProfile[] = [
  {
    uid: 'local_player_1',
    displayName: 'Aventurero 1',
    color: '#06b6d4', // Cyan
    createdAt: Date.now(),
    avatarUrl: '🦊',
    mastery: {},
    coins: 50,
    gems: 2,
    inventory: ['frame_neon_cyan'],
    equippedSkin: 'skin_cyber_shades',
    equippedBadge: 'badge_polyglot',
  },
  {
    uid: 'local_player_2',
    displayName: 'Compañero 2',
    color: '#f97316', // Orange
    createdAt: Date.now(),
    avatarUrl: '🦁',
    mastery: {},
    coins: 40,
    gems: 1,
    inventory: [],
  },
];

export const useProfileStore = create<ProfileState>((set, get) => {
  // Load saved profiles from localStorage if available
  let initialProfiles = DEFAULT_PROFILES;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('juegofy_profiles_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialProfiles = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  const persistProfiles = (profs: PlayerProfile[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('juegofy_profiles_list', JSON.stringify(profs));
    }
  };

  return {
    profiles: initialProfiles,
    activePlayerIndex: 0,
    streakCount: {},

    setProfiles: (profiles) => {
      persistProfiles(profiles);
      set({ profiles });
    },

    setActivePlayerIndex: (idx) => {
      set({ activePlayerIndex: idx });
    },

    getActivePlayer: () => {
      const { profiles, activePlayerIndex } = get();
      return profiles[activePlayerIndex] || profiles[0] || null;
    },

    addLocalPlayer: (name, color, avatarUrl) => {
      const newPlayer: PlayerProfile = {
        uid: `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        displayName: name.trim() || `Jugador ${get().profiles.length + 1}`,
        color,
        createdAt: Date.now(),
        avatarUrl: avatarUrl || '⭐',
        mastery: {},
        coins: 30,
        gems: 1,
        inventory: [],
      };

      const updated = [...get().profiles, newPlayer].slice(0, 4); // Max 4 players
      persistProfiles(updated);
      set({ profiles: updated });
      syncUserProfile(newPlayer);
      return newPlayer;
    },

    removePlayer: (uid) => {
      const updated = get().profiles.filter(p => p.uid !== uid);
      if (updated.length === 0) return; // Maintain at least 1
      persistProfiles(updated);
      set({
        profiles: updated,
        activePlayerIndex: Math.min(get().activePlayerIndex, updated.length - 1),
      });
    },

    recordWordAttempt: (playerUid, wordId, isCorrect) => {
      const { profiles, streakCount } = get();
      const playerIdx = profiles.findIndex(p => p.uid === playerUid);
      if (playerIdx === -1) return;

      const player = profiles[playerIdx];
      const prevMastery: WordMastery = player.mastery[wordId] || {
        correct: 0,
        wrong: 0,
        lastSeen: 0,
        level: 'new',
      };

      const newCorrect = prevMastery.correct + (isCorrect ? 1 : 0);
      const newWrong = prevMastery.wrong + (isCorrect ? 0 : 1);
      const total = newCorrect + newWrong;

      let newLevel: MasteryLevel = prevMastery.level;
      if (newCorrect >= 3 && newCorrect / total >= 0.75) {
        newLevel = 'mastered';
      } else if (newCorrect >= 1) {
        newLevel = isCorrect ? 'review' : 'learning';
      } else {
        newLevel = 'learning';
      }

      const updatedPlayer: PlayerProfile = {
        ...player,
        mastery: {
          ...player.mastery,
          [wordId]: {
            correct: newCorrect,
            wrong: newWrong,
            lastSeen: Date.now(),
            level: newLevel,
          },
        },
      };

      const newProfiles = [...profiles];
      newProfiles[playerIdx] = updatedPlayer;

      // Update streaks
      const currentStreak = streakCount[playerUid] || 0;
      const nextStreak = isCorrect ? currentStreak + 1 : 0;

      persistProfiles(newProfiles);
      set({
        profiles: newProfiles,
        streakCount: { ...streakCount, [playerUid]: nextStreak },
      });

      syncUserProfile(updatedPlayer);
    },

    addRewards: (playerUid, coins, gems) => {
      const { profiles } = get();
      const playerIdx = profiles.findIndex(p => p.uid === playerUid);
      if (playerIdx === -1) return;

      const player = profiles[playerIdx];
      const updatedPlayer: PlayerProfile = {
        ...player,
        coins: Math.max(0, player.coins + coins),
        gems: Math.max(0, player.gems + gems),
      };

      const newProfiles = [...profiles];
      newProfiles[playerIdx] = updatedPlayer;

      persistProfiles(newProfiles);
      set({ profiles: newProfiles });
      syncUserProfile(updatedPlayer);
    },

    equipItem: (playerUid, category, itemId) => {
      const { profiles } = get();
      const playerIdx = profiles.findIndex(p => p.uid === playerUid);
      if (playerIdx === -1) return;

      const player = profiles[playerIdx];
      const updatedPlayer: PlayerProfile = {
        ...player,
        equippedSkin: category === 'mascot_skin' ? itemId : player.equippedSkin,
        equippedBadge: category === 'badge' ? itemId : player.equippedBadge,
      };

      const newProfiles = [...profiles];
      newProfiles[playerIdx] = updatedPlayer;

      persistProfiles(newProfiles);
      set({ profiles: newProfiles });
      syncUserProfile(updatedPlayer);
    },

    updateProfile: (updated) => {
      const { profiles } = get();
      const idx = profiles.findIndex(p => p.uid === updated.uid);
      if (idx === -1) return;

      const newProfiles = [...profiles];
      newProfiles[idx] = updated;

      persistProfiles(newProfiles);
      set({ profiles: newProfiles });
      syncUserProfile(updated);
    },
  };
});
