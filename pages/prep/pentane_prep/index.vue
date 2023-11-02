<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar dense flat>
          <v-toolbar-title>Pentane Prep</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="4">
              <v-card flat>
                <v-card-title>Storage Tray</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        autocomplete="off"
                        dense
                        v-model="traySearch"
                        label="Load Tray"
                        @keyup.enter="getTray"
                        append-icon="mdi-magnify"
                        :loading="trayLoading"
                      />
                    </v-col>
                    <v-col class="text-center">
                      <v-btn
                        :disabled="trayLoading"
                        color="primary"
                        @click="addTray"
                        >New Tray</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        hide-details
                        dense
                        :value="tray.STRAYID"
                        label="ID"
                        readonly
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        :value="
                          tray.STRAYID
                            ? $moment(tray.CREATEDDT).format('DD/MM/YY') +
                              ' @ ' +
                              tray.CREATEDTM
                            : ''
                        "
                        label="Created"
                        readonly
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        :value="tray.STRAYID ? tray.created_by.USER_NAME : ''"
                        label="Created By"
                        readonly
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        :value="
                          tray.COMPLETEDT
                            ? $moment(tray.COMPLETEDT).format('DD/MM/YY') +
                              ' @ ' +
                              tray.COMPLETETM
                            : ''
                        "
                        label="Completed"
                        readonly
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat>
                <v-card-title
                  >Tray Samples<v-spacer />
                  <v-btn
                    small
                    icon
                    @click="printTray"
                    :disabled="
                      tray.containers ? tray.containers.length == 0 : true
                    "
                    ><v-icon>mdi-printer</v-icon></v-btn
                  ></v-card-title
                >
                <v-card-text>
                  <v-row align="center">
                    <v-col md="4" sm="6">
                      <v-text-field
                        hide-details
                        outlined
                        dense
                        @keyup.enter="getSample"
                        v-model="sampleSearch"
                        autocomplete="off"
                        label="Sample Search"
                      />
                    </v-col>
                    <v-btn
                      color="primary"
                      @click="getSample"
                      :disabled="
                        sampleLoading || !tray.STRAYID || !this.sampleSearch
                      "
                      :loading="sampleLoading"
                      >Add</v-btn
                    >
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-data-table
                        dense
                        :items="tray.containers"
                        :headers="containerHeaders"
                      >
                        <template v-slot:item.date="{ item }">
                          {{
                            $moment(item.ADDDATE).format('DD-MM-YYYY') +
                              ' @ ' +
                              item.ADDTM
                          }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                          <v-btn
                            color="primary"
                            icon
                            small
                            @click="printContainerLabel(item)"
                            class="ml-4"
                            disabled
                          >
                            <v-icon>mdi-printer</v-icon>
                          </v-btn>
                          <v-btn
                            color="primary"
                            icon
                            small
                            @click="deleteContainer(item)"
                            class="ml-4"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-card-text></v-card
              ></v-col
            >
            <v-dialog v-model="noPrepsDialog" persistant max-width="600">
              <v-card outlined>
                <v-card-text class="mt-6 text-center">
                  <v-row align="center" justify="center">
                    <v-col class="text-h4">Prep Not Required</v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" block @click="noPrepsDialog = false"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
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
      trayLoading: false,
      traySearch: '',
      tray: {},
      sampleSearch: '',
      sampleLoading: false,
      sample: {},
      requiredPreps: [],
      noPrepsDialog: false,
      containerHeaders: [
        { text: 'Cnt #', value: 'STRAYCNTID' },
        { text: 'Sample', value: 'SAMPNUM' },
        { text: 'Subtype', value: 'SUBTYPE' },
        { text: 'Job', value: 'sample.JOB' },
        { text: 'Actions', value: 'actions' },
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
      printTrayData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'TrayLabel.csv',
        csvHeaders: [
          'TRAY',
          'LOGDATE',
          'DETAILS1',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
        ],
        csvRows: [],
      },
    };
  },
  methods: {
    async getTray() {
      this.trayLoading = true;
      this.tray = {};
      try {
        await this.$axios
          .get('prepped-sample-trays/trays/' + this.traySearch)
          .then((res) => {
            this.tray = res.data.data;
            this.traySearch = '';
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.trayLoading = false;
      }
    },
    async addTray() {
      this.trayLoading = true;
      try {
        await this.$axios
          .post('prepped-sample-trays/trays', {
            type: 13,
          })
          .then((res) => {
            this.tray = res.data.data;
            this.trayLoading = false;
          });
      } catch (error) {
      } finally {
        this.trayLoading = false;
      }
    },
    async getSample() {
      this.sampleLoading = true;
      try {
        this.$axios.get('samples/' + this.sampleSearch).then((res) => {
          this.sample = res.data.data;
          this.checkPrep();
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.sampleLoading = false;
        this.noPrepsDialog = true;
        this.sampleSearch = '';
      }
    },
    checkPrep() {
      this.requiredPreps = [];
      let pentanePreps = [];
      this.sample.work
        .filter((d) => {
          return d.SECTION == 'PREP';
        })
        .map((d) => {
          return {
            det: d.DET,
            type: d.det.SUPERTYPE,
          };
        })
        .forEach((d) => {
          if (d.det.includes('PENT')) {
            pentanePreps.push(d);
          }
        });
      let requiredPreps = this._.groupBy(pentanePreps, (prep) => {
        return prep.type;
      });
      let numPrepTypes = Object.keys(requiredPreps).length;
      if (numPrepTypes == 0) {
        this.sample = {};
      }
      this.requiredPreps = requiredPreps;
    },
    printTrayLabel(tray) {
      console.log('trying to print');
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
    printContainerLabel(container) {
      this.printContainerData.csvRows.push([
        container.STRAYCNTID,
        container.ADDDATE,
        container.SAMPNUM + ' - ' + container.SUBTYPE + ':1',
        container.sample ? container.sample.JOB : '',
        this.tray.type.DESCRIPTN,
        'NM_PREPPED_SAMPLE_CONTAINER.BTW',
        this.$store.state.printer.printer,
      ]);

      this.$axios.post('labels/print', this.printContainerData).then(() => {
        this.printContainerData.csvRows = [];
      });
    },
    printTray() {
      window.open(
        'http://nm-web01:8080/jasperserver/flow.html?j_username=sampleReg&j_password=sampleReg&_flowId=viewReportFlow&ParentFolderUri=/Reports/Sample_Prep&reportUnit=/Reports/Sample_Prep/trayContents&output=pdf&standAlone=true&stray=' +
          this.tray.STRAYID,
        '_blank'
      );
    },
  },
};
</script>

<style></style>
