import allTetrominoes from "./tetrominoes";
import { rotatedTetro } from "./rotate";

export function getCurrentPositionOfTetromino(liveTetromino) {
  const tetromino = allTetrominoes[liveTetromino.type];
  const rotated = rotatedTetro(tetromino, liveTetromino.rotationState);

  return rotated.reduce((acc, rowArray, yOffSetIndex) => {
    const columnElements = rowArray.reduce((accColumns, el, xOffSetIndex) => {
      if (el === true) {
        const translatedPosition = [
          liveTetromino.topLeftRef[0] + xOffSetIndex,
          liveTetromino.topLeftRef[1] + yOffSetIndex
        ];
        accColumns.push(translatedPosition);
      }
      return accColumns;
    }, []);

    return acc.concat(columnElements);
  }, []);
}
