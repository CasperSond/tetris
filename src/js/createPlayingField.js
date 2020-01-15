export default () => {
  const field = document.getElementById("field");

  for (let i = 0; i < 20; i++) {
    const rowElement = document.createElement("div");
    field.appendChild(rowElement);

    for (let j = 0; j < 10; j++) {
      const columnElement = document.createElement("div");
      rowElement.appendChild(columnElement);
    }
  }
};
