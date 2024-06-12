var { ipcRenderer } = require("electron");

document.getElementById("changeToProcessData").addEventListener("click", () => {
  ipcRenderer.send("change-page", "pages/procesar_datos.html");
});
