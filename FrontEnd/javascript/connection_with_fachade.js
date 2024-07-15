const { dialog } = require("@electron/remote");
const fs = require("fs");
const { spawn } = require("child_process");
var { ipcRenderer } = require("electron");
const { Console } = require("console");

ipcRenderer.send("get-global-list");

ipcRenderer.on("global-var-reply", (event, fileList) => {
  console.log("La variable global es:", fileList);
  fileList.forEach((file) => {
    console.log(file);
    sendFileToPython(file);
  });
});

// Lanzar el proceso Python
const pythonProcess = spawn("python", ["../BackEnd/connector_to_fachade.py"]);

// Función para enviar un archivo
function sendFileToPython(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    console.log(data);

    // Enviar el contenido del archivo a Python
    const command = {
      method: "transformData",
      params: {
        inputfile: data, // Envía el contenido del archivo como una cadena
      },
    };

    console.log(command);

    pythonProcess.stdin.write(JSON.stringify(command) + "\n");

    // Cerrar stdin para simular EOF
    pythonProcess.stdin.end();
  });
}

// Escuchar respuestas de Python
pythonProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data.toString()}`);
});

// Manejar errores
pythonProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data.toString()}`);
});

// Manejar el cierre del proceso
pythonProcess.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
