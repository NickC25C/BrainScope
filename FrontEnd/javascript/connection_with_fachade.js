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

      let commandId;
      // Usamos el switch para asignar el ID basado en el método
      switch (commandMethod) {
        case "getEngagementFile":
          commandId = 1;
          break;
        // Puedes agregar más casos aquí para otros métodos
        case "getMemorizationFile":
          commandId = 2;
          break;
        case "getWorkloadFile":
          commandId = 3;
          break;
        default:
          commandId = 0; // Un valor predeterminado en caso de que no se reconozca el método
          break;
      }

      // Ahora construimos el objeto command con el ID adecuado
      const command = {
        id: commandId,
        method: commandMethod,
        params: {
          inputfile: data,
        },
      };

      pythonProcess.stdin.write(JSON.stringify(command) + "\n", resolve);
    });
  });
}

async function processFiles(file) {
  await sendFile(file, "getEngagementFile");
  await sendFile(file, "getMemorizationFile");
  await sendFile(file, "getWorkloadFile");
}

function sendClip(videoPath) {
  return new Promise((resolve, reject) => {
    const command = {
      id: 4,
      method: "saveInformationVideo",
      params: {
        clip: videoPath,
      },
    };
    pythonProcess.stdin.write(JSON.stringify(command) + "\n", resolve);
  });
}

ipcRenderer.on("global-var-reply", (event, fileList) => {
  console.log("La variable global es:", fileList);
  processFiles(fileList[0]);
  sendClip(fileList[1]);
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
  let response;
  try {
    response = JSON.parse(data.toString());
  } catch (error) {
    console.error("Error parsing JSON from Python:", error);
    return;
  }

  if (response.id) {
    if (response.id === 1) {
      ipcRenderer.send("load_Engagement", response.result);
    } else if (response.id === 2) {
      ipcRenderer.send("load_Memorization", response.result);
    } else if (response.id === 3) {
      ipcRenderer.send("load_Workload", response.result);
    }
    console.log(`Response for command ID ${response.id}:`, response);
    // Aquí podrías llamar a una función que maneje la respuesta basada en el ID
  } else {
    console.error("No ID in response from Python");
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
