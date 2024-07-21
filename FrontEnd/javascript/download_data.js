var { ipcRenderer } = require("electron");
var fs = require("fs"); // Requerimos el módulo fs para guardar el archivo
const os = require("os"); // Requerimos el módulo os para obtener información del sistema operativo
const path = require("path"); // Módulo path para manejar rutas de archivos

document.getElementById("DownloadData").addEventListener("click", () => {
  ipcRenderer.send("get-global-csv");

  ipcRenderer.on("global-csv-reply", (event, dataCsv) => {
    console.log("La variable global es:", dataCsv);
    // Obtener la carpeta de descargas predeterminada del sistema
    const downloadsFolder = path.join(os.homedir(), "Downloads");
    let filePath = path.join(downloadsFolder, "Process_Data.csv"); // Ruta completa del archivo en la carpeta de descargas

    // Guardar el archivo en la ruta especificada
    fs.writeFile(filePath, dataCsv, (err) => {
      if (err) {
        alert("Error al guardar el archivo");
        return console.error(err);
      }
      alert("Archivo guardado con éxito en la carpeta de descargas!");
    });
    ipcRenderer.send("change-page", "index.html");
  });
});
