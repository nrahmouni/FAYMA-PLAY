import React from 'react';
import { ArrowLeft, BookOpen, ShoppingBag, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const RANKS = [
  { icon: '🌱', title: 'Pequeño brote', detail: 'Empieza a descubrir palabras nuevas.' },
  { icon: '🌼', title: 'Flor curiosa', detail: 'Practica y cuida tu colección de palabras.' },
  { icon: '🦋', title: 'Gran explorador', detail: 'Sigue aprendiendo en distintos idiomas.' },
];

export const RewardsMenu: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);
  const navigate = (screen: 'HOME' | 'PASSPORT' | 'GARAGE') => {
    setScreen(screen);
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] w-full max-w-3xl flex-col justify-center px-4 py-5 sm:px-8">
      <section className="rounded-[2rem] border-4 border-white bg-gradient-to-br from-amber-100 via-white to-sky-100 p-5 shadow-[0_16px_38px_rgba(36,107,253,.1)] sm:p-8">
        <button
          type="button"
          onClick={() => navigate('HOME')}
          className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-slate-600 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a los idiomas
        </button>
        <header className="text-center">
          <span className="text-5xl" aria-hidden="true">🏆</span>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Premios y rangos</h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">¡Los premios celebran lo que aprendes! Lo importante es pasarlo bien.</p>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {RANKS.map((rank, index) => (
            <article key={rank.title} className="rounded-2xl border-2 border-white bg-white/90 p-4 text-center shadow-sm">
              <span className="text-4xl" aria-hidden="true">{rank.icon}</span>
              <h2 className="mt-2 font-black text-slate-900">{rank.title}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">{rank.detail}</p>
              <span className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-800">
                {index === 0 ? 'Tu aventura' : index === 1 ? 'Sigue jugando' : '¡Qué bien lo haces!'}
              </span>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-sky-50 p-4">
          <h2 className="flex items-center gap-2 font-black text-sky-900"><Sparkles className="h-5 w-5" /> ¿Cómo funcionan?</h2>
          <p className="mt-1 text-sm leading-6 text-slate-700">Gana monedas para conseguir accesorios y descubre nuevos rangos mientras aprendes. No hay prisas ni penalizaciones: cada intento cuenta.</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('PASSPORT')}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-100 px-4 text-sm font-black text-blue-900 transition hover:bg-blue-200"
          >
            <BookOpen className="h-5 w-5" /> Ver colección de premios
          </button>
          <button
            type="button"
            onClick={() => navigate('GARAGE')}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-orange-100 px-4 text-sm font-black text-orange-900 transition hover:bg-orange-200"
          >
            <ShoppingBag className="h-5 w-5" /> Ver accesorios
          </button>
        </div>
      </section>
    </main>
  );
};
