import tetrominoes from "./tetrominoes";

function crossAxis(arr, index) {
  return arr.map(el => el[index]);
}

function setCrossAxis(mutateArr, newValArr, setIndex) {
  newValArr.forEach((el, index) => {
    mutateArr[index][setIndex] = el;
  });

  return mutateArr;
}

export default matrix => {
  const len = matrix.length;

  const row = new Array(len).fill(null);
  const rotated = new Array(len).fill(row);

  let layer = len;

  const a = "A";

  while (layer > 2) {
    rotated[len - layer] = crossAxis(arr, len - layer);
    setCrossAxis(rotated, matrix[1].slice(), layer - 1);

    layer--;
  }

  return rotated;
};
