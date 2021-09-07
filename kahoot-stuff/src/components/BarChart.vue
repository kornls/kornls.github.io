<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  name: "BarChart",
  props: ["data", "label"],
  mounted() {
    // reformat in the way the lib wants
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

    for (let i = 0; i < this.data.length; i++) {
      chartData.datasets[0].data.push(this.data[i].barAmount);
      chartData.labels.push(this.data[i].barName);
    }

    this.renderChart(chartData, {
      responsive: true,
      maintainAspectRatio: false,
    });
  },
};
</script>
