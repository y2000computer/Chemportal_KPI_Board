<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row no-gutters justify="space-between">
            <v-col md="4" sm="4" cols="12"> Rapid Moisture</v-col>
            <v-col md="3" sm="4" cols="12">
              <v-select
                outlined
                hide-details
                dense
                label="User"
                v-model="user"
                :items="users"
                item-text="USER_NAME"
                item-value="USER_ID"
            /></v-col>
            <v-col md="3" sm="4" cols="12">
              <v-select
                outlined
                hide-details
                dense
                label="Printer"
                v-model="printer"
                :items="printers"
                @change="updatePrinter"
                item-value="PRNTERNAME"
                item-text="PRNTERNAME"
            /></v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row justify="space-between">
            <v-col md="3" sm="10" cols="12">
              <sample-scan-form
                ref="sampleScanForm"
                @sampleFound="sampleFound"
                @sampleReset="nextSample"
                :disabled="!user"
              />
            </v-col>
            <v-col md="3" sm="10" cols="12">
              <v-card flat>
                <v-card-title>Wet Weights</v-card-title>
                <v-card-text>
                  <v-form :disabled="!user || !sample.SAMPNUM">
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          ref="trayWeight"
                          label="Tray Weight"
                          hide-details
                          suffix="g"
                          v-model="trayWeight"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          outlined
                          dense
                          hide-details
                          v-model="weights.wetWeight.value"
                          label="Wet Weight"
                          ref="wetWeight"
                          suffix="g"
                          @keyup.enter="addWetWeightResult"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="3" sm="12" cols="12">
              <v-card flat>
                <v-card-title>Dry Weight</v-card-title>
                <v-card-text>
                  <v-form :disabled="!user && !sample" @submit.prevent>
                    <v-row>
                      <v-col>
                        <v-text-field
                          dense
                          outlined
                          hide-details
                          label="Dry Weight"
                          ref="dryWeight"
                          suffix="g"
                          v-model="weights.dryWeight.value"
                          v-validate="{ rules: 'max_value:750' }"
                          name="Dry Weight"
                          :error-messages="errors.first('Dry Weight')"
                          @keyup.enter="addDryWeightResult"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text> </v-card
            ></v-col>
            <v-col md="2" sm="10" cols="12">
              <v-card flat>
                <v-card-title>Actions</v-card-title>
                <v-card-text class="text-center">
                  <v-row>
                    <v-col>
                      <v-text-field
                        dense
                        outlined
                        readonly
                        label="Moisture"
                        name="Moisture"
                        v-validate="'min_value:0|max_value:60'"
                        suffix="%"
                        :value="moistureResult"
                        :error-messages="errors.first('Moisture')"
                      ></v-text-field>

                      <v-btn
                        x-large
                        class="text-center"
                        color="primary"
                        :disabled="!sample.SAMPNUM"
                        @click="nextSample"
                        >Reset</v-btn
                      >
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
import sampleScanForm from '../../../components/sample/sample_scan';
export default {
  components: {
    sampleScanForm,
  },
  data() {
    return {
      users: [],
      user: '',
      printers: [],
      printer: '',
      sample: {},
      completeDialog: false,
      trayWeight: '5',
      weights: {
        wetWeight: {
          det: 'RAPMOIW_SP',
          value: '',
        },
        dryWeight: {
          det: 'RAPMOID_SP',
          value: '',
        },
      },
      printData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'RapidMoisture.csv',
        csvHeaders: [
          'JOB',
          'SAMPNUM',
          'CONTAINER',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
        ],
        csvRows: [],
      },
    };
  },
  mounted() {
    this.getUsers();
    this.printer = localStorage.getItem('chemportalLabelPrinter');
    this.getPrinters();
  },
  computed: {
    pendingResults() {
      if (this.$store.state.results.results.length > 0) {
        var results = this._.find(this.$store.state.results.results, {
          method: 'Rapid Moisture',
        });
        return results.results;
      }
    },
    moistureResult() {
      if (
        this.trayWeight &&
        this.weights.wetWeight.value &&
        this.weights.dryWeight.value
      ) {
        return (
          100 *
          ((parseFloat(this.weights.wetWeight.value) -
            parseFloat(this.weights.dryWeight.value)) /
            (parseFloat(this.weights.wetWeight.value) -
              parseFloat(this.trayWeight)))
        ).toFixed(1);
      } else {
        return 'Not Complete';
      }
    },
  },

  methods: {
    getPrinters() {
      this.$axios.get('printers').then((response) => {
        this.printers = response.data.data;
      });
    },
    getUsers() {
      this.$axios.get('users/section/PREP').then((response) => {
        this.users = response.data.data;
      });
    },
    sampleFound(sample) {
      this.sample = sample;
      if (this.sample.SAMPNUM) {
        this.checkPendingResults();
        if (this.findResult(sample.SAMPNUM, 'RAPMOIW_SP')) {
          this.setFocus('dryWeight');
        } else if (this.findResult(sample.SAMPNUM, 'RAPMOID_SP')) {
          this.completeDialog = true;
        } else {
          this.setFocus('wetWeight');
          this.printLabel();
        }
      }
    },
    printLabel() {
      this.printData.csvRows.push([
        this.sample.JOB,
        this.sample.SAMPNUM,
        'Rapid Moisture Tray',
        'NM_CONTAINER_LABEL_NEW.BTW',
        this.$store.state.printer.printer,
      ]);
      //return;
      this.$axios.post('labels/print', this.printData).then(() => {
        this.$store.dispatch('snackbar/showSnackbar', 'Sent To Printer');
        this.printData.csvRows = [];
      });
    },

    checkPendingResults() {
      Object.keys(this.weights).forEach((key) => {
        var pendingResult = this.findResult(
          this.sample.SAMPNUM,
          this.weights[key].det
        );
        this.weights[key].value = pendingResult
          ? pendingResult
          : this.weights[key].value;
      });
    },

    addWetWeightResult() {
      this.$validator.validateAll();
      this.$store.dispatch('results/addResult', {
        method: 'Rapid Moisture',
        filePrefix: 'rapidMoisture',
        results: [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'RAPMOIT_SP',
            name: 'Tray Weight',
            value: this.trayWeight,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'RAPMOIW_SP',
            name: 'Wet Weight',
            value: this.weights.wetWeight.value,
          },
        ],
      });
      this.nextSample();
    },
    addDryWeightResult() {
      this.$store.dispatch('results/addResult', {
        method: 'Rapid Moisture',
        filePrefix: 'rapidMoisture',
        results: [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'RAPMOID_SP',
            name: 'Dry Weight',
            value: this.weights.dryWeight.value,
          },
        ],
      });
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('results/addResult', {
            method: 'Rapid Moisture',
            filePrefix: 'rapidMoisture',
            results: [
              {
                sampnum: this.sample.SAMPNUM,
                user: this.user,
                date: this.$moment().format('YYYY-MM-DD'),
                time: this.$moment().format('HHmm'),
                det: 'RAPMOI_SP',
                name: 'Moisture',
                value: this.moistureResult,
              },
            ],
          });
          this.nextSample();
        }
      });
    },

    findResult(sample, det) {
      var pending = this._.find(this.pendingResults, {
        det: det,
        sampnum: sample,
      });
      if (pending) {
        return pending.value;
      }

      return '';
    },

    updatePrinter() {
      this.$store.dispatch('printer/setPrinter', this.printer);
    },

    setFocus(ref) {
      this.$nextTick(() => {
        this.$refs[ref].focus();
      });
    },

    nextSample() {
      Object.keys(this.weights).forEach((key) => {
        this.weights[key].value = '';
      });
      this.sample = {};
      this.$refs.sampleScanForm.resetSample();
      this.$validator.reset();
    },
  },
};
</script>

<style></style>
