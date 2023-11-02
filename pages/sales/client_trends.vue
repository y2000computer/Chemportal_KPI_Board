<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Client Trends</v-toolbar-title
          > </v-toolbar
        ><v-card-text>
          <v-row dense>
            <v-col>
              <v-select
                outlined
                dense
                :items="searchFields"
                item-value="value"
                item-text="name"
                v-model="searchField"
                label="field"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                outlined
                dense
                :items="salesRegions"
                item-value="value"
                item-text="name"
                v-model="salesRegion"
                label="Sales Region"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                dense
                outlined
                v-model="movingMeanPoints"
                label="Moving Average Points"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                v-model="clients"
                label="Clients"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn
                @click="getClientData"
                color="primary"
                :loading="loading"
                :disabled="loading"
                >Get Client Data</v-btn
              >
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" md="3" sm="6">
              <v-text-field
                dense
                outlined
                v-model="search"
                label="Filter"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-data-table
                dense
                :loading="loading"
                disable-pagination
                hide-default-footer
                :items="clientData"
                :headers="clientDataHeaders"
                show-expand
                :search="search"
                item-key="client_id"
              >






                <template v-slot:item.currentTrend_sampleCountTrendCount="{ item }">
                  <cell-chip
                    :value="
                      item.currentTrend_sampleCountTrendCount +
                        (item.currentTrend_sampleCountTrendCount == 1
                          ? ' wk'
                          : ' wks')
                    "
                    :positive="
                      item.currentTrend_sampleCountTrend == 'up'
                    "
                  />
                </template>









                <template v-slot:item.previousWeeksCountsOne_samples="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCountsOne_samples"
                    :positive="
                      item.previousWeeksCountsOne_sampleCountTrend == 'up'
                    "
                  />
                </template>








                <template v-slot:item.previousWeeksCountsTwo_samples="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCountsTwo_samples"
                    :positive="
                      item.previousWeeksCountsTwo_sampleCountTrend == 'up'
                    "
                  />
                </template>



                <template v-slot:item.previousWeeksCountsThree_samples="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCountsThree_samples"
                    :positive="
                      item.previousWeeksCountsThree_sampleCountTrend == 'up'
                    "
                  />
                </template>



                <template v-slot:item.previousWeeksCountsFour_samples="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCountsFour_samples"
                    :positive="
                      item.previousWeeksCountsFour_sampleCountTrend == 'up'
                    "
                  />



                </template>




                <template v-slot:item.previousWeeksCountsOne_movingAverage="{ item }">
                  <div class="font-weight-bold">
                    {{ item.previousWeeksCountsOne_movingAverage }}
                  </div>
                </template>









                <template v-slot:item.previousWeeksCountsOne_movingAverageTrendCount="{ item }">
                  <cell-chip
                    :value="
                      item.previousWeeksCountsOne_movingAverageTrendCount +
                        (item.previousWeeksCountsOne_movingAverageTrendCount ==
                        1
                          ? ' wk'
                          : ' wks')
                    "
                    :positive="
                      item.previousWeeksCountsOne_movingAverageTrend == 'up'
                    "
                  />
                </template>








                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <client-sales-card
                      :date="date"
                      :loading="loading"
                      :key="item.client_id + 'card'"
                      :client="item"
                      :field="searchField"
                    ></client-sales-card>
                  </td>
                </template>
              </v-data-table>
            </v-col> </v-row></v-card-text
      ></v-card>
    </v-col>
  </v-row>
</template>

<script>
import cellChip from '../../components/tables/cellChip';

import clientSalesCard from './components/clientSalesCard';
export default {
  components: {
    clientSalesCard,
    cellChip,
  },
  data() {
    return {
      date: this.$moment(),
      loading: false,
      search: '',
      searchFields: [
        { name: 'Samples In (total)', value: 'samplesLogged' },
        { name: 'Samples In (tested)', value: 'samplesLoggedTested' },
      ],
      searchField: 'samplesLoggedTested',
      salesRegions: [
        { name: 'All', value: '' },
        { name: 'East', value: 'E' },
        { name: 'Ireland', value: 'I' },
        { name: 'North', value: 'N' },
        { name: 'Poland', value: 'P' },
        { name: 'Scotland', value: 'S' },
        { name: 'West', value: 'W' },
      ],
      salesRegion: '',
      movingMeanPoints: 4,
      clients: 30,
      clientData: [],
      clientDataHeaders: [
        {
          text: 'Client',
          value: 'client_name',
        },
        { text: 'Tier', value: 'rate_tier' },
        { text: 'Current Week', value: 'currentWeekCounts.samples' },
        

        { text: 'Current Trend(Dev)', value: 'currentTrend_sampleCountTrendCount' },




        

        { text: 'Previous Week(Dev)', value: 'previousWeeksCountsOne_samples' },





        { text: '-2 Weeks(Dev)', value: 'previousWeeksCountsTwo_samples' },


        { text: '-3 Weeks(Dev)', value: 'previousWeeksCountsThree_samples' },



        { text: '-4 Weeks(Dev)', value: 'previousWeeksCountsFour_samples' },
        
        

        { text: 'Moving Average(Dev)', value: 'previousWeeksCountsOne_movingAverage'   },





        { text: 'Moving Average Trend(Dev)', value: 'previousWeeksCountsOne_movingAverageTrendCount'    },



        { text: '', value: 'data-table-expand' },
      ],
    };
  },

  mounted() {
    this.getClientData();
  },
  methods: {
    getClientData() {
      this.loading = true;
      let query =
        'stats/dw-sales-trends?field=' +
        this.searchField +
        '&movingMeanPoints=' +
        this.movingMeanPoints +
        '&clients=' +
        this.clients;
      if (this.salesRegion) {
        query += '&salesRegion=' + this.salesRegion;
      }

      this.$axios.get(query).then((response) => {
        this.clientData = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  -ms-box-shadow: none !important;
}
</style>
