import { auth } from './firebase.ts';
import { PlayerProfile, GameResult } from '../types';

async function getAuthHeader(): Promise<HeadersInit> {
  const user = auth?.currentUser;
  if (!user) {
    return { 'Content-Type': 'application/json' };
  }
  try {
    const token = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } catch (err) {
    console.warn('Failed to retrieve Firebase ID token:', err);
    return { 'Content-Type': 'application/json' };
  }
}

export async function syncUserWithCloudSQL(profile: PlayerProfile) {
  if (!auth?.currentUser) return null;
  try {
    const headers = await getAuthHeader();
    // 1. Sync / init user
    const syncRes = await fetch('/api/user/sync', { headers });
    if (!syncRes.ok) throw new Error('Failed to sync user');
    const syncData = await syncRes.json();

    // 2. Upsert child profile
    const childRes = await fetch('/api/user/child-profile', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: profile.displayName || 'Aventurero',
        avatar: profile.avatarUrl || '🦁',
        totalStars: profile.coins || 0,
        level: profile.age || 6,
      }),
    });
    const childData = childRes.ok ? await childRes.json() : null;

    return { syncData, childData };
  } catch (error) {
    console.warn('Cloud SQL sync notice (offline or guest):', error);
    return null;
  }
}

export async function recordGameSessionToCloudSQL(result: {
  gameType: string;
  targetLanguage: string;
  score: number;
  starsEarned: number;
  accuracy: number;
}) {
  if (!auth?.currentUser) return null;
  try {
    const headers = await getAuthHeader();
    const res = await fetch('/api/game/record-session', {
      method: 'POST',
      headers,
      body: JSON.stringify(result),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Could not record game session to Cloud SQL:', err);
    return null;
  }
}

export async function recordLearnedWordToCloudSQL(wordData: {
  word: string;
  translation: string;
  targetLanguage: string;
  nativeLanguage: string;
}) {
  if (!auth?.currentUser) return null;
  try {
    const headers = await getAuthHeader();
    const res = await fetch('/api/game/record-word', {
      method: 'POST',
      headers,
      body: JSON.stringify(wordData),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Could not record learned word to Cloud SQL:', err);
    return null;
  }
}

export async function fetchUserStatsFromCloudSQL() {
  if (!auth?.currentUser) return null;
  try {
    const headers = await getAuthHeader();
    const res = await fetch('/api/game/stats', { headers });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch stats from Cloud SQL:', err);
    return null;
  }
}
