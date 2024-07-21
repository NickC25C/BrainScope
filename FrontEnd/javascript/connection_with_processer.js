var fs = require("fs");
const { spawn } = require("child_process");
var { ipcRenderer } = require("electron");

// Función para convertir JSON a CSV
function jsonToCsv(jsonData) {
  // Suponemos que jsonData es un array de objetos JSON
  if (!jsonData.length) return "";

  // Obtener los encabezados
  const headers = Object.keys(jsonData[0]).join(",");

  // Convertir cada objeto JSON a una fila CSV
  const rows = jsonData.map((obj) => {
    return Object.values(obj).join(",");
  });

  // Combinar encabezados y filas
  return headers + "\n" + rows.join("\n");
}

ipcRenderer.send("get-global-list");

function processFiles(fileList) {
  for (const file of fileList) {
    sendFileToProcess(file);
  }
}

ipcRenderer.on("global-var-reply", (event, fileList) => {
  console.log("La variable global es:", fileList);
  processFiles(fileList);
});

// Lanzar el proceso Python
const pythonProcess = spawn("python", ["../BackEnd/process_fachade.py"]);

// Función para enviar un archivo
function sendFileToProcess(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    // Enviar el contenido del archivo a Python
    const command = {
      method: "processData",
      params: {
        inputfile: data, // Envía el contenido del archivo como una cadena
      },
    };

    pythonProcess.stdin.write(JSON.stringify(command) + "\n");

    // Cerrar stdin para simular EOF
    //pythonProcess.stdin.end();
  });
}

// Escuchar respuestas de Python
pythonProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data.toString()}`);

  // Parsear JSON desde la salida
  try {
    const jsonData = JSON.parse(data.toString().trim());

    // Convertir a CSV
    const csvData = jsonToCsv(jsonData);
    console.log(csvData);

    // Opcional: guardar en archivo
    fs.writeFile("output.csv", csvData, (err) => {
      if (err) {
        console.error("Error al guardar el CSV:", err);
        return;
      }
      console.log("CSV guardado correctamente.");
    });
    ipcRenderer.send("assign_csv", csvData);
  } catch (err) {
    console.error("Error al parsear JSON o al convertir a CSV:", err);
  }
});

// Manejar errores
pythonProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data.toString()}`);
});

// Manejar el cierre del proceso
pythonProcess.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
