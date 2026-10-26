# FAYMA PLAY — paquete de mejora arcade

## Qué se ha cambiado en este paquete

### 1. FAYMA SLICE: juego de corte por gestos
Se ha sustituido la selección de una traducción en botones por una mecánica arcade de cortar objetos en un canvas:
- Frutas voladoras con palabras del idioma objetivo.
- Control por deslizamiento táctil o ratón.
- Bombas que se deben evitar.
- Puntuación, cuenta atrás de 45 segundos y dificultad que modifica el ritmo.
- La palabra asociada a cada fruta se registra al cortarla.
- Resultado enviado al flujo existente de la aplicación.

Es un prototipo jugable de mecánica arcade real; aún se puede ampliar con partículas, combos, sonidos y efectos de fruta partida.

### 2. DRIVE / FAYMA RUSH
Se conserva la carrera arcade ya presente en el proyecto: tres carriles, obstáculos, salto, fichas de vocabulario, puntuación y vidas. Los controles son teclado y botones táctiles.

### 3. Etiquetas de los mundos
Se han corregido las etiquetas de juegos en `src/store/gameStore.ts` para describir mejor la mecánica real cargada por cada mundo.

### 4. Reglas de Firestore
Se han endurecido las reglas de `/sessions`: la sesión debe incluir `ownerUid` igual al UID autenticado; las lecturas y modificaciones quedan limitadas a ese propietario y los resultados heredan esa comprobación.
**Importante:** el código de la aplicación no parece usar actualmente la colección `/sessions`. Si más adelante se añade esa funcionalidad, el código que cree una sesión debe escribir `ownerUid`. Revisa las reglas en Firebase Emulator antes de desplegarlas en producción.

## Archivos principales modificados
- `src/games/FruitNinjaGame.tsx`
- `src/store/gameStore.ts`
- `firestore.rules`

## Cómo probarlo en tu ordenador

Requiere una versión reciente de Node.js compatible con Vite 8.

```bash
npm install
npm run lint
npm run build
npm run dev
```

Abre la URL local que muestre Vite. En el menú de mundos, entra en un nivel que cargue `fruit` para probar FAYMA SLICE. Pulsa y desliza el ratón o el dedo sobre las frutas; evita las bombas.

## Validación
Este entorno no tiene `node_modules` instalado y no se ha ejecutado una compilación con dependencias. Por eso no afirmo que el build esté verificado. Ejecuta los comandos anteriores tras extraer el ZIP y corrige cualquier error que salga antes de subirlo al repositorio.

## Limitaciones pendientes
- FAYMA SLICE usa formas y texto dibujados en Canvas, no ilustraciones finales de frutas.
- No se ha migrado el proyecto entero a un motor como Phaser: se conserva React/Vite y el resto de minijuegos existentes.
- No se han implementado todavía la campaña de aventura, el combate de acción completo ni la física avanzada del tirachinas.
- No se ha hecho una prueba de juego automatizada en navegador.
