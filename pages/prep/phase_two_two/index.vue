<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>Phase Two Prep</v-card-title>
        <v-card-text>
          <v-row>
            <v-col lg="3" md="4" cols="10">
              <v-subheader>Prep Types</v-subheader>
              <v-list dense :loading="prepTypesLoading">
                <v-list-item-group
                  v-model="selectedPrepType"
                  @change="getTrays"
                  mandatory
                  color="primary"
                >
                  <v-list-item
                    v-for="prepType in prepTypes"
                    :key="'listItem' + prepType.STRAYTYPID"
                    :value="prepType"
                    :disabled="traysLoading"
                  >
                    <v-list-item-content
                      ><v-list-item-title>{{
                        prepType.DESCRIPTN
                      }}</v-list-item-title></v-list-item-content
                    >
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col
              ><v-row
                ><v-col
                  ><v-subheader>{{
                    selectedPrepType.DESCRIPTN || ''
                  }}</v-subheader></v-col
                ><v-col
                  ><v-text-field
                    outlined
                    dense
                    label="Search"
                    v-model="search"/></v-col
                ><v-col class="text-right"
                  ><v-btn
                    color="primary"
                    @click="addTray"
                    :loading="traysLoading"
                    :disabled="traysLoading || !selectedPrepType.STRAYTYPID"
                    >Add</v-btn
                  ></v-col
                ></v-row
              ><v-data-table
                :loading="traysLoading"
                :items="trays"
                :headers="traysHeaders"
                dense
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
                    icon
                    color="primary"
                    :disabled="
                      openTrays.map((t) => t.STRAYID).includes(item.STRAYID)
                    "
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                  <v-btn color="primary" icon @click.stop="printTrayLabel(item)"
                    ><v-icon>mdi-printer</v-icon></v-btn
                  >
                  <v-btn
                    color="primary"
                    class="ml-2"
                    icon
                    :disabled="item.containers_count > 0"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </template></v-data-table
              ></v-col
            >
            <v-col lg="3" md="4" cols="10"
              ><v-subheader>Open Trays</v-subheader
              ><v-list dense
                ><v-list-item
                  v-for="(tray, index) in openTrays"
                  :key="'openTray' + tray.STRAYID"
                  three-line
                  ><v-list-item-content
                    ><v-list-item-title
                      >Tray {{ tray.STRAYID }}</v-list-item-title
                    ><v-list-item-subtitle>{{
                      tray.type.DESCRIPTN
                    }}</v-list-item-subtitle
                    ><v-list-item-subtitle>{{
                      tray.containers.length + '/' + tray.type.MAXCNT
                    }}</v-list-item-subtitle></v-list-item-content
                  ><v-list-item-action @click="openTrays.splice(index, 1)"
                    ><v-btn icon
                      ><v-icon>mdi-close</v-icon></v-btn
                    ></v-list-item-action
                  ></v-list-item
                ></v-list
              ></v-col
            >
          </v-row>
          <v-fab-transition>
            <v-btn
              v-if="openTrays.length"
              large
              absolute
              fab
              color="primary"
              right
              @click="trayDialog = !trayDialog"
              ><v-icon>mdi-barcode</v-icon>{{ openTrays.length }}</v-btn
            ></v-fab-transition
          >
          <v-dialog
            v-if="openTrays.length"
            v-model="trayDialog"
            persistent
            max-width="1600"
            transition="dialog-bottom-transition"
            ><v-card style="min-height:80vh;"
              ><v-card-title
                >Test<v-spacer /><v-btn icon small @click="trayDialog = false"
                  ><v-icon>mdi-close</v-icon></v-btn
                ></v-card-title
              ><v-card-text
                ><v-row
                  ><v-col lg="3" md="4" cols="10"
                    ><v-list>
                      <v-list-item-group
                        v-model="openTray"
                        color="primary"
                        mandatory
                      >
                        <v-list-item
                          :value="tray"
                          three-line
                          v-for="(tray, index) in openTrays"
                          :key="'openTrayTab' + index"
                          ><v-list-item-content
                            ><v-list-item-title
                              >Tray {{ tray.STRAYID }}</v-list-item-title
                            >
                            <v-list-item-subtitle>{{
                              tray.type.DESCRIPTN
                            }}</v-list-item-subtitle>
                            <v-list-item-subtitle>
                              {{
                                tray.containers.length + '/' + tray.type.MAXCNT
                              }}
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
                  ><v-col
                    ><v-row
                      ><v-col
                        ><v-btn
                          :disabled="openTray.type.ALLOW_BLNK != 1"
                          @click="addContainer('Blank')"
                          color="primary"
                          >Add Blank</v-btn
                        ><v-btn
                          :disabled="openTray.type.ALLOW_QC != 1"
                          @click="addContainer('QC')"
                          class="ml-2"
                          color="primary"
                          >Add QC</v-btn
                        ><v-btn
                          :disabled="openTray.type.ALLOW_SAND != 1"
                          @click="addContainer('Sand')"
                          class="ml-2"
                          color="primary"
                          >Add Sand</v-btn
                        ></v-col
                      ><v-col
                        ><v-text-field
                          dense
                          autocomplete="false"
                          v-model="sample"
                          hide-details
                          ref="sampleScan"
                          label="Sample"
                          outlined
                          append-icon="mdi-qrcode"
                          @keyup.enter="addContainer(sample)"
                          :loading="addingSample"
                          :disabled="addingSample"/></v-col></v-row
                    ><v-row
                      ><v-col
                        ><v-data-table
                          dense
                          fixed-header
                          height="70vh"
                          disable-pagination
                          hide-default-footer
                          :loading="trayLoading"
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
                      ></v-row
                    >
                  </v-col></v-row
                ></v-card-text
              ></v-card
            ></v-dialog
          >
          <v-dialog
            v-if="returnedContainer.sample"
            max-width="800"
            v-model="resultsDialog"
            ><v-card
              ><v-card-title>Container Information</v-card-title
              ><v-card-text>
                <v-row
                  ><v-col
                    ><v-simple-table
                      ><thead>
                        <tr>
                          <th>Container</th>
                          <th>Sample</th>
                          <th>Job</th>
                          <th>Client</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ returnedContainer.STRAYCNTID }}</td>
                          <td>{{ returnedContainer.sample.SAMPNUM }}</td>
                          <td>{{ returnedContainer.sample.JOB }}</td>
                          <td>
                            {{
                              returnedContainer.sample.job.office.client
                                .CLIENTNAME
                            }}
                          </td>
                        </tr>
                      </tbody></v-simple-table
                    ></v-col
                  ></v-row
                >
                <v-divider class="mb-4" />
                Results
                <v-row
                  ><v-col>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Det Required</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in sampleResults"
                          :key="'resultItemRow' + index"
                        >
                          <td>{{ item.label }}</td>
                          <td>
                            <v-chip
                              dark
                              :color="item.required ? 'green' : 'red'"
                              >{{ item.det }}</v-chip
                            >
                          </td>
                          <td>
                            <v-text-field
                              filled
                              autocomplete="off"
                              v-model="sampleResults[index].value"
                              :readonly="item.readonly"
                              outlined
                              dense
                              hide-details
                            />
                          </td>
                        </tr>
                      </tbody> </v-simple-table></v-col
                ></v-row>
                {{ sampleResults }}{{ requiredResults }}</v-card-text
              ><v-card-actions
                ><v-btn
                  color="primary"
                  @click="addResults"
                  :disabled="requiredResults == 0"
                  >Add Results</v-btn
                ></v-card-actions
              ></v-card
            ></v-dialog
          ></v-card-text
        ></v-card
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      prepTypesLoading: false,
      prepTypes: [],
      selectedPrepType: {},
      traysLoading: false,
      trays: [],
      search: '',
      traysHeaders: [
        { text: 'Tray #', value: 'STRAYID', width: 120 },
        { text: 'Created', value: 'CREATEDDT' },
        { text: 'By', value: 'created_by.USER_NAME' },
        { text: 'Containers', value: 'containers', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      trayLoading: false,
      openTrays: [],
      trayDialog: false,
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
      openTray: {},
      addingSample: false,
      resultsDialog: false,
      sample: '',
      returnedContainer: {},
      sampleResults: [],
    };
  },
  mounted() {
    this.getTypes();
  },
  computed: {
    requiredResults() {
      let count = 0;
      this.sampleResults.forEach((result) => {
        if (result.det !== 'Not Required') {
          count++;
        }
      });
      return count;
    },
  },
  methods: {
    async getTypes() {
      try {
        await this.$axios
          .get('prepped-sample-trays/tray-types')
          .then((response) => {
            this.prepTypes = response.data.data;
            this.prepTypesLoading = false;
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getTrays() {
      try {
        this.traysLoading = true;
        await this.$axios
          .get(
            'prepped-sample-trays/trays?type=' +
              this.selectedPrepType.STRAYTYPID
          )
          .then((response) => {
            this.trays = response.data.data;
          });
      } catch (error) {
        console.log(error);
      }
      this.traysLoading = false;
    },

    async getTray(id) {
      try {
        this.$axios.get('prepped-sample-trays/trays/' + id).then((response) => {
          this.tray = response.data.data;
          this.traysLoading = false;
        });
      } catch (error) {}
    },

    async addTray() {
      this.traysLoading = true;
      try {
        await this.$axios
          .post('prepped-sample-trays/trays', {
            type: this.selectedPrepType.STRAYTYPID,
          })
          .then((response) => {
            this.trays.unshift(response.data.data);
          });
      } catch (error) {
        console.log(error);
      }

      this.traysLoading = false;
    },

    async getTray(id) {
      this.trayLoading = true;
      try {
      } catch (error) {
        console.log(error);
      }
      this.trayLoading = false;
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

    async addContainer(sample) {
      this.addingSample = true;
      let barcode = sample.split(':');
      await this.$axios
        .post('container-sample-check', {
          sampnum: barcode[0],
          stray_id: this.openTray.STRAYID,
        })
        .then((res) => {
          this.returnedContainer = res.data.data;
          if (res.data.data.sample === null) {
            this.openTray.containers.push(res.data.data);
          } else {
            this.setResults();
            this.resultsDialog = true;
          }
          this.addingSample = false;
          this.sample = '';
        });
    },

    deleteContainer(e) {
      this.openTray.containers.splice(
        this._.findIndex(this.openTray.containers, {
          STRAYCNTID: e.STRAYCNTID,
        }),
        1
      );
      this.$axios
        .delete('prepped-sample-trays/containers/' + e.STRAYCNTID)
        .then((response) => {
          console.log(response);
        });
    },
    checkRequirement(item) {
      if (!this.returnedContainer.sample) {
        return null;
      }
      let required = _.intersectionBy(
        item.dets,
        this.returnedContainer.sample.work,
        'DET'
      );
      console.log(required);
      return required;
    },

    setResults() {
      this.sampleResults = [];
      this.returnedContainer.tray.type.items.forEach((item) => {
        let required = _.intersectionBy(
          item.dets,
          this.returnedContainer.sample.work,
          'DET'
        );
        this.sampleResults.push({
          stray_cnt_id: this.returnedContainer.STRAYCNTID,
          label: item.DESCRIPTN,
          det: required[0] ? required[0].DET : 'Not Required',
          required: required[0] ? true : false,
          value: item.DEFAULT,
          readonly: item.INPUT == 0 ? true : false,
        });
      });
    },
    addResults() {
      console.log(this.sampleResults);
      this.$axios
        .post('prepped-sample-trays/results', {
          results: this.sampleResults,
        })
        .then((res) => {
          console.log(res);
          this.openTray.containers.push(res.data.data);
        });
      this.sampleResults = [];
      this.resultsDialog = false;
    },
  },
};
</script>

<style></style>
