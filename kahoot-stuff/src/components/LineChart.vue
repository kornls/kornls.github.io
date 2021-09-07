<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  name: "LineChart",
  props: ["data", "label"],
  mounted() {
    let chartData = {
      labels: [],
      datasets: [
        {
          label: this.label,
          backgroundColor: "#82B1FF",
          data: [],
        },
      ],
    };

    let accuracy = 50; // Higher is more accurate, but more "spikey"
    for (let i = 0; i < this.data.length; i++) {
      if (i % Math.ceil(this.data.length / accuracy) == 0) {
        chartData.labels.push(this.data[i].lineMeasurement);
        chartData.datasets[0].data.push(this.data[i].lineAmount);
      }
    }

    this.renderChart(chartData, {
      responsive: true,
      maintainAspectRatio: false,
    });
  },
};
</script>