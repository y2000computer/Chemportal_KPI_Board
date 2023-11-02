<template>
  <v-row>
    <v-col>
      <v-tabs grow>
        <v-tab>Detail View</v-tab>
        <v-tab>Summary View</v-tab>
        <v-tab-item>
          <v-row dense>
            <v-col md="4" cols="12">
              <v-subheader class="font-weight-bold">
                Sample Stats for
                {{ $moment(this.date).format('dddd, MMMM Do YYYY') }}
              </v-subheader>
            </v-col>

            <v-col md="4" cols="12" class="text-center">
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
                  v-model="date"
                  color="primary"
                  no-title
                  @change="dateChanged()"
                ></v-date-picker>
              </v-menu>
              <v-btn icon @click="dateChange(1)">+1</v-btn>
            </v-col>
            <v-col md="4" cols="12" class="text-right">
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
                    <v-col class="display-2">{{ todaysSamples.logged }}</v-col>
                    <v-col class="subtitle-2">Samples Registered</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">{{
                      todaysSamples.loggedWithTesting
                    }}</v-col>
                    <v-col class="subtitle-2">Registered With Testing</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">{{ todaysSamples.due }}</v-col>
                    <v-col class="subtitle-2">Samples Due</v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined>
                <v-card-text>
                  <v-row align="center">
                    <v-col class="display-2">{{
                      todaysSamples.reported
                    }}</v-col>
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
                                  >{{ todaysSamples.logged }}</v-col
                                >
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
                                  >{{ todaysSamples.loggedWithTesting }}</v-col
                                >
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row dense align="center">
                                <v-col>Off Hold for Testing</v-col>
                                <v-col
                                  class="text-right subtitle-2 font-weight-medium"
                                  >{{ todaysSamples.offHold }}</v-col
                                >
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
                                    >{{ todaysSamples.loggedThreeDay }}</v-chip
                                  >
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
                                      parseInt(todaysSamples.loggedFourDay) +
                                        parseInt(todaysSamples.loggedFiveDay)
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
                                    >{{
                                      todaysSamples.loggedSixSevenDay
                                    }}</v-chip
                                  >
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
                                        todaysSamples.loggedEightNineDay
                                      ) + parseInt(todaysSamples.loggedTenDay)
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
                <v-col
                  md="6"
                  cols="12"
                  :class="$vuetify.breakpoint.mdAndUp ? 'pr-6' : 'pb-4'"
                >
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
                                      >{{ todaysSamples.due }}</v-col
                                    >
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Reported Today</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                      >{{ todaysSamples.reportedDue }}</v-col
                                    >
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Reported Early</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                      >{{ todaysSamples.duePrevRep }}</v-col
                                    >
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
                                      >{{
                                        todaysSamples.dueAwaitingApproval
                                      }}</v-col
                                    >
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
                                      >{{
                                        todaysSamples.dueAwaitingReporting
                                      }}</v-col
                                    >
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
                                      >{{ todaysSamples.dueIncomplete }}</v-col
                                    >
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
                                    <v-col>Samples Reported</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                      >{{ todaysSamples.reported }}</v-col
                                    >
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Due Today</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                      >{{ todaysSamples.reportedDue }}</v-col
                                    >
                                  </v-row>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>
                                  <v-row dense align="center">
                                    <v-col>Reported Early</v-col>
                                    <v-col
                                      class="text-right subtitle-2 font-weight-medium"
                                      >{{ todaysSamples.reportedEarly }}</v-col
                                    >
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
                                      >{{ todaysSamples.reportedLate }}</v-col
                                    >
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
                        <v-col md="6" cols="12">YTD Data vs Last Year</v-col>
                        <v-col md="6" cols="12">
                          <v-select
                            dense
                            outlined
                            hide-details
                            v-model="ytdSelected"
                            :items="ytdOptions"
                            item-text="label"
                            item-value="column"
                            @change="this.updateYtdChart"
                            >Test</v-select
                          >
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
              <v-subheader>Daily Sample Summary</v-subheader>
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
                      {{ $moment(item.date).format('Do MMM YYYY') }}
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
import pieChart from '../../../components/charts/pie';
import lineChart from '../../../components/charts/line';

export default {
  components: { pieChart, lineChart },
  data() {
    return {
      tab: null,
      dateMenu: false,
      date: this.$moment().format('YYYY-MM-DD'),
      todaysSamples: [],
      thisMonthsSamples: [],
      lastMonthsSamples: [],
      YTDSamples: [],
      lastYTDSamples: [],
      ytdOptions: [
        { label: 'Samples Registered', column: 'logged' },
        {
          label: 'Samples Registered With Testing',
          column: 'loggedWithTesting',
        },
        { label: 'Samples Reported', column: 'reported' },
      ],
      ytdSelected: 'reported',
      turnaroundChart: {
        loading: true,
        styles: {
          position: 'relative',
          height: '250px',
          width: '250px',
        },
        chartData: {
          labels: ['3 Day', '5 Day', '6/7 Day', '8/9 Day', '10 Day'],
          datasets: [
            {
              data: [],
              backgroundColor: [
                '#e0e0e0',
                '#e57373',
                '#9e9e9e',
                '#ef5350',
                '#616161',
              ],
            },
          ],
        },
        chartSettings: {
          options: {
            layout: {},
            legend: {
              display: false,
            },

            cutoutPercentage: 50,
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        },
      },
      ytdChart: {
        loading: true,
        chartData: {
          labels: [],
          datasets: [
            {
              label: '2020',
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: '#ef5350',
            },
            {
              label: '2019',
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: '#616161',
            },
          ],
        },
        chartSettings: {
          options: {
            legend: {
              position: 'bottom',
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Day No.',
                  },
                },
              ],
            },
          },
        },
      },
      summaryHeaders: [
        { text: 'Date', value: 'date' },
        { text: 'Logged', value: 'logged' },
        { text: 'Logged (w/Test)', value: 'loggedWithTesting' },
        { text: 'Due', value: 'due' },
        { text: 'Due (Incomplete)', value: 'dueIncomplete' },
        { text: 'Completed', value: 'complete' },
        { text: 'Approved', value: 'approved' },
        { text: 'Reported', value: 'reported' },
      ],

      summaryData: [],
    };
  },
  mounted() {
    this.getData();
    this.date = this.$moment().format('YYYY-MM-DD');
  },
  computed: {
    excelExportHeaders() {
      if (this.summaryHeaders.length > 0) {
        var headers = [];
        this.summaryHeaders.forEach((header) => {
          console.log(header);
          headers.push({
            label: header.text,
            field: header.value,
          });
        });
        return headers;
      }
    },
  },
  methods: {
    getData() {
      this.turnaroundChart.loading = true;
      this.ytdChart.loading = true;
      this.getTodaysSamples();
      this.getYtdSamples();
      this.getDailySummary();
    },
    dateChange(val) {
      this.date = this.$moment(this.date)
        .add(val, 'days')
        .format('YYYY-MM-DD');
      this.dateChanged();
    },
    dateChanged() {
      this.getTodaysSamples();
    },
    getTodaysSamples() {
      this.$axios
        .get('stats/dw-sample-counts-by-date?date1=' + this.date)
        .then((response) => {
          this.todaysSamples = response.data[0];
          this.updateTurnaroundChart();
        });
    },
    updateTurnaroundChart() {
      this.turnaroundChart.loading = true;
      this.$nextTick(() => {
        this.turnaroundChart.chartData.datasets[0].data = [];
        this.turnaroundChart.chartData.datasets[0].data.push(
          this.todaysSamples.loggedThreeDay,
          this.todaysSamples.loggedFiveDay,
          this.todaysSamples.loggedSixSevenDay,
          this.todaysSamples.loggedEightNineDay,
          this.todaysSamples.loggedTenDay
        );
        this.turnaroundChart.loading = false;
      });
    },
    getYtdSamples() {
      var today = this.$moment().format('YYYY-MM-DD');
      this.$axios
        .get('stats/dw-ytd-sample-daily-counts?date=' + today)
        .then((response) => {
          this.YTDSamples = response.data;
          this.updateYtdChart();
        });
    },
    getDailySummary() {
      this.$axios
        .get('stats/dw-sample-counts-by-date-summary')
        .then((response) => {
          this.summaryData = response.data;
        });
    },
    updateYtdChart() {
      this.ytdChart.loading = true;
      this.loading = true;
      this.$nextTick(() => {
        this.ytdChart.chartData.labels = [];
        var length =
          this.YTDSamples.currentYear.length > this.YTDSamples.lastYear.length
            ? this.YTDSamples.currentYear.length
            : this.YTDSamples.lastYear.length;
        var i = 0;
        while (i < length) {
          this.ytdChart.chartData.labels.push(i);
          i++;
        }
        this.ytdChart.chartData.datasets[0].data = [];
        this.ytdChart.chartData.datasets[1].data = [];
        this.YTDSamples.currentYear.forEach((sample) => {
          this.ytdChart.chartData.datasets[0].data.push(
            sample[this.ytdSelected]
          );
        });
        this.YTDSamples.lastYear.forEach((sample) => {
          this.ytdChart.chartData.datasets[1].data.push(
            sample[this.ytdSelected]
          );
        });

        this.ytdChart.loading = false;
      });
    },
    exportTable() {
      alert('Coming Soon');
    },
  },
};
</script>

<style></style>
