import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Language, PlayerProfile } from '../types';

const GAME_ART: Record<string, string> = {
  safari: '/games/safari.png',
  word_train: '/games/train.png',
  garden_match: '/games/garden.png',
  word_picker: '/games/balloons.png',
  sound_echo: '/games/echo.png',
  dino_picnic: '/games/dino.png',
  line_match: '/games/lines.png',
  draw_word: '/games/draw.png',
  letter_puzzle: '/games/letters.png',
  word_sort: '/games/sort.png',
  comet_dash: '/games/comet.png',
  cookie_count: '/games/cookies.png',
  number_bridge: '/games/number-bridge.png',
  treasure_trail: '/games/treasure.png',
  body_detective: '/games/body.png',
  habitat_rescue: '/games/habitat.png',
  space_explorer: '/games/space.png',
  eco_mission: '/games/eco.png',
};

const READY_COPY: Record<Language, { ready: string; yes: string; turn: string }> = {
  es: { ready: '¿Estás preparado?', yes: '¡Sí, estoy listo!', turn: 'Tu turno, {name}' },
  'nl-BE': { ready: 'Ben je er klaar voor?', yes: 'Ja, ik ben klaar!', turn: 'Jouw beurt, {name}' },
  fr: { ready: 'Es-tu prêt ?', yes: 'Oui, je suis prêt !', turn: 'À toi de jouer, {name}' },
  ar: { ready: 'هل أنت مستعد؟', yes: 'نعم، أنا مستعد!', turn: 'دورك يا {name}' },
};

interface TurnReadyOverlayProps {
  player: PlayerProfile;
  gameId: string;
  language: Language;
  onReady: () => void;
}

export const TurnReadyOverlay: React.FC<TurnReadyOverlayProps> = ({ player, gameId, language, onReady }) => {
  const copy = READY_COPY[language];
  const isImageAvatar = player.avatarUrl?.startsWith('data:') || player.avatarUrl?.startsWith('/');

  return (
    <div
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/55 p-2 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="turn-ready-title"
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.9, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-white bg-gradient-to-br from-white via-sky-50 to-sky-200 p-3 text-center shadow-[0_24px_80px_rgba(15,23,42,.35)] sm:p-5"
      >
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-yellow-200/60 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-pink-200/60 blur-2xl" aria-hidden="true" />

        <div className="relative mb-4 overflow-hidden rounded-3xl border-2 border-white bg-white shadow-sm">
          <img src={GAME_ART[gameId] || '/games/safari.png'} alt="" className="h-[min(18dvh,9rem)] w-full object-contain" />
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-amber-500 shadow-sm" aria-hidden="true">
            <Sparkles size={20} />
          </span>
        </div>

        <motion.div
          initial={{ scale: 0.75, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative mx-auto flex h-[min(20dvh,7rem)] w-[min(20dvh,7rem)] items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-br from-amber-200 via-pink-200 to-sky-200 text-6xl shadow-[0_8px_24px_rgba(99,102,241,.2)]"
          style={{ boxShadow: `0 8px 24px ${player.color}55` }}
        >
          {isImageAvatar
            ? <img src={player.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
            : <span aria-hidden="true">{player.avatarUrl || '⭐'}</span>}
          <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-lg text-white" aria-hidden="true">✨</span>
        </motion.div>

        <p className="relative mt-4 text-sm font-black uppercase tracking-[.16em] text-emerald-700">
          {copy.turn.replace('{name}', player.displayName)}
        </p>
        <h1 id="turn-ready-title" className="relative mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
          {copy.ready}
        </h1>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReady}
          className="relative mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 text-lg font-black text-white shadow-[0_5px_0_#237b68,0_12px_24px_rgba(16,185,129,.25)] transition active:translate-y-1 active:shadow-none"
        >
          <span aria-hidden="true">🚀</span>
          {copy.yes}
        </motion.button>
      </motion.section>
    </div>
  );
};
