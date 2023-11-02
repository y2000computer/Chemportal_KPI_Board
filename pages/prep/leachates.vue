<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row justify="space-between" no-gutters>
            <v-col md="6">Leachate Preparation</v-col>
            <v-col md="3">
              <v-select
                hide-details
                outlined
                dense
                :items="printers"
                item-value="PRNTERNAME"
                item-text="PRNTERNAME"
                label="Select Printer"
                @change="updatePrinter"
                v-model="selectedPrinter"
              ></v-select>
            </v-col>
            <!-- <v-col md="3">
              <v-select
                outlined
                hide-details
                dense
                label="User"
                v-model="user"
                :items="users"
                item-text="USER_NAME"
                item-value="USER_ID"
                @change="setFocus('search')"
              ></v-select>
            </v-col>-->
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row dense justify="space-between">
            <v-col md="3" cols="12">
              <v-text-field
                outlined
                :disabled="sampleLoading"
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
                                <v-col class="font-weight-medium">{{ sample.SAMPNUM }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Job:</v-col>
                                <v-col class="font-weight-medium">{{ sample.JOB }}</v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Client:</v-col>
                                <v-col class="font-weight-medium">
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
          </v-row>
          <v-row>
            <v-col>
              <v-card outlined>
                <v-card-title>Leachate Values</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        readonly
                        dense
                        hide-details
                        label="Weigh"
                        suffix="g"
                        outlined
                        :value="soilMass"
                        class="font-weight-medium"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense align="center">
                    <v-col class="text-center">into</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        readonly
                        hide-details
                        dense
                        label="Volume"
                        suffix="ml"
                        class="font-weight-medium"
                        outlined
                        :value="waterVol"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card disabled outlined>
                <v-card-title>Test</v-card-title>
                <v-card-text>Test</v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined disabled>
                <v-card-title>Tray Location</v-card-title>
                <v-card-text>{{ this.leachateType }}</v-card-text>
              </v-card>
            </v-col>
            <v-col md="3" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Actions</v-card-title>
                <v-card-text>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn x-large color="primary" @click="resetForm">
                        Send
                        <v-icon class="ml-2">mdi-database-import</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row class="text-center">
                    <v-col>
                      <v-btn @click="resetForm">
                        Reset
                        <v-icon class="ml-2">mdi-cancel</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn @click="printLabel">
                        Print Label
                        <v-icon class="ml-2">mdi-printer</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
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
      search: "",
      sampleLoading: false,
      printers: [],
      selectedPrinter: "",
      users: [],
      user: "",
      sample: [],
      soilMass: "",
      waterVol: "",
      leachateType: "",
      printData: {
        path: "\\\\nm-web01\\RegistrationLabels$\\",
        filename: "leachate_label.csv",
        csvHeaders: [
          "STRAYCNTID",
          "STRAYCNTTYPE",
          "JOB",
          "SAMPNUM",
          "CLIENT",
          "OFFICEDATE",
          "DETAILS1",
          "DETAILS2",
          "DETAILS3",
          "DETAILS4",
          "LABEL_PRINTER",
          "LABEL_FORMAT",
        ],
        csvRows: [],
      },
    };
  },
  mounted() {
    this.selectedPrinter = localStorage.getItem("chemportalLabelPrinter");
    this.getPrinters();
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.$axios.get("users/section/PREP").then((response) => {
        this.users = response.data.data;
      });
    },
    getPrinters() {
      this.$axios.get("printers?location=Sample Prep").then((response) => {
        this.printers = response.data.data;
      });
    },
    updatePrinter() {
      this.$store.dispatch("printer/setPrinter", this.selectedPrinter);
    },
    getSample() {
      this.sample = [];
      this.sampleLoading = true;
      this.$axios.get("samples/" + this.search).then((response) => {
        this.sample = response.data.data;
        this.sampleLoading = false;
        this.search = "";
        this.soilMass = parseFloat(this.getResult("UMA_SP").OUTPUT) * 1000;
        this.waterVol = this.getResult("VC_1P")
          ? Math.round(
              (parseFloat(this.getResult("VC_1P").OUTPUT) * 1000) / 10
            ) * 10
          : Math.round(
              (parseFloat(this.getResult("VC_2P").OUTPUT) * 1000) / 10
            ) * 10;
        this.leachateType = this.getLeachateType();
        this.printLabel();
      });
    },
    getResult(det) {
      var result = this._.find(this.sample.results, {
        DET: det,
      });
      if (result) {
        return result;
      }
      var work = this._.find(this.sample.work, {
        DET: det,
      });
      if (work) {
        return work;
      }
      return null;
    },
    getLeachateType() {
      if (this.getResult("CEN_8P")) {
        return "2/8";
      }
      if (this.getResult("CEN_2P")) {
        return "2 Only";
      }
      if (this.getResult("CEN_1P")) {
        return "10";
      }
      return "";
    },
    printLabel() {
      this.printData.csvRows.push([
        "",
        "",
        this.sample.JOB,
        this.sample.SAMPNUM,
        "",
        "",
        this.leachateType,
        this.soilMass + "g in " + this.waterVol + "ml",
        "",
        "",
        this.selectedPrinter,
        "NM_LEACHATE_LABEL.btw",
      ]);
      this.$axios.post("labels/print", this.printData).then((response) => {
        this.printData.csvRows = [];
        console.log(response);
      });
    },
    setFocus(ref) {
      this.$refs[ref].focus();
    },
    resetForm() {
      this.search = "";
      this.sample = [];
      this.soilMass = "";
      this.waterVol = "";
      this.setFocus("search");
    },
  },
};
</script>

<style></style>
