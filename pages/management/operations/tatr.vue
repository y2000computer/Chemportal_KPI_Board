<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>TAT-R</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="helpDialog = !helpDialog">
            <v-icon>help</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <!-- Subheader -->
          <v-row no-gutters>
            <v-col>
              <v-subheader>Current Month</v-subheader>
            </v-col>
          </v-row>
          <!-- Current Month -->
          <v-row no-gutters justify="space-between">
            <v-col md="4" cols="12">
              <v-card :loading="loading" flat>
                <v-card-text v-if="!loading" class="text-center">
                  <v-row>
                    <v-col md="7">Jobs On Time / Jobs Due</v-col>

                    <v-col>TAT-R</v-col>
                  </v-row>
                  <v-row class="display-2">
                    <v-col md="7">
                      {{ currentMonth.JobsOnTime }} /
                      {{ currentMonth.JobsDue }}
                    </v-col>

                    <v-col class="font-weight-bold">{{ currentMonth.TATR }}%</v-col>
                  </v-row>
                  <v-row>
                    <v-col md="7"></v-col>

                    <v-col
                      :class="
                        previousMonth.TATR > currentMonth.TATR
                          ? 'red--text'
                          : 'green-text'
                      "
                      class="subtitle-2"
                    >
                      <v-icon v-if="currentMonthBetter" color="green">arrow_drop_up</v-icon>
                      <v-icon v-else color="red">arrow_drop_down</v-icon>
                      vs Last Month ({{ previousMonth.TATR }}%)
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="7" cols="12">
              <v-card flat>
                <v-card-text class="text-center">
                  <v-row>
                    <v-col
                      v-for="(turnaround,
                      key,
                      index) in currentMonth.turnarounds"
                      :key="'turnaround' + index"
                    >{{ key }} Day TA</v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col
                      class="title"
                      v-for="(turnaround,
                      key,
                      index) in currentMonth.turnarounds"
                      :key="'turnaround' + index"
                    >
                      {{ turnaround.JobsOnTime }} / {{ turnaround.JobsDue }} ({{
                      (
                      (turnaround.JobsOnTime / turnaround.JobsDue) *
                      100
                      ).toFixed(1)
                      }}%)
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="1">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-btn
                        @click="clientDialog = !clientDialog"
                        color="primary"
                        large
                        class="mt-4"
                      >By Client</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <!-- Subheader -->
          <v-row no-gutters>
            <v-col>
              <v-subheader>TAT-R History</v-subheader>
            </v-col>
          </v-row>
          <!-- Chart Options -->
          <v-row no-gutters>
            <v-col>
              <v-row justify="space-around">
                <v-col md="3" cols="12">
                  <v-radio-group row @change="radioSelected($event)" v-model="chartType">
                    <v-radio color="primary" label="View Turnarounds" value="turnarounds"></v-radio>
                    <v-radio color="primary" label="View by Client" value="clients"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                  <v-autocomplete
                    dense
                    outlined
                    label="Select Client/s"
                    :items="clients"
                    v-model="chartClients"
                    multiple
                    hide-details
                    :disabled="chartType == 'turnarounds'"
                    clearable
                    append-outer-icon="filter_list"
                    @click:append-outer="clientChart"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- Graph -->
          <v-row>
            <v-col>
              <v-card v-if="!loading" flat>
                <bar-chart :options="chartSettings.options" :chartdata="chartData"></bar-chart>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="clientDialog" scrollable width="1000">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>TAT-R for Clients</v-toolbar-title>
        </v-toolbar>
        <v-card-text style="height:800px;">
          <v-row>
            <v-col>
              <v-text-field outlined label="Client Search" v-model="clientDialogSearch"></v-text-field>
            </v-col>
          </v-row>

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters class="font-weight-bold">
                    <v-col cols="6">Client</v-col>
                    <v-col cols="3">Current TAT-R</v-col>
                    <v-col>Last Month TAT-R</v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="(client, key, index) in dialogClientList" :key="'client' + index">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters>
                    <v-col cols="6">{{ key }}</v-col>
                    <v-col
                      cols="3"
                      :class="
                        client.currentTAT > client.previousTAT ||
                        client.currentTAT == '100.0'
                          ? 'green--text'
                          : 'red--text'
                      "
                    >{{ client.currentTAT }}%</v-col>
                    <v-col cols="3">{{ client.previousTAT }}%</v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="helpDialog" scrollable width="1000">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>TAT-R (Turn-Around-Time-Reliability) Help</v-toolbar-title>
        </v-toolbar>
        <v-card-text style="height:800px;">
          <v-row>
            <v-col class="font-weight-bold">Chemtest Definition</v-col>
          </v-row>
          <v-row>
            <v-col>
              TAT-R is the percentage of jobs reported on or by the due date
              divided by the total jobs due per month.
              <br />
              <br />Jobs that required additional testing, subcon analysis or
              had triggered testing are excluded from the late count.
              <br />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="font-weight-bold">Eurofins Definition</v-col>
          </v-row>
          <v-row>
            <v-col>
              TAT-R is the percentage of Samples Reported by (at or before) the
              Initially Confirmed Due Date and Time among all Samples Reported
              during a given time period and for a defined perimeter.
              <br />
              <br />TAT-R can be measured for any group of Reported Samples (any
              perimeter) and hence it is a universal KPI.
              <br />
              <br />TAT-R is not only the most versatile (applicable to most, if
              not all, Eurofins businesses) KPI but also the most important one
              as it measures performance against Customer expectation.
              <br />
              <br />TAT-R is expressed as a percentage with one decimal place.
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import barChart from "../../../components/charts/bar";
export default {
  components: { barChart },
  data() {
    return {
      loading: true,
      helpDialog: false,
      results: [],
      clientDialog: false,
      clientDialogSearch: "",
      chartType: "",
      clients: [],
      chartClients: [],
      currentMonth: [],
      previousMonth: [],
      tunaroundBarColours: ["#FFCDD2", "#E57373", "#E53935", "#B71C1C"],
      chartSettings: {
        chartData: {
          labels: [],
          datasets: [
            {
              label: "% On Time",
              data: [],
              fill: false,
              borderColor: "black",
              type: "line"
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
    currentMonthBetter() {
      if (this.currentMonth.TATR > this.previousMonth.TATR) {
        return true;
      } else {
        return false;
      }
    },
    dialogClientList() {
      if (this.clientDialogSearch.length < 2) {
        return this.currentMonth.clients;
      } else {
        let filteredClients = {};
        Object.keys(this.currentMonth.clients).forEach(clientName => {
          if (
            clientName
              .toLowerCase()
              .indexOf(this.clientDialogSearch.toLowerCase()) > -1
          ) {
            filteredClients[clientName] = this.currentMonth.clients[clientName];
          }
        });
        return filteredClients;
      }
    },
    chartData() {
      return this.chartSettings.chartData;
    }
  },
  mounted() {
    this.getTATRResults();
  },
  methods: {
    getTATRResults() {
      this.$axios
        .get("http://chemtest-api.chemtest.local/api/stats/tat-r")
        .then(response => {
          this.results = response.data;
          this.setCurrentMonth();
          this.setPreviousMonth();
          this.setCurrentMonthClients();
          this.setChartLabels();
          this.setChartTotalsData();
          this.setChartTurnaroundData();
          this.createClientList();
        })
        .then(() => {
          this.loading = false;
        });
    },
    setCurrentMonth() {
      let key = this.$moment().format("YY") + this.$moment().format("MM");
      console.log(key);
      this.currentMonth = this.results.totals[key];
      this.currentMonth.TATR = (
        (this.currentMonth.JobsOnTime / this.currentMonth.JobsDue) *
        100
      ).toFixed(1);
    },

    setPreviousMonth() {
      var key = this.$moment()
        .subtract(1, "months")
        .format("YYMM");
      console.log(key);
      this.previousMonth = this.results.totals[key];
      this.previousMonth.TATR = (
        (this.previousMonth.JobsOnTime / this.previousMonth.JobsDue) *
        100
      ).toFixed(1);
    },

    setCurrentMonthClients() {
      //Set TAT R for each client for current month and append value for previous month for comparison
      Object.keys(this.currentMonth.clients).forEach(client => {
        this.currentMonth.clients[client].currentTAT = (
          (this.currentMonth.clients[client].JobsOnTime /
            this.currentMonth.clients[client].JobsDue) *
          100
        ).toFixed(1);
        if (this.previousMonth.clients[client]) {
          var previousTat = (
            (this.previousMonth.clients[client].JobsOnTime /
              this.previousMonth.clients[client].JobsDue) *
            100
          ).toFixed(1);
        } else {
          var previousTat = "N/A ";
        }
        this.currentMonth.clients[client].previousTAT = previousTat;
      });
    },

    setChartLabels() {
      this.results.labels.forEach(yearMonth => {
        let year = yearMonth.substring(0, 2);
        let month = yearMonth.substring(2, 4);
        let monthName = this.$moment()
          .month(month - 1)
          .format("MMM");
        this.chartSettings.chartData.labels.push(monthName + " " + year);
      });
    },

    setChartTotalsData() {
      this.results.labels.forEach(label => {
        let tatR = (
          (this.results.totals[label].JobsOnTime /
            this.results.totals[label].JobsDue) *
          100
        ).toFixed(1);
        this.chartSettings.chartData.datasets[0].data.push(tatR);
      });
    },

    setChartTurnaroundData() {
      let i = 1;
      Object.keys(this.results.turnarounds).forEach(turnaround => {
        //Push empty object to datasets for each turnaround
        this.chartSettings.chartData.datasets.push({
          label: turnaround + " Day On Time",
          data: [],
          fill: false,
          barPercentage: 0.3,
          backgroundColor: this.tunaroundBarColours[i - 1]
        });
        //Add data to dataset
        Object.keys(this.results.turnarounds[turnaround]).forEach(yearMonth => {
          let tatR = (
            (this.results.turnarounds[turnaround][yearMonth].JobsOnTime /
              this.results.turnarounds[turnaround][yearMonth].JobsDue) *
            100
          ).toFixed(1);
          this.chartSettings.chartData.datasets[i].data.push(tatR);
        });
        i++;
      });
      this.chartType = "turnarounds";
    },

    createClientList() {
      Object.keys(this.results.clients).forEach(client => {
        this.clients.push(client);
      });
    },

    radioSelected(e) {
      if (e == "turnarounds") {
        this.turnaroundChart();
      }
    },

    clientChart() {
      this.loading = true;
      this.$nextTick(() => {
        this.chartSettings.chartData.datasets.length = 1;
        var i = 1;
        this.chartClients.forEach(client => {
          this.chartSettings.chartData.datasets.push({
            label: client + " % On Time",
            data: [],
            fill: false,
            barPercentage: 0.3,
            backgroundColor: this.tunaroundBarColours[i - 1]
          });
          this.results.labels.forEach(yearMonth => {
            if (this.results.clients[client][yearMonth]) {
              var tatR = (
                (this.results.clients[client][yearMonth].JobsOnTime /
                  this.results.clients[client][yearMonth].JobsDue) *
                100
              ).toFixed(1);
            } else {
              var tatR = 0;
            }
            this.chartSettings.chartData.datasets[i].data.push(tatR);
          });
          i++;
        });
        this.loading = false;
      });
    },

    turnaroundChart() {
      this.loading = true;
      this.$nextTick(() => {
        this.chartSettings.chartData.datasets.length = 1;
        this.setChartTurnaroundData();
        this.loading = false;
      });
    }
  }
};
</script>

<style></style>
