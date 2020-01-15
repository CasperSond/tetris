export function rotatedTetro(matrix, rotateNumber = 0) {
  if (rotateNumber === 0) return matrix;

  rotateNumber = rotateNumber % 4;

  const len = matrix.length;
  const layers = Math.floor(len / 2);
  const rotated = [];

  if (len % 2 === 1) {
    const center = matrix[layers][layers];
    rotated.push([center]);
  }

  for (let i = layers - 1; i >= 0; i--) {
    const layer = getLayer(matrix, i);
    const layerLen = layer.length;
    const layerLength = layerLen / 4 + 1;
    const shift = layerLength - 1;
    const shiftedArray = shiftArray(layer, shift * rotateNumber);

    insertLayer(shiftedArray, rotated);
  }

  return rotated;
}

function getLayer(matrix, n) {
  const len = matrix.length;
  const items = len - n * 2;
  const endItem = n + items - 1;
  const arr = [];
  for (let i = n; i < items + n; i++) {
    arr.push(matrix[n][i]);
  }

  for (let i = n + 1; i <= endItem; i++) {
    arr.push(matrix[i][endItem]);
  }

  for (let i = endItem - 1; i > n; i--) {
    arr.push(matrix[endItem][i]);
  }

  for (let i = endItem; i > n; i--) {
    arr.push(matrix[i][n]);
  }

  return arr;
}

function shiftArray(arr, shift) {
  const copy = arr.slice();

  const n = shift >= 0 ? copy.length - shift : shift * -1;
  const removed = copy.splice(0, n);

  return copy.concat(removed);
}

function insertLayer(layer, matrix) {
  const len = layer.length;
  const layerLength = len / 4 + 1;
  const middle = Math.max(0, layerLength - 2);
  const bottomLayerStart = layerLength + middle;

  matrix.unshift(layer.slice(0, layerLength));
  matrix.push(
    layer.slice(bottomLayerStart, bottomLayerStart + layerLength).reverse()
  );

  for (let i = 0; i < middle; i++) {
    matrix[i + 1].push(layer[layerLength + i]);
    matrix[i + 1].unshift(layer[len - (i + 1)]);
  }
}
