export default () => {
  const field = document.getElementById("field");

  for (let i = 0; i < 220; i++) {
    const element = document.createElement("div");
    element.setAttribute("id", `id_${i}`);
    field.appendChild(element);
  }
};
