<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Export Samples Awaiting Schedule</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row no-gutters>
            <v-col>
              <v-subheader>Sample Search</v-subheader>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <v-autocomplete
                label="Client"
                outlined
                v-model="client"
                :items="clients"
                item-text="client_name"
                item-value="client"
                :loading="clientsLoading"
                @change="clientSelected($event)"
                hide-details
              />
            </v-col>
            <v-col>
              <v-autocomplete
                label="Office"
                outlined
                v-model="office"
                :loading="clientLoading"
                :items="client.offices"
                item-text="SEARCHNAME"
                item-value="OFFICE"
                @change="officeSelected($event)"
                hide-details
              />
            </v-col>
            <v-col>
              <v-autocomplete
                label="Project"
                outlined
                v-model="project"
                :items="office.projects"
                item-text="full_name"
                item-value="PROJECTSID"
                @change="projectSelected($event)"
                hide-details
              />
            </v-col>
            <v-col md="2">
              <v-btn large color="primary" @click="sampleSearch">
                Search
                <v-icon class="pl-3">search</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                hide-details
                v-model="search"
                clearable
                outlined
                label="Search"
                append-icon="search"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-spacer />
              <v-btn
                class="float-right"
                @click="exportDialog = !exportDialog"
                large
                color="primary"
                :disabled="selected.length == 0 || exporting"
                :loading="exporting"
                >Export ({{ selected.length }})</v-btn
              >
            </v-col>
          </v-row>
          <v-divider />
          <v-data-table
            :headers="headers"
            :items="holdSamples"
            :loading="loading"
            :search="search"
            show-select
            v-model="selected"
            item-key="HOLDSAMPID"
            :footer-props="{
              itemsPerPageOptions: [20, 50, 100, -1]
            }"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-col>

    <v-dialog v-model="exportDialog" width="600" height="1600">
      <v-card>
        <v-card-title>
          Export Unscheduled Samples
          <v-spacer />
          <v-btn
            @click="exportCSV"
            color="primary"
            :loading="exporting"
            :disabled="exporting"
            >Export</v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-list dense v-if="selected.length > 0">
            <v-list-item>
              <v-list-item-icon>#</v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>ID</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>ClientsRef</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title>Depth (m)</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon></v-list-item-icon>
              <v-list-item-icon></v-list-item-icon>
            </v-list-item>
            <v-list-item-group>
              <draggable v-model="selected">
                <transition-group name="flip-list">
                  <div
                    v-for="(sample, index) in selected"
                    :key="'samp' + sample.HOLDSAMPID"
                  >
                    <v-list-item class="draggable">
                      <v-list-item-icon>{{ index + 1 }}</v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          sample.HOLDSAMPID
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          sample.CLIENTSREF
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          sample.SAMPTOP
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon @click="up(sample, index)">mdi-arrow-up</v-icon>
                      </v-list-item-icon>
                      <v-list-item-icon>
                        <v-icon @click="down(sample, index)"
                          >mdi-arrow-down</v-icon
                        >
                      </v-list-item-icon>
                    </v-list-item>
                    <v-divider :key="sample.HOLDSAMPID + 'div'" />
                  </div>
                </transition-group>
              </draggable>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  components: {
    draggable
  },
  data() {
    return {
      search: '',
      showExported: false,
      sampleNumberOptions: [10, 20, 50, 100],
      holdSamples: [],
      clientsLoading: true,
      clients: [],
      client: [],
      clientLoading: false,
      officeLoading: false,
      office: [],
      project: '',
      loading: true,
      headers: [
        { text: 'ID', value: 'HOLDSAMPID' },
        { text: 'Batch', value: 'holdbatch.job' },
        { text: 'Logged', value: 'holdbatch.LOGDATE' },
        { text: 'Sampled', value: 'SAMPDATE' },
        { text: 'Sample Ref', value: 'SAMPLE_REF' },
        { text: 'Sample id', value: 'SAMPLE_ID' },
        { text: 'Location', value: 'CLIENTSREF' },
        { text: 'Depth (m)', value: 'SAMPTOP' },
        { text: 'Client', value: 'holdbatch.office.client.client_name' },
        { text: 'Project ID', value: 'holdbatch.project.PROJ_ID' },
        { text: 'Project Name', value: 'holdbatch.project.PROJ_NAME' },
        { text: 'Mailed', value: '' }
      ],
      selected: [],
      exportDialog: false,
      csvData: {
        csvHeaders: [
          'CLIENT',
          'OFFICE',
          'ORDER_NO',
          'PROJECTSID',
          'PROJECT',
          'QUOTE',
          'SAMPTOP',
          'SAMPBOTTOM',
          'CONTAINER',
          'RECDATE',
          'RECTIME',
          'SAMPDATE',
          'SAMPTIME',
          'SAMPLE_ID',
          'SAMPLE_REF',
          'CLIENTSREF',
          'TYPE',
          'SUPERTYPE',
          'CONTACTS',
          'RCPT_EMAIL',
          'CONF_EMAIL',
          'REP_EMAIL',
          'HOLDSAMPID'
        ],
        csvRows: [],
        path:
          '\\\\nm-fileserver\\Shared Areas\\Booking In\\Unscheduled Batch Exports\\',
        filename: 'TEST.csv'
      },
      exporting: false
    };
  },
  mounted() {
    this.getHoldSamples();
    this.getClients();
  },
  computed: {
    sampleList() {
      if (this.showExported === true) {
        return this.holdSamples;
      } else {
        return this.holdSamples.filter(sample => sample.EXPORTED === '0');
      }
    }
  },
  methods: {
    sampleSearch() {
      this.loading = true;
      this.$axios
        .get('holdsamples?PROJECTSID=' + this.project)
        .then(response => {
          this.holdSamples = response.data;
          this.loading = false;
        });
    },
    getHoldSamples() {
      this.$axios.get('holdsamples').then(response => {
        this.holdSamples = response.data;
        this.loading = false;
      });
    },
    getClients() {
      this.$axios.get('clients').then(response => {
        this.clients = response.data;
        this.clientsLoading = false;
      });
    },
    clientSelected(e) {
      this.clientLoading = true;
      this.$axios.get('clients/' + e).then(response => {
        this.client = response.data;
        this.clientLoading = false;
      });
    },
    officeSelected(e) {
      this.officeLoading = true;
      this.$axios.get('offices/' + e).then(response => {
        this.office = response.data;
        this.officeLoading = false;
      });
    },
    projectSelected(e) {},
    dateFormat(date) {
      if (date) {
        return this.$moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
      } else {
        return '';
      }
    },
    up(sample, index) {
      if (index > 0) {
        this.selected.splice(index, 1);
        this.selected.splice(index - 1, 0, sample);
      }
    },
    down(sample, index) {
      if (index < this.selected.length) {
        this.selected.splice(index, 1);
        this.selected.splice(index + 1, 0, sample);
      }
    },
    exportCSV() {
      this.exporting = true;
      this.csvData.filename =
        'HBExp-' +
        this.$auth.user.id +
        '-' +
        this.$moment().format('YYYYMMDDHHmmssS') +
        '.csv';
      this.selected.forEach(sample => {
        this.csvData.csvRows.push([
          sample.holdbatch.office.client.client,
          sample.holdbatch.office.OFFICE,
          sample.holdbatch.ORDER_NO,
          sample.holdbatch.project.PROJECTSID,
          sample.holdbatch.project.PROJ_ID +
            ' - ' +
            sample.holdbatch.project.PROJ_NAME,
          '',
          sample.SAMPTOP,
          sample.SAMPBOTTOM,
          sample.CONTAINERSTRING,
          this.$moment(sample.holdbatch.RECDATE, 'YYYY-MM-DD').format(
            'DD/MM/YYYY'
          ),
          sample.holdbatch.RECTIME,
          sample.SAMPDATE
            ? this.$moment(sample.SAMPDATE, 'YYYY-MM-DD').format('DD/MM/YYYY')
            : '',
          sample.SAMPTIME,
          sample.SAMPLE_ID,
          sample.SAMPLE_REF,
          sample.CLIENTSREF,
          sample.SAMPTYPE,
          'S',
          sample.holdbatch.CONTACTS,
          sample.holdbatch.EMAIL,
          sample.holdbatch.EMAIL,
          sample.holdbatch.EMAIL,
          sample.HOLDSAMPID
        ]);
      });
      this.$axios
        .patch('holdsamples/export2', { samples: this.selected })
        .then(response => {
          console.log(response);
        });
      this.$axios.post('csv', this.csvData).then(() => {
        this.$store.dispatch('snackbar/showSnackbar', 'Exported Successfully');
        this.selected = [];
        this.csvData.csvRows = [];
        this.exportDialog = false;
        this.exporting = false;
        this.getHoldSamples();
      });
    }
  }
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
</style>
