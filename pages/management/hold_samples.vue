<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Samples On Hold</v-toolbar-title
          ><v-spacer /><v-btn @click="getClients" icon
            ><v-icon>mdi-refresh</v-icon></v-btn
          >
        </v-toolbar>

        <v-card-text>
          <v-row
            ><v-col md="3" sm="6" cols="10"
              ><v-text-field
                v-model="search"
                label="Search"
                dense
                outlined
                clearable
              ></v-text-field></v-col
            ><v-col md="6" sm="10" cols="12"
              ><v-alert class="text-center" dense color="primary" dark
                >{{ holdSampleSum }} Samples Currently On Hold</v-alert
              ></v-col
            ><v-col></v-col
          ></v-row>
          <v-row
            ><v-col
              ><v-data-table
                :search="search"
                :loading="loading"
                :headers="headers"
                dense
                disable-pagination
                hide-default-footer
                :items="clients"
                ><template v-slot:item.TOTAL="{ item }"
                  ><span class="font-weight-medium">{{
                    item.TOTAL
                  }}</span></template
                ><template v-slot:item.percent="{ item }">
                  {{
                    ((item.TOTAL / holdSampleSum) * 100).toFixed(1)
                  }}% </template
                ><template v-slot:item.view="{ item }"
                  ><v-btn icon @click="clientSelected(item)"
                    ><v-icon class="ma-0"
                      >mdi-information-outline</v-icon
                    ></v-btn
                  ></template
                ></v-data-table
              ></v-col
            ></v-row
          ></v-card-text
        ></v-card
      >
      <v-dialog v-model="sampleDialog" width="1000" height="1600">
        <v-card
          ><v-card-title
            >On Hold Samples: {{ selectedClient.CLIENT_NAME }}</v-card-title
          ><v-card-text
            ><v-data-table
              dense
              :items="selectedClientSamples"
              :loading="clientSamplesLoading"
              :headers="clientSamplesHeaders"
              group-by="JOB"
              disable-pagination
              hide-default-footer
              ><template v-slot:group.header="{ group }">
                <td class="font-weight-medium" colspan="6">Job: {{ group }}</td>
              </template>
              <template v-slot:item.LOGDATE="{ item }">{{
                $moment(item.LOGDATE).format('DD/MM/YY')
              }}</template>
              <template v-slot:item.DISPDATE="{ item }">{{
                $moment(item.DISPDATE).format('DD/MM/YY')
              }}</template></v-data-table
            ></v-card-text
          ></v-card
        ></v-dialog
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      search: '',
      headers: [
        { text: 'Client', value: 'CLIENT_NAME' },
        { text: 'Region', value: 'REGION' },
        { text: 'Samples On Hold', value: 'TOTAL' },
        { text: '% of On Hold', value: 'percent' },
        { text: 'Samples On Hold >14 days', value: 'OLD' },
        { text: 'New Samples (-7 days)', value: 'NEW' },
        { text: 'Disposing Soon (+7 days)', value: 'SOON' },
        { text: 'Previously Disposed (-6 Months)', value: 'DISPOSED' },
        { text: 'View', value: 'view', sortable: false },
      ],
      clients: [],
      selectedClient: {},
      clientSamplesLoading: false,
      clientSamplesHeaders: [
        { text: 'Sample', value: 'SAMPNUM' },
        { text: 'Logged', value: 'LOGDATE' },
        { text: 'Project', value: 'PROJECT' },
        { text: 'Client Ref', value: 'CLIENTSREF' },
        { text: 'Depth (m)', value: 'SAMPTOP' },
        { text: 'Disposal Date', value: 'DISPDATE' },
      ],
      selectedClientSamples: [],
      sampleDialog: false,
    };
  },
  mounted() {
    this.getClients();
  },
  computed: {
    holdSampleSum() {
      return this.clients
        .map((x) => x.TOTAL)
        .reduce(function(a, b) {
          return parseInt(a) + parseInt(b);
        }, 0);
    },
  },
  methods: {
    getClients() {
      this.loading = true;
      this.$axios.get('stats/dw-hold-sample-totals').then((response) => {
        this.clients = response.data.data;
        this.loading = false;
      });
    },
    clientSelected(client) {
      this.selectedClientSamples = [];
      this.clientSamplesLoading = true;
      this.sampleDialog = true;
      this.selectedClient = client;
      this.$axios
        .get(
          'stats/dw-client-hold-samples?client=' +
            encodeURIComponent(client.CLIENT_ID) +
            '&region=' +
            client.REGION
        )
        .then((response) => {
          this.selectedClientSamples = response.data.data;
          this.clientSamplesLoading = false;
        });
    },
  },
};
</script>

<style></style>
