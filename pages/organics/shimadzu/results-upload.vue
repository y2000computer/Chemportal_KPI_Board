<template>
  <v-card flat>
    <v-toolbar class="font-weight-medium" flat dense>Results Upload</v-toolbar>
    <v-card-text>
      <v-row>
        <v-col>
          <v-autocomplete
            label="Instrument"
            :items="instruments"
            item-value="id"
            item-text="name"
            outlined
            dense
            hide-details
            v-model="instrument_id"
          />
        </v-col>
        <v-col
          v-cloak
          @drop.prevent="addDropFile"
          @dragover.prevent="dragging = true"
          @dragleave="dragging = false"
        >
          <v-file-input
            :disabled="!instrument_id"
            dense
            outlined
            hide-details
            label="Upload Results File"
            v-model="file"
            prepend-icon
            :class="dragging ? ['v-input--is-focused', 'primary--text'] : ''"
          ></v-file-input>
        </v-col>
        <v-col>
          <v-btn
            large
            color="primary"
            :disabled="!file"
            @click="parseFile"
            :loading="parsing"
            >Check File</v-btn
          >

          <v-btn
            class="ml-3"
            large
            color="primary"
            :disabled="results.length == 0"
            @click="exportResults"
            >Export to LIMS</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-simple-table dense v-if="results.length > 0">
            <thead>
              <tr>
                <th>Sample</th>
                <th>Test</th>
                <th v-for="i in 16" :key="'col' + i">PAH{{ i }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sample in results" :key="'sample' + sample.sample">
                <td>
                  {{ sample.sample }}
                </td>
                <td>{{ sample.test }}</td>
                <td
                  v-for="(result, index) in sample.results"
                  :key="'sample' + sample.sample + 'result' + index"
                >
                  {{ result }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      instruments: [],
      instrument: "",
      dragging: false,
      file: null,
      instrument_id: "",
      file: null,
      parsing: false,
      results: [],
      csvData: {
        path: "\\\\nm-ais01\\results\\abtest\\",
        filename: "PAH",
        csvRows: [],
      },
    };
  },
  mounted() {
    this.getInstruments();
  },
  methods: {
    async getInstruments() {
      let res = await this.$axios.get("instruments/instruments");
      this.instruments = res.data.data.filter((ins) => ins.name == "GC/62");
    },
    addDropFile(e) {
      this.dragging = false;
      this.file = e.dataTransfer.files[0];
    },
    async parseFile() {
      this.parsing = true;
      this.results = [];
      let formData = new FormData();
      formData.append("instrument_id", this.instrument_id);
      formData.append("file", this.file);
      formData.append("filename", this.file.name);

      try {
        await this.$axios
          .post("results-file-parse", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.results = res.data;
            this.parsing = false;
          });
      } catch (error) {
        console.log(error);
      }
    },

    exportResults() {
      let filename = "PAH" + this.$moment().format("YYMMDDHHmmss");
      this.csvData.filename = filename + ".pla";

      this.results.forEach((sample) => {
        if (sample.results) {
          Object.keys(sample.results).forEach((det) => {
            this.csvData.csvRows.push([
              sample.sample,
              "",
              det,
              sample.results[det],
              "",
              "",
              "",
              this.$auth.user.USER_ID,
              this.$moment().format("YYYY-MM-DD"),
              this.$moment().format("HHmm"),
              "Chemportal",
              filename,
            ]);
          });
        }
      });
      this.$axios.post("csv/generate-csv", this.csvData).then((response) => {
        this.csvData.csvRows = [];
      });
    },
  },
};
</script>

<style></style>
