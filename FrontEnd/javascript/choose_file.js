var { ipcRenderer } = require("electron");

var fileLists = [];

window.addEventListener("DOMContentLoaded", () => {
  const openFileBtn = document.getElementById("openFileBtn");
  const fileList = document.getElementById("fileList"); // Asegúrate de tener este elemento en tu HTML

  openFileBtn.addEventListener("click", () => {
    ipcRenderer.send("open-file-dialog");
  });

  ipcRenderer.on("selected-file", (event, paths) => {
    console.log("Archivos Seleccionados:", paths);
    fileLists = fileLists.concat(paths);
    const { csvCount, mp4Count } = countFileTypes(fileLists);

    if (csvCount > 2 || mp4Count > 1) {
      errorMessage.textContent =
        "Error: Máximo 2 archivos CSV y 1 archivo MP4 permitidos.";
      fileLists.pop();
      return; // Detener el proceso si la validación falla
    }
    errorMessage.textContent = ""; // Limpiar mensajes de error previos
    window.selectedFiles = paths; // Esto almacena los archivos seleccionados más recientes en una variable global.
    // Esto agrega los nuevos archivos a la lista acumulativa.
    console.log(fileLists);
    fileList.innerHTML = ""; // Limpiamos el contenido anterior del elemento de la lista.
    fileLists.forEach((filePath, index) => {
      const fileName = filePath.split(/[/\\]/).pop(); // Usa una expresión regular para dividir por cualquier tipo de barra
      fileList.innerHTML += `<li>Archivo ${index + 1}: ${fileName}</li>`; // Agregar a la lista en la UI.
    });
  });
});

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
