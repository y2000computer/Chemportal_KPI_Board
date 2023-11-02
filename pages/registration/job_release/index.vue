<template
  ><v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Jobs Due For Release</v-toolbar-title
          > </v-toolbar
        ><v-card-text
          ><v-row align="center"
            ><v-col cols="12" sm="6" md="3"
              ><v-text-field
                v-model="search"
                hide-details
                dense
                outlined
                label="Search"/></v-col
            ><v-col class="text-right"
              >{{ jobs.length }} Jobs Due For Release</v-col
            ></v-row
          ><v-row
            ><v-col
              ><v-data-table
                dense
                disable-pagination
                hide-default-footer
                :items="filteredJobs"
                :headers="headers"
                :loading="loading"
              >
                <template v-slot:item.JOB="{ item }">
                  <span
                    :class="item.VIP ? 'red--text font-weight-medium' : ''"
                    >{{ item.JOB }}</span
                  >
                </template>
                <template v-slot:item.CLIENTNAME="{ item }">{{
                  item.office.client.CLIENTNAME | shorten(20)
                }}</template
                ><template v-slot:item.PROJECT="{ item }">{{
                  item.PROJECT | shorten(15)
                }}</template>
                <template v-slot:item.RECDATE="{ item }">{{
                  $moment(item.RECDATE).format("DD-MM-YY")
                }}</template>
                <template v-slot:item.INSDATE="{ item }">{{
                  $moment(item.INSDATE).format("DD-MM-YY")
                }}</template>
                <template v-slot:item.LOGDATE="{ item }">{{
                  $moment(item.LOGDATE).format("DD-MM-YY")
                }}</template>
                <template v-slot:item.OFFICEDATE="{ item }">{{
                  $moment(item.OFFICEDATE).format("DD-MM-YY")
                }}</template>
                <template v-slot:item.FILENAME="{ item }">
                  <v-chip dark small :color="item.FILENAME ? 'green' : 'red'">{{
                    item.FILENAME ? "Y" : "N"
                  }}</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    small
                    icon
                    :to="'/registration/job_release/' + item.JOB"
                  >
                    <v-icon>mdi-view-list-outline</v-icon></v-btn
                  >
                </template></v-data-table
              ></v-col
            ></v-row
          ></v-card-text
        ></v-card
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      search: "",
      jobs: [],
      headers: [
        { text: "Job", value: "JOB" },
        { text: "Client", value: "CLIENTNAME" },
        { text: "Project", value: "PROJECT" },
        { text: "Samples", value: "NO_SAMPLES" },
        { text: "Received", value: "RECDATE" },
        { text: "Instructed", value: "INSDATE" },
        { text: "Log Date", value: "LOGDATE" },
        { text: "By", value: "LOGGEDBY" },
        { text: "Due Date", value: "OFFICEDATE" },
        { text: "Turnaround", value: "TURNAROUND" },
        { text: "Chemconnect", value: "FILENAME" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  mounted() {
    this.getJobs();
  },
  computed: {
    filteredJobs() {
      if (!this.search) {
        return this.jobs;
      }
      var search = this.search.toLowerCase();
      return this.jobs.filter((job) => {
        return (
          job.JOB.toLowerCase().indexOf(search) !== -1 ||
          job.office.client.CLIENTNAME.toLowerCase().indexOf(search) !== -1 ||
          job.PROJECT.toLowerCase().indexOf(search) !== -1
        );
      });
    },
  },
  methods: {
    getJobs() {
      this.loading = true;
      this.$axios.get("jobs/release-jobs").then((response) => {
        this.jobs = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
