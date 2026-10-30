import { db } from './index.ts';
import { childProfiles, gameSessions, learnedWords } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getChildProfiles(userId: number) {
  try {
    return await db.select().from(childProfiles).where(eq(childProfiles.userId, userId));
  } catch (error) {
    console.error('Database getChildProfiles failed:', error);
    throw new Error('Database query failed', { cause: error });
  }
}

export async function upsertChildProfile(
  userId: number,
  data: {
    name: string;
    avatar?: string;
    nativeLanguage?: string;
    targetLanguage?: string;
    totalStars?: number;
    level?: number;
    streak?: number;
  }
) {
  try {
    // Check if child exists for user
    const existing = await db
      .select()
      .from(childProfiles)
      .where(eq(childProfiles.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(childProfiles)
        .set({
          name: data.name,
          avatar: data.avatar || existing[0].avatar,
          nativeLanguage: data.nativeLanguage || existing[0].nativeLanguage,
          targetLanguage: data.targetLanguage || existing[0].targetLanguage,
          totalStars: data.totalStars !== undefined ? data.totalStars : existing[0].totalStars,
          level: data.level !== undefined ? data.level : existing[0].level,
          streak: data.streak !== undefined ? data.streak : existing[0].streak,
          lastActive: new Date(),
        })
        .where(eq(childProfiles.id, existing[0].id))
        .returning();
      return updated[0];
    } else {
      const created = await db
        .insert(childProfiles)
        .values({
          userId,
          name: data.name,
          avatar: data.avatar || '🦁',
          nativeLanguage: data.nativeLanguage || 'es',
          targetLanguage: data.targetLanguage || 'en',
          totalStars: data.totalStars || 0,
          level: data.level || 1,
          streak: data.streak || 0,
        })
        .returning();
      return created[0];
    }
  } catch (error) {
    console.error('Database upsertChildProfile failed:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}

export async function recordGameSession(
  userId: number,
  session: {
    childId?: number;
    gameType: string;
    targetLanguage: string;
    score: number;
    starsEarned: number;
    accuracy: number;
  }
) {
  try {
    const res = await db
      .insert(gameSessions)
      .values({
        userId,
        childId: session.childId || null,
        gameType: session.gameType,
        targetLanguage: session.targetLanguage,
        score: session.score,
        starsEarned: session.starsEarned,
        accuracy: session.accuracy,
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('Database recordGameSession failed:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}

export async function recordLearnedWord(
  userId: number,
  data: {
    childId?: number;
    word: string;
    translation: string;
    targetLanguage: string;
    nativeLanguage: string;
  }
) {
  try {
    const res = await db
      .insert(learnedWords)
      .values({
        userId,
        childId: data.childId || null,
        word: data.word,
        translation: data.translation,
        targetLanguage: data.targetLanguage,
        nativeLanguage: data.nativeLanguage,
        masteryLevel: 1,
        timesPracticed: 1,
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error('Database recordLearnedWord failed:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}

export async function getRecentSessions(userId: number) {
  try {
    return await db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.userId, userId))
      .orderBy(desc(gameSessions.completedAt))
      .limit(10);
  } catch (error) {
    console.error('Database getRecentSessions failed:', error);
    throw new Error('Database query failed', { cause: error });
  }
}

export async function getLearnedWordsList(userId: number) {
  try {
    return await db
      .select()
      .from(learnedWords)
      .where(eq(learnedWords.userId, userId))
      .orderBy(desc(learnedWords.lastPracticed))
      .limit(50);
  } catch (error) {
    console.error('Database getLearnedWordsList failed:', error);
    throw new Error('Database query failed', { cause: error });
  }
}
