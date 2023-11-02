<template>
  <!-- <v-row>
    <v-col> -->
  <v-card flat class="mt-3">
    <v-card-text>
      <v-row>
        <v-col md="3" cols="12">
          <v-select
            label="Department Filter"
            dense
            outlined
            hide-details
            :items="sections"
            item-text="text"
            item-value="value"
            v-model="section"
          ></v-select>
        </v-col>
        <v-col md="3" cols="12">
          <v-text-field
            label="Search"
            dense
            outlined
            hide-details
            v-model="search"
          ></v-text-field>
        </v-col>
        <v-col
          ><v-btn color="primary" @click="adHocJobDialog = true"
            >Add Rush Sample Job</v-btn
          ></v-col
        >
      </v-row>
      <v-row
        ><v-col>
          <v-data-table
            dense
            show-expand
            disable-pagination
            hide-default-footer
            :items="filteredJobs"
            :headers="headers"
            :loading="loading"
            item-key="JOB"
            :search="search"
          >
            <template v-slot:item.CLIENTNAME="{ item }">
              {{ item.office.client.CLIENTNAME | shorten(20) }}
            </template>
            <template v-slot:item.INSDATE="{ item }">
              {{ $moment(item.INSDATE).format('DD/MM/YY') }}
            </template>
            <template v-slot:item.OFFICEDATE="{ item }">
              {{ $moment(item.OFFICEDATE).format('DD/MM/YY') }}
            </template>
            <template v-slot:item.vip_type="{ item }">
              {{ item.job_flagged ? 'Job' : 'Vip' }}
            </template>
            <template v-slot:item.ORGANICS="{ item }">
              <v-chip
                small
                class="font-weight-medium text-center"
                :color="
                  item.outstanding.ORGANICS ? 'tableSuccess' : 'tableWarnings'
                "
                >{{ item.outstanding.ORGANICS ? 'Y' : 'N' }}</v-chip
              >
            </template>
            <template v-slot:item.INORGANICS="{ item }">
              <v-chip
                small
                class="font-weight-medium text-center"
                :color="
                  item.outstanding.INORGANICS ? 'tableSuccess' : 'tableWarnings'
                "
                >{{ item.outstanding.INORGANICS ? 'Y' : 'N' }}</v-chip
              >
            </template>
            <template v-slot:item.PREP="{ item }">
              <v-chip
                small
                class="font-weight-medium text-center"
                :color="
                  item.outstanding.PREP ? 'tableSuccess' : 'tableWarnings'
                "
                >{{ item.outstanding.PREP ? 'Y' : 'N' }}</v-chip
              >
            </template>
            <template v-slot:item.ASBESTOS="{ item }">
              <v-chip
                small
                class="font-weight-medium text-center"
                :color="
                  item.outstanding.ASBESTOS ? 'tableSuccess' : 'tableWarnings'
                "
                >{{ item.outstanding.ASBESTOS ? 'Y' : 'N' }}
              </v-chip>
            </template>
            <template v-slot:item.SUBCON="{ item }">
              <v-chip
                small
                class="font-weight-medium text-center"
                :color="
                  item.outstanding.SUBCON ? 'tableSuccess' : 'tableWarnings'
                "
                >{{ item.outstanding.SUBCON ? 'Y' : 'N' }}</v-chip
              >
            </template>
            <template v-slot:item.job_notes="{ item }">
              {{ item.job_notes | shorten(25) }}
              <v-btn @click="editNotes(item)" icon small
                ><v-icon>mdi-playlist-edit</v-icon></v-btn
              >
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-card flat>
                  <v-card-text>
                    <v-simple-table dense>
                      <thead>
                        <tr>
                          <th>Sample</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Exceptions</th>
                          <th>Test List</th>
                          <th>Det List</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="sample in item.samples"
                          :key="sample.SAMPNUM"
                        >
                          <td>{{ sample.SAMPNUM }}</td>
                          <td>{{ sample.SUPERTYPE }}</td>
                          <td>{{ sample.SAMPSTATUS }}</td>
                          <td>{{ sample.exceptions.length }}</td>
                          <td>
                            <v-chip
                              small
                              v-for="(sop, index) in sample.sops"
                              :key="sample.SAMPNUM + index"
                              class="mr-2 my-1"
                            >
                              {{
                                sop
                                  ? sop.TITLE
                                    ? sop.TITLE
                                    : 'Unknown'
                                  : 'Unknown'
                              }}
                            </v-chip>
                          </td>
                          <td>
                            <v-btn icon @click="sampleSelected(sample)">
                              <v-icon color="primary">mdi-information</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </td>
            </template>
          </v-data-table>
        </v-col></v-row
      >

      <v-dialog v-model="detDialog" width="1000">
        <v-card v-if="selectedSample.SAMPNUM" min-height="600">
          <v-card-title>Sample {{ selectedSample.SAMPNUM }}</v-card-title>
          <v-card-text>
            <v-tabs grow>
              <v-tab>Outstanding Work</v-tab>

              <v-tab :disabled="selectedSample.exceptions.length == 0"
                >Flagged Exceptions</v-tab
              >
              <v-tab-item>
                <v-row>
                  <v-col>
                    <v-simple-table dense>
                      <thead>
                        <tr>
                          <th>Det Code</th>
                          <th>Det Name</th>
                          <th>Section</th>
                          <th>Reportable</th>
                        </tr>
                      </thead>
                      <tbody v-if="selectedSample">
                        <tr
                          v-for="det in selectedSample.work"
                          :key="selectedSample.SAMPNUM + det.DET"
                          class="text-caption"
                        >
                          <td>{{ det.DET }}</td>
                          <td>{{ det.det.REPNAME }}</td>
                          <td>{{ det.SECTION }}</td>
                          <td>{{ det.DETORDER > 0 ? 'Y' : 'N' }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-tab-item>

              <v-tab-item>
                <v-row>
                  <v-col>
                    <v-simple-table dense>
                      <thead>
                        <tr>
                          <th>Det Code</th>
                          <th>Det Name</th>
                          <th>Section</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody v-if="selectedSample">
                        <tr
                          v-for="exception in selectedSample.exceptions"
                          :key="selectedJob.JOB + exception.EXCEPTNID"
                        >
                          <td>{{ exception.DET }}</td>
                          <td>{{ exception.det.DETNAME }}</td>
                          <td>{{ exception.det.SECTION }}</td>
                          <td>{{ exception.exception_details.string }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="notesDialog" width="800">
        <v-card>
          <v-card-title>
            Job Notes
            <v-spacer />
            <v-btn icon @click="notesEditing = !notesEditing">
              <v-icon :color="notesEditing ? 'primary' : ''">edit</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-textarea
              label="Job Notes"
              outlined
              :readonly="!notesEditing"
              v-model="notesNotes"
              rows="10"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="notesDialog = !notesDialog">Cancel</v-btn>
            <v-spacer />
            <v-btn color="primary" @click="updateNotes">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="adHocJobDialog" width="600"
        ><v-card flat
          ><v-card-title
            >Add Job<v-spacer /><v-btn icon @click="closeAdHocJobDialog"
              ><v-icon>mdi-close</v-icon></v-btn
            ></v-card-title
          >
          <v-card-text
            ><v-row
              ><v-col
                ><v-text-field
                  outlined
                  dense
                  label="Job No."
                  v-model="adHocJob"/></v-col></v-row
          ></v-card-text>
          <v-card-actions>
            <v-spacer /><v-btn color="primary" @click="addAdHocJob"
              >Add</v-btn
            ></v-card-actions
          ></v-card
        ></v-dialog
      >
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    jobs: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sections: [
        { value: '', text: 'All' },
        { value: 'ORGANICS', text: 'Organics' },
        { value: 'INORGANICS', text: 'Inorganics' },
        { value: 'PREP', text: 'Prep' },
        { value: 'ASBESTOS', text: 'Asbestos' },
        { value: 'SUBCON', text: 'Subcon' },
      ],
      section: '',
      search: '',

      headers: [
        { text: 'Job', value: 'JOB' },
        { text: 'Client', value: 'CLIENTNAME' },
        { text: 'Instructed', value: 'INSDATE' },
        { text: 'Due', value: 'OFFICEDATE' },
        { text: 'Samples', value: 'samples.length' },
        { text: 'Exceptions', value: 'EXCEPTIONS' },
        { text: 'Type', value: 'vip_type' },
        { text: 'Status', value: 'JOBSTATUS' },
        {
          text: 'Organics',
          value: 'ORGANICS',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Inorganics',
          value: 'INORGANICS',
          align: 'center',
          sortable: false,
        },
        { text: 'Prep', value: 'PREP', align: 'center', sortable: false },
        {
          text: 'Asbestos',
          value: 'ASBESTOS',
          align: 'center',
          sortable: false,
        },
        { text: 'Subcon', value: 'SUBCON', align: 'center', sortable: false },
        { text: 'Notes', value: 'job_notes', sortable: false },
        { text: '', value: 'data-table-expand' },
      ],
      detDialog: false,
      selectedSample: [],
      selectedJob: [],
      notesDialog: false,
      notesEditing: false,
      notesJob: '',
      notesNotes: '',
      adHocJobDialog: false,
      adHocJob: '',
    };
  },
  computed: {
    filteredJobs() {
      if (!this.jobs) {
        return [];
      }
      if (this.jobs.length > 0) {
        if (this.section == '') {
          return this.jobs;
        }
        return this.jobs.filter((job) => {
          return job.outstanding[this.section] == true;
        });
      }
      return [];
    },
  },
  methods: {
    sampleSelected(sample) {
      this.selectedSample = sample;
      this.selectedJob = this._.find(this.jobs, {
        JOB: sample.JOB,
      });
      this.detDialog = true;
    },
    editNotes(job) {
      this.notesDialog = true;
      this.notesJob = job.JOB;
      this.notesNotes = job.job_notes;
    },
    updateNotes() {
      this.$axios
        .patch('/jobs/' + this.notesJob, {
          JOBNOTES: this.notesNotes,
        })
        .then((response) => {
          this.notesDialog = false;
          this.notesEditing = false;
          this.notesJob = '';
          this.notesNotes = '';
          this.$emit('getJobs');
        });
    },
    addAdHocJob() {
      console.log(this.adHocJob);
      this.$axios
        .patch('/vips/rushsample/' + this.adHocJob, {
          RAG: '1',
        })
        .then((response) => {
          this.closeAdHocJobDialog();
          this.$emit('getJobs');
        });
    },
    closeAdHocJobDialog() {
      this.adHocJobDialog = false;
      this.adHocJob = '';
    },
  },
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  -ms-box-shadow: none !important;
}
</style>
