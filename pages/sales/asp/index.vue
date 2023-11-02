<template>
  <v-card flat :loading="loading">
    <v-toolbar dense flat
      ><v-toolbar-title class="font-weight-medium"
        >Average Selling Prices</v-toolbar-title
      ><v-spacer /><v-btn icon small @click="getData"
        ><v-icon>mdi-refresh</v-icon></v-btn
      ></v-toolbar
    >

    <v-card-text>
      <v-tabs grow>
        <v-tab>Overview</v-tab>
        <v-tab>History</v-tab>
        <v-tab>Regions</v-tab>
        <v-tab>Tiers</v-tab>
        <v-tab>Surcharges</v-tab>

        <v-tab-item
          ><overview
            v-if="data"
            :overviewData="data.overview"
            :quarterlyRegionData="data.quarterlyRegion"
            :monthlyRegionData="data.monthlyRegion"
            :quarterlyTierData="data.quarterlyTier"
            :monthlyTierData="data.monthlyTier"
            :monthlyData="data.monthlyData"
        /></v-tab-item>
        <v-tab-item
          ><history v-if="data" :historyData="data.history"
        /></v-tab-item>
        <v-tab-item>
          <asp-group v-if="data" :groupedData="data.regions" />
        </v-tab-item>
        <v-tab-item>
          <asp-group v-if="data" :groupedData="data.tiers"
        /></v-tab-item>
        <v-tab-item>
          <surcharges v-if="data" :surcharges="data.surcharges"
        /></v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import overview from './components/overview';
import history from './components/history';
import regions from './components/regions';
import aspGroup from './components/aspGroup';
import surcharges from './components/surcharges';
export default {
  components: {
    overview,
    history,
    regions,
    aspGroup,
    surcharges,
  },
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.$axios.get('stats/dw-asp').then((response) => {
        this.data = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
