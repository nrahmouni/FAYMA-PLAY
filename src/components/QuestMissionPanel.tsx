import React from 'react';
import { motion } from 'motion/react';
import { Compass, Star, Sparkles, Trophy } from 'lucide-react';
import { DifficultyLevel, PlayerProfile } from '../types';

const MISSION_COPY: Record<string, { title: string; objective: string; reward: string; accent: string }> = {
  combat: {
    title: 'Rescate de la ciudad',
    objective: 'Protege a tus compañeros y aprende palabras del mundo real mientras esquivas los peligros.',
    reward: 'Insignia del héroe',
    accent: 'from-fuchsia-500 to-violet-600',
  },
  drive: {
    title: 'Carrera de palabras',
    objective: 'Recoge palabras útiles en cada carril y avanza por la ruta más rápida.',
    reward: 'Medalla del explorador',
    accent: 'from-cyan-500 to-blue-600',
  },
  fruit: {
    title: 'Mercado mágico',
    objective: 'Corta solo lo correcto y construye una racha para ganar más puntos.',
    reward: 'Bastón del chef',
    accent: 'from-amber-400 to-rose-500',
  },
  drag_match: {
    title: 'Ruta del mapa',
    objective: 'Relaciona cada palabra con su lugar perfecto para descubrir el paisaje.',
    reward: 'Mapa del viajero',
    accent: 'from-sky-500 to-indigo-600',
  },
  slingshot: {
    title: 'Torre del reto',
    objective: 'Apunta con calma, calcula cada tirada y construye tu dominio del vocabulario.',
    reward: 'Bola de luz',
    accent: 'from-orange-400 to-pink-500',
  },
  memory: {
    title: 'Museo de recuerdos',
    objective: 'Encuentra las parejas y fortalece la memoria visual con palabras útiles.',
    reward: 'Lente de sabiduría',
    accent: 'from-violet-500 to-indigo-600',
  },
  sentence_builder: {
    title: 'Taller de frases',
    objective: 'Construye frases correctas para hablar con confianza en cada aventura.',
    reward: 'Diploma de comunicación',
    accent: 'from-emerald-500 to-cyan-600',
  },
  bubble_popper: {
    title: 'Burbuja mágica',
    objective: 'Combina palabras de color y deja el campo despejado antes de que termine el tiempo.',
    reward: 'Cristal del cielo',
    accent: 'from-pink-500 to-violet-600',
  },
};

interface QuestMissionPanelProps {
  gameId: string;
  player: PlayerProfile;
  difficulty: DifficultyLevel;
}

export const QuestMissionPanel: React.FC<QuestMissionPanelProps> = ({ gameId, player, difficulty }) => {
  const mission = MISSION_COPY[gameId] ?? {
    title: 'Misión del pueblo',
    objective: 'Aprende jugando con vocabulario real y desafíos sencillos para niñas y niños.',
    reward: 'Premio de aventura',
    accent: 'from-cyan-500 to-indigo-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mb-4 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-indigo-200 bg-white/80 p-4 shadow-[0_20px_40px_rgba(59,130,246,0.12)] backdrop-blur-xl"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${mission.accent}`} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${mission.accent} text-white shadow-lg`}>
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" /> Misión del día
            </div>
            <h3 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">{mission.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-amber-700">
          <Trophy className="h-3.5 w-3.5" />
          {mission.reward}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1.5fr_.8fr]">
        <p className="rounded-2xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">{mission.objective}</p>

        <div className="rounded-2xl border border-indigo-100 bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[.18em] text-slate-500">
            <span>Reto</span>
            <span>{player.displayName}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {[1, 2, 3].map(level => (
              <Star
                key={level}
                className={`h-4 w-4 ${level <= difficulty ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
              />
            ))}
          </div>
          <div className="mt-2 text-xs font-bold text-slate-600">
            Dificultad adaptativa: <span className="text-indigo-700">{difficulty}/3</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
