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
                <template v-slot:item.currentTrend="{ item }">
                  <cell-chip
                    :value="
                      item.previousWeeksCounts[0].sampleCountTrendCount +
                        (item.previousWeeksCounts[0].sampleCountTrendCount == 1
                          ? ' wk'
                          : ' wks')
                    "
                    :positive="
                      item.previousWeeksCounts[0].sampleCountTrend == 'up'
                    "
                  />
                </template>
                <template v-slot:item.previousWeeksCountsOne="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCounts[0].samples"
                    :positive="
                      item.previousWeeksCounts[0].sampleCountTrend == 'up'
                    "
                  />
                </template>
                <template v-slot:item.previousWeeksCountsTwo="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCounts[1].samples"
                    :positive="
                      item.previousWeeksCounts[1].sampleCountTrend == 'up'
                    "
                  />
                </template>

                <template v-slot:item.previousWeeksCountsThree="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCounts[2].samples"
                    :positive="
                      item.previousWeeksCounts[2].sampleCountTrend == 'up'
                    "
                  />
                </template>
                <template v-slot:item.previousWeeksCountsFour="{ item }">
                  <cell-chip
                    :value="item.previousWeeksCounts[3].samples"
                    :positive="
                      item.previousWeeksCounts[3].sampleCountTrend == 'up'
                    "
                  />
                </template>
                <template v-slot:item.fourWeekAverage="{ item }">
                  <div class="font-weight-bold">
                    {{ item.previousWeeksCounts[0].movingAverage }}
                  </div>
                </template>

                <template v-slot:item.fourWeekAverageTrend="{ item }">
                  <cell-chip
                    :value="
                      item.previousWeeksCounts[0].movingAverageTrendCount +
                        (item.previousWeeksCounts[0].movingAverageTrendCount ==
                        1
                          ? ' wk'
                          : ' wks')
                    "
                    :positive="
                      item.previousWeeksCounts[0].movingAverageTrend == 'up'
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
        { text: 'Current Trend', value: 'currentTrend' },
        { text: 'Previous Week', value: 'previousWeeksCountsOne' },
        { text: '-2 Weeks', value: 'previousWeeksCountsTwo' },
        { text: '-3 Weeks', value: 'previousWeeksCountsThree' },
        { text: '-4 Weeks', value: 'previousWeeksCountsFour' },
        {
          text: 'Moving Average',
          value: 'fourWeekAverage',
        },
        {
          text: 'Moving Average Trend',
          value: 'fourWeekAverageTrend',
        },
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
