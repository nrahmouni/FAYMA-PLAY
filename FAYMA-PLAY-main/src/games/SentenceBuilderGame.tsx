import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { GameProps, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';
import { shuffleArray } from '../lib/utils';

interface SentenceItem {
  targetWord: Word;
  originalWords: string[];
  translation: string;
}

export const SentenceBuilderGame: React.FC<GameProps> = ({
  words,
  difficulty,
  onCorrect,
  onWrong,
  onComplete,
  language,
}) => {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [bankTokens, setBankTokens] = useState<{ id: string; text: string }[]>([]);
  const [placedTokens, setPlacedTokens] = useState<{ id: string; text: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [burst, setBurst] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const wordsSeenRef = useRef<string[]>([]);
  const isArabic = language === 'ar';

  const { speak } = useSpeech();
  const { playCardFlip, playSuccess, playError } = useSound();

  const currentWord = words[sentenceIndex] || words[0];

  // Prepare sentence tokens
  useEffect(() => {
    if (!currentWord) return;

    if (!wordsSeenRef.current.includes(currentWord.id)) {
      wordsSeenRef.current.push(currentWord.id);
    }

    const rawSentence = currentWord.exampleSentence || `${currentWord.text} !`;
    const tokens = rawSentence.trim().split(/\s+/).filter(Boolean);

    const tokenObjects = tokens.map((t, idx) => ({
      id: `${currentWord.id}_tok_${idx}_${t}`,
      text: t,
    }));

    setBankTokens(shuffleArray(tokenObjects));
    setPlacedTokens([]);
    setIsCompleted(false);
  }, [sentenceIndex, currentWord]);

  // Handle tile placement
  const handlePlaceToken = (token: { id: string; text: string }) => {
    if (isCompleted) return;
    playCardFlip();

    setBankTokens(prev => prev.filter(t => t.id !== token.id));
    const nextPlaced = [...placedTokens, token];
    setPlacedTokens(nextPlaced);

    // Check if sentence is filled
    const rawSentence = currentWord.exampleSentence || `${currentWord.text} !`;
    const expectedTokens = rawSentence.trim().split(/\s+/).filter(Boolean);

    if (nextPlaced.length === expectedTokens.length) {
      const isCorrect = nextPlaced.every((t, i) => t.text === expectedTokens[i]);

      if (isCorrect) {
        // Complete!
        setIsCompleted(true);
        playSuccess();
        setBurst(true);
        setCorrectCount(c => c + 1);
        onCorrect(currentWord.id);

        // Speak full completed sentence
        speak(rawSentence, language);

        setTimeout(() => {
          setBurst(false);
          if (sentenceIndex + 1 < words.length) {
            setSentenceIndex(i => i + 1);
          } else {
            const totalTime = Date.now() - startTimeRef.current;
            onComplete({
              playerId: '',
              gameId: 'sentence_builder',
              correct: correctCount + 1,
              wrong: wrongCount,
              timeMs: totalTime,
              coinsEarned: 15 + (correctCount + 1) * 5,
              wordsSeen: wordsSeenRef.current,
            });
          }
        }, 1500);
      } else {
        // Misplaced!
        playError();
        setWrongCount(w => w + 1);
        onWrong(currentWord.id);
      }
    }
  };

  const handleRemoveToken = (token: { id: string; text: string }) => {
    if (isCompleted) return;
    playCardFlip();
    setPlacedTokens(prev => prev.filter(t => t.id !== token.id));
    setBankTokens(prev => [...prev, token]);
  };

  const handleReset = () => {
    if (isCompleted) return;
    setBankTokens([...bankTokens, ...placedTokens]);
    setPlacedTokens([]);
  };

  const rawSentence = currentWord?.exampleSentence || `${currentWord?.text} !`;
  const expectedTokens = rawSentence.trim().split(/\s+/).filter(Boolean);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <JuiceBurst trigger={burst} type="correct" />

      {/* Target prompt & Spanish meaning */}
      <div className="w-full rounded-2xl glass-panel p-5 mb-5 border border-cyan-400/30 text-center shadow-lg relative">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
          Ordena la oración correspondiente:
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-100 mt-1 mb-2">
          "{currentWord?.exampleTranslation || currentWord?.translation}"
        </h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-slate-400">Palabra clave:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
            {currentWord?.text}
          </span>
        </div>
      </div>

      {/* Sentence Drop Slot Line */}
      <div className="w-full rounded-2xl glass-card p-4 min-h-[90px] border-2 border-dashed border-cyan-500/40 flex flex-wrap items-center justify-center gap-2 relative mb-6">
        {placedTokens.length === 0 && (
          <span className="text-xs text-slate-500 font-medium italic pointer-events-none">
            Toca las palabras de abajo para colocarlas aquí en orden
          </span>
        )}

        {placedTokens.map((token, index) => {
          const isSlotCorrect = token.text === expectedTokens[index];
          const isSlotFilledAll = placedTokens.length === expectedTokens.length;

          return (
            <motion.button
              key={token.id}
              type="button"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRemoveToken(token)}
              className={`px-3.5 py-2 rounded-xl font-bold shadow-md transition border-2 flex items-center gap-1.5 cursor-pointer ${
                isSlotFilledAll
                  ? isSlotCorrect
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                    : 'bg-rose-500/30 border-rose-500 text-rose-200'
                  : 'bg-slate-800 border-cyan-400/60 text-slate-100 hover:border-cyan-400'
              } ${isArabic ? 'text-xl font-arabic' : 'text-base'}`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <span>{token.text}</span>
            </motion.button>
          );
        })}

        {placedTokens.length > 0 && !isCompleted && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Reiniciar palabras"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrambled Word Bank */}
      <div className="w-full">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-2 px-1">
          Banco de palabras:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[64px]">
          {bankTokens.map(token => (
            <motion.button
              key={token.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handlePlaceToken(token)}
              className={`px-4 py-2.5 rounded-xl glass-card font-black text-slate-100 border-2 border-white/20 hover:border-cyan-400 hover:bg-slate-800 shadow-lg cursor-pointer ${
                isArabic ? 'text-2xl font-arabic py-2' : 'text-lg'
              }`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {token.text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
