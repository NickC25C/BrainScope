var { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const openFileBtn = document.getElementById("openFileBtn");
  openFileBtn.addEventListener("click", () => {
    ipcRenderer.send("open-file-dialog");
  });

  ipcRenderer.on("selected-file", (event, paths) => {
    console.log("Archivos Seleccionados:", paths);
  });
});
