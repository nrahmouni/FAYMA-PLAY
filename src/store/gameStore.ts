import { create } from 'zustand';
import { Screen, Language, NativeLanguage, DifficultyLevel, GameResult, PlayerProfile } from '../types';
import { recordGameSessionToCloudSQL } from '../lib/cloudsql-client';
import { recordGameSessionToFirestore } from '../lib/firebase';

export type GameSessionPhase = 'CHALLENGE_PHASE' | 'RESULT_PHASE';

export type GameMechanic = 'ai_quest' | 'unified_lesson' | 'safari' | 'garden_match' | 'word_train' | 'word_picker' | 'sound_echo' | 'dino_picnic' | 'line_match' | 'draw_word' | 'letter_puzzle' | 'word_sort' | 'comet_dash' | 'cookie_count' | 'number_bridge' | 'treasure_trail' | 'body_detective' | 'habitat_rescue' | 'space_explorer' | 'eco_mission';

export interface PlayerLessonProgress {
  completed: number;
  towardReward: number;
}

export interface WorldNode {
  id: string;
  theme: string;
  name: string;
  icon: string;
  gameId: string;
  gameName: string;
  minDifficulty: DifficultyLevel;
  unlocked: boolean;
  completed: boolean;
  stars?: number;
}

interface GameState {
  currentScreen: Screen;
  language: Language;
  nativeLanguages: NativeLanguage[]; // Idioma(s) hablado(s) en casa
  targetLanguages: Language[]; // Idioma(s) que desean aprender
  hasCompletedSetup: boolean;
  totalRounds: number;
  currentRound: number;
  currentPlayerIndex: number;
  activeWorldId: string;
  activeWorldNodeId: string | null;
  activeWorldDifficulty: DifficultyLevel | null;
  activeGameId: string;
  sessionPhase: GameSessionPhase;
  scores: Record<string, number>; // playerUid -> total score
  results: GameResult[];
  difficulties: Record<string, DifficultyLevel>; // playerUid -> 1-15
  currentTurnResult: GameResult | null;
  worldNodes: Record<Language, WorldNode[]>;
  lessonProgress: Record<string, PlayerLessonProgress>;

  setScreen: (screen: Screen) => void;
  setLanguage: (lang: Language) => void;
  setNativeLanguages: (langs: NativeLanguage[]) => void;
  setTargetLanguages: (langs: Language[]) => void;
  setTotalRounds: (rounds: number) => void;
  setActiveWorld: (worldId: string, gameId: string, worldNodeId?: string | null, minDifficulty?: DifficultyLevel) => void;
  setSessionPhase: (phase: GameSessionPhase) => void;
  startSession: (players: PlayerProfile[]) => void;
  recordTurnResult: (result: GameResult) => void;
  advanceTurn: (totalPlayers: number) => { isGameOver: boolean };
  adjustDifficulty: (playerUid: string, delta: number) => void;
  resetSession: () => void;
  completeSetup: () => void;
  proceedAfterLogin: () => void;
}

const DEFAULT_WORLDS: Record<Language, WorldNode[]> = {
  es: [
    { id: 'es_w_balloons', theme: 'colores', name: 'Explota-Globos', icon: '🎈', gameId: 'balloon_pop', gameName: '¡Explota-Globos!', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'es_w_safari', theme: 'animales', name: 'Safari Atrapa-Palabras', icon: '🐾', gameId: 'safari_dash', gameName: 'Safari Atrapa-Palabras', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'es_w_space', theme: 'viajes', name: 'Láser Espacial Cohete', icon: '🚀', gameId: 'space_blaster', gameName: 'Láser Espacial Cohete', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'es_w_monster', theme: 'comida', name: 'El Monstruo Glotón', icon: '🍕', gameId: 'monster_snack', gameName: 'El Monstruo Glotón', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'es_w_ai', theme: 'mision_ai', name: 'Misión Mágica IA', icon: '🦉', gameId: 'ai_quest', gameName: 'Aventura Mágica con IA', minDifficulty: 1, unlocked: true, completed: false },
  ],
  ar: [
    { id: 'ar_w_balloons', theme: 'colors', name: 'فرقعة البالونات', icon: '🎈', gameId: 'balloon_pop', gameName: 'فرقعة البالونات السحرية', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'ar_w_safari', theme: 'animals', name: 'سفاري صيد الكلمات', icon: '🐾', gameId: 'safari_dash', gameName: 'سفاري صيد الكلمات', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'ar_w_space', theme: 'space', name: 'ليزر الصاروخ الفضائي', icon: '🚀', gameId: 'space_blaster', gameName: 'ليزر الصاروخ الفضائي', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'ar_w_monster', theme: 'food', name: 'وليمة الوحش الأكول', icon: '🍕', gameId: 'monster_snack', gameName: 'وليمة الوحش الأكول', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'ar_w_ai', theme: 'mision_ai', name: 'مهمة الذكاء السحرية', icon: '🦉', gameId: 'ai_quest', gameName: 'مغامرة الذكاء الاصطناعي', minDifficulty: 1, unlocked: true, completed: false },
  ],
  'nl-BE': [
    { id: 'nl_w_balloons', theme: 'kleuren', name: 'Ballon Prik Feest', icon: '🎈', gameId: 'balloon_pop', gameName: 'Ballon Prik Feest!', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'nl_w_safari', theme: 'dieren', name: 'Safari Woorden Vangen', icon: '🐾', gameId: 'safari_dash', gameName: 'Safari Woorden Vangen', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'nl_w_space', theme: 'ruimte', name: 'Ruimte Raket Laser', icon: '🚀', gameId: 'space_blaster', gameName: 'Ruimte Raket Laser', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'nl_w_monster', theme: 'eten', name: 'Het Snoepmonster', icon: '🍕', gameId: 'monster_snack', gameName: 'Het Vrolijke Snoepmonster', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'nl_w_ai', theme: 'mision_ai', name: 'AI Magische Missie', icon: '🦉', gameId: 'ai_quest', gameName: 'AI Woorden Avontuur', minDifficulty: 1, unlocked: true, completed: false },
  ],
  fr: [
    { id: 'fr_w_balloons', theme: 'couleurs', name: 'Éclate les Ballons', icon: '🎈', gameId: 'balloon_pop', gameName: 'Éclate les Ballons !', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'fr_w_safari', theme: 'animaux', name: 'Safari Attrape-Mots', icon: '🐾', gameId: 'safari_dash', gameName: 'Safari Attrape-Mots', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'fr_w_space', theme: 'espace', name: 'Laser Fusée Spatiale', icon: '🚀', gameId: 'space_blaster', gameName: 'Laser Fusée Spatiale', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'fr_w_monster', theme: 'nourriture', name: 'Le Monstre Glouton', icon: '🍕', gameId: 'monster_snack', gameName: 'Festin du Monstre Glouton', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'fr_w_ai', theme: 'mision_ai', name: 'Mission Magique IA', icon: '🦉', gameId: 'ai_quest', gameName: 'Aventure IA des Mots', minDifficulty: 1, unlocked: true, completed: false },
  ],
  en: [
    { id: 'en_w_balloons', theme: 'colors', name: 'Balloon Pop Mania', icon: '🎈', gameId: 'balloon_pop', gameName: 'Balloon Pop Mania!', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'en_w_safari', theme: 'animals', name: 'Safari Word Catch', icon: '🐾', gameId: 'safari_dash', gameName: 'Safari Word Catch', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'en_w_space', theme: 'space', name: 'Space Rocket Blaster', icon: '🚀', gameId: 'space_blaster', gameName: 'Space Rocket Blaster', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'en_w_monster', theme: 'food', name: 'Hungry Monster Feast', icon: '🍕', gameId: 'monster_snack', gameName: 'Hungry Monster Feast', minDifficulty: 2, unlocked: true, completed: false },
    { id: 'en_w_ai', theme: 'mision_ai', name: 'AI Magic Quest', icon: '🦉', gameId: 'ai_quest', gameName: 'AI Words Adventure', minDifficulty: 1, unlocked: true, completed: false },
  ],
};

function loadSavedWorlds(): Record<Language, WorldNode[]> {
  try {
    if (typeof localStorage === 'undefined') return DEFAULT_WORLDS;
    const saved = localStorage.getItem('fayma-play-world-progress');
    if (!saved) return DEFAULT_WORLDS;
    const parsed = JSON.parse(saved) as Partial<Record<Language, WorldNode[]>>;
    const merged = { ...DEFAULT_WORLDS };
    (Object.keys(DEFAULT_WORLDS) as Language[]).forEach(lang => {
      const savedNodes = parsed[lang];
      if (savedNodes?.length) {
        merged[lang] = DEFAULT_WORLDS[lang].map(node => {
          const savedNode = savedNodes.find(item => item.id === node.id);
          return savedNode ? {
            ...node,
            unlocked: savedNode.unlocked,
            completed: savedNode.completed,
            stars: Math.max(savedNode.completed ? 1 : 0, Math.min(3, savedNode.stars ?? 0)),
          } : node;
        });
      }
    });
    return merged;
  } catch {
    return DEFAULT_WORLDS;
  }
}

function isDifficultyLevel(value: unknown): value is DifficultyLevel {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 15;
}

function loadSavedDifficulties(): Record<string, DifficultyLevel> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const saved: unknown = JSON.parse(localStorage.getItem('fayma-play-player-levels') || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter((entry): entry is [string, DifficultyLevel] => isDifficultyLevel(entry[1])),
    );
  } catch (error) {
    console.warn('Could not load saved player levels:', error);
    return {};
  }
}

function loadSavedLessonProgress(): Record<string, PlayerLessonProgress> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const saved: unknown = JSON.parse(localStorage.getItem('fayma-play-lesson-progress') || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).flatMap(([playerId, value]) => {
      if (!value || typeof value !== 'object') return [];
      const progress = value as Partial<PlayerLessonProgress>;
      if (!Number.isInteger(progress.completed) || !Number.isInteger(progress.towardReward)) return [];
      return [[playerId, {
        completed: Math.max(0, progress.completed as number),
        towardReward: Math.min(4, Math.max(0, progress.towardReward as number)),
      }]];
    }));
  } catch {
    return {};
  }
}

function loadSavedNativeLanguages(): NativeLanguage[] {
  try {
    if (typeof localStorage === 'undefined') return ['es'];
    const saved = localStorage.getItem('fayma-play-native-langs');
    if (!saved) return ['es'];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['es'];
  } catch {
    return ['es'];
  }
}

function loadSavedTargetLanguages(): Language[] {
  try {
    if (typeof localStorage === 'undefined') return ['nl-BE'];
    const saved = localStorage.getItem('fayma-play-target-langs');
    if (!saved) return ['nl-BE'];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ['nl-BE'];
  } catch {
    return ['nl-BE'];
  }
}

function loadHasCompletedSetup(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('fayma-play-setup-completed') === 'true';
  } catch {
    return false;
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'BOOT',
  hasCompletedSetup: loadHasCompletedSetup(),
  language: loadSavedTargetLanguages()[0] || 'nl-BE',
  nativeLanguages: loadSavedNativeLanguages(),
  targetLanguages: loadSavedTargetLanguages(),
  totalRounds: 3,
  currentRound: 1,
  currentPlayerIndex: 0,
  activeWorldId: 'saludos',
  activeWorldNodeId: null,
  activeWorldDifficulty: null,
  activeGameId: 'safari',
  sessionPhase: 'CHALLENGE_PHASE',
  scores: {},
  results: [],
  difficulties: loadSavedDifficulties(),
  currentTurnResult: null,
  worldNodes: loadSavedWorlds(),
  lessonProgress: loadSavedLessonProgress(),

  setScreen: (screen) => set({ currentScreen: screen }),

  setLanguage: (lang) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fayma-play-target-langs', JSON.stringify([lang]));
      }
    } catch {}
    set({ language: lang, targetLanguages: [lang] });
  },

  setNativeLanguages: (langs) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fayma-play-native-langs', JSON.stringify(langs));
      }
    } catch {}
    set({ nativeLanguages: langs });
  },

  setTargetLanguages: (langs) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fayma-play-target-langs', JSON.stringify(langs));
      }
    } catch {}
    set({ targetLanguages: langs, language: langs[0] || 'nl-BE' });
  },

  completeSetup: () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fayma-play-setup-completed', 'true');
      }
    } catch {}
    set({ hasCompletedSetup: true, currentScreen: 'WORLD_HUB' });
  },

  proceedAfterLogin: () => {
    const isCompleted = get().hasCompletedSetup || loadHasCompletedSetup();
    if (isCompleted) {
      set({ currentScreen: 'WORLD_HUB' });
    } else {
      set({ currentScreen: 'PLAYER_SETUP' });
    }
  },
  setTotalRounds: (rounds) => set({ totalRounds: rounds }),

  setActiveWorld: (worldId, gameId, worldNodeId = null, minDifficulty: DifficultyLevel | null = null) => set({
    activeWorldId: worldId,
    activeWorldNodeId: worldNodeId,
    activeWorldDifficulty: minDifficulty,
    activeGameId: gameId,
  }),

  setSessionPhase: (phase) => set({ sessionPhase: phase }),

  startSession: (players) => {
    const { activeWorldDifficulty, difficulties } = get();
    const initialScores: Record<string, number> = {};
    const initialDiffs: Record<string, DifficultyLevel> = {};
    players.forEach(p => {
      initialScores[p.uid] = 0;
      // Adapt initial difficulty based on age (1-13 years) if not explicitly set
      const ageBasedLevel = Math.min(5, Math.max(1, Math.floor(((p.age ?? 6) + 1) / 2.5))) as DifficultyLevel;
      initialDiffs[p.uid] = difficulties[p.uid] || activeWorldDifficulty || ageBasedLevel;
    });

    set({
      currentRound: 1,
      currentPlayerIndex: 0,
      scores: initialScores,
      difficulties: initialDiffs,
      results: [],
      currentTurnResult: null,
      sessionPhase: 'CHALLENGE_PHASE',
      currentScreen: 'GAME_SESSION',
    });
  },

  recordTurnResult: (result) => {
    const { scores, results, worldNodes, language, activeWorldNodeId } = get();
    const prevScore = scores[result.playerId] || 0;
    const gained = (result.correct * 10) + Math.max(0, result.coinsEarned);
    const nodes = [...(worldNodes[language] || [])];
    const activeIndex = nodes.findIndex(node => node.id === activeWorldNodeId);
    const total = result.correct + result.wrong;
    const accuracy = total > 0 ? result.correct / total : 0;
    const passed = accuracy >= 0.45;
    const earnedStars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : passed ? 1 : 0;

    if (activeIndex >= 0 && passed) {
      nodes[activeIndex] = {
        ...nodes[activeIndex],
        completed: true,
        stars: Math.max(nodes[activeIndex].stars ?? 0, earnedStars),
      };
      if (activeIndex + 1 < nodes.length) {
        nodes[activeIndex + 1] = { ...nodes[activeIndex + 1], unlocked: true };
      }
    }

    const nextWorldNodes = { ...worldNodes, [language]: nodes };
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('fayma-play-world-progress', JSON.stringify(nextWorldNodes));
    } catch { /* Progress remains available in memory if storage is unavailable. */ }

    const sessionAccuracy = Math.round(accuracy * 100);
    recordGameSessionToCloudSQL({
      gameType: result.gameId || 'arcade',
      targetLanguage: language,
      score: gained,
      starsEarned: result.coinsEarned || 0,
      accuracy: sessionAccuracy,
    }).catch(() => {});

    recordGameSessionToFirestore(`sess_${Date.now()}`, result, language).catch(() => {});

    set({
      scores: { ...scores, [result.playerId]: prevScore + gained },
      results: [...results, result],
      currentTurnResult: result,
      sessionPhase: 'RESULT_PHASE',
      worldNodes: nextWorldNodes,
    });
  },

  advanceTurn: (totalPlayers: number) => {
    const { currentPlayerIndex, currentRound, totalRounds, activeGameId, results, lessonProgress } = get();
    const nextPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
    const completedRoundCycle = nextPlayerIndex === 0;
    const nextRound = completedRoundCycle ? currentRound + 1 : currentRound;

    if (completedRoundCycle && currentRound >= totalRounds) {
      if (activeGameId !== 'unified_lesson') {
        set({ currentScreen: 'PODIUM' });
        return { isGameOver: true };
      }

      const nextLessonProgress = { ...lessonProgress };
      let rewardUnlocked = false;
      results.forEach(result => {
        const answerCount = result.correct + result.wrong;
        if (answerCount === 0 || result.correct / answerCount < 0.8) return;
        const current = nextLessonProgress[result.playerId] || { completed: 0, towardReward: 0 };
        const towardReward = current.towardReward + 1;
        if (towardReward >= 5) rewardUnlocked = true;
        nextLessonProgress[result.playerId] = {
          completed: current.completed + 1,
          towardReward: towardReward >= 5 ? 0 : towardReward,
        };
      });

      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('fayma-play-lesson-progress', JSON.stringify(nextLessonProgress));
        }
      } catch { /* Progress remains available in memory if storage is unavailable. */ }

      set({
        currentScreen: rewardUnlocked ? 'REWARD_GAME' : 'PODIUM',
        lessonProgress: nextLessonProgress,
      });
      return { isGameOver: true };
    }

    set({
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
      currentTurnResult: null,
      sessionPhase: 'CHALLENGE_PHASE',
    });

    return { isGameOver: false };
  },

  adjustDifficulty: (playerUid, delta) => {
    const { difficulties } = get();
    const current = difficulties[playerUid] || 1;
    const next = Math.min(15, Math.max(1, current + delta)) as DifficultyLevel;
    const updatedDifficulties = { ...difficulties, [playerUid]: next };
    set({ difficulties: updatedDifficulties });
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fayma-play-player-levels', JSON.stringify(updatedDifficulties));
      }
    } catch (error) {
      console.warn('Could not save player levels:', error);
    }
  },

  resetSession: () => set({
    currentRound: 1,
    currentPlayerIndex: 0,
    scores: {},
    results: [],
    currentTurnResult: null,
    sessionPhase: 'CHALLENGE_PHASE',
  }),
}));
