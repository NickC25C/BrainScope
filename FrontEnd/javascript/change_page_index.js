var { ipcRenderer } = require("electron");

document.getElementById("changeToIndex").addEventListener("click", () => {
  ipcRenderer.send("change-page", "index.html");
});
