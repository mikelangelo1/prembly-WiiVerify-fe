<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,

  mounted() {
    this.renderChart(
      {
        labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
        datasets: [
          {
            label: "Youtube",
            data: [50, 26, 36, 30, 46, 38, 60],
            backgroundColor: "rgba(22, 82, 240,0.15)",
            borderColor: "#1652F0",
            pointRadius: 0,
            //  lineTension: 0.1,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false,
          labels: {
            usePointStyle: false,
          },
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                display: false,
                drawBorder: false,
              },
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                display: false,
                drawBorder: false,
              },
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
            },
          ],
        },
        title: {
          display: false,
        },
      }
    );
  },
};
</script>
