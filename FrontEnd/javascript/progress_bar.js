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
      targetWidth += 12;
      if (targetWidth > 99) targetWidth = 99;
      animateProgress(targetWidth);
    }
  }, 3000);

  function startWatchingVariable() {
    this.checkVariableInterval = setInterval(() => {
      ipcRenderer.invoke("getVariableValue").then((variableValue) => {
        if (variableValue !== undefined) {
          animateProgress(100);
          clearInterval(mainInterval);
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
      }
    };
    requestAnimationFrame(step);
  }
});
