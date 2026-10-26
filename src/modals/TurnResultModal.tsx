import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Coins, Clock, ArrowRight, Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { GameResult, PlayerProfile, Language, Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { VOCABULARY_BANK } from '../data/vocabulary';
import { formatTime } from '../lib/utils';

interface TurnResultModalProps {
  result: GameResult;
  player: PlayerProfile;
  language: Language;
  onContinue: () => void;
}

export const TurnResultModal: React.FC<TurnResultModalProps> = ({
  result,
  player,
  language,
  onContinue,
}) => {
  const { speak } = useSpeech();
  const { playCardFlip } = useSound();

  const total = result.correct + result.wrong;
  const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 100;
  const isArabic = language === 'ar';

  // Words seen during the turn
  const wordsSeenList: Word[] = result.wordsSeen
    .map(id => VOCABULARY_BANK.find(w => w.id === id))
    .filter((w): w is Word => Boolean(w));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl border-2 border-cyan-400/50 text-center relative overflow-hidden"
      >
        {/* Confetti / Trophy header */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
          {accuracy >= 75 ? '🏆' : accuracy >= 40 ? '👍' : '💪'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-1">
          {accuracy === 100
            ? '¡Ronda Perfecta!'
            : accuracy >= 70
            ? '¡Excelente Trabajo!'
            : '¡Buen Intento!'}
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          Resultados del turno de <strong className="text-cyan-400">{player.displayName}</strong>
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 rounded-2xl glass-card border border-white/5 flex flex-col items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-lg font-black text-slate-100">{result.correct}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Aciertos</span>
          </div>

          <div className="p-3 rounded-2xl glass-card border border-amber-500/30 flex flex-col items-center bg-amber-500/5">
            <Coins className="w-5 h-5 text-amber-400 mb-1 animate-pulse" />
            <span className="text-lg font-black text-amber-400">+{result.coinsEarned}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Monedas</span>
          </div>

          <div className="p-3 rounded-2xl glass-card border border-white/5 flex flex-col items-center">
            <Clock className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-lg font-black text-slate-100">{formatTime(result.timeMs)}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Tiempo</span>
          </div>
        </div>

        {/* Words Review List */}
        {wordsSeenList.length > 0 && (
          <div className="w-full text-left mb-6">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-2 px-1">
              Repaso de Vocabulario:
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {wordsSeenList.map(w => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-2.5 rounded-xl glass-card border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{w.imageUrl}</span>
                    <div>
                      <div
                        className={`font-black text-slate-100 ${
                          isArabic ? 'font-arabic text-base' : 'text-sm'
                        }`}
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        {w.text}
                      </div>
                      <div className="text-xs text-slate-400">
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
                    className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition"
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
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl hover:opacity-95 active:scale-98 transition cursor-pointer"
        >
          <span>Continuar Siguiente Turno</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
