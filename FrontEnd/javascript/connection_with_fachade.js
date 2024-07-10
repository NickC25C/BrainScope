const { dialog } = require("electron").remote;
const fs = require("fs");
const { spawn } = require("child_process");

// Lanzar el proceso Python
const pythonProcess = spawn("python", ["../../BackEnd/petitions.py"]);

// Función para enviar un archivo
function sendFileToPython(filePath) {
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

    console.log("hola");

    pythonProcess.stdin.write(JSON.stringify(command) + "\n");
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

// Opción para seleccionar un archivo usando un diálogo
dialog
  .showOpenDialog({
    properties: ["openFile"],
  })
  .then((result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      sendFileToPython(result.filePaths[0]);
    }
  })
  .catch((err) => {
    console.error(err);
  });
