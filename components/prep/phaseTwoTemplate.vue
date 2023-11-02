<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>{{ title }}</v-card-title
        ><v-card-text>
          <v-row>
            <!-- <v-col
              ><sample-scan-form
                :disabled="!$store.state.printer.printer"
                @sampleFound="sampleFound"
                @sampleReset="resetForm"
                ref="sampleScanForm"
            /></v-col> -->
            <v-col
              ><prepped-trays-card :trayType="2" @traySelected="traySelected"
            /></v-col>
            <!-- <v-col><prepped-tray-contents-card :id="selectedTray.STRAYID"/></v-col> -->
            <!-- <v-col
              ><prepped-sample-tray-card
                ref="preppedSampleTrayCard"
                :defaultTrayType="trayType"
                :printLabel="printLabel"
            /></v-col> -->
            <!-- <v-col
              >{{ sample.work }}<v-btn @click="resetForm"></v-btn
            ></v-col>  -->
          </v-row></v-card-text
        ></v-card
      ></v-col
    >
    <v-dialog v-model="notRequiredDialog" persistent width="600"
      ><v-card>
        <v-card-title></v-card-title>
        <v-card-text class="text-h4">Testing Not Required</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="resetForm">Ok</v-btn>
        </v-card-actions>
      </v-card></v-dialog
    ></v-row
  >
</template>

<script>
import sampleScanForm from '../sample/sample_scan';
import preppedSampleTrayCard from '../preppedSampleTrays/preppedSampleTrayCard';
import preppedTraysCard from '../preppedSampleTrays/preppedTraysCard';
import preppedTrayContentsCard from '../preppedSampleTrays/preppedTrayContentsCard';
export default {
  components: {
    sampleScanForm,
    preppedSampleTrayCard,
    preppedTraysCard,
    preppedTrayContentsCard,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    method: {
      type: Object,
      required: true,
    },
    prepCodes: {
      type: Array,
      required: true,
    },
    autoNextSample: {
      type: Boolean,
      default: false,
    },
    trayType: {
      type: String,
      required: false,
    },
    printLabel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sample: {},
      notRequiredDialog: false,
    };
  },
  methods: {
    sampleFound(sample) {
      this.sample = sample;
      if (!this.checkRequired()) {
        this.notRequiredDialog = true;
        return;
      }
      this.$refs.preppedSampleTrayCard.addContainer(sample.SAMPNUM);
      if (this.autoNextSample) {
        this.addResults();
      }
    },
    checkRequired() {
      var prepCodes = this.prepCodes.map((p) => {
        return p.det;
      });
      var required = this._.filter(this.sample.work, function(det) {
        return prepCodes.includes(det.DET);
      });
      if (required.length > 0) {
        return true;
      }
      return false;
    },
    addResults() {
      this.$store.dispatch('results/addResult', {
        method: this.method.name,
        filePrefix: this.method.filePrefix,
        results: this.prepCodes.map((prep) => {
          return {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: prep.det,
            name: prep.name,
            value: prep.value,
          };
        }),
      });
    },
    resetForm() {
      this.sample = {};
      this.notRequiredDialog = false;
      this.$refs.sampleScanForm.resetSample();
    },
    traySelected(e) {
      console.log(e, 'hi');
      this.selectedTray;
    },
  },
};
</script>

<style></style>
