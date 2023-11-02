<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title
            >Asbestos Data Entry: Sample {{ sampnum }}</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="10">
              <v-card flat>
                <v-card-title>Sample Details</v-card-title>
                <v-card-text>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        readonly
                        label="Sample No."
                        v-model="sample.SAMPNUM"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        readonly
                        label="Job No."
                        v-model="sample.JOB"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        readonly
                        label="Client"
                        v-model="sample.CLIENT"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        readonly
                        label="Sample Type"
                        v-model="sample.TYPE"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense align="center">
                    <v-col>
                      <v-combobox
                        dense
                        outlined
                        label="Sample Description"
                      ></v-combobox>
                    </v-col>
                    <v-col>
                      <v-select
                        dense
                        outlined
                        label="Sample Preps"
                        :items="samplePrepsOptions"
                        multiple
                        v-model="form.preps"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-switch
                        color="primary"
                        label="Asbestos Detected"
                        v-model="form.detected"
                      ></v-switch>
                    </v-col>
                    <v-col>
                      <v-select
                        dense
                        outlined
                        label="Visibility"
                        :items="visibilityOptions"
                        v-model="form.visibility"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row dense align="center">
                    <v-col>
                      <v-textarea
                        outlined
                        hide-details
                        label="Internal Notes"
                        rows="3"
                        v-model="form.internalNotes"
                      ></v-textarea>
                    </v-col>
                    <v-col>
                      <v-textarea
                        outlined
                        hide-details
                        label="Reporting Notes"
                        rows="3"
                        v-model="form.reportingNotes"
                      ></v-textarea>
                    </v-col>
                    <v-col class="text-center">
                      <v-select
                        label="ACM Type"
                        hide-details
                        outlined
                        :items="acmTypes"
                        item-value="ACMTYPESID"
                        v-model="form.acmType"
                      >
                        <template v-slot:item="{ item }">{{
                          item.TYPE + ' (' + item.SCORE + ')'
                        }}</template>
                        <template v-slot:selection="{ item }">{{
                          item.TYPE + ' (' + item.SCORE + ')'
                        }}</template>
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        block
                        large
                        color="primary"
                        @click="addFibre"
                        :disabled="fibreCount > 3"
                      >
                        Add Fibre
                        <v-icon small class="ml-3">add</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card flat>
                <v-card-text>
                  <v-expansion-panels flat accordion v-model="openFibres">
                    <v-expansion-panel
                      v-for="(fibre, index) in form.fibres"
                      :key="'fibres' + index"
                    >
                      <v-expansion-panel-header class="font-weight-bold">
                        Fibre {{ index + 1 }}
                        {{
                          fibre.asbestosType ? ' - ' + fibre.asbestosType : ''
                        }}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col>
                            <v-select
                              label="RI Liquid"
                              outlined
                              dense
                              :items="riLiquids"
                              item-value="ASBRILIQID"
                              v-model="fibre.riLiquidID"
                            >
                              <template v-slot:item="{ item }">{{
                                item.CHEMTESTID + ' @ ' + item.RI
                              }}</template>
                              <template v-slot:selection="{ item }">{{
                                item.CHEMTESTID + ' @ ' + item.RI
                              }}</template>
                            </v-select>
                          </v-col>
                          <v-col>
                            <v-select
                              outlined
                              dense
                              multiple
                              label="Morphology"
                              v-model="fibre.morphology"
                              :items="morphologyOptions"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-select
                              outlined
                              dense
                              label="Colour"
                              v-model="fibre.colour"
                              :items="fibreColours"
                            ></v-select>
                          </v-col>
                          <v-col class="text-right">
                            <v-btn color="primary" @click="deleteFibre(index)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row align="center">
                          <v-col>
                            <v-radio-group
                              v-model="fibre.birefringence"
                              column
                              label="Birefringence"
                            >
                              <v-radio
                                color="primary"
                                label="Low"
                                value="Low"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="Moderate"
                                value="Moderate"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="None"
                                value="None"
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col>
                            <v-radio-group
                              v-model="fibre.signOfElongation"
                              column
                              label="Sign of Elongation"
                            >
                              <v-radio
                                color="primary"
                                label="Slow"
                                value="Slow"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="Fast"
                                value="Fast"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="None"
                                value="None"
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col>
                            <v-radio-group
                              v-model="fibre.angleOfExtinction"
                              column
                              label="Angle of Extinction"
                            >
                              <v-radio
                                color="primary"
                                label="Parallel"
                                value="Parallel"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="Oblique"
                                value="Oblique"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="Incomplete"
                                value="Incomplete"
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col>
                            <v-radio-group
                              v-model="fibre.pleochroism"
                              column
                              label="Pleochroism"
                              @change="pleochroismChanged($event, index)"
                            >
                              <v-radio
                                color="primary"
                                label="Yes"
                                value="Yes"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="No"
                                value="No"
                              ></v-radio>
                              <v-radio
                                color="primary"
                                label="None"
                                value="None"
                              ></v-radio>
                            </v-radio-group>
                          </v-col>
                          <v-col>
                            <v-row>
                              <v-col>
                                <v-text-field
                                  hide-details
                                  readonly
                                  dense
                                  outlined
                                  label="Pleochroism Colour N/S"
                                  v-model="fibre.pleochroismColourNS"
                                  :disabled="fibre.pleochroism != 'Yes'"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-select
                                  hide-details
                                  dense
                                  outlined
                                  label="Pleochroism Colour E/W"
                                  :items="pleochroismColoursEW"
                                  v-model="fibre.pleochroismColourEW"
                                  :disabled="fibre.pleochroism != 'Yes'"
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-select
                              dense
                              outlined
                              v-model="fibre.dispersionStainingNS"
                              :items="dispersionStainingOptions"
                              label="Dispersion Staining N/S"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-select
                              dense
                              outlined
                              v-model="fibre.dispersionStainingEW"
                              :items="dispersionStainingOptions"
                              label="Dispersion Staining E/W"
                            ></v-select>
                          </v-col>
                          <v-col>
                            <v-select
                              dense
                              outlined
                              v-model="fibre.asbestosType"
                              :items="asbestosTypes"
                              label="Asbestos Type"
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="2">
              <v-card flat>
                <v-card-title>Reporting Details</v-card-title>
                <v-card-text>{{ repotableResult }}</v-card-text>
                <v-card-actions>
                  <v-btn @click="submitResults">Submit</v-btn>
                </v-card-actions>
              </v-card>
              {{ form }}
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
      sampnum: '',
      sample: [],
      riLiquids: [],
      openFibres: [],
      visibilityOptions: ['Visible', 'Microscopic'],
      samplePrepsOptions: ['Acid', 'Dry', 'Crush', 'Ignition', 'Solvent'],
      morphologyOptions: ['Curly', 'Elastic', 'Harsh', 'Sticky', 'Straight'],
      fibreColours: ['White', 'Brown', 'Green', 'Blue'],
      pleochroismColoursNS: ['Grey'],
      pleochroismColoursEW: ['Blue', 'Green'],
      dispersionStainingOptions: [
        'Blue',
        'Gold',
        'Magenta',
        'Orange',
        'Purple',
        'Red',
        'Yellow'
      ],
      asbestosTypes: [
        'Actinolite',
        'Amosite',
        'Anthophyllite',
        'Chrysotile',
        'Crocidolite',
        'Tremolite'
      ],
      acmTypes: [],
      form: {
        preps: [],
        detected: false,
        visibility: '',
        microscope: '',
        stereoMicroscope: '',
        safetyCabinet: '',
        internalNotes: '',
        reportingNotes: '',
        acmType: '',
        fibres: []
      }
    };
  },
  computed: {
    fibreCount() {
      return this.form.fibres.length;
    },
    repotableResult() {
      let reportable = '';
      if (this.form.fibres.length == 0) {
        reportable = 'No Asbestos Detected';
      } else {
        reportable = this.form.visibility + ' fibres of ';
      }
      this.form.fibres.forEach((fibre, index) => {
        if (index + 1 == this.form.fibres.length && index > 0) {
          reportable += ' and ';
        } else if (index > 0) {
          reportable += ', ';
        }
        reportable += fibre.asbestosType;
      });

      return reportable;
    }
  },
  mounted() {
    this.sampnum = this.$route.params.sampnum;
    this.getSample();
    this.getriLiquids();
    this.getAcmTypes();
  },
  methods: {
    getSample() {
      this.$axios
        .get('/asbestos/sample?sampnum=' + this.sampnum)
        .then(response => {
          this.sample = response.data;
        });
    },
    getriLiquids() {
      this.$axios.get('/asbestos/openriliquids').then(response => {
        this.riLiquids = response.data;
      });
    },
    getAcmTypes() {
      this.$axios.get('asbestos/acmtypes').then(response => {
        this.acmTypes = response.data;
      });
    },

    pleochroismChanged(value, index) {
      if (value == 'Yes') {
        this.form.fibres[index].pleochroismColourNS = 'Grey';
      } else {
        this.form.fibres[index].pleochroismColourNS = '';
      }
    },

    addFibre() {
      this.form.fibres.push({
        morphology: [],
        colour: '',
        riLiquidID: '',
        birefringence: null,
        signOfElongation: '',
        angleOfExtinction: '',
        pleochroism: null,
        pleochroismColourNS: '',
        pleochroismColourEW: '',
        dispersionStainingNS: '',
        dispersionStainingEW: '',
        asbestosType: ''
      });
    },

    deleteFibre(index) {
      this.form.fibres.splice(index, 1);
      this.openFibres = [];
    },

    submitResults() {
      this.$store.dispatch('results/addResult', {
        sampnum: this.sample.SAMPNUM,
        test: 'ACM',
        results: [
          {
            det: 'ASBACM_SZ',
            detname: 'ACM Type',
            result: this.form.acmType,
            reportable: true
          },
          {
            det: 'ASBID_ID',
            detname: 'Asbestos ID',
            result: this.repotableResult,
            reportable: true
          },
          {
            det: 'ASBACM_SZ',
            detname: 'ACM Type',
            result: this.form.acmType,
            reportable: true
          }
        ]
      });
    }
  }
};
</script>

<style></style>
