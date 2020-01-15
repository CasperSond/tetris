import { random } from "./helpers";
import { getCurrentPositionOfTetromino } from "./getCurrentPositionOfTetromino";
import { rotatedTetro } from "./rotate";
import tetrominoesForm from "./tetrominoes";

const gameState = {
  running: false,
  level: 3,
  nextTick: 0
};

export const mainState = [];

(function mainStateInit() {
  for (let i = 0; i < 20; i++) {
    mainState.push(new Array(10).fill(null));
  }
})();

export const liveTetrominoState = {
  topLeftRef: [0, 0],
  rotationState: 0,
  position: [],
  type: 0
};

export function startGame() {
  gameState.running = true;
  dropNewTetromino();
  clockState();
}

export function rotateTetromino() {
  const ref = liveTetrominoState.topLeftRef;
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

  renderTetrominoMove(liveTetrominoState.position);
}

export function moveTetromino([difX, difY]) {
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
      if (newCoor[1] < 20 && mainState[newCoor[1]][newCoor[0]] !== null) {
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
    const filled = checkFilledRows();
    console.log(filled);

    if (filled.length > 0) {
      filled.forEach(el => {
        mainState.splice(el, 1);
        mainState.unshift(new Array(10).fill(null));

        removeAndRow(el);
      });
    }

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

const field = document.getElementById("field");

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

function accessPosInDom([x, y], type) {
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
    el.style.background = colors[liveTetrominoState.type];
  }
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

  if (gameState.running) {
    clockState();
  }
}

function removeAndRow(index) {
  const row = field.children.item(index).remove();
  const rowElement = document.createElement("div");

  for (let j = 0; j < 10; j++) {
    const columnElement = document.createElement("div");
    rowElement.appendChild(columnElement);
  }
  field.prepend(rowElement);
}

function addToState({ position, type }) {
  position.forEach(([x, y]) => {
    mainState[y][x] = type;
  });
}

function isColliding(positions) {
  return positions.every(([x, y]) => {
    return mainState[y][x];
  });
}

function checkFilledRows() {
  return mainState.reduce((acc, row, index) => {
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