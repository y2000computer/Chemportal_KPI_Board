<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title
          >Soil Splitting<v-spacer /><v-btn
            color="primary"
            @click="trayPrintDialog = !trayPrintDialog"
            >Tray Labels<v-icon class="ml-2">mdi-printer</v-icon></v-btn
          ></v-card-title
        >
        <v-card-text>
          <v-row>
            <v-col md="3" sm="10" cols="12">
              <sampleScanForm
                ref="sampleScan"
                @sampleFound="sampleFound"
                @sampleReset="resetForm"
                :moreDets="true"
                :disabled="searchDisabled"
                :errorMessage="
                  $store.state.printer.printer ? '' : 'Please Select A Printer'
                "
              />
            </v-col>
            <v-col>
              <v-card flat>
                <v-card-title>Required Preps</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="group in groups"
                      :key="group.SSGRPID"
                      md="3"
                      sm="6"
                      cols="10"
                    >
                      <v-list>
                        <v-list-item style="min-height:24px">
                          <v-list-item-content
                            class="font-weight-bold text--caption"
                          >
                            <v-list-item-title
                              >Tray {{ group.SSGRPID }}</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                        <template v-for="item in group.items">
                          <v-list-item
                            style="min-height:24px"
                            :disabled="!item.required"
                            :key="'prep' + item.SSITID"
                          >
                            <v-list-item-content>
                              <v-list-item-title class="font-weight-medium"
                                >{{ item.DESCRIPTN }}
                                <span class="text-body-2">{{
                                  item.MASS ? "(" + item.MASS + "g)" : ""
                                }}</span></v-list-item-title
                              >
                            </v-list-item-content>
                            <v-list-item-avatar size="20" class="ma-0">
                              <v-avatar
                                :color="item.required ? 'primary' : ''"
                              ></v-avatar>
                            </v-list-item-avatar>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-col>
                    <v-col>
                      <v-list>
                        <v-list-item>
                          <v-list-item-title class="font-weight-medium text-h5">
                            Mass Required: {{ massReq + " g" }}
                          </v-list-item-title></v-list-item
                        >
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="trayPrintDialog" width="700">
      <v-card outlined>
        <v-card-title>Print Tray Label</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="group in groups"
              :key="'group' + group.SSGRPID"
              @click="printTrayLabel(group)"
            >
              <v-list-item-avatar>
                <v-avatar class="font-weight-bold">
                  {{ group.SSGRPID }}
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ group.DESCRIPTN }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>print</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import sampleScanForm from "../../../components/sample/sample_scan";
export default {
  components: {
    sampleScanForm,
  },
  data() {
    return {
      groups: [],
      searchDisabled: false,
      sample: {},
      massReq: 0,
      potPrintData: {
        path: "\\\\nm-web01\\labels$\\",
        filename: "DrySamples.csv",
        csvHeaders: [
          "JOB",
          "SAMPNUM",
          "DETAILS1",
          "DETAILS2",
          "DETAILS3",
          "LABEL_FORMAT",
          "LABEL_PRINTER",
        ],
        csvRows: [],
      },
      trayPrintDialog: false,
      trayPrintData: {
        path: "\\\\nm-web01\\labels$\\",
        filename: "Tray.csv",
        csvHeaders: ["DETAILS1", "DETAILS2", "LABEL_FORMAT", "LABEL_PRINTER"],
        csvRows: [],
      },
    };
  },
  mounted() {
    this.getSoilSplittingGroups();
  },
  methods: {
    getSoilSplittingGroups() {
      this.$axios.get("soil-splitting?type=S").then((response) => {
        this.groups = response.data.data;
        this.groups.push({
          SSGRPID: this.groups.length + 1,
          DESCRIPTN: "Grinding Only",
          items: [
            {
              DESCRIPTN: "Grinding Only",
              required: false,
              soil_splitting_dets: [],
            },
          ],
        });
        this.setItemRequiredFlags();
      });
    },
    setItemRequiredFlags() {
      this.groups.forEach((group) => {
        group.items.forEach((item) => {
          this.$set(item, "required", false);
        });
      });
    },
    sampleFound(sample) {
      this.sample = sample;
      this.checkSampleDets();
      this.setSoilSplittingTimestamp();
      setTimeout(() => {
        this.resetForm();
      }, 30000);
    },
    checkSampleDets() {
      var itemCount = 0;
      this.massReq = 0;
      this.groups.forEach((group) => {
        group.items.forEach((item) => {
          item.soil_splitting_dets.forEach((det) => {
            if (this.sample.moreDets.includes(det.DET)) {
              item.required = true;
              this.potPrintData.csvRows.push([
                this.sample.JOB,
                this.sample.SAMPNUM,
                item.DESCRIPTN,
                group.SSGRPID,

                this.sample.SAMPNUM +
                  (item.GRPLABEL == "1" ? ":" + item.SSITID : ""),
                "NM_DRY_SAMPLE_POT.btw",
                this.$store.state.printer.printer,
              ]);
              itemCount++;
              //console.log(item.mass)
              this.massReq += parseInt(item.MASS);
              return;
            }
          });
        });
      });
      this.potPrintData.csvRows.push([
        this.sample.JOB,
        this.sample.SAMPNUM,
        "SPARE",
        this.groups.length.toString(),
        this.sample.SAMPNUM + ":",
        "NM_DRY_SAMPLE_POT.btw",
        this.$store.state.printer.printer,
      ]);
      if (itemCount == 0) {
        this.groups[this.groups.length - 1].items[0].required = true;
      }
      this.printPotLabels();
    },
    printPotLabels() {
      this.$axios.post("labels/print", this.potPrintData).then((response) => {
        this.potPrintData.csvRows = [];
      });
    },
    printTrayLabel(tray) {
      this.trayPrintData.csvRows.push([
        tray.SSGRPID,
        tray.DESCRIPTN,
        "NM_DRY_SAMPLE_POT_TRAY.btw",
        this.$store.state.printer.printer,
      ]);
      this.$axios.post("labels/print", this.trayPrintData).then((response) => {
        this.trayPrintData.csvRows = [];
      });
    },
    setSoilSplittingTimestamp() {
      this.$axios.post("soil-splitting", {
        sampnum: this.sample.SAMPNUM,
      });
    },
    resetForm() {
      this.search = "";
      this.sample = {};
      this.massReq = 0;
      this.setItemRequiredFlags();
      this.potPrintData.csvRows = [];
      this.$refs.sampleScan.resetSample();
    },
  },
};
</script>

<style></style>
