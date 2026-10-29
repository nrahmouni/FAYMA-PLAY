const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../vocabulario_app_1000_palabras.md');
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.trim().split('\n').slice(1);

const categoryThemeMap = {
  Familia: 'familia',
  Colores: 'colores',
  Numeros: 'numeros',
  Cuerpo: 'cuerpo',
  Cuerpo2: 'cuerpo',
  Animales: 'animales',
  Salvaje: 'animales',
  Granja: 'animales',
  Mar: 'animales',
  Insectos: 'animales',
  Comida: 'comida',
  Comida2: 'comida',
  Frutas: 'comida',
  Verduras: 'comida',
  Cocina: 'comida',
  Ropa: 'ropa',
  Accesorios: 'ropa',
  Casa: 'casa',
  Salón: 'casa',
  Baño: 'casa',
  Habitación: 'casa',
  Escuela: 'escuela',
  Naturaleza: 'naturaleza',
  Naturaleza2: 'naturaleza',
  Clima: 'naturaleza',
  Geografia: 'naturaleza',
  Transporte: 'transporte',
  Lugares: 'lugares',
  Ciudad: 'lugares',
  Verbos: 'acciones',
  Verbos2: 'acciones',
  Verbos3: 'acciones',
  Adjetivos: 'adjetivos',
  Adjetivos2: 'adjetivos',
  Emociones: 'emociones',
  Emociones2: 'emociones',
  Tiempo: 'tiempo',
  Formas: 'formas',
  Juguetes: 'juguetes',
  Deportes: 'deportes',
  Profesiones: 'profesiones',
  Arte: 'arte',
  Tecnologia: 'tecnologia',
  Espacio: 'espacio',
  Espacio2: 'espacio',
  Materiales: 'materiales',
  Herramientas: 'herramientas',
  Conceptos: 'conceptos',
  Direcciones: 'direcciones'
};

const categoryDefaultEmoji = {
  Familia: '👨‍👩‍👧‍👦',
  Colores: '🎨',
  Numeros: '🔢',
  Cuerpo: '👤',
  Cuerpo2: '💪',
  Animales: '🐾',
  Salvaje: '🦁',
  Granja: '🐮',
  Mar: '🐬',
  Insectos: '🦋',
  Comida: '🍽️',
  Comida2: '🍲',
  Frutas: '🍎',
  Verduras: '🥕',
  Cocina: '🍳',
  Ropa: '👕',
  Accesorios: '👓',
  Casa: '🏠',
  Salón: '🛋️',
  Baño: '🛁',
  Habitación: '🛏️',
  Escuela: '🏫',
  Naturaleza: '🌳',
  Naturaleza2: '🌿',
  Clima: '☀️',
  Geografia: '🏔️',
  Transporte: '🚗',
  Lugares: '🗺️',
  Ciudad: '🏙️',
  Verbos: '🚶',
  Verbos2: '🖐️',
  Verbos3: '🏃',
  Adjetivos: '⭐',
  Adjetivos2: '🌟',
  Emociones: '😊',
  Emociones2: '🎭',
  Tiempo: '⏰',
  Formas: '🔷',
  Juguetes: '🧸',
  Deportes: '⚽',
  Profesiones: '🧑‍💼',
  Arte: '🎨',
  Tecnologia: '💻',
  Espacio: '🚀',
  Espacio2: '🌌',
  Materiales: '🧱',
  Herramientas: '🔨',
  Conceptos: '💡',
  Direcciones: '🧭'
};

const wordEmojiMap = {
  // === FAMILIA ===
  'Madre': '👩', 'Padre': '👨', 'Hermano': '👦', 'Hermana': '👧', 'Bebé': '👶',
  'Abuelo': '👴', 'Abuela': '👵', 'Tío': '🧔', 'Tía': '👩‍🦰', 'Primo': '🧒',

  // === COLORES ===
  'Rojo': '🔴', 'Azul': '🔵', 'Verde': '🟢', 'Amarillo': '🟡', 'Naranja': '🟠',
  'Morado': '🟣', 'Rosa': '🌸', 'Negro': '⚫', 'Blanco': '⚪', 'Marrón': '🟤',

  // === NÚMEROS ===
  'Uno': '1️⃣', 'Dos': '2️⃣', 'Tres': '3️⃣', 'Cuatro': '4️⃣', 'Cinco': '5️⃣',
  'Seis': '6️⃣', 'Siete': '7️⃣', 'Ocho': '8️⃣', 'Nueve': '9️⃣', 'Diez': '🔟',
  'Once': '1️⃣1️⃣', 'Doce': '1️⃣2️⃣', 'Trece': '1️⃣3️⃣', 'Catorce': '1️⃣4️⃣', 'Quince': '1️⃣5️⃣',
  'Dieciséis': '1️⃣6️⃣', 'Diecisiete': '1️⃣7️⃣', 'Dieciocho': '1️⃣8️⃣', 'Diecinueve': '1️⃣9️⃣', 'Veinte': '2️⃣0️⃣',

  // === CUERPO & CUERPO2 ===
  'Cabeza': '👤', 'Pelo': '💇', 'Ojo': '👁️', 'Oreja': '👂', 'Nariz': '👃',
  'Boca': '👄', 'Diente': '🦷', 'Lengua': '👅', 'Cuello': '🦒', 'Hombro': '💪',
  'Brazo': '💪', 'Codo': '💪', 'Mano': '✋', 'Dedo': '👉', 'Uña': '💅',
  'Pecho': '🫁', 'Espalda': '🧘', 'Pierna': '🦵', 'Rodilla': '🦵', 'Pie': '🦶',
  'Tobillo': '🦶', 'Cerebro': '🧠', 'Corazón': '❤️', 'Estómago': '🥣', 'Sangre': '🩸',
  'Hueso': '🦴', 'Piel': '🧴', 'Músculo': '💪', 'Garganta': '🗣️', 'Cara': '😊',
  'Frente': '👤', 'Mejilla': '😊', 'Barbilla': '🧔', 'Labio': '👄', 'Pestaña': '👁️',
  'Ceja': '🤨', 'Pulgar': '👍', 'Muñeca': '⌚', 'Cintura': '🧍', 'Cadera': '🧍',
  'Cráneo': '💀', 'Pulmón': '🫁', 'Intestino': '🧬', 'Hígado': '🫀', 'Riñón': '🫀',
  'Costilla': '🦴', 'Vena': '🩸', 'Articulación': '🦴', 'Talón': '🦶',

  // === ANIMALES, GRANJA, SALVAJE, MAR, INSECTOS ===
  'Perro': '🐶', 'Gato': '🐱', 'Pájaro': '🐦', 'Pez': '🐟', 'Caballo': '🐴',
  'Vaca': '🐮', 'Cerdo': '🐷', 'Oveja': '🐑', 'Ratón': '🐭', 'Conejo': '🐰',
  'León': '🦁', 'Tigre': '🐯', 'Elefante': '🐘', 'Jirafa': '🦒', 'Mono': '🐒',
  'Oso': '🐻', 'Lobo': '🐺', 'Zorro': '🦊', 'Pato': '🦆', 'Gallina': '🐔',
  'Gallo': '🐓', 'Pollito': '🐥', 'Burro': '🫏', 'Cabra': '🐐', 'Toro': '🐂',
  'Pavo': '🦃', 'Oca': '🪿', 'Cisne': '🦢', 'Paloma': '🕊️', 'Loro': '🦜',
  'Águila': '🦅', 'Búho': '🦉', 'Halcón': '🦅', 'Cigüeña': '🪶', 'Flamenco': '🦩',
  'Pingüino': '🐧', 'Cebra': '🦓', 'Hipopótamo': '🦛', 'Rinoceronte': '🦏',
  'Cocodrilo': '🐊', 'Canguro': '🦘', 'Koala': '🐨', 'Panda': '🐼', 'Leopardo': '🐆',
  'Pantera': '🐆', 'Guepardo': '🐆', 'Hiena': '🐺', 'Camello': '🐪', 'Dromedario': '🐫',
  'Gorila': '🦍', 'Chimpancé': '🐵', 'Ciervo': '🦌', 'Ardilla': '🐿️', 'Erizo': '🦔',
  'Castor': '🦫', 'Nutria': '🦦', 'Tejón': '🦡', 'Murciélago': '🦇', 'Serpiente': '🐍',
  'Lagarto': '🦎', 'Camaleón': '🦎', 'Iguana': '🦎', 'Rana': '🐸', 'Sapo': '🐸',
  'Tortuga': '🐢', 'Ballena': '🐋', 'Tiburón': '🦈', 'Delfín': '🐬', 'Pulpo': '🐙',
  'Calamar': '🦑', 'Medusa': '🪼', 'Cangrejo': '🦀', 'Langosta': '🦞', 'Gamba': '🦐',
  'Estrella de mar': '⭐', 'Caballito de mar': '🌊', 'Foca': '🦭', 'Morsa': '🦭',
  'Orca': '🐋', 'Raya': '🐟', 'Atún': '🐟', 'Salmón': '🐟', 'Coral': '🪸',
  'Concha': '🐚', 'Esponja': '🧽', 'Ola': '🌊', 'Alga': '🌿', 'Insecto': '🪲',
  'Mosca': '🪰', 'Mosquito': '🦟', 'Abeja': '🐝', 'Avispa': '🐝', 'Hormiga': '🐜',
  'Mariposa': '🦋', 'Polilla': '🦋', 'Escarabajo': '🪲', 'Mariquita': '🐞', 'Grillo': '🦗',
  'Saltamontes': '🦗', 'Libélula': '🪰', 'Cucaracha': '🪳', 'Araña': '🕷️', 'Escorpión': '🦂',
  'Ciempiés': '🐛', 'Gusano': '🪱', 'Caracol': '🐌', 'Babosa': '🐌', 'Oruga': '🐛',
  'Granja': '🚜', 'Granjero': '🧑‍🌾', 'Tractor': '🚜', 'Paja': '🌾', 'Heno': '🌾',

  // === COMIDA, FRUTAS, VERDURAS, COCINA, COMIDA2 ===
  'Manzana': '🍎', 'Plátano': '🍌', 'Fresa': '🍓', 'Limón': '🍋', 'Uva': '🍇',
  'Melocotón': '🍑', 'Cereza': '🍒', 'Pera': '🍐', 'Sandía': '🍉', 'Melón': '🍈',
  'Piña': '🍍', 'Mango': '🥭', 'Papaya': '🥭', 'Kiwi': '🥝', 'Aguacate': '🥑',
  'Coco': '🥥', 'Higo': '🫐', 'Ciruela': '🫐', 'Frambuesa': '🫐', 'Mora': '🫐',
  'Arándano': '🫐', 'Granada': '🍎', 'Mandarina': '🍊', 'Lima': '🍋', 'Tomate': '🍅',
  'Patata': '🥔', 'Zanahoria': '🥕', 'Cebolla': '🧅', 'Ajo': '🧄', 'Lechuga': '🥬',
  'Espinaca': '🥬', 'Pepino': '🥒', 'Pimiento': '🫑', 'Calabacín': '🥒', 'Berenjena': '🍆',
  'Brócoli': '🥦', 'Coliflor': '🥦', 'Champiñón': '🍄', 'Seta': '🍄', 'Maíz': '🌽',
  'Guisante': '🫛', 'Judía': '🫘', 'Lenteja': '🍲', 'Garbanzo': '🍲', 'Pan': '🍞',
  'Queso': '🧀', 'Leche': '🥛', 'Agua': '💧', 'Huevo': '🥚', 'Carne': '🥩',
  'Pollo': '🍗', 'Pescado': '🐟', 'Arroz': '🍚', 'Pasta': '🍝', 'Pizza': '🍕',
  'Hamburguesa': '🍔', 'Helado': '🍦', 'Chocolate': '🍫', 'Café': '☕', 'Té': '🍵',
  'Zumo': '🧃', 'Sopa': '🍲', 'Ensalada': '🥗', 'Tarta': '🎂', 'Pastel': '🍰',
  'Galleta': '🍪', 'Mantequilla': '🧈', 'Miel': '🍯', 'Azúcar': '🍬', 'Sal': '🧂',
  'Pimienta': '🧂', 'Aceite': '🫒', 'Vinagre': '🍶', 'Salsa': '🥫', 'Sartén': '🍳',
  'Olla': '🍲', 'Cuchillo': '🔪', 'Tenedor': '🍴', 'Cuchara': '🥄', 'Plato': '🍽️',
  'Vaso': '🥛', 'Copa': '🍷', 'Taza': '☕', 'Jarra': '🫖', 'Servilleta': '🧻',
  'Nevera': '🧊', 'Horno': '🔥', 'Microondas': '📻', 'Batidora': '🥣', 'Desayuno': '🥞',
  'Comida (almuerzo)': '🍽️', 'Cena': '🍲', 'Merienda': '🥪', 'Postre': '🍮',

  // === ROPA Y ACCESORIOS ===
  'Camiseta': '👕', 'Pantalón': '👖', 'Vestido': '👗', 'Falda': '👗', 'Chaqueta': '🧥',
  'Abrigo': '🧥', 'Jersey': '🧶', 'Zapato': '👞', 'Bota': '👢', 'Zapatilla': '👟',
  'Calcetín': '🧦', 'Sombrero': '🎩', 'Gorro': '🧢', 'Guante': '🧤', 'Bufanda': '🧣',
  'Cinturón': '🥋', 'Pijama': '🛌', 'Bañador': '🩱', 'Gafas': '👓', 'Reloj': '⌚',
  'Accesorio': '💍', 'Anillo': '💍', 'Collar': '📿', 'Pendiente': '💎', 'Pulsera': '📿',
  'Bolso': '👜', 'Cartera': '👛', 'Mochila': '🎒', 'Paraguas': '☂️', 'Maleta': '🧳', 'Monedero': '👛',

  // === CASA, SALÓN, BAÑO, HABITACIÓN ===
  'Puerta': '🚪', 'Ventana': '🪟', 'Pared': '🧱', 'Suelo': '🪵', 'Techo': '🏠',
  'Habitación': '🛏️', 'Salón': '🛋️', 'Cocina': '🍳', 'Baño': '🛁', 'Cama': '🛏️',
  'Armario': '🚪', 'Mesa': '🪵', 'Silla': '🪑', 'Sofá': '🛋️', 'Sillón': '🛋️', 'Lámpara': '💡',
  'Televisión': '📺', 'Espejo': '🪞', 'Alfombra': '🧶', 'Escalera': '🪜', 'Llave': '🔑',
  'Cojín': '🛋️', 'Cuadro': '🖼️', 'Mueble': '🪵', 'Estantería': '📚', 'Cortina': '🪟', 'Ducha': '🚿',
  'Bañera': '🛁', 'Lavabo': '🚰', 'Inodoro': '🚽', 'Retrete': '🚽', 'Toalla': '🧖', 'Jabón': '🧼',
  'Champú': '🧴', 'Cepillo': '🪥', 'Colchón': '🛏️', 'Almohada': '🛌', 'Manta': '🧶',
  'Sábana': '🛏️', 'Mesita': '🪵', 'Mesilla': '🪵', 'Despertador': '⏰', 'Jardín': '🏡', 'Balcón': '🪴',

  // === ESCUELA ===
  'Escuela': '🏫', 'Clase': '🏫', 'Profesor': '🧑‍🏫', 'Alumno': '🧑‍🎓', 'Estudiante': '🧑‍🎓',
  'Pizarra': '📋', 'Libro': '📖', 'Cuaderno': '📓', 'Lápiz': '✏️', 'Bolígrafo': '🖊️',
  'Goma': '🧼', 'Regla': '📏', 'Tijeras': '✂️', 'Pegamento': '🧴', 'Mapa': '🗺️',
  'Ordenador': '💻', 'Papel': '📄', 'Examen': '📝', 'Recreo': '🏃',

  // === NATURALEZA, CLIMA, GEOGRAFÍA, NATURALEZA2 ===
  'Árbol': '🌳', 'Planta': '🌱', 'Flor': '🌸', 'Hierba': '🌿', 'Bosque': '🌲',
  'Río': '🏞️', 'Lago': '🌊', 'Mar': '🌊', 'Montaña': '🏔️', 'Colina': '⛰️',
  'Piedra': '🪨', 'Arena': '🏖️', 'Tierra': '🌍', 'Cielo': '☁️', 'Sol': '☀️',
  'Luna': '🌙', 'Estrella': '⭐', 'Nube': '☁️', 'Lluvia': '🌧️', 'Nieve': '❄️',
  'Viento': '💨', 'Tormenta': '⛈️', 'Rayo': '⚡', 'Trueno': '🌩️', 'Niebla': '🌫️',
  'Arcoíris': '🌈', 'Hielo': '🧊', 'Calor': '🔥', 'Frío': '🥶', 'Océano': '🌊',
  'Isla': '🏝️', 'Valle': '🏞️', 'Desierto': '🏜️', 'Volcán': '🌋', 'Cueva': '🕳️',
  'Playa': '🏖️', 'Cascada': '🌊', 'Selva': '🌴', 'Campo': '🌾', 'Costa': '🏖️',
  'Primavera': '🌸', 'Verano': '☀️', 'Otoño': '🍂', 'Invierno': '❄️',
  'Polvo': '💨', 'Gas': '☁️',

  // === TRANSPORTE, CIUDAD, LUGARES ===
  'Coche': '🚗', 'Autobús': '🚌', 'Tren': '🚆', 'Metro': '🚇', 'Tranvía': '🚊',
  'Avión': '✈️', 'Barco': '🚢', 'Bicicleta': '🚲', 'Moto': '🏍️', 'Camión': '🚚',
  'Furgoneta': '🚐', 'Taxi': '🚕', 'Helicóptero': '🚁', 'Cohete': '🚀', 'Submarino': '🤿',
  'Tractor': '🚜', 'Ambulancia': '🚑', 'Policía': '🚓', 'Bomberos': '🚒', 'Grúa': '🏗️',
  'Calle': '🛣️', 'Avenida': '🛣️', 'Plaza': '🏛️', 'Parque': '🌳', 'Puente': '🌉',
  'Edificio': '🏢', 'Hospital': '🏥', 'Banco': '🏦', 'Tienda': '🏬', 'Supermercado': '🛒',
  'Farmacia': '💊', 'Restaurante': '🍽️', 'Hotel': '🏨', 'Museo': '🏛️', 'Teatro': '🎭',
  'Cine': '🎬', 'Aeropuerto': '🛫', 'Estación': '🚉', 'Puerto': '⚓', 'Biblioteca': '📚',
  'Ciudad': '🏙️', 'Pueblo': '🏘️', 'Barrio': '🏡', 'Centro': '🎯', 'Afueras': '🌾',

  // === VERBOS 1 (ACCIONES FUNDAMENTALES) ===
  'Ser': '👤',
  'Estar': '📍',
  'Tener': '🤲',
  'Hacer': '🔨',
  'Ir': '🚶',
  'Venir': '🏃',
  'Comer': '🍽️',
  'Beber': '🥤',
  'Dormir': '😴',
  'Jugar': '🧸',
  'Hablar': '🗣️',
  'Escuchar': '👂',
  'Leer': '📖',
  'Escribir': '✍️',
  'Caminar': '🚶',
  'Correr': '🏃',
  'Saltar': '🦘',
  'Bailar': '💃',
  'Cantar': '🎤',
  'Mirar': '👀',
  'Ver': '👀',
  'Tocar': '👆',
  'Oler': '👃',
  'Sentir': '💓',
  'Reír': '😄',
  'Llorar': '😭',
  'Amar': '❤️',
  'Gustar': '👍',
  'Querer': '💖',
  'Poder': '💪',
  'Saber': '🧠',
  'Aprender': '📚',
  'Enseñar': '🧑‍🏫',
  'Pensar': '💭',
  'Creer': '🙏',
  'Comprar': '🛍️',
  'Vender': '🏷️',
  'Pagar': '💳',
  'Ayudar': '🤝',
  'Trabajar': '💼',
  'Abrir': '🔓',
  'Cerrar': '🔒',
  'Entrar': 'svg:entrar',
  'Salir': 'svg:salir',
  'Subir': 'svg:subir',
  'Bajar': 'svg:bajar',
  'Dar': 'svg:dar',        // User highlighted this explicitly! Accurate Giving Hand SVG
  'Recibir': 'svg:recibir',
  'Llevar': '🎒',
  'Traer': '📥',

  // === VERBOS 2 (MANIPULACIÓN Y ACCIONES ESPECÍFICAS) ===
  'Caer': '🍂',
  'Levantar': '🙌',
  'Empujar': 'svg:empujar',
  'Tirar': 'svg:tirar',
  'Llenar': '🫗',
  'Vaciar': '🗑️',
  'Romper': '💔',
  'Arreglar': '🛠️',
  'Cortar': '✂️',
  'Pegar': '🧴',
  'Dibujar': '🎨',
  'Pintar': '🖌️',
  'Colorear': '🖍️',
  'Mezclar': '🥣',
  'Separar': '↔️',
  'Esconder': '🙈',
  'Buscar': '🔍',
  'Encontrar': '💡',
  'Perder': '🤷',
  'Ganar': '🏆',
  'Parar': '🛑',
  'Continuar': '⏩',
  'Empezar': '🏁',
  'Terminar': '🎖️',
  'Cambiar': '🔄',
  'Guardar': '🗄️',
  'Sacar': '📤',
  'Meter': '📥',
  'Poner': 'svg:poner',
  'Quitar': 'svg:quitar',

  // === VERBOS 3 (MOVIMIENTO, COMUNICACIÓN Y CONVIVENCIA) ===
  'Volar': '🦅',
  'Nadar': '🏊',
  'Bucear': '🤿',
  'Trepar': '🧗',
  'Resbalar': '🍌',
  'Columpiar': '🎠',
  'Montar': '🏇',
  'Conducir': '🚗',
  'Viajar': '✈️',
  'Pasear': '🚶',
  'Visitar': '🚪',
  'Saludar': '👋',
  'Despedir': '🛫',
  'Abrazar': '🫂',
  'Besar': '💋',
  'Sonreír': '😊',
  'Gritar': '📢',
  'Susurrar': '🤫',
  'Preguntar': '❓',
  'Responder': '💡',
  'Explicar': '🧑‍🏫',
  'Entender': '🧠',
  'Recordar': '🧠',
  'Olvidar': '💭',
  'Soñar': '🌙',
  'Despertar': '⏰',
  'Cuidar': '🌱',
  'Compartir': '🤝',
  'Invitar': '✉️',
  'Prometer': '🤝',

  // === CONCEPTOS ===
  'Cosa': '📦',
  'Objeto': '🧩',
  'Parte': '🍰',
  'Todo': '🌕',
  'Mitad': '🌗',
  'Cuarto': '🌘',
  'Docena': '🥚',
  'Par': '🧦',
  'Grupo': '👥',
  'Fila': '🧍',
  'Centro': '🎯',
  'Borde': '🔲',
  'Fondo': '⬇️',
  'Superficie': '🌊',
  'Forma': '🔷',
  'Tamaño': '📏',
  'Peso': '⚖️',
  'Medida': '📐',
  'Cantidad': '🔢',
  'Número': '#️⃣',
  'Letra': '🔤',
  'Palabra': '📝',
  'Frase': '💬',
  'Cuento': '🧚',
  'Historia': '📜',
  'Fin': '🏁',
  'Principio': '🎬',
  'Juego': '🎲',
  'Regla': '📋',
  'Problema': '🧩',
  'Solución': '🔑',
  'Idea': '💡',
  'Secreto': '🤫',
  'Mentira': 'svg:mentira',
  'Verdad': 'svg:verdad',
  'Peligro': 'svg:peligro',
  'Suerte': 'svg:suerte',
  'Regalo': '🎁',          // THIS is the gift box!
  'Fiesta': '🥳',
  'Paz': 'svg:paz',

  // === DIRECCIONES ===
  'Norte': '🧭',
  'Sur': '🧭',
  'Este': '🧭',
  'Oeste': '🧭',
  'Izquierda': '⬅️',
  'Derecha': '➡️',
  'Arriba': '⬆️',
  'Abajo': '⬇️',
  'Delante': '⏩',
  'Detrás': '⏪',

  // === ESPACIO 2 (POSICIONES Y RELACIONES) ===
  'Dentro': 'svg:dentro',
  'Fuera': 'svg:fuera',
  'Cerca': 'svg:cerca',
  'Lejos': 'svg:lejos',
  'Aquí': '📍',
  'Allí': '🗺️',
  'Junto': '🧑‍🤝‍🧑',
  'Entre': '🥪',
  'Sobre': 'svg:sobre',
  'Bajo': 'svg:bajo',

  // === ADJETIVOS & ADJETIVOS2 ===
  'Bueno': '👍', 'Malo': '👎', 'Grande': '🐘', 'Pequeño': '🐭', 'Alto': '🦒', 'Bajo': '🦔',
  'Largo': '🐍', 'Corto': '🐛', 'Fácil': '🟢', 'Difícil': '🧗', 'Claro': '☀️', 'Oscuro': '🌑',
  'Ligero': '🪶', 'Pesado': '🪨', 'Suave': '🧸', 'Duro': '💎', 'Caliente': '🔥', 'Frío': '🧊',
  'Rápido': '⚡', 'Lento': '🐢', 'Limpio': '✨', 'Sucio': '🧦', 'Lleno': '🥛', 'Vacío': '🫗',
  'Nuevo': '🆕', 'Viejo': '🏛️', 'Joven': '🧒', 'Fuerte': '💪', 'Débil': '🥀', 'Rico': '🍯',
  'Pobre': '🪙', 'Caro': '💎', 'Barato': '🪙', 'Seco': '🏜️', 'Mojado': '🌧️', 'Dulce': '🍭',
  'Salado': '🧂', 'Amargo': '☕', 'Ácido': '🍋', 'Picante': '🌶️',

  // === EMOCIONES & EMOCIONES2 ===
  'Feliz': '😄', 'Triste': '😢', 'Sorpresa': '😲', 'Miedo': '😨', 'Asco': '🤢',
  'Enfado': '😡', 'Amor': '❤️', 'Calma': '😌', 'Nervios': '😬', 'Orgullo': '😎',
  'Vergüenza': '😳', 'Aburrimiento': '🥱', 'Interés': '🧐', 'Duda': '🤔',
  'Certeza': '🎯', 'Esperanza': '🌈', 'Decepción': '😞', 'Envidia': '😒', 'Celos': '😠', 'Culpa': '🙇',

  // === TIEMPO & FORMAS ===
  'Hora': '🕒', 'Minuto': '⏱️', 'Segundo': '⏱️', 'Día': '🌅', 'Noche': '🌙',
  'Mañana': '🌄', 'Tarde': '🌇', 'Semana': '📅', 'Mes': '🗓️', 'Año': '🎆',
  'Hoy': '👇', 'Ayer': '👈', 'Mañana (tiempo)': '👉', 'Lunes': '1️⃣', 'Martes': '2️⃣',
  'Miércoles': '3️⃣', 'Jueves': '4️⃣', 'Viernes': '5️⃣', 'Sábado': '6️⃣', 'Domingo': '☀️',
  'Círculo': '⚪', 'Cuadrado': '🟦', 'Triángulo': '🔺', 'Rectángulo': '▭', 'Óvalo': '⬭',
  'Rombo': '🔷', 'Estrella (forma)': '⭐', 'Corazón (forma)': '❤️', 'Línea': '➖', 'Punto': '🔘',

  // === JUGUETES, DEPORTES, PROFESIONES, ARTE, TECNOLOGÍA, ESPACIO ===
  'Pelota': '⚽', 'Muñeca': '🪆', 'Cochecito': '🏎️', 'Puzzle': '🧩', 'Peluche': '🧸',
  'Robot': '🤖', 'Cometa': '🪁', 'Globo': '🎈', 'Bloques': '🧱', 'Patinete': '🛴',
  'Patineta': '🛹', 'Bicicleta de niño': '🚲', 'Pistola de agua': '🔫', 'Tambor de juguete': '🥁',
  'Fútbol': '⚽', 'Baloncesto': '🏀', 'Tenis': '🎾', 'Natación': '🏊', 'Ciclismo': '🚴',
  'Atletismo': '🏃', 'Gimnasia': '🤸', 'Voleibol': '🏐', 'Béisbol': '⚾', 'Rugby': '🏉',
  'Golf': '⛳', 'Esquí': '🎿', 'Patinaje': '⛸️', 'Boxeo': '🥊', 'Judo': '🥋',
  'Médico': '🧑‍⚕️', 'Enfermera': '🧑‍⚕️', 'Profesor': '🧑‍🏫', 'Policía': '👮', 'Bombero': '👨‍🚒',
  'Cocinero': '👨‍🍳', 'Camarero': '🤵', 'Panadero': '🥖', 'Carnicero': '🥩', 'Peluquero': '✂️',
  'Mecánico': '🔧', 'Carpintero': '🪚', 'Pintor': '🎨', 'Músico': '🎵', 'Actor': '🎭',
  'Cantante': '🎤', 'Bailarín': '💃', 'Escritor': '✍️', 'Periodista': '📰', 'Cartero': '📬',
  'Dentista': '🦷', 'Veterinario': '🐾', 'Arquitecto': '📐', 'Ingeniero': '⚙️', 'Científico': '🔬',
  'Juez': '⚖️', 'Abogado': '💼', 'Presidente': '🏛️', 'Astronauta': '👨‍🚀', 'Piloto': '👨‍✈️',
  'Arte': '🎨', 'Pintura': '🖼️', 'Dibujo': '✏️', 'Color': '🎨', 'Pincel': '🖌️',
  'Lienzo': '🖼️', 'Escultura': '🗿', 'Música': '🎵', 'Canción': '🎶', 'Instrumento': '🎻',
  'Guitarra': '🎸', 'Piano': '🎹', 'Violín': '🎻', 'Flauta': '🪈', 'Tambor': '🥁',
  'Trompeta': '🎺', 'Micrófono': '🎤', 'Danza': '💃', 'Fotografía': '📷',
  'Teléfono': '📱', 'Móvil': '📱', 'Tablet': '📱', 'Cámara': '📷', 'Auriculares': '🎧',
  'Altavoz': '🔊', 'Internet': '🌐', 'Batería': '🔋', 'Cargador': '🔌', 'Pantalla': '🖥️', 'Teclado': '⌨️',
  'Espacio': '🌌', 'Planeta': '🪐', 'Galaxia': '🌌', 'Universo': '✨', 'Cometa': '☄️',
  'Asteroide': '🪨', 'Meteorito': '☄️', 'Satélite': '🛰️', 'Telescopio': '🔭', 'Órbita': '🪐',
  'Mercurio': '🪐', 'Venus': '🪐', 'Marte': '🪐', 'Júpiter': '🪐',
  'Material': '🧱', 'Madera': '🪵', 'Metal': '🔩', 'Hierro': '⛓️', 'Acero': '🛡️',
  'Cobre': '🟤', 'Cristal': '🍷', 'Tela': '🧵', 'Algodón': '☁️', 'Lana': '🧶',
  'Seda': '🧣', 'Cuero': '👞', 'Plástico': '🥤', 'Vidrio': '🪟', 'Cartón': '📦',
  'Oro': '🪙', 'Plata': '🥈',
  'Herramienta': '🔧', 'Martillo': '🔨', 'Clavo': '🔩', 'Tornillo': '🔩', 'Destornillador': '🪛',
  'Sierra': '🪚', 'Taladro': '🔩', 'Llave inglesa': '🔧', 'Alicates': '🗜️', 'Metro': '📏',
  'Hacha': '🪓', 'Fregona': '🧹', 'Cúter': '✂️', 'Cinta': '📦', 'Pala': '🪵', 'Rastrillo': '🧹',
  'Escoba': '🧹', 'Cubo': '🪣'
};

const { WORD_ICONS_BY_ID } = require('./buildComplete1000Icons.cjs');

function getEmoji(id, word, category) {
  if (WORD_ICONS_BY_ID[id]) return WORD_ICONS_BY_ID[id];
  if (wordEmojiMap[word]) return wordEmojiMap[word];
  const normalized = word.trim();
  for (const [key, emoji] of Object.entries(wordEmojiMap)) {
    if (normalized.toLowerCase() === key.toLowerCase()) return emoji;
  }
  return categoryDefaultEmoji[category] || '✨';
}

function getLearningLevel(id, lvl) {
  const numId = parseInt(id, 10);
  const numLvl = parseInt(lvl, 10);
  if (numLvl === 1) {
    return Math.min(4, Math.floor(((numId - 1) / 270) * 4) + 1);
  }
  if (numLvl === 2) {
    return Math.min(7, Math.floor(((numId - 271) / 230) * 3) + 5);
  }
  if (numLvl === 3) {
    return Math.min(11, Math.floor(((numId - 501) / 270) * 4) + 8);
  }
  return Math.min(15, Math.floor(((numId - 771) / 230) * 4) + 12);
}

const rawWords = [];

lines.forEach(line => {
  const parts = line.split(',');
  if (parts.length !== 8) return;
  const [idStr, lvlStr, cat, es, en, fr, nl, ar] = parts;
  const idNum = parseInt(idStr, 10);
  const theme = categoryThemeMap[cat] || 'general';
  const emoji = getEmoji(idNum, es, cat);
  const learningLevel = getLearningLevel(idNum, lvlStr);

  rawWords.push({
    id: idNum,
    lvl: parseInt(lvlStr, 10),
    cat,
    theme,
    emoji,
    learningLevel,
    es: es.trim(),
    en: en.trim(),
    fr: fr.trim(),
    nl: nl.trim(),
    ar: ar.trim(),
  });
});

console.log('Total raw words processed:', rawWords.length);

const outContent = `import { Word, Language, DifficultyLevel } from '../types';

export interface Raw1000Word {
  id: number;
  lvl: number;
  cat: string;
  theme: string;
  emoji: string;
  learningLevel: DifficultyLevel;
  es: string;
  en: string;
  fr: string;
  nl: string;
  ar: string;
}

export const RAW_1000_WORDS: Raw1000Word[] = ${JSON.stringify(rawWords, null, 2)};

export const WORDS_1000_BANK: Word[] = RAW_1000_WORDS.flatMap((w): Word[] => [
  {
    id: \`w_ar_\${w.id}\`,
    text: w.ar,
    translation: w.es,
    language: 'ar',
    theme: w.theme,
    imageUrl: w.emoji,
    learningLevel: w.learningLevel,
    category: w.cat,
    english: w.en,
    audioText: w.ar,
  },
  {
    id: \`w_nl_\${w.id}\`,
    text: w.nl,
    translation: w.es,
    language: 'nl-BE',
    theme: w.theme,
    imageUrl: w.emoji,
    learningLevel: w.learningLevel,
    category: w.cat,
    english: w.en,
    audioText: w.nl,
  },
  {
    id: \`w_fr_\${w.id}\`,
    text: w.fr,
    translation: w.es,
    language: 'fr',
    theme: w.theme,
    imageUrl: w.emoji,
    learningLevel: w.learningLevel,
    category: w.cat,
    english: w.en,
    audioText: w.fr,
  },
  {
    id: \`w_es_\${w.id}\`,
    text: w.es,
    translation: w.es,
    language: 'es',
    theme: w.theme,
    imageUrl: w.emoji,
    learningLevel: w.learningLevel,
    category: w.cat,
    english: w.en,
    audioText: w.es,
  },
]);

export const WORDS_1000_BY_LANGUAGE: Record<Language, Word[]> = {
  ar: WORDS_1000_BANK.filter(w => w.language === 'ar'),
  'nl-BE': WORDS_1000_BANK.filter(w => w.language === 'nl-BE'),
  fr: WORDS_1000_BANK.filter(w => w.language === 'fr'),
  es: WORDS_1000_BANK.filter(w => w.language === 'es'),
};

export const VOCABULARY_1000_CATEGORIES = Array.from(
  new Set(RAW_1000_WORDS.map(w => w.cat))
);
`;

const outputPath = path.resolve(__dirname, '../src/data/words1000.ts');
fs.writeFileSync(outputPath, outContent, 'utf-8');
console.log('Successfully written', outputPath, 'File size:', fs.statSync(outputPath).size);
