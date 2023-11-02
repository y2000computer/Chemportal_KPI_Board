<template>
  <v-row>
    <v-col>


      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Sample Prep Results Entry</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-row justify="space-between" class="mt-2">
            <v-col lg="2" md="2" cols="10">
              <v-card flat>
                <v-card-title>Prep Types</v-card-title>
                <v-card-text>
                  <types-list :types="types" @typeSelected="getTrays" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="6" cols="10"
              ><v-card flat
                ><v-card-title>{{
                  selectedType.DESCRIPTN ? selectedType.DESCRIPTN : ''
                }}</v-card-title
                ><v-card-text
                  ><trays-list
                    v-if="selectedType.STRAYTYPID"
                    :loading="traysLoading"
                    :trays="traysList"
                    :labelPrint="selectedType.TRAY_LABEL == 1"
                    @traySelected="traySelected"
                    @addTray="addTray"
                    @deleteTray="deleteTray"
                    @printTray="printTrayLabel"
                  />
                  <v-alert
                    dense
                    color="tableWarnings"
                    class="font-weight-medium text-center"
                    v-else
                    >Please Select Type</v-alert
                  >
                </v-card-text>
              </v-card>
            </v-col>

            <v-col md="2" cols="10">
              <v-card flat>
                <v-card-title>Selected Trays</v-card-title>
                <v-card-text>
                  <v-row
                    ><v-col>
                      <v-fab-transition>
                        <v-btn
                          block
                          class="float-right"
                          :disabled="openTrays.length == 0"
                          color="primary"
                          @click="openTrayDialog = true"
                          >{{ openTrays.length
                          }}<v-icon class="ml-2">mdi-barcode</v-icon></v-btn
                        ></v-fab-transition
                      ></v-col
                    ></v-row
                  >
                  <open-tray-list
                    :openTrays="openTrays"
                    :loading="trayLoading"
                    @removeOpenTray="removeOpenTray"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <open-tray-dialog
      v-if="openTrayDialog"
      :openTrays="openTrays"
      :openTrayDialog="openTrayDialog"
      @closeDialog="openTrayDialogClosed"
      @trayCompleted="trayCompleted"
    />
  </v-row>
</template>

<script>
import typesList from './components/typesList';
import traysList from './components/traysList';
import openTrayList from './components/openTrayList';
import openTrayDialog from './components/openTrayDialog';

export default {
  components: {
    typesList,
    traysList,
    openTrayList,
    openTrayDialog,
  },
  data() {
    return {
      typesLoading: false,
      types: [],
      selectedType: {},
      traysLoading: false,
      trays: [],
      trayLoading: false,
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
      openTrays: [],
      openTrayDialog: false,
    };
  },
  mounted() {
    this.getPrepTypes();
  },
  computed: {
    traysList() {
      return this.trays.map((obj) => ({
        ...obj,
        open: this.openTrays.map((t) => t.STRAYID).includes(obj.STRAYID),
      }));
    },
    openTraysDrawer() {
      if (this.openTrays.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async getPrepTypes() {
      try {
        await this.$axios
          .get('prepped-sample-trays/tray-types')
          .then((response) => {
            this.types = response.data.data;
            this.typesLoading = false;
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getTrays(val) {
      if (!val) {
        this.selectedType = {};
        return;
      }
      try {
        this.traysLoading = true;
        this.selectedType = val;
        await this.$axios
          .get('prepped-sample-trays/trays?type=' + val.STRAYTYPID)
          .then((response) => {
            this.trays = response.data.data;
            this.traysLoading = false;
          });
      } catch (error) {
        console.log(error);
        this.traysLoading = false;
      }
    },

    async addTray() {
      this.traysLoading = true;
      try {
        await this.$axios
          .post('prepped-sample-trays/trays', {
            type: this.selectedType.STRAYTYPID,
          })
          .then((response) => {
            this.trays.unshift(response.data.data);
            if (this.selectedType.TRAY_LABEL) {
              this.printTrayLabel(response.data.data);
            }
          });
      } catch (error) {
        console.log(error);
      }
      this.traysLoading = false;
    },

    async deleteTray(id) {
      this.trays.splice(
        this._.findIndex(this.trays, {
          STRAYID: id,
        }),
        1
      );
      await this.$axios
        .delete('prepped-sample-trays/trays/' + id)
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

    async traySelected(e) {
      if (this.trayLoading) {
        return;
      }
      if (!this.openTrays.map((t) => t.STRAYID).includes(e.STRAYID)) {
        try {
          this.trayLoading = true;
          await this.$axios
            .get('prepped-sample-trays/trays/' + e.STRAYID)
            .then((res) => {
              this.openTrays.push(res.data.data);
              this.openTray = res.data.data;
              this.trayLoading = false;
            });
        } catch (error) {
          console.log(error);
          this.trayLoading = false;
        }
      }
    },

    removeOpenTray(index) {
      this.openTrays.splice(index, 1);
    },

    openTrayDialogClosed() {
      this.openTrayDialog = false;
      this.getTrays(this.selectedType);
    },

    trayCompleted(id) {
      this.openTrays.splice(
        this._.findIndex(this.openTrays, {
          STRAYID: id,
        }),
        1
      );
      if (this.openTrays.length == 0) {
        this.selectedType = {};
        this.openTrayDialog = false;
      }
      console.log('complete' + id);
    },
  },
};
</script>

<style></style>
