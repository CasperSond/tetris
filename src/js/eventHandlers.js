import {
  startGame,
  pauseGame,
  moveTetromino,
  rotateTetromino,
  upperBtn,
  confirm
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
  const choices = document.getElementById("choice");
  const confirmdialog = document.getElementById("confirm");

  choices.addEventListener("click", e => {
    const id = e.target.id;
    startGame(id);
  });

  confirmdialog.addEventListener("click", e => {
    const id = e.target.id;
    confirm(id);
  });

  start.addEventListener("click", upperBtn);
  pause.addEventListener("click", pauseGame);
}
