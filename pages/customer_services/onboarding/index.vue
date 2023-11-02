<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          Client Onboarding
          <v-spacer />

          <v-btn icon @click="getDueActions">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row dense align="center" justify="space-between">
            <v-col md="4" cols="12">
              <v-text-field
                dense
                outlined
                label="Search"
                v-model="search"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col md="2">
              <v-switch
                inset
                color="primary"
                v-model="completeOnboarding"
                label="View Completed"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-col>
              <v-data-table
                dense
                :loading="loading"
                :options="options"
                :footer-props="footerProps"
                :search="search"
                :items="filteredClients"
                :headers="tableHeaders"
                :sort-by="['CLIONBID']"
                :sort-desc="['true']"
              >
                <template v-slot:item.STARTDATE="{ item }">{{
                  dateFormat(item.STARTDATE)
                }}</template>
                <template v-slot:item.ENDDATE="{ item }">{{
                  dateFormat(item.ENDDATE)
                }}</template>
                <template v-slot:item.nextDueDate="{ item }">
                  <td :class="dueColour(item.nextDueDate)">
                    {{ dateFormat(item.nextDueDate) }}
                  </td>
                </template>
                <template v-slot:item.Actions="{ item }">
                  <v-btn
                    icon
                    :to="'/customer_services/onboarding/' + item.CLIONBID"
                  >
                    <v-icon>mdi-card-account-details-star</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
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
      loading: true,
      completeOnboarding: false,
      search: '',
      clients: [],
      headers: [
        { text: 'ID', value: 'CLIONBID' },
        { text: 'Client', value: 'client.CLIENTNAME' },
        { text: 'Start Date', value: 'STARTDATE' },
        { text: 'End Date', value: 'ENDDATE' },
        { text: 'Incomplete Actions', value: 'onboarding_stages_count' },
        { text: 'Next Due Date', value: 'nextDueDate' },
        { text: 'Actions', value: 'Actions', sortable: false },
      ],
      options: {
        itemsPerPage: 15,
      },
      footerProps: {
        showFirstLastPage: true,
        itemsPerPageOptions: [15, 25, 50, 100, -1],
      },
    };
  },
  mounted() {
    this.getDueActions();
  },
  computed: {
    tableHeaders() {
      if (!this.completeOnboarding) {
        return this.headers.filter((header) => header.value != 'ENDDATE');
      }
      return this.headers;
    },
    filteredClients() {
      if (this.completeOnboarding === true) {
        return this.clients;
      } else {
        return this.clients.filter((client) => client.ENDDATE === null);
      }
    },
  },
  methods: {
    dateFormat(date) {
      if (date) {
        return this.$moment(date, 'YYYY-MM-DD').format('DD/MM/YY');
      } else {
        return '';
      }
    },
    dueColour(date) {
      if (this.$moment(date).isSame(this.$moment().format('YYYY-MM-DD'))) {
        return 'font-weight-medium orange--text';
      }
      if (this.$moment(date).isBefore(this.$moment())) {
        return 'font-weight-medium red--text';
      }
      return 'font-weight-medium green--text';
    },
    getDueActions() {
      this.$axios.get('client-onboarding').then((response) => {
        this.clients = response.data.data;

        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
