<template>
  <v-row>
    <v-col>
      <v-row align="center">
        <v-col class="font-weight-medium"
          >Sample Summary for {{ $moment().format("MMMM YYYY") }}</v-col
        >
        <v-col>
          <div class="float-right">
            <v-btn icon>
              <v-icon>help</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4" sm="6" cols="12">
          <main-stat-card
            title="TAT-R"
            :loading="loading"
            :value="
              !loading && data.tatr.PercentSamplesOnTime
                ? data.tatr.PercentSamplesOnTime + '%'
                : '-'
            "
          ></main-stat-card>
        </v-col>
        <v-col md="4" sm="6" cols="12">
          <main-stat-card
            title="TAT-50"
            :loading="loading"
            :value="!loading && data.tat ? data.tat.tat50 + ' days' : '-'"
          ></main-stat-card>
        </v-col>
        <v-col md="4" sm="6" cols="12">
          <main-stat-card
            title="TAT-95"
            :loading="loading"
            :value="!loading && data.tat ? data.tat.tat95 + ' days' : '-'"
          ></main-stat-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6" cols="12">
          <v-card outlined>
            <v-card-subtitle>Sample Counts Summary</v-card-subtitle>
            <v-card-text>
              <v-simple-table dense v-if="!loading" class="font-weight-medium">
                <thead>
                  <tr>
                    <th></th>
                    <th>Today</th>
                    <th>Current Week</th>
                    <th>Current Month</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Samples Registered</td>
                    <td>{{ data.dayCounts.SamplesLogged }}</td>
                    <td>{{ data.weekCounts.SamplesLogged }}</td>
                    <td>{{ data.monthCounts.SamplesLogged }}</td>
                  </tr>
                  <tr>
                    <td>Samples Registered With Testing</td>
                    <td>{{ data.dayCounts.SamplesLoggedWithTesting }}</td>
                    <td>{{ data.weekCounts.SamplesLoggedWithTesting }}</td>
                    <td>{{ data.monthCounts.SamplesLoggedWithTesting }}</td>
                  </tr>
                  <tr>
                    <td>Samples Registered On Hold</td>
                    <td>{{ data.dayCounts.SamplesLoggedOnHold }}</td>
                    <td>{{ data.weekCounts.SamplesLoggedOnHold }}</td>
                    <td>{{ data.monthCounts.SamplesLoggedOnHold }}</td>
                  </tr>
                  <tr>
                    <td>Samples Taken Off Hold</td>
                    <td>{{ data.dayCounts.SamplesOffHold }}</td>
                    <td>{{ data.weekCounts.SamplesOffHold }}</td>
                    <td>{{ data.monthCounts.SamplesOffHold }}</td>
                  </tr>
                  <tr>
                    <td>Total Samples Instructed</td>
                    <td>{{ data.dayCounts.SamplesInstructed }}</td>
                    <td>{{ data.weekCounts.SamplesInstructed }}</td>
                    <td>{{ data.monthCounts.SamplesInstructed }}</td>
                  </tr>
                  <tr>
                    <td>Samples Due</td>
                    <td>{{ data.dayCounts.SamplesDue }}</td>
                    <td>{{ data.weekCounts.SamplesDue }}</td>
                    <td>{{ data.monthCounts.SamplesDue }}</td>
                  </tr>
                  <tr>
                    <td>Samples Completed</td>
                    <td>{{ data.dayCounts.SamplesCompleted }}</td>
                    <td>{{ data.weekCounts.SamplesCompleted }}</td>
                    <td>{{ data.monthCounts.SamplesCompleted }}</td>
                  </tr>
                  <tr>
                    <td>Samples Approved</td>
                    <td>{{ data.dayCounts.SamplesApproved }}</td>
                    <td>{{ data.weekCounts.SamplesApproved }}</td>
                    <td>{{ data.monthCounts.SamplesApproved }}</td>
                  </tr>
                  <tr>
                    <td>Samples Reported</td>
                    <td>{{ data.dayCounts.SamplesReported }}</td>
                    <td>{{ data.weekCounts.SamplesReported }}</td>
                    <td>{{ data.monthCounts.SamplesReported }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6" cols="12">
          <v-card outlined min-height="420">
            <v-card-subtitle
              >Top Clients - {{ $moment().format("MMMM YY") }}</v-card-subtitle
            >
            <v-card-text class="pb-0">
              <v-simple-table dense class="font-weight-medium">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Samples Registered</th>
                    <th>Samples w/Testing</th>
                    <th>Samples Reported</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="client in data.clientCounts"
                    :key="client.client_id"
                  >
                    <td>{{ client.client_name }}</td>
                    <td>{{ client.SamplesLogged }}</td>
                    <td>{{ client.SamplesLoggedTested }}</td>
                    <td>{{ client.SamplesReported }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-text>
              <v-row>
                <v-col></v-col>
                <v-col>
                  Weekly Sample Counts
                  {{ samplesWithTestingChart ? "with Testing" : "" }} (vs
                  Previous Year)
                </v-col>
                <v-col>
                  <v-btn
                    icon
                    :color="samplesWithTestingChart ? 'primary' : ''"
                    class="float-right"
                    @click="samplesWithTestingChart = !samplesWithTestingChart"
                  >
                    <v-icon>mdi-test-tube</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row
                ><v-col>
                  <bar-chart
                    style="height:220px"
                    v-if="!loading"
                    :options="chartSettings.options"
                    :chartdata="chartData"
                  ></bar-chart></v-col
              ></v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import mainStatCard from "./components/mainStatCard";
import barChart from "../../../components/charts/bar";
export default {
  components: { mainStatCard, barChart },
  data() {
    return {
      loading: true,
      data: [],
      samplesWithTestingChart: false,
      chartSettings: {
        options: {
          title: {
            display: false,
            text: "Weekly Sample Counts (vs Previous Year)",
          },
          legend: {
            display: true,
            position: "right",
          },
          tooltips: {
            mode: "index",
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
            xAxes: [{ ticks: {} }],
          },
        },
      },
    };
  },
  computed: {
    chartData() {
      let chartData = {};
      chartData.labels = [];
      let currentWeek = this.$moment()
        .isoWeek()
        .toString();
      var prevChartColumn = this.samplesWithTestingChart
        ? "prevYearTestedSamples"
        : "prevYearSamples";
      var currentChartColumn = this.samplesWithTestingChart
        ? "currentYearTestedSamples"
        : "currentYearSamples";
      chartData.datasets = [
        {
          label: "Samples Registed (2020)",
          data: [],
          type: "bar",
          barThickness: 7,
          order: 3,
          backgroundColor: "#6fadff",
        },
        {
          label: "Moving Average (2020)",
          data: [],
          type: "line",
          lineTension: 0.2,
          pointRadius: 0,
          backgroundColor: "#003883",
          borderColor: "#003883",
          borderWidth: 3,
          fill: false,
          order: 1,
        },
        {
          label: "Samples Registed (2021)",
          data: [],
          type: "bar",
          order: 4,
          backgroundColor: "#f6b97f",
          barThickness: 7,
        },
        {
          label: "Moving Average (2021)",
          data: [],
          type: "line",
          lineTension: 0.2,
          pointRadius: 0,
          borderWidth: 3,
          backgroundColor: "#EE7D11",
          borderColor: "#EE7D11",
          fill: false,
          order: 2,
        },
        // {
        //   label: 'Samples Registed (2021)',
        //   data: [],
        //   type: 'bar',
        //   order: 4,
        //   backgroundColor: '#f6b97f',
        //   barThickness: 7,
        // },
        // {
        //   label: 'Moving Average (2021)',
        //   data: [],
        //   type: 'line',
        //   lineTension: 0.2,
        //   pointRadius: 0,
        //   borderWidth: 3,
        //   backgroundColor: '#EE7D11',
        //   borderColor: '#EE7D11',
        //   fill: false,
        //   order: 2,
        // },
      ];

      this.data[prevChartColumn].forEach((date) => {
        chartData.labels.push(date.calendar_week);
        chartData.datasets[0].data.push(date.Samples);
        chartData.datasets[1].data.push(date.movingAverage);
      });
      this.data[currentChartColumn].forEach((data) => {
        chartData.datasets[2].data.push(data.Samples);
        chartData.datasets[3].data.push(
          data.calendar_week !== currentWeek && data.movingAverage > 0
            ? data.movingAverage
            : null
        );
      });
      return chartData;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios.get("stats/dw-summary").then((response) => {
        this.data = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
