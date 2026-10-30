import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Volume2, Award, Zap, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { GameProps, Word } from '../types';
import { WordIcon } from '../components/WordIcon';
import { useSpeech } from '../hooks/useSpeech';
import { useSound } from '../hooks/useSound';
import { useGameProgress } from './useGameProgress';
import confetti from 'canvas-confetti';

interface QuestTheme {
  id: string;
  name: Record<string, string>;
  image: string;
  storyPrompt: Record<string, string>;
}

const QUEST_THEMES: QuestTheme[] = [
  {
    id: 'safari',
    name: {
      es: 'Expedición Selva Mágica',
      en: 'Magic Safari Quest',
      fr: 'Expédition Safari Magique',
      'nl-BE': 'Magische Safari Expeditie',
      ar: 'رحلة السفاري السحرية',
    },
    image: '/assets/ai/safari.jpg',
    storyPrompt: {
      es: '¡Los animales de la selva necesitan tu ayuda! Encuentra la palabra mágica:',
      en: 'The jungle animals need your help! Find the magic word:',
      fr: 'Les animaux de la jungle ont besoin de toi ! Trouve le mot magique :',
      'nl-BE': 'De jungledieren hebben jouw hulp nodig! Vind het magische woord:',
      ar: 'حيوانات الغابة بحاجة لمساعدتك! اعثر على الكلمة السحرية:',
    },
  },
  {
    id: 'space',
    name: {
      es: 'Misión Cósmica Espacial',
      en: 'Cosmic Space Mission',
      fr: 'Mission Spatiale Cosmique',
      'nl-BE': 'Kosmische Ruimtemissie',
      ar: 'المهمة الفضائية الكونية',
    },
    image: '/assets/ai/space.jpg',
    storyPrompt: {
      es: '¡El cohete estelar necesita combustible de vocabulario! Elige:',
      en: 'The star rocket needs vocabulary fuel! Choose:',
      fr: 'La fusée stellaire a besoin de carburant de vocabulaire ! Choisis :',
      'nl-BE': 'De sterrenraket heeft woordenschat-brandstof nodig! Kies:',
      ar: 'يحتاج الصاروخ الفضائي إلى وقود الكلمات! اختر:',
    },
  },
];

export const AiMagicQuestGame: React.FC<GameProps> = ({
  words,
  language,
  nativeLanguage = 'es',
  onCorrect,
  onWrong,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);
  const [aiClueText, setAiClueText] = useState<string | null>(null);
  const [loadingClue, setLoadingClue] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  const { speak } = useSpeech();
  const { playSuccess, playError, playCoin } = useSound();
  const { recordAnswer, finish } = useGameProgress('unified_lesson', { onCorrect, onWrong, onComplete });

  const currentTheme = QUEST_THEMES[themeIdx % QUEST_THEMES.length];
  const targetWords = useMemo(() => words.slice(0, Math.min(6, words.length)), [words]);
  const activeWord: Word | undefined = targetWords[currentIdx];

  // Options pool
  const options = useMemo(() => {
    if (!activeWord) return [];
    const others = words.filter(w => w.id !== activeWord.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [activeWord, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [activeWord, words]);

  // Read the active target word when screen updates
  useEffect(() => {
    if (activeWord) {
      speak(activeWord.audioText || activeWord.text, language);
      setAiClueText(null);
      setSelectedOption(null);
      setIsCorrectState(null);
    }
  }, [currentIdx, activeWord?.id, language]);

  // Request AI Clue from backend proxy
  const requestAiClue = async () => {
    if (!activeWord || loadingClue) return;
    setLoadingClue(true);
    try {
      const res = await fetch('/api/ai/story-clue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: activeWord.text,
          translation: activeWord.translation,
          language,
          nativeLanguage,
        }),
      });
      const data = await res.json();
      setAiClueText(data.nativeHint || `Significa: "${activeWord.translation}"`);
      if (data.riddle) {
        speak(data.riddle, language);
      }
    } catch {
      setAiClueText(`Pista: Significa "${activeWord.translation}"`);
    } finally {
      setLoadingClue(false);
    }
  };

  const handleSelect = (option: Word) => {
    if (isCorrectState !== null || !activeWord) return;
    const isCorrect = option.id === activeWord.id;
    setSelectedOption(option.id);
    setIsCorrectState(isCorrect);

    if (isCorrect) {
      playSuccess();
      playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    } else {
      playError();
      setCombo(0);
    }

    recordAnswer(activeWord, isCorrect, option, true);

    // Auto-advance after brief celebratory feedback
    setTimeout(() => {
      if (currentIdx + 1 >= targetWords.length) {
        finish(targetWords.map(w => w.id));
      } else {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrectState(null);
        setAiClueText(null);
        if ((currentIdx + 1) % 3 === 0) {
          setThemeIdx(t => t + 1);
        }
      }
    }, 1200);
  };

  if (!activeWord) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center font-bold text-slate-600">
        ¡Misión completada!
      </div>
    );
  }

  const themeTitle = currentTheme.name[language] || currentTheme.name.es;
  const promptText = currentTheme.storyPrompt[language] || currentTheme.storyPrompt.es;

  return (
    <div
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-between gap-3 p-2 sm:p-4"
    >
      {/* Top Banner Card with AI Generated Art */}
      <div className="relative w-full overflow-hidden rounded-3xl border-3 border-amber-300 bg-slate-900 shadow-xl">
        <div className="relative h-32 sm:h-44 w-full overflow-hidden">
          <img
            src={currentTheme.image}
            alt="AI Quest Theme"
            className="h-full w-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Theme badge and combo */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-black text-amber-300 border border-amber-400/40">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {themeTitle}
            </span>
            <div className="flex items-center gap-2">
              {combo > 1 && (
                <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-xs font-black text-white shadow-lg animate-bounce">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  {combo}x COMBO!
                </span>
              )}
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-black text-white">
                {currentIdx + 1} / {targetWords.length}
              </span>
            </div>
          </div>

          {/* Story Prompt */}
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-xs sm:text-sm font-extrabold text-amber-200 drop-shadow">
              {promptText}
            </p>
          </div>
        </div>
      </div>

      {/* Target Word Hero Box */}
      <div className="flex w-full flex-col items-center justify-center rounded-3xl border-2 border-emerald-100 bg-gradient-to-b from-emerald-50/90 to-white p-4 shadow-md text-center">
        <div className="flex items-center gap-3">
          <h2
            lang={language}
            dir={language === 'ar' ? 'rtl' : 'auto'}
            className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight"
          >
            {activeWord.text}
          </h2>
          <button
            type="button"
            onClick={() => speak(activeWord.audioText || activeWord.text, language)}
            className="rounded-2xl bg-emerald-600 p-2.5 text-white shadow-md hover:bg-emerald-700 active:scale-95 transition"
            title="Escuchar pronunciación"
            aria-label="Escuchar pronunciación"
          >
            <Volume2 className="h-6 w-6" />
          </button>
        </div>

        {/* Phonetic badge if available */}
        {activeWord.phonetic && (
          <span className="mt-1 text-xs font-bold text-emerald-700/80">
            [{activeWord.phonetic}]
          </span>
        )}

        {/* AI Clue Button & Bubble */}
        <div className="mt-3 flex flex-col items-center">
          {!aiClueText ? (
            <button
              type="button"
              onClick={requestAiClue}
              disabled={loadingClue}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-100 px-3.5 py-1.5 text-xs font-black text-amber-900 border border-amber-300 hover:bg-amber-200 transition"
            >
              <HelpCircle className="h-4 w-4 text-amber-700" />
              <span>{loadingClue ? 'Consultando al Búho Mágico...' : '¿Necesitas una pista mágica?'}</span>
            </button>
          ) : (
            <div className="animate-in fade-in zoom-in-95 rounded-2xl bg-amber-50 border-2 border-amber-300 p-2.5 text-xs font-bold text-amber-950 flex items-center gap-2 shadow-sm">
              <span className="text-lg">🦉</span>
              <span>{aiClueText}</span>
              <button
                type="button"
                onClick={() => speak(aiClueText, nativeLanguage)}
                className="rounded-lg bg-amber-200 p-1 text-amber-900"
                title="Escuchar pista"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.id === activeWord.id;

          let btnClass = 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50';
          if (selectedOption !== null) {
            if (isCorrect) {
              btnClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-300';
            } else if (isSelected) {
              btnClass = 'border-rose-400 bg-rose-100 text-rose-950 ring-2 ring-rose-200';
            } else {
              btnClass = 'border-slate-100 bg-slate-50 text-slate-400 opacity-50';
            }
          }

          return (
            <button
              key={`${activeWord.id}-${option.id}-${idx}`}
              type="button"
              disabled={selectedOption !== null}
              onClick={() => handleSelect(option)}
              className={`flex min-h-[85px] sm:min-h-[100px] items-center justify-between rounded-3xl border-3 p-3.5 text-left font-black shadow-md transition-all active:scale-95 ${btnClass}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                  <WordIcon icon={option.imageUrl} esWord={option.translation} size="lg" className="w-10 h-10 object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="block text-base sm:text-lg font-black text-slate-900 leading-tight truncate">{option.translation}</span>
                  <span className="block text-xs font-bold text-slate-500 truncate" lang={option.language}>{option.text}</span>
                </div>
              </div>
              {selectedOption !== null && isCorrect && (
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              )}
              {isSelected && !isCorrect && (
                <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
