<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-btn icon class="my-0 mr-3" @click="$router.back()">
            <v-icon>mdi-arrow-left</v-icon> </v-btn
          >Results for Export
        </v-card-title>
        <v-card-text>
          <v-row v-if="!results.length">
            <v-col>No Results Pending</v-col>
          </v-row>
          <v-row v-else align="center">
            <v-col md="3" cols="12">
              <v-text-field
                hide-details
                dense
                outlined
                v-model="search"
                label="Search"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn
                class="float-right"
                x-large
                color="primary"
                :disabled="results.length == 0"
                @click="exportResults"
                >Send To AIS</v-btn
              >
            </v-col>
          </v-row>
          <v-card flat v-for="method in results" :key="method.method">
            <v-row dense>
              <v-col class="subtitle-2">{{ method.method }}</v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  dense
                  :search="search"
                  :items="method.results"
                  :headers="headers"
                >
                  <template v-slot:item="{ item, index }">
                    <tr>
                      <td>{{ item.sampnum }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.det }}</td>
                      <td>{{ item.user }}</td>
                      <td>{{ item.date }}</td>
                      <td>{{ item.time }}</td>
                      <td>{{ item.value }}</td>
                      <td>
                        <v-btn icon @click="removeResult(method.method, index)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Sample',
          value: 'sampnum',
        },
        {
          text: 'Det',
          value: 'name',
        },
        { text: 'Det', value: 'det' },
        {
          text: 'User',
          value: 'user',
        },
        {
          text: 'User',
          value: 'date',
        },
        {
          text: 'User',
          value: 'time',
        },
        {
          text: 'Value',
          value: 'value',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      csvData: {
        path: '\\\\nm-ais01\\results\\',
        filename: '',
        csvRows: [],
      },
    };
  },
  computed: {
    results() {
      return this._.sortBy(this.$store.state.results.results, ['method']);
    },
  },
  methods: {
    removeResult(method, index) {
      this.$store.dispatch('results/removeResult', {
        method: method,
        index: index,
      });
    },
    exportResults() {
      this.results.forEach((method) => {
        var filename =
          method.filePrefix + this.$moment().format('YYMMDDHHmmss');
        this.csvData.filename = filename + '.pla';
        method.results.forEach((result) => {
          this.csvData.csvRows.push([
            result.sampnum,
            '',
            result.det,
            result.value,
            '',
            '',
            '',
            result.user,
            result.date,
            result.time,
            'Chemportal',
            filename,
          ]);
        });
        this.$axios.post('csv/generate-csv', this.csvData).then((response) => {
          this.$store.dispatch('results/clearResults');
        });
      });
    },
  },
};
</script>

<style></style>
