<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>New Query</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                outlined
                placeholder="xx-xxxxx"
                label="Job Search"
                name="Job"
                :error-messages="errors.first('Job')"
                autofocus
                :loading="jobLoading"
                append-icon="search"
                @click:append="searchTrigger()"
                v-model="form.job"
                v-on:keyup.enter="searchTrigger()"
              ></v-text-field>
            </v-col>
            <v-col md="5">
              <v-alert v-if="searchError" type="error">
                {{
                searchError
                }}
              </v-alert>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-card flat>
                <v-card-title>Job Details</v-card-title>

                <v-card-text>
                  <v-row dense align="center">
                    <v-col md="10">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col md="1">Job:</v-col>
                                <v-col>{{ job.JOB }}</v-col>
                                <v-col md="1">Client:</v-col>
                                <v-col>
                                  {{
                                  job.JOB ? job.office.client.CLIENTNAME : ''
                                  }}
                                </v-col>
                                <v-col md="1">Office:</v-col>
                                <v-col>
                                  {{
                                  job.JOB ? job.office.SEARCHNAME : ''
                                  }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col md="1">Quote:</v-col>
                                <v-col>{{ job.QUOTE }}</v-col>
                                <v-col md="1">No. Samples:</v-col>
                                <v-col>{{ job.NO_SAMPLES }}</v-col>
                                <v-col md="1">Status:</v-col>
                                <v-col>{{ job.JOBSTATUS }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col md="2">
                      <v-row justify="end">
                        <v-col>
                          <v-btn
                            color="primary"
                            class="float-right"
                            x-large
                            @click="addJob"
                            :disabled="!searched"
                          >Add to Query</v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col>
              <v-card flat>
                <v-card-title>Query Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col md="4">
                      <v-select
                        label="Job/s"
                        v-model="form.jobs"
                        :items="form.jobs"
                        outlined
                        multiple
                        dense
                      ></v-select>
                    </v-col>
                    <v-col md="2">
                      <v-select
                        outlined
                        label="Section"
                        v-model="form.section"
                        :items="sections"
                        v-validate="{ rules: 'required' }"
                        name="Section"
                        :error-messages="errors.first('Section')"
                        dense
                      ></v-select>
                    </v-col>
                    <v-col md="2">
                      <v-select
                        outlined
                        dense
                        label="FAO"
                        :items="users"
                        item-value="USER_ID"
                        item-text="USER_NAME"
                        v-model="form.fao"
                        v-validate="{ rules: 'required' }"
                        name="FAO"
                        :error-messages="errors.first('FAO')"
                      ></v-select>
                    </v-col>
                    <v-col md="2">
                      <v-select
                        outlined
                        dense
                        label="Query Type"
                        v-model="form.queryType"
                        :items="queryTypes"
                        v-validate="{ rules: 'required' }"
                        name="Query Type"
                        :error-messages="errors.first('Query Type')"
                      ></v-select>
                    </v-col>
                    <v-col md="2">
                      <v-text-field
                        outlined
                        dense
                        v-model="form.addTestDays"
                        label="Additional Testing T/A"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-textarea
                        outlined
                        dense
                        label="Query"
                        v-model="form.queryText"
                        v-validate="{ rules: 'required' }"
                        name="Query"
                        rows="10"
                        :error-messages="errors.first('Query')"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <v-btn @click="clearForm">Cancel</v-btn>
            </v-col>
            <v-col>
              <v-btn
                class="float-right"
                x-large
                color="primary"
                @click="submit"
                :loading="queryLoading"
                :disabled="form.jobs.length < 1"
              >Submit</v-btn>
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
      users: [],
      form: {
        jobs: [],
        job: "",
        section: "",
        fao: "",
        queryType: "",
        queryText: "",
        addTestDays: ""
      },
      jobLoading: false,
      job: [],
      searchError: "",
      searched: false,
      queryTypes: [
        "Additional Testing",
        "Dependant Options",
        "Job Query",
        "Quote Query",
        "Testing"
      ],
      sections: ["BOOKING IN"],
      queryLoading: false
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.$axios.get("users/section/BOOKING IN").then(response => {
        this.users = response.data.data;
      });
    },
    searchTrigger() {
      this.searchError = "";
      this.clearJob();
      this.jobSearch(this.form.job);
    },
    clearJob() {
      this.job = [];
    },
    jobSearch() {
      (this.jobLoading = true),
        this.$axios
          .get("jobs/" + this.form.job)
          .then(response => {
            this.job = response.data.data;
            this.jobLoading = false;
            this.searched = true;
          })
          .catch(e => {
            this.jobLoading = false;
            this.searchError = "Error Finding Job, Please Try Again";
          });
    },
    addJob() {
      this.form.jobs.push(this.job.JOB);
      this.searched = false;
      this.job = [];
      this.$validator.reset();
      this.form.job = "";
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.queryLoading = true;
          this.$axios.post("queries", this.form).then(() => {
            //http://chem-api-v2/api/queries
            this.$store.dispatch("snackbar/showSnackbar", "Query Added");
            this.clearForm();
            this.queryLoading = false;
          });
        }
      });
    },
    clearForm() {
      this.form.job = "";
      this.form.jobs = [];
      this.form.section = "";
      this.form.fao = "";
      this.form.queryType = "";
      this.form.queryText = "";
      this.form.addTestDays = "";
      this.clearJob();
      this.$validator.reset();
    }
  }
};
</script>

<style></style>
