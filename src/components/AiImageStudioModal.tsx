import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wand2, Volume2, X, Play, RefreshCw, Star, Heart } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { fetchAiWordImage, getCachedAiImage } from '../lib/ai-image';
import confetti from 'canvas-confetti';

interface AiImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_IDEAS = [
  { word: 'apple', trans: 'manzana', emoji: '🍎' },
  { word: 'rocket', trans: 'cohete', emoji: '🚀' },
  { word: 'puppy', trans: 'perrito', emoji: '🐶' },
  { word: 'ice cream', trans: 'helado', emoji: '🍦' },
  { word: 'robot', trans: 'robot', emoji: '🤖' },
  { word: 'dinosaur', trans: 'dinosaurio', emoji: '🦖' },
  { word: 'star', trans: 'estrella', emoji: '⭐' },
  { word: 'castle', trans: 'castillo', emoji: '🏰' },
];

export const AiImageStudioModal: React.FC<AiImageStudioModalProps> = ({ isOpen, onClose }) => {
  const language = useGameStore(state => state.language);
  const nativeLanguages = useGameStore(state => state.nativeLanguages);
  const activePlayer = useProfileStore(state => state.getActivePlayer());
  const addRewards = useProfileStore(state => state.addRewards);

  const nativeLang = nativeLanguages[0] || 'es';
  const { speak } = useSpeech();
  const { playSuccess, playError, playCoin } = useSound();

  const [promptInput, setPromptInput] = useState('');
  const [translationInput, setTranslationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [lastWord, setLastWord] = useState<string>('');
  const [lastTrans, setLastTrans] = useState<string>('');

  if (!isOpen) return null;

  const [quotaNotice, setQuotaNotice] = useState(false);

  const handleGenerate = async (wordToGen: string, transToGen: string) => {
    const cleanWord = wordToGen.trim();
    if (!cleanWord) return;

    setLoading(true);
    setQuotaNotice(false);
    setLastWord(cleanWord);
    setLastTrans(transToGen || cleanWord);

    try {
      const img = await fetchAiWordImage(cleanWord, transToGen, language);
      if (img) {
        setGeneratedImg(img);
        playSuccess();
        playCoin();
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
        });
        if (activePlayer) {
          addRewards(activePlayer.uid, 5, 1);
        }
        speak(cleanWord, language);
      } else {
        // Fallback: Quota or rate limit reached
        setQuotaNotice(true);
        setGeneratedImg(null);
        playSuccess();
        speak(cleanWord, language);
      }
    } catch (err) {
      console.warn('AI generation notice:', err);
      setQuotaNotice(true);
      playError();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPick = (item: { word: string; trans: string; emoji: string }) => {
    setPromptInput(item.word);
    setTranslationInput(item.trans);
    handleGenerate(item.word, item.trans);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg rounded-[2rem] border-4 border-white bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 sm:p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md">
              <Wand2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Estudio Mágico con IA 🎨</h2>
              <p className="text-xs font-bold text-slate-600">
                ¡Escribe cualquier palabra y la IA creará su ilustración 3D!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-500 hover:bg-white hover:text-slate-800 shadow-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              placeholder="Escribe una palabra (ej. dragon, lion, rocket...)"
              className="flex-1 min-h-12 rounded-2xl border-2 border-indigo-200 bg-white px-4 text-base font-extrabold text-slate-900 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              disabled={loading || !promptInput.trim()}
              onClick={() => handleGenerate(promptInput, translationInput)}
              className="min-h-12 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm flex items-center gap-1.5 shadow-[0_4px_0_#6b21a8] transition hover:brightness-105 active:translate-y-1 active:shadow-none disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>¡Crear!</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Idea Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-black text-slate-500 mr-1">Ideas rápidas:</span>
            {QUICK_IDEAS.map(item => (
              <button
                key={item.word}
                type="button"
                onClick={() => handleQuickPick(item)}
                className="inline-flex items-center gap-1 rounded-xl bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs hover:bg-white hover:text-indigo-700 transition"
              >
                <span>{item.emoji}</span>
                <span>{item.word}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result Area */}
        <div className="mt-4 flex flex-col items-center justify-center min-h-[200px] rounded-3xl bg-white/90 border-2 border-indigo-100 p-4 shadow-sm text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-purple-600 animate-pulse">
                <Wand2 className="h-8 w-8 animate-bounce" />
              </div>
              <p className="text-sm font-black text-purple-900">
                La Inteligencia Artificial está pintando tu palabra en 3D... ✨
              </p>
              <p className="text-xs font-bold text-slate-400">Paciencia, ¡los colores mágicos toman unos segundos!</p>
            </div>
          ) : generatedImg ? (
            <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in duration-300">
              <div className="relative group">
                <img
                  src={generatedImg}
                  alt={lastWord}
                  className="h-40 w-40 sm:h-48 sm:w-48 rounded-3xl object-contain border-4 border-white shadow-xl bg-gradient-to-br from-amber-50 to-pink-50"
                />
                <button
                  type="button"
                  onClick={() => speak(lastWord, language)}
                  className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:scale-110 transition-transform"
                  title="Escuchar pronunciación"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 capitalize">{lastWord}</h3>
                {lastTrans && (
                  <p className="text-sm font-extrabold text-purple-700">
                    En tu idioma: <span className="underline">{lastTrans}</span>
                  </p>
                )}
                <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>¡+5 monedas ganadas por crear con IA!</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-slate-400">
              <span className="text-5xl mb-2">🎨</span>
              <p className="text-sm font-extrabold text-slate-600">El lienzo de IA está listo</p>
              <p className="text-xs font-medium text-slate-400 max-w-xs mt-0.5">
                Elige una idea o escribe una palabra en inglés o español para verla en un diseño 3D exclusivo.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 flex items-center justify-between text-xs font-black text-slate-500">
          <span>🧠 Desarrollado con Gemini 3.1 Image AI</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-200/80 px-4 py-2 font-black text-slate-700 hover:bg-slate-300 transition"
          >
            Listo, volver al Arcade
          </button>
        </div>
      </motion.div>
    </div>
  );
};
