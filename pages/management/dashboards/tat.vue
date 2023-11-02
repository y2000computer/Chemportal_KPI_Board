<template>
  <v-row>
    <v-col>
      <v-row dense align="center">
        <v-col class="font-weight-bold"
          >Turnaround Times (TAT) for {{ title }}</v-col
        >
        <v-col>
          <div class="float-right">
            <v-btn icon>
              <v-icon>help</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row dense justify="space-around">
        <v-col lg="4" md="6" cols="12">
          <main-stat-card
            :loading="summaryLoading"
            title="TAT 50"
            :value="!summaryLoading ? currentTat.tat50 + ' days' : ''"
          ></main-stat-card>
        </v-col>
        <v-col lg="4" md="6" cols="12">
          <main-stat-card
            :loading="summaryLoading"
            title="TAT 95"
            :value="!summaryLoading ? currentTat.tat95 + ' days' : ''"
          ></main-stat-card>
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col lg="6" sm="12">
          <v-card outlined>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col>{{ title }} Summary</v-col>
              </v-row>
              <v-data-table
                dense
                :loading="countsLoading"
                :items="currentTatCounts"
                :headers="countsTable.headers"
                :options="countsTable.options"
                :footer-props="countsTable.footerProps"
              >
                <template v-slot:item.sampleCountPercentage="{ item }">
                  {{ parseFloat(item.sampleCountPercentage).toFixed(1) }}
                </template>
                <template
                  v-slot:item.cumulativeSampleCountPercentage="{ item }"
                  class="font-weight-bold"
                >
                  <div class="font-weight-bold">
                    {{
                      parseFloat(item.cumulativeSampleCountPercentage).toFixed(
                        1
                      )
                    }}
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6" cols="12">
          <v-card outlined>
            <v-card-text>
              <v-row dense>
                <v-col>Cumulative % of Samples Reported</v-col>
              </v-row>
              <line-chart
                style="height:350px"
                v-if="!currentTatChart.loading"
                :options="currentTatChart.options"
                :chartdata="currentTatChart.chartData"
              ></line-chart>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense align="start">
        <v-col md="6" cols="12">
          <v-card outlined>
            <v-card-text>
              <v-row dense>
                <v-col>TAT History</v-col>
              </v-row>
              <line-chart
                style="height:240px"
                v-if="!tatHistoryChart.loading"
                :options="tatHistoryChart.options"
                :chartdata="tatHistoryChart.chartData"
              ></line-chart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col>TAT History</v-col>
              </v-row>
              <v-data-table
                dense
                :items="tatSummary"
                :headers="historyTable.headers"
                :loading="summaryLoading"
                :options="historyTable.options"
                :footer-props="historyTable.footerProps"
              >
                <template v-slot:item.calendar_month="{ item }">
                  {{ $moment(item.calendar_month).format('MMMM') }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import mainStatCard from './components/mainStatCard';
import lineChart from '../../../components/charts/line';
export default {
  components: { mainStatCard, lineChart },
  data() {
    return {
      date: this.$moment(),
      summaryLoading: true,
      countsLoading: true,
      tatSummary: [],
      tatCounts: [],
      countsTable: {
        headers: [
          { text: 'Turnaround (days)', value: 'tat' },
          { text: 'Samples Reported', value: 'sampleCount' },
          { text: 'Reported % ', value: 'sampleCountPercentage' },
          { text: 'Cumulative %', value: 'cumulativeSampleCountPercentage' },
        ],
        options: {
          itemsPerPage: 10,
        },
        footerProps: {
          showFirstLastPage: true,
          itemsPerPageOptions: [10, 25, 50, -1],
        },
      },
      historyTable: {
        headers: [
          { text: 'Year', value: 'calendar_year' },
          { text: 'Month', value: 'calendar_month' },
          { text: 'TAT 50 ', value: 'tat50' },
          { text: 'TAT 95', value: 'tat95' },
        ],
        options: {
          itemsPerPage: 5,
        },
        footerProps: {
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 10, 25, -1],
        },
      },

      currentTatChart: {
        loading: false,
        options: {
          legend: {
            display: false,
            position: 'bottom',
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Cumulative %',
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Calendar Days',
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          responsive: true,
          maintainAspectRatio: false,
        },
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Cumulative %',
              data: [],
              fill: false,
              lineTension: 0,
              pointRadius: 2,
              borderColor: this.getColour('primary'),
              borderWidth: 3,
            },
            {
              label: 'TAT50',
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: this.getColour('chartDash'),
              pointRadius: 0,
              borderWidth: 2,
              borderDash: [10, 10],
            },
            {
              label: 'TAT95',
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: this.getColour('chartDash'),
              pointRadius: 0,
              borderWidth: 2,
              borderDash: [10, 10],
            },
          ],
        },
      },
      tatHistoryChart: {
        loading: false,
        options: {
          legend: {
            position: 'right',
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          responsive: true,
          maintainAspectRatio: false,
        },
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'TAT95',
              data: [],
              fill: false,
              lineTension: 0,
              pointRadius: 0.5,
              borderColor: this.getColour('primary'),
              borderWidth: 3,
            },
            {
              label: 'TAT50',
              data: [],
              fill: false,
              lineTension: 0,
              pointRadius: 0.5,
              borderColor: this.getColour('secondary'),
              borderWidth: 3,
            },
          ],
        },
      },
    };
  },
  computed: {
    currentTat() {
      return this._.find(this.tatSummary, {
        calendar_year: this.date.format('YYYY'),
        calendar_month: this.date.format('M'),
      });
    },
    currentTatCounts() {
      return this.tatCounts.filter((item) => {
        return (
          item.calendar_year == this.date.format('YYYY') &&
          item.calendar_month == this.date.format('M')
        );
      });
    },
    title() {
      return this.date.format('MMMM') + ' ' + this.date.format('YYYY');
    },
  },
  mounted() {
    this.getTatSummary();
    this.getTatCounts();
  },

  methods: {
    getTatSummary() {
      this.summaryLoading = true;
      this.$axios.get('stats/dw-tat-summary').then((response) => {
        this.tatSummary = response.data.data;
        this.summaryLoading = false;
        this.updateHistoryChart();
      });
    },
    getTatCounts() {
      this.countsLoading = true;
      this.$axios.get('stats/dw-tat-months').then((response) => {
        this.tatCounts = response.data.data;
        this.countsLoading = false;
        this.updateCurrentMonthChart();
      });
    },
    updateHistoryChart() {
      this.tatHistoryChart.loading = true;
      this.tatHistoryChart.chartData.labels = [];
      this.tatHistoryChart.chartData.datasets[0].data = [];
      this.tatHistoryChart.chartData.datasets[1].data = [];
      this.$nextTick(() => {
        this.tatSummary.forEach((month) => {
          this.tatHistoryChart.chartData.labels.unshift(
            this.$moment(month.calendar_month, 'MM').format('MMM') +
              ' ' +
              month.calendar_year
          );
          this.tatHistoryChart.chartData.datasets[0].data.unshift(month.tat95);
          this.tatHistoryChart.chartData.datasets[1].data.unshift(month.tat50);
        });
      });
      this.$nextTick(() => {
        this.tatHistoryChart.loading = false;
      });
    },
    updateCurrentMonthChart() {
      this.currentTatChart.loading = true;
      this.currentTatChart.chartData.labels = [];
      this.currentTatChart.chartData.datasets[0].data = [];
      let i = 0;
      //let j = this.currentTatCounts[this.currentTatCounts.length - 1].tat;
      let j = 40;
      let item2 = {};
      while (i <= j) {
        this.currentTatChart.chartData.labels.push(i);
        let item = this._.find(this.currentTatCounts, {
          tat: i.toString(),
        });
        if (item) {
          item2 = item;
          this.currentTatChart.chartData.datasets[0].data.push(
            item.cumulativeSampleCountPercentage
          );
        } else {
          this.currentTatChart.chartData.datasets[0].data.push(
            item2.cumulativeSampleCountPercentage
          );
        }
        this.currentTatChart.chartData.datasets[1].data.push(50);
        this.currentTatChart.chartData.datasets[2].data.push(95);
        i++;
      }
      this.$nextTick(() => {
        this.currentTatChart.loading = false;
      });
    },
    getColour(colour) {
      return this.$vuetify.theme.themes[
        this.$vuetify.theme.dark ? 'dark' : 'light'
      ][colour];
    },
  },
};
</script>

<style></style>
