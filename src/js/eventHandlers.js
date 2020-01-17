import {
  startGame,
  pauseGame,
  moveTetromino,
  rotateTetromino
} from "./gameState";

export function initEventHandlers() {
  document.addEventListener("keydown", e => {
    if ([37, 39].indexOf(e.which) > -1) {
      const move = e.which === 37 ? [-1, 0] : [1, 0];
      moveTetromino(move);
    } else if (e.which === 38) {
      rotateTetromino();
    } else if (e.which === 40) {
      moveTetromino([0, 1]);
    }
  });

  const start = document.getElementById("startGame");
  const pause = document.getElementById("pauseGame");

  start.addEventListener("click", startGame);
  pause.addEventListener("click", pauseGame);
}
