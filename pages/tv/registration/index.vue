<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <v-subheader>Todays Stats</v-subheader>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="2" cols="12">
          <v-card outlined>
            <v-card-title>Jobs Today</v-card-title>
            <v-card-text class="display-3 text-center">{{jobNumbers}}</v-card-text>
          </v-card>
        </v-col>
        <v-col md="2" cols="12">
          <v-card outlined>
            <v-card-title>Samples Today</v-card-title>
            <v-card-text class="display-3 text-center">{{sampleNumbers}}</v-card-text>
          </v-card>
        </v-col>
        <v-col md="2" cols="12">
          <v-card outlined>
            <v-card-title>Samples w/Testing</v-card-title>
            <v-card-text class="display-3 text-center">{{samplesWithTestNumbers}}</v-card-text>
          </v-card>
        </v-col>
        <v-col md="2" cols="12">
          <v-card outlined>
            <v-card-title>Jobs Released</v-card-title>
            <v-card-text class="display-3 text-center">{{releaseNumbers}}</v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-title>
              Weeks Sample Total
              <span class="font-weight-light ml-2">(vs EOD Last Week)</span>
            </v-card-title>
            <v-card-text class="display-3 text-center">
              {{thisWeeksSamplesNumbers}}
              <span
                v-if="lastWeeksSamplesNumbers"
                class="font-weight-thin"
              >({{(lastWeeksSamplesNumbers)}})</span>
              <v-icon
                v-if="thisWeeksSamplesNumbers && lastWeeksSamplesNumbers && (thisWeeksSamplesNumbers > lastWeeksSamplesNumbers)"
                x-large
                color="green"
              >arrow_drop_up</v-icon>
              <v-icon
                v-if="thisWeeksSamplesNumbers && lastWeeksSamplesNumbers && (thisWeeksSamplesNumbers < lastWeeksSamplesNumbers)"
                x-large
                color="red"
              >arrow_drop_down</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <v-subheader>User Stats</v-subheader>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-row>
            <v-col md="4" cols="12" v-for="(user, index) in userStats" :key="user.USER_NAME">
              <v-card outlined>
                <v-card-title>User {{index}}</v-card-title>
                <v-card-text class="text-center">
                  <v-row align="center" no-gutters>
                    <v-col md="4" cols="12">
                      <v-chip x-large class="display-1 pa-6">{{user.total}} Jobs</v-chip>
                    </v-col>
                    <v-col md="4" cols="12">
                      <v-progress-circular
                        class="headline text-center"
                        size="130"
                        width="10"
                        :value="barLength(user.sampcount)"
                        :color="barColour(user.sampcount)"
                      >
                        {{user.sampcount}}
                        <br />samples
                      </v-progress-circular>
                    </v-col>
                    <v-col md="4" cols="12">
                      <v-progress-circular
                        class="headline text-center"
                        size="130"
                        width="10"
                        :value="queryLength(user.queries, user.total)"
                        :color="queryColour(user.queries, user.total)"
                      >
                        {{(user.queries / user.total * 100).toFixed(0)}}%
                        <br />Queries
                      </v-progress-circular>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
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
      loaded: false,
      jobNumbers: "",
      jobNumbersLoading: false,
      sampleNumbers: "",
      sampleNumbersLoading: false,
      samplesWithTestNumbers: "",
      samplesWithTestNumbersLoading: false,
      releaseNumbers: "",
      releaseNumbersLoading: false,
      thisWeeksSamplesNumbers: "",
      lastWeeksSamplesNumbers: "",
      userStats: [],
      userStatsLoading: false
    };
  },

  created() {
    let date = this.$moment().format("YYYY-MM-DD");
    this.getJobStats(date);
    this.getReleaseStats(date);
    this.getSampleStats(date);
    this.getSampleStatsWithTesting(date);
    this.weeklyStats();
    this.getUserStats(date);
    setInterval(() => {
      let date = this.$moment().format("YYYY-MM-DD");
      this.getJobStats(date);
      this.getReleaseStats(date);
      this.getSampleStats(date);
      this.getSampleStatsWithTesting(date);
      this.weeklyStats();
      this.getUserStats(date);
    }, 120000);
  },

  methods: {
    async getJobStats(date) {
      this.jobNumbersLoading = true;
      await this.$axios.get("stats/jobs?date=" + date).then(response => {
        this.jobNumbers = response.data;
        this.jobNumbersLoading = false;
      });
    },
    async getSampleStats(date) {
      this.sampleNumbersLoading = true;
      await this.$axios.get("stats/samples?date=" + date).then(response => {
        this.sampleNumbers = response.data;
        this.sampleNumbersLoading = false;
      });
    },
    async getSampleStatsWithTesting(date) {
      this.samplesWithTestNumbersLoading = true;
      await this.$axios
        .get("stats/testingSamples?date=" + date)
        .then(response => {
          this.samplesWithTestNumbers = response.data;
          this.samplesWithTestNumbersLoading = false;
        });
    },
    async getReleaseStats(date) {
      this.releaseNumbersLoading = true;
      await this.$axios
        .get("stats/jobsReleased?date=" + date)
        .then(response => {
          this.releaseNumbers = response.data;
          this.releaseNumbersLoading = false;
        });
    },
    async weeklyStats() {
      let startDate = this.$moment()
        .startOf("week")
        .format("YYYY-MM-DD");

      let endDate = this.$moment().format("YYYY-MM-DD");

      let lastWeekStartDate = this.$moment()
        .subtract(7, "days")
        .startOf("week")
        .format("YYYY-MM-DD");
      let lastWeekEndDate = this.$moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      await this.$axios
        .get("stats/samples?start_date=" + startDate + "&end_date=" + endDate)
        .then(response => {
          this.thisWeeksSamplesNumbers = response.data;
        });
      await this.$axios
        .get(
          "stats/samples?start_date=" +
            lastWeekStartDate +
            "&end_date=" +
            lastWeekEndDate
        )
        .then(response => {
          this.lastWeeksSamplesNumbers = response.data;
        });
    },
    async getUserStats(date) {
      this.userStatsLoading = true;
      await this.$axios.get("/stats/regStats?date=" + date).then(response => {
        this.userStats = response.data;
        this.userStatsLoading = false;
      });
    },

    barLength(value) {
      if (value > 100) {
        return 100;
      } else {
        return value;
      }
    },

    barColour(value) {
      if (value >= 100) {
        return "green";
      }

      if (value > 70) {
        return "orange";
      }
      return "red";
    },

    queryLength(queries, jobs) {
      return (queries / jobs) * 100;
    },

    queryColour(queries, jobs) {
      let queryPercent = (queries / jobs) * 100;
      if (queryPercent > 20) {
        return "red";
      }
      if (queryPercent > 10) {
        return "orange";
      }
      return "green";
    }
  }
};
</script>

<style>
</style>