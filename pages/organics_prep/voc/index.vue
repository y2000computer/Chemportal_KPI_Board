<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>VOC Prep</v-card-title>
        <v-card-text>
          <!-- <v-row dense justify="space-between">
            <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Sample"
                v-model="search"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="getSample"
                ref="search"
                :loading="sampleLoading"
              ></v-text-field>
            </v-col>
            <v-col md="8" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Sample</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Sample:</v-col>
                                <v-col class="font-weight-bold">
                                  {{
                                  sample.SAMPNUM
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
                                <v-col cols="3">Job:</v-col>
                                <v-col class="font-weight-bold">
                                  {{
                                  sample.JOB
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
                                <v-col cols="3">Client:</v-col>
                                <v-col class="font-weight-bold">
                                  {{
                                  sample.job
                                  ? sample.job.office.client.CLIENTNAME
                                  : ''
                                  }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>-->
          <v-row>
            <v-col>
              <v-btn large color="primary" @click="createTray">CreateTray</v-btn>
            </v-col>
            <v-col>
              <v-btn
                large
                color="primary"
                @click="addSampleDialog = !addSampleDialog"
                :disabled="!selectedTray.STRAYID"
              >Add Samples</v-btn>
            </v-col>
            <v-col></v-col>
          </v-row>
          <v-row>
            <v-col md="3" cols="12">
              Open Trays
              <v-list dense>
                <v-list-item
                  v-for="tray in openTrays"
                  :key="tray.STRAYID"
                  @click="getTray(tray.STRAYID)"
                >
                  <v-list-item-content>
                    <v-list-item-title>Tray: {{tray.STRAYID}}</v-list-item-title>
                    <v-list-item-subtitle>Date: {{tray.CREATEDDT}}</v-list-item-subtitle>
                    <v-list-item-subtitle>Samples: {{tray.containers_count}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      :disabled="tray.containers_count > 0"
                      @click="deleteTray(tray.STRAYID)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col>
              Tray: {{selectedTray.STRAYID}}
              Created: {{selectedTray.CREATEDDT}}
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sample</th>
                    <th>Job</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(container,index) in selectedTray.containers"
                    :key="container.STRAYCNTID"
                  >
                    <td>{{index + 1}}</td>
                    <td>{{container.SAMPNUM}}</td>
                    <td>{{container.sample.JOB}}</td>
                    <td>{{container.sample.job.office.client.CLIENTNAME}}</td>
                    <td>{{container.ADDDATE}}</td>
                    <td>{{container.ADDTM}}</td>
                    <td>
                      <v-btn icon small @click="removeItem(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-col md="3" cols="12">
              <v-list dense>
                <v-list-item v-for="tray in completedTrays" :key="tray.STRAYID">
                  <v-list-item-content>
                    <v-list-item-title>Tray: {{tray.STRAYID}}</v-list-item-title>
                    <v-list-item-subtitle>Date: {{tray.CREATEDDT}}</v-list-item-subtitle>
                    <v-list-item-subtitle>Samples: {{tray.containers_count}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      :disabled="tray.containers_count > 0"
                      @click="deleteTray(tray.STRAYID)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      :disabled="tray.containers_count > 0"
                      @click="deleteTray(tray.STRAYID)"
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-dialog v-model="addSampleDialog" width="1000">
        <v-card min-height="1000">
          <v-card-title>Add Samples To Tray {{selectedTray.STRAYID}}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-btn>Add Blank ?</v-btn>
              </v-col>
              <v-col>
                <v-btn>Add QC ?</v-btn>
              </v-col>
              <v-col>
                <v-btn @click="completeTray">Complete Tray</v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-text-field
                  dense
                  outlined
                  label="Scan Sample"
                  v-model="search"
                  autofocus
                  append-icon="mdi-barcode-scan"
                  hide-details
                  @keyup.enter="addSample"
                  ref="search"
                  :loading="sampleLoading"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Sample</th>
                      <th>Job</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(container,index) in selectedTray.containers"
                      :key="container.STRAYCNTID"
                    >
                      <td>{{index + 1}}</td>
                      <td>{{container.SAMPNUM}}</td>
                      <td>{{container.sample.JOB}}</td>
                      <td>{{container.sample.job.office.client.CLIENTNAME}}</td>
                      <td>{{container.ADDDATE}}</td>
                      <td>{{container.ADDTM}}</td>
                      <td>
                        <v-btn icon small @click="printSampleLabel(container)">
                          <v-icon>mdi-printer</v-icon>
                        </v-btn>
                        <v-btn icon small @click="removeItem(index)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-row>
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
      date: this.$moment(),
      traysLoading: true,
      trays: [],
      openTrays: [],
      completedTrays: [],
      search: "",
      sample: [],
      trayLists: [],
      selectedTray: [],
      sampleLoading: false,
      addSampleDialog: false,
      printData: {
        path: "\\\\nm-web01\\RegistrationLabels$\\",
        // path:
        //   "\\\\nm-fileserver\\shared areas\\free access\\RegistrationLabelsTest\\",
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
    this.getTrays();
  },
  methods: {
    getTrays() {
      this.openTrays = [];
      this.completedTrays = [];
      this.traysLoading = true;
      this.$axios
        .get("sample-trays?created_date=" + this.date.format("YYYY-MM-DD"))
        .then(response => {
          this.trays = response.data.data;
          this.filterTrays();
          this.traysLoading = false;
        });
    },
    filterTrays() {
      this.trays.forEach(tray => {
        if (tray.COMPLETEDT) {
          this.completedTrays.push(tray);
        } else {
          this.openTrays.push(tray);
        }
      });
    },
    getTray(id) {
      this.selectedTray = [];
      this.$axios.get("sample-trays/" + id).then(response => {
        this.selectedTray = response.data.data;
      });
    },
    createTray() {
      this.creatingTray = true;
      this.$axios.post("sample-trays").then(response => {
        this.getTrays();
        this.selectedTray = response.data.data;
        this.printTrayLabel();
      });
    },
    printTrayLabel() {
      this.printData.filename = "vocTray" + this.selectedTray.STRAYID + ".csv";
      this.printData.csvRows.push([
        "-",
        "",
        "",
        "Tray: " + this.selectedTray.STRAYID,
        "",
        "",
        "",
        "",
        "VOC Tray",
        "",
        "",
        this.$store.state.auth.user.USER_ID,
        "",
        "",
        "",
        "",
        "",
        "NM_PREPPED_SAMPLE_LABEL.BTW",
        "NM_REGISTRATION_LABEL_H",
        ""
      ]);
      console.log(this.printData);
      this.$axios.post("csv/generate-csv", this.printData).then(() => {
        console.log("good");
        this.printData.csvRows = [];
      });
    },
    addSample() {
      this.$axios
        .post("sample-trays/" + this.selectedTray.STRAYID, {
          sampnum: this.search
        })
        .then(response => {
          this.selectedTray.containers.push(response.data.data);
          this.printSampleLabel(response.data.data);
          this.search = "";
        });
    },
    printSampleLabel(sample) {
      this.printData.filename = "voc" + sample.SAMPNUM + ".csv";
      this.printData.csvRows.push([
        sample.sample.JOB,
        "",
        "",
        sample.SAMPNUM,
        "",
        "",
        "",
        "",
        "VOC",
        "",
        "",
        this.$store.state.auth.user.USER_ID,
        "",
        "",
        "",
        "",
        "",
        "NM_PREPPED_SAMPLE_LABEL.BTW",
        "NM_REGISTRATION_LABEL_H",
        ""
      ]);
      this.$axios.post("csv/generate-csv", this.printData).then(() => {
        console.log("good");
        this.printData.csvRows = [];
      });
    },
    completeTray() {
      this.$axios.patch("sample-trays/" + this.selectedTray.STRAYID, {
        complete: 1
      });
      this.addSampleDialog = false;
      this.selectedTray = [];
      this.getTrays();
      console.log(this.selectedTray);
    },
    deleteTray(id) {
      this.$axios.delete("sample-trays/" + id).then(response => {
        this.getTrays();
      });
    },
    removeItem(index) {
      console.log(index);
      console.log(this.selectedTray.containers[index]);
      this.$axios
        .delete(
          "sample-trays/container/" +
            this.selectedTray.containers[index].STRAYCNTID
        )
        .then(response => {
          this.selectedTray.containers.splice(index, 1);
        });
    },
    sendTrayList() {
      this.trayLists.push({
        tray: this.trayLists.length + 1,
        samples: this.currentTray
      });
      this.currentTray = [];
    }
  }
};
</script>

<style>
</style>