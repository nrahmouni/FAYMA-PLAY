import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Word, Language, PlayerProfile } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';

interface SmartLearningModalProps {
  words: Word[];
  language: Language;
  player: PlayerProfile;
  onReady: () => void;
}

export const SmartLearningModal: React.FC<SmartLearningModalProps> = ({
  words,
  language,
  player,
  onReady,
}) => {
  const [selectedWordIdx, setSelectedWordIdx] = useState(0);
  const { speak, isSpeaking } = useSpeech();
  const { playCardFlip } = useSound();

  const isArabic = language === 'ar';
  const currentWord = words[selectedWordIdx] || words[0];

  const handlePlayVoice = (word: Word) => {
    playCardFlip();
    speak(word.audioText || word.text, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border-2 border-cyan-400/40 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Fase 1: Descubrimiento de Vocabulario</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-bold border border-white/5">
            <span>Turno de</span>
            <span className="text-amber-400">{player.displayName}</span>
          </div>
        </div>

        {/* Word Tabs */}
        <div className="flex gap-2 mb-5">
          {words.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => {
                setSelectedWordIdx(idx);
                handlePlayVoice(w);
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 border ${
                selectedWordIdx === idx
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-lg'
                  : 'glass-card text-slate-400 hover:text-white border-white/5'
              }`}
            >
              <span>{w.imageUrl || '✨'}</span>
              <span className="truncate max-w-[80px]">{w.translation}</span>
            </button>
          ))}
        </div>

        {/* Hero Presentation Card */}
        {currentWord && (
          <div className="w-full rounded-2xl glass-card p-6 flex flex-col items-center justify-center text-center border border-white/10 relative my-2">
            <span className="text-5xl sm:text-6xl mb-3 select-none filter drop-shadow">
              {currentWord.imageUrl || '🌟'}
            </span>

            {/* Native word */}
            <h2
              className={`font-black text-slate-100 mb-1 select-none ${
                isArabic ? 'text-4xl sm:text-5xl font-arabic py-2' : 'text-3xl sm:text-4xl'
              }`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {currentWord.text}
            </h2>

            {/* Phonetic Badge */}
            {currentWord.phonetic && (
              <div className="px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 text-xs sm:text-sm font-mono border border-cyan-500/20 mb-3">
                /{currentWord.phonetic}/
              </div>
            )}

            {/* Meaning */}
            <p className="text-lg sm:text-xl font-bold text-slate-200">
              {currentWord.translation}
            </p>

            {/* Example sentence if present */}
            {currentWord.exampleSentence && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 w-full text-xs text-slate-300 border border-white/5">
                <span className="font-arabic font-bold text-cyan-300 block mb-0.5">
                  {currentWord.exampleSentence}
                </span>
                <span className="text-slate-400 italic">
                  "{currentWord.exampleTranslation}"
                </span>
              </div>
            )}

            {/* Audio Button */}
            <button
              type="button"
              onClick={() => handlePlayVoice(currentWord)}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 active:scale-95 transition shadow-lg shadow-cyan-500/20"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>Escuchar Pronunciación</span>
            </button>
          </div>
        )}

        {/* Ready / Start Challenge Button */}
        <button
          type="button"
          onClick={onReady}
          className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl hover:opacity-95 active:scale-98 transition cursor-pointer"
        >
          <span>¡Estoy Listo para el Desafío!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
