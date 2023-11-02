<template>
  <v-row>
    <v-col>
      <sample-scan-form
        ref="sampleScanForm"
        @sampleFound="sampleFound"
        @sampleReset="resetForm"
        :disabled="
          !$store.state.printer.printer || Number.isInteger(sample.SAMPNUM)
        "
      />
    </v-col>
    <v-col>{{ leachateTypes }} </v-col>
    <v-col> </v-col>
  </v-row>
</template>

<script>
import sampleScanForm from '../../../../components/sample/sample_scan';
export default {
  components: {
    sampleScanForm,
  },
  data() {
    return {
      sample: {},
      leachateCounts: 0,
      leachateTypes: {
        cen10: {
          req: false,
          subtype: 10,
        },
        cen2: {
          req: false,
          subtype: 2,
        },
        cen8: {
          req: false,
          subtype: 8,
        },
        cenNRA: {
          req: false,
          subtype: 'N',
        },
      },
      printContainerData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'TestP2.csv',
        csvHeaders: [
          'TRAY',
          'LOGDATE',
          'SAMPNUM',
          'JOB',
          'DETAILS1',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
        ],
        //csvRows: [],
      },
    };
  },
  methods: {
    sampleFound(sample) {
      this.sample = sample;
      this.setLeachateType();
      if (this.leachateType == 'N/A') {
        return;
      }
      this.addContainers();
    },
    setLeachateType() {
      let array = [...this.sample.work, ...this.sample.results];
      this.leachateTypes.cen10.req = false;
      this.leachateTypes.cen2.req = false;
      this.leachateTypes.cen8.req = false;
      this.leachateTypes.cenNRA.req = false;
      this.leachateCounts = 0;
      array.forEach((det) => {
        if (det.DET == 'CEN_8P') {
          this.leachateTypes.cen8.req = true;
          this.leachateCounts++;
        } else if (det.DET == 'CEN_2P') {
          this.leachateTypes.cen2.req = true;
          this.leachateCounts++;
        } else if (det.DET == 'CEN_1P') {
          this.leachateTypes.cen10.req = true;
          this.leachateCounts++;
        }
      });
    },
    async addContainers() {
      Object.keys(this.leachateTypes).forEach((type) => {
        if (this.leachateTypes[type].req) {
          this.$axios
            .post('container-sample-check', {
              sampnum: this.sample.SAMPNUM,
              subtype: this.leachateTypes[type].subtype,
            })
            .then((res) => {
              this.printContainerLabel(res.data.data);
            });
        }
      });
    },
    printContainerLabel(container) {
      let csvRows = [];
      csvRows.push([
        container.STRAYCNTID,
        container.ADDDATE,
        container.SAMPNUM + ' - ' + container.SUBTYPE + ':1',
        container.sample ? container.sample.JOB : '',
        'Leachate Bottle',
        'NM_PREPPED_SAMPLE_CONTAINER.BTW',
        this.$store.state.printer.printer,
      ]);

      this.$axios
        .post('labels/print', {
          ...this.printContainerData,
          csvRows: csvRows,
        })
        .then(() => {
          //this.printContainerData.csvRows = [];
        });
    },
    resetForm() {
      this.sample = {};
      this.$refs.sampleScanForm.resetSample();
    },
  },
};
</script>

<style></style>
