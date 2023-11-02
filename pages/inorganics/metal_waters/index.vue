<template>
  <v-row>
    <v-col>
      <v-card flat :loading="instrumentsLoading">
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Capacity Model - File Upload</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                outlined
                dense
                hide-details
                label="Instrument"
                :items="instruments"
                item-text="name"
                return-object
                v-model="form.instrument"
              />
            </v-col>
            <v-col
              v-cloak
              @drop.prevent="addDropFile"
              @dragover.prevent="dragging = true"
              @dragleave="dragging = false"
            >
              <v-file-input
                :disabled="!form.instrument.id"
                dense
                outlined
                hide-details
                label="Upload Results File"
                v-model="file"
                prepend-icon
                :class="
                  dragging ? ['v-input--is-focused', 'primary--text'] : ''
                "
              ></v-file-input>
            </v-col>
            <v-col>
              <v-btn @click="test">Test</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                dense
                :loading="resultsLoading"
                :items="aisSamples"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:header>
                  <th
                    v-for="(header, index) in resultsHeaders"
                    :key="'header' + index"
                  >
                    {{ header.text }}
                  </th>
                  <th
                    v-for="(header, key, index) in aisSamples[0].results"
                    :key="'resHeader' + index"
                  >
                    {{ key }}
                  </th>
                </template>
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.sample_name }}</td>
                    <td>{{ item.ais_sample_id }}</td>
                    <td>{{ item.ais_job_id }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.sample_type }}</td>
                    <td
                      v-for="(res, resIndex) in item.results"
                      :key="item.index + resIndex"
                    >
                      {{ res.det ? res.result : null }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      instrumentsLoading: false,
      instruments: [],
      dragging: false,
      form: {
        instrument: {},
      },
      file: null,
      resultsLoading: false,
      resultsHeaders: [
        { text: 'Sample Name', value: 'sample_name' },
        { text: 'Sample ID', value: 'ais_sample_id' },
        { text: 'Job No.', value: 'ais_job_id' },
        { text: 'D/T', value: 'work' },
        { text: 'Type', value: 'work' },
      ],
      results: [],
      samples: [],
      csvData: {
        path: '\\\\nm-ais01\\results\\',
        filename: 'MetalsTest',
        csvRows: [],
      },
    };
  },
  mounted() {
    this.getInstruments();
  },

  watch: {
    file: function() {
      this.parseResults();
    },
  },

  computed: {
    aisSamples() {
      //return this.samples;
      return this.samples.filter((r) => r.ais_sample_id);
    },
  },

  methods: {
    async getInstruments() {
      this.instrumentsLoading = true;
      try {
        await this.$axios.get('instruments/instruments').then((res) => {
          this.instruments = res.data.data;
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.instrumentsLoading = false;
      }
    },

    addDropFile(e) {
      this.dragging = false;
      this.file = e.dataTransfer.files[0];
    },

    async parseResults() {
      this.resultsLoading = true;
      let formData = new FormData();
      formData.append('instrument_id', this.form.instrument.id);
      formData.append('file', this.file);
      formData.append('filename', this.file.name);
      try {
        await this.$axios
          .post('instruments/results/parse', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            this.results = res.data.data;
            this.samples = res.data.data.contents.samples;
          });
      } catch (error) {
      } finally {
        this.resultsLoading = false;
      }
    },
    test() {
      var filename = 'MetalsTest' + this.$moment().format('YYMMDDHHmmss');
      this.csvData.filename = filename + '.pla';
      this.aisSamples.forEach((s) => {
        console.log(s);
        Object.keys(s.results).forEach((res) => {
          if (!s.results[res].det) {
            return;
          }
          this.csvData.csvRows.push([
            s.ais_sample_id,
            '',
            s.results[res].det.DET,
            s.results[res].result,
            '',
            '',
            '',
            'ANB',
            this.$moment().format('YYYY-MM-DD'),
            this.$moment().format('HHmm'),
            'Chemportal',
            filename,
          ]);
        });
      });
      this.$axios.post('csv/generate-csv', this.csvData).then((response) => {
        this.csvData.csvRows = [];
      });
    },
  },
};
</script>

<style></style>
