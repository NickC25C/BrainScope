var { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("get-video-list");
  var videoContainer = document.getElementById("mainVideo"); // Asegúrate de tener este ID en tu <video>

  ipcRenderer.on("global-video-reply", (event, fileList) => {
    var videoPath = fileList[1]; // Ruta del nuevo video
    var videoElement = document.getElementById("videoSource");
    videoElement.src = videoPath;
    videoContainer.load(); // Llama a load en el elemento video
    console.log(videoElement.src);
  });

  videoContainer.addEventListener("click", (e) => {
    const currentTime = videoContainer.currentTime; // Obtiene el tiempo actual del video en segundos
    reciveWorkloadFragment(currentTime);
    console.log(`Tiempo actual: ${currentTime} segundos`);
    alert(`Hiciste clic en el tiempo: ${currentTime.toFixed(2)} segundos`);
  });

  // Lanzar el proceso Python
  const pythonProcess = spawn("python", ["../BackEnd/viewer_fachade.py"]);

  function reciveWorkloadFragment(fragment) {
    return new Promise((resolve, reject) => {
      const command = {
        id: 5,
        method: "getDataGraphicWorkload",
        params: {
          fragment: fragment,
        },
      };
      pythonProcess.stdin.write(JSON.stringify(command) + "\n", resolve);
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
});
