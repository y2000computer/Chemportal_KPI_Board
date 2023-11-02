<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Openlab Sequence Generator</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3">
              <v-card flat>
                <v-card-title>Sequence Options</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>
                        <v-select
                          label="Method"
                          outlined
                          dense
                          :items="routes"
                          item-text="label"
                          item-value="name"
                          v-model="selectedMethod"
                          hide-details
                          @change="routeSelected"
                        ></v-select>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-text-field
                          placeholder="Name"
                          dense
                          outlined
                          v-model="sequenceName"
                          hide-details
                          label="Sequence Name"
                        ></v-text-field>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Dual Channel</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action class="my-0">
                        <v-switch
                          inset
                          color="primary"
                          v-model="dualChannel"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Method Template</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action class="my-0">
                        <v-btn-toggle>
                          <v-btn
                            v-for="(template, key, index) in routes[0]
                              .templates"
                            :key="'template' + index"
                            @click="templateSelected(key)"
                            small
                            >{{ key }}</v-btn
                          >
                        </v-btn-toggle>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-group>
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title>Tray Lists</v-list-item-title>
                        </v-list-item-content>
                      </template>

                      <v-list-item v-for="tray in trays" :key="tray">
                        <v-list-item-content>
                          <v-list-item-title>{{ tray }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-radio-group v-model="selectedTray">
                            <v-radio color="primary" :value="tray"></v-radio>
                          </v-radio-group>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-group>
                    <v-list-group>
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title>Manual Add</v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <v-card flat>
                        <v-card-text>
                          <v-row dense align="center">
                            <v-col>Add</v-col>
                            <v-col>
                              <v-btn-toggle>
                                <v-btn
                                  small
                                  @click="manualAddNumber = manualAddNumber - 1"
                                  :disabled="manualAddNumber == 0"
                                >
                                  <v-icon>remove</v-icon>
                                </v-btn>
                                <v-btn small>{{ manualAddNumber }}</v-btn>
                                <v-btn
                                  small
                                  @click="manualAddNumber = manualAddNumber + 1"
                                >
                                  <v-icon>add</v-icon>
                                </v-btn>
                              </v-btn-toggle>
                            </v-col>
                            <v-col>{{
                              manualAddNumber == 1 ? 'sample' : 'samples'
                            }}</v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                v-model="manualAddName"
                                label="with Name"
                                class="no-top-margin"
                                hide-details
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>to Channel/s</v-col>
                          </v-row>
                          <v-row dense>
                            <v-col>
                              <v-radio-group
                                row
                                hide-details
                                class="no-top-margin"
                                v-model="manualAddChannel"
                              >
                                <v-radio
                                  label="1"
                                  value="1"
                                  color="primary"
                                ></v-radio>
                                <v-radio
                                  label="2"
                                  value="2"
                                  color="primary"
                                ></v-radio>
                                <v-radio
                                  label="Both"
                                  value="3"
                                  color="primary"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>At Position</v-col>
                          </v-row>
                          <v-row dense>
                            <v-col>
                              <v-radio-group
                                row
                                class="no-top-margin"
                                v-model="manualAddPosition"
                              >
                                <v-radio
                                  label="Start"
                                  value="start"
                                  color="primary"
                                ></v-radio>
                                <v-radio
                                  label="End"
                                  value="end"
                                  color="primary"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                label="Position"
                                class="no-top-margin"
                                v-model="manualAddPosition"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-btn
                                class="float-right"
                                :disabled="manualAddNumber == 0"
                                color="primary"
                                @click="addSample2"
                                >Add</v-btn
                              >
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-list-group>
                  </v-list>
                  <v-divider />
                  <v-row>
                    <v-col>
                      <v-btn
                        class="float-right mr-4"
                        color="primary"
                        :disabled="
                          columnSamples1.length == 0 ||
                            sequenceName.length == 0 ||
                            (dualChannel &&
                              columnSamples1.length != columnSamples2.length)
                        "
                        @click="merge"
                        >Export</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat>
                <v-card-title>
                  Channel 1
                  <v-spacer />
                  <v-btn
                    text
                    @click="addTray(selectedTray, 'columnSamples1')"
                    :disabled="!selectedTray"
                  >
                    <v-icon>playlist_add</v-icon>
                  </v-btn>

                  <v-btn text @click="clearChannel('columnSamples1')">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-list dense>
                    <draggable v-model="columnSamples1">
                      <div
                        v-for="(sample, index) in columnSamples1"
                        :key="'1-' + sample.SAMPNUM + index"
                      >
                        <v-list-item class="draggable">
                          <v-list-item-avatar>{{
                            index + 1
                          }}</v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              :class="listClass(sample.FILENAME)"
                              >{{ sample.SAMPNUM }}
                              {{ sample.JOB }}</v-list-item-title
                            >
                            <v-list-item-subtitle>{{
                              sample.CLIENT
                            }}</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-btn icon @click="removeSample(1, index)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="sample.SAMPNUM + 'div'" />
                      </div>
                    </draggable>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat :disabled="!dualChannel">
                <v-card-title>
                  Channel 2
                  <v-spacer />
                  <v-btn
                    text
                    @click="addTray(selectedTray, 'columnSamples2')"
                    :disabled="!selectedTray"
                  >
                    <v-icon>playlist_add</v-icon>
                  </v-btn>
                  <v-btn text @click="clearChannel('columnSamples2')">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-list dense>
                    <draggable v-model="columnSamples2">
                      <template>
                        <div
                          v-for="(sample, index) in columnSamples2"
                          :key="'1-' + sample.SAMPNUM + index"
                        >
                          <v-list-item class="draggable">
                            <v-list-item-avatar>{{
                              index + 1
                            }}</v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title
                                >{{ sample.SAMPNUM }}
                                {{ sample.JOB }}</v-list-item-title
                              >
                              <v-list-item-subtitle>{{
                                sample.CLIENT
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-btn icon @click="removeSample(2, index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
                          <v-divider :key="sample.SAMPNUM + 'div'" />
                        </div>
                      </template>
                    </draggable>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-dialog v-model="exportDialog" width="400" height="1600">
        <v-card>
          <v-card-title>
            Export Openlab CSV
            <v-spacer />
            <v-btn @click="exportCSV" color="primary">Export</v-btn>
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item
                v-for="(sample, index) in csvData.csvRows"
                :key="'samp' + index"
              >
                <v-list-item-avatar>{{ sample.INDEX }}</v-list-item-avatar>
                <v-list-item-title>{{ sample.SAMPNUM }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  components: {
    draggable,
  },
  data() {
    return {
      selectedMethod: '',
      routes: [
        {
          name: 'cwg',
          label: 'CWG',
          templates: {
            small: [
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'PAH20',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'D2000',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Win Std',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
            ],
            large: [
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Win Std',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 40',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 100',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 200',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 400',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 1000',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 2000',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AA Cal 4000',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AQC',
                TYPE: '',
                JOB: 'Cal. Std',
                CLIENT: '',
              },
              {
                SAMPNUM: 'D2000',
                TYPE: '',
                JOB: 'Cal. Std',
                CLIENT: '',
              },
              {
                SAMPNUM: 'PAH20',
                TYPE: '',
                JOB: 'Cal. Std',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Soil Spike',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
            ],
          },
        },
        {
          name: 'pah',
          label: 'PAH',
          templates: {
            small: [
              {
                SAMPNUM: 'DCM Wash',
                TYPE: 'Wash',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'DCM Wash',
                TYPE: 'Wash',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: '2.0ppm Standard',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'QC1',
                TYPE: 'QC',
                JOB: '',
                CLIENT: '',
              },
            ],
            large: [
              {
                SAMPNUM: 'DCM Wash',
                TYPE: 'Wash',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'DCM Wash',
                TYPE: 'Wash',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Cal 0.4ppm',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Cal 0.8ppm',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Cal 2.0ppm',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Cal 8.0ppm',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Cal 20.0ppm',
                TYPE: 'Cal. Std',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'AQC',
                TYPE: 'AQC',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'Blank',
                TYPE: 'Blank',
                JOB: '',
                CLIENT: '',
              },
              {
                SAMPNUM: 'QC1',
                TYPE: 'QC',
                JOB: '',
                CLIENT: '',
              },
            ],
          },
        },
        {
          name: 'tph',
          label: 'TPH',
          templates: {
            small: [],
            large: [],
          },
        },
      ],
      sequenceName: '',
      route: '',
      routeLoading: false,
      dualChannel: false,
      trays: [],
      selectedTray: '',
      manualAddNumber: 0,
      manualAddName: '',
      manualAddChannel: null,
      manualAddPosition: '',
      columnSamples1: [],
      columnSamples2: [],
      exportDialog: false,
      csvData: {
        csvHeaders: ['Vial', 'Sample name', 'Sample Type'],
        path: '\\\\nm-fileserver\\shared areas\\organics\\openlab setups\\',
        filename: '',
        csvRows: [],
      },
    };
  },

  mounted() {
    //this.routeSelected("cwg");
    //this.templateSelected("small");
  },

  methods: {
    routeSelected() {
      this.routeLoading = true;
      this.columnSamples1 = [];
      this.columnSamples2 = [];
      this.$axios
        .get(
          'http://chemtest-api.chemtest.local/api/traylists/' +
            this.selectedMethod
        )
        .then((response) => {
          this.trays = response.data;
          this.routeLoading = false;
          this.templateSelected('small');
        });
    },

    templateSelected(key) {
      var routeIndex = '';
      this.columnSamples1 = [];
      this.columnSamples2 = [];
      this.routes.forEach((route, index) => {
        if (route.name == this.selectedMethod) {
          routeIndex = index;
        }
      });
      this.routes[routeIndex].templates[key].forEach((sample) => {
        this.columnSamples1.push(sample);
        this.columnSamples2.push(sample);
      });
    },

    toggleTray(tray, column, e) {
      //Trim extension
      tray = tray.slice(0, -4);
      if (e === true) {
        this.$axios
          .get(
            'http://chemtest-api.chemtest.local/api/traylists/' +
              this.selectedMethod +
              '/' +
              tray
          )
          .then((response) => {
            response.data.forEach((sample, index) => {
              this[column].push({
                INDEX: index + 1,
                SAMPNUM: sample.SAMPNUM,
                JOB: sample.JOB,
                CLIENT: sample.CLIENT,
                FILENAME: tray,
                TYPE: 'Sample',
              });
              i++;
            });
          });
      } else {
        for (var i = 0; i < this[column].length; i++) {
          if (this[column][i].FILENAME == tray) {
            this[column].splice(i, 1);
            i--;
          }
        }
      }
    },

    addTray(tray, column) {
      this.columnLoading = true;
      tray = tray.slice(0, -4);
      this.$axios
        .get(
          'http://chemtest-api.chemtest.local/api/traylists/' +
            this.selectedMethod +
            '/' +
            tray
        )
        .then((response) => {
          response.data.forEach((sample, index) => {
            this[column].push({
              INDEX: index + 1,
              SAMPNUM: sample.SAMPNUM,
              JOB: sample.JOB,
              CLIENT: sample.CLIENT,
              FILENAME: tray,
              TYPE: 'Sample',
            });
          });
          this.columnLoading = false;
          this.selectedTray = '';
        });
    },

    clearChannel(channel) {
      for (var i = 0; i < this[channel].length; i++) {
        if (this[channel][i].TYPE == 'Sample') {
          this[channel].splice(i, 1);
          i--;
        }
      }
    },

    addSample2() {
      if (this.manualAddChannel == 1) {
        this.addSample3('columnSamples1');
      }
      if (this.manualAddChannel == 2) {
        this.addSample3('columnSamples2');
      }
      if (this.manualAddChannel == 3) {
        this.addSample3('columnSamples1');
        this.addSample3('columnSamples2');
      }
    },

    addSample3(list) {
      var i;
      if (this.manualAddPosition == 'start') {
        for (i = 0; i < this.manualAddNumber; i++) {
          this[list].unshift({
            SAMPNUM: this.manualAddName,
            JOB: '',
            CLIENT: '',
            FILENAME: 'MANUAL',
            TYPE: 'Sample',
          });
        }
      } else if (this.manualAddPosition == 'end') {
        for (i = 0; i < this.manualAddNumber; i++) {
          this[list].push({
            SAMPNUM: this.manualAddName,
            JOB: '',
            CLIENT: '',
            FILENAME: 'MANUAL',
            TYPE: 'Sample',
          });
        }
      } else {
        for (i = 0; i < this.manualAddNumber; i++) {
          this[list].splice(this.manualAddPosition - 1, 0, {
            SAMPNUM: this.manualAddName,
            JOB: '',
            CLIENT: '',
            FILENAME: 'MANUAL',
            TYPE: 'Sample',
          });
        }
      }
    },

    removeSample(list, index) {
      if (list == 1) {
        this.columnSamples1.splice(index, 1);
      } else {
        this.columnSamples2.splice(index, 1);
      }
    },

    listClass(filename) {
      let tray = this.selectedTray.slice(0, -4);
      if (filename == tray) {
        return 'red--text font-weight-bold';
      }
    },

    merge() {
      if (this.dualChannel != true) {
        this.csvData.csvRows = [];
        let i = 0;
        this.columnSamples1.forEach((sample) => {
          this.csvData.csvRows.push({
            INDEX: i + 1,
            SAMPNUM: sample.SAMPNUM + ' ' + sample.JOB,
            TYPE: 'Sample',
          });
          i++;
        });
      } else {
        this.csvData.csvRows = [];
        let i = 0;
        let j = Math.min(
          this.columnSamples1.length,
          this.columnSamples2.length
        );
        let k = this.columnSamples1.length + this.columnSamples2.length;
        for (i = 0; i < j; i++) {
          this.csvData.csvRows.push({
            INDEX: i + 1,
            SAMPNUM:
              this.columnSamples1[i].SAMPNUM + ' ' + this.columnSamples1[i].JOB,
            TYPE: 'Sample',
          });
          this.csvData.csvRows.push({
            INDEX: j + i + 1,
            SAMPNUM:
              this.columnSamples2[i].SAMPNUM + ' ' + this.columnSamples2[i].JOB,
            TYPE: 'Sample',
          });
        }
        this.csvData.csvRows.push(
          ...this.columnSamples1.slice(j),
          ...this.columnSamples2.slice(j)
        );
      }
      this.exportDialog = true;
    },

    async exportCSV() {
      this.csvData.filename = this.sequenceName + '.csv';
      await this.$axios.post(
        'http://chemtest-api.chemtest.local/api/csv',
        this.csvData
      );

      if (this.dualChannel) {
        this.csvData.csvRows = [];
        this.csvData.filename = this.sequenceName + '-1.csv';
        this.columnSamples1.forEach((sample, index) => {
          this.csvData.csvRows.push({
            INDEX: index + 1,
            SAMPNUM: sample.SAMPNUM + ' ' + sample.JOB,
            TYPE: 'Sample',
          });
        });
        await this.$axios
          .post('http://chemtest-api.chemtest.local/api/csv', this.csvData)
          .then((response) => {
            return true;
          });
        this.csvData.csvRows = [];
        this.csvData.filename = this.sequenceName + '-2.csv';
        this.columnSamples2.forEach((sample, index) => {
          this.csvData.csvRows.push({
            INDEX: index + 1,
            SAMPNUM: sample.SAMPNUM + ' ' + sample.JOB,
            TYPE: 'Sample',
          });
        });
        await this.$axios
          .post('http://chemtest-api.chemtest.local/api/csv', this.csvData)
          .then((response) => {
            return true;
          });
      }
      this.columnSamples1 = [];
      this.columnSamples2 = [];
      this.exportDialog = false;
      this.sequenceName = '';
    },

    async printSingleChannelCSV(channel) {
      this.csvData.csvRows = [];
      this.csvData.filename = this.sequenceName + '-' + channel + '.csv';
      this['columnSamples' + channel].forEach((sample, index) => {
        this.csvData.csvRows.push({});
      });
      try {
        this.$axios
          .post('http://chemtest-api.chemtest.local/api/csv', this.csvData)
          .then((response) => {
            return true;
          });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.draggable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

.flip-list-move {
  transition: transform 0.3s;
}

.no-top-margin {
  margin-top: 0px;
  margin-bottom: 0px;
  padding-top: 0px;
}
</style>
