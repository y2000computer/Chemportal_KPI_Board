<template>
  <v-row>
    <v-col
      ><v-card flat
        ><v-card-title
          ><v-btn small class="mr-2" icon @click="$router.back()"
            ><v-icon>mdi-arrow-left</v-icon></v-btn
          >Job Release: {{ job.JOB }} </v-card-title
        ><v-card-text
          ><v-row dense
            ><v-col>
              <v-card flat :loading="loading"
                ><v-card-text>
                  <v-stepper v-model="step" non-linear>
                    <v-stepper-header>
                      <v-stepper-step step="1" editable>
                        Job Details
                      </v-stepper-step>
                      <v-stepper-step step="2" editable>
                        Sample Details
                      </v-stepper-step>
                      <v-stepper-step step="3" editable>
                        Sample Testing
                      </v-stepper-step>
                      <v-stepper-step step="4" editable>
                        Release Job
                      </v-stepper-step></v-stepper-header
                    >
                    <v-stepper-items>
                      <v-stepper-content step="1">
                        <v-row class="mt-1"
                          ><v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Job"
                              :value="job.JOB"
                              readonly
                          /></v-col>
                          <v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Quote"
                              :value="job.QUOTE"
                              readonly/></v-col
                          ><v-col>
                            <v-text-field
                              outlined
                              dense
                              label="PO No."
                              :value="job.ORDER_NO"
                              :error-messages="
                                job.JOB && !job.ORDER_NO ? 'Need PO?' : ''
                              "
                              readonly
                            /> </v-col
                          ><v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Turnaround"
                              :value="job.TURNAROUND"
                              readonly/></v-col
                          ><v-col
                            ><v-text-field
                              outlined
                              dense
                              label="No. Samples"
                              :value="job.NO_SAMPLES"
                              readonly/></v-col
                        ></v-row>
                        <v-row>
                          <v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Client"
                              :value="
                                job.office ? job.office.client.CLIENTNAME : ''
                              "
                              readonly/><v-text-field
                              outlined
                              dense
                              label="Office"
                              :value="job.office ? job.office.SEARCHNAME : ''"
                              readonly/><v-text-field
                              outlined
                              dense
                              label="Project"
                              :value="job.PROJECT"
                              readonly
                          /></v-col>
                          <v-col
                            ><v-textarea
                              outlined
                              readonly
                              dense
                              rows="6"
                              label="Address"
                              :value="
                                job.office
                                  ? job.office.address.replace(/,/g, ',\n')
                                  : ''
                              "
                          /></v-col>
                        </v-row>
                        <v-row
                          ><v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Received Date"
                              :value="$moment(job.RECDATE).format('DD-MM-YY')"
                              readonly/></v-col
                          ><v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Instructed Date"
                              :value="$moment(job.INSDATE).format('DD-MM-YY')"
                              readonly/></v-col
                          ><v-col
                            ><v-text-field
                              outlined
                              dense
                              label="Due Date"
                              :value="
                                $moment(job.OFFICEDATE).format('DD-MM-YY')
                              "
                              readonly
                          /></v-col>
                          <v-col
                            ><v-switch
                              class="mt-1"
                              label="Extended Storage"
                              inset
                              readonly
                              :input-value="
                                job.EXTSTORAGE == '1' ? true : false
                              "/></v-col
                        ></v-row>

                        <v-row
                          ><v-col
                            ><v-textarea
                              dense
                              outlined
                              auto-grow
                              :value="job.CONTACTS"
                              label="Contacts"
                          /></v-col>
                          <v-col
                            ><v-textarea
                              outlined
                              dense
                              auto-grow
                              :value="job.RCPT_EMAIL"
                              label="Receipt Emails"
                          /></v-col>
                          <v-col
                            ><v-textarea
                              outlined
                              dense
                              auto-grow
                              :value="job.CONF_EMAIL"
                              :error-messages="
                                job.JOB && !job.CONF_EMAIL
                                  ? 'Add Contacts!!'
                                  : ''
                              "
                              label="Confirmation Emails"
                          /></v-col>
                          <v-col
                            ><v-textarea
                              label="Reporting Emails"
                              auto-grow
                              outlined
                              dense
                              :error-messages="
                                job.JOB && !job.REP_EMAIL
                                  ? 'Add Contacts!!'
                                  : ''
                              "
                              :value="job.REP_EMAIL"/></v-col
                        ></v-row>
                      </v-stepper-content>
                      <v-stepper-content step="2">
                        <v-row
                          ><v-col
                            ><v-data-table
                              dense
                              disable-pagination
                              hide-default-footer
                              :items="job.samples"
                              :headers="sampleHeaders"
                              ><template v-slot:item.SAMPDATE="{ item }">{{
                                $moment(item.SAMPDATE).format('DD-MM-YY')
                              }}</template></v-data-table
                            ></v-col
                          ></v-row
                        >
                      </v-stepper-content>
                      <v-stepper-content step="3">
                        <v-row dense
                          ><v-col class="text-right" color="primary">
                            <v-btn
                              @click="testingDialog = !testingDialog"
                              color="primary"
                              >View</v-btn
                            ></v-col
                          ></v-row
                        >
                        <v-row
                          ><v-col
                            ><v-data-table
                              dense
                              disable-pagination
                              hide-default-footer
                              :items="job.samples"
                              :headers="testingHeaders"
                              ><template v-slot:item.SAMPDATE="{ item }">{{
                                $moment(item.SAMPDATE).format('DD-MM-YY')
                              }}</template>

                              <template v-slot:item.tphClash="{ item }"
                                ><v-icon
                                  :color="item.tphClash ? 'red' : 'green'"
                                  >{{
                                    item.SAMPSTATUS == 'HOLD'
                                      ? ''
                                      : item.tphClash
                                      ? 'mdi-alert-circle'
                                      : 'mdi-checkbox-marked-circle'
                                  }}</v-icon
                                ></template
                              >
                              <template v-slot:item.pahClash="{ item }"
                                ><v-icon
                                  :color="item.pahClash ? 'red' : 'green'"
                                  >{{
                                    item.SAMPSTATUS == 'HOLD'
                                      ? ''
                                      : item.pahClash
                                      ? 'mdi-alert-circle'
                                      : 'mdi-checkbox-marked-circle'
                                  }}</v-icon
                                ></template
                              >
                              <template v-slot:item.sampleTypeClash="{ item }"
                                ><v-icon
                                  :color="
                                    item.sampleTypeClash ? 'red' : 'green'
                                  "
                                  >{{
                                    item.SAMPSTATUS == 'HOLD'
                                      ? ''
                                      : item.sampleTypeClash
                                      ? 'mdi-alert-circle'
                                      : 'mdi-checkbox-marked-circle'
                                  }}</v-icon
                                ></template
                              ></v-data-table
                            ></v-col
                          ></v-row
                        >
                      </v-stepper-content>
                      <v-stepper-content step="4"
                        ><v-row
                          ><v-col
                            ><v-btn
                              block
                              color="primary"
                              @click="releaseDialog = !releaseDialog"
                              >Release</v-btn
                            ></v-col
                          ></v-row
                        ></v-stepper-content
                      >
                    </v-stepper-items>
                  </v-stepper></v-card-text
                ></v-card
              > </v-col
            ><v-col md="3" sm="4" xs="12"
              ><v-row
                ><v-col
                  ><v-tabs grow v-if="job.JOB"
                    ><v-tab>Notes</v-tab
                    ><v-tab :disabled="!job.quote">Quote</v-tab>
                    <v-tab>Queries</v-tab
                    ><v-tab-item
                      ><v-card flat
                        ><v-card-text
                          style="white-space:pre-wrap; font-family:inherit;"
                          >{{ clientNotes }}</v-card-text
                        ></v-card
                      ></v-tab-item
                    ><v-tab-item
                      ><v-card flat style="height:70vh; overflow-y:auto"
                        ><v-card-text v-if="job.QUOTE"
                          ><v-row
                            ><v-col
                              ><v-text-field
                                hide-details
                                readonly
                                dense
                                outlined
                                label="Quote"
                                :value="job.quote.QUOTE"/></v-col></v-row
                          ><v-row
                            ><v-col
                              ><v-textarea
                                hide-details
                                readonly
                                dense
                                outlined
                                label="Instructions"
                                :value="job.quote.INSTRUCTNS"/></v-col></v-row
                          ><v-row
                            ><v-col
                              ><v-simple-table dense
                                ><thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="quoteItem in job.quote.quote_items"
                                    :key="'quote' + quoteItem.item"
                                  >
                                    <td>{{ quoteItem.item }}</td>
                                    <td>
                                      {{
                                        quoteItem.DET
                                          ? quoteItem.DET
                                          : quoteItem.SUITE
                                      }}
                                    </td>
                                  </tr>
                                </tbody></v-simple-table
                              ></v-col
                            ></v-row
                          ></v-card-text
                        ></v-card
                      ></v-tab-item
                    ><v-tab-item
                      ><v-row
                        ><v-col
                          ><v-btn
                            block
                            @click="queryDialog = !queryDialog"
                            color="primary"
                            >New Query</v-btn
                          ></v-col
                        ></v-row
                      ><v-row
                        dense
                        v-for="query in job.queries"
                        :key="query.QUERY_NO"
                        ><v-col
                          ><v-card flat
                            ><v-card-text
                              ><v-row dense
                                ><v-col
                                  >Query {{ query.QUERY_NO }}</v-col
                                ></v-row
                              ><v-row
                                ><v-col>{{ query.query }}</v-col></v-row
                              ></v-card-text
                            ></v-card
                          ></v-col
                        ></v-row
                      ></v-tab-item
                    ></v-tabs
                  ></v-col
                ></v-row
              ></v-col
            ></v-row
          ></v-card-text
        ></v-card
      >
      <v-dialog v-model="testingDialog" scrollable fullscreen>
        <v-card outlined
          ><v-card-title
            >{{ job.JOB }} Testing Details<v-spacer /><v-btn
              @click="testingDialog = !testingDialog"
              icon
              small
              color="primary"
              ><v-icon>mdi-close</v-icon></v-btn
            ></v-card-title
          ><v-card-text>
            <v-row
              ><v-col
                ><v-switch
                  inset
                  hide-details
                  @change="createTestingTableArray"
                  label="Show Hold Samples"
                  v-model="holdSamples"/></v-col
              ><v-col
                ><v-switch
                  disabled
                  inset
                  hide-details
                  @change="createTestingTableArray"
                  label="Group Suites"
                  v-model="groupedSuites"/></v-col
            ></v-row>
            <v-simple-table class="testingTable" dense>
              <thead>
                <tr
                  v-for="(headerRow, index) in testingTable.detHeaders"
                  :key="'headerRow' + index"
                >
                  <th
                    :style="
                      headerIndex == 0 ? 'min-width:200px;' : 'min-width:100px'
                    "
                    class="font-weight-bold text-center tableSubHeaders"
                    v-for="(header, headerIndex) in headerRow"
                    :key="'header' + header + headerIndex"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in testingTable.dets"
                  :key="'detRow' + index"
                  class="text-center"
                >
                  <template v-for="(cell, cellIndex) in row">
                    <td
                      class="text-caption"
                      v-if="typeof cell !== 'object'"
                      :key="'cell' + index + cellIndex"
                      :style="
                        cellIndex == 0
                          ? $vuetify.theme.isDark
                            ? 'background-color:#1E1E1E;'
                            : 'background-color:#FFFFFF;'
                          : ''
                      "
                    >
                      {{ cell }}
                    </td>
                    <td
                      class="text-caption"
                      v-else-if="!cell.DET"
                      :key="'cell' + index + cellIndex"
                    >
                      -
                    </td>
                    <td
                      class="text-caption"
                      v-else
                      :key="'cell' + index + cellIndex"
                    >
                      Y
                    </td>
                  </template>
                </tr>
              </tbody>
              <thead>
                <tr
                  v-for="(headerRow, index) in testingTable.suiteHeaders"
                  :key="'headerRow' + index"
                >
                  <th
                    class="font-weight-bold tableSubHeaders text-center"
                    v-for="(header, headerIndex) in headerRow"
                    :key="'header' + header + headerIndex"
                    :style="
                      headerIndex == 0 ? 'min-width:200px;' : 'min-width:100px'
                    "
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in testingTable.suites"
                  :key="'suiteRow' + index"
                  class="text-center"
                >
                  <template v-for="(cell, cellIndex) in row">
                    <td
                      v-if="cell == 'button'"
                      :key="'suiteCell' + index + cellIndex"
                    >
                      <v-btn small icon @click="suiteSelected(row[1])"
                        ><v-icon>mdi-information-outline</v-icon></v-btn
                      >
                    </td>
                    <td
                      :key="'suiteCell' + index + cellIndex"
                      class="text-caption"
                      v-else-if="typeof cell !== 'object'"
                      :style="
                        cellIndex == 0
                          ? $vuetify.theme.isDark
                            ? 'background-color:#1E1E1E;'
                            : 'background-color:#FFFFFF;'
                          : ''
                      "
                    >
                      {{ cell }}
                    </td>

                    <td
                      class="text-caption"
                      v-else-if="!cell.SUITE"
                      :key="'suiteCell' + index + cellIndex"
                    >
                      -
                    </td>

                    <td
                      v-else
                      :key="'suiteCell' + index + cellIndex"
                      class="text-caption"
                      :class="
                        cell.sampleTotal < cell.dets_count
                          ? 'tableWarnings'
                          : ''
                      "
                    >
                      {{ cell.sampleTotal }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text></v-card
        >
      </v-dialog>
      <v-dialog v-model="suiteDialog" width="1000" persistent>
        <v-card
          ><v-card-title
            >Suite Details: {{ selectedSuite.title }} [{{
              selectedSuite.SUITE
            }}]<v-spacer /><v-btn small icon @click="suiteClosed"
              ><v-icon>mdi-close</v-icon></v-btn
            ></v-card-title
          ><v-card-text
            ><v-data-table
              hide-default-footer
              disable-pagination
              dense
              :headers="suiteHeaders"
              :items="selectedSuite.dets"
              ><template v-slot:item.hidden="{ item }"
                ><div
                  class="font-weight-bold"
                  :class="item.det.DETORDER == 0 ? 'red--text' : ''"
                >
                  {{ item.det.DETORDER == 0 ? 'Y' : 'N' }}
                </div></template
              ></v-data-table
            ></v-card-text
          ></v-card
        >
      </v-dialog>
      <v-dialog v-model="releaseDialog" width="600" persistent>
        <v-card
          ><v-card-title>Release Job: {{ job.JOB }}</v-card-title
          ><v-card-text>
            Are you sure you want to release job {{ job.JOB }}?</v-card-text
          ><v-card-actions
            ><v-btn @click="releaseDialog = !releaseDialog">Cancel</v-btn
            ><v-spacer /><v-btn color="primary" @click="releaseJob"
              >Release</v-btn
            ></v-card-actions
          ></v-card
        >
      </v-dialog>
      <query-dialog-form
        :dialog="queryDialog"
        :job="job.JOB"
        @dialogClosed="queryDialog = false"
      /> </v-col
  ></v-row>
</template>

<script>
import queryDialogForm from '../../../components/queries/queryDialogForm';
export default {
  components: {
    queryDialogForm,
  },
  data() {
    return {
      id: this.$route.params.id,
      loading: false,
      tab: '',
      job: {},
      clientNotes: '',
      holdSamples: false,
      groupedSuites: true,
      step: 1,
      sampleHeaders: [
        { text: '#', value: 'SAMPNUM', sortable: false },
        { text: 'Status', value: 'SAMPSTATUS', sortable: false },
        { text: 'Type', value: 'TYPE', sortable: false },
        { text: 'AGS Type', value: 'AGSTYPE', sortable: false },
        { text: 'Location', value: 'CLIENTSREF', sortable: false },
        { text: 'Client Sample ID', value: 'SAMPLE_ID', sortable: false },
        { text: 'Sample Ref', value: 'SAMPLE_REF', sortable: false },
        { text: 'Sampled Date', value: 'SAMPDATE', sortable: false },
        { text: 'Time', value: 'SAMPTIME', sortable: false },
        { text: 'Top Depth ', value: 'SAMPTOP', sortable: false },
        { text: 'Bottom Depth', value: 'SAMPBOTTOM', sortable: false },
      ],
      testingHeaders: [
        { text: '#', value: 'SAMPNUM', sortable: false },
        { text: 'Status', value: 'SAMPSTATUS', sortable: false },
        { text: 'Location', value: 'CLIENTSREF', sortable: false },
        { text: 'Client Sample ID', value: 'SAMPLE_ID', sortable: false },
        { text: 'Sample Ref', value: 'SAMPLE_REF', sortable: false },
        { text: 'Sampled Date', value: 'SAMPDATE', sortable: false },
        { text: 'Top Depth ', value: 'SAMPTOP', sortable: false },

        { text: 'TPH', value: 'tphClash', sortable: false },
        { text: 'PAH', value: 'pahClash', sortable: false },
        { text: 'Types', value: 'sampleTypeClash', sortable: false },
      ],
      testTableHeaders: [],
      testTableData: [],
      testingDialog: false,
      testingTable: {
        detHeaders: [],
        dets: [],
        suiteHeaders: [],
        suites: [],
      },
      suiteDialog: false,
      suiteHeaders: [
        { text: 'Det', value: 'DET', sortable: false },
        { text: 'Repname', value: 'det.REPNAME', sortable: false },
        { text: 'Units', value: 'det.units', sortable: false },
        { text: 'LOD', value: 'det.lod', sortable: false },
        { text: 'Hidden', value: 'hidden', sortable: false },
      ],
      selectedSuite: {},
      releaseDialog: false,
      queryDialog: false,
    };
  },
  mounted() {
    this.getJob();
  },

  methods: {
    getJob() {
      this.loading = true;
      this.$axios.get('jobs/release-jobs/' + this.id).then((response) => {
        this.job = response.data.data;
        this.getClientNotes();
        this.createTestingTableArray();
        this.loading = false;
      });
    },
    getClientNotes() {
      this.$axios
        .get('clients/show/' + this.job.office.CLIENT)
        .then((response) => {
          this.clientNotes = response.data.data.reg_notes;
        });
    },
    createTestingTableArray() {
      this.testingTable = {
        detHeaders: [],
        dets: [],
        suiteHeaders: [],
        suites: [],
      };
      var array = [];
      var sampnumRow = ['', '', '', '', '', '', 'Sample'];
      var clientsrefRow = ['', '', '', '', '', '', 'Location'];
      var sampleidRow = ['', '', '', '', '', '', 'Sample ID'];
      var samplerefRow = ['', '', '', '', '', '', 'Sample Ref'];
      var sampleDepthRow = ['', '', '', '', '', '', 'Sample Depth'];
      var sampdateRow = ['', '', '', '', '', '', 'Sampled'];
      var detHeadersRow = ['Det', 'Code', 'Type', 'Accred', 'LOD', 'Units', ''];
      var suiteHeadersRow = [
        'Suite',
        'Code',
        'Type',
        'Quote',
        'Det Count',
        'Info',
        '',
      ];
      //Loop through samples to create top rows/columns
      this.job.samples.forEach((sample) => {
        if (
          !this.holdSamples &&
          (sample.SAMPSTATUS == 'HOLD' || sample.SAMPSTATUS == 'WITHDRWN')
        ) {
          return;
        }
        sampnumRow.push(sample.SAMPNUM);
        clientsrefRow.push(sample.CLIENTSREF);
        sampleidRow.push(sample.SAMPLE_ID);
        samplerefRow.push(sample.SAMPLE_REF);
        sampleDepthRow.push(sample.SAMPTOP);
        sampdateRow.push(
          this.$moment(sample.SAMPDATE).format('DD-MM-YY') +
            (sample.SAMPTIME ? ' @ ' + sample.SAMPTIME : '')
        );
        detHeadersRow.push('');
        suiteHeadersRow.push('');
      });
      this.testingTable.detHeaders.push(
        sampnumRow,
        clientsrefRow,
        sampleidRow,
        samplerefRow,
        sampleDepthRow,
        sampdateRow,
        this.job.detList.length > 0 ? detHeadersRow : null
      );
      if (this.groupedSuites) {
        this.job.detList.forEach((det) => {
          var detArray = [
            det.REPNAME,
            det.DET,
            det.SUPERTYPE,
            det.accreditation,
            det.lod,
            det.units,
            '',
          ];
          this.job.samples.forEach((sample) => {
            if (
              !this.holdSamples &&
              (sample.SAMPSTATUS == 'HOLD' || sample.SAMPSTATUS == 'WITHDRWN')
            ) {
              return;
            }
            var findDet = this._.find(sample.detList, { DET: det.DET });
            if (findDet) {
              detArray.push(findDet);
            } else {
              detArray.push({});
            }
          });
          this.testingTable.dets.push(detArray);
        });
        this.testingTable.suiteHeaders.push(suiteHeadersRow);
        this.job.suiteList.forEach((suite) => {
          var suiteArray = [
            suite.title,
            suite.SUITE,
            suite.SUPERTYPE,
            suite.inQuote ? 'Y' : 'N',
            suite.dets_count,
            'button',
            '',
          ];
          this.job.samples.forEach((sample) => {
            if (
              !this.holdSamples &&
              (sample.SAMPSTATUS == 'HOLD' || sample.SAMPSTATUS == 'WITHDRWN')
            ) {
              return;
            }
            var findSuite = this._.find(sample.suiteList, {
              SUITE: suite.SUITE,
            });
            if (findSuite) {
              suiteArray.push(findSuite);
            } else {
              suiteArray.push({});
            }
          });
          this.testingTable.suites.push(suiteArray);
        });
      } else {
        this.job.registeredTestingList.forEach((det) => {
          var detArray = [
            det.det.REPNAME,
            det.DET,
            det.det.SUPERTYPE,
            det.det.accreditation,
            det.det.lod,
            det.det.units,
            this._.find(this.job.suiteList, { SUITE: det.SUITE })
              ? this._.find(this.job.suiteList, { SUITE: det.SUITE }).title
              : '',
          ];
          this.job.samples.forEach((sample) => {
            if (
              !this.holdSamples &&
              (sample.SAMPSTATUS == 'HOLD' || sample.SAMPSTATUS == 'WITHDRWN')
            ) {
              return;
            }
            var findDet = this._.find(sample.registeredTesting, {
              DET: det.DET,
            });
            if (findDet) {
              detArray.push(findDet);
            } else {
              detArray.push({});
            }
          });
          this.testingTable.dets.push(detArray);
        });
      }
    },

    suiteSelected(suite) {
      this.selectedSuite = this._.find(this.job.suiteList, { SUITE: suite });
      this.suiteDialog = true;
    },
    suiteClosed() {
      this.selectedSuite = {};
      this.suiteDialog = false;
    },
    releaseJob() {
      this.$axios
        .patch('jobs/release-jobs/' + this.job.JOB)
        .then((response) => {
          console.log(response);
          this.$router.back();
        });
    },
  },
};
</script>

<style>
.v-stepper__header {
  box-shadow: none !important;
  -webkit-box-shadow: none;
  -ms-box-shadow: none;
}
.v-stepper {
  box-shadow: none !important;
  -webkit-box-shadow: none;
  -ms-box-shadow: none;
}
.testingTable tbody > tr > td:nth-child(1),
.testingTable thead > tr > th:nth-child(1) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 9998;
}
.testingTable thead > tr > th:nth-child(1) {
  z-index: 9999;
}
</style>
