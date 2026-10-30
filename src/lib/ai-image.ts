// AI Word Image generation and cache utility

const localCache = new Map<string, string>();

// Initialize from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('fayma_ai_images');
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, val]) => {
        if (typeof val === 'string') localCache.set(key, val);
      });
    }
  } catch {
    // Ignore storage errors
  }
}

function saveLocalCache() {
  if (typeof window === 'undefined') return;
  try {
    const obj: Record<string, string> = {};
    // Store only up to 60 items to keep localStorage light
    let count = 0;
    for (const [k, v] of localCache.entries()) {
      if (count++ > 60) break;
      obj[k] = v;
    }
    localStorage.setItem('fayma_ai_images', JSON.stringify(obj));
  } catch {
    // Ignore quota errors
  }
}

const failedKeys = new Set<string>();
let rateLimitedUntil = 0;

export async function fetchAiWordImage(
  word: string,
  translation: string = '',
  language: string = 'es'
): Promise<string | null> {
  if (!word) return null;
  const key = `${word.toLowerCase().trim()}:${translation.toLowerCase().trim()}`;

  if (localCache.has(key)) {
    return localCache.get(key) || null;
  }

  // If this key failed recently or if we're in a rate-limit cooldown, return null immediately
  if (failedKeys.has(key) || Date.now() < rateLimitedUntil) {
    return null;
  }

  try {
    const res = await fetch('/api/ai/generate-word-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, translation, language }),
    });

    if (!res.ok) {
      failedKeys.add(key);
      return null;
    }
    const data = await res.json();

    if (data.error && String(data.error).includes('429')) {
      // 10 minute cooldown on quota limit
      rateLimitedUntil = Date.now() + 10 * 60 * 1000;
      failedKeys.add(key);
      return null;
    }

    if (data.imageUrl) {
      localCache.set(key, data.imageUrl);
      saveLocalCache();
      return data.imageUrl;
    }

    failedKeys.add(key);
    return null;
  } catch (err) {
    console.warn('AI word image fetch notice:', err);
    failedKeys.add(key);
    return null;
  }
}

export function getCachedAiImage(word: string, translation: string = ''): string | null {
  const key = `${word.toLowerCase().trim()}:${translation.toLowerCase().trim()}`;
  return localCache.get(key) || null;
}
