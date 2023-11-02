<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <v-row>
            <v-subheader>Registration Stats</v-subheader>
          </v-row>
          <v-row justify="space-around">
            <v-col>
              <v-card outlined :loading="jobsTodayLoading">
                <v-card-title>Jobs Registered</v-card-title>
                <v-card-text
                  v-if="jobsTodayLoading"
                  class="display-3 text-center"
                  >xxx</v-card-text
                >
                <v-card-text v-else class="display-3 text-center">{{
                  jobsToday
                }}</v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined :loading="samplesTodayLoading">
                <v-card-title>Samples Registered</v-card-title>
                <v-card-text class="display-3 text-center">{{
                  samplesToday
                }}</v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined :loading="samplesWithTestingTodayLoading">
                <v-card-title>Samples w/ Testing</v-card-title>
                <v-card-text class="display-3 text-center">{{
                  samplesWithTestingToday
                }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-subheader>Reporting Stats</v-subheader>
          </v-row>
          <v-row justify="space-around">
            <v-col>
              <v-card outlined :loading="jobsDueTodayLoading">
                <v-card-title>Jobs Due</v-card-title>
                <v-card-text class="display-3 text-center">{{
                  jobsDueToday
                }}</v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined :loading="samplesWithTestingTodayLoading">
                <v-card-title>Jobs Approved</v-card-title>
                <v-card-text class="display-3 text-center">{{
                  jobsApprovedToday
                }}</v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined :loading="jobsReportedTodayLoading">
                <v-card-title>Jobs Reported</v-card-title>
                <v-card-text class="display-3 text-center">{{
                  jobsReportedToday
                }}</v-card-text>
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
  data() {
    return {
      jobsToday: '',
      jobsTodayLoading: true,
      samplesToday: '',
      samplesTodayLoading: true,
      samplesWithTestingToday: '',
      samplesWithTestingTodayLoading: true,
      jobsDueToday: '',
      jobsDueTodayLoading: true,
      jobsApprovedToday: '',
      jobsApprovedTodayLoading: true,
      jobsReportedToday: '',
      jobsReportedTodayLoading: true,
      weeksSamplesLoading: null
    };
  },
  mounted() {
    let date = this.$moment().format('YYYY-MM-DD');
    this.getJobsToday(date);
    this.getSamplesToday(date);
    this.getSamplesWithTestingToday(date);
    this.getJobsDueToday(date);
    this.getJobsApprovedToday(date);
    this.getJobsReportedToday(date);
  },
  methods: {
    getJobsToday(date) {
      this.$axios.get('stats/jobs?date=' + date).then(response => {
        this.jobsToday = response.data;
        this.jobsTodayLoading = false;
      });
    },
    async getSamplesToday(date) {
      await this.$axios.get('stats/samples?date=' + date).then(response => {
        this.samplesToday = response.data;
        this.samplesTodayLoading = false;
      });
    },
    getSamplesWithTestingToday(date) {
      this.$axios.get('stats/testingSamples?date=' + date).then(response => {
        this.samplesWithTestingToday = response.data;
        this.samplesWithTestingTodayLoading = false;
      });
    },
    getJobsApprovedToday(date) {
      this.$axios.get('stats/jobsApproved?date=' + date).then(response => {
        this.jobsApprovedToday = response.data;
        this.jobsApprovedTodayLoading = false;
      });
    },
    getJobsDueToday(date) {
      this.$axios.get('stats/jobsDue?date=' + date).then(response => {
        this.jobsDueToday = response.data;
        this.jobsDueTodayLoading = false;
      });
    },
    getJobsReportedToday(date) {
      this.$axios.get('stats/jobsReported?date=' + date).then(response => {
        this.jobsReportedToday = response.data;
        this.jobsReportedTodayLoading = false;
      });
    }
  }
};
</script>

<style></style>
