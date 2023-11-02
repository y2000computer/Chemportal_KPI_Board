<template>
  <v-row
    ><v-col>
      <v-card outlined>
        <v-card-title>
          Phase Two Prep
        </v-card-title>
        <v-card-text>
          <v-row dense
            ><v-col
              ><v-text-field
                outlined
                dense
                v-model="trayLoad"
                @keyup.enter="traySelected(trayLoad)"
                label="Tray Search"/></v-col
            ><v-col
              ><v-btn
                @click="traySelected(trayLoad)"
                color="primary"
                :disabled="!trayLoad"
                >Load<v-icon class="ml-2">search</v-icon></v-btn
              ></v-col
            ></v-row
          >
          <v-row>
            <v-col lg="3" md="4" cols="10">
              <v-subheader>Prep Types</v-subheader
              ><v-list dense :loading="prepsLoading" shaped
                ><v-list-item-group
                  v-model="selectedPrep"
                  @change="getTrays"
                  mandatory
                  color="primary"
                >
                  <v-list-item
                    v-for="prepType in prepTypes"
                    :key="prepType.STRAYTYPID"
                    :value="prepType"
                    :disabled="traysLoading"
                    ><v-list-item-content
                      ><v-list-item-title>{{
                        prepType.DESCRIPTN
                      }}</v-list-item-title></v-list-item-content
                    ></v-list-item
                  >
                </v-list-item-group></v-list
              ></v-col
            >
            <v-col lg="9" md="8" cols="10" v-if="selectedPrep.STRAYTYPID"
              ><v-subheader>{{ selectedPrep.DESCRIPTN }}</v-subheader
              ><v-row
                ><v-col
                  ><v-btn
                    color="primary"
                    @click="addTray"
                    :loading="traysLoading"
                    :disabled="traysLoading || !selectedPrep.STRAYTYPID"
                    >New<v-icon class="ml-2">add</v-icon></v-btn
                  >
                  <!-- <v-btn
                    class="ml-2"
                    @click="getTrays"
                    :loading="traysLoading"
                    :disabled="traysLoading || !selectedPrep.STRAYTYPID"
                    >Refresh<v-icon class="ml-2">refresh</v-icon></v-btn
                  > -->
                </v-col></v-row
              ><v-row dense
                ><v-col
                  ><v-data-table
                    :loading="traysLoading"
                    :items="trays"
                    :headers="traysHeaders"
                    @click:row="traySelected"
                  >
                    <template v-slot:item.CREATEDDT="{ item }">
                      {{ $moment(item.CREATEDDT).format('DD/MM/YY') }} -
                      {{
                        item.CREATEDTM.substring(0, 2) +
                          ':' +
                          item.CREATEDTM.slice(-2)
                      }}
                    </template>
                    <template v-slot:item.containers="{ item }">
                      {{ item.containers_count }} / {{ item.type.MAXCNT }}
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        color="primary"
                        icon
                        @click.stop="printTrayLabel(item)"
                        ><v-icon>mdi-printer</v-icon></v-btn
                      >
                      <v-btn
                        color="primary"
                        class="ml-2"
                        icon
                        :disabled="item.containers_count > 0"
                        @click.stop="deleteTray(item)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template></v-data-table
                  ></v-col
                ></v-row
              ></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>
      <v-dialog v-model="trayDialog" max-width="1600" persistent>
        <v-card outlined style="min-height:80vh;">
          <v-card-title
            >Tray {{ tray.STRAYID }} ({{
              tray.type ? tray.type.DESCRIPTN : ''
            }}) {{ tray.type ? tray.type.daily_container_count : '' }}
            <v-spacer /><v-btn icon @click="printTray" v-if="tray.COMPLETEDT"
              ><v-icon>mdi-printer</v-icon></v-btn
            ><v-btn class="ml-2" icon @click="trayClosed"
              ><v-icon>mdi-close</v-icon></v-btn
            ></v-card-title
          >
          <v-card-text
            ><v-row v-if="tray.STRAYID && !tray.COMPLETEDT" align="center"
              ><v-col
                ><v-btn
                  v-if="selectedPrep.ALLOW_BLNK == 1"
                  @click="addContainer('Blank')"
                  color="primary"
                  >Add Blank</v-btn
                ><v-btn
                  v-if="selectedPrep.ALLOW_QC == 1"
                  @click="addContainer('QC')"
                  class="ml-2"
                  color="primary"
                  >Add QC</v-btn
                ><v-btn
                  v-if="selectedPrep.ALLOW_SAND == 1"
                  @click="addContainer('Sand')"
                  class="ml-2"
                  color="primary"
                  >Add Sand</v-btn
                ></v-col
              >{{ addingSample
              }}<v-col
                ><v-text-field
                  autocomplete="false"
                  v-if="!qcDue"
                  hide-details
                  v-model="sample"
                  ref="sampleScan"
                  label="Sample"
                  outlined
                  append-icon="mdi-qrcode"
                  @keyup.enter="addContainer(sample)"
                  :loading="addingSample"
                  :disabled="addingSample || qcDue"
                /><v-alert v-else type="warning">QC Required</v-alert></v-col
              >
              <v-col>
                <v-btn
                  class="float-right"
                  large
                  v-if="tray.containers"
                  @click="completeDialog = !completeDialog"
                  :disabled="tray.containers.length == 0"
                  color="primary"
                  >Complete Tray</v-btn
                ></v-col
              ></v-row
            >
            <v-row v-if="tray.STRAYID && tray.COMPLETEDT" align="center">
              <v-col
                ><v-text-field
                  dense
                  outlined
                  hide-details
                  :value="$moment(tray.COMPLETEDT).format('DD-MM-YY')"
                  label="Completed Date"
                />
              </v-col>
              <v-col
                ><v-text-field
                  dense
                  outlined
                  hide-details
                  :value="tray.COMPLETETM"
                  label="Completed Time"
              /></v-col>
              <v-col
                ><v-text-field
                  dense
                  outlined
                  hide-details
                  :value="tray.COMPLETEBY"
                  label="Completed By"
              /></v-col> </v-row
            ><v-row
              ><v-col
                ><v-data-table
                  dense
                  disable-pagination
                  hide-default-footer
                  :loading="trayLoading"
                  :items="tray.containers"
                  :headers="trayHeaders"
                >
                  <template v-slot:item.required="{ item }">
                    <v-chip
                      small
                      :color="checkResultRequired(item) ? 'green' : 'red'"
                      ><v-icon small>{{
                        checkResultRequired(item)
                          ? 'mdi-beaker-check-outline'
                          : 'mdi-beaker-remove-outline'
                      }}</v-icon></v-chip
                    >
                  </template>
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
                      :disabled="tray.COMPLETEDT != null"
                      @click="deleteContainer(item)"
                      class="ml-4"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </template></v-data-table
                ></v-col
              ></v-row
            ></v-card-text
          >
        </v-card>
      </v-dialog>
      <v-dialog v-model="completeDialog" max-width="400" persistent>
        <v-card outlined>
          <v-card-title>Complete Tray {{ tray.STRAYID }}</v-card-title>
          <v-card-text>
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
            <v-btn @click="completeDialog = !completeDialog">Cancel</v-btn>
            <v-spacer />

            <v-btn @click="completeTray" color="primary">Complete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      trayLoad: '',
      prepsLoading: false,
      prepTypes: [],
      selectedPrep: {},
      traysLoading: false,
      trays: [],
      traysHeaders: [
        { text: 'Tray #', value: 'STRAYID', width: 120 },
        { text: 'Created', value: 'CREATEDDT' },
        { text: 'By', value: 'created_by.USER_NAME' },
        { text: 'Containers', value: 'containers', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      printTrayData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'TestP2.csv',
        csvHeaders: [
          'TRAY',
          'LOGDATE',
          'DETAILS1',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
        ],
        csvRows: [],
      },
      trayDialog: false,
      trayLoading: false,
      printTrayOnClose: true,
      tray: {},
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
      sample: '',
      addingSample: false,
      completeDialog: false,
    };
  },
  mounted() {
    this.getTypes();
  },
  computed: {
    qcDue() {
      if (this.tray.type.QC_FREQ == 0) {
        return null;
      }
      if (!this.tray.STRAYID) {
        return '';
      }
      if (this.tray.type.daily_container_count == 0) {
        return 'QC Due';
      }
      if (
        this.tray.type.daily_container_count > 1 &&
        (this.tray.type.daily_container_count - 1) % this.tray.type.QC_FREQ == 0
      ) {
        return 'QC Due';
      }
    },
  },
  methods: {
    getTypes() {
      this.prepsLoading = true;
      this.$axios.get('prepped-sample-trays/tray-types').then((response) => {
        this.prepTypes = response.data.data;
        this.prepsLoading = false;
      });
    },
    getTrays() {
      if (!this.selectedPrep.STRAYTYPID) {
        return;
      }
      this.traysLoading = true;
      this.$axios
        .get('prepped-sample-trays/trays?type=' + this.selectedPrep.STRAYTYPID)
        .then((response) => {
          this.trays = response.data.data;
          this.traysLoading = false;
        });
    },
    addTray() {
      this.traysLoading = true;
      this.$axios
        .post('prepped-sample-trays/trays', {
          type: this.selectedPrep.STRAYTYPID,
        })
        .then((response) => {
          if (this.selectedPrep.TRAY_LABEL == 1) {
            this.printTrayLabel(response.data.data);
          }
          this.trays.unshift(response.data.data);
          this.selectedPrep.daily_container_count =
            response.data.data.type.daily_container_count;
          this.traysLoading = false;
        });
    },

    deleteTray(e) {
      this.trays.splice(
        this._.findIndex(this.trays, {
          STRAYID: e.STRAYID,
        }),
        1
      );
      this.$axios
        .delete('prepped-sample-trays/trays/' + e.STRAYID)
        .then((response) => {});
    },

    printTrayLabel(tray) {
      this.printTrayData.csvRows.push([
        tray.STRAYID,
        tray.CREATEDDT,
        tray.type.DESCRIPTN,
        'NM_PREPPED_SAMPLE_TRAY.BTW',
        this.$store.state.printer.printer,
      ]);

      this.$axios.post('labels/print', this.printTrayData).then(() => {
        this.printTrayData.csvRows = [];
      });
    },

    updateTrayDailyCount(val) {
      this.tray.type.daily_container_count = val;
      this.selectedPrep.daily_container_count = val;
    },
    traySelected(e) {
      this.trayDialog = true;
      this.trayLoad = '';
      this.getTray(e.STRAYID ? e.STRAYID : e);
    },

    trayClosed() {
      this.getTrays();
      this.trayDialog = false;
      this.$nextTick(() => {
        this.tray = {};
      });
    },

    getTray(id) {
      this.trayLoading = true;
      this.$axios
        .get('prepped-sample-trays/trays/' + id)
        .then((response) => {
          this.tray = response.data.data;
          this.trayLoading = false;
          if (!this.tray.COMPLETEDT) {
            this.$nextTick(() => {
              this.$refs['sampleScan'].focus();
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.traysLoading = false;
        });
    },

    completeTray() {
      this.trayLoading = true;
      this.tray.containers.forEach((container) => {
        if (!container.sample) {
          return;
        }
        container.results.forEach((result) => {
          if (result.SENT) {
            return;
          }
          this.$store.dispatch('results/addResult', {
            method: this.selectedPrep.DESCRIPTN,
            filePrefix: 'Phase2',
            results: [
              {
                sampnum: container.sample.SAMPNUM,
                user: this.$auth.user.USER_ID,
                date: this.$moment(container.ADDDATE).format('YYYY-MM-DD'),
                time: container.ADDTM,
                det: result.DET,
                name: this.selectedPrep.DESCRIPTN,
                value: result.RESULT,
              },
            ],
          });
        });
      });
      this.$axios
        .patch('prepped-sample-trays/trays/' + this.tray.STRAYID, {
          complete: true,
        })
        .then((response) => {
          this.completeDialog = false;
          this.trayLoading = false;
          this.trayClosed();
          if (this.printTrayOnClose) {
            this.printTray();
          }
        });
    },

    printTray() {
      {
        window.open(
          'http://nm-web01:8080/jasperserver/flow.html?j_username=sampleReg&j_password=sampleReg&_flowId=viewReportFlow&ParentFolderUri=/Reports/Sample_Prep&reportUnit=/Reports/Sample_Prep/trayContents&output=pdf&standAlone=true&stray=' +
            this.tray.STRAYID,
          '_blank'
        );
      }
    },

    addContainer(sample) {
      var string = sample.split(':');
      //Error if no SSITID provided in scan but not specified on prep type
      if (
        (this.selectedPrep.SSITID == 0) &
        !string[1] &
        (sample != 'QC') &
        (sample != 'Blank') &
        (sample != 'Sand')
      ) {
        console.log('Oi There');
        return;
      }
      this.addingSample = true;
      this.$axios
        .post('prepped-sample-trays/containers', {
          sampnum: string[0],
          soil_splitting_item_id: string[1]
            ? string[1]
            : this.selectedPrep.SSITID,
          stray_id: this.tray.STRAYID,
        })
        .then((response) => {
          this.tray.containers.unshift(response.data.data);
          this.updateTrayDailyCount(
            response.data.data.tray.type.daily_container_count
          );
          if (this.selectedPrep.CNT_LABEL == 1) {
            this.printContainerLabel(response.data.data);
          }
          this.sample = '';
          this.addingSample = false;
          this.$nextTick(() => {
            this.$refs['sampleScan'].focus();
          });
        });
    },

    checkResultRequired(item) {
      if (!item.sample) {
        return true;
      }

      var results = item.results.map((result) => result.DET);
      var work = item.sample.work.map((det) => det.DET);

      var required = _.intersection(results, work);

      if (required.length > 0) {
        return true;
      }
      return false;
    },

    deleteContainer(e) {
      this.tray.containers.splice(
        this._.findIndex(this.tray.containers, {
          STRAYCNTID: e.STRAYCNTID,
        }),
        1
      );
      this.$axios
        .delete('prepped-sample-trays/containers/' + e.STRAYCNTID)
        .then((response) => {
          this.updateTrayDailyCount(this.tray.type.daily_container_count - 1);
        });
    },
    printContainerLabel(container) {
      this.printContainerData.csvRows.push([
        container.STRAYCNTID,
        container.ADDDATE,
        container.SAMPNUM,
        container.sample ? container.sample.JOB : '',
        this.selectedPrep.DESCRIPTN,
        'NM_PREPPED_SAMPLE_CONTAINER.BTW',
        this.$store.state.printer.printer,
      ]);

      this.$axios.post('labels/print', this.printContainerData).then(() => {
        this.printContainerData.csvRows = [];
      });
    },
  },
};
</script>

<style></style>
