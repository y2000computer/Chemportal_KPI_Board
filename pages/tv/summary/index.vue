<template>
  <v-row>
    <v-col>
      <v-window v-model="window">
        <v-window-item>
          <v-row no-gutters class="px-4"
            ><v-col><v-subheader>TAT R</v-subheader></v-col></v-row
          >
          <v-row class="mt-0">
            <v-col
              v-for="(group, index) in tatrGroups"
              :key="'tatrGroup' + index"
              ><v-card outlined :loading="loading"
                ><v-card-text class="text-center"
                  ><v-row dense align="center"
                    ><v-col></v-col
                    ><v-col class="text-h6">{{ group.title }}</v-col
                    ><v-col class="text-caption">{{
                      group.previousValue ? group.previousValueLabel : ""
                    }}</v-col></v-row
                  ><v-row align="center"
                    ><v-col></v-col
                    ><v-col class="text-h2 font-weight-medium">{{
                      (_.get(data, group.value) || "") + "%"
                    }}</v-col
                    ><v-col class="text-h6"
                      ><div v-if="group.previousValue">
                        <v-icon
                          large
                          :color="
                            _.get(data, group.value) >
                            _.get(data, group.previousValue)
                              ? 'green'
                              : 'red'
                          "
                          >{{
                            _.get(data, group.value) >
                            _.get(data, group.previousValue)
                              ? "mdi-menu-up"
                              : "mdi-menu-down"
                          }}</v-icon
                        >
                        ({{ (_.get(data, group.previousValue) || "") + "%" }})
                      </div></v-col
                    ></v-row
                  ><v-row dense class="text-subtitle-1">
                    <v-col>Prep: {{ _.get(data, group.prepValue) }}%</v-col>
                    <v-col
                      >Organics: {{ _.get(data, group.organicsValue) }}%</v-col
                    >
                    <v-col
                      >Inorganics:
                      {{ _.get(data, group.inorganicsValue) }}%</v-col
                    >
                  </v-row></v-card-text
                ></v-card
              ></v-col
            >
          </v-row>
          <v-row no-gutters
            ><v-col><v-subheader>Samples Instructed</v-subheader></v-col></v-row
          >
          <v-row class="mt-0">
            <v-col
              v-for="(group, index) in sampleGroups"
              :key="'tatrGroup' + index"
              ><v-card outlined :loading="loading"
                ><v-card-text class="text-center"
                  ><v-row dense align="center"
                    ><v-col></v-col
                    ><v-col class="text-h6">{{ group.title }}</v-col
                    ><v-col class="text-caption">{{
                      group.previousValue ? group.previousValueLabel : ""
                    }}</v-col></v-row
                  ><v-row align="center"
                    ><v-col>Total</v-col
                    ><v-col class="text-h2 font-weight-medium">{{
                      _.get(data, group.value) || ""
                    }}</v-col
                    ><v-col class="text-h5"
                      ><div v-if="group.previousValue">
                        ({{ _.get(data, group.previousValue) || "--" }})
                      </div></v-col
                    ></v-row
                  ><v-row align="center">
                    <v-col>Per Working Day</v-col
                    ><v-col class="text-h4 font-weight-medium">{{
                      _.get(data, group.wdValue) || "--"
                    }}</v-col
                    ><v-col class="text-body-1"
                      ><div v-if="group.wdPreviousValue">
                        <v-icon
                          large
                          :color="
                            parseFloat(_.get(data, group.wdValue)) >
                            parseFloat(_.get(data, group.wdPreviousValue))
                              ? 'green'
                              : 'red'
                          "
                          >{{
                            parseFloat(_.get(data, group.wdValue)) >
                            parseFloat(_.get(data, group.wdPreviousValue))
                              ? "mdi-menu-up"
                              : "mdi-menu-down"
                          }}</v-icon
                        >
                        ({{ _.get(data, group.wdPreviousValue) || "" }})
                      </div></v-col
                    >
                  </v-row></v-card-text
                ></v-card
              ></v-col
            ></v-row
          >
          <v-row
            ><v-col
              ><v-card outlined
                ><v-card-text>
                  <v-row>
                    <v-col>
                      Weekly Samples With Testing (vs Previous Year)
                    </v-col>
                  </v-row>
                  <bar-chart
                    style="height:220px"
                    v-if="!loading"
                    :options="chartSettings.options"
                    :chartdata="chartData"
                  ></bar-chart></v-card-text></v-card></v-col></v-row
        ></v-window-item>
        <v-window-item>
          <v-row>
            <v-col>
              <v-card flat class="pa-4">
                <v-img
                  src="images/Triumph Update.png"
                  height="85vh"
                  contain
                /> </v-card
            ></v-col>
          </v-row>
        </v-window-item>
      </v-window>
      <v-footer absolute
        ><v-col class="font-weight-medium text-right"
          >Values Last Updated:
          {{ $moment(lastUpdate).format("DD/MM/YY H:m") }}</v-col
        ></v-footer
      >
    </v-col></v-row
  >
</template>

<script>
import barChart from "../../../components/charts/bar";
export default {
  layout: "tv",
  auth: false,
  components: {
    barChart,
  },
  data() {
    return {
      window: 0,
      data: [],
      lastUpdate: "",
      loading: false,
      timer: "",
      pageTime: "",
      tatrGroups: [
        {
          title: "Today",
          value: "tatrValues.today.PercentSamplesOnTime",
          organicsValue: "tatrValues.today.PercentOrganicsSamplesOnTime",
          prepValue: "tatrValues.today.PercentPrepSamplesOnTime",
          inorganicsValue: "tatrValues.today.PercentInorganicsSamplesOnTime",
        },
        {
          title: "This Week",
          value: "currentWeekCounts.tatr.PercentSamplesOnTime",
          previousValueLabel: "(vs Last Week)",
          previousValue: "lastWeekCounts.tatr.PercentSamplesOnTime",
          organicsValue: "lastWeekCounts.tatr.PercentOrganicsSamplesOnTime",
          prepValue: "lastWeekCounts.tatr.PercentPrepSamplesOnTime",
          inorganicsValue: "lastWeekCounts.tatr.PercentInorganicsSamplesOnTime",
        },
        {
          title: "This Month",
          value: "tatr.PercentSamplesOnTime",
          previousValueLabel: "(vs Last Month)",
          previousValue: "lastMonthCounts.tatr.PercentSamplesOnTime",
          organicsValue: "lastMonthCounts.tatr.PercentOrganicsSamplesOnTime",
          prepValue: "lastMonthCounts.tatr.PercentPrepSamplesOnTime",
          inorganicsValue:
            "lastMonthCounts.tatr.PercentInorganicsSamplesOnTime",
        },
      ],
      sampleGroups: [
        {
          title: "Today",
          value: "dayCounts.SamplesInstructed",
          previousValueLabel: "(vs Yesterday)",
          previousValue: "yesterdayCounts.SamplesInstructed",
        },
        {
          title: "This Week",
          value: "currentWeekCounts.samples.SamplesInstructed",
          previousValueLabel: "(vs Last Week)",
          previousValue: "lastWeekCounts.samples.SamplesInstructed",
          wdValue: "currentWeekCounts.samplesWorkingDay.SamplesInstructed",
          wdPreviousValue: "lastWeekCounts.samplesWorkingDay.SamplesInstructed",
        },
        {
          title: "This Month",
          value: "currentMonthCounts.samples.SamplesInstructed",
          previousValueLabel: "(vs Last Month)",
          previousValue: "lastMonthCounts.samples.SamplesInstructed",
          wdValue: "currentMonthCounts.samplesWorkingDay.SamplesInstructed",
          wdPreviousValue:
            "lastMonthCounts.samplesWorkingDay.SamplesInstructed",
        },
      ],
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
      if (this.data.length == 0) {
        return {};
      }
      let chartData = {};
      chartData.labels = [];
      var prevChartColumn = "prevYearTestedSamples";

      var currentChartColumn = "currentYearTestedSamples";

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
      ];
      this.data[prevChartColumn].forEach((date) => {
        chartData.labels.push(date.calendar_week);
        chartData.datasets[0].data.push(date.Samples);
        chartData.datasets[1].data.push(date.movingAverage);
      });
      this.data[currentChartColumn].forEach((data) => {
        chartData.datasets[2].data.push(data.Samples);
        chartData.datasets[3].data.push(
          data.movingAverage > 0 ? data.movingAverage : null
        );
      });
      return chartData;
    },
  },
  mounted() {
    this.getData();
    //this.pageTimer = setInterval(this.changeWindow, 30000);
    this.timer = setInterval(this.getData, 120000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getData() {
      this.loading = true;
      this.$axios
        .get("http://chem-api-v2.chemtest.local/api/stats/dw-tv-summary")
        .then((response) => {
          this.data = response.data.data;
          this.lastUpdate = response.data.meta.last_update;
          this.loading = false;
        });
    },
    changeWindow() {
      console.log("test");
      this.window++;
    },
  },
};
</script>

<style></style>
