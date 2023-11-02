<template>
  <v-card flat>
    <v-card-text>
      <v-row dense>
        <v-col>{{ client.client_name }}</v-col>
      </v-row>
      <v-row>
        <v-col>
          <bar-chart
            v-if="!loading"
            style="height:200px"
            :options="chartSettings.options"
            :chartdata="chartData"
          ></bar-chart>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import barChart from '../../../components/charts/bar';
export default {
  props: {
    client: Object,
    field: String,
    loading: Boolean,
    date: Object,
  },
  components: {
    barChart,
  },
  data() {
    return {
      chartSettings: {
        options: {
          legend: {
            display: true,
            position: 'right',
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                ticks: {},
              },
            ],
          },
        },
      },
    };
  },
  computed: {
    chartData() {
      let chartData = {};
      chartData.labels = [];
      chartData.datasets = [
        {
          label: 'Samples Logged',
          data: [],
          fill: false,
          backgroundColor: [],
          type: 'bar',
          order: 1,
        },
        {
          label: 'Moving Average',
          data: [],
          fill: false,
          type: 'line',
          lineTension: 0.2,
          pointRadius: 0,
          backgroundColor: 'black',
          borderColor: 'black',
          order: 0,
        },
      ];

      this.client.weeklyCounts.forEach((date) => {
        chartData.labels.push(date.calendar_year + ' - ' + date.calendar_week);
        chartData.datasets[0].data.push(date.samples);
        chartData.datasets[0].backgroundColor.push(
          date.sampleCountTrend == 'up' ? '#90ee90' : '#ffa6a6'
        );
        chartData.datasets[1].data.push(date.movingAverage);
      });
      return chartData;
    },
  },
};
</script>

<style></style>
