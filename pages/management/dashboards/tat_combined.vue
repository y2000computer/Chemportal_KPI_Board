<template>
  <v-row>
    <v-col>
      {{ date.format('Y') }}
      <v-row>
        <v-col cols="12" md="8">
          <v-card outlined>
            <v-card-text>
              <v-row>
                <v-col>
                  <line-chart
                    v-if="!loading"
                    :options="tatChartSettings.options"
                    :chartdata="tatChartData"
                    :labels="true"
                  ></line-chart>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <!-- <v-simple-table dense >
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>TAT-R</td>
                        <td
                          v-for="(month, index) in data.comb.tatr"
                          :key="'tatr' + index"
                        >
                          {{ month.PercentSamplesOnTime }}
                        </td>
                      </tr>
                      <tr>
                        <td>TAT-50</td>
                        <td
                          v-for="(month, index) in data.comb.tat"
                          :key="'tatr' + index"
                        >
                          {{ month.tat50 }}
                        </td>
                      </tr>
                      <tr>
                        <td>TAT-95</td>
                        <td
                          v-for="(month, index) in data.comb.tat"
                          :key="'tatr' + index"
                        >
                          {{ month.tat95 }}
                        </td>
                      </tr>
                      <tr>
                        <td>#Samples</td>
                        <td
                          v-for="(month, index) in data.comb.samples"
                          :key="'tatr' + index"
                        >
                          {{ month.SamplesLogged }}
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table> -->
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-row class="mt-0">
            <v-col class="pt-0">
              <v-card outlined></v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card outlined
                ><v-card-text
                  ><line-chart
                    v-if="!loading"
                    :options="sampleChartSettings.options"
                    :chartdata="sampleChartData"
                    :labels="true"
                  ></line-chart></v-card-text
              ></v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-card outlined
            ><v-card-text
              ><line-chart
                v-if="!loading"
                :options="tat95ChartSettings.options"
                :chartdata="tat95ChartData"
                :labels="true"
              ></line-chart></v-card-text
          ></v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card outlined
            ><v-card-text
              ><line-chart
                v-if="!loading"
                :options="tat50ChartSettings.options"
                :chartdata="tat50ChartData"
                :labels="true"
              ></line-chart></v-card-text
          ></v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card outlined
            ><v-card-text
              ><line-chart
                v-if="!loading"
                :options="tat50ChartSettings.options"
                :chartdata="tatrChartData"
                :labels="true"
              ></line-chart></v-card-text
          ></v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import barChart from '../../../components/charts/bar';
import lineChart from '../../../components/charts/line';

export default {
  components: { barChart, lineChart },
  data() {
    return {
      loading: true,
      data: [],
      date: this.$moment(),
      tatChartSettings: {
        options: {
          plugins: {},
          title: {
            display: false,
            text: 'Test',
          },
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
                id: 'tat-axis',
                ticks: {
                  beginAtZero: true,
                },
                position: 'left',
                type: 'linear',
              },
              {
                id: 'tatr-axis',
                ticks: {
                  beginAtZero: true,
                },
                position: 'right',
                type: 'linear',
              },
            ],
            xAxes: [{ ticks: {} }],
          },
        },
      },
      sampleChartSettings: {
        options: {
          title: {
            display: false,
            text: 'Test',
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
                id: 'sample-axis',
                ticks: {
                  beginAtZero: true,
                },
                position: 'left',
                type: 'linear',
              },
            ],
            xAxes: [{ ticks: {} }],
          },
        },
      },
      tat95ChartSettings: {
        options: {
          title: {
            display: false,
            text: 'Test',
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
                id: 'tat95-axis',
                ticks: {
                  beginAtZero: true,
                },
                position: 'left',
                type: 'linear',
              },
            ],
            xAxes: [{ ticks: {} }],
          },
        },
      },
      tat50ChartSettings: {
        options: {
          title: {
            display: false,
            text: 'Test',
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
                id: 'tat50-axis',
                ticks: {
                  beginAtZero: true,
                },
                position: 'left',
                type: 'linear',
              },
            ],
            xAxes: [{ ticks: {} }],
          },
        },
      },
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    chartColours() {
      let colours = {
        tat95: ['#ec0000', '#696969', '#DCDCDC'],
        tatr: ['#3232ff', '#696969', '#DCDCDC'],
        tat50: ['#32cd32', '#696969', '#DCDCDC'],
        samples: ['#800080', '#696969', '#DCDCDC'],
      };
      return colours;
    },
    tatChartData() {
      let chartData = {};
      (chartData.labels = this.data.comb.tatr
        .slice(-18)
        .map((a) => this.$moment(a.calendar_month, 'MM').format('MMM'))),
        (chartData.datasets = [
          {
            label: 'TATR',
            data: this.data.comb.tatr
              .slice(-18)
              .map((a) => a.PercentSamplesOnTime),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: '#3232ff',
            borderColor: '#3232ff',
            borderWidth: 3,
            fill: false,
            order: 1,
            yAxisID: 'tatr-axis',
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          },

          {
            label: 'TAT95',
            data: this.data.comb.tat.slice(-18).map((a) => a.tat95),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: '#ec0000',
            borderColor: '#ec0000',
            borderWidth: 3,
            fill: false,
            order: 2,
            yAxisID: 'tat-axis',
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          },
          {
            label: 'TAT50',
            data: this.data.comb.tat.slice(-18).map((a) => a.tat50),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: '#32cd32',
            borderColor: '#32cd32',
            borderWidth: 3,
            fill: false,
            order: 3,
            yAxisID: 'tat-axis',
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          },
        ]);
      return chartData;
    },
    sampleChartData() {
      let chartData = {};
      chartData.datasets = [];
      chartData.labels = this.data.samples['2019'].map((a) =>
        this.$moment(a.calendar_month, 'MM').format('MMM')
      );
      let i = 0;
      Object.keys(this.data.samples)
        .reverse()
        .forEach((key) => {
          chartData.datasets.push({
            label: key,
            data: this.data.samples[key].map(
              (a, i) => this.data.samples[key][i].SamplesReported
            ),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: this.chartColours['samples'][i],
            borderColor: this.chartColours['samples'][i],
            borderWidth: 3,
            fill: false,
            order: 1,
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          });
          i++;
        });
      return chartData;
    },
    tat95ChartData() {
      let chartData = {};
      chartData.datasets = [];
      chartData.labels = this.data.tat['2019'].map((a) =>
        this.$moment(a.calendar_month, 'MM').format('MMM')
      );
      let i = 0;
      Object.keys(this.data.tat)
        .reverse()
        .forEach((key) => {
          chartData.datasets.push({
            label: key,
            data: this.data.samples[key].map(
              (a, i) => this.data.tat[key][i].tat95
            ),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: this.chartColours['tat95'][i],
            borderColor: this.chartColours['tat95'][i],
            borderWidth: 3,
            fill: false,
            order: 1,
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          });
          i++;
        });
      return chartData;
    },
    tat50ChartData() {
      let chartData = {};
      chartData.datasets = [];
      chartData.labels = this.data.tat['2019'].map((a) =>
        this.$moment(a.calendar_month, 'MM').format('MMM')
      );
      let i = 0;
      Object.keys(this.data.tat)
        .reverse()
        .forEach((key) => {
          chartData.datasets.push({
            label: key,
            data: this.data.samples[key].map(
              (a, i) => this.data.tat[key][i].tat50
            ),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: this.chartColours['tat50'][i],
            borderColor: this.chartColours['tat50'][i],
            borderWidth: 3,
            fill: false,
            order: 1,
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          });
          i++;
        });
      return chartData;
    },
    tatrChartData() {
      let chartData = {};
      chartData.datasets = [];
      chartData.labels = this.data.tatr['2019'].map((a) =>
        this.$moment(a.calendar_month, 'MM').format('MMM')
      );
      let i = 0;
      Object.keys(this.data.tatr)
        .reverse()
        .forEach((key) => {
          chartData.datasets.push({
            label: key,
            data: this.data.tatr[key].map(
              (a, i) => this.data.tatr[key][i].PercentSamplesOnTime
            ),
            type: 'line',
            lineTension: 0,
            pointRadius: 0,
            backgroundColor: this.chartColours['tatr'][i],
            borderColor: this.chartColours['tatr'][i],
            borderWidth: 3,
            fill: false,
            order: 1,
            datalabels: {
              backgroundColor: function(context) {
                return context.dataset.backgroundColor;
              },
              display: 'auto',
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
              },
            },
          });
          i++;
        });
      return chartData;
    },
  },
  methods: {
    getData() {
      this.$axios.get('stats/dw-tat-combined').then((response) => {
        this.data = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
