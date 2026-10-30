import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import {
  getChildProfiles,
  upsertChildProfile,
  recordGameSession,
  recordLearnedWord,
  getRecentSessions,
  getLearnedWordsList,
} from './src/db/learning.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cache for generated clues to keep app ultra-fast and responsive
const clueCache = new Map<string, any>();

// POST /api/ai/story-clue
app.post('/api/ai/story-clue', async (req, res) => {
  const { word, translation, language = 'es', nativeLanguage = 'es', age = 6 } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'Missing word parameter' });
  }

  const cacheKey = `${language}:${nativeLanguage}:${word.toLowerCase()}`;
  if (clueCache.has(cacheKey)) {
    return res.json(clueCache.get(cacheKey));
  }

  // Fallbacks if AI is unreachable or no key
  const fallback = {
    riddle: language === 'ar' ? `ابحث عن: ${word}! ✨` : `Find the magical: ${word}! ✨`,
    nativeHint: `Pista en tu idioma: Significa "${translation}" 💡`,
    soundTip: `¡Repite en voz alta con energía! 🗣️✨`,
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallback);
  }

  try {
    const prompt = `You are "Fayma Buddy", a cute, magical 3D owl robot mascot for a children's language learning video game (player age ${age}).
Word to teach: "${word}" (meaning in Spanish/English: "${translation}").
Target Language to learn: ${language} (es=Spanish, ar=Arabic, nl-BE=Dutch/Flemish, fr=French, en=English).
Child's native language: ${nativeLanguage}.

Generate a JSON object with:
1. "riddle": A delightful, very simple 1-sentence mystery riddle or clue strictly in the TARGET language (${language}) that describes the word for a child.
2. "nativeHint": A gentle 1-sentence helpful explanation strictly in the child's NATIVE language (${nativeLanguage}).
3. "soundTip": A fun phonetic sound cue or cheer (e.g., "Suena como...", "Bip-bop!").

Respond ONLY with valid JSON with keys: "riddle", "nativeHint", "soundTip". No markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    const result = {
      riddle: parsed.riddle || fallback.riddle,
      nativeHint: parsed.nativeHint || fallback.nativeHint,
      soundTip: parsed.soundTip || fallback.soundTip,
    };
    clueCache.set(cacheKey, result);
    return res.json(result);
  } catch (error) {
    console.warn('AI Story Clue generation fallback:', error);
    return res.json(fallback);
  }
});

// POST /api/ai/companion-cheer
app.post('/api/ai/companion-cheer', async (req, res) => {
  const { name = 'Campeón', streak = 1, language = 'es', nativeLanguage = 'es', situation = 'correct' } = req.body;

  const fallback = {
    target: language === 'ar' ? `أحسنت يا بطل! 🌟` : language === 'nl-BE' ? `Geweldig gedaan! 🌟` : language === 'fr' ? `Bravo champion! 🌟` : language === 'en' ? `Super job! 🌟` : `¡Increíble trabajo! 🌟`,
    native: `¡Vas por una racha de ${streak}! 🚀`,
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallback);
  }

  try {
    const prompt = `Generate a 1-sentence cheerful mascot dialogue for a kid's educational game.
Child name: ${name}, streak: ${streak}, situation: ${situation} (correct, wrong, streak_bonus).
Target language: ${language}, Native language: ${nativeLanguage}.
Return strictly JSON with:
"target": short cheering phrase in target language (${language}).
"native": short translation/guidance in native language (${nativeLanguage}).
No markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      target: parsed.target || fallback.target,
      native: parsed.native || fallback.native,
    });
  } catch (error) {
    return res.json(fallback);
  }
});

// POST /api/ai/magic-word-quest
app.post('/api/ai/magic-word-quest', async (req, res) => {
  const { theme = 'animals', language = 'es', nativeLanguage = 'es', level = 1 } = req.body;

  const fallback = {
    questTitle: 'La Búsqueda Mágica',
    story: '¡Un pequeño pajarito necesita encontrar su camino a casa! ¿Puedes ayudarle?',
    storyTarget: 'Help our little friend find the magical item!',
    mysteryItems: [
      { id: 'q1', word: 'water', translation: 'agua', isCorrect: true, emoji: '💧' },
      { id: 'q2', word: 'rock', translation: 'roca', isCorrect: false, emoji: '🪨' },
      { id: 'q3', word: 'fire', translation: 'fuego', isCorrect: false, emoji: '🔥' },
    ],
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallback);
  }

  try {
    const prompt = `Create a kid-friendly mini quest for language learning.
Theme: ${theme}, Target language: ${language}, Native language: ${nativeLanguage}, Difficulty level: ${level}.
Return JSON with:
"questTitle": title in native language
"story": 1-2 sentence whimsical situation in native language
"storyTarget": same situation simplified in target language
"targetPrompt": short question in target language asking child to pick the right item
"mysteryItems": array of 3 options, each with { "id": "1", "word": "word in target language", "translation": "in native language", "isCorrect": boolean (exactly one true), "emoji": "symbol" }
No markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed.mysteryItems ? parsed : fallback);
  } catch (error) {
    return res.json(fallback);
  }
});

// Image cache in memory
const imageCache = new Map<string, string>();

// POST /api/ai/generate-word-image
app.post('/api/ai/generate-word-image', async (req, res) => {
  const { word, translation = '', language = 'es' } = req.body;
  if (!word) {
    return res.status(400).json({ error: 'Missing word parameter' });
  }

  const cacheKey = `${String(word).toLowerCase().trim()}:${String(translation).toLowerCase().trim()}`;
  if (imageCache.has(cacheKey)) {
    return res.json({ imageUrl: imageCache.get(cacheKey), cached: true });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ imageUrl: null, error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const prompt = `Cute 3D Pixar style sticker illustration for kids educational video game representing: "${word}" (${translation || word}). Friendly, vibrant, high-fidelity, solid soft pastel background, isolated sticker format, no text inside image.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        const dataUrl = `data:${mime};base64,${part.inlineData.data}`;
        imageCache.set(cacheKey, dataUrl);
        return res.json({ imageUrl: dataUrl, cached: false });
      }
    }

    return res.json({ imageUrl: null, notice: 'No image parts returned' });
  } catch (error: any) {
    console.warn('AI Word Image generation notice:', error?.message || error);
    return res.json({ imageUrl: null, error: error?.message || 'Generation failed' });
  }
});

// --- Cloud SQL Relational Endpoints (PostgreSQL + Firebase Auth) ---
app.get('/api/user/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const email = req.user?.email || `${uid}@placeholder.app`;
    const displayName = (req.user as any)?.name || '';
    const photoUrl = (req.user as any)?.picture || '';

    if (!uid) {
      return res.status(401).json({ error: 'Missing UID' });
    }

    const user = await getOrCreateUser(uid, email, displayName, photoUrl);
    const childList = await getChildProfiles(user.id);
    const recentSessions = await getRecentSessions(user.id);
    const learnedWords = await getLearnedWordsList(user.id);

    return res.json({
      user,
      childProfiles: childList,
      recentSessions,
      learnedWords,
    });
  } catch (error) {
    console.error('Failed to sync user with Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to sync user with database' });
  }
});

app.post('/api/user/child-profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Missing UID' });

    const user = await getOrCreateUser(uid, req.user?.email || `${uid}@placeholder.app`);
    const { name, avatar, nativeLanguage, targetLanguage, totalStars, level, streak } = req.body;

    const child = await upsertChildProfile(user.id, {
      name: name || 'Aventurero',
      avatar,
      nativeLanguage,
      targetLanguage,
      totalStars,
      level,
      streak,
    });

    return res.json({ success: true, profile: child });
  } catch (error) {
    console.error('Failed to save child profile in Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to update child profile' });
  }
});

app.post('/api/game/record-session', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Missing UID' });

    const user = await getOrCreateUser(uid, req.user?.email || `${uid}@placeholder.app`);
    const { gameType, targetLanguage, score, starsEarned, accuracy, childId } = req.body;

    const session = await recordGameSession(user.id, {
      childId: childId ? Number(childId) : undefined,
      gameType: gameType || 'arcade',
      targetLanguage: targetLanguage || 'es',
      score: Number(score) || 0,
      starsEarned: Number(starsEarned) || 0,
      accuracy: Number(accuracy) || 100,
    });

    return res.json({ success: true, session });
  } catch (error) {
    console.error('Failed to record game session in Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to record session' });
  }
});

app.post('/api/game/record-word', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Missing UID' });

    const user = await getOrCreateUser(uid, req.user?.email || `${uid}@placeholder.app`);
    const { word, translation, targetLanguage, nativeLanguage, childId } = req.body;

    if (!word || !translation) {
      return res.status(400).json({ error: 'Missing word or translation' });
    }

    const recorded = await recordLearnedWord(user.id, {
      childId: childId ? Number(childId) : undefined,
      word,
      translation,
      targetLanguage: targetLanguage || 'es',
      nativeLanguage: nativeLanguage || 'es',
    });

    return res.json({ success: true, word: recorded });
  } catch (error) {
    console.error('Failed to record word in Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to record word' });
  }
});

app.get('/api/game/stats', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Missing UID' });

    const user = await getUserByUid(uid);
    if (!user) return res.json({ sessions: [], words: [] });

    const sessions = await getRecentSessions(user.id);
    const words = await getLearnedWordsList(user.id);

    return res.json({ sessions, words });
  } catch (error) {
    console.error('Failed to fetch stats from Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
