<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row justify="space-between" no-gutters>
            <v-col md="6">LOI 440</v-col>
            <v-col md="3">
              <v-btn color="primary" @click="qcDialog = !qcDialog">QC</v-btn>
            </v-col>
            <v-col md="3">
              <v-select
                outlined
                hide-details
                dense
                label="User"
                v-model="user"
                :items="users"
                item-text="USER_NAME"
                item-value="USER_ID"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-data-table
                class="text-center"
                dense
                :items="backlog"
                :headers="backlogTable.headers"
                disable-pagination
                hide-default-footer
                :loading="loading"
              >
                <template v-slot:item.client="{ item }">
                  {{
                  item.job.office.client.CLIENTNAME | shorten(15)
                  }}
                </template>
                <template v-slot:item.OFFICEDATE="{ item }">
                  {{
                  $moment(item.job.OFFICEDATE).format('DD/MM/YY')
                  }}
                </template>
                <template v-slot:item.sampleWeight="{ item }">
                  {{
                  findResult(item, 'LOI4OST_SP')
                  }}
                </template>
                <template v-slot:item.subsampleWeight="{ item }">
                  {{
                  findResult(item, 'LOI4OSS_SP')
                  }}
                </template>
                <template v-slot:item.plusTwentymmWeight="{ item }">
                  {{
                  findResult(item, 'LOI4OS2_SP')
                  }}
                </template>
                <template v-slot:item.stageOneResults="{ item }">
                  <v-btn
                    small
                    icon
                    color="primary"
                    :disabled="
                      findResult(item, 'LOI4OST_SP') == '- -' ||
                        !user ||
                        findResult(item, 'LOI440A_SP') == 'Y'
                    "
                    @click="stageSelected(item, 'stageOne')"
                  >
                    <v-icon>mdi-test-tube</v-icon>
                  </v-btn>
                </template>

                <template v-slot:item.crucibleNumber="{ item }">
                  {{
                  findResult(item, 'LOICNO4_SP')
                  }}
                </template>
                <template v-slot:item.crucibleWeight="{ item }">
                  {{
                  findResult(item, 'LOIC4_SP')
                  }}
                </template>
                <template v-slot:item.cruciblePlusSampleWeight="{ item }">
                  {{
                  findResult(item, 'LOICPS4_SP')
                  }}
                </template>
                <template v-slot:item.stageTwoResults="{ item }">
                  <v-btn
                    small
                    icon
                    color="primary"
                    @click="stageSelected(item, 'stageTwo')"
                    :disabled="!user"
                  >
                    <v-icon>mdi-test-tube</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item.postOneEightyOvenWeight="{ item }">
                  {{
                  findResult(item, 'LOICS4_SP')
                  }}
                </template>
                <template v-slot:item.stageThreeResults="{ item }">
                  <v-btn
                    small
                    icon
                    color="primary"
                    @click="stageSelected(item, 'stageThree')"
                    :disabled="!user"
                  >
                    <v-icon>mdi-test-tube</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item.postIgnitionWeight="{ item }">
                  {{
                  findResult(item, 'LOIDRY4_SP')
                  }}
                </template>
                <template v-slot:item.stageFourResults="{ item }">
                  <v-btn
                    small
                    icon
                    color="primary"
                    @click="stageSelected(item, 'stageFour')"
                    :disabled="!user"
                  >
                    <v-icon>mdi-test-tube</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-dialog v-model="resultsDialog" width="500" persistent>
          <v-card outlined>
            <v-card-title>Test</v-card-title>
            <v-card-text v-if="resultsDialog">
              <v-row v-for="det in selectedStage.dets" :key="det.det">
                <v-col>
                  <template v-if="det.type">
                    <v-select
                      dense
                      outlined
                      :items="availableCrucibles"
                      v-model="det.value"
                      :label="det.label"
                    ></v-select>
                  </template>
                  <template v-else>
                    <v-text-field
                      dense
                      outlined
                      :label="det.label"
                      :ref="det.ref"
                      :suffix="!det.suffix ? 'g' : det.suffix"
                      :autofocus="det.autofocus"
                      v-model="det.value"
                      @keyup.enter="det.nextRef ? setFocus(det.nextRef) : ''"
                    ></v-text-field>
                  </template>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="resultsDialog = !resultsDialog">Cancel</v-btn>
              <v-spacer />
              <v-btn color="primary" @click="saveResults">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="qcDialog" width="500">
          <v-card outlined>
            <v-card-title>QC Sample</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    label="Crucible Weight"
                    v-model="qcResults.crucibleWeight"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    label="Crucible + 180°C Dried Sample"
                    v-model="qcResults.postOneEightyWeight"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    label="Post Ignition Weight"
                    v-model="qcResults.postIgnitionWeight"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    label="Percentage Lost"
                    :value="qcPercentageLost"
                    suffix="%"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      user: "",
      loading: true,
      crucibles: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25
      ],
      backlog: [],
      backlogTable: {
        headers: [
          { text: "Sample", value: "SAMPNUM" },
          { text: "Job", value: "JOB" },
          { text: "Client", value: "client" },
          { text: "Due Date", value: "OFFICEDATE", divider: true },
          { text: "Sample Wt", value: "sampleWeight", sortable: false },
          { text: "Subsample Wt", value: "subsampleWeight", sortable: false },
          { text: ">20mm Wt", value: "plusTwentymmWeight", sortable: false },
          {
            text: "",
            value: "stageOneResults",
            sortable: false,
            divider: true,
            width: 10
          },
          { text: "Crucible No.", value: "crucibleNumber", sortable: false },
          { text: "Crucible Wt.", value: "crucibleWeight", sortable: false },
          {
            text: "Crucible + Samp Wt.",
            value: "cruciblePlusSampleWeight",
            sortable: false
          },
          {
            text: "",
            value: "stageTwoResults",
            sortable: false,
            divider: true,
            width: 10
          },
          {
            text: "Post 180° Wt",
            value: "postOneEightyOvenWeight",
            sortable: false
          },
          {
            text: "",
            value: "stageThreeResults",
            sortable: false,
            divider: true,
            width: 10
          },
          {
            text: "Post Ignition Wt",
            value: "postIgnitionWeight",
            sortable: false
          },
          {
            text: "",
            value: "stageFourResults",
            sortable: false,
            divider: true,
            width: 10
          }
        ]
      },
      selectedSample: {},
      selectedStage: {},
      resultsDialog: false,
      qcDialog: false,
      qcResults: {
        crucibleWeight: "",
        postOneEightyWeight: "",
        postIgnitionWeight: ""
      },
      stages: {
        stageOne: {
          dets: [
            {
              det: "LOI4OST_SP",
              label: "Original Sample Weight",
              ref: "weight1",
              autofocus: true,
              nextRef: "weight2",
              value: ""
            },
            {
              det: "LOI4OSS_SP",
              label: "Sub-Sample Weight",
              ref: "weight2",
              nextRef: "weight3",
              value: ""
            },
            {
              det: "LOI4OS2_SP",
              label: ">20mm Sample Weight",
              ref: "weight3",
              value: ""
            }
          ]
        },
        stageTwo: {
          prepDet: { det: "LOI440A_SP", label: "LOI First Stage Prep" },
          dets: [
            {
              det: "LOICNO4_SP",
              label: "Crucible No.",
              ref: "weight1",
              autofocus: true,
              nextRef: "weight2",
              value: "",
              suffix: " - "
            },
            {
              det: "LOIC4_SP",
              label: "Crucible Weight",
              ref: "weight2",
              autofocus: true,
              nextRef: "weight3",
              value: ""
            },
            {
              det: "LOICPS4_SP",
              label: "Crucible + Sample Weight",
              ref: "weight3",
              value: ""
            }
          ]
        },
        stageThree: {
          prepDet: { det: "LOI440B_SP", label: "LOI Second Stage Prep" },
          dets: [
            {
              det: "LOICS4_SP",
              label: "Post 180 Sample Weight",
              ref: "weight1",
              autofocus: true,
              value: ""
            }
          ]
        },
        stageFour: {
          dets: [
            {
              det: "LOIDRY4_SP",
              label: "Post Ignition Sample Weight",
              ref: "weight1",
              autofocus: true,
              value: ""
            }
          ]
        }
      },
      stageOneDialog: false
    };
  },
  mounted() {
    this.getUsers();
    this.getBacklog();
  },
  computed: {
    pendingResults() {
      if (this.$store.state.results.results.length > 0) {
        var results = this._.find(this.$store.state.results.results, {
          method: "LOI 440"
        });
        return results.results;
      }
    },
    availableCrucibles() {
      var crucibles = this.crucibles;
      this.backlog.forEach(sample => {
        var crucible = this._.find(sample.results, {
          DET: "LOICNO4_SP"
        });
        if (crucible) {
          var i = crucibles.indexOf(parseInt(crucible.OUTPUT));
          if (i > -1) {
            crucibles.splice(i, 1);
          }
        }
        var pending = this._.find(this.pendingResults, {
          det: "LOICNO4_SP",
          sampnum: sample.SAMPNUM
        });
        if (pending) {
          var i = crucibles.indexOf(parseInt(pending.value));
          if (i > -1) {
            crucibles.splice(i, 1);
          }
        }
      });
      return crucibles;
    },
    qcPercentageLost() {
      if (this.qcDialog) {
        return (
          ((parseFloat(this.qcResults.postOneEightyWeight) -
            parseFloat(this.qcResults.postIgnitionWeight)) /
            (parseFloat(this.qcResults.postOneEightyWeight) -
              parseFloat(this.qcResults.crucibleWeight))) *
          100
        ).toFixed(2);
      }
      return "";
    }
  },
  methods: {
    getUsers() {
      this.$axios.get("users/section/INORGANICS").then(response => {
        this.users = response.data.data;
      });
    },
    getBacklog() {
      this.$axios.get("backlogs/73?results=1").then(response => {
        this.backlog = response.data.data;
        this.loading = false;
      });
    },

    findResult(sample, det) {
      //Check if any results pending export to AIS
      var pending = this._.find(this.pendingResults, {
        det: det,
        sampnum: sample.SAMPNUM
      });

      if (pending) {
        return pending.value;
      }

      //Check if work record still exists
      if (
        this._.find(sample.work, {
          DET: det
        })
      ) {
        return "";
      }

      //Check if results record exists
      var result = this._.find(sample.results, {
        DET: det
      });
      if (result) {
        return result.OUTPUT;
      }

      //Return - if result not needed
      return "- -";
    },

    stageSelected(sample, stage) {
      this.selectedSample = sample;
      this.selectedStage = JSON.parse(JSON.stringify(this.stages[stage]));
      this.resultsDialog = true;
    },

    saveResults() {
      var results = [];
      this.selectedStage.dets.forEach(det => {
        results.push({
          sampnum: this.selectedSample.SAMPNUM,
          user: this.user,
          date: this.$moment().format("YYYY-MM-DD"),
          time: this.$moment().format("HHmm"),
          det: det.det,
          name: det.label,
          value: det.value
        });
      });
      if (this.selectedStage.prepDet) {
        results.push({
          sampnum: this.selectedSample.SAMPNUM,
          user: this.user,
          date: this.$moment().format("YYYY-MM-DD"),
          time: this.$moment().format("HHmm"),
          det: this.selectedStage.prepDet.det,
          name: this.selectedStage.prepDet.label,
          value: "Y"
        });
      }
      this.$store.dispatch("results/addResult", {
        method: "LOI 440",
        filePrefix: "LOI440",
        results: results
      });
      this.selectedStage = {};
      this.resultsDialog = false;
    },
    setFocus(nextRef) {
      this.$refs[nextRef][0].focus();
    }
  }
};
</script>

<style></style>
