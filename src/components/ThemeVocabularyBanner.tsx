import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { WordIcon } from './WordIcon';
import { Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';

interface ThemeVocabularyBannerProps {
  words: Word[];
  title?: string;
  themeColor?: string;
}

export const ThemeVocabularyBanner: React.FC<ThemeVocabularyBannerProps> = ({
  words,
  title = 'Palabras Clave del Mundo',
  themeColor = '#06b6d4',
}) => {
  const { speak, hasVoiceForLanguage, isSpeaking } = useSpeech();

  if (!words || words.length === 0) return null;

  return (
    <div className="w-full rounded-2xl glass-panel p-4 sm:p-5 border border-white/10 shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-200 tracking-wide">
            {title}
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-white/5">
          {words.length} conceptos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {words.map((word) => {
          const hasVoice = hasVoiceForLanguage(word.language);
          const isArabic = word.language === 'ar';

          return (
            <div
              key={word.id}
              className="flex items-center justify-between p-2.5 rounded-xl glass-card hover:bg-slate-800/80 transition group border border-white/5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <WordIcon icon={word.imageUrl} esWord={word.translation} size="md" className="text-2xl shrink-0" />
                <div className="min-w-0">
                  <div className={`font-bold text-slate-100 truncate ${isArabic ? 'text-lg font-arabic' : 'text-base'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                    {word.text}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                    <span>{word.translation}</span>
                    {word.phonetic && (
                      <span className="text-cyan-400/80 font-mono text-[11px]">[{word.phonetic}]</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => speak(word.audioText || word.text, word.language)}
                className={`p-2 rounded-lg transition ${
                  hasVoice
                    ? 'text-cyan-400 hover:bg-cyan-500/20 active:scale-90'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
                title={hasVoice ? 'Escuchar pronunciación' : 'Voz no nativa disponible en este dispositivo'}
                aria-label={`Pronunciar ${word.text}`}
              >
                {hasVoice ? (
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-cyan-300' : ''}`} />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
