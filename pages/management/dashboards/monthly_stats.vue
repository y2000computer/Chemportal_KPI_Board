<template>
  <v-row>
    <v-col>
      <v-tabs grow>
        <v-tab>Detail View</v-tab>
        <v-tab>Summary View</v-tab>
        <v-tab-item>
          <v-row>
            <v-col>
              <v-subheader class="font-weight-bold">
                Sample Stats for
                {{ $moment(this.date).format('MMMM YYYY') }}
              </v-subheader>
            </v-col>
            <v-col class="text-center">
              <v-btn icon @click="dateChange(-1)">-1</v-btn>
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                max-height="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>calendar_today</v-icon>
                  </v-btn>
                </template>
                <v-date-picker
                  type="month"
                  v-model="date"
                  color="primary"
                  no-title
                  @change="dateChanged()"
                ></v-date-picker>
              </v-menu>
              <v-btn icon @click="dateChange(1)">+1</v-btn>
            </v-col>

            <v-col class="text-right">
              <v-btn icon @click="getData">
                <v-icon>refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">{{ monthsSamples.logged }}</v-col>
                    <v-col class="subtitle-2">Samples Registered</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">{{ monthsSamples.loggedWithTesting }}</v-col>
                    <v-col class="subtitle-2">Registered With Testing</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">{{ monthsSamples.due }}</v-col>
                    <v-col class="subtitle-2">Samples Due</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">
                      {{
                      monthsSamples.reported
                      }}
                    </v-col>
                    <v-col class="subtitle-2">Samples Reported</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4" cols="12">
              <v-card outlined>
                <v-card-text>
                  <v-row dense>
                    <v-col>Registration</v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-list dense>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row dense align="center">
                                <v-col>Samples Registered</v-col>
                                <v-col
                                  class="text-right subtitle-2 font-weight-medium"
                                >{{ monthsSamples.logged }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row dense align="center">
                                <v-col>
                                  Average Registered Per Working Day ({{
                                  monthsSamples.workingDays
                                  }})
                                </v-col>
                                <v-col
                                  class="text-right subtitle-2 font-weight-medium"
                                >{{ monthsSamples.loggedPerDay }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row dense align="center">
                                <v-col>Samples Registered with Testing</v-col>
                                <v-col
                                  class="text-right subtitle-2 font-weight-medium"
                                >{{ monthsSamples.loggedWithTesting }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row dense align="center">
                                <v-col>
                                  Average Registered Per Working Day (w/Testing)
                                  ({{ monthsSamples.workingDays }})
                                </v-col>
                                <v-col
                                  class="text-right subtitle-2 font-weight-medium"
                                >{{ monthsSamples.loggedTestPerDay }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-subheader>Turnarounds</v-subheader>
                  </v-row>
                  <v-row v-if="!turnaroundChart.loading">
                    <v-col>
                      <v-list dense>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row align="center" dense>
                                <v-col>3 Day:</v-col>
                                <v-col class="text-right">
                                  <v-chip
                                    :color="
                                      turnaroundChart.chartData.datasets[0]
                                        .backgroundColor[0]
                                    "
                                  >{{ monthsSamples.loggedThreeDay }}</v-chip>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row align="center" dense>
                                <v-col>5 Day:</v-col>
                                <v-col class="text-right">
                                  <v-chip
                                    :color="
                                      turnaroundChart.chartData.datasets[0]
                                        .backgroundColor[1]
                                    "
                                  >
                                    {{
                                    parseInt(monthsSamples.loggedFourDay) +
                                    parseInt(monthsSamples.loggedFiveDay)
                                    }}
                                  </v-chip>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row align="center" dense>
                                <v-col>7 Day:</v-col>
                                <v-col class="text-right">
                                  <v-chip
                                    :color="
                                      turnaroundChart.chartData.datasets[0]
                                        .backgroundColor[2]
                                    "
                                  >
                                    {{
                                    monthsSamples.loggedSixSevenDay
                                    }}
                                  </v-chip>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row align="center" dense>
                                <v-col>10 Day:</v-col>
                                <v-col class="text-right">
                                  <v-chip
                                    :color="
                                      turnaroundChart.chartData.datasets[0]
                                        .backgroundColor[3]
                                    "
                                  >
                                    {{
                                    parseInt(
                                    monthsSamples.loggedEightNineDay
                                    ) + parseInt(monthsSamples.loggedTenDay)
                                    }}
                                  </v-chip>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col>
                      <pie-chart
                        v-if="!turnaroundChart.loading"
                        :options="turnaroundChart.chartSettings.options"
                        :chartdata="turnaroundChart.chartData"
                        :styles="turnaroundChart.styles"
                      ></pie-chart>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="8" cols="12">
              <v-row no-gutters>
                <v-col md="6" cols="12" :class="$vuetify.breakpoint.mdAndUp ? 'pr-6' : 'pb-4'">
                  <v-card outlined>
                    <v-card-text>
                      <v-row dense>
                        <v-col>Samples Due</v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-list dense>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Samples Due</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.due }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Reported On Due Date or Prior</v-col>
                                    <v-col class="text-right subtitle-2 font-weight-medium">
                                      {{
                                      parseInt(monthsSamples.reportedDue) +
                                      parseInt(monthsSamples.duePrevRep)
                                      }}
                                    </v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Complete Awaiting Approval</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.dueAwaitingApproval }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Approved Awaiting Reporting</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.dueAwaitingReporting }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Incomplete</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.dueIncomplete }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col md="6" cols="12">
                  <v-card outlined>
                    <v-card-text>
                      <v-row dense>
                        <v-col>Samples Reported</v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <v-list dense>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>
                                      Samples Reported (vs Budget
                                      Target)
                                    </v-col>
                                    <v-col class="text-right subtitle-2 font-weight-medium">
                                      {{ monthsSamples.reported }}
                                      <span
                                        v-if="
                                          parseInt(monthsSamples.reported) <
                                            parseInt(
                                              monthlyBudget.budgeted_samples_per_month
                                            )
                                        "
                                        class="red--text"
                                      >
                                        ({{
                                        monthlyBudget.budgeted_samples_per_day *
                                        monthsSamples.workingDays
                                        }})
                                      </span>
                                      <span v-else class="green--text">
                                        ({{
                                        monthlyBudget.budgeted_samples_per_day *
                                        monthsSamples.workingDays
                                        }})
                                      </span>
                                    </v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>
                                      Samples Reported Per Working Day (vs
                                      Budget Target)
                                    </v-col>
                                    <v-col class="text-right subtitle-2 font-weight-medium">
                                      {{ monthsSamples.reportedPerDay }}
                                      <span
                                        v-if="
                                          parseInt(
                                            monthsSamples.reportedPerDay
                                          ) >
                                            parseInt(
                                              monthlyBudget.budgeted_samples_per_day
                                            )
                                        "
                                        class="green-text"
                                      >
                                        ({{
                                        monthlyBudget.budgeted_samples_per_day
                                        }})
                                      </span>
                                      <span v-else class="red--text">
                                        ({{
                                        monthlyBudget.budgeted_samples_per_day
                                        }})
                                      </span>
                                    </v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Reported On Due Date</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.reportedDue }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>
                                      Reported Early (includes additional
                                      testing)
                                    </v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.reportedEarly }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Reported Late</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                    >{{ monthsSamples.reportedLate }}</v-col>
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card outlined>
                    <v-card-text>
                      <v-row dense>
                        <v-col>YTD vs Last Year (per Working Day)</v-col>
                        <v-col>
                          <v-select
                            dense
                            outlined
                            hide-details
                            v-model="ytdSelected"
                            :items="ytdOptions"
                            item-text="label"
                            item-value="column"
                            @change="this.updateYtdChart"
                          >Test</v-select>
                        </v-col>
                      </v-row>
                      <v-row dense>
                        <v-col>
                          <line-chart
                            v-if="!ytdChart.loading"
                            style="height:200px;"
                            :options="ytdChart.chartSettings.options"
                            :chartdata="ytdChart.chartData"
                          ></line-chart>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item>
          <v-row dense>
            <v-col>
              <v-subheader>Monthly Sample Summary</v-subheader>
            </v-col>
            <v-col>
              <v-btn class="float-right" icon @click="getData">
                <v-icon>refresh</v-icon>
              </v-btn>
              <v-btn class="float-right" icon @click="exportTable">
                <v-icon>save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-data-table
                    disable-pagination
                    hide-default-footer
                    :headers="summaryHeaders"
                    :items="summaryData"
                  >
                    <template v-slot:item.date="{ item }">
                      {{
                      $moment(item.month, 'MM').format('MMM') +
                      ' ' +
                      item.year
                      }}
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import pieChart from "../../../components/charts/pie";
import lineChart from "../../../components/charts/line";
export default {
  components: { pieChart, lineChart },
  data() {
    return {
      date: this.$moment().format("YYYY-MM-DD"),
      filterTypes: ["Client", "Sales Region", "Department"],
      filterTypes: [
        {
          name: "Client",
          route: "stats/dw-sample-counts-by-client-by-month"
        },
        { name: "Sales Region" },
        { name: "Department" }
      ],

      monthsSamples: [],
      monthlyBudget: [],
      YTDSamples: [],
      lastYTDSamples: [],
      ytdOptions: [
        { label: "Samples Registered", column: "loggedPerDay" },
        {
          label: "Samples Registered With Testing",
          column: "loggedTestPerDay"
        },
        { label: "Samples Reported", column: "reportedPerDay" }
      ],
      ytdSelected: "reportedPerDay",
      turnaroundChart: {
        loading: true,
        styles: {
          position: "relative",
          height: "250px",
          width: "250px"
        },
        chartData: {
          labels: ["3 Day", "5 Day", "6/7 Day", "8/9 Day", "10 Day"],
          datasets: [
            {
              data: [],
              backgroundColor: [
                "#e0e0e0",
                "#e57373",
                "#9e9e9e",
                "#ef5350",
                "#616161"
              ]
            }
          ]
        },
        chartSettings: {
          options: {
            legend: {
              display: false
            },

            cutoutPercentage: 50,
            tooltips: {
              mode: "index",
              intersect: false
            },
            responsive: true,
            maintainAspectRatio: false
          }
        }
      },
      ytdChart: {
        loading: true,
        chartData: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          datasets: [
            {
              label: "2020",
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: "#ef5350"
            },
            {
              label: "2019",
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: "#616161"
            }
          ]
        },
        chartSettings: {
          options: {
            legend: {
              position: "bottom"
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            },
            tooltips: {
              mode: "index",
              intersect: false
            },
            responsive: true,
            maintainAspectRatio: false
          }
        }
      },
      summaryHeaders: [
        { text: "Date", value: "date" },
        { text: "Logged", value: "logged" },
        { text: "Logged (w/Test)", value: "loggedWithTesting" },
        { text: "Due", value: "due" },
        { text: "Due (Incomplete)", value: "dueIncomplete" },
        { text: "Completed", value: "complete" },
        { text: "Approved", value: "approved" },
        { text: "Reported", value: "reported" }
      ],
      summaryData: []
    };
  },
  mounted() {
    this.date = this.$moment().format("YYYY-MM-DD");
    this.getData();
  },
  methods: {
    getData() {
      this.turnaroundChart.loading = true;
      this.ytdChart.loading = true;
      this.getMonthsSamples();
      this.getYtdSamples();
      this.getMonthlyBudget();
      this.getMonthlySummary();
    },
    dateChange(val) {
      this.date = this.$moment(this.date)
        .add(val, "months")
        .format("YYYY-MM-DD");
      this.dateChanged();
    },
    dateChanged() {
      this.getMonthsSamples();
      this.getMonthlyBudget();
    },
    getMonthsSamples() {
      var year = this.$moment(this.date).format("YYYY");
      var month = this.$moment(this.date).format("MM");
      this.$axios
        .get("stats/dw-sample-counts-by-month?year=" + year + "&month=" + month)
        .then(response => {
          this.monthsSamples = response.data;
          this.updateTurnaroundChart();
        });
    },
    updateTurnaroundChart() {
      this.turnaroundChart.loading = true;
      this.$nextTick(() => {
        this.turnaroundChart.chartData.datasets[0].data = [];
        this.turnaroundChart.chartData.datasets[0].data.push(
          this.monthsSamples.loggedThreeDay,
          this.monthsSamples.loggedFiveDay,
          this.monthsSamples.loggedSixSevenDay,
          this.monthsSamples.loggedEightNineDay,
          this.monthsSamples.loggedTenDay
        );
        this.turnaroundChart.loading = false;
      });
    },
    getMonthlyBudget() {
      var year = this.$moment(this.date).format("YYYY");
      var month = this.$moment(this.date).format("MM");
      this.$axios
        .get("stats/dw-monthly-budget?year=" + year + "&month=" + month)
        .then(response => {
          this.monthlyBudget = response.data;
        });
    },
    getMonthlySummary() {
      this.$axios
        .get("stats/dw-sample-counts-by-month-summary")
        .then(response => {
          this.summaryData = response.data;
        });
    },

    getYtdSamples() {
      var today = this.$moment().format("YYYY-MM-DD");
      this.$axios
        .get("stats/dw-ytd-sample-monthly-counts?date=" + today)
        .then(response => {
          this.YTDSamples = response.data;
          this.updateYtdChart();
        });
    },
    updateYtdChart() {
      this.ytdChart.loading = true;
      this.loading = true;
      this.$nextTick(() => {
        this.ytdChart.chartData.datasets[0].data = [];
        this.ytdChart.chartData.datasets[1].data = [];
        this.YTDSamples.currentYear.forEach(sample => {
          this.ytdChart.chartData.datasets[0].data.push(
            sample[this.ytdSelected]
          );
        });
        this.YTDSamples.lastYear.forEach(sample => {
          this.ytdChart.chartData.datasets[1].data.push(
            sample[this.ytdSelected]
          );
        });

        this.ytdChart.loading = false;
      });
    },
    exportTable() {
      alert("Coming Soon");
    }
  }
};
</script>

<style></style>
