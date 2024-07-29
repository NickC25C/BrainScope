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

let workloadData = [];
let chartWorkload;

function startWatchingVariableWorkload() {
  this.checkVariableInterval = setInterval(() => {
    ipcRenderer.invoke("getWorkload").then((data) => {
      if (data !== undefined) {
        console.log(data);
        workloadData = data;
        updateChartWorkload();
        clearInterval(this.checkVariableInterval); // Detiene el intervalo
      }
    });
  }, 1000); // Comprueba cada 1 segundo
}

function updateChartWorkload() {
  workloadData.forEach((entry) => {
    const timeInSeconds = parseFloat(entry["time(s)"].match(/(\d+\.\d+)/)[0]);
    chartWorkload.data.labels.push(timeInSeconds);
    chartWorkload.data.datasets[0].data.push(entry.Workload);
  });

  chartWorkload.update();
}

function initializeChartWorkload(ctx_Wor) {
  chartWorkload = new Chart(ctx_Wor, {
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
          label: "Workload",
          data: [],
          borderColor: "rgb(117, 249, 76)",
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
          title: { display: true, text: "Workload" },
        },
      },
    },
  });

  startWatchingVariableWorkload();
}

window.addEventListener("load", function () {
  // Inicialización de la gráfica de Workload
  var ctx_Wor = document.getElementById("myChart_Workload").getContext("2d");
  setTimeout(() => {
    initializeChartWorkload(ctx_Wor);
  }, 1000);
});
