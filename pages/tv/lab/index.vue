<template>
  <v-row>
    <v-col cols="2">
      <v-row>
        <v-col>
          Lab Stats
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-subheader>Today</v-subheader>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card :loading="statsLoading" outlined>
            <v-card-title class="text-subtitle-2">TAT-R</v-card-title>
            <v-card-text>
              <v-row class="text-h3 text-center">
                <v-col>
                  {{
                    stats.tatrValues
                      ? stats.tatrValues.today.PercentSamplesOnTime
                      : ""
                  }}%
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card :loading="statsLoading" outlined>
            <v-card-title class="text-subtitle-2">Samples In</v-card-title>
            <v-card-text class="text-h3 text-center">
              {{ stats.dayCounts ? stats.dayCounts.SamplesInstructed : "" }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-subheader>Current Week (vs Last Week)</v-subheader>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card :loading="statsLoading" outlined>
            <v-card-title class="text-subtitle-2">TAT-R</v-card-title>
            <v-card-text>
              <v-row class="text-h3 text-center">
                <v-col>
                  {{
                    stats.tatrValues
                      ? stats.tatrValues.currentWeek.PercentSamplesOnTime
                      : ""
                  }}%
                  <v-icon
                    large
                    :color="
                      stats.tatrValues.currentWeek.PercentSamplesOnTime >
                      stats.lastWeekCounts.tatr.PercentSamplesOnTime
                        ? 'green'
                        : 'red'
                    "
                    >{{
                      stats.tatrValues.currentWeek.PercentSamplesOnTime >
                      stats.lastWeekCounts.tatr.PercentSamplesOnTime
                        ? "mdi-menu-up"
                        : "mdi-menu-down"
                    }}</v-icon
                  >
                </v-col>
              </v-row>
              <v-row dense class="text-center">
                <v-col>
                  ({{ stats.lastWeekCounts.tatr.PercentSamplesOnTime }}%)
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card :loading="statsLoading" outlined>
            <v-card-title class="text-subtitle-2"
              >Samples In Per WD</v-card-title
            >
            <v-card-text>
              <v-row class="text-h3 text-center">
                <v-col>
                  {{
                    stats.currentWeekCounts
                      ? stats.currentWeekCounts.samplesWorkingDay
                          .SamplesInstructed
                      : ""
                  }}
                  <v-icon
                    large
                    :color="
                      stats.currentWeekCounts.samplesWorkingDay
                        .SamplesInstructed >
                      stats.lastWeekCounts.samplesWorkingDay.SamplesInstructed
                        ? 'green'
                        : 'red'
                    "
                    >{{
                      stats.currentWeekCounts.samplesWorkingDay
                        .SamplesInstructed >
                      stats.lastWeekCounts.samplesWorkingDay.SamplesInstructed
                        ? "mdi-menu-up"
                        : "mdi-menu-down"
                    }}</v-icon
                  >
                </v-col>
              </v-row>
              <v-row dense class="text-center">
                <v-col
                  >({{
                    stats.lastWeekCounts.samplesWorkingDay.SamplesInstructed
                  }})
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col>
      <v-row>
        <v-col lg="4" cols="12">Vip Client Jobs</v-col>
        <v-col lg="4" cols="12" class="text-center">
          <v-chip color="tableSuccess">Complete</v-chip>
          <v-chip color="tableWarnings">Incomplete</v-chip>
          <v-chip disabled>Not Required</v-chip>
        </v-col>
        <v-col lg="4" cols="12" class="text-h6 text-right">
          <v-chip color="primary">{{ activePage }}/{{ maxSlides }}</v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="job in slides[activePage]"
          :key="job.JOB"
          lg="4"
          md="6"
          cols="12"
        >
          <v-card outlined :loading="loading">
            <v-card-title>
              <v-row class="text-subtitle-2">
                <v-col cols="4">
                  {{ job.office.client.CLIENTNAME | shorten(15) }}
                </v-col>
                <v-col cols="3" class="text-center"
                  >{{ job.JOB }} ({{ job.samples.length }})</v-col
                >
                <v-col
                  cols="3"
                  class="text-center"
                  :class="dateColour(job.OFFICEDATE)"
                  >Due: {{ $moment(job.OFFICEDATE).format("DD/MM/YY") }}</v-col
                >
                <v-col cols="2" class="text-right">{{ job.JOBSTATUS }}</v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <template v-for="(dept, key) in job.sopCodes">
                <v-row :key="'dept' + key" align="center">
                  <v-col class="text-caption" cols="3">{{
                    key.toUpperCase()
                  }}</v-col>
                  <v-col cols="9">
                    <v-chip
                      v-for="(sop, key) in dept"
                      :key="'sop' + key"
                      small
                      :disabled="!sop.required && !sop.completed"
                      :color="chipColour(sop)"
                      class="ma-1"
                      >{{ key }}</v-chip
                    >
                  </v-col>
                </v-row>
                <v-divider :key="'dept' + key + 'divider'" />
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  layout: "tv",
  data() {
    return {
      today: this.$moment().format("YYYY-MM-DD"),
      jobsPerPage: 9,
      loading: true,
      statsLoading: false,
      stats: {},
      jobs: [],
      activePage: 1,
    };
  },
  mounted() {
    this.getJobs();
    this.getStats();
    setInterval(this.increaseActivePage, 15000);
    setInterval(this.getStats, 600000);
  },
  computed: {
    maxSlides() {
      return Math.ceil(this.jobs.length / this.jobsPerPage);
    },
    slides() {
      if (this.jobs.length > 0) {
        var i = 1;
        var slideArray = [];
        slideArray[i] = [];
        this.jobs.forEach((job, index) => {
          slideArray[i].push(job);
          if ((index + 1) % this.jobsPerPage == 0) {
            i++;
            slideArray[i] = [];
          }
        });
        return slideArray;
      }
      return [];
    },
  },
  methods: {
    getJobs() {
      this.loading = true;
      this.$axios
        .get(
          "http://chem-api-v2.chemtest.local/api/client-onboarding/active-jobs"
        )
        .then((response) => {
          this.jobs = response.data.data;
          this.loading = false;
        });
    },
    getStats() {
      this.statsLoading = true;
      this.$axios
        .get("http://chem-api-v2.chemtest.local/api/stats/dw-tv-summary")
        .then((response) => {
          this.stats = response.data.data;
          this.statsLoading = false;
        });
    },
    chipColour(sop) {
      if (sop.completed) {
        return "tableSuccess";
      }
      if (sop.required) {
        return "tableWarnings";
      }
    },
    dateColour(dueDate) {
      if (dueDate == this.today) {
        return "orange--text";
      } else if (this.today > dueDate) {
        return "red--text";
      }
    },
    increaseActivePage() {
      if (this.activePage == this.maxSlides) {
        this.activePage = 1;
        this.getJobs();
      } else {
        this.activePage++;
      }
    },
  },
};
</script>

<style></style>
