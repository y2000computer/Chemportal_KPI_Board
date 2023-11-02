<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">VIP Jobs</v-toolbar-title
          ><v-spacer /><v-btn
            icon
            small
            @click="
              getJobs();
              getVips();
            "
            ><v-icon>mdi-refresh</v-icon></v-btn
          ></v-toolbar
        >
        <v-card-text>
          <v-tabs grow>
            <v-tab>Project List</v-tab>
            <v-tab>Active Jobs</v-tab>
            <v-tab-item
              ><vip-list
                :vips="vips"
                :loading="vipsLoading"
                @formReset="getVips"
            /></v-tab-item>
            <v-tab-item
              ><job-list :jobs="jobs" :loading="jobsLoading" @getJobs="getJobs"
            /></v-tab-item>
          </v-tabs> </v-card-text></v-card
    ></v-col>
  </v-row>
</template>

<script>
import vipList from './components/vip_list';
import jobList from './components/job_list';
export default {
  components: {
    vipList,
    jobList,
  },
  data() {
    return {
      vipsLoading: false,
      vips: [],
      jobsLoading: true,
      jobs: [],
    };
  },
  mounted() {
    this.getVips();
    this.getJobs();
  },

  methods: {
    getVips() {
      this.vipsLoading = true;
      this.$axios.get('vips').then((response) => {
        this.vips = response.data.data;
        this.vipsLoading = false;
      });
    },

    getJobs() {
      this.jobsLoading = true;
      this.$axios.get('vips/jobs').then((response) => {
        this.jobs = response.data.data;
        this.jobsLoading = false;
        console.log('this.jobs=', this.jobs);
      });
    },
  },
};
</script>

<style></style>
