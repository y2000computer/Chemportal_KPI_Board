<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar dense flat>
          <v-toolbar-title class="font-weight-medium">
            Pre-bounced Job Exception Acknowledge</v-toolbar-title
          >
          <v-spacer />

          <v-btn icon @click="getJobs">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title> </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                clearable
                v-model="search"
                label="Search"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                dense
                :headers="headers"
                :items="jobs"
                :search="search"
                :loading="loading"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.OFFICEDATE="{ item }">
                  <div
                    class="red--text font-weight-bold"
                    v-if="
                      $moment()
                        .subtract(1, 'days')
                        .isAfter(item.OFFICEDATE)
                    "
                  >
                    {{ $moment(item.OFFICEDATE).format('DD/MM/YY') }}
                  </div>
                  <div v-else>
                    {{ $moment(item.OFFICEDATE).format('DD/MM/YY') }}
                  </div>
                </template>
                <template v-slot:item.RECDATE="{ item }">
                  {{ $moment(item.RECDATE).format('DD/MM/YY') }}
                </template>
                <template v-slot:item.office.client.CLIENTNAME="{ item }">{{
                  item.office.client.CLIENTNAME | shorten(25)
                }}</template>
                <template v-slot:item.PROJECT="{ item }">{{
                  item.PROJECT | shorten(20)
                }}</template>
                <template v-slot:item.JOBNOTES="{ item }">{{
                  item.JOBNOTES | shorten(20)
                }}</template>
                <template v-slot:item.INSDATE="{ item }">
                  {{ $moment(item.INSDATE).format('DD/MM/YY') }}
                </template>


                <template v-slot:item.actions="{ item }">
                  <v-btn
                    :disabled="item.SKIP == 1 || item.EXCEPTIONS == -1"
                    icon
                    :to="'/technical/approvals/' + item.JOB"
                  >
                    <v-icon color="primary">mdi-playlist-check</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      jobs: [],
      search: '',
      headers: [
        { text: 'Job', value: 'JOB' },
        { text: 'Samples', value: 'NO_SAMPLES' },
        { text: 'Due Date', value: 'OFFICEDATE' },
        { text: 'Exceptions', value: 'EXCEPTIONS' },
        { text: 'Client', value: 'office.client.CLIENTNAME' },
        { text: 'Project', value: 'PROJECT' },
        { text: 'Notes', value: 'JOBNOTES' },
        { text: 'Received', value: 'RECDATE' },
        { text: 'Instructed', value: 'INSDATE' },
        { text: 'Actions', value: 'actions' },
      ],
    };
  },
  mounted() {
    this.getJobs();
  },
  methods: {
    getJobs() {
      this.loading = true;
      //this.$axios.get('approvals/jobs-with-exceptions').then((response) => {
      this.$axios.get('prebounced/jobs-with-exceptions').then((response) => {        
        //this.jobs = response.data.data;
        this.jobs = response.data;
        console.log('this.jobs.JOB  =' + this.jobs[0].JOB  )
        console.log('this.jobs.CLIENT  =' + this.jobs[0].CLIENT  )
        console.log('this.jobs.exception[0].SAMPNUM  =' + this.jobs[0].exception[0].SAMPNUM  )
        console.log('this.jobs.exception[0].DET  =' + this.jobs[0].exception[0].DET  )
        console.log('this.jobs.exception[1].SAMPNUM  =' + this.jobs[1].exception[0].SAMPNUM  )
        console.log('this.jobs.exception[1].DET  =' + this.jobs[1].exception[0].DET  )
        this.loading = false;
      });
    },
  },
};
</script>

<style>
.job-row {
  height: 150px;
  overflow-y: auto;
}
</style>
