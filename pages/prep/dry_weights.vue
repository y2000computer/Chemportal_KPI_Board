<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row justify="space-between">
            <v-col md="6">Dry Weights</v-col>
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
          <v-row justify="space-between">
            <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Sample"
                v-model="search"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="getSample"
                ref="search"
                :loading="sampleLoading"
              ></v-text-field>
            </v-col>
            <v-col md="8" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Sample</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Sample:</v-col>
                                <v-col class="font-weight-medium">
                                  {{ sample.SAMPNUM }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Job:</v-col>
                                <v-col class="font-weight-medium">
                                  {{ sample.JOB }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Client:</v-col>
                                <v-col class="font-weight-medium">
                                  {{
                                    sample.job
                                      ? sample.job.office.client.CLIENTNAME
                                      : ''
                                  }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="space-between">
            <v-col md="3" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Dry Weight</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        dense
                        outlined
                        label="Dry Weight"
                        suffix="g"
                        ref="moisture1"
                        v-model="dryWeight"
                        v-validate="{ rules: 'max_value:750' }"
                        name="Dry Weight"
                        :error-messages="errors.first('Dry Weight')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Sample Tray</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        v-model="sampleTray"
                        label="Tray No."
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Moisture Results</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        label="Tray Weight"
                        :value="trayWeight"
                        suffix="g"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        label="Wet Weight"
                        :value="wetWeight"
                        suffix="g"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <!-- <v-alert color="tableWarnings" class="font-weight-bold">{{moistureCalc}}</v-alert> -->
                      <v-text-field
                        label="Moisture Result"
                        readonly
                        outlined
                        :value="moistureCalc"
                        class="font-weight-bold"
                        suffix="%"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-alert
                        v-if="!validMoist"
                        color="tableWarnings"
                        class="font-weight-bold"
                      >
                        {{
                          moistureCalc > 100
                            ? "Moisture can't be greater than 100"
                            : "Dry weight can't be greater than Wet Weight"
                        }}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Actions</v-card-title>
                <v-card-text>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn
                        x-large
                        color="primary"
                        @click="addToTray"
                        :disabled="sendDisabled"
                      >
                        Send
                        <v-icon class="ml-2">mdi-database-import</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn @click="resetForm">
                        Reset
                        <v-icon class="ml-2">mdi-cancel</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn @click="printLabel" disabled>
                        Print Label
                        <v-icon class="ml-2">mdi-printer</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
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
      users: [],
      user: '',
      search: '',
      sampleLoading: false,
      sample: [],
      sampleTray: '',
      testChecks: [
        {
          name: 'Organics',
          tests: ['THP_SZ', 'TPHAA_SZ', 'VOC_SZ', 'PHOH_SZ'],
          sampReq: false,
          jobReq: false,
        },
        {
          name: 'Asbestos',
          tests: ['ASB_SZ', 'ASB_WZ', 'ASB_AZ'],
          sampReq: false,
          jobReq: false,
        },
        {
          name: 'CEN',
          tests: ['CEN_1P', 'CEN_2P', 'CEN_8P'],
          sampReq: false,
          jobReq: false,
        },
        { name: 'NRA', tests: ['NRA_SP'], sampReq: false, jobReq: false },
      ],
      moistReq: false,
      soilDescReq: false,
      dryWeight: '',
    };
  },
  computed: {
    wetWeightComplete() {
      if (this.sample.SAMPNUM) {
        var wet = this._.find(this.sample.results, (o) => {
          return o.DET == 'MOITSS_SP';
        });
        if (!wet) {
          return false;
        }
        return true;
      }
    },
    sendDisabled() {
      if (
        !this.user ||
        !this.validMoist ||
        !this.sampleTray ||
        !this.dryWeight
      ) {
        return true;
      }
      return false;
    },
    trayWeight() {
      if (this.sample.SAMPNUM && this.wetWeightComplete) {
        var trayWeight = this._.find(this.sample.results, (o) => {
          return o.DET == 'MOIT_SP';
        });
        return trayWeight.OUTPUT;
      } else {
        return 'Not Complete';
      }
    },
    wetWeight() {
      if (this.sample.SAMPNUM && this.wetWeightComplete) {
        var wetWeight = this._.find(this.sample.results, (o) => {
          return o.DET == 'MOITSS_SP';
        });
        return wetWeight.OUTPUT;
      }
      return 'Not Complete';
    },
    moistureCalc() {
      if (this.sample.SAMPNUM && this.wetWeightComplete && this.dryWeight) {
        return (
          100 *
          ((parseFloat(this.wetWeight) - parseFloat(this.dryWeight)) /
            (parseFloat(this.wetWeight) - parseFloat(this.trayWeight)))
        ).toFixed(1);
      } else {
        return 'Not Complete';
      }
    },
    validMoist() {
      if (this.sample.SAMPNUM && this.wetWeightComplete) {
        if (this.moistureCalc < 0.001) {
          return false;
        }
        if (this.moistureCalc > 100) {
          return false;
        }
      }
      return true;
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.$axios.get('users/section/PREP').then((response) => {
        this.users = response.data.data;
      });
    },
    getSample() {
      this.sample = [];
      this.sampleLoading = true;
      this.soilDescReq = false;
      this.$axios.get('samples/' + this.search).then((response) => {
        this.sample = response.data.data;
        this.sampleLoading = false;
        this.search = '';

        this.setFocus('moisture1');
      });
    },
    addToTray() {
      this.$axios
        .post('dried-sample-trays', {
          sampnum: this.sample.SAMPNUM,
          tray: this.sampleTray,
        })
        .then((response) => {
          this.addResults();
        });
    },
    addResults() {
      this.$store.dispatch('results/addResult', {
        method: 'Dry Weights',
        filePrefix: 'MOISTUREDRY',
        results: [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'MOIDRY_SP',
            name: 'Dry Weight',
            value: this.dryWeight,
          },
        ],
      });
      this.resetForm();
    },
    setFocus(ref) {
      this.$refs[ref].focus();
    },
    resetForm() {
      this.search = '';
      this.sample = [];
      this.dryWeight = '';
      this.setFocus('search');
    },
    printLabel() {
      console.log('Print Here');
    },
  },
};
</script>

<style></style>
