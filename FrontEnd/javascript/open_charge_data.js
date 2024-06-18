var { ipcRenderer } = require("electron");

document.getElementById("openWindow").addEventListener("click", () => {
  ipcRenderer.send("open-data-window");
});
