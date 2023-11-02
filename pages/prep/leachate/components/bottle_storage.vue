<template>
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
              <v-btn :disabled="trayLoading" color="primary" @click="addTray"
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
        <v-card-title>
          Tray Samples
          <v-spacer />
          <v-btn
            small
            icon
            @click="printTray"
            :disabled="tray.containers ? tray.containers.length == 0 : true"
            ><v-icon>mdi-printer</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-col md="4" sm="6">
              <v-text-field
                hide-details
                outlined
                dense
                @keyup.enter="updateContainerLocation"
                v-model="sampleSearch"
                autocomplete="off"
                label="Sample Search"
              />
            </v-col>
            <v-btn
              color="primary"
              @click="updateContainerLocation"
              :disabled="sampleLoading || !tray.STRAYID || !this.sampleSearch"
              :loading="sampleLoading"
              >Add</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>

      <v-row>
        <v-col>
          <v-data-table
            dense
            :items="tray.containers"
            :headers="containerHeaders"
          >
            <template v-slot:item.date="{ item }">
              {{
                $moment(item.ADDDATE).format('DD-MM-YYYY') + ' @ ' + item.ADDTM
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
    </v-col>
    <!-- <v-dialog v-model="subtypeChoiceDialog" max-width="800">
      <v-card>
        <v-card-title>Select Subtype</v-card-title>
        <v-card-text>
          <v-row class="pa-6">
            <v-col
              class="text-center"
              v-for="subtype in leachateTypes"
              :key="'typeButton' + subtype.subtype"
            >
              <v-btn
                large
                :disabled="subtype.req == false"
                color="primary"
                @click="addContainer(subtype.subtype)"
              >
                CEN {{ subtype.subtype }}:1
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog> -->
    <v-dialog v-model="wrongTypeDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>
          Wrong Tray Type
        </v-card-title>
        <v-card-text>
          Tray selected is not set for Leachate Storage
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="wrongTypeDialog = false"
            >OK</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import sampleScanForm from '../../../../components/sample/sample_scan';
export default {
  components: {
    sampleScanForm,
  },
  data() {
    return {
      sampleSearch: '',
      sample: {},
      traySearch: '',
      trayLoading: false,
      sampleLoading: false,
      tray: {},
      containerHeaders: [
        { text: 'Cnt #', value: 'STRAYCNTID' },
        { text: 'Sample', value: 'SAMPNUM' },
        { text: 'Subtype', value: 'SUBTYPE' },
        { text: 'Job', value: 'sample.JOB' },
        { text: 'Actions', value: 'actions' },
      ],
      // leachateTypes: {
      //   cen10: {
      //     req: false,
      //     subtype: 10,
      //   },
      //   cen2: {
      //     req: false,
      //     subtype: 2,
      //   },
      //   cen8: {
      //     req: false,
      //     subtype: 8,
      //   },
      // },
      // leachateCounts: 0,
      wrongTypeDialog: false,
      // subtypeChoiceDialog: false,
      // printContainerData: {
      //   path: '\\\\nm-web01\\labels$\\',
      //   filename: 'TestP2.csv',
      //   csvHeaders: [
      //     'TRAY',
      //     'LOGDATE',
      //     'SAMPNUM',
      //     'JOB',
      //     'DETAILS1',
      //     'LABEL_FORMAT',
      //     'LABEL_PRINTER',
      //   ],
      //   csvRows: [],
      // },
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
  computed: {
    leachateTray() {
      return this.tray.STRAYTYPID == 15;
    },
  },
  methods: {
    async getTray() {
      this.trayLoading = true;
      try {
        await this.$axios
          .get('prepped-sample-trays/trays/' + this.traySearch)
          .then((res) => {
            this.tray = res.data.data;
            this.traySearch = '';
            this.checkTrayType();
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.trayLoading = false;
      }
    },

    checkTrayType() {
      console.log(this.tray.STRAYTYPID);
      if (!this.leachateTray) {
        this.tray = {};
        this.wrongTypeDialog = true;
      }
    },

    async addTray() {
      this.traysLoading = true;
      try {
        await this.$axios
          .post('prepped-sample-trays/trays', {
            type: 15,
          })
          .then((response) => {
            this.tray = response.data.data;
            this.printTrayLabel(this.tray);
          });
      } catch (error) {
        console.log(error);
      }
      this.traySearch = '';
      this.traysLoading = false;
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

    // async getSample() {
    //   if (!this.tray.STRAYID || !this.sampleSearch) {
    //     return;
    //   }
    //   this.sampleLoading = true;
    //   try {
    //     this.$axios.get('samples/' + this.sampleSearch).then((res) => {
    //       this.sample = res.data.data;
    //       this.setLeachateType();
    //       if (this.leachateCounts == 1) {
    //         let subtype = null;
    //         Object.keys(this.leachateTypes).forEach((type) => {
    //           if (this.leachateTypes[type].req) {
    //             subtype = this.leachateTypes[type].subtype;
    //           }
    //         });
    //         this.addContainer(subtype);
    //       } else {
    //         this.subtypeChoiceDialog = true;
    //       }
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    async updateContainerLocation() {
      try {
        await this.$axios
          .patch('prepped-sample-trays/containers/' + this.sampleSearch, {
            stray_id: this.tray.STRAYID,
          })
          .then((res) => {
            //Check not already in tray
            let exists = this._.find(this.tray.containers, {
              STRAYCNTID: res.data.data.STRAYCNTID,
            });
            console.log(exists);
            if (!exists) {
              this.tray.containers.unshift(res.data.data);
            }
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.sampleSearch = '';
        this.sampleLoading = false;
      }
    },

    // addContainer(subtype) {
    //   this.$axios
    //     .post('container-sample-check', {
    //       sampnum: this.sampleSearch,
    //       stray_id: this.tray.STRAYID,
    //       subtype: subtype,
    //     })
    //     .then((res) => {
    //       this.tray.containers.unshift(res.data.data);
    //       this.printContainerLabel(res.data.data);
    //     });
    //   this.subtypeChoiceDialog = false;
    //   this.sampleSearch = '';
    //   this.sampleLoading = false;
    // },

    // printContainerLabel(container) {
    //   this.printContainerData.csvRows.push([
    //     container.STRAYCNTID,
    //     container.ADDDATE,
    //     container.SAMPNUM + ' - ' + container.SUBTYPE + ':1',
    //     container.sample ? container.sample.JOB : '',
    //     this.tray.type.DESCRIPTN,
    //     'NM_PREPPED_SAMPLE_CONTAINER.BTW',
    //     this.$store.state.printer.printer,
    //   ]);

    //   this.$axios.post('labels/print', this.printContainerData).then(() => {
    //     this.printContainerData.csvRows = [];
    //   });
    // },

    async deleteContainer(cnt) {
      let index = this._.findIndex(this.tray.containers, {
        STRAYCNTID: cnt.STRAYCNTID,
      });

      if (index > -1) {
        this.tray.containers.splice(index, 1);
      }

      await this.$axios
        .patch('prepped-sample-trays/containers/' + cnt.STRAYCNTID, {
          stray_id: 0,
        })
        .then((res) => {
          console.log(res);
        });
    },
    setLeachateType() {
      let array = [...this.sample.work, ...this.sample.results];
      this.leachateTypes.cen10.req = false;
      this.leachateTypes.cen2.req = false;
      this.leachateTypes.cen8.req = false;
      this.leachateCounts = 0;
      array.forEach((det) => {
        if (det.DET == 'CEN_8P') {
          this.leachateTypes.cen8.req = true;
          this.leachateCounts++;
        } else if (det.DET == 'CEN_2P') {
          this.leachateTypes.cen2.req = true;
          this.leachateCounts++;
        } else if (det.DET == 'CEN_1P') {
          this.leachateTypes.cen10.req = true;
          this.leachateCounts++;
        }
      });
    },
    resetForm() {
      this.sample = {};
      this.$refs.sampleScanForm.resetSample();
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
