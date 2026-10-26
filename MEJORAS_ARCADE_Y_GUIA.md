# FAYMA PLAY — Arcade y aprendizaje integrado

## Experiencia

- El inicio se ha rediseñado como un hub arcade de FAYMA PLAY, con selección de idioma, perfil, garaje y entrada al catálogo.
- Los ocho juegos se pueden iniciar desde tarjetas dedicadas en el hub de mundos.
- La campaña tiene ocho niveles por idioma, uno por cada juego; superar un nivel desbloquea el siguiente y cada nivel fija la dificultad mínima correspondiente.
- Cada turno empieza directamente en el juego. Se eliminó la pantalla de aprendizaje obligatoria previa: el vocabulario se encuentra durante la partida.
- Cada turno conserva sus palabras y dificultad durante toda la partida; la dificultad adaptativa solo cambia al terminar. Se seleccionan hasta seis palabras, priorizando vocabulario nuevo y de repaso.
- El dominio de vocabulario se registra por palabra, no por cada objeto repetido. Los golpes y fallos de habilidad no se contabilizan como errores de idioma; las respuestas de memoria y construcción de frases sí.
- Se añadieron profundidad, perspectiva 2.5D y una escena arcade en CSS/Canvas, manteniendo el proyecto sin un motor 3D externo.

## Juegos y controles

| Juego | Mecánica principal | Aprendizaje integrado |
| --- | --- | --- |
| FAYMA RUSH | Carrera de tres carriles, saltos, choques, turbo y combos en tres tramos. Teclado, botones o deslizamiento. | Recoge palabras durante la carrera. |
| FAYMA BATTLE | Arena de acción con movimiento libre, ataque, esquiva, enemigos, jefe y arena con perspectiva. WASD/flechas, Espacio/J y Mayús; controles táctiles. | Pergaminos de vocabulario en la arena. |
| FAYMA SLICE | Cortes por gesto, bombas, frutas perdidas, cinco niveles y multiplicadores de combo. Ratón o pantalla táctil. | Cada fruta muestra una palabra y su traducción aparece al cortarla. |
| Slingshot Adventure | Tirachinas con velocidad, gravedad, trayectoria visible, obstáculos destructibles y cajas objetivo. Arrastrar y soltar; flechas y Espacio. | Derriba cajas con palabras. |
| Memory Quest | Memoria de parejas, rachas, puntuación y dificultad adaptativa. El tamaño de tablero se ajusta al vocabulario disponible. Ratón o pantalla táctil. | Asocia escritura, imagen, pronunciación y traducción. |
| Sentence Builder | Repara mensajes para abrir portales; organiza fragmentos para formar frases. Ratón o pantalla táctil. | Gramática y vocabulario en frases. |
| Bubble Popper | Dispara, combina tres o más burbujas del mismo color, crea reacciones en cadena y evita que el tablero llegue al fondo. Ratón, pantalla táctil o teclado. | Las burbujas llevan palabras que se aprenden al despejar grupos. |
| Drive Challenge | Conducción lateral con saltos, tráfico, monedas y curso de longitud fija. Espacio, flecha arriba, W, botón o toque. | Recoge palabras durante el recorrido. |

## Ejecutar y validar

Requiere una versión de Node.js compatible con Vite 8.

```bash
npm install
npm run lint
npm run build
npm run dev
```

La compilación y el chequeo TypeScript se ejecutaron correctamente. Vite puede advertir sobre el uso de `__dirname` en la configuración y sobre el tamaño del bundle principal; no impiden la compilación.

## Alcance y límites

- Las escenas usan Canvas 2D, perspectiva 2.5D y transformaciones CSS; no incorporan modelos 3D ni un motor WebGL.
- No se realizó una prueba automatizada de controles en navegador.
- Las reglas de Firestore para `/sessions` requieren que las sesiones incluyan `ownerUid` igual al UID autenticado. El código actual no parece usar esa colección; antes de adoptarla, verifica las reglas con Firebase Emulator.
