<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">Rush Sample</v-toolbar-title
          ><v-spacer /></v-toolbar>
        <v-card-text>
          <v-tabs grow>

            
            <v-tab>Active Jobs</v-tab>
            <v-tab-item>
              <job-list :jobs="jobs" :loading="jobsLoading" @getJobs="getJobs"  />
            </v-tab-item>

          </v-tabs> 
          </v-card-text>
          </v-card></v-col>
  </v-row>
</template>

<script>
import jobList from './components/job_list';
export default {
  components: {
    jobList,
  },
  data() {
    return {
      jobsLoading: true,
      jobs: [],
 
    };
  },
  mounted() {
    this.getJobs();

  },

  methods: {

    getJobs() {
      this.jobsLoading = true;
      this.$axios.get('vips/rushsample').then((response) => {        
        this.jobs = response.data.data;
        this.jobsLoading = false;
      });
    },
  },
};
</script>

<style></style>
