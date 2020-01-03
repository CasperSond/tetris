const column = new Array(10).fill(null);
export let state = new Array(22).fill(column.slice());

const map = {
  azure: "azure",
  yellow: "yellow",
  blue: "blue",
  orange: "orange",
  green: "green",
  red: "red"
};

function updateView(id, key) {
  const block = document.getElementById(`id_${id}`);
  block.style.background = map[key];
}

export function update(newState) {
  for (let i = 0; i < 220; i++) {
    const row = Math.floor(i / 22);
    const column = i % 10;
    const newValue = newState[row][column];

    if (newValue !== state[row][column]) {
      updateView(i, newValue);
    }
  }

  state = newState;
}
