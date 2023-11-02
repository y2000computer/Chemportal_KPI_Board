<template>
  <v-layout>
    <v-flex>
      <v-card outlined>
        <v-toolbar flat dark>
          <v-toolbar-title>Register New Batch</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1" editable
                >Batch Info.</v-stepper-step
              >

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2" editable
                >Add Samples</v-stepper-step
              >

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 3" step="3" editable
                >Add Containers</v-stepper-step
              >

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 4" step="4" editable
                >Add Paperwork</v-stepper-step
              >

              <v-divider></v-divider>

              <v-stepper-step step="5" editable>Summary</v-stepper-step>
            </v-stepper-header>

            <v-stepper-content step="1">
              <v-row>
                <v-col md="8">
                  <v-card flat>
                    <v-card-title>Batch Info</v-card-title>
                    <v-card-text>
                      <v-row no-gutters justify="space-between">
                        <v-col md="3">
                          <v-text-field
                            prepend-icon="event"
                            label="Logged Date"
                            v-model="form.logdate"
                            readonly
                          />
                        </v-col>
                        <v-col md="3">
                          <v-menu
                            ref="recdate"
                            v-model="recdatemenu"
                            offset-y
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="form.recdate"
                                label="Received Date"
                                v-on="on"
                                prepend-icon="event"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="form.recdate"
                              @input="recdatemenu = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col md="3">
                          <v-text-field
                            prepend-icon="access_time"
                            label="Received Time"
                            v-model="form.rectime"
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters justify="space-between">
                        <v-col md="5">
                          <v-autocomplete
                            label="Client"
                            v-model="form.client"
                            :items="clients"
                            item-text="client_name"
                            item-value="client"
                            :loading="clientsLoading"
                            @change="clientSelected($event)"
                          />
                        </v-col>
                        <v-col md="6">
                          <v-autocomplete
                            label="Office"
                            v-model="form.office"
                            :loading="clientLoading"
                            :items="client.offices"
                            item-text="SEARCHNAME"
                            item-value="OFFICE"
                            @change="officeSelected($event)"
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters justify="space-between">
                        <v-col md="6">
                          <v-autocomplete
                            label="Project"
                            v-model="form.project"
                            :items="office.projects"
                            item-text="full_name"
                            item-value="PROJECTSID"
                          />
                        </v-col>
                        <v-col md="4">
                          <v-text-field
                            label="PO Number"
                            v-model="form.po_number"
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col>
                          <v-select
                            label="Contacts"
                            v-model="form.contacts"
                            :items="office.contacts"
                            item-text="CONTACT"
                            item-value="EMAIL"
                            chips
                            multiple
                            return-object
                          />
                        </v-col>
                      </v-row>
                      <v-row no-gutters justify="space-between">
                        <v-col cols="3">
                          <v-text-field
                            label="Collection ID"
                            v-model="form.collectnid"
                          />
                        </v-col>
                        <v-col cols="3">
                          <v-select
                            label="Courier"
                            v-model="form.couriersid"
                            :items="couriers"
                            item-value="COURIERSID"
                            item-text="COURIER"
                          />
                        </v-col>
                        <v-col cols="3">
                          <v-text-field label="Table" v-model="form.table" />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col md="4">
                  <v-card flat>
                    <v-card-title>Client Notes</v-card-title>
                    <v-card-text>
                      <pre
                        style="white-space:pre-wrap; font-family:inherit"
                        v-if="client"
                        >{{ client.reg_notes }}</pre
                      >
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-row>
                <v-col>
                  <v-card flat>
                    <v-row>
                      <v-col>
                        <v-btn @click="addSample">Add Samples</v-btn>
                        <v-btn
                          @click="copySample"
                          :disabled="selectedSamples.length == 0"
                          >Copy Selected Samples</v-btn
                        >
                        <v-btn @click="addSampleWithInc" disabled
                          >Increment Selected Samples</v-btn
                        >
                        <v-btn
                          @click="deleteSamples"
                          :disabled="selectedSamples.length == 0"
                          >Delete Selected Samples</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <!-- <hot-table
                          v-if="sampleCount > 0"
                          :data="form.samples"
                          :settings="tableSettings"
                          class="black--text"
                        ></hot-table> -->
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-row>
                <v-col md="5">
                  <v-select
                    label="Select Containers"
                    :items="containerTypes"
                    item-value="CONTAINER"
                    item-text="DESCRIPTN"
                    multiple
                    chips
                    v-model="selectedContainers"
                    @change="updateContainers"
                  ></v-select>
                </v-col>
              </v-row>
              <v-simple-table dense>
                <thead>
                  <th
                    v-for="(header, index) in updateContainerTableHeaders()"
                    :key="'header' + index"
                  >
                    {{ header.text }}
                  </th>
                </thead>
                <tbody>
                  <tr
                    v-for="(sample, index) in form.samples"
                    :key="'sample' + index"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ sample.CLIENTSREF }}</td>
                    <td>{{ sample.SAMPLE_REF }}</td>
                    <td>{{ sample.SAMPLE_ID }}</td>
                    <td>{{ sample.SAMPTOP }}</td>
                    <td
                      v-for="(container, key, index2) in sample.CONTAINERS"
                      :key="'container' + index2"
                      width="200"
                    >
                      <v-row no-gutters align="center">
                        <v-col md="8">
                          <v-text-field
                            v-model="form.samples[index].CONTAINERS[key]"
                          ></v-text-field>
                        </v-col>
                        <v-col md="2">
                          <v-btn
                            small
                            text
                            @click="fillContainers(key, index, container)"
                          >
                            <v-icon>arrow_downward</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-stepper-content>
            <v-stepper-content step="4">
              <v-row>
                <v-col>
                  <v-file-input
                    label="Upload COC"
                    v-model="COC"
                    accept="application/pdf"
                    type="file"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="5">
              {{ form }}
              <v-btn
                large
                class="primary"
                @click="save"
                :disabled="this.form.samples.length == 0"
                >Save</v-btn
              >
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {
    HotTable,
    HotColumn,
  },
  data() {
    return {
      e1: 1,
      recdatemenu: false,
      clients: [],
      clientsLoading: true,
      client: [],
      clientLoading: false,
      couriers: [],
      office: [],
      sampleTypes: [],
      sampleCount: 0,
      containerTypes: [],
      selectedContainers: [],
      defaultContainerHeaders: [
        { text: '#', sortable: false },
        { text: 'Loc/Hole/Desc', sortable: false },
        { text: 'Clients Ref', value: 'CLIENTSREF', sortable: false },
        { text: 'Sample ID', sortable: false },
        { text: 'Samp Depth ID', sortable: false },
      ],
      form: {
        logdate: '',
        logby: this.$auth.user.id,
        recdate: '',
        rectime: '',
        project: '',
        po_number: '',
        contacts: '',
        collectnid: '',
        couriersid: '',
        table: '',
        samples: [],
      },
      COC: null,
      tableSettings: {
        licenseKey: 'non-commercial-and-evaluation',
        contextMenu: false,
        rowHeaders: true,
        height: '500px',
        width: '1500px',
        colHeaders: [
          '',
          'Sample Date',
          'Sample Time',
          'Sample Type',
          'Supertype',
          'Sub Type',
          'AGS Type',
          'Loc/Hole/Desc',
          'Sample Ref',
          'Sample ID',
          'Top (m)',
          'Bottom (m)',
        ],
        columns: [
          {
            data: 'CHECKED',
            type: 'checkbox',
            className: 'htCenter',
            width: 25,
          },
          { data: 'SAMPDATE', type: 'date', dateFormat: 'YYYY-MM-DD' },
          { data: 'SAMPTIME', type: 'text' },
          {
            data: 'TYPE',
            type: 'autocomplete',
            strict: true,
            source: [
              'SOIL',
              'WATER',
              'ASBESTOS',
              'GAS',
              'MISCSOLID',
              'FREEPHASE',
            ],
          },
          { data: 'SUPERTYPE', type: 'autocomplete', strict: true },
          { data: 'SUBTYPE', type: 'autocomplete', strict: true },
          { data: 'AGSTYPE', type: 'autocomplete', strict: true },
          { data: 'CLIENTSREF', type: 'text' },
          { data: 'SAMPLE_REF', type: 'text' },
          { data: 'SAMPLE_ID', type: 'text' },
          { data: 'SAMPTOP', type: 'text' },
          { data: 'SAMPBOTTOM', type: 'text' },
        ],
      },
    };
  },
  computed: {
    selectedSamples() {
      return this._.filter(this.form.samples, ['CHECKED', true]);
    },
  },
  mounted() {
    this.form.logdate = this.$moment().format('YYYY-MM-DD');
    this.getClients();
    this.getSampleTypes();
    this.getContainersTypes();
    this.getCouriers();
  },
  methods: {
    getClients() {
      this.$axios.get('clients').then((response) => {
        this.clients = response.data;
        this.clientsLoading = false;
      });
    },

    getSampleTypes() {
      this.$axios.get('sampletypes').then((response) => {
        this.sampleTypes = response.data;
      });
    },

    getCouriers() {
      this.$axios.get('couriers').then((response) => {
        this.couriers = response.data;
      });
    },

    clientSelected(e) {
      this.clientLoading = true;
      this.$axios.get('clients/' + e).then((response) => {
        this.client = response.data;
        this.clientLoading = false;
      });
    },

    officeSelected(e) {
      this.officeLoading = true;
      this.$axios.get('offices/' + e).then((response) => {
        this.office = response.data;
        this.officeLoading = false;
      });
    },

    getContainersTypes() {
      this.$axios.get('containertypes').then((response) => {
        this.containerTypes = response.data;
      });
    },

    addSample() {
      this.sampleCount++;
      this.form.samples.push({
        CHECKED: false,
        SAMPDATE: '',
        SAMPTIME: '',
        TYPE: 'SOIL',
        SUPERTYPE: 'S',
        SUBTYPE: '',
        AGSTYPE: '',
        SAMPLE_ID: '',
        CLIENTSREF: '',
        SAMPLE_REF: '',
        SAMPTOP: '',
        SAMPBOTTOM: '',
        CONTAINERS: {},
      });
      this.updateContainers();
    },

    copySample() {
      this.selectedSamples.forEach((sample) => {
        this.sampleCount++;
        this.form.samples.push({
          CHECKED: false,
          SAMPDATE: sample.SAMPDATE,
          SAMPTIME: sample.SAMPTIME,
          TYPE: sample.TYPE,
          SUPERTYPE: sample.SUPERTYPE,
          SUBTYPE: sample.SUBTYPE,
          AGSTYPE: sample.AGSTYPE,
          SAMPLE_ID: sample.SAMPLE_ID,
          CLIENTSREF: sample.CLIENTSREF,
          SAMPLE_REF: sample.SAMPLE_REF,
          SAMPTOP: sample.SAMPTOP,
          SAMPBOTTOM: sample.SAMPBOTTOM,
          CONTAINERS: {},
        });
      });
      this.updateContainers();
    },

    addSampleWithInc() {
      this.selectedSamples.forEach((sample) => {
        console.log(sample.SAMPLE_ID.replace(/^\D+/g, ''));
      });
    },

    deleteSamples() {
      for (var i = 0; i < this.form.samples.length; i++) {
        if (this.form.samples[i].CHECKED == true) {
          this.form.samples.splice(i, 1);
          i--;
        }
      }
    },

    sampletypeSelected() {
      if (changes) {
        changes.forEach(([row, prop, oldValue, newValue]) => {
          console.log(row);
          if (prop === 'SAMPTYPE') {
            console.log(Vue._.findKey(this.sampleTypes, { TYPE: type }));
            console.log('Update Sub Types with ' + this.getSampleTypes);
          }
        });
      }
    },

    updateContainers() {
      this.form.samples.forEach((sample, key) => {
        this.selectedContainers.forEach((container) => {
          let containerKey = container;
          if (!(containerKey in sample.CONTAINERS)) {
            this.$set(sample.CONTAINERS, containerKey, 0);
          }
        });
        Object.keys(sample.CONTAINERS).forEach((containerKey) => {
          if (!this.selectedContainers.includes(containerKey)) {
            delete sample.CONTAINERS[containerKey];
          }
        });
      });
    },

    updateContainerTableHeaders() {
      let tableHeaders = JSON.parse(
        JSON.stringify(this.defaultContainerHeaders)
      );
      this.selectedContainers.forEach((container) => {
        let header = this._.findKey(this.containerTypes, {
          CONTAINER: container,
        });
        tableHeaders.push({
          text: this.containerTypes[header].DESCRIPTN,
          sortable: false,
        });
      });
      return tableHeaders;
    },

    fillContainers(container, index, total) {
      console.log(container);
      console.log(total);
      this.form.samples.forEach((sample, i) => {
        if (i >= index) {
          sample.CONTAINERS[container] = total;
        }
      });
    },

    // fileUpload() {
    //   console.log(this.$refs);
    //   this.COC = this.$refs.COC.files[0];
    // },

    save() {
      this.$axios.post('holdsamples', this.form).then((response) => {
        var COC = new FormData();
        COC.append('COC', this.COC);
        this.$axios
          .post('holdsamples/addCOC/' + response.data, COC, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            this.$router.push({
              path: '/registration/labels?job=' + response.data,
            });
          });
      });
    },
  },
};
</script>

<style></style>
