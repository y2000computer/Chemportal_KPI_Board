<template>
  <v-dialog v-model="sampleResultsDialog" persistent max-width="800"
    ><v-card
      ><v-card-title
        >Results Entry<v-spacer /><v-btn icon @click="closeDialog"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      ><v-card-text>
        <v-row
          ><v-col
            >Container
            <v-simple-table>
              <thead>
                <tr>
                  <th>Container</th>
                  <th>Sample</th>
                  <th>Job</th>
                  <th>Client</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ container.STRAYCNTID }}</td>
                  <td>{{ container.SAMPNUM }}</td>
                  <td>{{ container.sample ? container.sample.JOB : "-" }}</td>
                  <td>
                    {{
                      container.sample
                        ? container.sample.job.office.client.CLIENTNAME
                        : "-"
                    }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col></v-row
        >
        <v-row
          ><v-col
            >Results
            <v-simple-table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Det Required</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in sampleResults"
                  :key="'resultItemRow' + index"
                >
                  <td>{{ item.label }}</td>
                  <td>
                    <v-chip dark :color="item.required ? 'green' : 'red'">{{
                      item.det
                    }}</v-chip>
                  </td>
                  <td>
                    <v-text-field
                      filled
                      autocomplete="off"
                      v-model="sampleResults[index].value"
                      :readonly="item.readonly"
                      @keyup.enter="
                        index + 1 == sampleResults.length ? addResults() : ''
                      "
                      outlined
                      dense
                      hide-details
                      ref="resultEntry"
                    />
                  </td>
                </tr>
              </tbody> </v-simple-table></v-col
        ></v-row> </v-card-text
      ><v-card-actions
        ><v-spacer /><v-btn
          color="primary"
          @click="addResults"
          :disabled="
            sampleResults.length == 0 || noResultsEntryRequired || !allResultsIn
          "
          >{{ noResultsEntryRequired ? countDown : "Add Results" }}</v-btn
        ></v-card-actions
      ><v-dialog width="600" v-model="notRequiredDialog"
        ><v-card
          ><v-card-title>Testing Not Required</v-card-title
          ><v-card-text
            >Testing not required. Please dispose of label and scan
            again.</v-card-text
          >
          <v-card-actions
            ><v-spacer /><v-btn color="primary" @click="deleteContainer"
              >OK</v-btn
            ></v-card-actions
          >
        </v-card>
      </v-dialog></v-card
    ></v-dialog
  >
</template>

<script>
export default {
  props: {
    container: {
      type: Object,
      required: true,
    },
    sampleResults: {
      type: Array,
      required: true,
    },
    sampleResultsDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      countDown: 1,
      notRequiredDialog: false,
    };
  },
  computed: {
    noResultsEntryRequired() {
      let count = 0;
      this.sampleResults.forEach((result) => {
        if (result.readonly) {
          count++;
        }
      });
      return count == this.sampleResults.length;
    },
    resultsNeeded() {
      let count = 0;
      this.sampleResults.forEach((result) => {
        if (result.required) {
          count++;
        }
      });
      return count;
    },
    allResultsIn() {
      let allIn = true;
      this.sampleResults.forEach((res) => {
        if (res.required == true && !res.value) {
          allIn = false;
        }
      });
      return allIn;
    },
  },
  mounted() {
    if (this.resultsNeeded == 0) {
      this.notRequiredDialog = true;
      return;
    }
    if (this.noResultsEntryRequired) {
      this.countDownTimer();
    }
    this.setFocus();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    setFocus() {
      this.sampleResults.forEach((result, index) => {
        if (!result.readonly) {
          setTimeout(() => {
            this.$refs.resultEntry[index].focus();
          }, 100);

          return;
        }
      });
    },
    addResults() {
      this.$axios
        .post("prepped-sample-trays/results", {
          results: this.sampleResults.filter((r) => r.det !== "Not Required"),
        })
        .then((res) => {
          console.log(res);
          this.$emit("containerAdded", res.data.data);
          this.$emit("closeDialog");
        });
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      } else {
        this.addResults();
      }
    },
    deleteContainer() {
      this.$emit("deleteContainer", this.container);
      this.$emit("closeDialog");
    },
  },
};
</script>

<style></style>
