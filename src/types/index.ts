export type Language = 'ar' | 'nl-BE' | 'fr' | 'es' | 'en';
export type NativeLanguage = Language;

export type DifficultyLevel =
  | 1 | 2 | 3 | 4 | 5
  | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15;

export type MasteryLevel = 'new' | 'learning' | 'review' | 'mastered';

export interface Word {
  id: string;
  text: string;            // Palabra o frase en idioma objetivo
  translation: string;     // Significado en español
  phonetic?: string;       // Transcripción fonética de apoyo
  language: Language;
  theme: string;           // 'saludos', 'comida', 'colores', 'animales', 'viajes'
  imageUrl?: string;       // Emoji o URL representativa
  audioText?: string;      // Texto alternativo si el TTS requiere diacríticos
  exampleSentence?: string;
  exampleTranslation?: string;
  learningLevel?: DifficultyLevel;
  category?: string;
  english?: string;
}

export interface WordMastery {
  correct: number;
  wrong: number;
  lastSeen: number;
  level: MasteryLevel;
}

export interface PlayerProfile {
  uid: string;
  displayName: string;
  avatarUrl?: string;      // Animal avatar emoji or image URL
  color: string;
  createdAt: number;
  age?: number;            // Edad del niño (1 a 13 años) para aprendizaje adaptativo
  mastery: Record<string, WordMastery>;
  coins: number;
  gems: number;
  inventory: string[];     // IDs de ítems adquiridos
  equippedSkin?: string;
  equippedBadge?: string;
}

export interface GameSession {
  id: string;
  players: PlayerProfile[];
  rounds: number;
  currentRound: number;
  currentPlayerIndex: number;
  language: Language;
  worldId: string;
  scores: Record<string, number>;
  status: 'setup' | 'playing' | 'finished';
}

export interface GameResult {
  playerId: string;
  gameId: string;
  correct: number;
  wrong: number;
  timeMs: number;
  coinsEarned: number;
  wordsSeen: string[];
}

export interface GameProps {
  words: Word[];
  difficulty: DifficultyLevel;
  onCorrect: (wordId: string) => void;
  onWrong: (wordId: string) => void;
  onComplete: (result: GameResult) => void;
  language: Language;
  nativeLanguage?: Language;
  introSpoken?: boolean;
}

export type Screen = 
  | 'BOOT' 
  | 'AUTH' 
  | 'PLAYER_SETUP' 
  | 'NATIVE_LANG_SETUP'
  | 'TARGET_LANG_SETUP'
  | 'HOME' 
  | 'WORLD_HUB' 
  | 'LEARN_FLEMISH'
  | 'REWARDS'
  | 'PASSPORT'
  | 'GAME_SESSION' 
  | 'REWARD_GAME'
  | 'PODIUM' 
  | 'GARAGE';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'avatar_frame' | 'mascot_skin' | 'theme_color' | 'badge';
  price: number;
  currency: 'coins' | 'gems';
  previewEmoji: string;
  previewImage?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  glowColor?: string;
}

export interface LanguageMeta {
  code: NativeLanguage;
  country: string;
  name: string;
  nativeName: string;
  flag: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  voiceLang: string;
  voiceFallbacks: string[];
  dir: 'ltr' | 'rtl';
  description: string;
}
