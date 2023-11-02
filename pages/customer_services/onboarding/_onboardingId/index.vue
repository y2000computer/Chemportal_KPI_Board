<template>
  <v-row>
    <v-col>
      <v-card outlined :loading="onboardingLoading">
        <v-card-title>
          <v-btn icon class="my-0 mr-3" to="/customer_services/onboarding/" exact>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          Client Onboarding -
          {{ onboarding.client.CLIENTNAME }}
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-card flat>
                <v-card-text>
                  <v-row dense>
                    <v-col class="text-subtitle-1">Onboarding Details</v-col>
                  </v-row>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Rate Tier</th>
                          <th>Onboarding Started</th>
                          <th>Onboarding Ended</th>
                          <th>New or Returning Client</th>

                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody class="font-weight-medium">
                        <tr>
                          <td>{{ onboarding.client.CLIENTNAME }}</td>
                          <td>{{ onboarding.client.RATETIER }}</td>
                          <td>{{ dateFormat(onboarding.STARTDATE) }}</td>
                          <td>{{ dateFormat(onboarding.ENDDATE) }}</td>
                          <td>
                            {{
                            onboarding.NEWCLIENT == '1'
                            ? 'New Client'
                            : 'Returning Client'
                            }}
                          </td>

                          <td>
                            <v-btn
                              small
                              width="100"
                              color="green"
                              :disabled="onboardingComplete"
                              @click="completeDialog = !completeDialog"
                            >Complete</v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12">
              <v-card flat>
                <v-card-text>
                  <v-row dense>
                    <v-col class="text-subtitle-1">Onboarding Actions</v-col>
                  </v-row>
                  <v-simple-table dense class="font-weight-medium">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Due Date</th>
                          <th>Completed Date</th>
                          <th>Completed By</th>
                          <th class="text-center">Mark Complete</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="stage in generalActions" :key="stage.CLIONBSTID">
                          <td>{{ stage.stage.STAGELABEL }}</td>

                          <td
                            :class="dueColour(stage.DUEDATE, stage.COMPDATE)"
                          >{{ dateFormat(stage.DUEDATE) }}</td>
                          <td>{{ dateFormat(stage.COMPDATE) }}</td>
                          <td>
                            {{
                            stage.completed_by
                            ? stage.completed_by.USER_NAME
                            : ''
                            }}
                          </td>
                          <td class="text-center">
                            <v-btn
                              color="primary"
                              x-small
                              :disabled="
                                onboardingComplete || stage.COMPDATE != null
                              "
                              @click="openCompleteDialog(stage)"
                            >
                              <v-icon small>mdi-check-bold</v-icon>
                            </v-btn>
                          </td>
                          <td>
                            <v-icon
                              color="red"
                              v-if="actionSmiley(stage) == 'bad'"
                            >mdi-emoticon-angry-outline</v-icon>
                            <v-icon
                              color="success"
                              v-else-if="actionSmiley(stage) == 'good'"
                            >mdi-emoticon-excited-outline</v-icon>
                            <v-icon v-else>mdi-emoticon-neutral-outline</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <v-card flat>
                <v-card-text>
                  <v-row dense>
                    <v-col class="text-subtitle-1">Client Jobs</v-col>
                  </v-row>
                  <v-simple-table dense>
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Samples</th>
                        <th>Status</th>
                        <th>Released</th>
                        <th colspan="2">Confirmation Call Due</th>
                        <th class="text-center">Confirmation Call Complete</th>
                        <th>Job Due</th>
                        <th>Completed</th>
                        <th>Approved</th>
                        <th>Reported</th>
                        <th colspan="2">Results Call Due</th>
                        <th class="text-center">Results Call Complete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(logDate, key, index) in onboarding.jobs">
                        <tr :key="'logDate' + key">
                          <td
                            colspan="19"
                            class="caption font-weight-bold tableSubHeaders"
                          >Registered: {{ dateFormat(key) }}</td>
                        </tr>
                        <tr
                          v-for="(job, jobIndex) in logDate"
                          :key="job.JOB"
                          class="font-weight-medium"
                        >
                          <td>{{ job.JOB }}</td>
                          <td>{{ job.samples.length }}</td>
                          <td>{{ job.JOBSTATUS }}</td>
                          <td>
                            {{ dateFormat(job.RELDATE) }}
                            <v-icon class="ml-2" v-if="!job.RELDATE && today == key"></v-icon>
                            <v-icon
                              v-else-if="job.RELDATE == job.LOGDATE"
                              color="success"
                              class="ml-2"
                            >mdi-emoticon-excited-outline</v-icon>
                            <v-icon v-else class="ml-2" color="red">mdi-emoticon-angry-outline</v-icon>
                          </td>
                          <td
                            :rowspan="logDate.length"
                            v-if="jobIndex == 0"
                          >{{ dateFormat(jobActions[index].Reg.DUEDATE) }}</td>
                          <td :rowspan="logDate.length" v-if="jobIndex == 0">
                            <v-btn
                              :disabled="jobActions[index].Reg.COMPDATE != null"
                              x-small
                              color="primary"
                              @click="
                                openCompleteDialog(jobActions[index].Reg)
                              "
                            >
                              <v-icon small>mdi-check</v-icon>
                            </v-btn>
                          </td>
                          <td :rowspan="logDate.length" v-if="jobIndex == 0" class="text-center">
                            {{ dateFormat(jobActions[index].Reg.COMPDATE) }}
                            <v-icon
                              class="ml-2"
                              color="red"
                              v-if="
                                actionSmiley(jobActions[index].Reg) == 'bad'
                              "
                            >mdi-emoticon-angry-outline</v-icon>
                            <v-icon
                              class="ml-2"
                              color="green"
                              v-else-if="
                                actionSmiley(jobActions[index].Reg) == 'good'
                              "
                            >mdi-emoticon-excited-outline</v-icon>
                            <v-icon class="ml-2" v-else>mdi-emoticon-neutral-outline</v-icon>
                          </td>
                          <td>{{ dateFormat(job.OFFICEDATE) }}</td>
                          <td>
                            {{ dateFormat(job.compdate) }}
                            <v-icon class="ml-2" v-if="!job.compdate"></v-icon>
                            <v-icon
                              class="ml-2"
                              v-else-if="job.compdate <= job.OFFICEDATE"
                              color="success"
                            >mdi-emoticon-excited-outline</v-icon>
                            <v-icon class="ml-2" v-else color="red">mdi-emoticon-angry-outline</v-icon>
                          </td>

                          <td>{{ dateFormat(job.apprdate) }}</td>
                          <td>
                            {{ dateFormat(job.REPDATE) }}
                            <v-icon class="ml-2" v-if="!job.REPDATE"></v-icon>
                            <v-icon
                              class="ml-2"
                              v-else-if="job.REPDATE <= job.apprdate"
                              color="success"
                            >mdi-emoticon-excited-outline</v-icon>
                            <v-icon v-else class="ml-2" color="red">mdi-emoticon-angry-outline</v-icon>
                          </td>

                          <td
                            :rowspan="logDate.length"
                            v-if="jobIndex == 0"
                          >{{ dateFormat(jobActions[index].Rep.DUEDATE) }}</td>
                          <td :rowspan="logDate.length" v-if="jobIndex == 0">
                            <v-btn
                              :disabled="jobActions[index].Rep.COMPDATE != null"
                              x-small
                              color="primary"
                              @click="
                                openCompleteDialog(jobActions[index].Rep)
                              "
                            >
                              <v-icon small>mdi-check</v-icon>
                            </v-btn>
                          </td>
                          <td :rowspan="logDate.length" v-if="jobIndex == 0" class="text-center">
                            {{ dateFormat(jobActions[index].Rep.COMPDATE) }}
                            <v-icon
                              class="ml-2"
                              color="red"
                              v-if="
                                actionSmiley(jobActions[index].Rep) == 'bad'
                              "
                            >mdi-emoticon-angry-outline</v-icon>
                            <v-icon
                              class="ml-2"
                              color="green"
                              v-else-if="
                                actionSmiley(jobActions[index].Rep) == 'good'
                              "
                            >mdi-emoticon-excited-outline</v-icon>
                            <v-icon v-else class="ml-2">mdi-emoticon-neutral-outline</v-icon>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col md="6" cols="12">
              <v-card flat>
                <v-card-text>
                  <v-row dense>
                    <v-col class="text-subtitle-1">Collections</v-col>
                  </v-row>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Collection ID</th>
                          <th>Required Date</th>
                          <th>Booked Date</th>
                          <th>Delivered Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody class="font-weight-medium">
                        <tr
                          v-for="collection in onboarding.collections"
                          :key="'COL' + collection.COLLECTNID"
                        >
                          <td>{{ collection.COLLECTNID }}</td>
                          <td>{{ dateFormat(collection.REQUDATE) }}</td>
                          <td>{{ dateFormat(collection.BOOKEDDATE) }}</td>
                          <td>{{ dateFormat(collection.DELDATE) }}</td>
                          <td>
                            <v-icon v-if="!collection.DELDATE">mdi-emoticon-neutral-outline</v-icon>
                            <v-icon
                              v-else-if="
                                $moment(collection.DELDATE) <=
                                  $moment(collection.REQUDATE).add(
                                    $moment(collection.DELDATE).format('d') == 1
                                      ? 3
                                      : 1,
                                    'days'
                                  )
                              "
                              color="green"
                            >mdi-emoticon-happy-outline</v-icon>
                            <v-icon v-else color="red">mdi-emoticon-angry-outline</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="6" cols="12">
              <v-card flat>
                <v-card-text>
                  <v-row dense>
                    <v-col class="text-subtitle-1">Container Requests</v-col>
                  </v-row>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Collection ID</th>
                          <th>Requested Date</th>
                          <th>Dispatched Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody class="font-weight-medium">
                        <tr
                          v-for="crequest in onboarding.containerRequests"
                          :key="'CR' + crequest.CREQUESTID"
                        >
                          <td>{{ crequest.CREQUESTID }}</td>
                          <td>{{ dateFormat(crequest.NEEDDATE) }}</td>
                          <td>{{ dateFormat(crequest.RCOMPDATE) }}</td>
                          <td>
                            <v-icon v-if="!crequest.RCOMPDATE">mdi-emoticon-neutral-outline</v-icon>
                            <v-icon
                              v-else-if="
                                $moment(crequest.NEEDDATE).subtract(
                                  1,
                                  'days'
                                ) <= $moment(crequest.RCOMPDATE)
                              "
                              color="green"
                            >mdi-emoticon-happy-outline</v-icon>
                            <v-icon v-else color="red">mdi-emoticon-angry-outline</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-if="selectedStage.CLIONBSTID" v-model="actionCompleteDialog" width="800">
      <v-card>
        <v-card-title>Confirm Action: {{selectedStage.stage.STAGELABEL}}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-menu
                v-model="dateMenu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dateFormat(selectedStageCompleteDate)"
                    label="Completed Date"
                    outlined
                    dense
                    hide-details
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  color="primary"
                  v-model="selectedStageCompleteDate"
                  @input="dateMenu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row v-if="selectedStage.ONBSTAGEID == 3">
            <v-col>
              <v-menu
                v-model="dateMenu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    :value="dateFormat(nextStageDueDate)"
                    label="Next Stage Booked For..."
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  no-title
                  color="primary"
                  v-model="nextStageDueDate"
                  @input="dateMenu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="actionCompleteDialog = !actionCompleteDialog" no-title>Cancel</v-btn>
          <v-spacer />
          <v-btn color="primary" @click="completeAction">Confrim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="onboarding.CLIONBID" v-model="completeDialog" scrollable width="400">
      <v-card>
        <v-card-title>Complete Onboarding</v-card-title>
        <v-card-text class="subtitle-1">
          Are you sure you want to end onboarding for
          {{ onboarding.client.CLIENTNAME }}?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="completeDialog = !completeDialog">No</v-btn>
          <v-spacer />
          <v-btn @click="endOnboarding" color="primary">YES</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      today: "",
      onboardingId: "",
      client: "",
      onboarding: [],
      onboardingLoading: false,
      collections: [],
      collectionsLoading: true,
      containerRequests: [],
      selectedStage: [],
      selectedStageCompleteDate: "",
      nextStageDueDate: "",
      dateMenu1: false,
      dateMenu2: false,
      containerRequestsLoading: true,
      cancelDialog: false,
      completeDialog: false,
      actionCompleteDialog: false
    };
  },
  computed: {
    onboardingComplete() {
      if (this.onboarding.ENDDATE == null) {
        return false;
      } else {
        return true;
      }
    },
    generalActions() {
      var actions = this.onboarding.onboarding_stages.filter(
        stage => stage.stage.JOB == 0
      );
      return this._.orderBy(actions, ["stage.ORDER", "asc"]);
    },
    jobActions() {
      var jobActions = [{}, {}, {}, {}, {}];
      this.onboarding.onboarding_stages.forEach(stage => {
        var stageString = stage.stage.STAGENAME.slice(-8);
        if (stageString == "Rep Call") {
          var jobStage = "Rep";
        }
        if (stageString == "Reg Call") {
          var jobStage = "Reg";
        }
        if (jobStage) {
          jobActions[stage.stage.JOB - 1][jobStage] = stage;
        }
      });
      return jobActions;
    }
  },

  mounted() {
    this.onboardingId = this.$route.params.onboardingId;
    this.getClientOnboarding();
    this.today = this.$moment().format("YYYY-MM-DD");
  },
  methods: {
    dateFormat(date) {
      if (date) {
        return this.$moment(date, "YYYY-MM-DD").format("DD/MM/YY");
      } else {
        return "";
      }
    },
    getClientOnboarding() {
      this.onboardingLoading = true;
      this.$axios
        .get("client-onboarding/" + this.onboardingId)
        .then(response => {
          this.onboarding = response.data.data;
          this.onboardingLoading = false;
        });
    },

    dateCheck(key, date) {
      var buttonDisabled = true;
      this.jobs[date].forEach(job => {
        if (job[key] !== null) {
          buttonDisabled = false;
        }
      });
      return buttonDisabled;
    },
    openCompleteDialog(stage) {
      this.selectedStage = stage;
      this.actionCompleteDialog = true;
      this.selectedStageCompleteDate = this.$moment().format("YYYY-MM-DD");
    },
    completeAction() {
      this.$axios
        .patch(
          "client-onboarding/" +
            this.selectedStage.CLIONBSTID +
            "?complete=true&completedDate=" +
            this.selectedStageCompleteDate +
            "&nextStageDate=" +
            this.nextStageDueDate
        )
        .then(response => {
          this.getClientOnboarding();
          this.actionCompleteDialog = false;
        });
    },

    endOnboarding() {
      this.$axios
        .patch("client-onboarding/complete-onboarding", {
          client_onboarding_id: this.onboardingId
        })
        .then(response => {
          this.getClientOnboarding();
          this.completeDialog = false;
        });
    },
    dueColour(duedate, compdate) {
      if (this.actionDue(duedate, compdate) == "overdue") {
        return "red--text font-weight-bold";
      }
      if (this.actionDue(duedate, compdate) == "dueToday") {
        return "orange--text font-weight-bold";
      }
      if (this.actionDue(duedate, compdate) == "future") {
        return "green--text font-weight-bold";
      }
    },
    actionDue(duedate, compdate) {
      if (!duedate) {
        return "notDue";
      }
      if (this.$moment(compdate).isSameOrBefore(this.$moment(duedate))) {
        return "completeOnTime";
      }
      if (!compdate && this.$moment(duedate).isBefore(this.$moment())) {
        return "overdue";
      }
      if (this.$moment(duedate).isSame(this.$moment())) {
        return "dueToday";
      }
      return "future";
    },
    actionSmiley(stage) {
      if (
        this.$moment(stage.COMPDATE).isAfter(this.$moment(stage.DUEDATE)) ||
        (this.$moment().isAfter(this.$moment(stage.DUEDATE)) && !stage.COMPDATE)
      ) {
        return "bad";
      } else if (
        (!stage.DUEDATE && stage.COMPDATE) ||
        this.$moment(stage.COMPDATE).isSameOrBefore(this.$moment(stage.DUEDATE))
      ) {
        return "good";
      }
      return "neutral";
    }
  }
};
</script>

<style></style>
