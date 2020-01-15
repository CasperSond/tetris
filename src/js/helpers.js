export function random(from, to) {
  const range = Math.floor(Math.random() * (to - from + 1));
  return range + from;
}
