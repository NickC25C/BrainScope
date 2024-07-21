var { ipcRenderer } = require("electron");

var files = [];

window.addEventListener("DOMContentLoaded", () => {
  const openFileBtn = document.getElementById("openFileBtn");
  const fileList = document.getElementById("fileList"); // Asegúrate de tener este elemento en tu HTML

  openFileBtn.addEventListener("click", () => {
    ipcRenderer.send("open-file-dialog");
  });

  document.getElementById("changeToProcess").addEventListener("click", () => {
    ipcRenderer.send("change-page", "pages/procesar_datos.html");
    ipcRenderer.send("add-to-fileProcess", files);
    files = [];
  });

  ipcRenderer.on("prueba", (event, newFiles) => {
    console.log("holaaaaa");
  });

  document.getElementById("changeToProcess").addEventListener("click", () => {
    ipcRenderer.send("close-me");
  });

  ipcRenderer.on("selected-file", (event, paths) => {
    console.log("Archivos Seleccionados:", paths);
    files = files.concat(paths);
    const { csvCount } = countFileTypes(files);

    if (csvCount > 1) {
      errorMessage.textContent = "Error: Máximo 1 archivo CSV permitido.";
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

    console.log(files);
  });
});

function progressBar(files) {
  if (files.length == 0) {
    updateProgressBar(0);
  } else if (files.length == 1) {
    updateProgressBar(100);
  }
}

function countFileTypes(files) {
  let csvCount = 0;

  files.forEach((file) => {
    const extension = file.split(".").pop().toLowerCase(); // Obtener la extensión del archivo
    if (extension === "csv") {
      csvCount++;
    }
  });

  return { csvCount };
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
