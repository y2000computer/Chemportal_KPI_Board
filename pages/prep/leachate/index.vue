<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar dense flat>
          <v-toolbar-title class="font-weight-medium">
            Leachate Preperation</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-tabs grow>
            <v-tab>Leachate Results</v-tab>
            <v-tab>Label Printing</v-tab>
            <v-tab>Bottle Storage</v-tab>
            <v-tab-item class="pa-4">
              <initial-weights />
            </v-tab-item>
            <v-tab-item class="pa-4">
              <label-print />
            </v-tab-item>
            <v-tab-item class="pa-4">
              <bottle-storage />
            </v-tab-item>
          </v-tabs>
          <!-- <v-row>
            <v-col
              ><sample-scan-form
                ref="sampleScanForm"
                @sampleFound="sampleFound"
                @sampleReset="resetForm"
                :disabled="!$store.state.printer.printer || sample.SAMPNUM"
            /></v-col>
            <v-col
              ><v-card flat
                ><v-card-title>Leachate Details</v-card-title
                ><v-card-text>
                  <v-row
                    ><v-col>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        label="Leachate Type"
                        :value="leachateType"/></v-col
                  ></v-row>
                  <v-row
                    ><v-col>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        label="Mass of Soil"
                        :value="soilMass"
                        suffix="g of Soil"/></v-col
                  ></v-row>
                  <v-row dense><v-col class="text-center">into</v-col></v-row>
                  <v-row
                    ><v-col>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        label="Volume of Water"
                        :value="waterVol"
                        suffix="ml of Water"/></v-col
                  ></v-row> </v-card-text></v-card
            ></v-col>
            <v-col>
              <v-card flat
                ><v-card-title>Leachate Volume</v-card-title
                ><v-card-text>
                  <v-row
                    ><v-col
                      ><v-text-field
                        :disabled="
                          leachateType != '2/8:1' || cEightRound != '2'
                        "
                        label="C2 Filtered Weight"
                        outlined
                        dense
                        suffix="g"
                        v-model="cTwoVolume"
                      >
                      </v-text-field></v-col></v-row></v-card-text
              ></v-card>
            </v-col>
            <v-col
              ><v-card flat
                ><v-card-title>Actions</v-card-title
                ><v-card-text
                  ><v-row
                    ><v-col
                      ><v-btn
                        color="primary"
                        large
                        @click="setResults"
                        :disabled="!sample.SAMPNUM"
                        >Send Results</v-btn
                      ></v-col
                    ></v-row
                  ><v-row
                    ><v-col
                      ><v-btn @click="resetForm">Cancel</v-btn></v-col
                    ></v-row
                  >{{ cEightRound }}</v-card-text
                ></v-card
              ></v-col
            >
          </v-row> -->
        </v-card-text></v-card
      ></v-col
    ></v-row
  >
</template>

<script>
import sampleScanForm from '../../../components/sample/sample_scan';
import initialWeights from './components/initial_weights';
import bottleStorage from './components/bottle_storage';
import labelPrint from './components/label_print.vue';
export default {
  components: {
    sampleScanForm,
    initialWeights,
    bottleStorage,
    labelPrint,
  },
  data() {
    return {
      sample: {},
      leachateType: '',
      cEightRound: null,
      soilMass: '',
      waterVol: '',
      cTwoVolume: '',
      printData: {
        path: '\\\\nm-web01\\Labels$\\',
        filename: 'leachate_label.csv',
        csvHeaders: [
          'JOB',
          'SAMPNUM',
          'DETAILS1',
          'DETAILS2',
          'LABEL_PRINTER',
          'LABEL_FORMAT',
        ],
        csvRows: [],
      },
    };
  },
  methods: {
    sampleFound(sample) {
      this.sample = sample;
      this.getLeachateType();
      if (this.leachateType == 'N/A') {
        return;
      }
      this.setLeachateValues();
      this.printLabel();
    },
    getResult(det) {
      var result = this._.find(this.sample.results, {
        DET: det,
      });
      if (result) {
        return result;
      }
      var work = this._.find(this.sample.work, {
        DET: det,
      });
      if (work) {
        return work;
      }
      return null;
    },
    getLeachateType() {
      if (this.getResult('CEN_8P')) {
        this.leachateType = '2/8:1';
        this.cEightRound = this.cEightCheck();
        return;
      }
      if (this.getResult('CEN_2P')) {
        this.leachateType = '2:1 Only';
        return;
      }
      if (this.getResult('CEN_1P')) {
        this.leachateType = '10:1';
        return;
      }
      this.leachateType = 'N/A';
    },
    cEightCheck() {
      if (this.getResult('CEN_2P').INPUT) {
        return '2';
      }
      console.log(this.getResult('CEN_2P'));
      return '1';
    },
    setLeachateValues() {
      this.soilMass = parseFloat(this.getResult('UMA_SP').OUTPUT) * 1000;
      this.waterVol = this.getResult('VC_1P')
        ? Math.round((parseFloat(this.getResult('VC_1P').OUTPUT) * 1000) / 10) *
          10
        : Math.round((parseFloat(this.getResult('VC_2P').OUTPUT) * 1000) / 10) *
          10;
    },
    setResults() {
      var results = this.getResults();
      this.$store.dispatch('results/addResult', {
        method: 'Leachate Prep',
        filePrefix: 'LeachatePrep',
        results: results,
      });
      this.resetForm();
    },
    getResults() {
      if (this.leachateType == '10:1') {
        return [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'CEN_1P',
            name: 'CEN Prep',
            value: 'Y',
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'CEN_1',
            name: 'CEN Prep',
            value: 'Y',
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'VELU_1P',
            name: 'CEN Prep',
            value: '0.900',
          },
        ];
      }
      if (this.leachateType == '2:1 Only') {
        return [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'VELU_2P',
            name: 'CEN Prep',
            value: '0.2501',
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'CEN_2P',
            name: 'CEN Prep',
            value: 'Y',
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'CEN_2',
            name: 'CEN Prep',
            value: 'Y',
          },
        ];
      }
      if (this.leachateType == '2/8:1' && this.cEightRound == '1') {
        return [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'CEN_2P',
            name: 'CEN Prep',
            value: 'Y',
          },
        ];
      }
      if (this.leachateType == '2/8:1' && this.cEightRound == '2') {
        return [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'CEN_8P',
            name: 'CEN Prep',
            value: 'Y',
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'VELU_2P',
            name: 'Volume of C2 Leachate',
            value: this.cTwoVolume,
          },
        ];
      }
    },
    printLabel() {
      this.printData.csvRows.push([
        this.sample.JOB,
        this.sample.SAMPNUM,
        this.leachateType,
        this.soilMass + 'g in ' + this.waterVol + 'ml',
        localStorage.getItem('chemportalLabelPrinter'),
        'NM_LEACHATE_LABEL.btw',
      ]);
      this.$axios.post('labels/print', this.printData).then((response) => {
        this.printData.csvRows = [];
      });
    },
    sendCenTwoWeight() {
      this.$store.dispatch('results/addResult', {
        method: 'Leachate Prep',
        filePrefix: 'LeachatePrep',
        results: [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'VELU_2P',
            name: 'Volume of C2 Leachate',
            value: this.cTwoVolume,
          },
        ],
      });
    },
    resetForm() {
      this.sample = {};
      this.waterVol = '';
      this.soilMass = '';
      this.cTwoVolume = '';
      this.leachateType = 'N/A';
      this.$refs.sampleScanForm.resetSample();
    },
  },
};
</script>

<style></style>
