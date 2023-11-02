<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Test Stats</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                outlined
                label="SOP"
                :items="sops"
                item-value="SOPNO"
                item-text="TITLE"
                v-model="sop"
              >
                <template v-slot:label="data">{{data.SOPNO}}</template>
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-text-field v-model="startDate" label="Start"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="endDate" label="End"></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="sopSelected">Go!</v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col v-if="!chartLoading">
              <line-chart :options="chartSettings.options" :chartdata="chartData"></line-chart>
              <bar-chart :options="chartSettings.options" :chartdata="chartData"></bar-chart>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import lineChart from "../../../components/charts/line";
import barChart from "../../../components/charts/bar";
export default {
  components: {
    lineChart,
    barChart
  },
  data() {
    return {
      sops: [],
      sop: "",
      sopData: [],
      startDate: "2020-01-01",
      endDate: "",
      chartLoading: true,
      chartSettings: {
        chartData: {
          labels: [],
          datasets: [
            {
              label: "Complete",
              data: [],
              fill: false,
              borderColor: "green",
              backgroundColor: "green",
              lineTension: 0
            },
            {
              label: "Due",
              data: [],
              fill: false,
              borderColor: "red",
              backgroundColor: "red",
              lineTension: 0
            },
            {
              label: "Cumulative",
              data: [],
              fill: false,
              hidden: true,
              type: "bar"
            },
            {
              label: "Capcity",
              data: [],
              fill: false,
              borderWidth: 4,
              borderColor: "black",
              lineTension: 0,
              pointRadius: 0,
              hidden: true
            }
          ]
        },
        options: {
          tooltips: {
            mode: "index",
            intersect: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      }
    };
  },
  computed: {
    chartData() {
      return this.chartSettings.chartData;
    }
  },
  mounted() {
    this.getSOPS();
  },
  methods: {
    getSOPS() {
      this.$axios.get("sops").then(response => {
        this.sops = response.data;
      });
    },
    sopSelected(e) {
      this.clearChart();
      this.chartLoading = true;
      this.$axios
        .get("stats/sopStats?startDate=" + this.startDate + "&sop=" + this.sop)
        .then(response => {
          this.sopData = response.data;
          this.setChartLabels();
        });
    },
    setChartLabels() {
      this.sopData.forEach(data => {
        this.chartSettings.chartData.labels.push(data.Date);
      });
      this.setChartData();
    },
    setChartData() {
      let cumulativeCount = 0;
      this.sopData.forEach(data => {
        cumulativeCount = cumulativeCount + (data.DueCount - data.ResultCount);
        this.chartSettings.chartData.datasets[0].data.push(data.ResultCount);
        this.chartSettings.chartData.datasets[1].data.push(data.DueCount);
        this.chartSettings.chartData.datasets[3].data.push(50);
        if (data.ResultCount != null) {
          this.chartSettings.chartData.datasets[2].data.push(
            data.ResultCount - data.DueCount
          );
        }
      });
      this.chartLoading = false;
    },
    clearChart() {
      this.chartSettings.chartData.datasets[0].data = [];
      this.chartSettings.chartData.datasets[1].data = [];
      this.chartSettings.chartData.datasets[2].data = [];
      this.chartSettings.chartData.labels = [];
    }
  }
};
</script>

<style></style>
