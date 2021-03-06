const field = document.getElementById("field");
const points = document.getElementById("points");
const lines = document.getElementById("lines");
const level = document.getElementById("level");
const refButtonPause = document.getElementById("pauseGame");
const startGameBtn = document.getElementById("startGame");
const gameover = document.getElementById("gameover");
const choice = document.getElementById("choice");
const block = document.getElementById("block");
const confirm = document.getElementById("confirm");

export function accessPosInDom([x, y], type) {
  const row = field.children.item(y);
  const el = row.children.item(x);

  if (type === -1) {
    el.style.background = "black";
  } else {
    const colors = [
      "rgb(97,197,235)",
      "rgb(91, 102, 168)",
      "rgb(225, 127, 58)",
      "rgb(242, 211, 73)",
      "rgb(101, 179, 82)",
      "rgb(221, 58, 53)",
      "rgb(161, 84, 153)"
    ];
    el.style.background = colors[type];
  }
}

export function renderNewGameState(gameState) {
  points.innerText = gameState.points;
  lines.innerText = gameState.lines;
  level.innerText = gameState.level;

  const gs = gameState.gameover ? "block" : "none";

  gameover.style.display = gs;
}

export function renderButton(gameState) {
  if (gameState.play) {
    const text = gameState.running ? "pause" : "resume";
    refButtonPause.innerText = text;
    refButtonPause.style.display = "block";
    startGameBtn.innerText = "restart";
  } else {
    refButtonPause.style.display = "none";
    startGameBtn.innerText = "start";
  }
}

export function removeAndRow(index) {
  const row = field.children.item(index).remove();
  const rowElement = document.createElement("div");

  for (let j = 0; j < 10; j++) {
    const columnElement = document.createElement("div");
    rowElement.appendChild(columnElement);
  }
  field.prepend(rowElement);
}

export function renderMenuPlayMode(UIState) {
  const mode = UIState.showGameMode ? "block" : "none";
  choice.style.display = mode;
}

export function renderConfirmDialog(UIState) {
  const mode = UIState.confirmDialog ? "block" : "none";

  confirm.style.display = mode;
}

export function renderNewGameMode(gameState) {
  block.classList.remove("rotate", "roll");

  if (gameState.type !== "regular") {
    block.classList.add(gameState.type);
  }
}
