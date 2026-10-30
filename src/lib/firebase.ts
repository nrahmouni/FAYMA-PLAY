import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDoc, setDoc, updateDoc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PlayerProfile, GameSession, GameResult } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = auth;
  const currentUser = currentAuth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

let app: FirebaseApp | null = null;
export let db: Firestore | null = null;
export let auth: Auth | null = null;
export const googleProvider = new GoogleAuthProvider();

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    // Critical: pass the firestoreDatabaseId if configured
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('Firebase initialization in fallback mode:', err);
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using local mode.');
    }
    return false;
  }
}

// Dual persistence user sync helper
export async function syncUserProfile(profile: PlayerProfile): Promise<void> {
  if (!db || !auth?.currentUser || auth.currentUser.uid !== profile.uid) {
    // Save to localStorage as guest
    localStorage.setItem(`juegofy_profile_${profile.uid}`, JSON.stringify(profile));
    return;
  }

  const userPath = `users/${profile.uid}`;
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    const cloudProfile = { ...profile };
    if (cloudProfile.avatarUrl?.startsWith('data:')) delete cloudProfile.avatarUrl;
    await setDoc(userDocRef, {
      ...cloudProfile,
      updatedAt: Date.now(),
    }, { merge: true });
    localStorage.setItem(`juegofy_profile_${profile.uid}`, JSON.stringify(profile));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
    // Fallback to local storage
    localStorage.setItem(`juegofy_profile_${profile.uid}`, JSON.stringify(profile));
  }
}

export async function fetchUserProfile(uid: string): Promise<PlayerProfile | null> {
  // Check local first
  const local = localStorage.getItem(`juegofy_profile_${uid}`);
  let localData: PlayerProfile | null = null;
  if (local) {
    try {
      localData = JSON.parse(local);
    } catch {
      // ignore parse error
    }
  }

  if (!db || !auth?.currentUser) {
    return localData;
  }

  const userPath = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as PlayerProfile;
      if (localData?.avatarUrl?.startsWith('data:')) {
        data.avatarUrl = localData.avatarUrl;
      }
      localStorage.setItem(`juegofy_profile_${uid}`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
  }

  return localData;
}

export async function loginWithGoogle(): Promise<User | null> {
  if (!auth) throw new Error('Firebase Auth no inicializado');
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function recordGameSessionToFirestore(
  sessionId: string,
  result: GameResult,
  language: string
): Promise<void> {
  if (!db || !auth?.currentUser) return;
  const path = `sessions/${sessionId}/results/${Date.now()}`;
  try {
    const sessionDocRef = doc(db, 'sessions', sessionId);
    await setDoc(sessionDocRef, {
      id: sessionId,
      userId: auth.currentUser.uid,
      language,
      status: 'playing',
      updatedAt: Date.now(),
    }, { merge: true });

    const resultDocRef = doc(db, `sessions/${sessionId}/results`, `res_${Date.now()}`);
    await setDoc(resultDocRef, {
      playerId: result.playerId,
      gameId: result.gameId,
      correct: result.correct,
      wrong: result.wrong,
      timeMs: result.timeMs || 0,
      coinsEarned: result.coinsEarned || 0,
      wordsSeen: result.wordsSeen || [],
      createdAt: Date.now(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

