function updateProgressBar(percentage) {
  const progressBar = document.getElementById("progressbar");
  progressBar.style.width = percentage + "%";
  progressBar.textContent = percentage + "%";
}

// Ejemplo de cómo actualizar la barra de progreso
updateProgressBar(40); // Esto actualizará la barra al 50%
