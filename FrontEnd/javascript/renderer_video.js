var { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("get-video-list");

  ipcRenderer.on("global-video-reply", (event, fileList) => {
    var videoPath = fileList[1]; // Ruta del nuevo video
    var videoElement = document.getElementById("videoSource");
    var videoContainer = document.getElementById("mainVideo"); // Asegúrate de tener este ID en tu <video>
    videoElement.src = videoPath;
    videoContainer.load(); // Llama a load en el elemento video
    console.log(videoElement.src);
  });
});
