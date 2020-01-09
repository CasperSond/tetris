import createPlayingField from "./createPlayingField";
import { update, state } from "./state";
import tetrominoes from "./tetrominoes";
import { rotatedTetro } from "./rotate";

const azure = tetrominoes.orange;
console.log(azure);
const rotated = rotatedTetro(azure);
const again = rotatedTetro(rotated);
const again2 = rotatedTetro(again);
const again3 = rotatedTetro(again2);
console.log(rotated);
console.log(again);
console.log(again2);
console.log(again3);

createPlayingField();
