const { dialog } = require("@electron/remote");
const fs = require("fs");
const { spawn, exec } = require("child_process");
const { ipcRenderer } = require("electron");
const path = require("path");

// Ruta al script de R
const scriptPath = path.join(__dirname, "..", "heatmap", "heatmap.r");

// Lanzar el proceso Python
const pythonProcess = spawn("python", ["../BackEnd/viewer_fachade.py"]);

// Función para enviar comandos al proceso Python
function sendPythonCommand(commandId, method, params = {}) {
  const command = { id: commandId, method, params };
  pythonProcess.stdin.write(JSON.stringify(command) + "\n");
}

// Función para enviar un archivo y manejar su contenido
async function sendFile(filePath, commandMethod) {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const commandIdMap = {
      getEngagementFile: 1,
      getMemorizationFile: 2,
      getWorkloadFile: 3,
    };
    const commandId = commandIdMap[commandMethod] || 0;
    sendPythonCommand(commandId, commandMethod, { inputfile: data });
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

// Función para procesar los archivos
async function processFiles(file) {
  await sendFile(file, "getEngagementFile");
  await sendFile(file, "getMemorizationFile");
  await sendFile(file, "getWorkloadFile");
}

// Función para enviar el clip de video
function sendClip(videoPath) {
  sendPythonCommand(4, "saveInformationVideo", { clip: videoPath });
}

// Función para ejecutar el script de R y actualizar el iframe
function sendFileToTransform(filePath) {
  exec(`Rscript ${scriptPath} "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error en la salida del script: ${stderr}`);
    }
    const htmlFilePath = path.resolve(
      "C:/Users/niccm/Documents/BrainScope/FrontEnd/html/mapa_calor_cabeza_con_fondo.html"
    );
    document.querySelector("iframe").src = htmlFilePath;
  });
}

// Funciones para recibir fragmentos y enviar comandos a Python
function reciveFragment(fragment, method, commandId) {
  sendPythonCommand(commandId, method, { fragment });
}

// Manejo de respuestas de Python
pythonProcess.stdout.on("data", (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response.id) {
      const eventMap = {
        1: "load_Engagement",
        2: "load_Memorization",
        3: "load_Workload",
        5: "load_Workload",
        6: "load_Memorization",
        7: "load_Engagement",
      };
      const eventName = eventMap[response.id];
      if (eventName) {
        ipcRenderer.send(eventName, response.result);
      }
      console.log(`Response for command ID ${response.id}:`, response);
    } else {
      console.error("No ID in response from Python");
    }
  } catch (error) {
    console.error("Error parsing JSON from Python:", error);
  }
});

// Manejar errores y cierre del proceso Python
pythonProcess.stderr.on("data", (data) =>
  console.error(`stderr: ${data.toString()}`)
);

pythonProcess.on("close", (code) =>
  console.log(`child process exited with code ${code}`)
);

// Eventos de la interfaz de usuario
window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("get-video-list");
  const videoContainer = document.getElementById("mainVideo");

  ipcRenderer.on("global-video-reply", (event, fileList) => {
    const videoPath = fileList[1];
    const videoElement = document.getElementById("videoSource");
    videoElement.src = videoPath;
    videoContainer.load();
    console.log(videoElement.src);
  });

  videoContainer.addEventListener("click", (e) => {
    const currentTime = videoContainer.currentTime;
    reciveFragment(currentTime, "getDataGraphicWorkload", 5);
    reciveFragment(currentTime, "getDataGraphicMemorization", 6);
    reciveFragment(currentTime, "getDataGraphicEngagement", 7);
    console.log(`Tiempo actual: ${currentTime} segundos`);
    alert(`Hiciste clic en el tiempo: ${currentTime.toFixed(2)} segundos`);
  });
});

// Evento de respuesta global
ipcRenderer.on("global-var-reply", (event, fileList) => {
  console.log("La variable global es:", fileList);
  processFiles(fileList[0]);
  sendClip(fileList[1]);
  sendFileToTransform(fileList[2]);
});
