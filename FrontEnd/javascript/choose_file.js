var { ipcRenderer } = require("electron");

var files = [];

window.addEventListener("DOMContentLoaded", () => {
  const openFileBtn = document.getElementById("openFileBtn");
  const fileList = document.getElementById("fileList"); // Asegúrate de tener este elemento en tu HTML

  openFileBtn.addEventListener("click", () => {
    ipcRenderer.send("open-file-dialog");
  });

  document.getElementById("changeToVision").addEventListener("click", () => {
    ipcRenderer.send("change-page", "pages/visualizar_page.html");
    ipcRenderer.send("add-to-fileLists", files);
    files = [];
  });

  ipcRenderer.on("prueba", (event, newFiles) => {
    console.log("holaaaaa");
  });

  document.getElementById("changeToVision").addEventListener("click", () => {
    ipcRenderer.send("close-me");
  });

  ipcRenderer.on("selected-file", (event, paths) => {
    console.log("Archivos Seleccionados:", paths);
    files = files.concat(paths);
    const { csvCount, mp4Count } = countFileTypes(files);

    if (csvCount > 2 || mp4Count > 1) {
      errorMessage.textContent =
        "Error: Máximo 2 archivos CSV y 1 archivo MP4 permitidos.";
      files.pop();
      return; // Detener el proceso si la validación falla
    }
    progressBar(files);
    errorMessage.textContent = ""; // Limpiar mensajes de error previos
    window.selectedFiles = paths; // Esto almacena los archivos seleccionados más recientes en una variable global.
    // Esto agrega los nuevos archivos a la lista acumulativa.
    console.log(files);
    fileList.innerHTML = ""; // Limpiamos el contenido anterior del elemento de la lista.
    files.forEach((filePath, index) => {
      const fileName = filePath.split(/[/\\]/).pop(); // Usa una expresión regular para dividir por cualquier tipo de barra
      fileList.innerHTML += `<li>Archivo ${index + 1}: ${fileName}</li>`; // Agregar a la lista en la UI.
    });
  });
});

function progressBar(files) {
  if (files.length == 0) {
    updateProgressBar(0);
  } else if (files.length == 1) {
    updateProgressBar(33);
  } else if (files.length == 2) {
    updateProgressBar(66);
  } else {
    updateProgressBar(100);
  }
}

function countFileTypes(files) {
  let csvCount = 0;
  let mp4Count = 0;

  files.forEach((file) => {
    const extension = file.split(".").pop().toLowerCase(); // Obtener la extensión del archivo
    if (extension === "csv") {
      csvCount++;
    } else if (extension === "mp4") {
      mp4Count++;
    }
  });

  return { csvCount, mp4Count };
}

function updateProgressBar(targetPercentage) {
  const progressBar = document.getElementById("progressbar");
  let currentPercentage = parseInt(progressBar.style.width, 10) || 0; // Inicializa en 0 si no hay valor

  function animateProgress() {
    if (currentPercentage < targetPercentage) {
      currentPercentage++;
      progressBar.style.width = currentPercentage + "%";
      progressBar.textContent = currentPercentage + "%";
      setTimeout(animateProgress, 20); // Ajusta la velocidad de la animación cambiando el tiempo de espera
    }
  }

  animateProgress();
}
