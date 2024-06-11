const {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} = require("chart.js");

// Registra los componentes necesarios para gráficos de líneas
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

window.onload = function () {
  console.log("hola");

  var ctx_Wor = document.getElementById("myChart_Workload").getContext("2d");
  var ctx_Mem = document
    .getElementById("myChart_Memorization")
    .getContext("2d");
  var ctx_Eng = document.getElementById("myChart_Engagement").getContext("2d");
  var myChart = new Chart(ctx_Wor, {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Number of Items Sold",
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: "rgb(117, 249, 76)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    responsive: true,
  });
  console.log("hola");

  var myChart = new Chart(ctx_Mem, {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Number of Items Sold",
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: "rgb(135, 178, 140)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
    responsive: true,
  });

  var myChart = new Chart(ctx_Eng, {
    type: "line",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
      ],
      datasets: [
        {
          label: "Number of Items Sold",
          data: [65, 59, 80, 81, 56, 55, 90, 45, 11, 23],
          fill: false,
          borderColor: "rgb(187, 39, 26)",
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
