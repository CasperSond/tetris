import { random } from "./helpers";
import { getCurrentPositionOfTetromino } from "./getCurrentPositionOfTetromino";
import clearPlayingField from "./createPlayingField";
import {
  accessPosInDom,
  renderNewGameState,
  renderButton,
  removeAndRow,
  renderMenuPlayMode,
  renderNewGameMode,
  renderConfirmDialog
} from "./renderState";

// --- GAME STATE SINGLETON objects -----
export const gameState = {};
export const liveTetrominoState = {};
export const UIState = {
  showGameMode: false,
  confirmDialog: false
};
// -------------------------------------- //

export function confirm(action) {
  UIState.confirmDialog = false;

  renderConfirmDialog(UIState);
  if (action === "yes") {
    UIState.showGameMode = true;
    renderMenuPlayMode(UIState);
  } else {
    gameState.running = true;
    clockState();
  }
}

export function upperBtn(e) {
  e.target.blur();

  if (gameState.running) {
    UIState.confirmDialog = true;
    gameState.running = false;
    renderConfirmDialog(UIState);
  } else {
    UIState.showGameMode = true;
    renderMenuPlayMode(UIState);
  }
}

export function startGame(type) {
  gameState.running = gameState.play = true;
  gameState.gameover = false;
  gameState.level = 1;
  UIState.showGameMode = false;
  UIState.confirmDialog = false;
  gameState.type = type;
  gameState.points = 0;
  gameState.lines = 0;
  gameState.nextTick = performance.now() + 1000;
  gameState.state = emptyState();

  renderNewGameState(gameState); // IU state
  renderButton(gameState); // IU state
  renderNewGameMode(gameState); // IU state
  renderMenuPlayMode(UIState); // IU state
  renderConfirmDialog(UIState);

  clearPlayingField(); // Dom manipulation
  clockState(); // timer init
  dropNewTetromino(); // drop ...
}

function emptyState() {
  const arr = [];
  for (let i = 0; i < 20; i++) {
    arr.push(new Array(10).fill(null));
  }

  return arr;
}

export function rotateTetromino() {
  if (!gameState.running) return;
  const oldPosition = liveTetrominoState.position.slice();
  let position = getCurrentPositionOfTetromino({
    ...liveTetrominoState,
    ...{ rotationState: (liveTetrominoState.rotationState + 1) % 4 }
  });

  // if outside try move in
  // check collision (and then try to move it + or - 1 - 2 ... offset it ... )

  const offset = needToOffSet(position);

  if (offset !== 0) {
    position = position.map(([x, y]) => {
      return [x + offset, y];
    });
  }

  const colliding = isColliding(position);

  if (!colliding) {
    liveTetrominoState.rotationState = ++liveTetrominoState.rotationState;
    liveTetrominoState.position = position;
    gameState.nextTick += 200;

    renderTetrominoMove(position, oldPosition);
  }
}

export function dropNewTetromino() {
  gameState.nextTick = performance.now() + 1000 / gameState.level;
  gameState.running = true;

  liveTetrominoState.type = random(0, 6);
  liveTetrominoState.topLeftRef = [3, 0];
  liveTetrominoState.rotationState = 0;
  liveTetrominoState.position = getCurrentPositionOfTetromino(
    liveTetrominoState
  );

  if (isColliding(liveTetrominoState.position)) {
    gameover();
  }
  renderTetrominoMove(liveTetrominoState.position);
}

export function moveTetromino([difX, difY]) {
  if (!gameState.running) return;

  let legit = true;
  let reachedBottom = false;
  let collision = false;

  const newPosition = liveTetrominoState.position.map(([xPos, yPos]) => {
    const newCoor = [xPos + difX, yPos + difY];

    if (newCoor[0] < 0 || newCoor[0] > 9) {
      // tetromino at edge attempting to move outside
      legit = false;
    } else {
      // a legit move
      if (newCoor[1] < 20 && gameState.state[newCoor[1]][newCoor[0]] !== null) {
        // collision happens

        if (difY !== 0) {
          // move down

          collision = true;
        } else {
          // move left or right
          legit = false;
        }
      }
    }
    if (newCoor[1] > 19) {
      legit = false;
      reachedBottom = true;
    }

    return newCoor;
  });

  if (reachedBottom || collision) {
    addToState(liveTetrominoState);
    const filled = getFullRows();
    gameState.points = gameState.points + gameState.level * 15;

    if (filled.length > 0) {
      filled.forEach(el => {
        gameState.state.splice(el, 1);
        gameState.state.unshift(new Array(10).fill(null));
        gameState.points =
          gameState.points + gameState.level * filled.length * 100;
        gameState.lines = gameState.lines + filled.length;

        removeAndRow(el);
      });
    }

    gameState.level = Math.floor(gameState.lines / 10) + 1;

    renderNewGameState(gameState);
    dropNewTetromino();
  }

  if (legit && !collision) {
    const oldPosition = liveTetrominoState.position.slice();
    liveTetrominoState.position = newPosition;

    const [xRef, yRef] = liveTetrominoState.topLeftRef;
    liveTetrominoState.topLeftRef = [xRef + difX, yRef + difY];
    renderTetrominoMove(newPosition, oldPosition);

    if (difX !== 0) {
      gameState.nextTick += 50;
    }
  }
}

function needToOffSet(positions) {
  const highest = positions.reduce((acc, [x, y]) => {
    return Math.max(x, acc);
  }, 0);

  if (highest > 9) return 9 - highest;

  const lowest = positions.reduce((acc, [x, y]) => {
    return Math.min(x, acc);
  }, 10);

  if (lowest < 0) return lowest * -1;

  return 0;
}

function gameover() {
  gameState.running = gameState.play = false;
  gameState.gameover = true;
  renderNewGameState(gameState);
}

function renderTetrominoMove(newPos, removeOld) {
  if (removeOld) {
    removeOld.forEach(el => {
      accessPosInDom(el, -1);
    });
  }
  newPos.forEach(el => {
    accessPosInDom(el, liveTetrominoState.type);
  });
}

export function pauseGame() {
  // set time to next tick
  gameState.running = !gameState.running;
  renderButton(gameState);

  if (gameState.running) {
    clockState();
  }
}

function addToState({ position, type }) {
  position.forEach(([x, y]) => {
    gameState.state[y][x] = type;
  });
}

function isColliding(positions) {
  return positions.some(([x, y]) => {
    return gameState.state[y][x];
  });
}

function getFullRows() {
  return gameState.state.reduce((acc, row, index) => {
    const rowFull = row.every(el => {
      return el !== null;
    });

    if (rowFull) {
      acc.push(index);
    }

    return acc;
  }, []);
}

function clockState() {
  if (performance.now() >= gameState.nextTick) {
    moveTetromino([0, 1]);
    gameState.nextTick = performance.now() + 1000 / gameState.level;
  }

  if (gameState.running) {
    requestAnimationFrame(clockState);
  }
}
