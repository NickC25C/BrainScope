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

    let baseFileName = "Process_Data";
    let fileExtension = ".csv";
    let filePath = path.join(downloadsFolder, baseFileName + fileExtension);
    let counter = 1;

    // Comprobar si el archivo existe y ajustar el nombre si es necesario
    while (fs.existsSync(filePath)) {
      filePath = path.join(
        downloadsFolder,
        `${baseFileName}(${counter})${fileExtension}`
      );
      counter++;
    }

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
