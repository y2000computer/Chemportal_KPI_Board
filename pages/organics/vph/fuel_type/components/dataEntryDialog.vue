<template>
  <v-card :loading="loading">
    <v-card-title>Fuel Type: Sample {{ sample.SAMPNUM }}</v-card-title>
    <v-card-text v-if="!loading">
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-text>
              <v-row>
                <v-col>Sample Details</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-simple-table dense>
                    <tbody>
                      <tr>
                        <td class="font-weight-medium">Sample:</td>
                        <td>{{ sample.SAMPNUM }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-medium">Job:</td>
                        <td>{{ sample.JOB }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-medium">Client:</td>
                        <td>{{ sample.job.office.client.CLIENTNAME }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-medium">Due:</td>
                        <td>
                          {{ $moment(sample.OFFICEDATE).format('DD/MM/YY') }}
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                  <v-row>
                    <v-col>Available Dets</v-col>
                  </v-row>
                  <v-list dense shaped v-if="requiredDets">
                    <v-list-item-group
                      v-model="selectedDet"
                      color="primary"
                      mandatory
                    >
                      <v-list-item
                        v-for="det in requiredDets"
                        :key="det.det"
                        :value="det"
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{ det.det }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar>
                          <v-avatar
                            size="24"
                            :color="selectedDet.det == det.det ? 'green' : ''"
                          >
                            <v-icon
                              color="black"
                              v-if="selectedDet.det == det.det"
                              >mdi-check</v-icon
                            >
                          </v-avatar>
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-text>
              <v-row>
                <v-col>TPH Results</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-simple-table dense v-if="selectedDet">
                    <tbody>
                      <tr
                        v-for="result in selectedDet.results"
                        :key="result.RESULTSID"
                      >
                        <td>{{ result.det.REPNAME }}</td>
                        <td
                          :class="
                            result.OUTPUT.substring(0, 1) != '<'
                              ? 'red--text font-weight-medium'
                              : ''
                          "
                        >
                          {{ result.OUTPUT + ' ' + result.det.units }}
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-text>
              <v-row>
                <v-col>Select Fuel Type/s</v-col>
                <v-col>
                  <v-btn
                    icon
                    small
                    class="float-right"
                    @click="selectedDet.fuelType = []"
                  >
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-list dense shaped>
                    <v-list-item-group
                      v-model="selectedDet.fuelType"
                      multiple
                      color="primary"
                    >
                      <v-list-item
                        :disabled="!selectedDet.det"
                        v-for="fuelType in fuelTypes"
                        :key="fuelType.label"
                        :value="fuelType"
                        @click="fuelTypeSelected(fuelType)"
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{
                            fuelType.label
                          }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar class="my-0">
                          <v-avatar
                            size="24"
                            color="green"
                            v-if="checkSelected(fuelType.label)"
                          >
                            <v-icon color="black">mdi-check</v-icon>
                          </v-avatar>
                          <v-avatar size="24" v-else></v-avatar>
                        </v-list-item-avatar>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-text>
              <v-row>
                <v-col>Actions</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-simple-table>
                    <tbody>
                      <tr>
                        <td class="font-weight-medium">Fuel Type</td>
                        <td>{{ fuelTypeString }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-medium">Gasoline/Diesel</td>
                        <td>{{ diesel }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-btn
                    large
                    color="primary"
                    @click="submitResult"
                    :disabled="submitDisabled"
                    >Submit</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-btn @click="cancel">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    sample: Object,
  },
  data() {
    return {
      fuelTypeDets: [
        'FUEL_1U',
        'FUEL_2U',
        'FUEL_8U',
        'FUEL_FU',
        'FUEL_MU',
        'FUEL_NU',
        'FUEL_SU',
        'FUEL_WU',
        'VFUEL_SU',
      ],
      fuelTypes: [
        { label: 'N/A', dFlag: false },
        { label: 'Indiscernible', dFlag: false },
        { label: 'PAH', dFlag: false },
        { label: 'Diesel', dFlag: true },
        { label: 'Kerosene', dFlag: false },
        { label: 'Gasoline', dFlag: true },
        { label: 'Lube Oil', dFlag: false },
        { label: 'Heavy Oil', dFlag: false },
        { label: 'Creosote', dFlag: false },
        { label: 'LABS', dFlag: false },
        { label: 'Weathered Diesel', dFlag: true },
        { label: 'Weathered Kerosene', dFlag: false },
        { label: 'Weathered Gasoline', dFlag: true },
        { label: 'Heating Oil', dFlag: false },
      ],
      selectedDet: {},
      selectedFuelTypes: [],
    };
  },
  computed: {
    pendingResults() {
      if (this.$store.state.results.results.length > 0) {
        var results = this._.find(this.$store.state.results.results, {
          method: 'Fuel Type',
        });
        return results.results;
      }
    },
    requiredDets() {
      var dets = [];
      this.fuelTypeDets.forEach((fuelDet) => {
        if (
          this._.find(this.sample.work, {
            DET: fuelDet,
          }) &&
          !this._.find(this.pendingResults, {
            det: fuelDet,
            sampnum: this.sample.SAMPNUM,
          })
        ) {
          dets.push({
            det: fuelDet,
            results: this.getTphResults(fuelDet),
            fuelType: [],
            diesel: 'false',
          });
        }
      });
      return dets;
    },
    fuelTypeString() {
      if (!this.selectedDet.det) {
        return '';
      }
      var string = '';
      if (this.selectedDet.fuelType.length == 0) {
        return string;
      }
      this.selectedDet.fuelType.forEach((type, index) => {
        if (index == 0) {
          string += type.label;
        } else if (index + 1 < this.selectedDet.fuelType.length) {
          string += ', ' + type.label;
        } else {
          string += ' and ' + type.label;
        }
      });
      return string;
    },
    diesel() {
      if (!this.selectedDet.det) {
        return false;
      }
      var diesel = false;
      this.selectedDet.fuelType.forEach((type) => {
        if (type.dFlag) {
          diesel = true;
        }
      });
      return diesel;
    },
    submitDisabled() {
      if (this.selectedDet == {}) {
        return true;
      }
      if (this.selectedDet.fuelType == '') {
        return true;
      }
    },
  },
  methods: {
    fuelTypeSelected(value) {
      this.$nextTick(() => {
        if (this.selectedDet.fuelType.length == 0) {
          return;
        }
        if (value.label == 'N/A' || value.label == 'Indiscernible') {
          this.selectedDet.fuelType = [value];
          return;
        } else if (
          this.selectedDet.fuelType[0].label == 'N/A' ||
          this.selectedDet.fuelType[0].label == 'Indiscernible'
        ) {
          this.selectedDet.fuelType.splice(0, 1);
          return;
        }
      });
    },
    checkSelected(type) {
      if (this._.map(this.selectedDet.fuelType, 'label').includes(type)) {
        return true;
      }
      return false;
    },
    getTphResults(det) {
      var suffix = det.slice(-2, 1) + 'Z';
      return this._.filter(this.sample.results, function(result) {
        return result.TEST.includes('TPH') && result.DET.includes(suffix);
      });
    },
    submitResult() {
      this.$store.dispatch('results/addResult', {
        method: 'Fuel Type',
        filePrefix: 'FUELTYPE',
        results: [
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: this.selectedDet.det,
            name: 'Fuel Type',
            value: this.fuelTypeString,
          },
          {
            sampnum: this.sample.SAMPNUM,
            user: this.$store.state.auth.user.USER_ID,
            date: this.$moment().format('YYYY-MM-DD'),
            time: this.$moment().format('HHmm'),
            det: 'DIESEL_' + this.selectedDet.det.slice(-2, -1) + 'Z',
            name: 'Diesel Present',
            value: this.diesel ? 'Y' : 'N',
          },
        ],
      });
      this.cancel();
    },
    cancel() {
      this.selectedDet = {};
      this.$emit('closeDialog');
    },
  },
};
</script>

<style></style>
