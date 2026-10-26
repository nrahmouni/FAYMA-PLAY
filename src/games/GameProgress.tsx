import React from 'react';
import { GAME_COPY } from '../data/gameCopy';
import { Language } from '../types';

interface GameProgressProps {
  current: number;
  total: number;
  label: string;
  icon: string;
  language?: Language;
}

export const GameProgress: React.FC<GameProgressProps> = ({ current, total, label, icon, language = 'es' }) => (
  <div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-emerald-100">
    <span className="text-2xl" aria-hidden="true">{icon}</span>
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex justify-between gap-2 text-xs font-extrabold text-emerald-900">
        <span>{label}</span>
        <span>{Math.min(current, total)}/{total}</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-emerald-100"
        role="progressbar"
        aria-label={GAME_COPY[language].progressLabel}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(current, total)}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-[width] duration-500"
          style={{ width: `${total ? (Math.min(current, total) / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  </div>
);

export const EmptyGame: React.FC<{ language?: Language }> = ({ language = 'es' }) => (
  <div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-amber-100">
    <span className="text-5xl" aria-hidden="true">🌱</span>
    <p className="mt-3 font-bold text-slate-700">{GAME_COPY[language].empty}</p>
  </div>
);
