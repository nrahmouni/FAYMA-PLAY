import { create } from 'zustand';
import { Screen, Language, DifficultyLevel, GameResult, PlayerProfile } from '../types';

export type GameSessionPhase = 'LEARNING_PHASE' | 'CHALLENGE_PHASE' | 'RESULT_PHASE';

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
  setActiveWorld: (worldId: string, gameId: string) => void;
  setSessionPhase: (phase: GameSessionPhase) => void;
  startSession: (players: PlayerProfile[]) => void;
  recordTurnResult: (result: GameResult) => void;
  advanceTurn: (totalPlayers: number) => { isGameOver: boolean };
  adjustDifficulty: (playerUid: string, delta: number) => void;
  resetSession: () => void;
}

const DEFAULT_WORLDS: Record<Language, WorldNode[]> = {
  ar: [
    {
      id: 'ar_w1',
      theme: 'saludos',
      name: 'Oasis de Saludos',
      icon: '🌴',
      gameId: 'drag_match',
      gameName: 'Arrastre Rápido',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'ar_w2',
      theme: 'comida',
      name: 'Zoco de Sabores',
      icon: '☕',
      gameId: 'memory',
      gameName: 'Memoria Mágica',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'ar_w3',
      theme: 'colores',
      name: 'Palacio de Colores',
      icon: '🎨',
      gameId: 'bubble_popper',
      gameName: 'Burbujas Árabes',
      minDifficulty: 2,
      unlocked: true,
      completed: false,
    },
    {
      id: 'ar_w4',
      theme: 'animales',
      name: 'Dunas de la Fauna',
      icon: '🐪',
      gameId: 'slingshot',
      gameName: 'Tirachinas Cósmico',
      minDifficulty: 2,
      unlocked: true,
      completed: false,
    },
    {
      id: 'ar_w5',
      theme: 'viajes',
      name: 'Constelación del Desierto',
      icon: '🌌',
      gameId: 'sentence_builder',
      gameName: 'Constructor de Frases',
      minDifficulty: 3,
      unlocked: true,
      completed: false,
    },
  ],
  'nl-BE': [
    {
      id: 'nl_w1',
      theme: 'saludos',
      name: 'Plaza Mayor de Brujas',
      icon: '🏰',
      gameId: 'drag_match',
      gameName: 'Arrastre Rápido',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'nl_w2',
      theme: 'comida',
      name: 'Chocolatería de Gante',
      icon: '🍫',
      gameId: 'memory',
      gameName: 'Memoria Mágica',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'nl_w3',
      theme: 'viajes',
      name: 'Canales de Flandes',
      icon: '🚲',
      gameId: 'slingshot',
      gameName: 'Tirachinas Flamenco',
      minDifficulty: 2,
      unlocked: true,
      completed: false,
    },
    {
      id: 'nl_w4',
      theme: 'animales',
      name: 'Bosque del León Flamenco',
      icon: '🦁',
      gameId: 'bubble_popper',
      gameName: 'Burbujas del Norte',
      minDifficulty: 2,
      unlocked: true,
      completed: false,
    },
    {
      id: 'nl_w5',
      theme: 'colores',
      name: 'Taller de los Maestros',
      icon: '🎭',
      gameId: 'sentence_builder',
      gameName: 'Constructor de Frases',
      minDifficulty: 3,
      unlocked: true,
      completed: false,
    },
  ],
  fr: [
    {
      id: 'fr_w1',
      theme: 'saludos',
      name: 'Boulevard de París',
      icon: '🥐',
      gameId: 'drag_match',
      gameName: 'Arrastre Rápido',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'fr_w2',
      theme: 'comida',
      name: 'Bistro Gourmet',
      icon: '🧀',
      gameId: 'memory',
      gameName: 'Memoria Mágica',
      minDifficulty: 1,
      unlocked: true,
      completed: false,
    },
    {
      id: 'fr_w3',
      theme: 'animales',
      name: 'Jardín de Versalles',
      icon: '🦋',
      gameId: 'slingshot',
      gameName: 'Tirachinas Francés',
      minDifficulty: 2,
      unlocked: true,
      completed: false,
    },
    {
      id: 'fr_w4',
      theme: 'colores',
      name: 'Montmartre de Artistas',
      icon: '🎨',
      gameId: 'bubble_popper',
      gameName: 'Burbujas de Neón',
      minDifficulty: 2,
      unlocked: true,
      completed: false,
    },
    {
      id: 'fr_w5',
      theme: 'viajes',
      name: 'Torre Luminosa',
      icon: '🗼',
      gameId: 'sentence_builder',
      gameName: 'Constructor de Frases',
      minDifficulty: 3,
      unlocked: true,
      completed: false,
    },
  ],
};

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'BOOT',
  language: 'ar',
  totalRounds: 3,
  currentRound: 1,
  currentPlayerIndex: 0,
  activeWorldId: 'saludos',
  activeGameId: 'drag_match',
  sessionPhase: 'LEARNING_PHASE',
  scores: {},
  results: [],
  difficulties: {},
  currentTurnResult: null,
  worldNodes: DEFAULT_WORLDS,

  setScreen: (screen) => set({ currentScreen: screen }),
  setLanguage: (lang) => set({ language: lang }),
  setTotalRounds: (rounds) => set({ totalRounds: rounds }),

  setActiveWorld: (worldId, gameId) => set({
    activeWorldId: worldId,
    activeGameId: gameId,
  }),

  setSessionPhase: (phase) => set({ sessionPhase: phase }),

  startSession: (players) => {
    const initialScores: Record<string, number> = {};
    const initialDiffs: Record<string, DifficultyLevel> = {};
    players.forEach(p => {
      initialScores[p.uid] = 0;
      initialDiffs[p.uid] = 2; // Medium start
    });

    set({
      currentRound: 1,
      currentPlayerIndex: 0,
      scores: initialScores,
      difficulties: initialDiffs,
      results: [],
      currentTurnResult: null,
      sessionPhase: 'LEARNING_PHASE',
      currentScreen: 'GAME_SESSION',
    });
  },

  recordTurnResult: (result) => {
    const { scores, results } = get();
    const prevScore = scores[result.playerId] || 0;
    const gained = (result.correct * 10) + Math.max(0, result.coinsEarned);

    set({
      scores: {
        ...scores,
        [result.playerId]: prevScore + gained,
      },
      results: [...results, result],
      currentTurnResult: result,
      sessionPhase: 'RESULT_PHASE',
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
      sessionPhase: 'LEARNING_PHASE',
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
    sessionPhase: 'LEARNING_PHASE',
  }),
}));
