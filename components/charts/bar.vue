<script>
import { Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);

export default {
  extends: Bar,
  props: {
    chartdata: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
    labels: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    this.renderTheChart();
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark;
    },
  },
  watch: {
    theme: function() {
      this.renderTheChart();
    },
    chartdata: function() {
      this.renderTheChart();
    },
  },
  methods: {
    renderTheChart() {
      Chart.defaults.global.defaultFontColor = this.$vuetify.theme.dark
        ? '#ffffff'
        : '#000000';
      Chart.defaults.scale.gridLines.color = this.$vuetify.theme.dark
        ? '#454545'
        : '#d1d1d1';

      this.renderChart(this.chartdata, this.options);
    },
  },
};
</script>
