import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Play, Trophy, Flame, Wand2 } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES } from '../data/languages';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { AiImageStudioModal } from '../components/AiImageStudioModal';

interface ArcadeGameCard {
  id: string;
  theme: string;
  title: string;
  subtitle: string;
  emoji: string;
  image: string;
  gradient: string;
  badge: string;
}

const ARCADE_GAMES: Record<Language, ArcadeGameCard[]> = {
  es: [
    {
      id: 'balloon_pop',
      theme: 'colores',
      title: '¡Explota-Globos!',
      subtitle: 'Explota el globo correcto antes de que vuele al cielo',
      emoji: '🎈',
      image: '/src/assets/images/words_food_market_1793373486245.jpg',
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badge: '¡Super Adictivo!',
    },
    {
      id: 'safari_dash',
      theme: 'animales',
      title: 'Safari Atrapa-Palabras',
      subtitle: 'Atrapa a los animalitos juguetones de la selva',
      emoji: '🐾',
      image: '/src/assets/images/words_animals_safari_1793373484977.jpg',
      gradient: 'from-emerald-500 via-teal-600 to-green-600',
      badge: 'Animales 3D',
    },
    {
      id: 'space_blaster',
      theme: 'viajes',
      title: 'Láser Espacial Cohete',
      subtitle: 'Dispara rayos láser cósmicos y recolecta gemas',
      emoji: '🚀',
      image: '/src/assets/images/words_space_adventure_1793373486904.jpg',
      gradient: 'from-indigo-600 via-purple-600 to-sky-500',
      badge: 'Aventura Estelar',
    },
    {
      id: 'monster_snack',
      theme: 'comida',
      title: 'El Monstruo Glotón',
      subtitle: 'Alimenta al monstruo divertido con sus comidas favoritas',
      emoji: '🍕',
      image: '/src/assets/images/words_super_vehicles_1793373492733.jpg',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: 'Comidas Ricas',
    },
    {
      id: 'ai_quest',
      theme: 'mision_ai',
      title: 'Misión Mágica con IA',
      subtitle: 'Resuelve acertijos misteriosos con el Búho Mágico',
      emoji: '🦉',
      image: '/assets/ai/fayma-buddy.jpg',
      gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
      badge: 'Inteligencia Artificial',
    },
  ],
  en: [
    {
      id: 'balloon_pop',
      theme: 'colors',
      title: 'Balloon Pop Mania!',
      subtitle: 'Pop the right flying balloon with visual words',
      emoji: '🎈',
      image: '/src/assets/images/words_food_market_1793373486245.jpg',
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badge: 'Super Fast!',
    },
    {
      id: 'safari_dash',
      theme: 'animals',
      title: 'Safari Word Catch',
      subtitle: 'Catch the cute 3D jungle animals in time',
      emoji: '🐾',
      image: '/src/assets/images/words_animals_safari_1793373484977.jpg',
      gradient: 'from-emerald-500 via-teal-600 to-green-600',
      badge: '3D Animals',
    },
    {
      id: 'space_blaster',
      theme: 'space',
      title: 'Space Rocket Blaster',
      subtitle: 'Blast cosmic meteors and collect space gems',
      emoji: '🚀',
      image: '/src/assets/images/words_space_adventure_1793373486904.jpg',
      gradient: 'from-indigo-600 via-purple-600 to-sky-500',
      badge: 'Galactic Quest',
    },
    {
      id: 'monster_snack',
      theme: 'food',
      title: 'Hungry Monster Feast',
      subtitle: 'Feed the funny hungry mascot with tasty foods',
      emoji: '🍕',
      image: '/src/assets/images/words_super_vehicles_1793373492733.jpg',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: 'Yummy Foods',
    },
    {
      id: 'ai_quest',
      theme: 'mision_ai',
      title: 'Magic AI Owl Quest',
      subtitle: 'Solve magical riddles with the AI Owl mascot',
      emoji: '🦉',
      image: '/assets/ai/fayma-buddy.jpg',
      gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
      badge: 'Powered by AI',
    },
  ],
  fr: [
    {
      id: 'balloon_pop',
      theme: 'couleurs',
      title: 'Éclate les Ballons !',
      subtitle: 'Éclate le bon ballon avant qu’il ne s’envole',
      emoji: '🎈',
      image: '/src/assets/images/words_food_market_1793373486245.jpg',
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badge: 'Super Amusant',
    },
    {
      id: 'safari_dash',
      theme: 'animaux',
      title: 'Safari Attrape-Mots',
      subtitle: 'Attrape les animaux 3D de la jungle',
      emoji: '🐾',
      image: '/src/assets/images/words_animals_safari_1793373484977.jpg',
      gradient: 'from-emerald-500 via-teal-600 to-green-600',
      badge: 'Animaux 3D',
    },
    {
      id: 'space_blaster',
      theme: 'espace',
      title: 'Laser Fusée Spatiale',
      subtitle: 'Tire des lasers cosmiques et gagne des gemmes',
      emoji: '🚀',
      image: '/src/assets/images/words_space_adventure_1793373486904.jpg',
      gradient: 'from-indigo-600 via-purple-600 to-sky-500',
      badge: 'Cosmique',
    },
    {
      id: 'monster_snack',
      theme: 'nourriture',
      title: 'Festin du Monstre Glouton',
      subtitle: 'Donne à manger au gentil monstre rigolo',
      emoji: '🍕',
      image: '/src/assets/images/words_super_vehicles_1793373492733.jpg',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: 'Délicieux',
    },
    {
      id: 'ai_quest',
      theme: 'mision_ai',
      title: 'Mission Magique IA',
      subtitle: 'Énigmes mystérieuses avec le Hibou IA',
      emoji: '🦉',
      image: '/assets/ai/fayma-buddy.jpg',
      gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
      badge: 'Magie IA',
    },
  ],
  'nl-BE': [
    {
      id: 'balloon_pop',
      theme: 'kleuren',
      title: 'Ballon Prik Feest!',
      subtitle: 'Prik de juiste ballon met woord en plaatje',
      emoji: '🎈',
      image: '/src/assets/images/words_food_market_1793373486245.jpg',
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badge: 'Super Snel',
    },
    {
      id: 'safari_dash',
      theme: 'dieren',
      title: 'Safari Woorden Vangen',
      subtitle: 'Vang de schattige 3D dieren in het oerwoud',
      emoji: '🐾',
      image: '/src/assets/images/words_animals_safari_1793373484977.jpg',
      gradient: 'from-emerald-500 via-teal-600 to-green-600',
      badge: '3D Dieren',
    },
    {
      id: 'space_blaster',
      theme: 'ruimte',
      title: 'Ruimte Raket Laser',
      subtitle: 'Schiet kosmische lasers en win diamanten',
      emoji: '🚀',
      image: '/src/assets/images/words_space_adventure_1793373486904.jpg',
      gradient: 'from-indigo-600 via-purple-600 to-sky-500',
      badge: 'Ruimte Avontuur',
    },
    {
      id: 'monster_snack',
      theme: 'eten',
      title: 'Het Vrolijke Snoepmonster',
      subtitle: 'Geef het grappige monster zijn lievelingseten',
      emoji: '🍕',
      image: '/src/assets/images/words_super_vehicles_1793373492733.jpg',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: 'Lekker Eten',
    },
    {
      id: 'ai_quest',
      theme: 'mision_ai',
      title: 'AI Magische Uil Missie',
      subtitle: 'Los raadsels op met de Magische Uil',
      emoji: '🦉',
      image: '/assets/ai/fayma-buddy.jpg',
      gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
      badge: 'Met AI',
    },
  ],
  ar: [
    {
      id: 'balloon_pop',
      theme: 'colors',
      title: 'فرقعة البالونات السحرية!',
      subtitle: 'فرقع البالون الصحيح قبل أن يطير في السماء',
      emoji: '🎈',
      image: '/src/assets/images/words_food_market_1793373486245.jpg',
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      badge: 'سريعة وممتعة',
    },
    {
      id: 'safari_dash',
      theme: 'animals',
      title: 'سفاري صيد الكلمات',
      subtitle: 'اصطد حيوانات الغابة اللطيفة ثلاثية الأبعاد',
      emoji: '🐾',
      image: '/src/assets/images/words_animals_safari_1793373484977.jpg',
      gradient: 'from-emerald-500 via-teal-600 to-green-600',
      badge: 'حيوانات 3D',
    },
    {
      id: 'space_blaster',
      theme: 'space',
      title: 'ليزر الصاروخ الفضائي',
      subtitle: 'أطلق الليزر الكوني واجمع الجواهر الفضائية',
      emoji: '🚀',
      image: '/src/assets/images/words_space_adventure_1793373486904.jpg',
      gradient: 'from-indigo-600 via-purple-600 to-sky-500',
      badge: 'مغامرة كونية',
    },
    {
      id: 'monster_snack',
      theme: 'food',
      title: 'وليمة الوحش الأكول',
      subtitle: 'أطعم الوحش اللطيف أطعمته المفضلة اللذيذة',
      emoji: '🍕',
      image: '/src/assets/images/words_super_vehicles_1793373492733.jpg',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      badge: 'أطعمة لذيذة',
    },
    {
      id: 'ai_quest',
      theme: 'mision_ai',
      title: 'مهمة الذكاء السحرية',
      subtitle: 'حل الألغاز المرئية مع البومة الذكية',
      emoji: '🦉',
      image: '/assets/ai/fayma-buddy.jpg',
      gradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
      badge: 'ذكاء اصطناعي',
    },
  ],
};

export const LearningPathScreen: React.FC = () => {
  const language = useGameStore(state => state.language);
  const setScreen = useGameStore(state => state.setScreen);
  const setActiveWorld = useGameStore(state => state.setActiveWorld);
  const setTotalRounds = useGameStore(state => state.setTotalRounds);
  const startSession = useGameStore(state => state.startSession);
  const profiles = useProfileStore(state => state.profiles);
  const activePlayer = useProfileStore(state => state.getActivePlayer());
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);

  const games = ARCADE_GAMES[language] || ARCADE_GAMES.es;

  const handleLaunchGame = (game: ArcadeGameCard) => {
    setTotalRounds(1); // Fast, snappy round (30-45 seconds)
    setActiveWorld(game.theme, game.id);
    startSession(profiles);
  };

  return (
    <main
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-3 py-3 sm:px-6 sm:py-5"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScreen('PLAYER_SETUP')}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-amber-100 text-amber-950 border border-amber-300 px-3.5 py-1.5 text-xs font-black shadow-xs hover:bg-amber-200 transition cursor-pointer"
          >
            <span>👤</span>
            <span>Perfil / Niños</span>
          </button>
          <button
            type="button"
            onClick={() => setScreen('TARGET_LANG_SETUP')}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-2xl bg-white/90 px-3.5 py-1.5 text-xs font-black text-slate-700 shadow-sm hover:bg-white transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cambiar Idioma</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-800 bg-white/90 px-3 py-1.5 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-1.5">
            <span>{LANGUAGES[language].flag}</span>
            <span>{LANGUAGES[language].name}</span>
          </span>
          <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-2xl border border-amber-200">
            ⭐ {activePlayer?.coins || 50}
          </span>
        </div>
      </div>

      {/* AI Wonder Studio Banner */}
      <section className="mb-4 rounded-3xl border-3 border-purple-300 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-13 w-13 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-3xl shadow-inner">
            🎨
          </div>
          <div>
            <div className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-yellow-200">
              <Sparkles className="h-3 w-3" /> ¡Nuevo con Inteligencia Artificial!
            </div>
            <h2 className="text-lg sm:text-xl font-black leading-tight text-white mt-0.5">
              Estudio Mágico de Imágenes IA
            </h2>
            <p className="text-xs font-semibold text-purple-100 max-w-md">
              Pide cualquier palabra y la IA dibujará una imagen en 3D para entenderla y ganar monedas.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAiStudioOpen(true)}
          className="w-full sm:w-auto shrink-0 min-h-11 px-5 py-2.5 rounded-2xl bg-white text-purple-900 font-black text-sm flex items-center justify-center gap-2 shadow-md hover:bg-yellow-300 transition-colors cursor-pointer"
        >
          <Wand2 className="h-4 w-4 text-purple-600" />
          <span>¡Crear Imágenes con IA!</span>
        </button>
      </section>

      {/* Arcade Title Banner */}
      <section className="rounded-3xl border-3 border-white bg-gradient-to-r from-amber-200 via-rose-100 to-sky-200 p-4 sm:p-5 shadow-xl mb-4 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-black text-violet-800 shadow-xs mb-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>¡Mundo Arcade de Idiomas!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          ¡Juegos Rápidos y Súper Divertidos!
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-bold text-slate-600 max-w-lg mx-auto">
          Elige tu juego favorito. Cada palabra viene siempre acompañada de su imagen para aprender jugando en 30 segundos.
        </p>
      </section>

      {/* Grid of Real, Fast, Engaging Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
        {games.map((game, idx) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col justify-between rounded-3xl border-3 border-white bg-white/95 p-4 shadow-md hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Header / Badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-3xl shadow-sm border border-amber-200">
                  {game.emoji}
                </span>
                <div className="text-left">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold text-[10px] mb-0.5">
                    {game.badge}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {game.title}
                  </h2>
                </div>
              </div>

              {/* 3D Generated Asset Preview Image */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 text-left mb-4">
              {game.subtitle}
            </p>

            {/* Launch Action Button */}
            <button
              type="button"
              onClick={() => handleLaunchGame(game)}
              className={`w-full min-h-11 py-2.5 px-4 rounded-2xl bg-gradient-to-r ${game.gradient} text-white font-black text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:translate-y-0.5 transition cursor-pointer`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>¡Jugar Ahora! 🚀</span>
            </button>
          </motion.div>
        ))}
      </div>

      <AiImageStudioModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
      />
    </main>
  );
};
