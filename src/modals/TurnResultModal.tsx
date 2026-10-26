import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Coins, ArrowRight, Volume2, CheckCircle2 } from 'lucide-react';
import { GameResult, PlayerProfile, Language, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { JuiceBurst } from '../components/JuiceBurst';

interface TurnResultModalProps {
  result: GameResult;
  player: PlayerProfile;
  language: Language;
  missionCompleted?: boolean;
  isFinalTurn?: boolean;
  onContinue: () => void;
}

export const TurnResultModal: React.FC<TurnResultModalProps> = ({
  result,
  player,
  language,
  missionCompleted = false,
  isFinalTurn = false,
  onContinue,
}) => {
  const { speak } = useSpeech();
  const { playCardFlip, playFanfare } = useSound();
  const celebrationPlayed = useRef(false);

  const total = result.correct + result.wrong;
  const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 100;
  const isArabic = language === 'ar';
  const celebrationCopy: Record<Language, string> = {
    es: '¡Muy bien! ¡Has completado la misión!',
    ar: 'أحسنت! لقد أكملت المهمة!',
    fr: 'Bravo ! Tu as terminé la mission !',
    'nl-BE': 'Goed gedaan! Je hebt de missie voltooid!',
  };

  useEffect(() => {
    if (!missionCompleted || celebrationPlayed.current) return;
    celebrationPlayed.current = true;
    playFanfare();
    speak(celebrationCopy[language], language);
  }, [missionCompleted, language, playFanfare, speak]);

  // Words seen during the turn
  const wordsSeenList: Word[] = result.wordsSeen
    .map(id => VOCABULARY_BANK.find(w => w.id === id))
    .filter((w): w is Word => Boolean(w));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-sky-100/80 p-3 backdrop-blur-sm animate-fadeIn sm:p-5">
      <JuiceBurst trigger={missionCompleted} type="victory" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-white via-yellow-50 to-sky-50 p-5 text-center shadow-[0_20px_55px_rgba(51,92,130,.2)] sm:p-7"
      >
        {/* Confetti / Trophy header */}
        {missionCompleted && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-100 via-pink-50 to-sky-100 px-4 py-3"
          >
            <div className="text-xs font-black uppercase tracking-[.18em] text-amber-800">¡Has ganado una estrella!</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-sm font-bold text-slate-800">
              <span>{celebrationCopy[language]}</span>
              <button
                type="button"
                onClick={() => speak(celebrationCopy[language], language)}
                className="rounded-lg p-1.5 text-sky-700 transition hover:bg-white/70"
                aria-label="Escuchar felicitación"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-200 to-orange-200 text-3xl shadow-sm">
          {accuracy >= 75 ? '🏆' : accuracy >= 40 ? '👍' : '💪'}
        </div>

        <h2 className="mb-1 text-2xl font-black text-slate-900 sm:text-3xl">
          {accuracy === 100
            ? '¡Ronda Perfecta!'
            : accuracy >= 70
            ? '¡Excelente Trabajo!'
            : '¡Buen Intento!'}
        </h2>
        <p className="mb-5 text-sm text-slate-600">
          ¡Buen trabajo, <strong className="text-emerald-800">{player.displayName}</strong>!
        </p>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-2.5">
          <div className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
            <CheckCircle2 className="mb-1 h-5 w-5 text-emerald-600" />
            <span className="text-lg font-black text-slate-900">{result.correct}</span>
            <span className="text-[10px] font-bold uppercase text-slate-600">Aciertos</span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-amber-100 bg-amber-50 p-3">
            <Coins className="mb-1 h-5 w-5 text-amber-600" />
            <span className="text-lg font-black text-amber-800">+{result.coinsEarned}</span>
            <span className="text-[10px] font-bold uppercase text-slate-600">Estrellas</span>
          </div>
        </div>

        {/* Words Review List */}
        {wordsSeenList.length > 0 && (
          <div className="w-full text-left mb-6">
            <span className="mb-2 block px-1 text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Palabras de esta ronda:
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {wordsSeenList.map(w => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded-xl border border-sky-100 bg-white p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{w.imageUrl}</span>
                    <div>
                      <div
                        className={`font-black text-slate-900 ${
                          isArabic ? 'font-arabic text-base' : 'text-sm'
                        }`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        {w.text}
                      </div>
                      <div className="text-xs text-slate-600">
                        {w.translation} {w.phonetic ? `• [${w.phonetic}]` : ''}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playCardFlip();
                      speak(w.audioText || w.text, language);
                    }}
                    className="rounded-lg p-2 text-sky-700 transition hover:bg-sky-100 active:scale-95"
                    title="Escuchar"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={onContinue}
          className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-4 text-lg font-black text-white shadow-[0_5px_0_#35824a] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
        >
          <span>{isFinalTurn ? '¡Ver celebración!' : '¡Siguiente turno!'}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
