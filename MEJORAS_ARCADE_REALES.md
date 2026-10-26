# FAYMA PLAY — Arcade gameplay update

## Included in this update
- `src/games/CombatGame.tsx`: real-time arena prototype with movement, attack, dodge, approaching enemies, health, boss spawn, and vocabulary scroll pickups.
- `src/games/FruitNinjaGame.tsx`: real swipe-to-slice canvas gameplay on touch or mouse, fruit labels, bombs, score, timer, and vocabulary callbacks.

## Controls
### Combat
- Keyboard: WASD or arrow keys to move; Space/J to attack; Shift to dodge.
- Mobile: use the on-screen directional, attack, and dodge buttons.

### Fruit Slice
- Swipe across fruit with a finger or mouse. Avoid bombs.
- Five missed fruits or 45 seconds ends the round.

## Install and verify
Use the project's package manager. With npm:
```bash
npm install --legacy-peer-deps
npm run build
```

The ZIP contains the project source at the archive root under `FAYMA-PLAY-main/`. It does not include `node_modules`, `.git`, `dist`, or another copy of the ZIP.

## Scope / transparency
This update implements playable action mechanics for Combat and Fruit Slice. Other existing games are preserved and have not all been rewritten into full arcade games in this update. Build verification must be run in Codespaces because this packaging environment does not have the project's dependencies installed.
