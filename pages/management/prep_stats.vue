<template>
  <v-card flat>
    <v-card-title>Prep Stats</v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          ><v-text-field
            v-model="date"
            label="date"
            outlined
            dense
          ></v-text-field
        ></v-col>
        <v-col><v-btn color="primary" @click="getData">Refresh</v-btn></v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="phase in data"
              :key="'phasePanel' + phase.phase"
            >
              <v-expansion-panel-header>
                <v-row no-gutters align="center">
                  <v-col class="text-h6"> Phase {{ phase.phase }}</v-col>
                  <v-col class="text-right text-h4 font-weight-medium">
                    {{ phase.percent_on_time }}%</v-col
                  >
                  <v-col class="text-center"
                    >({{ phase.preps_on_time }} /
                    {{ phase.total_preps }})</v-col
                  >
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <v-simple-table dense>
                      <thead>
                        <tr>
                          <th>Prep</th>
                          <th>ID</th>
                          <th>Target Days</th>
                          <th>% On Target</th>
                          <th></th>
                          <th>+1 Day</th>
                          <th>+2 Days</th>
                          <th>+3 Days +</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="prep in phase.details" :key="prep.det_id">
                          <td class="text-caption">
                            {{ prep.det_name }}
                          </td>
                          <td class="text-caption">{{ prep.det_id }}</td>
                          <td>{{ prep.target_days }}</td>
                          <td>
                            <span class="font-weight-medium"
                              >{{ prep.percentage_on_time }}%</span
                            >
                          </td>
                          <td>
                            ({{ prep.samples_on_time }} /
                            {{ prep.total_samples }})
                          </td>
                          <td>
                            {{ prep.targetPlusOne }}
                          </td>
                          <td>
                            {{ prep.targetPlusTwo }}
                          </td>
                          <td>
                            {{ prep.targetPlusThreePlus }}
                          </td>
                          <!-- <td>
                            {{ prep.samples_on_time }} /
                            {{ prep.total_samples }}
                          </td> -->
                          <td>
                            <v-btn icon @click="prepDetSelected(prep)"
                              ><v-icon>mdi-test-tube</v-icon></v-btn
                            >
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <!-- <v-col
        cols="12"
        sm="12"
        md="6"
        lg="6"
        xl="4"
        v-for="phase in data"
        :key="'phaseCard' + phase.phase"
      >
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col class="text-h6">Phase {{ phase.phase }}</v-col>
              <v-col>
                <v-row dense>
                  <v-col class="text-right text-h4 font-weight-medium"
                    >{{ phase.percent_on_time }}%</v-col
                  >
                </v-row>
                <v-row dense>
                  <v-col class="text-right"> </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider class="mt-4" />
            <v-row>
              <v-col>
                <v-simple-table dense>
                  <thead>
                    <tr>
                      <th>Prep</th>
                      <th>(%)</th>
                      <th>On Time / Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prep in phase.details" :key="prep.det_id">
                      <td>{{ prep.det_name }} ({{ prep.target_days }})</td>
                      <td>{{ prep.percentage_on_time }} %</td>
                      <td>
                        {{ prep.samples_on_time }} / {{ prep.total_samples }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col> -->
        <!-- </v-row>
          </v-card-text>
        </v-card>
      </v-col> -->
      </v-row>
    </v-card-text>
    <v-dialog v-model="detDialog" max-width="800">
      <v-card outlined>
        <v-card-title v-if="selectedDet.det_name"
          ><span>{{ selectedDet.det_name }}</span>
          <span class="ml-2 text-body-2">
            ({{ selectedDet.det_id }})</span
          ></v-card-title
        >
        <v-card-text>
          <v-data-table
            :loading="detLoading"
            dense
            :items="detData"
            :headers="detDataHeaders"
          >
            <template v-slot:item.completed_date="{ item }">
              {{ $moment(item.completed_date).format('DD-MM-YY') }}
            </template>
            <template v-slot:item.percentage_on_time="{ item }">
              <div class="font-weight-medium">
                {{ item.percentage_on_time }}
              </div>
            </template>
            <template v-slot:item.sampleTotals="{ item }">
              {{ item.samples_on_time }} / {{ item.total_samples }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      date: this.$moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
      selectedDet: {},
      detDialog: false,
      detLoading: false,
      detData: [],
      detDataHeaders: [
        { text: 'Date', value: 'completed_date' },
        {
          text: 'On Time (%)',
          value: 'percentage_on_time',
        },
        { text: 'Prep Counts', value: 'sampleTotals' },
        { text: '+1 Day', value: 'targetPlusOne' },
        { text: '+2 Days', value: 'targetPlusTwo' },
        { text: '+3 Days +', value: 'targetPlusThreePlus' },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      await this.$axios
        .get('stats/dw-prep-phase-stats-by-date?date=' + this.date)
        .then((res) => {
          this.data = res.data.data;
        });
    },
    prepDetSelected(det) {
      this.detLoading = true;
      this.detData = [];
      this.selectedDet = det;
      this.getPrepData(det.det_id);
    },

    async getPrepData(det) {
      await this.$axios
        .get('stats/dw-prep-det-stats?det_id=' + det)
        .then((res) => {
          this.detData = res.data.data;
          this.detLoading = false;
          this.detDialog = true;
        });
    },
  },
};
</script>

<style></style>
