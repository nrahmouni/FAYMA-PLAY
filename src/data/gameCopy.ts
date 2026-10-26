import { Language } from '../types';

export const GAME_COPY: Record<Language, {
  gameNames: { safari: string; train: string; garden: string };
  gameDescriptions: { safari: string; train: string; garden: string };
  welcome: string;
  chooseGame: string;
  changeFlag: string;
  round: string;
  safariProgress: string;
  safariPrompt: string;
  safariHint: string;
  trainProgress: string;
  trainTitle: string;
  trainHint: string;
  listen: string;
  gardenProgress: string;
  gardenTitle: string;
  gardenHint: string;
  attempts: string;
  empty: string;
  correct: string;
  tryAgain: string;
  musicOn: string;
  musicOff: string;
  soundOn: string;
  soundOff: string;
  ready: string;
  startTurn: string;
  finished: string;
  nextTurn: string;
  perfectRound: string;
  excellentWork: string;
  goodTry: string;
  goodWork: string;
  correctAnswers: string;
  coins: string;
  roundWords: string;
  continue: string;
  play: string;
  learn: string;
  learnDescription: string;
  players: string;
  player: string;
  turnsNote: string;
  place: string;
  appTagline: string;
  gamesIn: string;
  joiner: string;
}> = {
  es: {
    gameNames: { safari: 'Safari de palabras', train: 'Tren de palabras', garden: 'Jardín de parejas' },
    gameDescriptions: { safari: 'Escucha una palabra y elige el dibujo.', train: 'Escucha y encuentra el dibujo correcto.', garden: 'Une cada dibujo con su palabra.' },
    welcome: '¡Bienvenidos!',
    chooseGame: '¿Qué juego elegimos?',
    changeFlag: 'Cambiar idioma',
    round: 'Ronda',
    safariProgress: 'Safari',
    safariPrompt: 'Busca:',
    safariHint: 'Toca el dibujo correcto.',
    trainProgress: 'Viaje en tren',
    trainTitle: '¡Escucha y elige!',
    trainHint: '¿Qué dibujo corresponde a esta palabra?',
    listen: 'Escuchar palabra',
    gardenProgress: 'Parejas encontradas',
    gardenTitle: '¡Despierta el jardín!',
    gardenHint: 'Une una flor con su palabra.',
    attempts: 'Intentos',
    empty: '¡Preparando nuevas palabras!',
    correct: '¡Muy bien!',
    tryAgain: '¡Buen intento!',
    musicOn: 'Música activada',
    musicOff: 'Activar música',
    soundOn: 'Activar sonido',
    soundOff: 'Silenciar',
    ready: '¿Estás preparado, {name}?',
    startTurn: '¡Empieza tu turno!',
    finished: '¡Terminaste todas las rondas!',
    nextTurn: 'Ahora le toca a {name}. ¿Estás preparado?',
    perfectRound: '¡Ronda perfecta!',
    excellentWork: '¡Excelente trabajo!',
    goodTry: '¡Buen intento!',
    goodWork: '¡Buen trabajo, {name}!',
    correctAnswers: 'Aciertos',
    coins: 'Monedas',
    roundWords: 'Palabras de esta ronda',
    continue: 'Continuar',
    play: '¡Jugar!',
    learn: 'Aprender flamenco',
    learnDescription: '120 palabras, frases y un mini quiz',
    players: 'jugadores',
    player: 'jugador',
    turnsNote: 'Turnos por rondas · ¡Sin prisas!',
    place: 'España',
    appTagline: '¡A aprender jugando!',
    gamesIn: 'Juegos en',
    joiner: ' y ',
  },
  fr: {
    gameNames: { safari: 'Safari des mots', train: 'Train des mots', garden: 'Jardin des paires' },
    gameDescriptions: { safari: 'Écoute un mot et choisis le dessin.', train: 'Écoute et trouve le bon dessin.', garden: 'Relie chaque dessin à son mot.' },
    welcome: 'Bienvenue !',
    chooseGame: 'À quel jeu joue-t-on ?',
    changeFlag: 'Changer de langue',
    round: 'Manche',
    safariProgress: 'Safari',
    safariPrompt: 'Cherche :',
    safariHint: 'Touche le bon dessin.',
    trainProgress: 'Voyage en train',
    trainTitle: 'Écoute et choisis !',
    trainHint: 'Quel dessin correspond à ce mot ?',
    listen: 'Écouter le mot',
    gardenProgress: 'Paires trouvées',
    gardenTitle: 'Réveille le jardin !',
    gardenHint: 'Relie une fleur à son mot.',
    attempts: 'Essais',
    empty: 'Préparation de nouveaux mots !',
    correct: 'Bravo !',
    tryAgain: 'Bien essayé !',
    musicOn: 'Musique activée',
    musicOff: 'Activer la musique',
    soundOn: 'Activer le son',
    soundOff: 'Couper le son',
    ready: '{name}, es-tu prêt ?',
    startTurn: 'C’est ton tour !',
    finished: 'Vous avez terminé toutes les manches !',
    nextTurn: 'À toi, {name}. Es-tu prêt ?',
    perfectRound: 'Manche parfaite !',
    excellentWork: 'Excellent travail !',
    goodTry: 'Bien essayé !',
    goodWork: 'Bravo, {name} !',
    correctAnswers: 'Bonnes réponses',
    coins: 'Pièces',
    roundWords: 'Mots de cette manche',
    continue: 'Continuer',
    play: 'Jouer !',
    learn: 'Apprendre le néerlandais flamand',
    learnDescription: '120 mots, des phrases et un mini quiz',
    players: 'joueurs',
    player: 'joueur',
    turnsNote: 'À tour de rôle · Sans se presser !',
    place: 'France',
    appTagline: 'Apprendre en jouant !',
    gamesIn: 'Jeux en',
    joiner: ' et ',
  },
  'nl-BE': {
    gameNames: { safari: 'Woordensafari', train: 'Woordentrein', garden: 'Paren in de tuin' },
    gameDescriptions: { safari: 'Luister naar een woord en kies het plaatje.', train: 'Luister en zoek het juiste plaatje.', garden: 'Koppel elk plaatje aan het juiste woord.' },
    welcome: 'Welkom!',
    chooseGame: 'Welk spel kiezen we?',
    changeFlag: 'Taal veranderen',
    round: 'Ronde',
    safariProgress: 'Safari',
    safariPrompt: 'Zoek:',
    safariHint: 'Tik op het juiste plaatje.',
    trainProgress: 'Treinreis',
    trainTitle: 'Luister en kies!',
    trainHint: 'Welk plaatje hoort bij dit woord?',
    listen: 'Luister naar het woord',
    gardenProgress: 'Paren gevonden',
    gardenTitle: 'Maak de tuin wakker!',
    gardenHint: 'Koppel een bloem aan het woord.',
    attempts: 'Pogingen',
    empty: 'Nieuwe woorden klaarmaken!',
    correct: 'Goed gedaan!',
    tryAgain: 'Goed geprobeerd!',
    musicOn: 'Muziek aan',
    musicOff: 'Muziek aanzetten',
    soundOn: 'Geluid aanzetten',
    soundOff: 'Geluid uitzetten',
    ready: 'Ben je klaar, {name}?',
    startTurn: 'Jouw beurt begint!',
    finished: 'Jullie hebben alle rondes gespeeld!',
    nextTurn: 'Nu is {name} aan de beurt. Ben je klaar?',
    perfectRound: 'Perfecte ronde!',
    excellentWork: 'Heel goed gedaan!',
    goodTry: 'Goed geprobeerd!',
    goodWork: 'Goed gedaan, {name}!',
    correctAnswers: 'Goed',
    coins: 'Munten',
    roundWords: 'Woorden van deze ronde',
    continue: 'Verder',
    play: 'Spelen!',
    learn: 'Vlaams leren',
    learnDescription: '120 woorden, zinnen en een korte quiz',
    players: 'spelers',
    player: 'speler',
    turnsNote: 'Om de beurt · Rustig aan!',
    place: 'Vlaanderen',
    appTagline: 'Leren door te spelen!',
    gamesIn: 'Spellen in',
    joiner: ' en ',
  },
  ar: {
    gameNames: { safari: 'سفاري الكلمات', train: 'قطار الكلمات', garden: 'حديقة الأزواج' },
    gameDescriptions: { safari: 'استمع إلى كلمة واختر الصورة.', train: 'استمع وابحث عن الصورة الصحيحة.', garden: 'اربط كل صورة بكلمتها.' },
    welcome: 'أهلاً وسهلاً!',
    chooseGame: 'أي لعبة نختار؟',
    changeFlag: 'تغيير اللغة',
    round: 'الجولة',
    safariProgress: 'السفاري',
    safariPrompt: 'ابحث عن:',
    safariHint: 'المس الصورة الصحيحة.',
    trainProgress: 'رحلة القطار',
    trainTitle: 'استمع واختر!',
    trainHint: 'أي صورة تناسب هذه الكلمة؟',
    listen: 'استمع إلى الكلمة',
    gardenProgress: 'الأزواج المكتشفة',
    gardenTitle: 'أيقظ الحديقة!',
    gardenHint: 'اربط الزهرة بكلمتها.',
    attempts: 'المحاولات',
    empty: 'نحضّر كلمات جديدة!',
    correct: 'أحسنت!',
    tryAgain: 'محاولة جيدة!',
    musicOn: 'الموسيقى تعمل',
    musicOff: 'تشغيل الموسيقى',
    soundOn: 'تشغيل الصوت',
    soundOff: 'كتم الصوت',
    ready: 'هل أنت مستعد يا {name}؟',
    startTurn: 'حان دورك!',
    finished: 'لقد أكملتم كل الجولات!',
    nextTurn: 'حان دور {name}. هل أنت مستعد؟',
    perfectRound: 'جولة رائعة!',
    excellentWork: 'عمل ممتاز!',
    goodTry: 'محاولة جيدة!',
    goodWork: 'أحسنت يا {name}!',
    correctAnswers: 'إجابات صحيحة',
    coins: 'عملات',
    roundWords: 'كلمات هذه الجولة',
    continue: 'متابعة',
    play: 'هيا نلعب!',
    learn: 'تعلّم الهولندية الفلمنكية',
    learnDescription: '١٢٠ كلمة وجملاً واختباراً قصيراً',
    players: 'لاعبين',
    player: 'لاعب',
    turnsNote: 'بالدور · بدون استعجال!',
    place: 'المغرب',
    appTagline: 'نتعلم ونلعب!',
    gamesIn: 'ألعاب باللغة',
    joiner: ' و',
  },
};
