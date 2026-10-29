import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Word, Language, PlayerProfile } from '../types';
import { WordIcon } from '../components/WordIcon';
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

  useEffect(() => {
    if (currentWord) {
      speak(currentWord.audioText || currentWord.text, language);
    }
  }, [selectedWordIdx, currentWord, language, speak]);

  const handlePlayVoice = (word: Word) => {
    playCardFlip();
    speak(word.audioText || word.text, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl rounded-3xl glass-panel p-5 sm:p-8 shadow-2xl border-3 border-cyan-400/50 relative overflow-hidden"
      >
        {/* Child Friendly Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-xs uppercase tracking-wider border border-cyan-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Paso 1: ¡Aprende la palabra!</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/20 text-xs text-amber-300 font-black border border-amber-500/30">
            <span>🎮 Le toca a:</span>
            <span className="text-white text-sm">{player.displayName}</span>
          </div>
        </div>

        {/* Word Tabs: Big Friendly Buttons */}
        <div className="flex gap-2 mb-4">
          {words.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => {
                setSelectedWordIdx(idx);
                handlePlayVoice(w);
              }}
              className={`flex-1 py-3 px-2 rounded-2xl text-sm font-black transition flex items-center justify-center gap-2 border-2 cursor-pointer ${
                selectedWordIdx === idx
                  ? 'bg-cyan-500/30 text-white border-cyan-400 shadow-xl scale-102'
                  : 'glass-card text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <WordIcon icon={w.imageUrl} esWord={w.translation} size="md" className="text-2xl select-none" />
              <span className="truncate max-w-[90px]">{w.text}</span>
            </button>
          ))}
        </div>

        {/* Big Presentation Card */}
        {currentWord && (
          <div className="w-full rounded-3xl glass-card p-6 flex flex-col items-center justify-center text-center border-2 border-white/15 relative my-2 shadow-inner">
            <WordIcon icon={currentWord.imageUrl} esWord={currentWord.translation} size="3xl" className="text-6xl sm:text-7xl mb-2 select-none filter drop-shadow animate-float" />

            {/* Word in Target Language */}
            <h2
              className={`font-black text-slate-100 mb-1 select-none tracking-wide ${
                isArabic ? 'text-4xl sm:text-5xl font-arabic py-2' : 'text-3xl sm:text-4xl'
              }`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {currentWord.text}
            </h2>

            {/* Meaning in Spanish */}
            <p className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
              {currentWord.translation}
            </p>

            {/* Phonetic transcription badge */}
            {currentWord.phonetic && (
              <div className="px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 text-xs sm:text-sm font-mono border border-cyan-500/20 mt-2">
                Suena como: <strong>{currentWord.phonetic}</strong>
              </div>
            )}

            {/* Big Loudspeaker Listen Button */}
            <button
              type="button"
              onClick={() => handlePlayVoice(currentWord)}
              className="mt-4 flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-cyan-400 text-slate-950 font-black text-sm sm:text-base hover:bg-cyan-300 active:scale-95 transition shadow-xl shadow-cyan-400/30 cursor-pointer"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-slate-950' : ''}`} />
              <span>{isSpeaking ? '¡Escuchando...!' : '🔊 ¡Toca para Escuchar!'}</span>
            </button>
          </div>
        )}

        {/* Big Start Challenge Button */}
        <button
          type="button"
          onClick={onReady}
          className="w-full mt-4 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-2xl active:scale-97 transition cursor-pointer"
        >
          <span>¡ESTOY LISTO PARA JUGAR! 🚀</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
