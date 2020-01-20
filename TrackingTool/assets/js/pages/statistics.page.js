"use strict";

$(document).ready(function () {
  let chart = document.getElementById('user_stats');
  if (chart) {
    var user_stats = window.SAILS_LOCALS["stats"];

    let total_connections = [];
    let dates = [];


    for (let i = 0; i < user_stats.length; i++) {
      total_connections.push(Object.keys(user_stats[i])[0]);
      dates.push(Object.values(user_stats[i])[0])
    }

    console.log("connections : ", total_connections);
    console.log("dates : ", dates);

    var ctx = chart.getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: total_connections,
        datasets: [{
          label: 'Total connections',
          data: dates,
          backgroundColor: [
            'transparent'
          ],
          borderColor: [
            '#6f42c1'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })

  }

});
