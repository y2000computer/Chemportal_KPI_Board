<template>
  <v-dialog persistant v-model="openTrayDialog" max-width="1600">
    <v-card style="min-height:80vh;">
      <v-card-title
        >Results Entry <v-spacer /><v-btn @click="closeDialog" icon
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-card-text
        ><v-row
          ><v-col lg="2" md="3" cols="10"
            >Open Trays<v-list>
              <v-list-item-group v-model="openTray" color="primary" mandatory>
                <v-list-item
                  :value="tray"
                  three-line
                  v-for="(tray, index) in openTrays"
                  :key="'openTrayTab' + index"
                  @click="focusSampleScan"
                  ><v-list-item-content
                    ><v-list-item-title
                      >Tray {{ tray.STRAYID }}</v-list-item-title
                    >
                    <v-list-item-subtitle>{{
                      tray.type.DESCRIPTN
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{ tray.containers.length + '/' + tray.type.MAXCNT }}
                    </v-list-item-subtitle></v-list-item-content
                  ><v-list-item-action
                    ><v-icon large>{{
                      openTray.STRAYID == tray.STRAYID
                        ? 'mdi-check-circle'
                        : 'mdi-checkbox-blank-circle-outline'
                    }}</v-icon></v-list-item-action
                  ></v-list-item
                ></v-list-item-group
              ></v-list
            ></v-col
          ><v-col>
            Tray {{ openTray.STRAYID }}

            <v-row v-if="openTray.STRAYID" class="mt-3">
              <v-col
                ><v-btn
                  small
                  :disabled="openTray.type.ALLOW_BLNK != 1"
                  @click="addContainer('Blank')"
                  color="primary"
                  >Add Blank</v-btn
                ><v-btn
                  small
                  :disabled="openTray.type.ALLOW_QC != 1"
                  @click="addContainer('QC')"
                  class="ml-2"
                  color="primary"
                  >Add QC</v-btn
                ><v-btn
                  small
                  :disabled="openTray.type.ALLOW_SAND != 1"
                  @click="addContainer('Sand')"
                  class="ml-2"
                  color="primary"
                  >Add Sand</v-btn
                >
                <v-btn
                  small
                  :disabled="openTray.type.STRAYTYPID != '12'"
                  @click="addContainer('Soil')"
                  class="ml-2"
                  color="primary"
                  >Add Soil</v-btn
                ></v-col
              ><v-col
                ><v-text-field
                  dense
                  autocomplete="off"
                  v-model="scannedSample"
                  hide-details
                  ref="sampleScan"
                  label="Sample"
                  outlined
                  append-icon="mdi-qrcode"
                  @keyup.enter="addContainer(scannedSample)"
                  :loading="addingSample"
                  :disabled="addingSample"
              /></v-col>
              <v-col>
                <v-btn
                  color="primary"
                  class="float-right"
                  @click="completeTrayDialog = true"
                  :disabled="
                    openTray.containers.filter((c) => c.sample != null)
                      .length == 0
                  "
                  >Complete Tray
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  dense
                  fixed-header
                  height="70vh"
                  disable-pagination
                  hide-default-footer
                  :items="openTray.containers"
                  :headers="trayHeaders"
                  ><template v-slot:item.required="{ item }">{{
                    item.results.map((r) => r.DET).join(',')
                  }}</template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      color="primary"
                      icon
                      small
                      @click="printContainerLabel(item)"
                      ><v-icon>print</v-icon></v-btn
                    ><v-btn
                      color="primary"
                      icon
                      small
                      :disabled="openTray.COMPLETEDT != null"
                      @click="deleteContainer(item)"
                      class="ml-4"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </template></v-data-table
                ></v-col
              >
            </v-row>
          </v-col></v-row
        ></v-card-text
      >
      <results-dialog
        v-if="sampleResultsDialog"
        :container="addedContainer"
        :sampleResultsDialog="sampleResultsDialog"
        :sampleResults="sampleResults"
        @closeDialog="
          sampleResultsDialog = false;
          addingSample = false;
        "
        @deleteContainer="deleteContainer"
        @containerAdded="pushContainer"
      />
      <v-dialog v-model="completeTrayDialog" max-width="400" persistent>
        <v-card>
          <v-card-title>Complete Tray {{ openTray.STRAYID }}</v-card-title
          ><v-card-text>
            <v-row
              ><v-col
                ><v-switch
                  inset
                  v-model="printTrayOnClose"
                  label="Print Tray"/></v-col
            ></v-row>
            <v-row
              ><v-col>
                Are you sure you want to complete this tray?</v-col
              ></v-row
            >
          </v-card-text>
          <v-card-actions>
            <v-btn @click="completeTrayDialog = false">Cancel</v-btn>
            <v-spacer />

            <v-btn @click="completeTray" color="primary">Complete</v-btn>
          </v-card-actions></v-card
        >
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import resultsDialog from './resultsDialog';
export default {
  components: {
    resultsDialog,
  },
  props: {
    openTrayDialog: {
      type: Boolean,
      default: false,
    },
    openTrays: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      openTray: {},
      trayHeaders: [
        {
          text: 'Container #',
          value: 'STRAYCNTID',
          width: 120,
          sortable: false,
        },
        { text: 'Sample', value: 'SAMPNUM', sortable: false },
        { text: 'Job', value: 'sample.JOB', sortable: false },
        {
          text: 'Client',
          value: 'sample.job.office.client.CLIENTNAME',
          sortable: false,
        },
        { text: 'Required', value: 'required', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      scannedSample: '',
      printContainerData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'TestP2.csv',
        csvHeaders: [
          'TRAY',
          'LOGDATE',
          'SAMPNUM',
          'JOB',
          'DETAILS1',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
        ],
        csvRows: [],
      },
      addingSample: false,
      addedContainer: {},
      dailyPrepCount: null,
      sampleResults: [],
      sampleResultsDialog: false,
      completeTrayDialog: false,
      printTrayOnClose: true,
      csvData: {
        path: '\\\\nm-ais01\\results\\',
        filename: '',
        csvRows: [],
      },
    };
  },
  mounted() {
    this.openTray = this.openTrays[0];
    this.focusSampleScan();
  },
  computed: {
    nonSampleRequired() {
      if (!this.openTray.type) {
        return false;
      }
      if (
        this.openTray.type.ALLOW_BLNK == 1 &&
        this.openTray.type.daily_container_count == 0
      ) {
        return 'Do a Blank';
      }
      return false;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },

    focusSampleScan() {
      setTimeout(() => {
        this.$refs.sampleScan.focus();
      }, 200);
    },

    async addContainer(sample) {
      this.addingSample = true;
      let barcode = sample.split(':');
      if (
        isNaN(barcode[0]) &&
        barcode[0] != 'QC' &&
        barcode[0] != 'Blank' &&
        barcode[0] != 'Sand' &&
        barcode[0] != 'Soil'
      ) {
        console.log('No thanks');
        this.addedContainer = false;
        return;
      }
      await this.$axios
        .post('container-sample-check', {
          sampnum: barcode[0],
          stray_id: this.openTray.STRAYID,
        })
        .then((res) => {
          if (res.data.data.tray.type.CNT_LABEL == 1) {
            this.printContainerLabel(res.data.data);
          }
          if (
            res.data.data.sample == null &&
            this.openTray.type.items.filter((t) => t.INPUT == '1').length == 0
          ) {
            this.pushContainer(res.data.data);
            this.addingSample = false;
          } else {
            this.setResults(res.data.data);
          }
          this.scannedSample = '';
        });
    },

    printContainerLabel(container) {
      this.printContainerData.csvRows.push([
        container.STRAYCNTID,
        container.ADDDATE,
        container.SAMPNUM,
        container.sample ? container.sample.JOB : '',
        container.tray.type.DESCRIPTN,
        'NM_PREPPED_SAMPLE_CONTAINER.BTW',
        this.$store.state.printer.printer,
      ]);

      this.$axios.post('labels/print', this.printContainerData).then(() => {
        this.printContainerData.csvRows = [];
      });
    },

    pushContainer(container) {
      this.openTray.containers.unshift(container);
      this.addingContainer = false;
      this.openTray.type.daily_container_count++;
      this.focusSampleScan();
    },

    async deleteContainer(e) {
      let index = this._.findIndex(this.openTray.containers, {
        STRAYCNTID: e.STRAYCNTID,
      });

      if (index > -1) {
        this.openTray.containers.splice(
          this._.findIndex(this.openTray.containers, {
            STRAYCNTID: e.STRAYCNTID,
          }),
          1
        );
      }
      await this.$axios
        .delete('prepped-sample-trays/containers/' + e.STRAYCNTID)
        .then((response) => {
          this.openTray.type.daily_container_count--;
        });
    },

    setResults(container) {
      this.sampleResults = [];
      this.addedContainer = container;
      container.tray.type.items.forEach((item) => {
        if (container.sample && !item.RESCODE) {
          let required = _.intersectionBy(
            item.dets,
            container.sample.work,
            'DET'
          );
          this.sampleResults.push({
            stray_cnt_id: container.STRAYCNTID,
            label: item.DESCRIPTN,
            det: required[0] ? required[0].DET : 'Not Required',
            required: required[0] ? true : false,
            value: item.DEFAULT,
            readonly: item.INPUT == 0 ? true : false,
            aisDet: true,
          });
        } else if (item.RESCODE) {
          this.sampleResults.push({
            stray_cnt_id: container.STRAYCNTID,
            label: item.DESCRIPTN,
            det: item.RESCODE,
            required: true,
            value: item.DEFAULT,
            readonly: item.INPUT == 0 ? true : false,
            aisDet: false,
          });
        }
      });

      this.sampleResultsDialog = true;
      this.sample = '';
    },

    async completeTray() {
      let filename =
        this.openTray.type.DESCRIPTN +
        ' - ' +
        this.$moment().format('YYMMDDHHmmss');
      this.csvData.filename = filename + '.pla';

      this.openTray.containers.forEach((container) => {
        if (!container.sample) {
          return;
        }

        container.results.forEach((result) => {
          if (result.DET.toLowerCase() == result.DET || result.SENT) {
            return;
          }

          console.log(result);

          this.csvData.csvRows.push([
            container.sample.SAMPNUM,
            '',
            result.DET,
            result.RESULT,
            '',
            '',
            '',
            this.$auth.user.USER_ID,
            this.$moment(container.ADDDATE).format('YYYY-MM-DD'),
            container.ADDTM,
            'Chemportal',
            filename,
          ]);

          // this.$store.dispatch('results/addResult', {
          //   method: this.openTray.type.DESCRIPTN,
          //   filePrefix: 'Phase2',
          //   results: [
          //     {
          //       sampnum: container.sample.SAMPNUM,
          //       user: this.$auth.user.USER_ID,
          //       date: this.$moment(container.ADDDATE).format('YYYY-MM-DD'),
          //       time: container.ADDTM,
          //       det: result.DET,
          //       name: this.openTray.type.DESCRIPTN,
          //       value: result.RESULT,
          //     },
          //   ],
          // });
        });
      });

      this.$axios.post('csv/generate-csv', this.csvData).then((response) => {
        this.csvData.filename = '';
        this.csvData.csvRows = [];
      });

      this.$axios
        .patch('prepped-sample-trays/trays/' + this.openTray.STRAYID, {
          complete: true,
        })
        .then((response) => {
          this.completeTrayDialog = false;
          this.$emit('trayCompleted', this.openTray.STRAYID);
          if (this.printTrayOnClose) {
            this.printTray();
          }
        });
    },

    printTray() {
      {
        window.open(
          'http://nm-web01:8080/jasperserver/flow.html?j_username=sampleReg&j_password=sampleReg&_flowId=viewReportFlow&ParentFolderUri=/Reports/Sample_Prep&reportUnit=/Reports/Sample_Prep/trayContents&output=pdf&standAlone=true&stray=' +
            this.openTray.STRAYID,
          '_blank'
        );
      }
    },
  },
};
</script>

<style></style>
