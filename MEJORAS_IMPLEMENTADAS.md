# FAYMA PLAY — mejoras de campaña y minijuegos

## Cambios incluidos

- Nuevo mapa vertical de aventuras con camino visual, niveles alternos, estado bloqueado/completado y botones táctiles.
- La campaña comienza con el primer nivel desbloqueado por idioma. Al superar un desafío con al menos un 60 % de aciertos, el nivel actual queda completado y se desbloquea el siguiente.
- El progreso de desbloqueo se conserva en `localStorage` bajo la clave `fayma-play-world-progress`.
- Se han añadido tres minijuegos conectados al selector dinámico:
  - `drive`: carrera de palabras con tres opciones/carriles.
  - `combat`: combate con barras de vida y opciones de traducción.
  - `fruit`: cortar fruta seleccionando la traducción correcta.
- Los nuevos juegos registran aciertos, errores, palabras vistas, tiempo y monedas a través de `onComplete`.
- Se han generado iconos PNG reales para PWA y Apple Touch Icon, sustituyendo las imágenes de 1×1 píxel del ZIP original.

## Archivos principales

- `src/store/gameStore.ts`
- `src/screens/WorldHub.tsx`
- `src/modals/InteractiveChallengeModal.tsx`
- `src/games/CombatGame.tsx`
- `src/games/DriveGame.tsx`
- `src/games/FruitNinjaGame.tsx`
- `public/pwa-192x192.png`
- `public/pwa-512x512.png`
- `public/pwa-maskable-512x512.png`
- `public/apple-touch-icon.png`

## Validación pendiente

No se ha podido completar la instalación de dependencias en este entorno. El comando `tsc --noEmit` se detuvo porque no están instaladas las dependencias del proyecto (`vite/client` y `vite-plugin-pwa/client`). Por tanto, **no se declara una compilación verificada**.

En un entorno con dependencias instaladas, ejecutar:

```bash
npm install
npm run lint
npm run build
```

## Límites conocidos

- El progreso de niveles se guarda localmente en este cambio; no se ha añadido sincronización de la campaña a Firestore.
- El mapa conserva la estructura existente de mundos por idioma para reducir el riesgo de una reescritura amplia. Los países se representan como destino principal por idioma.
- Las reglas actuales de Firestore para `/sessions` y sus resultados requieren una revisión de seguridad independiente antes de usar el juego con cuentas reales.
