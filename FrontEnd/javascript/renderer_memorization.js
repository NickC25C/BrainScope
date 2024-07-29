var { ipcRenderer } = require("electron");
var {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} = require("chart.js");

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

let memorizationData = [];
let chartMemorization;

function startWatchingVariableMemorization() {
  this.checkVariableInterval = setInterval(() => {
    ipcRenderer.invoke("getMemorization").then((data) => {
      if (data !== undefined) {
        memorizationData = data;
        updateChartMemorization();
        clearInterval(this.checkVariableInterval); // Detiene el intervalo
      }
    });
  }, 1000); // Comprueba cada 1 segundo
}

function updateChartMemorization() {
  memorizationData.forEach((entry) => {
    const timeInSeconds = parseFloat(entry["time(s)"].match(/(\d+\.\d+)/)[0]);
    chartMemorization.data.labels.push(timeInSeconds);
    chartMemorization.data.datasets[0].data.push(entry.Memorization);
  });

  chartMemorization.update();
}

function initializeChartMemorization(ctx_Mem) {
  chartMemorization = new Chart(ctx_Mem, {
    type: "line",
    min: 0,
    max: 100,
    ticks: {
      stepSize: 1,
    },
    data: {
      labels: [],
      datasets: [
        {
          label: "Memorization",
          data: [],
          borderColor: "rgb(135, 178, 140)",
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Time (seconds)" },
        },
        y: {
          title: { display: true, text: "Memorization" },
        },
      },
    },
  });

  startWatchingVariableMemorization();
}

window.addEventListener("load", function () {
  // Inicialización de la gráfica de Memorization
  var ctx_Mem = document
    .getElementById("myChart_Memorization")
    .getContext("2d");
  setTimeout(() => {
    initializeChartMemorization(ctx_Mem);
  }, 6000);
});
