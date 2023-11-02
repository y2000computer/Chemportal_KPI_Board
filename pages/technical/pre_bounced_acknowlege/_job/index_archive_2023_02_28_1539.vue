<template>
  <v-row>
    <v-col>
      <v-card outlined :loading="loading">
        <v-card-title>
          <v-btn exact to="/technical/pre_bounced" icon>
            <v-icon>arrow_back</v-icon>
          </v-btn>
          Pre-Bounced Job Exceptions: {{ job }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-simple-table v-if="!loading">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Due Date</th>
                    <th>No. Samples</th>
                    <th>Queries</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="font-weight-medium">
                    <td>{{ jobData.office.client.CLIENTNAME }}</td>
                    <td>{{ jobData.PROJECT }}</td>
                    <td>{{ jobData.OFFICEDATE | moment('DD/MM/YY') }}</td>
                    <td>{{ jobData.NO_SAMPLES }}</td>
                    <td>
                      <v-btn
                        small
                        left
                        text
                        @click="
                          jobData.queries.length > 0
                            ? (jobQueriesDialog = !jobQueriesDialog)
                            : ''
                        "
                        >{{ jobData.queries.length > 0 ? 'Y' : 'N' }}</v-btn
                      >
                    </td>
                    <td
                      style="cursor: pointer;"
                      @click="jobNotesDialog = !jobNotesDialog"
                    >
                      {{ jobData.JOBNOTES | shorten(80) }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row dense v-if="!loading">
            <v-col>
              <v-tabs centered>
                <v-tab>Job Results</v-tab>
                <v-tab>Job Exceptions</v-tab>

                <v-tab-item>
                  <v-row>
                    <v-col>
                      <v-card outlined>
                        <v-card-text>
                          <v-row dense justify="center" align="center">
                            <v-col md="4" cols="12"></v-col>
                            <v-col md="2" cols="6">
                              <v-switch
                                label="All Results"
                                inset
                                v-model="allResults"
                              ></v-switch>
                            </v-col>
                            <v-col md="2" cols="6">
                              <v-switch
                                label="All Samples"
                                inset
                                :input-value="allSamples"
                                @change="selectAllSamples"
                              ></v-switch>
                            </v-col>
                            <v-col
                              md="4"
                              cols="12"
                              class="font-weight-bold text-right"
                            >
                              (r) = Recheck,
                              <span class="red--text"
                                >(A/B/C/D/E) = Deviating</span
                              >
                            </v-col>
                          </v-row>
                          <v-simple-table dense class="text-center">
                            <thead>
                              <tr
                                v-for="(row, index) in resultsTableHeaders"
                                :key="'headerRow' + index"
                              >
                                <th
                                  class="text-center"
                                  v-for="(header, index) in row"
                                  :key="'header' + index"
                                >
                                  {{ header }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(row, index) in resultsTableRows"
                                :key="'row' + index"
                              >
                                <template v-if="row.newTest">
                                  <td
                                    :colspan="resultsTableHeaders[0].length"
                                    class="font-weight-bold tableSubHeaders text-left"
                                  >
                                    {{ row.newTest }}
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="caption" width="300">
                                    {{ row.det.detName }}
                                  </td>
                                  <td class="caption" width="50">
                                    {{ row.det.accreditation }}
                                  </td>
                                  <td class="caption" width="50">
                                    {{ row.det.lod }}
                                  </td>
                                  <td class="caption" width="50">
                                    {{ row.det.units }}
                                  </td>
                                  <td
                                    v-for="(sampleResults,
                                    index) in row.results"
                                    :key="'sampleResult' + index"
                                    class="caption"
                                    :class="[
                                      sampleResults.result &&
                                      sampleResults.result.charAt(0) != '<'
                                        ? 'font-weight-bold'
                                        : 'font-italic',
                                      sampleResults.exception
                                        ? ' tableWarnings'
                                        : '',
                                    ]"
                                  >
                                    <v-tooltip
                                      v-if="sampleResults.exception"
                                      bottom
                                    >
                                      <template v-slot:activator="{ on }">
                                        <div v-on="on">
                                          <span v-if="sampleResults.repeat"
                                            >(r)</span
                                          >
                                          {{ sampleResults.result }}
                                          <span
                                            class="font-weight-bold red--text"
                                            v-if="sampleResults.deviating"
                                          >
                                            ({{ sampleResults.deviating }})
                                          </span>
                                        </div>
                                      </template>
                                      {{ row.det.detName }}
                                      <br />
                                      {{ sampleResults.exception.exception }}
                                    </v-tooltip>

                                    <div v-else>
                                      <span v-if="sampleResults.repeat"
                                        >(r)</span
                                      >
                                      {{ sampleResults.result }}
                                      <span
                                        class="font-weight-bold red--text"
                                        v-if="sampleResults.deviating"
                                        >({{ sampleResults.deviating }})</span
                                      >
                                    </div>
                                  </td>
                                </template>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">
                          Sample Exceptions
                          <v-spacer />
                          <v-btn-toggle dense>
                            <v-btn @click="selectAllExceptions">
                              Select All
                              <v-icon class="ml-2">check_box</v-icon>
                            </v-btn>
                            <v-btn @click="selectedExceptions = []">
                              Select None
                              <v-icon class="ml-2"
                                >check_box_outline_blank</v-icon
                              >
                            </v-btn>
                          </v-btn-toggle>
                          <v-spacer />
                          <v-btn
                            icon
                            @click="exceptionKeyDialog = !exceptionKeyDialog"
                          >
                            <v-icon>help</v-icon>
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <v-card
                            flat
                            v-for="sample in selectedSamples"
                            :key="sample.SAMPNUM"
                          >
                            <v-card-title class="subtitle-2">
                              {{ sample.SAMPNUM }}
                            </v-card-title>
                            <v-card-text>
                              <v-list dense>
                                <v-list-item-group
                                  v-model="selectedExceptions"
                                  multiple
                                >
                                  <v-list-item
                                    :disabled="
                                      exceptionPermissionCheck(exception)
                                    "
                                    v-for="exception in sample.prebounced_exceptions"
                                    :key="exception.EXCEPTNID"
                                    :value="exception.EXCEPTNID"
                                    :color="
                                      exceptionPermissionCheck(exception)
                                        ? ''
                                        : 'primary'
                                    "
                                  >
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        {{
                                          exception.exception_details.string
                                        }}
                                        ({{ exception.exception_details.type }})
                                      </v-list-item-title>
                                      <v-list-item-subtitle
                                        v-if="exception.checked_by"
                                      >
                                        {{ exception.REASON }}:
                                        {{ exception.COMMENT }} by
                                        {{ exception.checked_by.USER_NAME }}
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                      <v-icon
                                        :color="exceptionIconColor(exception)"
                                      >
                                        {{ exceptionIconType(exception) }}
                                      </v-icon>
                                    </v-list-item-action>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                            </v-card-text>
                          </v-card>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card outlined>
                        <v-card-title class="subtitle-2"
                          >Update Exceptions</v-card-title
                        >
                        <v-card-text>
                          <v-row>
                            <v-col class="body-1">
                              {{ selectedExceptions.length }} exceptions
                              selected.
                            </v-col>
                          </v-row>

                          <v-row dense>
                            <v-col>
                              <v-radio-group v-model="form.action" row>
                                <v-radio label="N/A" value="0"></v-radio>
                                <v-radio
                                  label="Refer to Lab"
                                  value="1"
                                ></v-radio>
                                <v-radio
                                  label="Mark As Acknowlege"
                                  value="2"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col>
                              <v-checkbox
                                label="Flag Rule for Review"
                                v-model="form.review"
                              ></v-checkbox>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col>
                              <v-text-field
                                dense
                                outlined
                                label="Comments"
                                v-model="form.comment"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            :loading="submitting"
                            :disabled="
                              selectedExceptions.length == 0 || submitting
                            "
                            color="primary"
                            @click="submit"
                            >Submit</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-dialog v-model="jobQueriesDialog" width="1000">
        <v-card>
          <v-card-title>Job Queries</v-card-title>
          <v-card-text>
            <v-row v-for="query in jobData.queries" :key="query.QUERY_NO">
              <v-col>
                <v-card flat>
                  <v-card-title>Query: {{ query.QUERY_NO }}</v-card-title>
                  <v-card-text>
                    <v-row dense>
                      <v-col>{{ query.query }}</v-col>
                      <v-col class="text-right font-weight-bold">{{
                        query.action
                      }}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="jobNotesDialog" width="800">
        <v-card>
          <v-card-title>
            Job Notes
            <v-spacer />
            <v-btn icon @click="jobNotesEditing = !jobNotesEditing">
              <v-icon :color="jobNotesEditing ? 'primary' : ''">edit</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-textarea
              label="Job Notes"
              outlined
              :readonly="!jobNotesEditing"
              v-model="jobNotes"
              rows="10"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="jobNotesDialog = !jobNotesDialog">Cancel</v-btn>
            <v-spacer />
            <v-btn color="primary" @click="updateNotes">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="exceptionKeyDialog" width="500">
        <v-card>
          <v-card-title>Exceptions Key</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="red lighten-1">cancel</v-icon>
                </v-list-item-action>
                <v-list-item-content
                  >Exception not approved</v-list-item-content
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="orange lighten-1">help</v-icon>
                </v-list-item-action>
                <v-list-item-content
                  >Exception sent to lab for review</v-list-item-content
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="green lighten-1">check_circle</v-icon>
                </v-list-item-action>
                <v-list-item-content>Exception approved</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      job: this.$route.params.job,
      jobData: [],
      jobNotes: '',
      jobNotesDialog: false,
      jobNotesEditing: false,
      jobQueriesDialog: false,
      exceptionKeyDialog: false,
      exceptionTests: [],
      allSamples: false,
      allResults: false,
      selectedSamples: [],
      selectedExceptions: [],
      form: {
        action: '0',
        review: false,
        comment: '',
      },
      submitting: false,
    };
  },
  computed: {
    resultsTableHeaders() {
      var headersArray = [];
      var row1 = ['', '', '', ''];
      var row2 = ['Det', 'Accred', 'LOD', 'Units'];
      this.selectedSamples.forEach((sample) => {
        row1.push(sample.SAMPNUM);
        row2.push(sample.TYPE);
      });
      headersArray.push(row1);
      headersArray.push(row2);
      return headersArray;
    },
    resultsTableRows() {
      if (this.selectedSamples.length > 0) {
        var detsArray = [];
        var resultsArray = [];
        this.selectedSamples.forEach((sample) => {
          sample.reportable_results.forEach((result) => {
            if (
              this._.find(this.exceptionTests, {
                sample: sample.SAMPNUM,
                test: result.TEST,
              }) ||
              this.allResults
            ) {
              if (!this._.find(detsArray, { det: result.DET })) {
                detsArray.push({
                  det: result.DET,
                  detName: result.det.REPNAME,
                  detOrder: result.DETORDER,
                  test: result.TEST,
                  testName: result.det.test.TEST_NAME,
                  lod: result.det.lod,
                  units: result.det.units,
                  accreditation: result.accreditation,
                });
              }
            }
          });
        });
        detsArray = this._.orderBy(
          detsArray,
          ['test', 'detOrder'],
          ['asc', 'asc']
        );
        var test = '';
        detsArray.forEach((det) => {
          if (test != det.test) {
            resultsArray.push({
              newTest: det.testName,
            });
          }
          var results = [];
          this.selectedSamples.forEach((sample) => {
            var result = this._.find(sample.reportable_results, {
              DET: det.det,
            });

            if (result) {
              var exception = this._.find(this.exceptionTests, {
                sample: result.SAMPNUM,
                test: result.TEST,
              });
              results.push({
                sampnum: result.SAMPNUM,
                det: result.DET,
                test: result.TEST,
                lod: result.det.lod,
                units: result.det.units,
                accreditation: result.accreditation,
                deviating: result.DEVIATING,
                exception: exception ? exception : null,
                result: result.OUTPUT,
                repeat: result.REPEAT == 1 ? true : false,
              });
            } else {
              results.push({});
            }
          });
          resultsArray.push({
            det: det,
            results: results,
          });
          test = det.test;
        });
      }
      return resultsArray;
    },
  },
  mounted() {
    this.getJob();
  },
  methods: {
    getJob() {
      //this.$axios.get('approvals/job/' + this.job).then((response) => {
      this.$axios.get('prebounced/job/' + this.job).then((response) => {
        this.jobData = response.data.data;
        this.jobNotes = response.data.data.JOBNOTES;
        this.filterSamples();
        this.loading = false;
      });
    },
    filterSamples() {
      this.selectedSamples = [];
      this.jobData.samples.forEach((sample) => {
        //if (this.allSamples == false && sample.prebounced_exceptions.length == 0) {
        if (this.allSamples == false && sample.prebounced_exceptions.length == 0) {          
          return;
        }
        this.selectedSamples.push(sample);
        sample.prebounced_exceptions.forEach((exception) => {
          exception.exception_details.tests.forEach((test) => {
            if (
              !this._.find(this.exceptionTests, {
                sample: sample.SAMPNUM,
                test: test,
              })
            ) {
              this.exceptionTests.push({
                sample: sample.SAMPNUM,
                test: test,
                exception: exception.exception_details.string,
              });
            }
          });
        });
      });
    },
    selectAllSamples() {
      this.allSamples = !this.allSamples;
      this.filterSamples();
    },
    selectAllExceptions() {
      this.selectedSamples.forEach((sample) => {
        sample.prebounced_exceptions.forEach((exception) => {
          if (this.exceptionPermissionCheck(exception)) {
            return;
          }
          if (!this.selectedExceptions.includes(exception.EXCEPTNID)) {
            this.selectedExceptions.push(exception.EXCEPTNID);
          }
        });
      });
    },
    submit() {
      this.submitting = true;
      this.$axios
        .patch('/prebounced/update-exception', {
          exceptions: this.selectedExceptions,
          action: this.form.action,
          comment: this.form.comment,
        })
        .then((response) => {
          this.getJob();
          this.submitting = false;
          this.resetForm();
        });
    },
    updateNotes() {
      this.$axios
        .patch('/jobs/' + this.job, {
          JOBNOTES: this.jobNotes,
        })
        .then((response) => {
          this.getJob();
          this.jobNotesDialog = false;
          this.jobNotesEditing = false;
        });
    },
    exceptionPermissionCheck(exception) {
      if (exception.SECTION == this.$auth.user.SECTION) {
        return false;
      }
      if (this.$auth.user.SECTION == 'APPROVER') {
        return false;
      }
      if (this.$auth.user.SECTION == 'IT') {
        return false;
      }
      return true;
    },
    exceptionIconType(exception) {
      if (exception.REASON == 'Referred To Lab') {
        return 'help';
      }
      if (exception.REASON == 'Approved Via Chemportal') {
        return 'check_circle';
      }
      return 'cancel';
    },
    exceptionIconColor(exception) {
      if (exception.REASON == 'Referred To Lab') {
        return 'orange';
      }
      if (exception.REASON == 'Approved Via Chemportal') {
        return 'green';
      }
      return 'red ';
    },
    resetForm() {
      this.selectedExceptions = [];
      this.form.approved = false;
      this.form.comment = '';
    },
  },
};
</script>

<style></style>
