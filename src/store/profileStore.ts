import { create } from 'zustand';
import { PlayerProfile, WordMastery, MasteryLevel } from '../types';
import { syncUserProfile, fetchUserProfile } from '../lib/firebase';
import { syncUserWithCloudSQL, recordLearnedWordToCloudSQL } from '../lib/cloudsql-client';
import { VOCABULARY_BANK } from '../data/vocabulary';

interface ProfileState {
  profiles: PlayerProfile[];
  activePlayerIndex: number;
  streakCount: Record<string, number>; // playerUid -> streak

  setProfiles: (profiles: PlayerProfile[]) => void;
  setActivePlayerIndex: (idx: number) => void;
  getActivePlayer: () => PlayerProfile | null;
  addLocalPlayer: (name: string, color: string, avatarUrl?: string, age?: number) => PlayerProfile;
  removePlayer: (uid: string) => void;
  recordWordAttempt: (playerUid: string, wordId: string, isCorrect: boolean) => void;
  addRewards: (playerUid: string, coins: number, gems: number) => void;
  equipItem: (playerUid: string, category: 'avatar_frame' | 'mascot_skin' | 'badge', itemId: string) => void;
  updateProfile: (updated: PlayerProfile) => void;
  updateLocalAvatar: (playerUid: string, avatarUrl: string) => void;
  updatePlayerAge: (playerUid: string, age: number) => void;
  linkGoogleUser: (user: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }) => Promise<PlayerProfile>;
}

const DEFAULT_PROFILES: PlayerProfile[] = [
  {
    uid: 'local_player_1',
    displayName: '',
    color: '#06b6d4', // Cyan
    createdAt: Date.now(),
    avatarUrl: '🦊',
    age: 6,
    mastery: {},
    coins: 50,
    gems: 2,
    inventory: ['frame_neon_cyan'],
    equippedSkin: 'skin_cyber_shades',
    equippedBadge: 'badge_polyglot',
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

    addLocalPlayer: (name, color, avatarUrl, age) => {
      const newPlayer: PlayerProfile = {
        uid: `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        displayName: name.trim() || `Jugador ${get().profiles.length + 1}`,
        color,
        createdAt: Date.now(),
        avatarUrl: avatarUrl || '🦊',
        age: age || 6,
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

      // Persist learned word to Google Cloud SQL
      if (isCorrect) {
        const foundWord = VOCABULARY_BANK.find(w => w.id === wordId);
        if (foundWord) {
          recordLearnedWordToCloudSQL({
            word: foundWord.text,
            translation: foundWord.translation || foundWord.text,
            targetLanguage: foundWord.language || 'es',
            nativeLanguage: 'es',
          }).catch(() => {});
        }
      }
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
      syncUserWithCloudSQL(updatedPlayer).catch(() => {});
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
      syncUserWithCloudSQL(updatedPlayer).catch(() => {});
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
      syncUserWithCloudSQL(updated).catch(() => {});
    },

    updateLocalAvatar: (playerUid, avatarUrl) => {
      const { profiles } = get();
      const idx = profiles.findIndex(profile => profile.uid === playerUid);
      if (idx === -1) return;

      const updated = { ...profiles[idx], avatarUrl };
      const newProfiles = [...profiles];
      newProfiles[idx] = updated;
      persistProfiles(newProfiles);
      localStorage.setItem(`juegofy_profile_${playerUid}`, JSON.stringify(updated));
      set({ profiles: newProfiles });
      syncUserProfile(updated);
      syncUserWithCloudSQL(updated).catch(() => {});
    },

    updatePlayerAge: (playerUid, age) => {
      const { profiles } = get();
      const idx = profiles.findIndex(profile => profile.uid === playerUid);
      if (idx === -1) return;

      const validAge = Math.min(13, Math.max(1, Math.round(age)));
      const updated = { ...profiles[idx], age: validAge };
      const newProfiles = [...profiles];
      newProfiles[idx] = updated;
      persistProfiles(newProfiles);
      set({ profiles: newProfiles });
      syncUserProfile(updated);
      syncUserWithCloudSQL(updated).catch(() => {});
    },

    linkGoogleUser: async (user) => {
      // 1. Try to load existing profile from Firestore
      const cloudProfile = await fetchUserProfile(user.uid);
      if (cloudProfile) {
        if (cloudProfile.displayName && (cloudProfile.displayName.startsWith('http:') || cloudProfile.displayName.startsWith('https:'))) {
          cloudProfile.displayName = 'Aventurero';
        }
        const currentProfiles = get().profiles;
        const exists = currentProfiles.some(p => p.uid === user.uid);
        const updated = exists
          ? currentProfiles.map(p => p.uid === user.uid ? cloudProfile : p)
          : [cloudProfile, ...currentProfiles.filter(p => !p.uid.startsWith('local_'))];
        persistProfiles(updated);
        set({ profiles: updated, activePlayerIndex: 0 });
        syncUserWithCloudSQL(cloudProfile).catch(() => {});
        return cloudProfile;
      }

      // 2. Otherwise adapt current profile to Google user
      const current = get().getActivePlayer() || DEFAULT_PROFILES[0];
      const cleanGoogleName = user.displayName && !user.displayName.startsWith('http')
        ? user.displayName
        : 'Aventurero';

      const linked: PlayerProfile = {
        ...current,
        uid: user.uid,
        displayName: current.displayName && !current.displayName.startsWith('http') && current.displayName !== 'Jugador 1' && current.displayName !== ''
          ? current.displayName
          : cleanGoogleName,
        avatarUrl: user.photoURL || current.avatarUrl || '🦁',
      };
      const updated = [linked, ...get().profiles.filter(p => p.uid !== current.uid && p.uid !== user.uid)];
      persistProfiles(updated);
      set({ profiles: updated, activePlayerIndex: 0 });
      syncUserProfile(linked);
      syncUserWithCloudSQL(linked).catch(() => {});
      return linked;
    },
  };
});
