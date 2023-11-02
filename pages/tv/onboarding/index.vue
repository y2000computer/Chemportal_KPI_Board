<template>
  <v-row>
    <v-col>
      <v-subheader>Client Onboarding</v-subheader>
      <v-carousel
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
        v-if="clients"
        height="1200"
        :show-arrows="false"
        cycle
        horizontal
        hide-delimiters
        progress
      >
        <v-carousel-item v-for="(clientGroup,index) in groupedClients" :key="'clientGroup' + index">
          <v-row>
            <v-col md="6" v-for="(client,index) in clientGroup" :key="'client' + index">
              <v-card outlined height="850">
                <v-card-title>{{client.client.client_name}}</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>General</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      Jobs
                      <v-list v-if="Object.keys(client.top5jobs).length > 0" dense>
                        <div v-for="(logDate,key) in client.top5jobs" :key="'due' + key">
                          <v-subheader>{{key}}</v-subheader>
                          <v-list-item v-for="job in logDate" :key="job.JOB">
                            <v-list-item-content>
                              <v-list-item-title>
                                <v-row no-gutters>
                                  <v-col>{{job.JOB}}</v-col>
                                  <v-col>{{job.JOBSTATUS}}</v-col>
                                  <v-col
                                    :class="dueColour(job.OFFICEDATE)"
                                  >{{dateFormat(job.OFFICEDATE)}}</v-col>
                                  <v-col>{{dateFormat(job.REPDATE)}}</v-col>
                                </v-row>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider />
                        </div>
                      </v-list>
                      <div v-else>No Jobs Scheduled</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  layout: "tv",
  data() {
    return {
      clients: [],
      groupedClients: [],
      today: ""
    };
  },
  created() {
    this.getOnboardingClients();
    this.today = this.$moment().format("YYYY-MM-DD");
    // setInterval(() => {
    //   this.getOnboardingClients();
    // }, 10000);
  },
  methods: {
    dateFormat(date) {
      if (date) {
        return this.$moment(date, "YYYY-MM-DD").format("DD/MM/YY");
      } else {
        return "";
      }
    },
    getOnboardingClients() {
      this.$axios.get("clientOnboarding?top5=true").then(response => {
        this.clients = response.data;
        this.groupClients();
      });
    },
    groupClients() {
      var i = 0;
      var j = 0;
      this.clients.forEach(client => {
        if (i > 0 && i % 2 === 0) {
          j++;
        }
        if (!this.groupedClients[j]) {
          this.groupedClients[j] = [];
        }
        this.groupedClients[j].push(client);
        i++;
      });
    },
    dueColour(date) {
      if (!date) {
        return;
      }
      if (date < this.today) {
        return "red--text font-weight-bold";
      } else if (date == this.today) {
        return "orange--text font-weight-bold";
      } else {
        return;
      }
    }
  }
};
</script>

<style>
</style>