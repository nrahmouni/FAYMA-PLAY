import React, { useEffect, useState } from 'react';
import { Language } from '../types';

interface MagicMemoryGameProps {
  language: Language;
}

const COPY: Record<Language, { title: string; hint: string; moves: string; start: string; found: string; again: string }> = {
  es: { title: 'Memoria mágica', hint: 'Encuentra todas las parejas de criaturas iguales.', moves: 'Intentos', start: '¡Empezar!', found: '¡Encontraste todas las parejas!', again: 'Jugar otra vez' },
  'nl-BE': { title: 'Magisch geheugen', hint: 'Zoek alle paren met dezelfde magische wezens.', moves: 'Pogingen', start: 'Start!', found: 'Je hebt alle paren gevonden!', again: 'Opnieuw spelen' },
  fr: { title: 'Mémoire magique', hint: 'Retrouve toutes les paires de créatures identiques.', moves: 'Essais', start: 'Commencer !', found: 'Tu as trouvé toutes les paires !', again: 'Rejouer' },
  ar: { title: 'الذاكرة السحرية', hint: 'اعثر على جميع أزواج المخلوقات المتشابهة.', moves: 'المحاولات', start: 'ابدأ!', found: 'لقد وجدت كل الأزواج!', again: 'العب مرة أخرى' },
};

const CREATURES = ['🦄', '🐉', '🧚', '🐸', '🦋', '🦉', '🐲', '🦊'];

function createCards() {
  return [...CREATURES, ...CREATURES]
    .map((emoji, index) => ({ id: `${emoji}-${index}`, emoji }))
    .sort(() => Math.random() - 0.5);
}

export const MagicMemoryGame: React.FC<MagicMemoryGameProps> = ({ language }) => {
  const copy = COPY[language];
  const [cards, setCards] = useState(createCards);
  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const complete = matched.length === cards.length;

  useEffect(() => {
    if (selected.length !== 2) return;
    setLocked(true);
    const [firstId, secondId] = selected;
    const first = cards.find(card => card.id === firstId);
    const second = cards.find(card => card.id === secondId);
    const timeout = window.setTimeout(() => {
      if (first?.emoji === second?.emoji) setMatched(current => [...current, firstId, secondId]);
      setSelected([]);
      setLocked(false);
    }, first?.emoji === second?.emoji ? 450 : 850);
    return () => window.clearTimeout(timeout);
  }, [cards, selected]);

  const restart = () => {
    setCards(createCards());
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
  };

  const flip = (id: string) => {
    if (locked || selected.includes(id) || matched.includes(id)) return;
    setMoves(current => current + 1);
    setSelected(current => [...current, id]);
  };

  return (
    <section lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-2xl rounded-[2rem] border-4 border-white bg-white/95 p-4 shadow-xl sm:p-6">
      <header className="mb-5 rounded-2xl bg-gradient-to-r from-violet-100 to-pink-100 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900">{copy.title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{copy.hint}</p>
        <p className="mt-2 text-sm font-black text-violet-800">{copy.moves}: {moves}</p>
      </header>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label={copy.title}>
        {cards.map(card => {
          const revealed = selected.includes(card.id) || matched.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              aria-label={revealed ? card.emoji : '？'}
              aria-pressed={revealed}
              onClick={() => flip(card.id)}
              className={`flex aspect-square min-h-16 items-center justify-center rounded-2xl border-4 text-3xl transition sm:text-5xl ${
                matched.includes(card.id)
                  ? 'border-emerald-300 bg-emerald-100'
                  : revealed
                    ? 'border-violet-300 bg-violet-100'
                    : 'border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_4px_0_#6b21a8] hover:brightness-110'
              }`}
            >
              {revealed ? card.emoji : '✨'}
            </button>
          );
        })}
      </div>
      {complete && (
        <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-center" role="status">
          <p className="font-black text-emerald-900">🎉 {copy.found} · {copy.moves}: {moves}</p>
          <button type="button" onClick={restart} className="mt-3 min-h-11 rounded-xl bg-emerald-500 px-6 font-black text-white shadow-[0_3px_0_#328248]">
            {copy.again}
          </button>
        </div>
      )}
    </section>
  );
};
