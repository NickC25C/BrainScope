var { ipcRenderer } = require("electron");

document.getElementById("changeToVision").addEventListener("click", () => {
  ipcRenderer.send("change-page", "pages/visualizar_page.html");
});

document.getElementById("changeToVision").addEventListener("click", () => {
  ipcRenderer.send("close-me");
});
