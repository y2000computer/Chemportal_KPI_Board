<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Monthly Client PR</v-toolbar-title
          > </v-toolbar
        ><v-card-text
          ><v-row
            dense
            :justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'"
            ><v-col md="3" sm="8" cols="10"
              ><v-text-field
                outlined
                dense
                v-model="clientsCount"
                label="Top x Clients"
              ></v-text-field></v-col
            ><v-col md="3" sm="8" cols="10"
              ><v-text-field
                outlined
                dense
                v-model="monthsToCount"
                label="From Past x Months"
              ></v-text-field></v-col
            ><v-col class="text-center" md="4" sm="8" cols="12"
              ><v-btn @click="getClients" color="primary">Update</v-btn></v-col
            ></v-row
          ><v-row dense align="center"
            ><v-col></v-col
            ><v-col class="text-center"
              ><v-btn-toggle dense
                ><v-btn :disabled="monthIndex == 0" @click="monthIndex--"
                  >+</v-btn
                ><v-btn>{{
                  filteredData[0]
                    ? $moment(filteredData[0].calendar_month, 'M').format(
                        'MMM'
                      ) +
                      '-' +
                      filteredData[0].calendar_year
                    : ''
                }}</v-btn
                ><v-btn :disabled="monthIndex >= 12" @click="monthIndex++"
                  >-</v-btn
                ></v-btn-toggle
              ></v-col
            ><v-col class="text-right"
              ><span>Key: </span><span class="font-weight-bold">Samples</span
              ><span> (Jobs)</span></v-col
            ></v-row
          ><v-row
            ><v-col
              ><v-data-table
                :loading="loading"
                dense
                :items="filteredData"
                :headers="headers"
                disable-pagination
                hide-default-footer
                ><template v-slot:item.totalInvoiceTotal="{ item }"
                  ><span class="font-weight-bold">{{
                    item.totalInvoiceTotal
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }}</span>
                </template>
                <template v-slot:item.invoiceTotal="{ item }"
                  ><span class="font-weight-bold">{{
                    item.invoiceTotal
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }}</span> </template
                ><template v-slot:item.logged="{ item }"
                  ><span class="font-weight-bold">{{
                    item.samplesLogged
                  }}</span>
                  ({{ item.jobsLogged }})</template
                ><template v-slot:item.loggedTested="{ item }"
                  ><span class="font-weight-bold">{{
                    item.samplesLoggedTested
                  }}</span>
                  ({{ item.jobsLoggedTested }})</template
                ><template v-slot:item.reported="{ item }"
                  ><span class="font-weight-bold">{{
                    item.totalSamplesReported
                  }}</span>
                  ({{ item.jobsReported }})</template
                >
                <template v-slot:item.onTime="{ item }"
                  ><span class="font-weight-bold">{{
                    item.totalSamplesOnTime
                  }}</span>
                  ({{ item.jobsReportedOnTime }})</template
                >
                <template v-slot:item.percentOnTime="{ item }"
                  ><span class="font-weight-bold">{{
                    item.percentSamplesOnTime
                  }}</span>
                  ({{ item.percentJobsOnTime.toFixed(1) }})</template
                ></v-data-table
              ></v-col
            ></v-row
          ></v-card-text
        ></v-card
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      clientsCount: 15,
      monthsToCount: 3,
      headers: [
        { text: 'Client', value: 'client_name' },
        { text: 'Tier', value: 'rate_tier' },
        { text: 'Total Spend (£)', value: 'totalInvoiceTotal' },
        { text: 'Months Spend (£)', value: 'invoiceTotal' },
        { text: 'Logged', value: 'logged' },
        { text: 'Tested', value: 'loggedTested' },
        { text: 'Reported', value: 'reported' },
        { text: 'On Time', value: 'onTime' },
        { text: '% On Time', value: 'percentOnTime' },
      ],
      clients: [],
      monthIndex: 0,
    };
  },
  computed: {
    filteredData() {
      var data = [];
      this.clients.forEach((client) => {
        data.push({
          client_id: client.client_id,
          client_name: client.client_name,
          rate_tier: client.rate_tier,
          totalInvoiceTotal: client.invoice_total,
          calendar_year: client.monthlyCounts[this.monthIndex].calendar_year,
          calendar_month: client.monthlyCounts[this.monthIndex].calendar_month,
          invoiceTotal: client.monthlyCounts[this.monthIndex].invoice_total,
          samplesLogged: client.monthlyCounts[this.monthIndex].SamplesLogged,
          samplesLoggedTested:
            client.monthlyCounts[this.monthIndex].SamplesLoggedTested,
          totalSamplesReported:
            client.monthlyCounts[this.monthIndex].TotalSamplesReported,
          totalSamplesOnTime:
            client.monthlyCounts[this.monthIndex].TotalSamplesOnTime,
          percentSamplesOnTime:
            client.monthlyCounts[this.monthIndex].PercentSamplesOnTime,
          jobsLogged: client.monthlyCounts[this.monthIndex].jobsLogged,
          jobsLoggedTested:
            client.monthlyCounts[this.monthIndex].jobsLoggedTested,
          jobsOnHold: client.monthlyCounts[this.monthIndex].jobsOnHold,
          jobsReported: client.monthlyCounts[this.monthIndex].jobsReported,
          jobsReportedOnTime:
            parseInt(client.monthlyCounts[this.monthIndex].jobsReportedEarly) +
            parseInt(client.monthlyCounts[this.monthIndex].jobsReportedOnTime),
          jobsReportedLate:
            client.monthlyCounts[this.monthIndex].jobsReportedLate,
          percentJobsOnTime:
            ((parseInt(
              client.monthlyCounts[this.monthIndex].jobsReportedEarly
            ) +
              parseInt(
                client.monthlyCounts[this.monthIndex].jobsReportedOnTime
              )) /
              parseInt(client.monthlyCounts[this.monthIndex].jobsReported)) *
            100,
        });
      });
      return data;
    },
  },
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.loading = true;
      this.$axios
        .get(
          'stats/dw-sales-pr?clientsCount=' +
            this.clientsCount +
            '&monthsToCount=' +
            this.monthsToCount
        )
        .then((response) => {
          this.clients = response.data.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
