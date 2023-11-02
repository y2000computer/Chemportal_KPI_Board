<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Client Onboarding</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-autocomplete
                hide-details
                outlined
                autofocus
                v-model="client"
                :items="clients"
                item-text="client_name"
                item-value="client"
                label="Client"
                @change="getOnboarding"
                v-on:keyup.enter="getOnboarding"
                @click:append="getOnboarding"
                :loading="clientsLoading"
                clearable
                @click:clear="clearClient"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row justify="space-between">
            <v-col md="6">
              <v-subheader>Checklist</v-subheader>
              <v-card flat>
                <v-list dense v-if="onboardingDetails.client">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col md="6">Stage</v-col>
                          <v-col md="2">Due Date</v-col>
                          <v-col md="2">Completed Date</v-col>
                          <v-col md="2">Completed By</v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-for="stage in filteredStages"
                    :key="'stage' + stage.CLIONBSTID"
                    class="body-2"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col md="6">{{stage.onboarding_stage.STAGENAME}}</v-col>
                          <v-col md="2">{{dateFormat(stage.DUEDATE)}}</v-col>
                          <v-col md="2">{{stage.completed_by? stage.completed_by.USER_NAME: ''}}</v-col>
                          <v-col md="2">{{dateFormat(stage.COMPDATE)}}</v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col md="6" cols="12">
              <v-row no-gutters>
                <v-col md="6">
                  <v-subheader>Container Orders</v-subheader>
                </v-col>
                <v-col md="6">
                  <v-subheader>Collections</v-subheader>
                </v-col>
              </v-row>

              <v-card flat>
                <v-row no-gutters>
                  <v-col md="6">
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col>Collection ID</v-col>
                              <v-col>Order Date</v-col>
                              <v-col>Dispatched Date</v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon></v-list-item-icon>
                      </v-list-item>
                      <v-list-item
                        v-for="(containerRequest,i) in containerRequests"
                        :key="'containerRequest' + i"
                      >
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            <v-row no-gutters>
                              <v-col>{{containerRequest.CREQUESTID}}</v-col>
                              <v-col>{{dateFormat(containerRequest.CREQUDATE)}}</v-col>
                              <v-col>{{dateFormat(containerRequest.RCOMPDATE)}}</v-col>
                            </v-row>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                          <v-icon
                            v-if="containerRequest.CREQUDATE >= containerRequest.RCOMPDATE"
                            color="green"
                          >sentiment_very_satisfied</v-icon>
                          <v-icon v-else color="red">sentiment_very_dissatisfied</v-icon>
                        </v-list-item-icon>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col md="6">
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col>Collection ID</v-col>
                              <v-col>Pickup Date</v-col>
                              <v-col>Received Date</v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-icon></v-list-item-icon>
                      </v-list-item>
                      <v-list-item v-for="(collection,i) in collections" :key="'collection' + i">
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            <v-row no-gutters>
                              <v-col>{{collection.COLLECTNID}}</v-col>
                              <v-col>{{dateFormat(collection.REQUDATE)}}</v-col>
                              <v-col>{{dateFormat(collection.DELDATE)}}</v-col>
                            </v-row>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                          <v-icon
                            v-if="collection.REQUDATE < collection.DELDATE"
                            color="green"
                          >sentiment_very_satisfied</v-icon>
                          <v-icon v-else color="red">sentiment_very_dissatisfied</v-icon>
                        </v-list-item-icon>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="space-between">
            <v-col md="3">
              <v-card flat :loading="jobsLoading">
                <v-subheader>Registration</v-subheader>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col>Job No.</v-col>
                          <v-col>Received Date</v-col>
                          <v-col>Released Date</v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon></v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(job,i) in jobs" :key="'reg' + i">
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-row no-gutters>
                          <v-col>{{job.JOB}}</v-col>
                          <v-col>{{dateFormat(job.RECDATE)}}</v-col>
                          <v-col>{{dateFormat(job.RELDATE)}}</v-col>
                        </v-row>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon
                        v-if="job.RELDATE <= job.RECDATE"
                        color="green"
                      >sentiment_very_satisfied</v-icon>
                      <v-icon v-else color="red">sentiment_very_dissatisfied</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col md="3">
              <v-card flat :loading="jobsLoading">
                <v-subheader>Lab</v-subheader>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col>Job No.</v-col>
                          <v-col>Due Date</v-col>
                          <v-col>Complete Date</v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon></v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(job,i) in jobs" :key="'lab' + i">
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-row no-gutters>
                          <v-col>{{job.JOB}}</v-col>
                          <v-col>{{dateFormat(job.OFFICEDATE)}}</v-col>
                          <v-col>{{dateFormat(job.MAXCOMP)}}</v-col>
                        </v-row>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon
                        v-if="job.MAXCOMP <= job.OFFICEDATE"
                        color="green"
                      >sentiment_very_satisfied</v-icon>
                      <v-icon v-else color="red">sentiment_very_dissatisfied</v-icon>
                    </v-list-item-icon>
                    <v-list-item-action>
                      <v-switch></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>

            <v-col md="3">
              <v-card flat :loading="jobsLoading">
                <v-subheader>Approving</v-subheader>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col>Job No.</v-col>
                          <v-col>Completed Date</v-col>
                          <v-col>Approved Date</v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon></v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(job,i) in jobs" :key="'rep' + i">
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-row no-gutters>
                          <v-col>{{job.JOB}}</v-col>
                          <v-col>{{dateFormat(job.MAXCOMP)}}</v-col>
                          <v-col>{{dateFormat(job.MAXAPPR)}}</v-col>
                        </v-row>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon
                        v-if="job.MAXAPPR <= job.MAXCOMP"
                        color="green"
                      >sentiment_very_satisfied</v-icon>
                      <v-icon v-else color="red">sentiment_very_dissatisfied</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col md="3">
              <v-card flat :loading="jobsLoading">
                <v-subheader>Reporting</v-subheader>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters>
                          <v-col>Job No.</v-col>
                          <v-col>Approved Date</v-col>
                          <v-col>Reported Date</v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon></v-list-item-icon>
                  </v-list-item>
                  <v-list-item v-for="(job,i) in jobs" :key="'inv' + i">
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        <v-row no-gutters>
                          <v-col>{{job.JOB}}</v-col>
                          <v-col>{{dateFormat(job.MAXAPPR)}}</v-col>
                          <v-col>{{dateFormat(job.REPDATE)}}</v-col>
                        </v-row>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon
                        v-if="job.REPDATE <= job.MAXAPPR"
                        color="green"
                      >sentiment_very_satisfied</v-icon>
                      <v-icon v-else color="red">sentiment_very_dissatisfied</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card>
        <v-expansion-panels>
          <v-expansion-panel v-for="(date,key,index) in first5Jobs" :key="'date' + index">
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col>Date Logged: {{dateFormat(key)}}</v-col>
                <v-col>Total Jobs: {{date.length}}</v-col>
                <v-col>Date Logged: {{dateFormat(key)}}</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item v-for="(job,index) in date" :key="'datejob' + index">{{job.JOB}}</v-list-item>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
      {{first5Jobs}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      clients: [],
      clientsLoading: true,
      client: "",
      onboardingDetails: [],
      filteredStages: [],
      jobStages: [],
      collections: [],
      collectionsLoading: false,
      containerRequests: [],
      containerRequestsLoading: false,
      jobs: [],
      jobsLoading: false,
      first5Jobs: []
    };
  },

  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.$axios.get("onboardedClients").then(response => {
        this.clients = response.data;
        this.clientsLoading = false;
      });
    },

    getOnboarding() {
      if (!this.client) {
        return;
      }
      this.$axios
        .get("onboardedClients/" + this.client)
        .then(response => {
          this.onboardingDetails = response.data;
        })
        .then(() => {
          this.filteredStages = [];
          this.jobStages = [];
          this.filterResults();
          this.search();
        });
    },

    search() {
      this.getCollections();
      this.getContainerRequests();
      this.getJobs();
      this.getFirst5Jobs();
    },

    filterResults() {
      this.onboardingDetails.onboarding.onboarding_stages.forEach(stage => {
        if (stage.onboarding_stage.JOB == false) {
          this.filteredStages.push(stage);
        } else {
          this.jobStages.push(stage);
        }
      });
    },

    getCollections() {
      this.collectionsLoading = true;
      this.$axios
        .get(
          "clientCollections?count=5&client=" +
            this.client +
            "&startDate=" +
            this.onboardingDetails.onboarding.STARTDATE
        )
        .then(response => {
          this.collections = response.data;
          this.collectionsLoading = false;
        });
    },
    getContainerRequests() {
      this.containerRequestsLoading = true;
      this.$axios
        .get(
          "clientContainerRequests?count=5&client=" +
            this.client +
            "&startDate=" +
            this.onboardingDetails.onboarding.STARTDATE
        )
        .then(response => {
          this.containerRequests = response.data;
          this.containerRequestsLoading = false;
        });
    },
    getJobs() {
      this.jobsLoading = true;
      this.$axios
        .get(
          "clientJobs?count=5&client=" +
            this.client +
            "&startDate=" +
            this.onboardingDetails.onboarding.STARTDATE
        )
        .then(response => {
          this.jobs = response.data;
          this.jobsLoading = false;
        });
    },

    getFirst5Jobs() {
      this.$axios
        .get("clientOnboardingJobs?client=" + this.client)
        .then(response => {
          this.first5Jobs = response.data;
        });
    },

    clearClient() {
      this.client = "";
      (this.onboardingDetails = []),
        (this.jobs = []),
        (this.collections = []),
        (this.containerRequests = []);
    },
    stageComplete(e, id) {
      this.$axios
        .get(
          "setOnboardingStage?CLIONBSTID=" +
            id +
            "&USER_ID=" +
            this.$auth.user.id +
            "&STATUS=" +
            e
        )
        .then(() => {
          this.getOnboarding();
        });
    },
    dateFormat(date) {
      if (date) {
        return this.$moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
      } else {
        return "";
      }
    }
  }
};
</script>

<style>
</style>