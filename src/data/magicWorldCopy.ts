import { Language } from '../types';

export const MAGIC_WORLD_COPY: Record<Language, {
  gameTitle: string;
  player: string;
  players: string;
  start: string;
  ready: string;
  directions: string;
  begin: string;
  beginHint: string;
  round: string;
  of: string;
  stars: string;
  seconds: string;
  lifted: string;
  bomb: string;
  edge: string;
  goal: string;
  points: string;
  starsOf: string;
  next: string;
  podium: string;
  winner: string;
  great: string;
  playAgain: string;
  back: string;
}> = {
  es: { gameTitle: 'Mundo Mágico', player: 'Jugador', players: '¿Cuántos jugadores?', start: '¡A jugar!', ready: '¡Listo!', directions: 'Traza el camino con el dedo sin tocar las bombas', begin: 'Pon el dedo en la salida verde y llega a la meta sin tocar bombas ni salirte del camino.', beginHint: 'Empieza en el círculo verde', round: 'Ronda', of: 'de', stars: 'estrellas', seconds: 's', lifted: 'Levantaste el dedo. Vuelve a empezar desde la salida.', bomb: '¡Boom! Tocaste un obstáculo', edge: '¡Te saliste del camino!', goal: '¡Llegaste a la meta!', points: 'puntos', starsOf: 'de 6 estrellas', next: 'Siguiente', podium: 'Ver el podio', winner: '¡gana!', great: '¡Muy bien!', playAgain: 'Jugar otra vez', back: 'Salir del juego' },
  'nl-BE': { gameTitle: 'Magische wereld', player: 'Speler', players: 'Hoeveel spelers?', start: 'Spelen!', ready: 'Klaar!', directions: 'Volg het pad met je vinger en raak de bommen niet aan', begin: 'Zet je vinger op de groene start en bereik de finish zonder bommen te raken of van het pad te gaan.', beginHint: 'Begin op de groene cirkel', round: 'Ronde', of: 'van', stars: 'sterren', seconds: 's', lifted: 'Je tilde je vinger op. Begin opnieuw bij de start.', bomb: 'Boem! Je raakte een hindernis.', edge: 'Je ging van het pad!', goal: 'Je bent bij de finish!', points: 'punten', starsOf: 'van 6 sterren', next: 'Volgende', podium: 'Bekijk het podium', winner: 'wint!', great: 'Goed gedaan!', playAgain: 'Opnieuw spelen', back: 'Stoppen met spelen' },
  fr: { gameTitle: 'Monde magique', player: 'Joueur', players: 'Combien de joueurs ?', start: 'Jouer !', ready: 'Prêt !', directions: 'Suis le chemin avec ton doigt sans toucher les bombes', begin: 'Pose ton doigt sur le départ vert et atteins l’arrivée sans toucher les bombes ni quitter le chemin.', beginHint: 'Commence sur le cercle vert', round: 'Manche', of: 'sur', stars: 'étoiles', seconds: 's', lifted: 'Tu as levé le doigt. Recommence au départ.', bomb: 'Boum ! Tu as touché un obstacle.', edge: 'Tu es sorti du chemin !', goal: 'Tu es arrivé à la fin !', points: 'points', starsOf: 'sur 6 étoiles', next: 'Suivant', podium: 'Voir le podium', winner: 'gagne !', great: 'Bravo !', playAgain: 'Rejouer', back: 'Quitter le jeu' },
  ar: { gameTitle: 'العالم السحري', player: 'اللاعب', players: 'كم عدد اللاعبين؟', start: 'هيا نلعب!', ready: 'مستعد!', directions: 'اتبع الطريق بإصبعك دون لمس القنابل', begin: 'ضع إصبعك على البداية الخضراء واصل إلى النهاية دون لمس العوائق أو الخروج عن الطريق.', beginHint: 'ابدأ من الدائرة الخضراء', round: 'الجولة', of: 'من', stars: 'نجوم', seconds: 'ث', lifted: 'رفعت إصبعك. ابدأ من جديد من نقطة البداية.', bomb: 'انفجار! لمست عائقًا.', edge: 'خرجت عن الطريق!', goal: 'وصلت إلى النهاية!', points: 'نقاط', starsOf: 'من 6 نجوم', next: 'التالي', podium: 'عرض المنصة', winner: 'يفوز!', great: 'أحسنت!', playAgain: 'العب مرة أخرى', back: 'الخروج من اللعبة' },
  en: { gameTitle: 'Magic World', player: 'Player', players: 'How many players?', start: 'Let’s play!', ready: 'Ready!', directions: 'Trace path with finger without touching bombs', begin: 'Put finger on green start and reach finish without touching obstacles.', beginHint: 'Start on green circle', round: 'Round', of: 'of', stars: 'stars', seconds: 's', lifted: 'Finger lifted! Restart at start.', bomb: 'Boom! Touched obstacle.', edge: 'Left the path!', goal: 'Reached finish line!', points: 'points', starsOf: 'out of 6 stars', next: 'Next', podium: 'See podium', winner: 'wins!', great: 'Great job!', playAgain: 'Play again', back: 'Exit game' },
};
