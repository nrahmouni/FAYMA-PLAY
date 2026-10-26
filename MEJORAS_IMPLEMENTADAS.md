# FAYMA PLAY — Colección arcade

## Experiencia actual

- Inicio y navegación renovados con una identidad FAYMA PLAY y un catálogo directo de ocho juegos.
- Las rondas comienzan directamente con el juego; las palabras se aprenden mediante los objetivos y objetos de cada partida.
- FAYMA RUSH, FAYMA BATTLE, FAYMA SLICE, Slingshot Adventure, Memory Quest, Sentence Builder, Bubble Popper y Word Dash están conectados al mismo registro de resultados, recompensas y progreso.
- El tratamiento visual utiliza perspectiva 2.5D con CSS y Canvas, sin motor WebGL externo.

## Campaña y progreso

- El mapa conserva sus niveles alternos por idioma, estados bloqueados/completados y controles táctiles.
- El progreso del mapa se guarda localmente bajo `fayma-play-world-progress`.
- Los ocho modos arcade también pueden iniciarse desde la selección directa; esas partidas libres no alteran el progreso de los nodos de campaña.

## Verificación

El chequeo TypeScript (`npm run lint`) y la compilación de producción (`npm run build`) se ejecutan correctamente. No se ha realizado una prueba automatizada de juego en navegador.

Consulta [MEJORAS_ARCADE_Y_GUIA.md](./MEJORAS_ARCADE_Y_GUIA.md) para ver controles y límites.
