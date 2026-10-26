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
  safariVoiceGuide: string;
  trainVoiceGuide: string;
  gardenVoiceGuide: string;
  sayWord: string;
  orderSentence: string;
  sentencePrompt: string;
  checkOrder: string;
  removeWord: string;
  leaveGame: string;
  wordLevel: string;
  sentenceLevel: string;
  levelCompleted: string;
  nextLevel: string;
  finishedTurn: string;
  progressLabel: string;
  optionLabel: string;
  coveredFlower: string;
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
    safariVoiceGuide: 'Escucha la palabra y toca el dibujo que la representa.',
    trainVoiceGuide: 'Escucha la palabra y toca el dibujo correcto.',
    gardenVoiceGuide: 'Encuentra las parejas: toca dos flores para descubrirlas.',
    sayWord: 'La palabra es',
    orderSentence: 'Arrastra las palabras para ordenar la frase.',
    sentencePrompt: 'Forma esta frase:',
    checkOrder: 'Comprobar',
    removeWord: 'Quitar',
    leaveGame: 'Salir al menú de juegos',
    wordLevel: 'Nivel de palabras',
    sentenceLevel: 'Nivel de frases',
    levelCompleted: '¡Nivel completado!',
    nextLevel: '¡Siguiente nivel!',
    finishedTurn: 'Has completado este juego.',
    progressLabel: 'Progreso del juego',
    optionLabel: 'Opción',
    coveredFlower: 'Flor tapada',
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
    safariVoiceGuide: 'Écoute le mot et touche le dessin correspondant.',
    trainVoiceGuide: 'Écoute le mot et touche le bon dessin.',
    gardenVoiceGuide: 'Trouve les paires : touche deux fleurs pour les découvrir.',
    sayWord: 'Le mot est',
    orderSentence: 'Fais glisser les mots pour former la phrase.',
    sentencePrompt: 'Forme cette phrase :',
    checkOrder: 'Vérifier',
    removeWord: 'Retirer',
    leaveGame: 'Retour aux jeux',
    wordLevel: 'Niveau des mots',
    sentenceLevel: 'Niveau des phrases',
    levelCompleted: 'Niveau terminé !',
    nextLevel: 'Niveau suivant !',
    finishedTurn: 'Tu as terminé ce jeu.',
    progressLabel: 'Progression du jeu',
    optionLabel: 'Option',
    coveredFlower: 'Fleur cachée',
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
    safariVoiceGuide: 'Luister naar het woord en tik op het bijpassende plaatje.',
    trainVoiceGuide: 'Luister naar het woord en tik op het juiste plaatje.',
    gardenVoiceGuide: 'Zoek de paren: tik op twee bloemen om ze te ontdekken.',
    sayWord: 'Het woord is',
    orderSentence: 'Sleep de woorden naar de juiste plek.',
    sentencePrompt: 'Maak deze zin:',
    checkOrder: 'Controleren',
    removeWord: 'Weg',
    leaveGame: 'Terug naar de spellen',
    wordLevel: 'Woordenniveau',
    sentenceLevel: 'Zinnenniveau',
    levelCompleted: 'Niveau voltooid!',
    nextLevel: 'Volgend niveau!',
    finishedTurn: 'Je hebt dit spel voltooid.',
    progressLabel: 'Spelvoortgang',
    optionLabel: 'Keuze',
    coveredFlower: 'Verborgen bloem',
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
    safariVoiceGuide: 'استمع إلى الكلمة والمس الصورة المناسبة.',
    trainVoiceGuide: 'استمع إلى الكلمة والمس الصورة الصحيحة.',
    gardenVoiceGuide: 'ابحث عن الأزواج: المس زهرتين لاكتشافهما.',
    sayWord: 'الكلمة هي',
    orderSentence: 'اسحب الكلمات إلى ترتيبها الصحيح.',
    sentencePrompt: 'رتّب هذه الجملة:',
    checkOrder: 'تحقّق',
    removeWord: 'إزالة',
    leaveGame: 'العودة إلى الألعاب',
    wordLevel: 'مستوى الكلمات',
    sentenceLevel: 'مستوى الجمل',
    levelCompleted: 'اكتمل المستوى!',
    nextLevel: 'المستوى التالي!',
    finishedTurn: 'لقد أكملت هذه اللعبة.',
    progressLabel: 'تقدّم اللعبة',
    optionLabel: 'خيار',
    coveredFlower: 'زهرة مخفية',
  },
};
