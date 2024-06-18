const { ipcRenderer } = require("electron");

document.getElementById("closeWindow").addEventListener("click", () => {
  ipcRenderer.send("close-me");
});
