import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Trophy } from 'lucide-react';
import { GameProps, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { JuiceBurst } from '../components/JuiceBurst';
import { shuffleArray } from '../lib/utils';

interface MemoryCard {
  cardId: string;
  wordId: string;
  type: 'native' | 'translation';
  content: string;
  subContent?: string;
  imageUrl?: string;
  isFlipped: boolean;
  isMatched: boolean;
  word: Word;
}

export const MemoryGame: React.FC<GameProps> = ({
  words,
  difficulty,
  onCorrect,
  onWrong,
  onComplete,
  language,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MemoryCard[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [burst, setBurst] = useState(false);
  const [matchesFound, setMatchesFound] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const wordsSeenRef = useRef<string[]>([]);
  const isArabic = language === 'ar';

  const { speak } = useSpeech();
  const { playCardFlip, playSuccess, playError, playFanfare } = useSound();

  // Determine pair count: 3 pairs for diff 1, 4 pairs for diff 2-3, 6 pairs for diff 4-5
  const pairCount = difficulty >= 4 ? 6 : difficulty >= 2 ? 4 : 3;

  useEffect(() => {
    const selectedWords = words.slice(0, pairCount);
    wordsSeenRef.current = [];
    selectedWords.forEach(w => {
      if (!wordsSeenRef.current.includes(w.id)) {
        wordsSeenRef.current.push(w.id);
      }
    });

    const generatedCards: MemoryCard[] = [];

    selectedWords.forEach(word => {
      // Card A: Word in target language
      generatedCards.push({
        cardId: `${word.id}_native`,
        wordId: word.id,
        type: 'native',
        content: word.text,
        subContent: word.phonetic,
        isFlipped: false,
        isMatched: false,
        word,
      });

      // Card B: Translation with Emoji
      generatedCards.push({
        cardId: `${word.id}_trans`,
        wordId: word.id,
        type: 'translation',
        content: word.translation,
        imageUrl: word.imageUrl,
        isFlipped: false,
        isMatched: false,
        word,
      });
    });

    setCards(shuffleArray(generatedCards));
    setSelectedCards([]);
    setMatchesFound(0);
    setAttempts(0);
    setCombo(0);
    setScore(0);
    startTimeRef.current = Date.now();
  }, [words, pairCount]);

  const handleCardClick = (clickedCard: MemoryCard) => {
    if (isEvaluating || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    playCardFlip();

    // If native word card, speak it
    if (clickedCard.type === 'native') {
      speak(clickedCard.word.audioText || clickedCard.word.text, language);
    }

    // Flip card visually
    const nextCards = cards.map(c =>
      c.cardId === clickedCard.cardId ? { ...c, isFlipped: true } : c
    );
    setCards(nextCards);

    const newSelected = [...selectedCards, clickedCard];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsEvaluating(true);
      setAttempts(a => a + 1);

      const [first, second] = newSelected;
      const isMatch = first.wordId === second.wordId && first.type !== second.type;

      if (isMatch) {
        // MATCH!
        playSuccess();
        setBurst(true);
        onCorrect(first.wordId);
        const nextMatches = matchesFound + 1;
        const nextCombo = combo + 1;
        const nextScore = score + 100 * nextCombo;
        setMatchesFound(nextMatches);
        setCombo(nextCombo);
        setScore(nextScore);

        setTimeout(() => {
          setCards(prev =>
            prev.map(c => (c.wordId === first.wordId ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);
          setIsEvaluating(false);
          setBurst(false);
          if (nextMatches >= pairCount) {
            playFanfare();
            const totalTime = Date.now() - startTimeRef.current;
            setTimeout(() => {
              onComplete({
                playerId: '',
                gameId: 'memory',
                correct: nextMatches,
                wrong: Math.max(0, attempts + 1 - nextMatches),
                timeMs: totalTime,
                coinsEarned: 12 + nextMatches * 5 + nextScore,
                wordsSeen: wordsSeenRef.current,
              });
            }, 800);
          }
        }, 600);
      } else {
        // NO MATCH!
        playError();
        onWrong(first.wordId);
        setCombo(0);

        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.cardId === first.cardId || c.cardId === second.cardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
          setIsEvaluating(false);
        }, 850);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center select-none">
      <JuiceBurst trigger={burst} type="correct" />

      <div className="w-full mb-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-300">MEMORY QUEST · EXPLORACIÓN</p>
            <p className="mt-1 text-xs text-slate-400">Descubre los artefactos y reúne sus parejas.</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-amber-300">⭐ {score}</div>
            {combo > 1 && <div className="text-[10px] font-bold text-fuchsia-300">RACHA ×{combo}</div>}
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all" style={{ width: `${(matchesFound / pairCount) * 100}%` }} />
        </div>
      </div>
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Parejas: {matchesFound} de {pairCount}</span>
        </div>
        <div className="text-xs font-bold text-slate-400">
          Intentos: <strong className="text-cyan-400">{attempts}</strong>
        </div>
      </div>

      {/* Card Grid */}
      <div
        className={`w-full grid gap-2.5 sm:gap-3.5 ${
          pairCount >= 6 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'
        }`}
      >
        {cards.map(card => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <motion.button
              key={card.cardId}
              type="button"
              whileTap={{ scale: 0.95 }}
              animate={{ rotateY: isRevealed ? [85, 0] : 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={() => handleCardClick(card)}
              className={`h-24 sm:h-28 rounded-2xl p-2 flex flex-col items-center justify-center relative cursor-pointer transition-all border-2 ${
                card.isMatched
                  ? 'border-emerald-400/80 bg-emerald-950/30 shadow-lg shadow-emerald-500/20'
                  : isRevealed
                  ? 'border-cyan-400 bg-slate-800 shadow-md shadow-cyan-500/20'
                  : 'border-white/10 glass-card hover:border-cyan-400/50'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center text-center justify-center w-full px-1">
                  {card.imageUrl && (
                    <span className="text-2xl sm:text-3xl mb-0.5">{card.imageUrl}</span>
                  )}
                  <span
                    className={`font-black text-slate-100 leading-tight ${
                      card.type === 'native' && isArabic
                        ? 'text-lg sm:text-xl font-arabic'
                        : 'text-sm sm:text-base'
                    }`}
                    dir={card.type === 'native' && isArabic ? 'rtl' : 'ltr'}
                  >
                    {card.content}
                  </span>
                  {card.subContent && (
                    <span className="text-[10px] text-cyan-300/80 font-mono mt-0.5">
                      /{card.subContent}/
                    </span>
                  )}
                  {card.isMatched && (
                    <span className="text-[9px] text-emerald-400 font-extrabold uppercase mt-0.5">
                      ¡Completado!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-400">
                  <span className="text-2xl sm:text-3xl opacity-60">🎴</span>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest mt-1 text-slate-500">
                    FAYMA PLAY
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
