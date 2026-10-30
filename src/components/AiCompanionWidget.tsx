import React, { useState } from 'react';
import { Sparkles, Volume2, X, Lightbulb, MessageCircle } from 'lucide-react';
import { Language, NativeLanguage, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';

interface AiCompanionWidgetProps {
  currentWord?: Word;
  language: Language;
  nativeLanguage?: NativeLanguage;
  playerName?: string;
  streak?: number;
  compact?: boolean;
}

interface ClueData {
  riddle: string;
  nativeHint: string;
  soundTip: string;
}

const UI_COPY: Record<Language, { aiHelp: string; magicClue: string; loading: string; buddyName: string; close: string; listenTarget: string; listenNative: string }> = {
  es: {
    aiHelp: 'Pista Mágica IA',
    magicClue: 'El Búho Mágico dice:',
    loading: 'Consultando la magia de la IA...',
    buddyName: 'Fayma Buddy',
    close: 'Cerrar pista',
    listenTarget: 'Escuchar en el idioma que aprendes',
    listenNative: 'Escuchar explicación en tu idioma',
  },
  en: {
    aiHelp: 'AI Magic Clue',
    magicClue: 'Magic Owl says:',
    loading: 'Summoning AI magic...',
    buddyName: 'Fayma Buddy',
    close: 'Close clue',
    listenTarget: 'Listen in target language',
    listenNative: 'Listen explanation in native language',
  },
  fr: {
    aiHelp: 'Indice Magique IA',
    magicClue: 'Le Hibou Magique dit :',
    loading: 'Magie de l’IA en cours...',
    buddyName: 'Fayma Buddy',
    close: 'Fermer l’indice',
    listenTarget: 'Écouter dans la langue cible',
    listenNative: 'Écouter l’explication en langue natale',
  },
  'nl-BE': {
    aiHelp: 'AI Magische Tip',
    magicClue: 'De Magische Uil zegt:',
    loading: 'AI-magie oproepen...',
    buddyName: 'Fayma Buddy',
    close: 'Sluiten',
    listenTarget: 'Luister in doeltaal',
    listenNative: 'Luister uitleg in moedertaal',
  },
  ar: {
    aiHelp: 'تلميح الذكاء الاصطناعي',
    magicClue: 'البومة السحرية تقول:',
    loading: 'جارٍ استدعاء السحر...',
    buddyName: 'فايما الصديق',
    close: 'إغلاق',
    listenTarget: 'استمع باللغة التي تتعلمها',
    listenNative: 'استمع للشرح بلغتك الأم',
  },
};

export const AiCompanionWidget: React.FC<AiCompanionWidgetProps> = ({
  currentWord,
  language,
  nativeLanguage = 'es',
  playerName = 'Campeón',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clue, setClue] = useState<ClueData | null>(null);
  const { speak } = useSpeech();
  const copy = UI_COPY[language] || UI_COPY.es;

  const fetchClue = async () => {
    if (!currentWord) return;
    setIsOpen(true);
    if (clue) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/story-clue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: currentWord.text,
          translation: currentWord.translation,
          language,
          nativeLanguage,
        }),
      });
      const data = await res.json();
      setClue(data);
      // Auto-read the clue in the target language
      if (data.riddle) {
        speak(data.riddle, language);
      }
    } catch {
      setClue({
        riddle: `¡Mira bien la palabra: ${currentWord.text}!`,
        nativeHint: `Significa "${currentWord.translation}" en tu idioma.`,
        soundTip: `¡Repite con fuerza!`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Companion Trigger Button */}
      <button
        type="button"
        onClick={isOpen ? () => setIsOpen(false) : fetchClue}
        className={`group relative flex items-center gap-2 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-200 px-3 py-2 text-xs font-black text-amber-950 shadow-md transition-all hover:scale-105 active:scale-95 sm:text-sm ${
          compact ? 'px-2 py-1.5' : ''
        }`}
        title={copy.aiHelp}
        aria-label={copy.aiHelp}
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-2 ring-amber-400">
          <img
            src="/assets/ai/fayma-buddy.jpg"
            alt="AI Mascot"
            className="h-full w-full object-cover transition-transform group-hover:rotate-6 group-hover:scale-110"
          />
        </span>
        <span className="flex items-center gap-1 font-extrabold tracking-wide">
          <Sparkles className="h-4 w-4 text-amber-600 animate-pulse" />
          <span>{copy.aiHelp}</span>
        </span>
      </button>

      {/* Popover Bubble */}
      {isOpen && (
        <div
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          className="absolute bottom-full mb-3 z-50 w-72 max-w-[90vw] rounded-3xl border-3 border-amber-300 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:w-80"
        >
          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-amber-100">
                <img src="/assets/ai/fayma-buddy.jpg" alt="" className="h-full w-full object-cover" />
              </span>
              <span className="text-xs font-black text-amber-900">{copy.buddyName}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={copy.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-left text-xs sm:text-sm">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-amber-700 font-bold">
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>{copy.loading}</span>
              </div>
            ) : clue ? (
              <>
                {/* Target language clue (primary) */}
                <div className="rounded-2xl bg-amber-50/80 p-3 border border-amber-200">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900 leading-snug">
                      {clue.riddle}
                    </p>
                    <button
                      type="button"
                      onClick={() => speak(clue.riddle, language)}
                      className="shrink-0 rounded-xl bg-amber-200 p-1.5 text-amber-900 hover:bg-amber-300 transition"
                      title={copy.listenTarget}
                      aria-label={copy.listenTarget}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Native language translation guide */}
                <div className="rounded-2xl bg-sky-50 p-2.5 border border-sky-100">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-sky-900 leading-snug">
                      <span className="font-black">💡 {clue.nativeHint}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => speak(clue.nativeHint, nativeLanguage)}
                      className="shrink-0 rounded-xl bg-sky-200 p-1.5 text-sky-900 hover:bg-sky-300 transition"
                      title={copy.listenNative}
                      aria-label={copy.listenNative}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {clue.soundTip && (
                  <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 px-1">
                    <span>✨ {clue.soundTip}</span>
                  </p>
                )}
              </>
            ) : null}
          </div>

          {/* Triangle bubble arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 border-b-3 border-r-3 border-amber-300 bg-white" />
        </div>
      )}
    </div>
  );
};
