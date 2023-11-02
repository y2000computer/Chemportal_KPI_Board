<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-dialog v-model="moistureComplete" persistent width="600">
          <v-card>
            <v-card-title></v-card-title>
            <v-card-text class="text-h4"
              >Moisture Already Complete!</v-card-text
            >
            <v-card-actions>
              <v-btn @click="resetForm" color="primary">Reset</v-btn>
              <v-spacer />
              <v-btn @click="moistureComplete = false">Continue</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="asbestosDialog" width="600" persistent>
          <v-card>
            <v-card-title>Send To Asbestos Lab</v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-progress-linear
                    v-if="asbestosLoading"
                    indeterminate
                    color="primary"
                  ></v-progress-linear>
                  <v-simple-table dense
                    ><thead>
                      <tr>
                        <th>Lab</th>
                        <th>Due</th>
                        <th>Capacity</th>
                        <th>Recommended</th>
                        <th>Send?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(lab, key) in asbestosLabs.locations"
                        :key="key + 'lab'"
                      >
                        <td>{{ key }}</td>
                        <td>{{ lab.count }}</td>
                        <td>{{ lab.capacity }}</td>
                        <td>
                          <v-chip
                            dark
                            small
                            :color="lab.recommend ? 'green' : 'red'"
                            >{{ lab.recommend ? 'Y' : 'N' }}</v-chip
                          >
                        </td>
                        <td>
                          <v-checkbox
                            style="margin-top:0px"
                            hide-details
                            color="primary"
                            v-model="asbestosLabToSend"
                            :value="lab.transit"
                          ></v-checkbox>
                        </td>
                      </tr></tbody
                  ></v-simple-table> </v-col
              ></v-row>
              <v-row>
                <v-col
                  ><v-alert
                    v-if="asbestosLabs.containers_count == 1"
                    type="error"
                    >Single Container. Please Sub Sample!</v-alert
                  ></v-col
                >
              </v-row>
            </v-card-text>
            <v-card-actions
              ><v-btn
                @click="
                  asbestosDialog = false;
                  asbestosLabToSend = '';
                "
                >Cancel</v-btn
              ><v-spacer /><v-btn
                @click="updateSampleLocation"
                color="primary"
                :disabled="!asbestosLabToSend"
                >Send</v-btn
              ></v-card-actions
            >
          </v-card>
        </v-dialog>
        <v-toolbar dense flat>
          <v-toolbar-title class="font-weight-medium">
            Wet Weights / Soil Description</v-toolbar-title
          >
        </v-toolbar>





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
        </v-card-title





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
              <v-switch
                v-model="asbestosChecking"
                inset
                label="Check Asb Lab"
              />
            </v-col>
            <v-col md="8" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Sample</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col md="4">
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
                                      ? sample.job.office.client.CLIENTNAME ||
                                        shorten(20)
                                      : ''
                                  }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>

                    <v-col md="4" cols="12">
                      <v-simple-table dense>
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>On Sample</th>
                            <th>On Job</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="test in testChecks" :key="test.name">
                            <td>{{ test.name }}</td>
                            <td>
                              <v-icon :color="test.sampReq ? 'green' : 'red'">
                                {{
                                  test.sampReq
                                    ? 'mdi-beaker-check'
                                    : 'mdi-beaker-remove'
                                }}
                              </v-icon>
                            </td>
                            <td>
                              <v-icon :color="test.jobReq ? 'green' : 'red'">
                                {{
                                  test.jobReq
                                    ? 'mdi-beaker-check'
                                    : 'mdi-beaker-remove'
                                }}
                              </v-icon>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                    <v-col class="text-center">
                      <span v-if="asbestosLabToSend"
                        >Sending To:
                        <div class="font-weight-bold">
                          {{ asbestosLabToSend }}
                        </div></span
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="3">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>
                  Wet Weights
                  <v-spacer />
                  <v-checkbox
                    label="Misc"
                    hide-details
                    v-model="miscSelected"
                    @change="miscCheck"
                    class="ma-0"
                  ></v-checkbox>
                </v-card-title>
                <v-card-text>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                        dense
                        outlined
                        label="Empty Tray Weight"
                        suffix="g"
                        v-validate="{ rules: 'max_value:450' }"
                        ref="moisture1"
                        @keyup.enter="setFocus('moisture2')"
                        v-model="emptyTray"
                        name="Empty Tray"
                        :error-messages="errors.first('Empty Tray')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                        dense
                        outlined
                        label="Weight w/ Stones"
                        suffix="g"
                        ref="moisture2"
                        v-model="weightWithStones"
                        v-validate="{ rules: 'max_value:1000' }"
                        name="Weight"
                        :error-messages="errors.first('Weight')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        label="Weight w/out Stones"
                        suffix="g"
                        ref="moisture3"
                        v-model="weightWithStones"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="7">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>
                  <v-row no-gutters>
                    <v-col>Soil Description</v-col>
                    <v-col>
                      <v-alert
                        v-if="soilDescriptionString.length > 1"
                        color="tableWarnings"
                        dense
                        class="body-2 text-center font-weight-bold mb-0"
                        >{{ soilDescriptionString }}</v-alert
                      >
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="4">Colour</v-col>
                    <v-col cols="4">Texture</v-col>
                    <v-col cols="4">Other Material</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-list shaped dense class="pb-0">
                        <v-list-item-group
                          v-model="selectedColour"
                          color="primary"
                        >
                          <v-list-item
                            v-for="colour in colours"
                            :key="colour.label"
                            :value="colour.label"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ colour.label }}
                              </v-list-item-title>
                              <v-progress-linear
                                height="3"
                                value="100"
                                :color="colour.colour"
                              ></v-progress-linear>
                            </v-list-item-content>
                            <v-list-item-avatar class="my-0">
                              <v-avatar
                                v-if="colour.label == soilDescColour"
                                size="24"
                                color="green"
                              >
                                <v-icon color="black">mdi-check</v-icon>
                              </v-avatar>
                            </v-list-item-avatar>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>
                    <v-col>
                      <v-list shaped dense class="pb-0">
                        <v-list-item-group
                          v-model="selectedTexture"
                          color="primary"
                        >
                          <v-list-item
                            v-for="texture in textures"
                            :key="texture.label"
                            :value="texture.label"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ texture.label }}
                              </v-list-item-title>
                              <v-progress-linear
                                height="3"
                                value="100"
                                :color="texture.colour"
                              ></v-progress-linear>
                            </v-list-item-content>
                            <v-list-item-avatar class="my-0">
                              <v-avatar
                                v-if="texture.label == selectedTexture"
                                size="24"
                                color="green"
                              >
                                <v-icon color="black">mdi-check</v-icon>
                              </v-avatar>
                            </v-list-item-avatar>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>
                    <v-col>
                      <v-row dense>
                        <v-col cols="2"></v-col>
                        <v-col cols="6">
                          <v-select
                            label="Other Percentage"
                            outlined
                            dense
                            :items="otherPercentages"
                            v-model="selectedPercentage"
                            suffix="%"
                            hide-details
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-list shaped dense class="pb-0">
                        <v-list-item-group v-model="selectedOthers" multiple>
                          <v-list-item
                            color="primary"
                            v-for="other in others"
                            :key="other.label"
                            :value="other"
                          >
                            <v-list-item-content>
                              <v-list-item-title>{{ other }}</v-list-item-title>
                              <v-progress-linear
                                height="3"
                                value="100"
                                :color="other == 'Other' ? 'red' : 'grey'"
                              ></v-progress-linear>
                            </v-list-item-content>
                            <v-list-item-avatar class="my-0">
                              <v-avatar
                                v-if="selectedOthers.includes(other)"
                                size="24"
                                color="green"
                              >
                                <v-icon color="black">mdi-check</v-icon>
                              </v-avatar>
                            </v-list-item-avatar>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Other Colour"
                        hide-details
                        dense
                        outlined
                        v-model="customColour"
                        :disabled="selectedColour != 'Other'"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Other Texture"
                        hide-details
                        dense
                        outlined
                        v-model="customTexture"
                        :disabled="selectedTexture != 'Other'"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Other Other.."
                        hide-details
                        dense
                        outlined
                        v-model="customOther"
                        :disabled="!selectedOthers.includes('Other')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Actions</v-card-title>
                <v-card-text>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn
                        x-large
                        color="primary"
                        @click="addResults"
                        :disabled="sendDisabled"
                      >
                        Send
                        <v-icon class="ml-2">mdi-database-import</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn small @click="resetForm">
                        Reset
                        <v-icon class="ml-2">cancel</v-icon>
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
      testChecks: [
        {
          name: 'Organics',
          tests: ['THP_SZ', 'TPHAA_SZ', 'VOC_SZ', 'PHOH_SZ', 'LTPHAA_SZ'],
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
        {
          name: 'Moisture at 105C',
          tests: ['MOI105_SP', 'MOI105_SZ'],
          sampReq: false,
          jobReq: false,
        },        
      ],
      asbestosLoading: false,
      asbestosLabs: [],
      asbestosLabToSend: '',
      asbestosDialog: false,
      asbestosChecking: true,
      moistureComplete: false,
      moistReq: false,
      soilDescReq: false,
      emptyTray: '',
      weightWithStones: '',
      weightWithoutStones: '',
      miscSelected: '',
      selectedColour: '',
      customColour: '',
      selectedTexture: '',
      customTexture: '',
      selectedPercentage: '<5',
      selectedOthers: [],
      customOther: '',
      colours: [
        {
          label: 'Brown',
          colour: '#8d6e63',
          text: 'white',
          size: 12,
        },
        {
          label: 'Black',
          colour: '#212121',
          text: 'white',
          size: 6,
        },
        {
          label: 'Grey',
          colour: '#9e9e9e',
          size: 6,
        },
        {
          label: 'Beige',
          colour: '#fff3e0',
          size: 6,
        },
        {
          label: 'White',
          colour: '#fafafa',
          size: 6,
        },
        {
          label: 'Other',
          colour: 'red',
          size: 6,
        },
      ],
      textures: [
        {
          label: 'Sand',
          colour: '#ffd28f',
          text: 'white',
          size: 12,
        },
        {
          label: 'Clay',
          colour: '#f5a32a',
          text: 'white',
          size: 6,
        },
        {
          label: 'Loam',
          colour: '#402805',
          size: 6,
        },
        {
          label: 'Chalk',
          colour: '#f5f0e9',
          size: 6,
        },
        {
          label: 'Tarmac',
          colour: '#a3a2a0',
          size: 6,
        },
        {
          label: 'Gravel',
          colour: '#a68a51',
          size: 6,
        },
        {
          label: 'Other',
          colour: 'red',
          size: 6,
        },
      ],
      others: ['Stones', 'Roots', 'Wood', 'Glass', 'Other'],
      otherPercentages: [
        '<5',
        '5',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
      ],
    };
  },
  computed: {
    sendDisabled() {
      if (
        this.weightWithStones > 1000 ||
        this.emptyTray === '' ||
        this.emptyTray === null ||
        !this.weightWithStones ||
        !this.soilDescColour ||
        !this.soilDescTexture ||
        !this.soilDescOthers  ||
        !this.user

      ) {
        return true;
      }
    },
    soilDescColour() {
      if (this.customColour.length && this.selectedColour == 'Other') {
        return this.customColour;
      } else {
        return this.selectedColour;
      }
    },
    soilDescTexture() {
      if (this.customTexture.length && this.selectedTexture == 'Other') {
        return this.customTexture;
      } else {
        return this.selectedTexture;
      }
    },
    soilDescOthers() {
      var others = '';
      var percentage =
        this.selectedPercentage == '<5' ? '' : this.selectedPercentage + '% ';
      if (this.selectedOthers.length) {
        this.selectedOthers.forEach((other, index) => {
          if (other == 'Other') {
            other = this.customOther;
          }
          if (index == 0) {
            others += percentage + other;
          } else if (index + 1 < this.selectedOthers.length) {
            others += ', ' + other;
          } else {
            others += ' and ' + other;
          }
        });
      } else {
        others += 'None';
      }
      return others;
    },
    soilDescriptionString() {
      var appends = '';
      if (!this.selectedOthers.length == 0) {
        appends = ' with ' + this.soilDescOthers;
      }
      return this.soilDescColour + ' ' + this.soilDescTexture + appends;
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      //this.$axios.get('users/section/PREP').then((response) => {
      this.$axios.get('users/section_wet_weights').then((response) => {        
        this.users = response.data.data;
        console.log('this.users ='+ this.users)
      });
    },
    async getSample() {
      this.sample = [];
      this.sampleLoading = true;
      this.soilDescReq = false;
      this.asbestosLabToSend = '';
      try {
        await this.$axios
          .get('samples/' + this.search + '?jobWork=1')
          .then((response) => {
            this.sample = response.data.data;
            this.testCheck();
            this.checkMoisture();
            this.sampleLoading = false;
            this.search = '';
            if (this.emptyTray.length > 0) {
              this.setFocus('moisture2');
            } else {
              this.setFocus('moisture1');
            }
          });
      } catch (error) {
        console.log(error);
        this.sampleLoading = false;
      }
    },
    miscCheck(e) {
      if (e) {
        this.emptyTray = 0;
        this.weightWithStones = 1;
        this.weightWithoutStones = 1;
        this.miscSelected = true;
      } else {
        this.emptyTray = '';
        this.weightWithStones = '';
        this.weightWithoutStones = '';
        this.miscSelected = false;
      }
    },
    testCheck() {
      this.testChecks.forEach((testGroup) => {
        testGroup.tests.forEach((test) => {
          this._.forEach(this.sample.work, (det) => {
            if (det.TEST == test) {
              testGroup.sampReq = true;
              return false;
            }
          });
          this.sample.job.samples.forEach((sample) => {
            this._.forEach(sample.work, (det) => {
              if (det.TEST == test) {
                testGroup.jobReq = true;
                return false;
              }
            });
          });
        });
      });
      if (
        this.asbestosChecking &&
        this._.find(this.testChecks, {
          name: 'Asbestos',
          sampReq: true,
        })
      ) {
        this.asbestosCheck();
      }
    },
    checkMoisture() {
      if (this.sample.results) {
        this._.forEach(this.sample.results, (det) => {
          if (det.TEST == 'MOI_SP') {
            this.moistureComplete = true;
            return false;
          }
        });
      }
    },
    asbestosCheck() {
      this.asbestosLoading = true;
      this.asbestosDialog = true;
      this.$axios
        .get('asbestos/recommend/' + this.sample.SAMPNUM)
        .then((response) => {
          this.asbestosLabs = response.data.data;
          this.asbestosLoading = false;
          Object.keys(response.data.data.locations).forEach((lab) => {
            if (response.data.data.locations[lab].recommend) {
              this.asbestosLabToSend =
                response.data.data.locations[lab].transit;
            }
          });
        });
    },
    addResults() {
      this.$store.dispatch('results/addResult', {
        method: 'Soil Description',
        filePrefix: 'SOILDESCRIPTION',
        results: [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'DESC_SP',
            name: 'Soil Description',
            value: 'Y',
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'MOIT_SP',
            name: 'Moisture Tray Weight',
            value: this.emptyTray,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'MOITS_SP',
            name: 'Sample Weight',
            value: this.weightWithStones,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'MOITSS_SP',
            name: 'Sample Weight w/ Stones',
            value: this.weightWithStones,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'COL_SB',
            name: 'Colour',
            value: this.soilDescColour,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'TEXT_SB',
            name: 'Texture',
            value: this.soilDescTexture,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.user,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'OTH_SB',
            name: 'Others',
            value: this.soilDescOthers,
          },
        ],
      });
      if (this.miscSelected) {
        this.$store.dispatch('results/addResult', {
          method: 'Soil Description',
          filePrefix: 'SOILDESCRIPTION',
          results: [
            {
              sampnum: this.sample.SAMPNUM,
              user: this.user,
              date: this.$moment().format('YYYY-MM-DD'),
              time: this.$moment().format('HHmm'),
              det: 'MOIDRY_SP',
              name: 'Dry Weight',
              value: '1',
            },
          ],
        });
      }
      if (this.asbestosLabToSend) {
        this.updateSampleLocation();
      }
      this.resetForm();
    },
    updateSampleLocation() {
      this.$axios
        .patch('asbestos/' + this.sample.SAMPNUM, {
          location: this.asbestosLabToSend,
        })
        .then((response) => {
          this.asbestosDialog = false;

          this.asbestosLabs = [];
        });
    },
    samtest() {
      console.log('this.user ='+ this.user)
    },

    setFocus(ref) {
      this.$refs[ref].focus();
    },
    resetForm() {
      this.search = '';
      this.sample = [];
      this.weightWithStones = '';
      this.weightWithoutStones = '';
      this.selectedColour = '';
      this.customColour = '';
      this.selectedTexture = '';
      this.customTexture = '';
      this.selectedOthers = [];
      this.customOther = '';
      this.selectedPercentage = '<5';
      this.moistureComplete = false;
      this.asbestosLabToSend = '';
      this.asbestosLabs = [];
      this.testChecks.forEach((test) => {
        test.sampReq = false;
        test.jobReq = false;
      });
      if (this.miscSelected) {
        this.emptyTray = '';
        this.miscSelected = false;
      }
      this.setFocus('search');
    },
  },
};
</script>

<style></style>
