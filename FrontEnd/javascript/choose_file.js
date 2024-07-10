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
    window.selectedFiles = paths; // Esto almacena los archivos seleccionados más recientes en una variable global.
    fileLists = fileLists.concat(paths); // Esto agrega los nuevos archivos a la lista acumulativa.
    console.log(fileLists);
    fileList.innerHTML = ""; // Limpiamos el contenido anterior del elemento de la lista.
    fileLists.forEach((filePath, index) => {
      const fileName = filePath.split(/[/\\]/).pop(); // Usa una expresión regular para dividir por cualquier tipo de barra
      fileList.innerHTML += `<li>Archivo ${index + 1}: ${fileName}</li>`; // Agregar a la lista en la UI.
    });
  });
});
