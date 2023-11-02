<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          Sample Preps

          <v-spacer />
          <v-btn color="primary" @click="trayPrintDialog = !trayPrintDialog"
            >Tray Labels<v-icon class="ml-2">mdi-printer</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-row justify="space-between">
            <v-col md="3" sm="10" cols="12">
              <sampleScanForm
                ref="sampleScan"
                @sampleFound="sampleFound"
                @sampleReset="resetForm"
                :moreDets="true"
                :disabled="searchDisabled"
                :errorMessage="
                  $store.state.printer.printer ? '' : 'Please Select A Printer'
                "
              />
            </v-col>
            <v-col>
              <v-card flat>
                <v-card-title>Required Preps</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="group in groupedPreps"
                      :key="'group' + group.group"
                      md="3"
                      sm="6"
                      cols="10"
                    >
                      <v-list>
                        <v-list-item style="min-height:24px">
                          <v-list-item-content
                            class="font-weight-bold text--caption"
                          >
                            <v-list-item-title
                              >Tray {{ group.group }}</v-list-item-title
                            >
                          </v-list-item-content>
                        </v-list-item>
                        <template v-for="prep in group.preps">
                          <v-list-item
                            style="min-height:24px"
                            :disabled="!prep.required"
                            :key="'prep' + prep.label"
                          >
                            <v-list-item-content>
                              <v-list-item-title class="font-weight-medium"
                                >{{ prep.label }}
                                <span class="text-body-2"
                                  >({{ prep.weight }}g)</span
                                ></v-list-item-title
                              >
                            </v-list-item-content>
                            <v-list-item-avatar size="20" class="ma-0">
                              <v-avatar
                                :color="prep.required ? 'primary' : ''"
                              ></v-avatar>
                            </v-list-item-avatar>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-col>

                    <v-col>
                      <v-list>
                        <v-list-item style="min-height:24px">
                          <v-list-item-content
                            class="font-weight-bold text--caption"
                          >
                            <v-list-item-title>Tray 10</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          :disabled="
                            !sample.SAMPNUM ||
                              (requiredPreps.length > 0 && sample.SAMPNUM)
                          "
                        >
                          <v-list-item-content>
                            <v-list-item-title class="text-h5"
                              >Grinding Only</v-list-item-title
                            >
                          </v-list-item-content>
                          <v-list-item-avatar size="20">
                            <v-avatar
                              :color="
                                requiredPreps.length == 0 && sample.SAMPNUM
                                  ? 'primary'
                                  : ''
                              "
                            ></v-avatar
                          ></v-list-item-avatar>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="trayPrintDialog" width="700">
      <v-card outlined>
        <v-card-title>Print Tray Label</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="prepGroup in prepGroups"
              :key="'group' + prepGroup.group"
              @click="printTrayLabel(prepGroup)"
            >
              <v-list-item-avatar>
                <v-avatar class="font-weight-bold">
                  {{ prepGroup.group }}
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ prepGroup.label }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>print</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      search: '',
      selectedPrinter: '',
      sampleLoading: false,
      sample: [],
      grindingOnly: false,
      searchDisabled: false,
      preps: [
        {
          group: '1',
          preps: [
            { label: 'pH', dets: ['WAT21_SP'], required: false, weight: 20 },
            {
              label: 'pH 2.5:1',
              dets: ['WAT251_SP'],
              required: false,
              weight: 20,
            },
            {
              label: 'pH 5:1',
              dets: ['WAT51_SP'],
              required: false,
              weight: 20,
            },
          ],
        },
        {
          group: '2',
          preps: [
            {
              label: 'Cyanide',
              dets: ['NAOH_SP'],
              required: false,
              weight: 5,
            },
            { label: 'ANC', dets: ['ANC_SP'], required: false, weight: 5 },
            {
              label: 'Ammonium',
              dets: ['KCL_SP'],
              required: false,
              weight: 10,
            },
          ],
        },
        {
          group: '3',
          preps: [
            { label: 'PAH', dets: ['DRYDCM_SP'], required: false, weight: 5 },
            {
              label: 'CEM/TEM/PEEM',
              dets: ['PEEMBAS_SP', 'CEMBAS_SP', 'TEMBAS_SP'],
              required: false,
              weight: 10,
            },
          ],
        },
        {
          group: '4',
          preps: [
            {
              label: 'Sulphide',
              dets: ['HHSO4_SP'],
              required: false,
              weight: 10,
            },
            {
              label: 'Cations',
              dets: ['NH4NO3_SP'],
              required: false,
              weight: 10,
            },
            { label: 'EC', dets: ['CASO4_SP'], required: false, weight: 20 },
            {
              label: 'Phosphate',
              dets: ['NACO3_SP'],
              required: false,
              weight: 10,
            },
          ],
        },
        {
          group: '5',
          preps: [
            {
              label: 'Boron',
              dets: ['HW_SP'],
              required: false,
              weight: 20,
            },
            {
              label: 'Sulphate',
              dets: ['HHSO4_SP'],
              required: false,
              weight: 20,
            },
          ],
        },
        {
          group: '6',
          preps: [
            {
              label: 'Metals - Aqua Regia',
              dets: ['AQR_SP'],
              required: false,

              weight: 2,
            },
            {
              label: 'Metals - HCl',
              dets: ['HCL_SP'],
              required: false,
              weight: 2,
            },
            {
              label: 'Metals - Nitric',
              dets: ['HNO_SP'],
              required: false,
              weight: 2,
            },
          ],
        },
        {
          group: '7',
          preps: [
            {
              label: 'TOC',
              dets: ['ACRU_SP'],
              required: false,
              weight: 2,
            },
            {
              label: 'TOTS',
              dets: ['CRU_SP'],
              required: false,
              weight: 2,
            },
          ],
        },
        {
          group: '8',
          preps: [
            {
              label: 'LOI',
              dets: ['LOIA_SP'],

              required: false,
              weight: 10,
            },
            {
              label: 'Available Metals',
              dets: ['EDTA_SP'],
              required: false,
              weight: 2,
            },
          ],
        },
        {
          group: '9',
          preps: [
            {
              label: 'Inorganics Misc',
              dets: [
                'CO3_SB',
                'OM_SB',
                'REDOX_SB',
                'ALK_SB',
                'ACID_SB',
                'ACIDRES_SB',
                'AIM_SB',
                'MBAS_SB',
                'LIME_SB',
                'LMRQ_SB',
                'TOTC_SE',
                'TOTN_SB',
                'HYDRGN_SN',
              ],
              required: false,
              weight: 20,
            },
          ],
        },
      ],

      printData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'DrySamples.csv',
        csvHeaders: [
          'JOB',
          'SAMPNUM',
          'DETAILS1',
          'DETAILS2',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
        ],
        csvRows: [],
      },
      trayPrintDialog: false,
      trayPrintData: {
        path: '\\\\nm-web01\\labels$\\',
        filename: 'Tray.csv',
        csvHeaders: ['DETAILS1', 'DETAILS2', 'LABEL_FORMAT', 'LABEL_PRINTER'],
        csvRows: [],
      },
    };
  },
  mounted() {
    this.getUsers();
  },
  computed: {
    groupedPreps() {
      let preps = this.preps;
      preps.forEach((prepGroup) => {
        prepGroup.preps.forEach((prep) => {
          if (
            this.sample.moreDets &&
            this.sample.moreDets.some((det) => prep.dets.includes(det))
          ) {
            prep.required = true;
          } else {
            prep.required = false;
          }
        });
      });
      return preps;
    },
    requiredPreps() {
      var preps = [];
      if (this.sample.SAMPNUM) {
        this.groupedPreps.forEach((group) => {
          group.preps.forEach((prep) => {
            if (prep.required) {
              preps.push({
                label: prep.label,
                group: group.group,
              });
            }
          });
        });
      }
      return preps;
    },

    prepGroups() {
      var array = [];
      this.preps.forEach((prep) => {
        array.push({
          group: prep.group,
          label: this._.map(prep.preps, 'label').join(', '),
        });
      });
      array.push({
        group: '10',
        label: 'SPARE',
      });
      return array;
    },
  },
  methods: {
    getUsers() {
      this.$axios.get('users/section/PREP').then((response) => {
        this.users = response.data.data;
      });
    },

    sampleFound(sample) {
      this.sample = sample;

      //this.printLabels();
      setTimeout(() => {
        this.resetForm();
      }, 10000);
    },
    setFocus(ref) {
      this.$refs[ref].focus();
    },
    resetForm() {
      this.search = '';
      this.sample = [];
      this.printData.csvRows = [];
      this.$refs.sampleScan.resetSample();
    },
    printLabels() {
      if (this.requiredPreps.length > 0) {
        this.requiredPreps.forEach((prep) => {
          this.printData.csvRows.push([
            this.sample.JOB,
            this.sample.SAMPNUM,
            prep.label,
            prep.group,
            'NM_DRY_SAMPLE_POT.btw',
            this.$store.state.printer.printer,
          ]);
        });
      }

      this.printData.csvRows.push([
        this.sample.JOB,
        this.sample.SAMPNUM,
        'SPARE',
        '10',
        'NM_DRY_SAMPLE_POT.btw',
        this.selectedPrinter,
      ]);

      this.$axios.post('labels/print', this.printData).then((response) => {
        this.printData.csvRows = [];
      });
    },
    printTrayLabel(group) {
      this.trayPrintData.csvRows.push([
        group.label,
        group.group,
        'NM_DRY_SAMPLE_POT_TRAY.btw',
        this.$store.state.printer.printer,
      ]);
      this.$axios.post('labels/print', this.trayPrintData).then((response) => {
        this.trayPrintData.csvRows = [];
      });
    },
  },
};
</script>

<style></style>
