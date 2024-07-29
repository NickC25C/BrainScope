var { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", function () {
  const progressBar = document.getElementById("progressbar");
  let currentWidth = 0;
  let targetWidth = 0;

  startWatchingVariable();

  const mainInterval = setInterval(function () {
    if (targetWidth >= 99) {
      clearInterval(mainInterval);
      animateProgress(99); // Asegura que llegue al 99%
    } else {
      const randomIncrement = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
      targetWidth += randomIncrement;
      if (targetWidth > 99) targetWidth = 99;
      animateProgress(targetWidth);
    }
  }, 4000);

  function startWatchingVariable() {
    this.checkVariableInterval = setInterval(() => {
      ipcRenderer.invoke("getVariableValue").then((variableValue) => {
        if (variableValue !== undefined) {
          animateProgress(100); // Mueve la barra a 100%
          clearInterval(mainInterval); // Detiene la iteración principal
          document.getElementById("DownloadData").disabled = false; // Asegura habilitar el botón
        }
      });
    }, 1000); // Comprueba cada 1 segundo
  }

  function animateProgress(target) {
    const step = () => {
      if (currentWidth < target) {
        currentWidth += 0.5; // Controla la velocidad de la animación
        if (currentWidth > target) {
          currentWidth = target;
        }
        progressBar.style.width = currentWidth + "%";
        progressBar.textContent = Math.floor(currentWidth) + "%";
        requestAnimationFrame(step);
      } else {
        if (currentWidth >= 100) {
          document.getElementById("DownloadData").disabled = false; // Habilitar el botón
        }
      }
    };
    requestAnimationFrame(step);
  }
});
