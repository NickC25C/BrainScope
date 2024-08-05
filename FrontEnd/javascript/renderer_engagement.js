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

let engagementData = [];
let chartEngagement;

function startWatchingVariableEngagement() {
  this.checkVariableInterval = setInterval(() => {
    ipcRenderer.invoke("getEngagement").then((data) => {
      if (data !== undefined) {
        engagementData = data;
        updateChartEngagement();
        clearInterval(this.checkVariableInterval); // Detiene el intervalo
      }
    });
  }, 1000); // Comprueba cada 1 segundo
}

function updateChartEngagement() {
  engagementData.forEach((entry) => {
    const timeInSeconds = parseFloat(entry["time(s)"].match(/(\d+\.\d+)/)[0]);
    chartEngagement.data.labels.push(timeInSeconds);
    chartEngagement.data.datasets[0].data.push(entry.Engagement);
  });

  chartEngagement.update();
}

function initializeChartEngagement(ctx_Eng) {
  chartEngagement = new Chart(ctx_Eng, {
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
          label: "Engagement",
          data: [],
          borderColor: "rgb(187, 39, 26)",
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
          title: { display: true, text: "Engagement" },
        },
      },
    },
  });

  startWatchingVariableEngagement();
}

window.addEventListener("load", function () {
  // Inicialización de la gráfica de Engagement
  var ctx_Eng = document.getElementById("myChart_Engagement").getContext("2d");
  setTimeout(() => {
    initializeChartEngagement(ctx_Eng);
  }, 6000);
});
