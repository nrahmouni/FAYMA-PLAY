import { create } from 'zustand';
import { Screen, Language, DifficultyLevel, GameResult, PlayerProfile } from '../types';

export type GameSessionPhase = 'CHALLENGE_PHASE' | 'RESULT_PHASE';

export type GameMechanic = 'combat' | 'drive' | 'fruit' | 'slingshot' | 'memory' | 'drag_match' | 'sentence_builder' | 'bubble_popper';

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
  difficulties: Record<string, DifficultyLevel>; // playerUid -> 1-5
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
    {
      id: 'es_w1',
      theme: 'saludos',
      name: 'Isla de la Bienvenida',
      icon: '🏝️',
      gameId: 'drive',
      gameName: 'FAYMA RUSH',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'es_w2',
      theme: 'animales',
      name: 'Safari de Mascotas',
      icon: '🐾',
      gameId: 'fruit',
      gameName: 'FAYMA SLICE',
      minDifficulty: 1,
      unlocked: false,
      completed: false,
    },
    {
      id: 'es_w3',
      theme: 'comida',
      name: 'Feria de Sabores',
      icon: '🍎',
      gameId: 'combat',
      gameName: 'FAYMA BATTLE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'es_w4',
      theme: 'colores',
      name: 'Arcoíris Encantado',
      icon: '🌈',
      gameId: 'slingshot',
      gameName: 'SLINGSHOT ADVENTURE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'es_w5',
      theme: 'viajes',
      name: 'Castillo del Espacio',
      icon: '🚀',
      gameId: 'memory',
      gameName: 'MEMORY QUEST',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
    {
      id: 'es_w6',
      theme: 'saludos',
      name: 'Taller de Palabras',
      icon: '🧩',
      gameId: 'sentence_builder',
      gameName: 'SENTENCE BUILDER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'es_w7',
      theme: 'colores',
      name: 'Caverna de Burbujas',
      icon: '🫧',
      gameId: 'bubble_popper',
      gameName: 'BUBBLE POPPER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'es_w8',
      theme: 'viajes',
      name: 'Ruta del Explorador',
      icon: '🛣️',
      gameId: 'drag_match',
      gameName: 'DRIVE CHALLENGE',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
  ],
  ar: [
    {
      id: 'ar_w1',
      theme: 'saludos',
      name: 'Oasis de Saludos',
      icon: '🌴',
      gameId: 'drive',
      gameName: 'FAYMA RUSH',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'ar_w2',
      theme: 'comida',
      name: 'Zoco de Sabores',
      icon: '☕',
      gameId: 'fruit',
      gameName: 'FAYMA SLICE',
      minDifficulty: 1,
      unlocked: false,
      completed: false,
    },
    {
      id: 'ar_w3',
      theme: 'colores',
      name: 'Palacio de Colores',
      icon: '🎨',
      gameId: 'combat',
      gameName: 'FAYMA BATTLE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'ar_w4',
      theme: 'animales',
      name: 'Dunas de la Fauna',
      icon: '🐪',
      gameId: 'slingshot',
      gameName: 'SLINGSHOT ADVENTURE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'ar_w5',
      theme: 'viajes',
      name: 'Constelación del Desierto',
      icon: '🌌',
      gameId: 'memory',
      gameName: 'MEMORY QUEST',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
    {
      id: 'ar_w6',
      theme: 'comida',
      name: 'Mercado de Frases',
      icon: '🧩',
      gameId: 'sentence_builder',
      gameName: 'SENTENCE BUILDER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'ar_w7',
      theme: 'colores',
      name: 'Cúpula de Color',
      icon: '🫧',
      gameId: 'bubble_popper',
      gameName: 'BUBBLE POPPER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'ar_w8',
      theme: 'viajes',
      name: 'Carretera del Viajero',
      icon: '🛣️',
      gameId: 'drag_match',
      gameName: 'DRIVE CHALLENGE',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
  ],
  'nl-BE': [
    {
      id: 'nl_w1',
      theme: 'saludos',
      name: 'Plaza Mayor de Brujas',
      icon: '🏰',
      gameId: 'drive',
      gameName: 'FAYMA RUSH',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'nl_w2',
      theme: 'comida',
      name: 'Chocolatería de Gante',
      icon: '🍫',
      gameId: 'fruit',
      gameName: 'FAYMA SLICE',
      minDifficulty: 1,
      unlocked: false,
      completed: false,
    },
    {
      id: 'nl_w3',
      theme: 'viajes',
      name: 'Canales de Flandes',
      icon: '🚲',
      gameId: 'combat',
      gameName: 'FAYMA BATTLE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'nl_w4',
      theme: 'animales',
      name: 'Bosque del León Flamenco',
      icon: '🦁',
      gameId: 'slingshot',
      gameName: 'SLINGSHOT ADVENTURE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'nl_w5',
      theme: 'colores',
      name: 'Taller de los Maestros',
      icon: '🎭',
      gameId: 'memory',
      gameName: 'MEMORY QUEST',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
    {
      id: 'nl_w6',
      theme: 'saludos',
      name: 'Zinnenatelier',
      icon: '🧩',
      gameId: 'sentence_builder',
      gameName: 'SENTENCE BUILDER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'nl_w7',
      theme: 'colores',
      name: 'Bellenkoepel',
      icon: '🫧',
      gameId: 'bubble_popper',
      gameName: 'BUBBLE POPPER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'nl_w8',
      theme: 'viajes',
      name: 'Ontdekkersroute',
      icon: '🛣️',
      gameId: 'drag_match',
      gameName: 'DRIVE CHALLENGE',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
  ],
  fr: [
    {
      id: 'fr_w1',
      theme: 'saludos',
      name: 'Boulevard de París',
      icon: '🥐',
      gameId: 'drive',
      gameName: 'FAYMA RUSH',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'fr_w2',
      theme: 'comida',
      name: 'Bistro Gourmet',
      icon: '🧀',
      gameId: 'fruit',
      gameName: 'FAYMA SLICE',
      minDifficulty: 1,
      unlocked: false,
      completed: false,
    },
    {
      id: 'fr_w3',
      theme: 'animales',
      name: 'Jardín de Versalles',
      icon: '🦋',
      gameId: 'combat',
      gameName: 'FAYMA BATTLE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'fr_w4',
      theme: 'colores',
      name: 'Montmartre de Artistas',
      icon: '🎨',
      gameId: 'slingshot',
      gameName: 'SLINGSHOT ADVENTURE',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'fr_w5',
      theme: 'viajes',
      name: 'Torre Luminosa',
      icon: '🗼',
      gameId: 'memory',
      gameName: 'MEMORY QUEST',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
    {
      id: 'fr_w6',
      theme: 'saludos',
      name: 'Atelier des phrases',
      icon: '🧩',
      gameId: 'sentence_builder',
      gameName: 'SENTENCE BUILDER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'fr_w7',
      theme: 'colores',
      name: 'Dôme des bulles',
      icon: '🫧',
      gameId: 'bubble_popper',
      gameName: 'BUBBLE POPPER',
      minDifficulty: 2,
      unlocked: false,
      completed: false,
    },
    {
      id: 'fr_w8',
      theme: 'viajes',
      name: 'Route des explorateurs',
      icon: '🛣️',
      gameId: 'drag_match',
      gameName: 'DRIVE CHALLENGE',
      minDifficulty: 3,
      unlocked: false,
      completed: false,
    },
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
          return savedNode ? { ...node, unlocked: savedNode.unlocked, completed: savedNode.completed } : node;
        });
      }
    });
    return merged;
  } catch {
    return DEFAULT_WORLDS;
  }
}


export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'BOOT',
  language: 'es',
  totalRounds: 3,
  currentRound: 1,
  currentPlayerIndex: 0,
  activeWorldId: 'saludos',
  activeWorldNodeId: null,
  activeWorldDifficulty: null,
  activeGameId: 'drag_match',
  sessionPhase: 'CHALLENGE_PHASE',
  scores: {},
  results: [],
  difficulties: {},
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
    const { activeWorldDifficulty } = get();
    const initialScores: Record<string, number> = {};
    const initialDiffs: Record<string, DifficultyLevel> = {};
    players.forEach(p => {
      initialScores[p.uid] = 0;
      initialDiffs[p.uid] = activeWorldDifficulty || 2;
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
    const passed = total > 0 && result.correct / total >= 0.6;

    if (activeIndex >= 0 && passed) {
      nodes[activeIndex] = { ...nodes[activeIndex], completed: true };
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
    const current = difficulties[playerUid] || 2;
    const next = Math.min(5, Math.max(1, current + delta)) as DifficultyLevel;
    set({
      difficulties: {
        ...difficulties,
        [playerUid]: next,
      },
    });
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
