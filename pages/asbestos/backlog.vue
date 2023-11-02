<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Asbestos Backlog</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-btn @click="getBacklog">Refresh</v-btn>
            </v-col>
            <v-col>
              <v-text-field outlined label="Search" v-model="search"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <!-- <v-card
                flat
                v-for="(dueDate, dueDateKey) in backlog.DUEDATES"
                :key="'due' + dueDateKey"
              >
                <v-card-title>{{ dueDateKey }}</v-card-title>
                <v-card outlined v-for="(job, jobKey) in dueDate.JOBS" :key="'job' + jobKey">
                  <v-card-title>
                    <v-row no-gutters>
                      <v-col>{{jobKey}}</v-col>
                      <v-col>{{job.CLIENT}}</v-col>
                    </v-row>
                  </v-card-title>
                  <v-card-text>
                    <v-card
                      flat
                      v-for="(sample,sampleKey) in job.SAMPLES"
                      :key="'sample'+sampleKey"
                    >
                      <v-row dense>
                        <v-col>{{sampleKey}}</v-col>
                        <v-col>{{sample.LOCATION}}</v-col>
                        <v-col
                          v-for="(det, detKey) in sample.DETS"
                          :key="sampleKey + detKey"
                          class="font-weight-bold"
                        >
                          <v-chip :color="det? 'green':'red'">{{detKey}}</v-chip>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-card-text>
                </v-card>
              </v-card>-->
            </v-col>
          </v-row>

          <v-data-table
            :loading="loading"
            show-select
            value
            v-model="selected"
            :search="search"
            :items="backlog"
            :headers="headers"
            dense
          >
            <template v-slot:item="props">
              <tr :class="props.item.NEWJOB? 'newJob':''">
                <td></td>
                <td>{{props.item.JOB}}</td>
                <td>{{props.item.SAMPNUM}}</td>
                <td>{{props.item.CLIENT}}</td>
                <td>{{props.item.DUE}}</td>
                <td>{{props.item.TYPE}}</td>
                <td>{{props.item.LOCATION}}</td>
                <td>
                  <v-icon v-if="props.item.ACM" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td>
                  <v-icon v-if="props.item.GRAV" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td>
                  <v-icon v-if="props.item.FIB" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td>
                  <v-icon v-if="props.item.GRAVTRIG" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td>
                  <v-icon v-if="props.item.FIBTRIG" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td>
                  <v-btn
                    x-small
                    color="primary"
                    :to="'resultsEntry/' + props.item.SAMPNUM"
                  >Results Entry</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
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
      backlog: [],
      selected: [],
      search: "",
      headers: [
        { text: "Job", value: "JOB" },
        { text: "Sample", value: "SAMPNUM" },
        { text: "Client", value: "CLIENT" },
        { text: "Due Date", value: "DUEDATE" },
        { text: "Type", value: "TYPE" },
        { text: "Location", value: "LOCATION" },
        { text: "ACM", value: "ACM" },
        { text: "Grav", value: "GRAV" },
        { text: "Fibre Cnt", value: "FIB" },
        { text: "Grav Trig", value: "GRAVTRIG" },
        { text: "Fib Trig", value: "FIBTRIG" }
      ]
    };
  },
  mounted() {
    this.getBacklog();
  },
  methods: {
    getBacklog() {
      this.loading = true;
      this.backlog = [];
      this.$axios.get("asbestos/backlog").then(response => {
        this.backlog = response.data;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
.newJob td {
  border-top: 5px solid darkgray !important;
}
</style>
