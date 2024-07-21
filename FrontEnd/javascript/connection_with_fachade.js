const { dialog } = require("@electron/remote");
var fs = require("fs");
const { spawn } = require("child_process");
var { ipcRenderer } = require("electron");

ipcRenderer.send("get-global-list");

function sendFile(filePath, commandMethod) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        reject(err);
        return;
      }
      const command = {
        method: commandMethod,
        params: {
          inputfile: data,
        },
      };
      pythonProcess.stdin.write(JSON.stringify(command) + "\n", resolve);
    });
  });
}

async function processFiles(fileList) {
  for (const file of fileList) {
    await sendFile(file, "getEngagementFile");
    await sendFile(file, "getMemorizationFile");
    await sendFile(file, "getWorkloadFile");
  }
}

ipcRenderer.on("global-var-reply", (event, fileList) => {
  console.log("La variable global es:", fileList);
  processFiles(fileList);
});

// Lanzar el proceso Python
const pythonProcess = spawn("python", ["../BackEnd/viewer_fachade.py"]);

// Función para enviar un archivo
function sendFileToTransform(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    // Enviar el contenido del archivo a Python
    const command = {
      method: "transformData",
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
});

// Manejar errores
pythonProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data.toString()}`);
});

// Manejar el cierre del proceso
pythonProcess.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
