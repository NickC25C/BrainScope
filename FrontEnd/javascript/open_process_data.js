var { ipcRenderer } = require("electron");

document.getElementById("openProcess").addEventListener("click", () => {
  ipcRenderer.send("open-process-window");
});
