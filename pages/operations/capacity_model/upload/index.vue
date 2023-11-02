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
                v-model="instrument"
              />
            </v-col>
            <v-col
              v-cloak
              @drop.prevent="addDropFile"
              @dragover.prevent="dragging = true"
              @dragleave="dragging = false"
            >
              <v-file-input
                :disabled="!instrument.id"
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
              <v-btn
                color="primary"
                :disabled="badSamples.length == 0"
                @click="sendBadInjections"
              >
                Send {{ badSamples.length }} Samples
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                dense
                :loading="resultsLoading"
                :items="samples"
                :headers="resultsHeaders"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item.results="{ item, index }">
                  {{ item.results.length }}
                </template>
                <template v-slot:item.qc_blank_samp="{ item }">
                  <v-simple-checkbox
                    :value="item.ais_sample_id == null ? true : false"
                  />
                </template>
                <template v-slot:item.samp="{ item }">
                  <v-simple-checkbox
                    :value="item.ais_sample_id == null ? false : true"
                  />
                </template>
                <template v-slot:item.qc_blank_samp="{ item }">
                  <v-simple-checkbox
                    :value="item.ais_sample_id == null ? true : false"
                  />
                </template>
                <template v-slot:item.reanalysing="{ item, index }">
                  <v-checkbox
                    hide-details
                    color="red"
                    class="ma-0"
                    :disabled="item.ais_sample_id == null"
                    @change="badInjectionSelected($event, index, item)"
                  />
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

      instrument: {},

      file: null,
      resultsLoading: false,
      resultsHeaders: [
        { text: 'Sample Name', value: 'sample_name' },
        { text: 'Sample ID', value: 'ais_sample_id' },
        { text: 'Job No.', value: 'ais_job_id' },
        { text: 'Date/Time', value: 'start_time' },
        { text: 'Results', value: 'results' },
        { text: 'QC/Blank/Std', value: 'qc_blank_samp', align: 'center' },
        { text: 'Sample', value: 'samp' },
        { text: 'Re-Analysing', value: 'reanalysing' },
      ],
      results: [],
      samples: [],
      badSamples: [],
      selectedSamples: [],
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
      formData.append('instrument_id', this.instrument.id);
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
    badInjectionSelected(e, index, sample) {
      if (e) {
        this.addBadInjection(index, sample);
      } else {
        this.removeBadInjection(index);
      }
    },
    addBadInjection(index, sample) {
      sample.index = index;
      this.badSamples.push(sample);
    },
    removeBadInjection(index) {
      this.badSamples = this.badSamples.filter((samp) => samp.index !== index);
    },
    sendBadInjections() {
      if (this.badSamples.length == 0) {
        return;
      }
      this.$axios
        .post('instruments/bad-injections', {
          instrument_id: this.instrument.id,
          samples: this.badSamples,
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>

<style></style>
