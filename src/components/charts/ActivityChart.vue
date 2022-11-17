<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  data() {
    return {
      options: {
        responsive: true,
        aspectRatio: 2,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              barPercentage: 0.45,
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                fontColor: "#8a909d",
                beginAtZero: true,
              },
              responsive: true,
              maintainAspectRatio: false,
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: "#eee",
              },
              ticks: {
                stepSize: 100,
                fontColor: "#8a909d",
              },
            },
          ],
        },
        tooltips: {
          mode: "index",
          intersect: false,
          titleFontColor: "#888",
          bodyFontColor: "#555",
          titleFontSize: 12,
          bodyFontSize: 10,
          backgroundColor: "rgba(256,256,256,0.95)",
          displayColors: true,
          xPadding: 10,
          yPadding: 7,
          borderColor: "rgba(220, 220, 220, 0.9)",
          borderWidth: 2,
          caretSize: 6,
          caretPadding: 5,
        },
      },
    };
  },
  props: {
    chartData: {
      type: Array,
      default: null,
    },
    chartLabels: {
      type: Array,
      default: null,
    },
  },
  mounted() {
    console.log(this.label);
    this.renderChart(
      {
        labels: this.chartLabels,
        datasets: [
          {
            label: "Card Transactions",
            backgroundColor: "rgba(22, 82, 240, 0.75)",
            borderColor: "transparent",
            data: this.chartData,
            lineTension: 0,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      this.options
    );
  },
};
</script>
