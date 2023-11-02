<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Report Generator</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col>
              <v-subheader>Job Search</v-subheader>
            </v-col>
          </v-row>
          <v-row dense align="center">
            <v-col md="3" cols="12">
              <v-autocomplete
                dense
                outlined
                label="Select Client"
                v-model="client"
                :items="clients"
                item-text="CLIENTNAME"
                item-value="CLIENT"
                :loading="clientsLoading"
                @keyup.enter="getClientJobs"
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col md="3" cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                label="Project"
                v-model="project"
                @keyup.enter="getClientJobs"
              ></v-text-field>
            </v-col>
            <v-col md="3" cols="12">
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :return-value.sync="dateRange"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    clearable
                    dense
                    outlined
                    hide-details
                    v-model="dateRangeDisplay"
                    label="Log Date Range"
                    v-on="on"
                    readonly
                    @click:clear="dateRange = []"
                    @keyup.enter="getClientJobs"
                  ></v-text-field>
                </template>
                <v-date-picker color="primary" v-model="dateRange" label="Log Date Range" range>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.dateMenu.save(dateRange)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="text-center">
              <v-btn
                @click="getClientJobs"
                large
                color="primary"
                :disabled="clientJobsLoading"
                :loading="clientJobsLoading"
              >
                Search
                <v-icon class="ml-2">search</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-row dense justify="space-between">
            <v-col md="3" cols="12">
              <v-card flat>
                <v-card-title>Client Jobs</v-card-title>
                <v-card-text>
                  <v-list dense v-if="clientJobs.length > 0">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">Select All</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox v-model="allJobs" color="primary" @change="selectAllJobs">All</v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item three-line v-for="job in clientJobs" :key="job.JOB">
                      <v-list-item-content>
                        <v-list-item-title>{{ job.JOB }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                          job.PROJECT
                          }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          Reported:
                          {{ dateConvert(job.REPDATE) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox color="primary" v-model="selectedJobs" :value="job" multiple></v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- <v-col md="2">
              <v-card flat>
                <v-card-title>Sample Filter</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-switch
                      color="primary"
                      v-model="sampleFilter"
                      :disabled="selectedJobs.length == 0"
                      hide-details
                      @change="sampleFilterChange"
                    ></v-switch>
                    <v-col></v-col>
                  </v-row>
                  <div v-for="job in jobSamples" :key="job.JOB">
                    <v-subheader>{{ job.JOB }}</v-subheader>
                    <v-list dense>
                      <v-list-item v-for="sample in job.samples" :key="sample.SAMPNUM">
                        <v-list-item-content>
                          <v-list-item-title>
                            {{
                            sample.SAMPNUM
                            }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox v-model="selectedSamples" :value="sample" color="primary"></v-checkbox>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>-->
            <v-col md="3" cols="12">
              <v-card flat>
                <v-card-title>Report Formats</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item v-for="format in reportFormats" :key="format.REPORT">
                      <v-list-item-content>
                        <v-list-item-title>
                          {{
                          format.REPORTNAME
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox color="primary" v-model="selectedReports" :value="format"></v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3" cols="12">
              <v-card flat>
                <v-card-title>Report Options</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Combined Report</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox color="primary" v-model="combinedReport"></v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Download Report</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox color="primary" v-model="downloadReport" disabled></v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    x-large
                    color="primary"
                    @click="report"
                    :disabled="
                      (selectedSamples.length == 0 &&
                        selectedJobs.length == 0 ) ||
                        selectedReports.length == 0 ||
                        reporting
                    "
                    :loading="reporting"
                  >
                    {{ reportButtonText }}
                    <v-icon class="ml-2">description</v-icon>
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          {{reportPath}}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      clientsLoading: true,
      clients: [],
      reportFormats: [],
      client: "",
      clientName: "",
      project: "",
      dateRange: [],
      dateMenu: false,
      clientJobsLoading: false,
      clientJobs: [],
      selectedJobs: [],
      allJobs: false,
      sampleFilter: false,
      reporting: false,
      reportPath: "",
      jobSamples: [],
      selectedSamples: [],
      selectedReports: [],
      combinedReport: true,
      downloadReport: false
    };
  },
  computed: {
    dateRangeDisplay: {
      get() {
        if (this.dateRange.length) {
          return (
            this.dateConvert(this.dateRange[0]) +
            " - " +
            this.dateConvert(this.dateRange[1])
          );
        } else {
          return "";
        }
      }
    },
    reportButtonText() {
      if (this.sampleFilter) {
        return "Report " + this.selectedSamples.length + " Samples";
      }
      if (this.selectedJobs.length > 0) {
        return "Report " + this.selectedJobs.length + " Jobs";
      }
      return "N/A";
    }
  },
  mounted() {
    this.getClients();
    this.getReportFormats();
  },
  methods: {
    dateConvert(date) {
      if (date) {
        return this.$moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
      } else {
        return "";
      }
    },
    getClients() {
      this.$axios.get("clients/ids").then(response => {
        this.clients = response.data.data;
        this.clientsLoading = false;
      });
    },
    getReportFormats() {
      this.$axios.get("report-formats/api").then(response => {
        this.reportFormats = response.data.data;
      });
    },
    getClientJobs() {
      this.clientJobs = [];
      this.selectedJobs = [];
      this.jobSamples = [];
      this.selectedSamples = [];
      this.allJobs = false;
      this.clientName = "";

      this.clientJobsLoading = true;
      var client = encodeURIComponent(this.client);
      var project = "";
      var dateRange = "";
      if (this.project.length > 0) {
        project = "&project=" + this.project;
      }
      if (this.dateRange.length > 0) {
        var dateRange =
          "&startDate=" + this.dateRange[0] + "&endDate=" + this.dateRange[1];
      }
      this.$axios
        .get(
          "jobs/client-jobs?reportable=true" +
            project +
            dateRange +
            "&client=" +
            client
        )
        .then(response => {
          this.clientJobs = response.data.data;
          this.clientName = response.data.data[0].office.client.client_name;
          this.clientJobsLoading = false;
        })
        .catch(e => {
          console.log(e);
          this.clientJobsLoading = false;
        });
    },
    selectAllJobs(e) {
      if (e) {
        this.selectedJobs = [];
        this.combinedReport = true;
        this.clientJobs.forEach(job => {
          this.selectedJobs.push(job);
        });
      } else {
        this.selectedJobs = [];
      }
    },
    sampleFilterChange(e) {
      if (e) {
        this.getJobSamples();
      } else {
        this.jobSamples = [];
        this.selectedSamples = [];
      }
    },
    getJobSamples() {
      var jobArray = [];
      this.selectedJobs.forEach(job => {
        jobArray.push(job.JOB);
      });
      this.$axios
        .get("jobSamples", {
          params: {
            jobs: jobArray,
            reportable: true
          }
        })
        .then(response => {
          this.jobSamples = response.data;
        });
    },
    report() {
      this.reporting = true;
      if (this.combinedReport) {
        this.runCombinedReport();
      } else {
        this.runReports();
      }
    },
    runReports() {
      //If not filtered by sample (so by job)
      if (!this.sampleFilter) {
        this.selectedJobs.forEach(job => {
          var clientName = job.office.client.CLIENTNAME;
          var logYear = job.LOGDATE.substring(0, 4);
          this.selectedReports.forEach(report => {
            var savePath = this.setReportPath(
              report.SAVE_AS,
              logYear,
              clientName,
              job.JOB
            );
            this.$axios
              .get(
                "http://chemtest-api/api/reportFilter?report=" +
                  report.REPORTNAME +
                  "&saveAs=" +
                  savePath +
                  "&jobs[]=" +
                  job.JOB
              )
              .then(response => {
                this.reporting = false;
              })
              .catch(e => {
                this.error = e + "";
                this.reporting = false;
              });
          });
        });
      }
    },
    runCombinedReport() {
      if (!this.sampleFilter) {
        var clientName = this.selectedJobs[0].office.client.CLIENTNAME;
        var logYear = this.selectedJobs[0].LOGDATE.substring(0, 4);
        var firstJob = this.selectedJobs[0].JOB;
        var jobList = "";
        this.selectedJobs.forEach(job => {
          jobList += "&jobs[]=" + job.JOB;
        });
        this.selectedReports.forEach(report => {
          // var savePath = encodeURI(
          //   this.setReportPath(report.SAVE_AS, logYear, clientName, firstJob)
          // );
          var savePath = this.setReportPath(
            report.SAVE_AS,
            logYear,
            clientName,
            firstJob
          );
          this.reportPath = savePath;
          this.$axios
            .get(
              "http://chemtest-api/api/reportFilter?report=" +
                report.REPORTNAME +
                "&saveAs=" +
                savePath +
                jobList
            )
            .then(response => {
              this.reporting = false;
            });
        });
      }
    },
    setReportPath(oldPath, logYear, clientName, job) {
      var newPath = oldPath.replace("+NumTrim(Year(o:Logdate))+", logYear);
      var newPath = newPath.replace(
        '+Trim(Lookup("ClientName","Clients",o:Client))+',
        encodeURIComponent(clientName)
      );
      var newPath = newPath.replace("+Trim(o:job)+", job);
      var newPath = newPath.replace('"+o:job+"', job);
      var newPath = newPath.replace(/"/g, "");
      var newPath = newPath.replace(
        "+DTOS(Today())+ +STRTRAN(time(),:,)+",
        this.$moment().format("YYYYMMDD HHmmss")
      );
      this.repor;
      return newPath;
    }
  }
};
</script>

<style></style>
