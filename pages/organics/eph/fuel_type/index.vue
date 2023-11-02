<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          EPH > Fuel Type
          <v-spacer />

          <v-btn icon @click="getBacklog">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                clearable
                v-model="search"
                label="Search"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                dense
                :search="search"
                :items="backlog"
                :headers="headers"
                :loading="loading"
                disable-pagination
                hide-default-footer
                group-by="job.OFFICEDATE"
                @click:row="sampleSelected"
              >
                <template v-slot:group.header="{ group }">
                  <td class="font-weight-medium" colspan="7">
                    Due: {{ $moment(group).format('DD/MM/YY') }}
                  </td>
                </template>
                <template v-slot:item.LOGDATE="{ item }">{{
                  $moment(item.job.LOGDATE).format('DD/MM/YY')
                }}</template>
                <template v-slot:item.OFFICEDATE="{ item }">{{
                  $moment(item.job.OFFICEDATE).format('DD/MM/YY')
                }}</template>
                <template v-slot:item.sampleType="{ item }">{{
                  item.SUPERTYPE
                }}</template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                    small
                    dark
                    class="font-weight-medium"
                    :color="findResult(item) ? 'blue' : 'red'"
                    >{{ findResult(item) ? 'Pending' : 'Due' }}</v-chip
                  >
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-dialog v-model="resultsDialog" width="1600">
        <data-entry-dialog
          :loading="sampleLoading"
          :sample="selectedSample"
          @closeDialog="closeDialog"
        ></data-entry-dialog>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import dataEntryDialog from './components/dataEntryDialog';
export default {
  components: {
    dataEntryDialog,
  },
  data() {
    return {
      loading: false,
      backlog: [],
      search: '',
      selectedSample: {},
      sampleLoading: false,
      resultsDialog: false,
      headers: [
        { text: 'Sample', value: 'SAMPNUM' },
        { text: 'Job', value: 'JOB' },
        { text: 'Client', value: 'job.office.client.CLIENTNAME' },
        { text: 'Type', value: 'sampleType' },
        { text: 'Log Date', value: 'LOGDATE' },
        { text: 'Due Date', value: 'OFFICEDATE' },
        { text: 'Status', value: 'status' },
      ],
    };
  },

  mounted() {
    this.getBacklog();
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
  },

  methods: {
    getBacklog() {
      this.loading = true;
      this.$axios
        //.get(
        //  'backlogs/show?ids[]=FUEL_SU&ids[]=FUEL_MU&type=DET&ids[]=FUEL_WU&ids[]=FUEL_1U&ids[]=FUEL_2U&ids[]=FUEL_8U&ids[]=FUEL_NU&ids[]=FUEL_FU'
        //)
        .get(
          'backlogs/show?ids[]=EFUEL_SU&type=DET'
        )
        .then((response) => {
          this.backlog = response.data.data;
          this.loading = false;
        });
    },
    sampleSelected(e) {
      this.selectedSample = {};
      this.sampleLoading = true;
      this.resultsDialog = true;
      this.$axios.get('samples/' + e.SAMPNUM).then((response) => {
        this.selectedSample = response.data.data;
        this.sampleLoading = false;
      });
    },
    findResult(sample) {
      if (
        this._.find(this.pendingResults, {
          sampnum: sample.SAMPNUM,
        })
      ) {
        return true;
      }
      return false;
    },
    closeDialog() {
      this.resultsDialog = false;
    },
  },
};
</script>

<style></style>
