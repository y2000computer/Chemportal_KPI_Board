<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Print Sample Labels</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                outlined
                placeholder="xx-xxxxx"
                label="Job Search"
                v-validate="{ rules: 'required|length:8' }"
                name="Job"
                :error-messages="errors.first('Job')"
                autofocus
                :loading="loading"
                append-icon="search"
                @click:append="searchTrigger()"
                v-model="search"
                v-on:keyup.enter="searchTrigger()"
              ></v-text-field>
            </v-col>
            <v-col md="7" cols="12" class="text-center">
              <v-alert v-if="searchError" type="error">{{ searchError }}</v-alert>

              <v-btn-toggle v-if="$vuetify.breakpoint.name != 'xs'">
                <v-btn v-if="job.JOB" @click.prevent="setAllPrint(false)">
                  Select None
                  <v-icon class="ml-2">check_box_outline_blank</v-icon>
                </v-btn>
                <v-btn v-if="job.JOB" @click.prevent="setAllPrint(true)">
                  Select All
                  <v-icon class="ml-2">check_box</v-icon>
                </v-btn>
                <!-- <v-btn
                  v-if="job.JOB"
                  v-model="priorityLabels"
                  label="Priority Labels"
                  :color="priorityLabels ? 'priorityLabels' : ''"
                  @click="priorityLabels = !priorityLabels"
                >
                  Priority
                  <v-icon v-if="priorityLabels" class="ml-2">check_box</v-icon>
                  <v-icon v-else class="ml-2">check_box_outline_blank</v-icon>
                </v-btn>-->
              </v-btn-toggle>

              <v-btn-toggle v-if="job.JOB" mandatory v-model="printer" color="primary">
                <v-btn value="A">Printer A</v-btn>
                <v-btn value="B">Printer B</v-btn>
              </v-btn-toggle>
              <div v-if="$vuetify.breakpoint.name == 'xs'">
                <v-row dense>
                  <v-col cols="12">
                    <v-btn block v-if="job.JOB" @click.prevent="setAllPrint(false)">
                      Select None
                      <v-icon class="ml-2">check_box_outline_blank</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn block v-if="job.JOB" @click.prevent="setAllPrint(true)">
                      Select All
                      <v-icon class="ml-2">check_box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      block
                      v-if="job.JOB"
                      v-model="priorityLabels"
                      label="Priority Labels"
                      :color="priorityLabels ? 'priorityLabels' : ''"
                      @click="priorityLabels = !priorityLabels"
                    >
                      Priority
                      <v-icon v-if="priorityLabels" class="ml-2">check_box</v-icon>
                      <v-icon v-else class="ml-2">check_box_outline_blank</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col
              md="2"
              cols="12"
              :class="
                $vuetify.breakpoint.smAndDown ? 'text-center' : 'text-right'
              "
            >
              <v-btn
                color="primary"
                v-if="job.JOB"
                @click.prevent="printLabels"
                x-large
                :loading="printing"
                :disabled="printing"
              >
                Print
                <v-icon class="ml-4">print</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense v-if="job.JOB">
            <v-col md="3" cols="12">
              <v-card flat>
                <v-card-title>Job Labels</v-card-title>
                <v-card-text>
                  <v-row dense>
                    <v-col>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">Job Label</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>{{ job.JOB }}</v-list-item-title>
                            <v-list-item-subtitle
                              :class="
                                job.office.client.priority_labels
                                  ? 'red--text font-weight-bold font-italic'
                                  : ''
                              "
                            >{{ job.office.client.CLIENTNAME }}</v-list-item-subtitle>
                            <v-list-item-subtitle>
                              Logged by
                              {{ job.logged_by.USER_NAME }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle>
                              Logged on
                              {{
                              $moment(job.LOGDATE, 'YYYY-MM-DD').format(
                              'DD/MM/YYYY'
                              )
                              }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="job.OFFICEDATE">
                              Due on
                              {{
                              $moment(job.OFFICEDATE, 'YYYY-MM-DD').format(
                              'DD/MM/YYYY'
                              )
                              }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-switch inset color="primary" v-model="job.print" hide-details></v-switch>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">Tray Labels</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>Add Tray/s:</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn-toggle>
                              <v-btn small @click="addTray = addTray - 1" :disabled="addTray == 0">
                                <v-icon x-small>remove</v-icon>
                              </v-btn>
                              <v-btn small>{{ addTray }}</v-btn>
                              <v-btn small @click="addTray = addTray + 1">
                                <v-icon small>add</v-icon>
                              </v-btn>
                              <v-btn
                                small
                                color="primary"
                                @click="addTrays"
                                :disabled="addTray == 0 || traysLoading"
                                :loading="traysLoading"
                              >Add</v-btn>
                            </v-btn-toggle>
                          </v-list-item-action>
                        </v-list-item>

                        <v-list-item
                          class="mt-2"
                          v-for="(tray, key) in job.trays"
                          :key="tray.TRAY + key"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row dense>
                                <v-col>{{ tray.TRAY }}</v-col>
                                <v-col>{{ tray.SHELF }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-switch
                              inset
                              :disabled="tray.PRINTED == true"
                              color="primary"
                              v-model="tray.print"
                            ></v-switch>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="9" cols="12">
              <v-card flat>
                <v-card-title>Sample Labels</v-card-title>
                <v-card-text>
                  <v-row dense justify="space-between">
                    <v-col md="3" cols="12">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">Sample Details</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col md="4" cols="12">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">Containers</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn-toggle rounded>
                              <v-btn small icon @click="setContainersPrint(false)">
                                <v-icon small>check_box_outline_blank</v-icon>
                              </v-btn>
                              <v-btn small icon @click="setContainersPrint(true)">
                                <v-icon small>check_box</v-icon>
                              </v-btn>
                            </v-btn-toggle>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col md="4" cols="12">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">Preps</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn-toggle rounded>
                              <v-btn small icon @click="setPrepPrint(false)">
                                <v-icon small>check_box_outline_blank</v-icon>
                              </v-btn>
                              <v-btn small icon @click="setPrepPrint(true)">
                                <v-icon small>check_box</v-icon>
                              </v-btn>
                            </v-btn-toggle>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                  <div v-for="(sample, index) in job.samples" :key="sample.SAMPNUM">
                    <v-row dense justify="space-between">
                      <v-col md="3" cols="12">
                        <v-list>
                          <v-list-item three-line>
                            <v-list-item-content>
                              <v-list-item-title>
                                Samp No:
                                {{ sample.SAMPNUM }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                Location:
                                {{ sample.CLIENTSREF }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle>
                                Samp Ref:
                                {{ sample.SAMPLE_REF }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle>
                                Samp ID:
                                {{ sample.SAMPLE_ID }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle>
                                Samp Top:
                                {{ sample.SAMPTOP }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-if="sample.SAMPDATE">
                                Samp Date:
                                {{$moment(sample.SAMPDATE, "YYYY-MM-DD").format(
                                "DD/MM/YYYY"
                                ),}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                      <v-col md="4" cols="12">
                        <v-list>
                          <v-list-item
                            v-for="(container, index) in sample.containers"
                            :key="'C' + index"
                          >
                            <v-list-item-content>
                              <v-list-item-title>{{ container.container_type.DESCRIPTN }}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-switch
                                inset
                                color="primary"
                                v-model="container.print"
                                :id="sample.SAMPNUM + index"
                              ></v-switch>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-col>
                      <v-col md="4" cols="12">
                        <v-list>
                          <v-list-item
                            v-for="(preplabel, index) in sample.prep_labels"
                            :key="'P' + index"
                          >
                            <v-list-item-content>
                              <v-list-item-title>{{ preplabel.name }}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-switch inset color="primary" v-model="preplabel.print"></v-switch>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                    <v-divider v-if="index + 1 < job.samples.length" />
                  </div>
                </v-card-text>
              </v-card>
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
      loading: false,
      printers: ["A", "B"],
      printer: "",
      printing: false,
      search: "",
      job: [],
      addTray: 0,
      traysLoading: false,
      priorityLabels: false,
      searchError: "",
      printData: {
        path: "\\\\nm-web01\\RegistrationLabels$\\",
        filename: "",
        csvHeaders: [
          "JOB",
          "TRAY",
          "CLIENT",
          "SAMPNUM",
          "PROJECT",
          "SAMPLE_REF",
          "SAMPLE_ID",
          "CLIENTS_REF",
          "CONTAINER",
          "SAMPTOP",
          "SAMPBOTTOM",
          "LOGGED BY",
          "LOG DATE",
          "DUE DATE",
          "DISPOSAL DATE",
          "TURNAROUND",
          "EXTSTORAGE",
          "FORMAT",
          "PRINTER",
          "CONTAINER COUNT"
        ],
        csvRows: []
      }
    };
  },
  mounted() {
    //If job param passed in url then auto search for job
    if (this.$route.query.job) {
      let job = this.$route.query.job;
      this.search = job;
      this.searchTrigger();
    }
  },
  methods: {
    searchTrigger() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.searchError = "";
          this.clearJob();
          this.addTray = 0;
          this.jobSearch(this.search);
        }
      });
    },
    clearJob() {
      this.job = [];
    },
    jobSearch(job) {
      this.loading = true;
      if (job.includes("HB")) {
        var path = "holdbatches/labels/";
      } else {
        var path = "jobs/labels/";
      }
      this.$axios
        .get(path + job)
        .then(response => {
          this.job = response.data.data;
        })
        .then(() => {
          this.setJobPrint(true);
          this.setTrayPrint(true);
          this.setContainersPrint(true);
          this.setPrepPrint(true);
        })

        .then(() => {
          //this.clientPriorityCheck();
          this.loading = false;
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
          this.searchError = "Error Finding Job, Please Try Again";
        });
    },
    setJobPrint(value) {
      this.$set(this.job, "print", value);
    },
    setContainersPrint(value) {
      this.job.samples.forEach((sample, skey) => {
        sample.containers.forEach((container, ckey) => {
          this.$set(this.job.samples[skey].containers[ckey], "print", value);
        });
      });
    },
    setTrayPrint(value) {
      this.job.trays.forEach((tray, key) => {
        if (tray.PRINTED == true) {
          print = false;
        } else {
          print = value;
        }
        this.$set(this.job.trays[key], "print", print);
      });
    },
    setPrepPrint(value) {
      this.job.samples.forEach((sample, sampIndex) => {
        sample.prep_labels.forEach((prepLabel, prepIndex) => {
          this.$set(
            this.job.samples[sampIndex].prep_labels[prepIndex],
            "print",
            value
          );
        });
      });
    },
    setAllPrint(value) {
      this.setJobPrint(value);
      this.setContainersPrint(value);
      this.setTrayPrint(value);
      this.setPrepPrint(value);
    },

    addTrays() {
      this.traysLoading = true;
      this.$axios
        .post("job-trays", {
          job: this.job.JOB,
          count: this.addTray
        })
        .then(() => {
          this.getTrays();
          this.addTray = 0;
        });
    },
    getTrays() {
      this.traysLoading = true;
      this.$axios
        .get("job-trays/" + this.search)
        .then(response => {
          this.job.trays = response.data.data;
        })
        .then(() => {
          this.setTrayPrint(true);
          this.traysLoading = false;
        });
    },
    printLabels() {
      this.printing = true;
      this.printData.filename = this.job.JOB + ".csv";
      //Empty Rows just in case
      this.printData.csvRows = [];
      let trayList = [];

      //Split labels between 2 printers
      //if (this.job.office.client.priority_labels == false) {
      if (this.printer == "A") {
        var printer = "NM_BOOKING_IN_LABEL_B";
      } else {
        var printer = "NM_BOOKING_IN_LEAN_TEST";
      }

      //var printer = "NM_BOOKING_IN_LABEL_A";

      //Loop through each sample and container and push labels that require printing
      this.job.samples.forEach(sample => {
        sample.containers.forEach((container, container_index) => {
          if (container.print == true) {
            this.printData.csvRows.push([
              this.job.JOB,
              "",
              this.job.office.client.CLIENTNAME,
              sample.SAMPNUM,
              sample.PROJECT,
              sample.SAMPLE_REF,
              sample.SAMPLE_ID,
              sample.CLIENTSREF,
              container.container_type.DESCRIPTN,
              sample.SAMPTOP,
              sample.SAMPBOTTOM,
              this.job.logged_by.USER_NAME,
              this.$moment(this.job.LOGDATE, "YYYY-MM-DD").format("DD/MM/YYYY"),
              this.$moment(this.job.OFFICEDATE, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),
              this.$moment(this.job.DISPDATE, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),
              "",
              this.job.EXTSTORAGE,
              "NM_CONTAINER_LABEL.BTW",
              printer,
              container_index + 1 + "/" + sample.containers_count
            ]);
          }
        });
        let prepLabels = [];
        sample.prep_labels.forEach(prepLabel => {
          if (prepLabel.print == true) {
            prepLabels.push([
              this.job.JOB,
              "",
              this.job.office.client.CLIENTNAME,
              sample.SAMPNUM,
              sample.PROJECT,
              sample.SAMPLE_REF,
              sample.SAMPLE_ID,
              sample.CLIENTSREF,
              prepLabel.name,
              sample.SAMPTOP,
              sample.SAMPBOTTOM,
              this.job.logged_by.USER_NAME,
              this.$moment(this.job.LOGDATE, "YYYY-MM-DD").format("DD/MM/YYYY"),
              prepLabel.subcon
                ? this.$moment(this.job.SUBCONDATE, "YYYY-MM-DD").format(
                    "DD/MM/YYYY"
                  )
                : this.$moment(this.job.OFFICEDATE, "YYYY-MM-DD").format(
                    "DD/MM/YYYY"
                  ),
              this.$moment(this.job.DISPDATE, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),
              "",
              this.job.EXTSTORAGE,
              "NM_PREP_LABEL.BTW",
              printer,
              ""
            ]);
          }
        });
        prepLabels.sort((a, b) =>
          a[8] > b[8] ? 1 : a[8] == b[8] ? (a[3] > b[3] ? 1 : -1) : -1
        );
        prepLabels.forEach(prepLabel => {
          this.printData.csvRows.push(prepLabel);
        });
      });
      //Create empty array for prep labels (to be sorted later)
      // let prepLabels = [];
      // //Loop through prep labels and push those that require printing
      // this.job.samples.forEach(sample => {
      //   sample.prep_labels.forEach(prepLabel => {
      //     if (prepLabel.print == true) {
      //       prepLabels.push([
      //         this.job.JOB,
      //         "",
      //         this.job.office.client.CLIENTNAME,
      //         sample.SAMPNUM,
      //         sample.PROJECT,
      //         sample.SAMPLE_REF,
      //         sample.SAMPLE_ID,
      //         sample.CLIENTSREF,
      //         prepLabel.name,
      //         sample.SAMPTOP,
      //         sample.SAMPBOTTOM,
      //         this.job.logged_by.USER_NAME,
      //         this.$moment(this.job.LOGDATE, "YYYY-MM-DD").format("DD/MM/YYYY"),
      //         prepLabel.subcon
      //           ? this.$moment(this.job.SUBCONDATE, "YYYY-MM-DD").format(
      //               "DD/MM/YYYY"
      //             )
      //           : this.$moment(this.job.OFFICEDATE, "YYYY-MM-DD").format(
      //               "DD/MM/YYYY"
      //             ),
      //         this.$moment(this.job.DISPDATE, "YYYY-MM-DD").format(
      //           "DD/MM/YYYY"
      //         ),
      //         "",
      //         this.job.EXTSTORAGE,
      //         "NM_PREP_LABEL.BTW",
      //         printer,
      //         ""
      //       ]);
      //     }
      //   });
      // });
      // //Sort Preplabels first by type, then by sample number
      // prepLabels.sort((a, b) =>
      //   a[8] > b[8] ? 1 : a[8] == b[8] ? (a[3] > b[3] ? 1 : -1) : -1
      // );
      //Append prep labels array to CSV Rows
      // this.printData.csvRows = this.printData.csvRows.concat(prepLabels);
      //Add Job Label to CSV rows if required
      if (this.job.print == true) {
        this.printData.csvRows.push([
          this.job.JOB,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          this.job.logged_by.USER_NAME,
          this.$moment(this.job.LOGDATE, "YYYY-MM-DD").format("DD/MM/YYYY"),
          this.job.OFFICEDATE
            ? this.$moment(this.job.OFFICEDATE, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )
            : "",
          "",
          this.job.TURNAROUND,
          this.job.EXTSTORAGE,
          "NM_REG_JOB_LABEL.BTW",
          printer,
          ""
        ]);
      }
      //Loop through tray labels and push to CSV rows if required
      this.job.trays.forEach(tray => {
        if (tray.print == true) {
          //Push to tray list to flag as printed
          trayList.push(tray.TRAY);
          this.printData.csvRows.push([
            this.job.JOB,
            tray.TRAY,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            this.job.logged_by.USER_NAME,
            "",
            "",
            this.$moment(this.job.DISPDATE, "YYYY-MM-DD").format("DD/MM/YYYY"),
            "",
            this.job.EXTSTORAGE,
            "NM_TRAY_LABEL.BTW",
            printer,
            ""
          ]);
        }
      });
      this.$axios.post("csv/generate-csv", this.printData).then(() => {
        if (trayList.length > 0) {
          this.$axios
            .patch("/job-trays/print", {
              trays: trayList
            })
            .then(() => {
              this.getTrays();
            });
        }
        this.$store.dispatch("snackbar/showSnackbar", "Sent To Printer");
        this.printing = false;
      });
    },

    printPrepList() {
      window.open(
        "http://nm-web01:8080/jasperserver/flow.html?j_username=sampleReg&j_password=sampleReg&_flowId=viewReportFlow&ParentFolderUri=/Reports/Sample_Registration&reportUnit=/Reports/Sample_Registration/PrepList&output=pdf&standAlone=true&JOB=" +
          this.job.JOB,
        "_blank"
      );
    }
  }
};
</script>

<style></style>
