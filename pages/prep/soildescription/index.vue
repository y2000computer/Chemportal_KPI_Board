<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Soil Description</v-card-title>
        <v-card-text>
          <v-row align="center">
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
              ></v-text-field>
            </v-col>
            <v-col md="3" cols="12">
              <v-btn
                large
                color="primary"
                @click="getSample"
                :disabled="sampleLoading || search.length < 6"
                :loading="sampleLoading"
              >
                Search
                <v-icon class="ml-2">search</v-icon>
              </v-btn>
              <v-btn class="ml-3" @click="clear">
                Clear
                <v-icon class="ml-2">mdi-cancel</v-icon>
              </v-btn>
            </v-col>

            <v-col>
              <v-btn
                x-large
                color="primary"
                @click="addResult"
                :disabled="!user || !selectedColour || !selectedTexture"
              >
                Add Result
                <v-icon class="ml-2">mdi-database-import</v-icon>
              </v-btn>
            </v-col>

            <v-col md="3" cols="12">
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
          <v-row dense>
            <v-col cols="12">
              <v-card flat>
                <v-card-text>
                  <v-row v-if="sample.SAMPNUM" dense class="title">
                    <v-col md="4" cols="6">Sample: {{ sample.SAMPNUM }}</v-col>
                    <v-col md="4" cols="6">Job: {{ sample.JOB }}</v-col>
                    <v-col md="4" cols="12"
                      >Client: {{ sample.job.office.client.CLIENTNAME }}</v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="sample.SAMPNUM && !soilDescReq" justify="center">
            <v-col md="4" cols="12">
              <v-alert color="primary" prominent class="headline"
                >Soil Description Not Required</v-alert
              >
            </v-col>
          </v-row>
          <v-row v-if="soilDescReq" dense>
            <v-col md="4" cols="12">
              <v-card flat>
                <v-card-title>Colour</v-card-title>
                <v-card-text>
                  <v-item-group v-model="selectedColour">
                    <v-row dense>
                      <v-col
                        :cols="colour.size"
                        v-for="colour in colours"
                        :key="colour.label"
                      >
                        <v-item
                          v-slot:default="{ active, toggle }"
                          :value="colour.label"
                        >
                          <v-card
                            :color="active ? 'red lighten-4' : ''"
                            outlined
                            @click="toggle"
                          >
                            <v-card-title>
                              {{ colour.label }}
                              <v-spacer />
                              <v-avatar :color="active ? 'green' : ''">
                                <v-icon v-if="active">mdi-check</v-icon>
                              </v-avatar>
                            </v-card-title>
                            <v-progress-linear
                              height="10"
                              value="100"
                              :color="colour.colour"
                            ></v-progress-linear>
                          </v-card>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="4" cols="12">
              <v-card flat>
                <v-card-title>Texture</v-card-title>
                <v-card-text>
                  <v-item-group v-model="selectedTexture">
                    <v-row dense>
                      <v-col
                        :cols="texture.size"
                        v-for="texture in textures"
                        :key="texture.label"
                      >
                        <v-item
                          v-slot:default="{ active, toggle }"
                          :value="texture.label"
                        >
                          <v-card
                            :color="active ? 'red lighten-4' : ''"
                            outlined
                            @click="toggle"
                          >
                            <v-card-title>
                              {{ texture.label }}
                              <v-spacer />
                              <v-avatar :color="active ? 'green' : ''">
                                <v-icon v-if="active">mdi-check</v-icon>
                              </v-avatar>
                            </v-card-title>
                            <v-progress-linear
                              height="10"
                              value="100"
                              :color="texture.colour"
                            ></v-progress-linear>
                          </v-card>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="4" cols="12">
              <v-card flat>
                <v-card-title>Other Material/s</v-card-title>
                <v-card-text>
                  <v-row dense>
                    <v-col
                      v-for="percentage in otherPercentages"
                      :key="percentage"
                      md="2"
                      cols="4"
                    >
                      <v-card
                        :color="
                          percentage == selectedPercentage
                            ? 'red lighten-4'
                            : ''
                        "
                        outlined
                        v-model="selectedPercentage"
                        @click="selectedPercentage = percentage"
                      >
                        <v-card-title
                          class="text-center caption font-weight-bold"
                          >{{ percentage }}%</v-card-title
                        >
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="4" v-for="other in others" :key="other">
                      <v-card
                        @click="otherSelected(other)"
                        :color="
                          selectedOthers.includes(other) ? 'red lighten-4' : ''
                        "
                        outlined
                      >
                        <v-card-title>
                          {{ other }}
                          <v-spacer />
                          <v-avatar
                            :color="
                              selectedOthers.includes(other) ? 'green' : ''
                            "
                          >
                            <v-icon>{{
                              selectedOthers.includes(other) ? 'mdi-check' : ''
                            }}</v-icon>
                          </v-avatar>
                        </v-card-title>
                        <v-progress-linear
                          height="10"
                          value="100"
                          color="white"
                        ></v-progress-linear>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="8">
                      <v-text-field
                        outlined
                        v-model="typedOther"
                        placeholder="Type Something Here..."
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-btn
                        @click="addTypedOther"
                        color="primary"
                        :disabled="typedOther.length == 0"
                      >
                        Add
                        <v-icon class="ml-2">mdi-text-box-plus-outline</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="space-around">
            <v-col md="4">
              <v-alert
                v-if="soilDescReq"
                prominent
                color="tableSubHeaders"
                class="headline"
              >
                Result:
                <span class="font-weight-bold">{{ soilDescription }}</span>
              </v-alert>
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
          label: 'Red',
          colour: '#ef5350',
          size: 6,
        },
        {
          label: 'Yellow',
          colour: '#ffee58',
          size: 4,
        },
        {
          label: 'White',
          colour: 'white',
          size: 4,
        },
        {
          label: 'Orange',
          colour: '#ffa726',
          size: 4,
        },
        {
          label: 'Blue',
          colour: '#42a5f5',
          size: 4,
        },
        {
          label: 'Green',
          colour: '#66bb6a',
          size: 4,
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
          label: 'Boulders',
          colour: '#a3a2a0',
          size: 6,
        },
        {
          label: 'Gravel',
          colour: '#a68a51',
          size: 6,
        },
      ],
      others: [
        'Stones',
        'Roots',
        'Textiles',
        'Wood',
        'Glass',
        'Chalk',
        'Ash',
        'Oil',
      ],
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
      users: [],
      user: '',
      search: '',
      sample: [],
      sampleLoading: false,
      soilDescReq: false,
      selectedColour: '',
      selectedTexture: '',
      selectedOthers: [],
      typedOther: '',
      selectedPercentage: '<5',
    };
  },
  computed: {
    othersString() {
      var others = '';
      var percentage =
        this.selectedPercentage == '<5' ? '' : this.selectedPercentage + '% ';
      if (!this.selectedOthers.length == 0) {
        this.selectedOthers.forEach((other, index) => {
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

    soilDescription() {
      var appends = '';
      if (!this.selectedOthers.length == 0) {
        appends = ' with ' + this.othersString;
      }
      return this.selectedColour + ' ' + this.selectedTexture + appends;
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
        this.soilDescCheck();
        this.sampleLoading = false;
        this.search = '';
      });
    },
    soilDescCheck() {
      this._.forEach(this.sample.work, (det) => {
        if (det.TEST == 'DESC_SZ') {
          this.soilDescReq = true;
          return false;
        }
      });
    },
    otherSelected(value) {
      if (!this.selectedOthers.includes(value)) {
        this.selectedOthers.push(value);
      } else {
        this.selectedOthers.splice(this.selectedOthers.indexOf(value), 1);
      }
    },
    addTypedOther() {
      this.selectedOthers.push(this.typedOther);
      this.typedOther = '';
    },
    addResult() {
      this.$store.dispatch('results/addResult', [
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
          det: 'COL_SB',
          name: 'Colour',
          value: this.selectedColour,
        },
        {
          sampnum: this.sample.SAMPNUM,
          user: this.user,
          date: this.$moment().format('YYYY-MM-DD'),
          time: this.$moment().format('HHmm'),
          det: 'TEXT_SB',
          name: 'Texture',
          value: this.selectedTexture,
        },
        {
          sampnum: this.sample.SAMPNUM,
          user: this.user,
          date: this.$moment().format('YYYY-MM-DD'),
          time: this.$moment().format('HHmm'),
          det: 'OTH_SB',
          name: 'Others',
          value: this.othersString,
        },
      ]);
      this.clear();
      this.$refs.search.focus();
    },
    clear() {
      this.sample = [];
      this.sampleLoading = false;
      this.search = '';
      this.soilDescReq = false;
      this.selectedColour = '';
      this.selectedTexture = '';
      this.selectedOthers = [];
      this.selectedPercentage = '<5';
    },
  },
};
</script>

<style></style>
