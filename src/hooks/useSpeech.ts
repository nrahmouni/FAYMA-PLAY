import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../data/languages';

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available.length > 0) {
          setVoices(available);
        }
      } catch (err) {
        console.warn('Error reading voices:', err);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const findBestVoice = useCallback((lang: Language): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    const meta = LANGUAGES[lang];
    if (!meta) return null;

    const targets = [meta.voiceLang, ...meta.voiceFallbacks];

    // Priority 1: exact match on voice.lang
    for (const target of targets) {
      const match = voices.find(v => v.lang.toLowerCase() === target.toLowerCase());
      if (match) return match;
    }

    // Priority 2: starts with prefix (e.g. 'ar', 'nl', 'fr')
    const primaryPrefix = meta.code.split('-')[0].toLowerCase();
    const prefixMatch = voices.find(v => v.lang.toLowerCase().startsWith(primaryPrefix));
    if (prefixMatch) return prefixMatch;

    return null;
  }, [voices]);

  const speak = useCallback((text: string, lang: Language, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const voice = findBestVoice(lang);
      const meta = LANGUAGES[lang];
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = voice ? voice.lang : (meta?.voiceLang || 'en-US');
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.88; // Slightly slower for language learners
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        console.warn('TTS playback issue:', e);
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS exception handled gracefully:', err);
      setIsSpeaking(false);
      if (onEnd) onEnd();
    }
  }, [findBestVoice]);

  const hasVoiceForLanguage = useCallback((lang: Language): boolean => {
    if (!speechSupported) return false;
    return !!findBestVoice(lang);
  }, [speechSupported, findBestVoice]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    hasVoiceForLanguage,
    speechSupported,
    voicesCount: voices.length,
  };
}
