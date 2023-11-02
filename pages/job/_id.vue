<template>
  <v-row
    ><v-col
      ><v-card outlined :loading="loading"
        ><v-card-title>Job: {{ job.JOB }}</v-card-title
        ><v-card-text
          ><v-row style="height:10vh"
            ><v-col
              ><v-simple-table dense
                ><thead>
                  <tr>
                    <th>Job</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Quote</th>
                    <th>Logged Date</th>
                    <th>Instructed Date</th>
                    <th>Released Date</th>
                    <th>Due Date</th>
                    <th>Reported Date</th>
                    <th>Reported Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ job.JOB }}</td>
                    <td>
                      {{ job.office ? job.office.client.CLIENTNAME : '' }}
                    </td>
                    <td>{{ job.JOBSTATUS }}</td>
                    <td>{{ job.QUOTE }}</td>
                    <td>{{ job.LOGDATE }}</td>
                    <td>{{ job.INSDATE }}</td>
                    <td>{{ job.RELDATE }}</td>
                    <td>{{ job.OFFICEDATE }}</td>
                    <td>{{ job.INTERIM }}</td>
                    <td>{{ job.REPDATE }}</td>
                  </tr>
                </tbody></v-simple-table
              ></v-col
            ></v-row
          ><v-row
            ><v-col
              ><v-data-table
                dense
                :headers="samplesTable.sampleHeaders"
                :items="job.samples"
                :options="samplesTable.options"
                :footer-props="samplesTable.footerProps"
                @click:row="getSample"/></v-col
          ></v-row>
          <!-- <v-row style="height:25vh; overflow-y:auto"
            ><v-col
              ><v-simple-table dense
                ><thead>
                  <tr>
                    <th>Sample ID</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Supertype</th>
                    <th>Subtype</th>
                    <th>Sampled</th>
                    <th>Location</th>
                    <th>Sample ID</th>
                    <th>Sample Ref</th>
                    <th>Top</th>
                    <th>Bottom</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="sample in job.samples"
                    :key="sample.SAMPNUM"
                    @click="getSample(sample.SAMPNUM)"
                  >
                    <td>{{ sample.SAMPNUM }}</td>
                    <td>{{ sample.SAMPSTATUS }}</td>
                    <td>{{ sample.TYPE }}</td>
                    <td>{{ sample.SAMPSTATUS }}</td>
                    <td>{{ sample.SUPERTYPE }}</td>
                    <td>{{ sample.SUBTYPE }}</td>
                    <td>{{ sample.SAMPDATE }}</td>
                    <td>{{ sample.CLIENTSREF }}</td>
                    <td>{{ sample.SAMPLE_ID }}</td>
                    <td>{{ sample.SAMPLE_REF }}</td>
                    <td>{{ sample.SAMPTOP }}</td>
                    <td>{{ sample.SAMPBOTTOM }}</td>
                  </tr>
                </tbody></v-simple-table
              ></v-col
            ></v-row
          > -->
          <v-row
            ><v-col cols="2"
              ><v-switch
                dense
                inset
                v-model="nonReportableResults"
                label="Non Reportables"
              ></v-switch></v-col
            ><v-col
              ><v-simple-table dense
                ><thead>
                  <tr>
                    Det
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="result in filteredResults"
                    :key="'det' + result.DET"
                  >
                    <td>{{ result.det.DET }}</td>
                    <td>
                      {{ result.det.REPNAME }}
                    </td>
                    <td>{{ result.det.lod }}</td>
                    <td>
                      {{ result.OUTPUT }}
                    </td>
                    <td>{{ result.det.units }}</td>
                    <td>{{ result.DETDATE }}</td>
                    <td>{{ result.DETTIME }}</td>
                  </tr>
                </tbody></v-simple-table
              ></v-col
            ><v-col
              ><v-simple-table dense
                ><thead>
                  <tr>
                    Det
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="result in filteredWork" :key="'det' + result.DET">
                    <td>{{ result.det.DET }}</td>
                    <td>
                      {{
                        result.det.REPNAME
                          ? result.det.REPNAME
                          : result.det.DETNAME
                      }}
                    </td>
                    <td>{{ result.det.lod }}</td>
                    <td>
                      {{ result.DETDATE ? result.OUTPUT : 'Pending' }}
                    </td>
                    <td>{{ result.det.units }}</td>
                    <td>{{ result.DETDATE }}</td>
                    <td>{{ result.DETTIME }}</td>
                  </tr>
                </tbody></v-simple-table
              ></v-col
            ></v-row
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
      loading: false,
      id: this.$route.params.id,
      samplesTable: {
        sampleHeaders: [
          { text: 'ID', value: 'SAMPNUM' },
          { text: 'Status', value: 'SAMPSTATUS' },
          { text: 'Type', value: 'TYPE' },
          { text: 'Supertype', value: 'SUPERTYPE' },
          { text: 'Subtype', value: 'SUBTYPE' },
          { text: 'Sampled', value: 'SAMPDATE' },
          { text: 'Location', value: 'CLIENTSREF' },
          { text: 'Sample ID', value: 'SAMPLE_ID' },
          { text: 'Sample Ref', value: 'SAMPLE_REF' },
          { text: 'Top (m)', value: 'SAMPTOP' },
          { text: 'Bottom (m)', value: 'SAMPBOTTOM' },
        ],
        options: {
          itemsPerPage: 5,
        },
        footerProps: {
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 10, 25, -1],
        },
      },
      job: {},
      sample: {},
      nonReportableResults: false,
    };
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...

    this.id = to.params.id;
    this.getJob();
    next();
  },
  created() {
    this.getJob();
  },
  computed: {
    filteredResults() {
      if (!this.sample.SAMPNUM) {
        return [];
      }
      if (!this.nonReportableResults) {
        return this.sample.results.filter((result) => {
          return result.DETORDER > 0;
        });
      }
      return this.sample.results;
    },
    filteredWork() {
      if (!this.sample.SAMPNUM) {
        return [];
      }
      if (!this.nonReportableResults) {
        return this.sample.work.filter((result) => {
          return result.DETORDER > 0;
        });
      }
      return this.sample.work;
    },
  },

  methods: {
    getJob() {
      this.loading = true;
      this.sample = {};
      this.$axios.get('search?search=' + this.id).then((response) => {
        this.job = response.data.data;
        this.loading = false;
      });
    },
    getSample(sample) {
      this.sample = {};
      this.$axios.get('samples/' + sample.SAMPNUM).then((response) => {
        this.sample = response.data.data;
      });
    },
  },
};
</script>

<style></style>
