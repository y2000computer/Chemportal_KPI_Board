<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium">
            Prepped Sample Tray Search
          </v-toolbar-title>
        </v-toolbar>
      </v-card>
      <v-card-text>
        <v-row>
          <v-col>
            <v-tabs grow>
              <v-tab>Sample Search</v-tab>
              <v-tab>Tray Search</v-tab>

              <v-tab-item>
                <v-row class="mt-4">
                  <v-col>
                    <v-text-field
                      v-model="sampleSearch"
                      autocomplete="off"
                      label="Sample Search"
                      dense
                      outlined
                      @keyup.enter="getSample"
                      :disabled="sampleLoading"
                    ></v-text-field> </v-col
                  ><v-col>
                    <v-btn
                      color="primary"
                      @click="getSample"
                      :loading="sampleLoading"
                      :disabled="sampleLoading"
                      >Search</v-btn
                    ></v-col
                  >
                </v-row>
                <v-row>
                  <v-col>
                    <v-data-table
                      :items="sampleContainers"
                      :headers="sampleContainerHeaders"
                      dense
                    >
                      <template v-slot:item.STRAYID="{ item }">
                        {{ item.STRAYID ? item.STRAYID : 'Not Assigned' }}
                      </template>
                      <template v-slot:item.trayType="{ item }">
                        {{
                          item.tray
                            ? item.tray.type.DESCRIPTN +
                              (item.SUBTYPE ? ' ' + item.SUBTYPE + ':1' : '')
                            : 'Leachate Tray: ' + item.SUBTYPE + ':1'
                        }}
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row class="mt-4">
                  <v-col>
                    <v-text-field
                      v-model="traySearch"
                      autocomplete="off"
                      label="Tray Search"
                      dense
                      outlined
                      @keyup.enter="getTray"
                      :disabled="trayLoading"
                    ></v-text-field> </v-col
                  ><v-col>
                    <v-btn
                      color="primary"
                      @click="getTray"
                      :disabled="trayLoading"
                      :loading="trayLoading"
                      >Search</v-btn
                    ></v-col
                  >
                </v-row>
                <v-row justify="space-between">
                  <v-col cols="12" sm="10" md="4">
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          readonly
                          hide-details
                          :value="tray.STRAYID"
                          label="Tray ID"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          readonly
                          hide-details
                          :value="tray.type ? tray.type.DESCRIPTN : ''"
                          label="Tray Type"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          readonly
                          hide-details
                          :value="
                            tray.CREATEDDT
                              ? $moment(tray.CREATEDDT).format('DD/MM/YY') +
                                ' @ ' +
                                tray.CREATEDTM
                              : ''
                          "
                          label="Created"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          readonly
                          hide-details
                          :value="
                            tray.COMPLETEDT
                              ? $moment(tray.COMPLETEDT).format('DD/MM/YY') +
                                ' @ ' +
                                tray.COMPLETETM
                              : ''
                          "
                          label="Completed"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          readonly
                          hide-details
                          :value="tray.containers ? tray.containers.length : ''"
                          label="Containers"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col sm="10" cols="12" md="7">
                    <v-row
                      ><v-col
                        ><v-text-field
                          outlined
                          dense
                          v-model="containerSearch"
                          label="Container Search"
                      /></v-col>
                      <v-col>
                        <v-btn
                          icon
                          class="float-right"
                          color="primary"
                          @click="printTray"
                          :disabled="!tray.STRAYID"
                          ><v-icon>mdi-printer</v-icon></v-btn
                        ></v-col
                      ></v-row
                    ><v-data-table
                      :loading="trayLoading"
                      :search="containerSearch"
                      dense
                      :items="tray.containers"
                      :headers="trayContainerHeaders"
                      disable-pagination
                      hide-default-footer
                    >
                      <template v-slot:item.ADDDATE="{ item }">
                        {{ $moment(item.ADDDATE).format('DD/MM/YY') }}
                      </template></v-data-table
                    ></v-col
                  >
                </v-row>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      traySearch: '',
      trayLoading: false,
      sampleSearch: '',
      containerSearch: '',
      sampleLoading: false,
      sampleContainers: [],
      sampleContainerHeaders: [
        { text: 'Type', value: 'trayType' },
        { text: 'Tray ID', value: 'STRAYID' },
        { text: 'Container', value: 'STRAYCNTID' },
        { text: 'Date', value: 'ADDDATE' },
        { text: 'Time', value: 'ADDTM' },
      ],
      tray: {},
      trayContainerHeaders: [
        { text: 'ID', value: 'STRAYCNTID' },
        { text: 'Sample ID', value: 'SAMPNUM' },
        { text: 'Subtype', value: 'SUBTYPE' },
        { text: 'Date', value: 'ADDDATE' },
        { text: 'Time', value: 'ADDTM' },
        { text: 'By', value: 'ADDBY' },
      ],
    };
  },
  methods: {
    async getTray() {
      this.tray = {};
      try {
        this.trayLoading = true;
        await this.$axios
          .get('prepped-sample-trays/trays/' + this.traySearch)
          .then((res) => {
            this.tray = res.data.data;
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.trayLoading = false;
        this.traySearch = '';
      }
    },

    async getSample() {
      this.sampleContainers = [];
      this.sampleLoading = true;
      await this.$axios
        .get('prepped-sample-trays/containers/' + this.sampleSearch)
        .then((res) => {
          this.sampleContainers = res.data.data;
        });
      this.sampleLoading = false;
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
