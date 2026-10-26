import { create } from 'zustand';
import { Screen, Language, DifficultyLevel, GameResult, PlayerProfile } from '../types';

export type GameSessionPhase = 'CHALLENGE_PHASE' | 'RESULT_PHASE';

export type GameMechanic = 'safari' | 'garden_match' | 'word_train' | 'word_picker' | 'sound_echo' | 'dino_picnic';

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

  setScreen: (screen: Screen) => void;
  setLanguage: (lang: Language) => void;
  setTotalRounds: (rounds: number) => void;
  setActiveWorld: (worldId: string, gameId: string, worldNodeId?: string | null, minDifficulty?: DifficultyLevel) => void;
  setSessionPhase: (phase: GameSessionPhase) => void;
  startSession: (players: PlayerProfile[]) => void;
  recordTurnResult: (result: GameResult) => void;
  advanceTurn: (totalPlayers: number) => { isGameOver: boolean };
  adjustDifficulty: (playerUid: string, delta: number) => void;
  resetSession: () => void;
}

const DEFAULT_WORLDS: Record<Language, WorldNode[]> = {
  es: [
    { id: 'es_w1', theme: 'saludos', name: 'Plaza del Sol', icon: '🏝️', gameId: 'safari', gameName: 'Safari de palabras', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'es_w2', theme: 'frases', name: 'Taller del Mercado', icon: '🧩', gameId: 'word_train', gameName: 'Tren de palabras', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'es_w3', theme: 'mapa', name: 'Ruta de la Costa', icon: '🗺️', gameId: 'garden_match', gameName: 'Jardín de parejas', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'es_w4', theme: 'memoria', name: 'Museo de Sonidos', icon: '🎧', gameId: 'safari', gameName: 'Safari de palabras', minDifficulty: 3, unlocked: false, completed: false },
  ],
  ar: [
    { id: 'ar_w1', theme: 'saludos', name: 'Oasis de Bienvenida', icon: '🌴', gameId: 'safari', gameName: 'Safari de palabras', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'ar_w2', theme: 'mercado', name: 'Zoco de Frases', icon: '🧺', gameId: 'word_train', gameName: 'Tren de palabras', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'ar_w3', theme: 'exploracion', name: 'Ruta del Atlas', icon: '🗺️', gameId: 'garden_match', gameName: 'Jardín de parejas', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'ar_w4', theme: 'recuerdo', name: 'Cúpula de Memoria', icon: '🪄', gameId: 'garden_match', gameName: 'Jardín de parejas', minDifficulty: 3, unlocked: false, completed: false },
  ],
  'nl-BE': [
    { id: 'nl_w1', theme: 'saludos', name: 'Puente de Brujas', icon: '🚲', gameId: 'safari', gameName: 'Safari de palabras', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'nl_w2', theme: 'estacion', name: 'Taller de Palabras', icon: '🧩', gameId: 'word_train', gameName: 'Tren de palabras', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'nl_w3', theme: 'canales', name: 'Mapa de Flandes', icon: '🗺️', gameId: 'garden_match', gameName: 'Jardín de parejas', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'nl_w4', theme: 'recuerdo', name: 'Museo de Burbujas', icon: '🫧', gameId: 'garden_match', gameName: 'Jardín de parejas', minDifficulty: 3, unlocked: false, completed: false },
  ],
  fr: [
    { id: 'fr_w1', theme: 'saludos', name: 'Boulevard de París', icon: '🥐', gameId: 'safari', gameName: 'Safari de palabras', minDifficulty: 1, unlocked: true, completed: false },
    { id: 'fr_w2', theme: 'frases', name: 'Café de las palabras', icon: '☕', gameId: 'word_train', gameName: 'Tren de palabras', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'fr_w3', theme: 'mapa', name: 'Ruta del arte', icon: '🗺️', gameId: 'garden_match', gameName: 'Jardín de parejas', minDifficulty: 2, unlocked: false, completed: false },
    { id: 'fr_w4', theme: 'recuerdo', name: 'Galería feliz', icon: '🧠', gameId: 'safari', gameName: 'Safari de palabras', minDifficulty: 3, unlocked: false, completed: false },
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

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'BOOT',
  language: 'nl-BE',
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

  setScreen: (screen) => set({ currentScreen: screen }),
  setLanguage: (lang) => set({ language: lang }),
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
      initialDiffs[p.uid] = difficulties[p.uid] || activeWorldDifficulty || 1;
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

    set({
      scores: { ...scores, [result.playerId]: prevScore + gained },
      results: [...results, result],
      currentTurnResult: result,
      sessionPhase: 'RESULT_PHASE',
      worldNodes: nextWorldNodes,
    });
  },

  advanceTurn: (totalPlayers: number) => {
    const { currentPlayerIndex, currentRound, totalRounds } = get();
    const nextPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
    const completedRoundCycle = nextPlayerIndex === 0;
    const nextRound = completedRoundCycle ? currentRound + 1 : currentRound;

    if (completedRoundCycle && currentRound >= totalRounds) {
      set({ currentScreen: 'PODIUM' });
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
