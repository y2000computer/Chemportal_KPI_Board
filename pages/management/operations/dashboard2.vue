<template>
  <v-row>
    <v-col>
      <!-- Reg Stats -->
      <v-row no-gutters
        ><v-col><v-subheader>Registration Stats</v-subheader></v-col></v-row
      >
      <v-row>
        <v-col>
          <v-card outlined
            ><v-card-text>
              <v-row>
                <v-col md="4" cols="12">
                  <v-card flat>
                    <v-row no-gutters>Test</v-row>
                    <v-row no-gutters>tsettset</v-row>
                    <v-row no-gutters>setsf</v-row>
                  </v-card>
                </v-col>
                <v-col md="4" cols="12">
                  <v-card flat>
                    <v-row no-gutters>Test</v-row>
                    <v-row no-gutters>tsettset</v-row>
                    <v-row no-gutters>setsf</v-row>
                  </v-card>
                </v-col>
                <v-col md="4" cols="12">
                  <v-card flat>
                    <v-row no-gutters>Test</v-row>
                    <v-row no-gutters>tsettset</v-row>
                    <v-row no-gutters>setsf</v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card></v-col
        >
      </v-row>
      <!--  -->
      <!--  -->
      <!--  -->
      <!--  -->
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
