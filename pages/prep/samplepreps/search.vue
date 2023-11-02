<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Sample Prep Search</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="4" cols="12">
              <v-text-field
                autofocus
                outlined
                :loading="loading"
                v-model="search"
                v-validate="{rules:'required'}"
                name="Sample No."
                placeholder="Sample No."
                :error-messages="errors.first('Sample No.')"
                label="Search"
                @keyup.enter="sampleSearch"
                append-icon="search"
                @click:append-outer="sampleSearch"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" v-if="sample.TESTS">
              <v-row>
                <v-col>Sample: {{sample.SAMPNUM}}</v-col>
                <v-col>Job: {{sample.JOB}}</v-col>
                <v-col>Client: {{sample.CLIENT}}</v-col>
                <v-col>Due Date: {{sample.DUEDATE}}</v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-btn large @click="print">Print</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="sample.TESTS">
            <v-col md="4" v-for="(test,index) in sample.TESTS" :key="'test' + index">
              <v-card outlined class="text-center" @click="test.COMPLETE = !test.COMPLETE">
                <v-card-title>{{test.TITLE}}</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="3">Weight</v-col>
                    <v-col cols="5">Container</v-col>
                    <v-col cols="2">Min</v-col>
                    <v-col cols="2"></v-col>
                  </v-row>
                  <v-row no-gutters class="title" align="center">
                    <v-col cols="3">{{test.WEIGHT}}</v-col>
                    <v-col cols="5">
                      {{test.CONTAINER}}
                      <v-icon large :color="test.COLOUR">brightness_1</v-icon>
                    </v-col>
                    <v-col cols="2">{{test.MINWEIGHT}}</v-col>
                    <v-col cols="2">
                      <div class="float-right">
                        <v-btn
                          large
                          fab
                          ripple
                          :color="test.COMPLETE ? 'green':''"
                          :outlined="!test.COMPLETE"
                        >
                          <v-icon v-if="!test.COMPLETE"></v-icon>
                          <v-icon v-else>done</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        {{sample.TESTS}}
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      searched: false,
      sample: [],
      loading: false,
      printData: {
        path: "\\\\nm-web01\\RegistrationLabels$\\",
        // path:
        //   "\\\\nm-fileserver\\shared areas\\free access\\RegistrationLabelsTest\\",
        filename: "lean_test.csv",
        csvHeaders: [
          "JOB",
          "TRAY",
          "CLIENT",
          "SAMPNUM",
          "PROJECT",
          "SAMPLE_REF",
          "SAMPLE_ID",
          "CLIENTS_REF",
          "CONTAINER",
          "SAMPTOP",
          "SAMPBOTTOM",
          "LOGGED BY",
          "LOG DATE",
          "DUE DATE",
          "DISPOSAL DATE",
          "TURNAROUND",
          "EXTSTORAGE",
          "FORMAT",
          "PRINTER",
          "CONTAINER COUNT"
        ],
        csvRows: []
      }
    };
  },
  methods: {
    sampleSearch() {
      this.data = [];
      this.loading = true;
      this.searched = false;
      this.$axios
        .get(
          "http://chemtest-api/api/preps/sample_search?sampnum=" + this.search
        )
        .then(response => {
          this.sample = response.data;
          this.searched = true;
          (this.search = ""), (this.loading = false);
        })
        .then(() => {
          this.sample.TESTS.forEach((test, key) => {
            this.$set(this.sample.TESTS[key], "COMPLETE", false);
          });
        })
        .catch(e => {
          this.error = e + "";
          this.sample = [];
          this.loading = false;
        });
    },
    print() {
      this.sample.TESTS.forEach(test => {
        if (test.COMPLETE) {
          this.printData.csvRows.push([
            this.sample.JOB,
            "",
            "",
            this.sample.SAMPNUM,
            "",
            "",
            "",
            "",
            test.TITLE,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "NM_PREP_LEAN_TEST.btw",
            "NM_REGISTRATION_LABEL_H",
            ""
          ]);
        }
      });
      this.$axios.post("csv/generate-csv", this.printData);
    }
  }
};
</script>

<style>
</style>