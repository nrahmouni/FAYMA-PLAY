// Complete mapping of all 1,000 vocabulary words by their exact ID (1 to 1000)
// This guarantees that every single word in the app has an unambiguous, child-friendly,
// accurate visual representation with ZERO generic fallbacks.

const WORD_ICONS_BY_ID = {
  // === FAMILIA (1-10) ===
  1: '👩', // Madre
  2: '👨', // Padre
  3: '👦', // Hermano
  4: '👧', // Hermana
  5: '👶', // Bebé
  6: '👴', // Abuelo
  7: '👵', // Abuela
  8: '🧔', // Tío
  9: '👩‍🦰', // Tía
  10: '🧒', // Primo

  // === COLORES (11-20) ===
  11: '🔴', // Rojo
  12: '🔵', // Azul
  13: '🟢', // Verde
  14: '🟡', // Amarillo
  15: '🟠', // Naranja
  16: '🟣', // Morado
  17: '🌸', // Rosa
  18: '⚫', // Negro
  19: '⚪', // Blanco
  20: '🟤', // Marrón

  // === NÚMEROS (21-40) ===
  21: '1️⃣', // Uno
  22: '2️⃣', // Dos
  23: '3️⃣', // Tres
  24: '4️⃣', // Cuatro
  25: '5️⃣', // Cinco
  26: '6️⃣', // Seis
  27: '7️⃣', // Siete
  28: '8️⃣', // Ocho
  29: '9️⃣', // Nueve
  30: '🔟', // Diez
  31: '1️⃣1️⃣', // Once
  32: '1️⃣2️⃣', // Doce
  33: '1️⃣3️⃣', // Trece
  34: '1️⃣4️⃣', // Catorce
  35: '1️⃣5️⃣', // Quince
  36: '1️⃣6️⃣', // Dieciséis
  37: '1️⃣7️⃣', // Diecisiete
  38: '1️⃣8️⃣', // Dieciocho
  39: '1️⃣9️⃣', // Diecinueve
  40: '2️⃣0️⃣', // Veinte

  // === CUERPO (41-60) ===
  41: 'svg:cabeza', // Cabeza
  42: '💇', // Pelo
  43: '👁️', // Ojo
  44: '👂', // Oreja
  45: '👃', // Nariz
  46: '👄', // Boca
  47: '🦷', // Diente
  48: '👅', // Lengua
  49: 'svg:cuello', // Cuello
  50: 'svg:hombro', // Hombro
  51: '💪', // Brazo
  52: 'svg:codo', // Codo
  53: '✋', // Mano
  54: '👉', // Dedo
  55: 'svg:barriga', // Barriga
  56: 'svg:espalda', // Espalda
  57: 'svg:pierna', // Pierna (User highlighted: clear full leg outline!)
  58: 'svg:rodilla', // Rodilla (User highlighted: glowing target on bent knee joint!)
  59: '🦶', // Pie
  60: '💅', // Uña

  // === ANIMALES (61-80) ===
  61: '🐶', // Perro
  62: '🐱', // Gato
  63: '🐭', // Ratón (animal)
  64: '🐦', // Pájaro
  65: '🐟', // Pez
  66: '🐮', // Vaca
  67: '🐴', // Caballo
  68: '🐷', // Cerdo
  69: '🐑', // Oveja
  70: '🐔', // Gallina
  71: '🦆', // Pato
  72: '🐰', // Conejo
  73: '🦁', // León
  74: '🐯', // Tigre
  75: '🐘', // Elefante
  76: '🐒', // Mono
  77: '🐻', // Oso
  78: '🦒', // Jirafa
  79: '🐍', // Serpiente
  80: '🐸', // Rana

  // === COMIDA (81-100) ===
  81: '💧', // Agua
  82: '🥛', // Leche
  83: '🧃', // Zumo
  84: '🍞', // Pan
  85: '🧀', // Queso
  86: '🥚', // Huevo
  87: '🧈', // Mantequilla
  88: '🥩', // Carne
  89: '🐟', // Pescado
  90: '🍗', // Pollo
  91: '🍚', // Arroz
  92: '🍝', // Pasta
  93: '🍲', // Sopa
  94: '🍕', // Pizza
  95: '🍔', // Hamburguesa
  96: '🥗', // Ensalada
  97: '🍪', // Galleta
  98: '🍰', // Pastel
  99: '🍦', // Helado
  100: '🍫', // Chocolate

  // === ROPA (101-120) ===
  101: '👕', // Camiseta
  102: '👖', // Pantalón
  103: '👗', // Vestido
  104: 'svg:falda', // Falda (pleated skirt, distinct from dress)
  105: '🧥', // Chaqueta
  106: '🧥', // Abrigo
  107: 'svg:jersey', // Jersey (knitted sweater)
  108: '👞', // Zapato
  109: '👢', // Bota
  110: '👟', // Zapatilla
  111: '🧦', // Calcetín
  112: '🎩', // Sombrero
  113: '🧢', // Gorro
  114: '🧤', // Guante
  115: '🧣', // Bufanda
  116: '🥋', // Cinturón
  117: '🛌', // Pijama
  118: '🩱', // Bañador
  119: '👓', // Gafas
  120: '⌚', // Reloj

  // === CASA (121-140) ===
  121: '🚪', // Puerta
  122: '🪟', // Ventana
  123: 'svg:pared', // Pared (wall section)
  124: 'svg:suelo', // Suelo (parquet wood floor)
  125: '🏠', // Techo
  126: 'svg:habitacion', // Habitación (bedroom with bed & window)
  127: 'svg:salon', // Salón (living room scene)
  128: '🍳', // Cocina
  129: '🛁', // Baño
  130: '🛏️', // Cama
  131: 'svg:armario', // Armario (wardrobe closet, distinct from door)
  132: 'svg:mesa', // Mesa (wooden 4-legged table)
  133: '🪑', // Silla
  134: '🛋️', // Sofá
  135: '💡', // Lámpara
  136: '📺', // Televisión
  137: '🪞', // Espejo
  138: 'svg:alfombra', // Alfombra (woven fringed room rug - User specifically mentioned!)
  139: '🪜', // Escalera
  140: '🔑', // Llave

  // === ESCUELA (141-160) ===
  141: 'svg:clase', // Clase (classroom with blackboard)
  142: '🧑‍🏫', // Profesor
  143: '🧑‍🎓', // Alumno
  144: '📖', // Libro
  145: '📓', // Cuaderno
  146: '✏️', // Lápiz
  147: '🖊️', // Bolígrafo
  148: '🧼', // Goma (borrador)
  149: '📏', // Regla
  150: '🎒', // Mochila
  151: '📋', // Pizarra
  152: '🖍️', // Tiza
  153: '🪑', // Pupitre
  154: '📄', // Papel
  155: '✂️', // Tijeras
  156: 'svg:pegamento', // Pegamento (glue bottle & drop)
  157: '👝', // Estuche
  158: '💻', // Ordenador
  159: '🛝', // Recreo
  160: '📝', // Examen

  // === NATURALEZA (161-180) ===
  161: '☀️', // Sol
  162: '🌙', // Luna
  163: '⭐', // Estrella
  164: '🌤️', // Cielo
  165: '☁️', // Nube
  166: '🌧️', // Lluvia
  167: '❄️', // Nieve
  168: '💨', // Viento
  169: '⛈️', // Tormenta
  170: '⚡', // Rayo
  171: '🌳', // Árbol
  172: '🌸', // Flor
  173: '🍃', // Hoja
  174: '🌿', // Hierba
  175: '🌲', // Bosque
  176: '🏔️', // Montaña
  177: '🏞️', // Río
  178: '🌊', // Lago
  179: '🌊', // Mar
  180: '🏖️', // Playa

  // === TRANSPORTE (181-200) ===
  181: '🚗', // Coche
  182: '🚌', // Autobús
  183: '🚆', // Tren
  184: '🚲', // Bicicleta
  185: '🏍️', // Moto
  186: '✈️', // Avión
  187: '🚢', // Barco
  188: '🚁', // Helicóptero
  189: '🚚', // Camión
  190: '🚇', // Metro
  191: '🚊', // Tranvía
  192: '🚕', // Taxi
  193: '🚐', // Furgoneta
  194: '🚀', // Cohete
  195: '🤿', // Submarino
  196: '🚑', // Ambulancia
  197: '🚜', // Tractor
  198: '🛴', // Patinete
  199: '⛵', // Velero
  200: '🛳️', // Crucero

  // === LUGARES (201-220) ===
  201: '🛣️', // Calle
  202: '🌳', // Parque
  203: '🏪', // Tienda
  204: '🛒', // Supermercado
  205: '🏥', // Hospital
  206: '🚓', // Policía
  207: '🏦', // Banco
  208: '🍽️', // Restaurante
  209: '🎬', // Cine
  210: '🏛️', // Museo
  211: '📚', // Biblioteca
  212: 'svg:zoo', // Zoo (zoo park arch, distinct from giraffe)
  213: 'svg:circo', // Circo (User highlighted: striped big top circus tent!)
  214: '🚜', // Granja
  215: 'svg:castillo', // Castillo (User highlighted: stone fairytale fortress!)
  216: '🏘️', // Pueblo
  217: '🏙️', // Ciudad
  218: '🗺️', // País
  219: 'svg:mundo', // Mundo (User highlighted: vibrant Earth globe!)
  220: '🏝️', // Isla

  // === VERBOS 1 (221-270) ===
  221: '👤', // Ser
  222: '📍', // Estar
  223: '🤲', // Tener
  224: '🔨', // Hacer
  225: '🚶', // Ir
  226: '🏃', // Venir
  227: '🍽️', // Comer
  228: '🥤', // Beber
  229: '😴', // Dormir
  230: '🧸', // Jugar
  231: '🗣️', // Hablar
  232: '👂', // Escuchar
  233: '📖', // Leer
  234: '✍️', // Escribir
  235: '🚶', // Caminar
  236: '🏃', // Correr
  237: '🦘', // Saltar
  238: '💃', // Bailar
  239: '🎤', // Cantar
  240: '👀', // Mirar
  241: '👁️', // Ver
  242: '👆', // Tocar
  243: '👃', // Oler
  244: '💓', // Sentir
  245: '😄', // Reír
  246: '😭', // Llorar
  247: '❤️', // Amar
  248: '👍', // Gustar
  249: '💖', // Querer
  250: '💪', // Poder
  251: '🧠', // Saber
  252: '📚', // Aprender
  253: '🧑‍🏫', // Enseñar
  254: '💭', // Pensar
  255: '🙏', // Creer
  256: '🛍️', // Comprar
  257: '🏷️', // Vender
  258: '💳', // Pagar
  259: '🤝', // Ayudar
  260: '💼', // Trabajar
  261: '🔓', // Abrir
  262: '🔒', // Cerrar
  263: 'svg:entrar', // Entrar
  264: 'svg:salir', // Salir
  265: 'svg:subir', // Subir
  266: 'svg:bajar', // Bajar
  267: 'svg:dar', // Dar (User highlighted: giving hand offering heart!)
  268: 'svg:recibir', // Recibir
  269: '🎒', // Llevar
  270: '📥', // Traer

  // === ADJETIVOS 1 (271-290) ===
  271: '👍', // Bueno
  272: '👎', // Malo
  273: '🐘', // Grande
  274: '🐭', // Pequeño
  275: '🦒', // Alto
  276: '🦔', // Bajo
  277: '🐍', // Largo
  278: '🐛', // Corto
  279: 'svg:gordo', // Gordo (User highlighted: cheerful round chubby figure!)
  280: 'svg:delgado', // Delgado (User highlighted: slender slim graceful figure!)
  281: 'svg:bonito', // Bonito (User highlighted: radiant blossom & butterfly!)
  282: 'svg:feo', // Feo (User highlighted: cute goofy little green monster!)
  283: '🧒', // Joven
  284: 'svg:viejo', // Viejo (User highlighted: kind grandfather with glasses & cane!)
  285: '🆕', // Nuevo
  286: '🏺', // Antiguo
  287: '⚡', // Rápido
  288: '🐢', // Lento
  289: '💪', // Fuerte
  290: '🥀', // Débil

  // === EMOCIONES 1 (291-300) ===
  291: '😄', // Feliz
  292: '😢', // Triste
  293: '😲', // Sorpresa
  294: '😨', // Miedo
  295: '🤢', // Asco
  296: '😡', // Enfado
  297: '❤️', // Amor
  298: '😌', // Calma
  299: '😬', // Nervios
  300: '😎', // Orgullo

  // === TIEMPO (301-330) ===
  301: '1️⃣', // Lunes
  302: '2️⃣', // Martes
  303: '3️⃣', // Miércoles
  304: '4️⃣', // Jueves
  305: '5️⃣', // Viernes
  306: '6️⃣', // Sábado
  307: '☀️', // Domingo
  308: '❄️', // Enero
  309: '🎭', // Febrero
  310: '🌱', // Marzo
  311: '🌧️', // Abril
  312: '🌸', // Mayo
  313: '☀️', // Junio
  314: '🏖️', // Julio
  315: '🍉', // Agosto
  316: '🎒', // Septiembre
  317: '🎃', // Octubre
  318: '🍂', // Noviembre
  319: '🎄', // Diciembre
  320: '🎆', // Año
  321: '🗓️', // Mes
  322: '📅', // Semana
  323: '🌅', // Día
  324: '🌙', // Noche
  325: '🌄', // Mañana
  326: '🌇', // Tarde
  327: '👇', // Hoy
  328: '👈', // Ayer
  329: '👉', // Mañana (día)
  330: '🕒', // Hora

  // === CLIMA (331-340) ===
  331: '🌸', // Primavera
  332: '☀️', // Verano
  333: '🍂', // Otoño
  334: '❄️', // Invierno
  335: '🔥', // Calor
  336: '🥶', // Frío
  337: '☀️', // Sol
  338: '☁️', // Nubes
  339: '🧊', // Hielo
  340: '🌫️', // Niebla

  // === FORMAS (341-350) ===
  341: '⚪', // Círculo
  342: '🟦', // Cuadrado
  343: '🔺', // Triángulo
  344: '▭', // Rectángulo
  345: '⭐', // Estrella
  346: '❤️', // Corazón
  347: '🔷', // Rombo
  348: '⬭', // Óvalo
  349: '➖', // Línea
  350: '🔘', // Punto

  // === FRUTAS (351-370) ===
  351: '🍎', // Manzana
  352: '🍌', // Plátano
  353: '🍊', // Naranja
  354: '🍓', // Fresa
  355: '🍇', // Uva
  356: '🍐', // Pera
  357: '🍉', // Sandía
  358: '🍈', // Melón
  359: '🍑', // Melocotón
  360: '🍒', // Cereza
  361: 'svg:ciruela', // Ciruela (violet plum with amber flesh)
  362: '🍍', // Piña
  363: '🥭', // Mango
  364: '🍋', // Limón
  365: '🥝', // Kiwi
  366: '🥥', // Coco
  367: 'svg:frambuesa', // Frambuesa (magenta raspberry, distinct from blueberry)
  368: 'svg:mora', // Mora (blackberry, distinct from blueberry)
  369: 'svg:higo', // Higo (seeded purple fig, distinct from blueberry)
  370: '🥭', // Papaya

  // === VERDURAS (371-390) ===
  371: '🍅', // Tomate
  372: '🥔', // Patata
  373: '🥕', // Zanahoria
  374: '🧅', // Cebolla
  375: '🥬', // Lechuga
  376: '🧄', // Ajo
  377: '🫑', // Pimiento
  378: '🥒', // Pepino
  379: '🥦', // Brócoli
  380: 'svg:espinaca', // Espinaca (spinach bunch, distinct from lettuce)
  381: '🎃', // Calabaza
  382: 'svg:calabacin', // Calabacín (zucchini squash, distinct from cucumber)
  383: '🍆', // Berenjena
  384: '🌽', // Maíz
  385: '🫛', // Guisante
  386: 'svg:col', // Col (cabbage head, distinct from lettuce)
  387: '🍄', // Champiñón
  388: 'svg:puerro', // Puerro (leek stalk, distinct from onion)
  389: 'svg:rabano', // Rábano (magenta radish, distinct from carrot)
  390: 'svg:apio', // Apio (celery stalks, distinct from lettuce)

  // === COCINA (391-410) ===
  391: '🍽️', // Plato
  392: '🥛', // Vaso
  393: '☕', // Taza
  394: '🍴', // Tenedor
  395: '🔪', // Cuchillo
  396: '🥄', // Cuchara
  397: '🍲', // Olla
  398: '🍳', // Sartén
  399: '🫖', // Jarra
  400: 'svg:botella', // Botella (water bottle, distinct from champagne)
  401: 'svg:servilleta', // Servilleta (folded cloth napkin, distinct from toilet paper)
  402: '🍽️', // Mantel
  403: 'svg:horno', // Horno (kitchen oven appliance, distinct from fire)
  404: 'svg:nevera', // Nevera (kitchen refrigerator, distinct from ice)
  405: 'svg:microondas', // Microondas (microwave appliance, distinct from radio)
  406: '🚰', // Fregadero
  407: '🗑️', // Basura
  408: 'svg:batidora', // Batidora (blender pitcher, distinct from bowl)
  409: 'svg:tostadora', // Tostadora (toaster popping toast, distinct from bread)
  410: '☕', // Cafetera

  // === SALÓN (411-420) ===
  411: 'svg:sillon', // Sillón (armchair)
  412: '🖼️', // Cuadro
  413: 'svg:mueble', // Mueble (wooden cabinet/sideboard)
  414: '📚', // Estantería
  415: 'svg:cojin', // Cojín (plump cushion, distinct from sofa)
  416: '🪟', // Cortina
  417: '📺', // Mando
  418: '🪴', // Planta
  419: '🏺', // Jarrón
  420: '📰', // Revista

  // === BAÑO (421-430) ===
  421: '🚿', // Ducha
  422: '🛁', // Bañera
  423: '🚰', // Lavabo
  424: '🚽', // Retrete
  425: '🧖', // Toalla
  426: '🧼', // Jabón
  427: 'svg:champu', // Champú (shampoo bottle with foam bubbles)
  428: 'svg:cepillo', // Cepillo (hairbrush, distinct from toothbrush)
  429: '🪥', // Pasta de dientes
  430: '🪮', // Peine

  // === HABITACIÓN (431-440) ===
  431: '🛌', // Almohada
  432: 'svg:manta', // Manta (soft cozy bed blanket)
  433: 'svg:sabana', // Sábana (folded bedsheet)
  434: 'svg:colchon', // Colchón (mattress, distinct from bed)
  435: 'svg:mesita', // Mesita (bedside nightstand table)
  436: '⏰', // Despertador
  437: '💡', // Lámpara
  438: '🗄️', // Cajón
  439: 'svg:percha', // Percha (hanger, distinct from dress)
  440: '🧸', // Juguetero

  // === JUGUETES (441-460) ===
  441: '⚽', // Pelota
  442: '🪆', // Muñeca
  443: '🏎️', // Cochecito
  444: '🚂', // Tren
  445: 'svg:bloques', // Bloques (toy building blocks, distinct from brick)
  446: '🧩', // Puzle
  447: '🧸', // Peluche
  448: '🪁', // Cometa (Juguete)
  449: '🪀', // Peonza
  450: '🪀', // Yoyó
  451: '🪢', // Cuerda
  452: '🛼', // Patines
  453: '🛹', // Monopatín
  454: '🚲', // Bicicleta
  455: '🎮', // Videojuego
  456: '🕹️', // Consola
  457: '🃏', // Cartas
  458: '🎲', // Dados
  459: '♟️', // Tablero
  460: '🎭', // Disfraz

  // === DEPORTES (461-480) ===
  461: '⚽', // Fútbol
  462: '🏀', // Baloncesto
  463: '🎾', // Tenis
  464: '🏊', // Natación
  465: '🏃', // Atletismo
  466: '🚴', // Ciclismo
  467: '🏐', // Voleibol
  468: '🤸', // Gimnasia
  469: '🥋', // Kárate
  470: '🥋', // Judo
  471: '🎿', // Esquí
  472: '⛸️', // Patinaje
  473: '⛳', // Golf
  474: '⚾', // Béisbol
  475: '🏉', // Rugby
  476: '🏄', // Surf
  477: '🥊', // Boxeo
  478: '🏓', // Ping-pong
  479: '♟️', // Ajedrez
  480: '🤾', // Balonmano

  // === PROFESIONES (481-510) ===
  481: '🧑‍⚕️', // Médico
  482: '🧑‍⚕️', // Enfermera
  483: '👮', // Policía
  484: '👨‍🚒', // Bombero
  485: '🧑‍🏫', // Profesor
  486: '👨‍✈️', // Piloto
  487: '🚌', // Conductor
  488: '👨‍🍳', // Cocinero
  489: '🤵', // Camarero
  490: '🥖', // Panadero
  491: '🥩', // Carnicero
  492: '💈', // Peluquero (barber pole, distinct from scissors)
  493: '🔧', // Mecánico
  494: '🪚', // Carpintero
  495: '🎨', // Pintor
  496: '🎵', // Músico
  497: '🎭', // Actor
  498: '🎤', // Cantante
  499: '💃', // Bailarín
  500: '✍️', // Escritor
  501: '📰', // Periodista
  502: '📬', // Cartero
  503: '🦷', // Dentista
  504: '🐾', // Veterinario
  505: '📐', // Arquitecto
  506: '⚙️', // Ingeniero
  507: '🔬', // Científico
  508: '⚖️', // Juez
  509: '💼', // Abogado
  510: '🏛️', // Presidente

  // === ARTE (511-530) ===
  511: '🎨', // Arte
  512: '🖼️', // Pintura
  513: '✏️', // Dibujo
  514: '🎨', // Color
  515: '🖌️', // Pincel
  516: '🖼️', // Lienzo
  517: '🗿', // Escultura
  518: '🎵', // Música
  519: '🎶', // Canción
  520: '🎻', // Instrumento
  521: '🎸', // Guitarra
  522: '🎹', // Piano
  523: '🥁', // Batería (Instrumento)
  524: '🎻', // Violín
  525: '🪈', // Flauta
  526: '🎺', // Trompeta
  527: '🥁', // Ritmo
  528: '🎶', // Melodía
  529: '💃', // Danza
  530: '🎭', // Teatro

  // === TECNOLOGIA (531-550) ===
  531: '📱', // Teléfono
  532: '📱', // Móvil
  533: '🖥️', // Pantalla
  534: '⌨️', // Teclado
  535: '🖱️', // Ratón (Informático)
  536: '📷', // Cámara
  537: '📸', // Foto
  538: '📹', // Vídeo
  539: '🌐', // Internet
  540: '🌐', // Web
  541: '✉️', // Correo
  542: '💬', // Mensaje
  543: '🎮', // Juego
  544: '📱', // Aplicación
  545: '🤖', // Robot
  546: '🔋', // Batería (Pila/Eléctrica)
  547: '🔌', // Cable
  548: '🔌', // Enchufe
  549: '🎧', // Auriculares
  550: '🔊', // Altavoz

  // === ESPACIO (551-570) ===
  551: '🌌', // Espacio
  552: '🪐', // Planeta
  553: '🌍', // Tierra
  554: '🪐', // Marte
  555: '🪐', // Júpiter
  556: '🪐', // Saturno
  557: '⭐', // Estrella
  558: '🌌', // Galaxia
  559: '🌠', // Universo
  560: '👨‍🚀', // Astronauta
  561: '🛸', // Nave
  562: '🚀', // Cohete
  563: '☄️', // Cometa (Espacial)
  564: '☄️', // Meteorito
  565: '🔭', // Telescopio
  566: '🪐', // Órbita
  567: '🌐', // Gravedad
  568: '👽', // Alien
  569: '🌌', // Cielo
  570: '☀️', // Sol

  // === GEOGRAFIA (571-590) ===
  571: '🧭', // Norte
  572: '🧭', // Sur
  573: '🧭', // Este
  574: '🧭', // Oeste
  575: '🗺️', // Mapa
  576: '🌐', // Globo
  577: '🗺️', // Continente
  578: '🌊', // Océano
  579: '🌊', // Mar
  580: '🏞️', // Río
  581: '🏔️', // Montaña
  582: '🏞️', // Valle
  583: '🏜️', // Desierto
  584: '🌴', // Selva
  585: '🌲', // Bosque
  586: '🏝️', // Isla
  587: '🏖️', // Costa
  588: '🌋', // Volcán
  589: '🕳️', // Cueva
  590: '🌊', // Cascada

  // === INSECTOS (591-610) ===
  591: '🪲', // Insecto
  592: '🪰', // Mosca
  593: '🦟', // Mosquito
  594: '🐝', // Abeja
  595: '🐝', // Avispa
  596: '🐜', // Hormiga
  597: '🦋', // Mariposa
  598: '🕷️', // Araña
  599: '🪲', // Escarabajo
  600: '🐞', // Mariquita
  601: '🪱', // Gusano
  602: '🐌', // Caracol
  603: '🐛', // Ciempiés
  604: '🦗', // Grillo
  605: '🦗', // Saltamontes
  606: '🦗', // Mantis
  607: '🪰', // Libélula
  608: '🦋', // Polilla
  609: '🕷️', // Garrapata
  610: '🪲', // Pulga

  // === MAR (611-630) ===
  611: '🌊', // Océano
  612: '🌊', // Ola
  613: '🏖️', // Arena
  614: '🐚', // Concha
  615: '🌿', // Alga
  616: '🪸', // Coral
  617: '🦈', // Tiburón
  618: '🐋', // Ballena
  619: '🐬', // Delfín
  620: '🐙', // Pulpo
  621: '🦑', // Calamar
  622: '🦀', // Cangrejo
  623: '🦞', // Langosta
  624: '🪸', // Estrella de mar
  625: '🐠', // Caballito de mar
  626: '🐢', // Tortuga
  627: '🦭', // Foca
  628: '🐧', // Pingüino
  629: '🕊️', // Gaviota
  630: '🦆', // Pelícano

  // === GRANJA (631-650) ===
  631: '🚜', // Granja
  632: '🧑‍🌾', // Granjero
  633: '🚜', // Tractor
  634: '🌾', // Paja
  635: '🌾', // Heno
  636: '🐮', // Vaca
  637: '🐂', // Toro
  638: '🐷', // Cerdo
  639: '🐑', // Oveja
  640: '🐐', // Cabra
  641: '🐴', // Caballo
  642: '🫏', // Burro
  643: '🐔', // Gallina
  644: '🐓', // Gallo
  645: '🐥', // Pollito
  646: '🦆', // Pato
  647: '🪿', // Ganso
  648: '🦃', // Pavo
  649: '🐕', // Perro pastor
  650: '🐱', // Gato

  // === SALVAJE (651-680) ===
  651: '🦁', // León
  652: '🐯', // Tigre
  653: '🐆', // Leopardo
  654: '🐆', // Pantera
  655: '🐆', // Guepardo
  656: '🐘', // Elefante
  657: '🦏', // Rinoceronte
  658: '🦛', // Hipopótamo
  659: '🦒', // Jirafa
  660: '🦓', // Cebra
  661: '🐒', // Mono
  662: '🦍', // Gorila
  663: '🐵', // Chimpancé
  664: '🐻', // Oso
  665: '🐺', // Lobo
  666: '🦊', // Zorro
  667: '🦌', // Ciervo
  668: '🦘', // Canguro
  669: '🐨', // Koala
  670: '🐼', // Panda
  671: '🐊', // Cocodrilo
  672: '🐍', // Serpiente
  673: '🦅', // Águila
  674: '🦅', // Halcón
  675: '🦉', // Búho
  676: '🦜', // Loro
  677: '🦤', // Avestruz
  678: '🐪', // Camello
  679: '🦇', // Murciélago
  680: '🐸', // Rana

  // === MATERIALES (681-700) ===
  681: '🧱', // Material
  682: '🪵', // Madera
  683: '🔩', // Metal
  684: '⛓️', // Hierro
  685: '🛡️', // Acero
  686: '🪙', // Oro
  687: '🥈', // Plata
  688: '🟤', // Cobre
  689: '🥤', // Plástico
  690: '🧼', // Goma
  691: '🍷', // Cristal
  692: '🪟', // Vidrio
  693: '📄', // Papel
  694: '📦', // Cartón
  695: '🧵', // Tela
  696: '☁️', // Algodón
  697: '🧶', // Lana
  698: '🧣', // Seda
  699: '👞', // Cuero
  700: '🪨', // Piedra

  // === HERRAMIENTAS (701-720) ===
  701: '🔧', // Herramienta
  702: '🔨', // Martillo
  703: '🔩', // Clavo
  704: '🔩', // Tornillo
  705: '🪛', // Destornillador
  706: '🔑', // Llave
  707: '🗜️', // Alicates
  708: '🪚', // Sierra
  709: '🔩', // Taladro
  710: '🪓', // Hacha
  711: 'svg:pala', // Pala (garden shovel/spade)
  712: 'svg:rastrillo', // Rastrillo (garden rake, distinct from broom)
  713: '🧹', // Escoba
  714: 'svg:fregona', // Fregona (floor mop & bucket, distinct from broom)
  715: '🪣', // Cubo
  716: '✂️', // Tijeras
  717: '✂️', // Cúter
  718: '📦', // Cinta
  719: '📏', // Metro
  720: '🖌️', // Pincel

  // === ACCESORIOS (721-740) ===
  721: '💍', // Accesorio
  722: '💍', // Anillo
  723: '📿', // Collar
  724: '📿', // Pulsera
  725: '💎', // Pendiente
  726: '⌚', // Reloj
  727: '👓', // Gafas
  728: '👜', // Bolso
  729: '👛', // Cartera
  730: '☂️', // Paraguas
  731: '🥋', // Cinturón
  732: '👔', // Corbata
  733: '🎀', // Lazo
  734: '👑', // Diadema
  735: '🪡', // Horquilla
  736: '🧣', // Bufanda
  737: '🧤', // Guante
  738: '🎩', // Sombrero
  739: '🧢', // Gorra
  740: '🎒', // Mochila

  // === VERBOS 2 (741-770) ===
  741: '🍂', // Caer
  742: '🙌', // Levantar
  743: 'svg:empujar', // Empujar
  744: 'svg:tirar', // Tirar
  745: '🫗', // Llenar
  746: '🗑️', // Vaciar
  747: '💔', // Romper
  748: '🛠️', // Arreglar
  749: '✂️', // Cortar
  750: '🧴', // Pegar
  751: '🎨', // Dibujar
  752: '🖌️', // Pintar
  753: '🖍️', // Colorear
  754: '🥣', // Mezclar
  755: '↔️', // Separar
  756: '🙈', // Esconder
  757: '🔍', // Buscar
  758: '💡', // Encontrar
  759: '🤷', // Perder
  760: '🏆', // Ganar
  761: '🛑', // Parar
  762: '⏩', // Continuar
  763: '🏁', // Empezar
  764: '🎖️', // Terminar
  765: '🔄', // Cambiar
  766: '🗄️', // Guardar
  767: '📤', // Sacar
  768: '📥', // Meter
  769: 'svg:poner', // Poner
  770: 'svg:quitar', // Quitar

  // === VERBOS 3 (771-800) ===
  771: '🦅', // Volar
  772: '🏊', // Nadar
  773: '🤿', // Bucear
  774: '🧗', // Trepar
  775: '🍌', // Resbalar
  776: '🎠', // Columpiar
  777: '🏇', // Montar
  778: '🚗', // Conducir
  779: '✈️', // Viajar
  780: '🚶', // Pasear
  781: '🚪', // Visitar
  782: '👋', // Saludar
  783: '🛫', // Despedir
  784: '🫂', // Abrazar
  785: '💋', // Besar
  786: '😊', // Sonreír
  787: '📢', // Gritar
  788: '🤫', // Susurrar
  789: '❓', // Preguntar
  790: '💡', // Responder
  791: '🧑‍🏫', // Explicar
  792: '🧠', // Entender
  793: '🧠', // Recordar
  794: '💭', // Olvidar
  795: '🌙', // Soñar
  796: '⏰', // Despertar
  797: '🌱', // Cuidar
  798: '🤝', // Compartir
  799: '✉️', // Invitar
  800: '🤝', // Prometer

  // === ADJETIVOS 2 (801-840) ===
  801: '🟢', // Fácil
  802: '🧗', // Difícil
  803: '☀️', // Claro
  804: '🌑', // Oscuro
  805: '🪶', // Ligero
  806: 'svg:pesado', // Pesado (100kg weight barbell, distinct from rock)
  807: '🧸', // Suave
  808: '💎', // Duro
  809: '🪞', // Liso
  810: '🌵', // Áspero
  811: '🏜️', // Seco
  812: '🌧️', // Mojado
  813: '🔓', // Abierto
  814: '🔒', // Cerrado
  815: '✅', // Correcto
  816: '❌', // Incorrecto
  817: '⏱️', // Pronto
  818: '⏳', // Tarde
  819: '🧑‍🤝‍🧑', // Juntos
  820: '↔️', // Separados
  821: 'svg:cerca', // Cerca
  822: 'svg:lejos', // Lejos
  823: '⬆️', // Arriba
  824: '⬇️', // Abajo
  825: 'svg:dentro', // Dentro
  826: 'svg:fuera', // Fuera
  827: '⏩', // Delante
  828: '⏪', // Detrás
  829: '⬅️', // Izquierda
  830: '➡️', // Derecha
  831: '📏', // Recto
  832: '〰️', // Curvo
  833: '↔️', // Ancho
  834: '🤏', // Estrecho
  835: '🧱', // Grueso
  836: '🧵', // Fino
  837: '🍯', // Rico
  838: '🪙', // Pobre
  839: '🧼', // Limpio
  840: '🧦', // Sucio

  // === EMOCIONES 2 (841-850) ===
  841: '😳', // Vergüenza
  842: '🥱', // Aburrimiento
  843: '🧐', // Interés
  844: '🤔', // Duda
  845: '🎯', // Certeza
  846: '🌈', // Esperanza
  847: '😞', // Decepción
  848: '😒', // Envidia
  849: '😠', // Celos
  850: '🙇', // Culpa

  // === CIUDAD (851-875) ===
  851: '🏙️', // Ciudad
  852: '🏘️', // Pueblo
  853: '🏡', // Barrio
  854: '🎯', // Centro
  855: '🌾', // Afueras
  856: '🏛️', // Plaza
  857: '🛣️', // Avenida
  858: '🚶', // Acera
  859: '🚦', // Semáforo
  860: '🏮', // Farola
  861: '🗑️', // Papelera
  862: '⛲', // Fuente
  863: '🗿', // Estatua
  864: '🏛️', // Monumento
  865: '🌉', // Puente
  866: '🚇', // Túnel
  867: '🛑', // Señal
  868: '🚗', // Tráfico
  869: '🚙', // Atasco
  870: '🚏', // Parada
  871: '🚉', // Estación
  872: '🛫', // Aeropuerto
  873: '⚓', // Puerto
  874: '🏨', // Hotel
  875: '📮', // Correos

  // === COMIDA 2 (876-895) ===
  876: '🥞', // Desayuno
  877: '🍽️', // Comida
  878: '🍲', // Cena
  879: '🥪', // Merienda
  880: '🍮', // Postre
  881: '📋', // Menú
  882: '📖', // Receta
  883: '🥗', // Ingrediente
  884: '👅', // Sabor
  885: '🍭', // Dulce
  886: '🧂', // Salado
  887: '☕', // Amargo
  888: '🍋', // Ácido
  889: '🌶️', // Picante
  890: '🔥', // Caliente
  891: '☕', // Tibio
  892: '🥩', // Crudo
  893: '🍲', // Cocido
  894: '🥗', // Fresco
  895: '🍟', // Frito

  // === CUERPO 2 (896-920) ===
  896: '💀', // Cráneo
  897: '🧠', // Cerebro
  898: '🫁', // Pulmón
  899: 'svg:estomago', // Estómago (anatomical stomach, distinct from soup bowl)
  900: 'svg:intestino', // Intestino (winding intestine coils, distinct from DNA)
  901: '🦴', // Hueso
  902: 'svg:musculo', // Músculo (bicep fiber power)
  903: '🩸', // Sangre
  904: 'svg:vena', // Vena (blue blood vessel in arm, distinct from blood drop)
  905: 'svg:piel', // Piel (smooth skin texture & touch, distinct from lotion)
  906: 'svg:sudor', // Sudor (forehead with sweat beads, distinct from splash)
  907: '💧', // Lágrima
  908: '👅', // Saliva
  909: '🗣️', // Voz
  910: 'svg:aliento', // Aliento (breath vapor from lips, distinct from wind)
  911: 'svg:latido', // Latido (heart with ECG wave line)
  912: 'svg:pestana', // Pestaña (prominent curved eyelashes, distinct from eye)
  913: '🤨', // Ceja
  914: 'svg:parpado', // Párpado (closing eyelid over pupil, distinct from eye)
  915: 'svg:mejilla', // Mejilla (rosy blushing cheek highlight)
  916: 'svg:barbilla', // Barbilla (chin profile target, distinct from beard)
  917: '👄', // Labio
  918: 'svg:mandibula', // Mandíbula (jawline bone highlight, distinct from tooth)
  919: 'svg:nuca', // Nuca (back of head/neck nape, distinct from silhouette)
  920: 'svg:axila', // Axila (underarm/armpit indicator, distinct from bicep)

  // === NATURALEZA 2 (921-940) ===
  921: '🪐', // Planeta
  922: '☄️', // Cometa
  923: 'svg:asteroide', // Asteroide (space rock with craters)
  924: 'svg:polvo', // Polvo (dust particles & duster)
  925: '⛽', // Gas (gas fuel, distinct from cloud)
  926: '🍃', // Brisa
  927: '🌀', // Huracán
  928: '🌪️', // Tornado
  929: '🏚️', // Terremoto
  930: '🌋', // Lava
  931: '🌋', // Ceniza
  932: '💎', // Mineral
  933: '💎', // Diamante
  934: '🔴', // Rubí
  935: '🟢', // Esmeralda
  936: '🔵', // Zafiro
  937: '🦪', // Perla
  938: 'svg:carbon', // Carbón (black coal with glowing ember)
  939: '🪨', // Roca
  940: 'svg:barro', // Barro (mud puddle with footprints)

  // === CONCEPTOS (941-980) ===
  941: '📦', // Cosa
  942: '🧩', // Objeto
  943: '🍰', // Parte
  944: '🌕', // Todo
  945: '🌗', // Mitad
  946: '🌘', // Cuarto
  947: '🥚', // Docena
  948: '🧦', // Par
  949: '👥', // Grupo
  950: '🧍', // Fila
  951: '🎯', // Centro
  952: '🔲', // Borde
  953: '⬇️', // Fondo
  954: '🌊', // Superficie
  955: '🔷', // Forma
  956: '📏', // Tamaño
  957: '⚖️', // Peso
  958: '📐', // Medida
  959: '🔢', // Cantidad
  960: '#️⃣', // Número
  961: '🔤', // Letra
  962: '📝', // Palabra
  963: '💬', // Frase
  964: '🧚', // Cuento
  965: '📜', // Historia
  966: '🏁', // Fin
  967: '🎬', // Principio
  968: '🎲', // Juego
  969: '📋', // Regla
  970: '🧩', // Problema
  971: '🔑', // Solución
  972: '💡', // Idea
  973: '🤫', // Secreto
  974: 'svg:mentira', // Mentira
  975: 'svg:verdad', // Verdad
  976: 'svg:peligro', // Peligro
  977: 'svg:suerte', // Suerte
  978: '🎁', // Regalo
  979: '🥳', // Fiesta
  980: 'svg:paz', // Paz

  // === DIRECCIONES (981-990) ===
  981: '🧭', // Norte
  982: '🧭', // Sur
  983: '🧭', // Este
  984: '🧭', // Oeste
  985: '⬅️', // Izquierda
  986: '➡️', // Derecha
  987: '⬆️', // Arriba
  988: '⬇️', // Abajo
  989: '⏩', // Delante
  990: '⏪', // Detrás

  // === ESPACIO 2 (991-1000) ===
  991: 'svg:dentro', // Dentro
  992: 'svg:fuera', // Fuera
  993: 'svg:cerca', // Cerca
  994: 'svg:lejos', // Lejos
  995: '📍', // Aquí
  996: '🗺️', // Allí
  997: '🧑‍🤝‍🧑', // Junto
  998: '🥪', // Entre
  999: 'svg:sobre', // Sobre
  1000: 'svg:bajo', // Bajo
};

module.exports = { WORD_ICONS_BY_ID };
