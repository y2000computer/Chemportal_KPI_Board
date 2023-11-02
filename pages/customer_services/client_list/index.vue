<template>
  <v-row>
    <v-col>
      <v-row dense justify="center">
        <v-col md="4">
          <v-text-field
            outlined
            clearable
            dense
            v-model="search"
            label="Search"
            :autofocus="true"
          ></v-text-field>
        </v-col>
        <v-col md="4">
          <v-btn class="float-right" @click="getClients" icon>
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense justify="center">
        <v-col md="8">
          <v-data-table
            :items="clients"
            :headers="headers"
            :search="search"
            :loading="loading"
          >
            <template v-slot:item.RATETIER="{ item }">
              <v-select
                dense
                outlined
                hide-details
                @change="test(item)"
                :items="tiers"
                v-model="item.RATETIER"
                label="Tier"
              ></v-select>
            </template>
            <template v-slot:item.CLIENT="{ item }">
              <v-btn @click="copy(item.CLIENT)">{{ item.CLIENT }}</v-btn>
            </template>
            <template v-slot:item.priceList="{ item }">
              <v-btn icon color="primary" @click="runreport(item.CLIENT)">
                <v-icon>mdi-currency-gbp</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      loading: true,
      clients: [],
      tiers: ['6', '5', '4', '3', '2', '1'],
      headers: [
        {
          text: 'Client',
          value: 'CLIENTNAME',
        },
        { text: 'ID', value: 'CLIENT' },
        { text: 'Tier', value: 'RATETIER' },
        { text: 'Price List', value: 'priceList' },
      ],
    };
  },
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.loading = true;
      this.$axios.get('clients').then((response) => {
        this.clients = response.data.data;
        this.loading = false;
      });
    },
    test(client) {
      this.$axios.patch(
        'clients/update-tier/' + client.CLIENT + '?rate_tier=' + client.RATETIER
      );
    },
    copy(val) {
      this.$copyText(val);
    },
    runreport(client) {
      window.open(
        'http://nm-web01:8080/jasperserver/flow.html?j_username=jasperadmin&j_password=jasperadmin&_flowId=viewReportFlow&ParentFolderUri=/Reports/Bid_Team&reportUnit=/Reports/Bid_Team/PriceListTest&output=pdf&standAlone=true&CLIENT=' +
          client,
        '_blank'
      );
    },
  },
};
</script>

<style></style>
