<template
  ><div>
    <v-row class="mt-2">
      <v-col class="text-center">
        Region
        <v-btn-toggle color="primary" mandatory>
          <v-btn
            v-for="(group, index) in groupedData"
            :key="'groupButton' + index"
            @click="selectedGroup = group"
            >{{ group.region }}</v-btn
          >
        </v-btn-toggle>
      </v-col>
      <v-col
        ><v-btn-toggle color="primary" mandatory>
          <v-btn
            width="100"
            v-for="option in viewOptions"
            :key="'optionButton' + option.column"
            @click="viewOption = option"
            >{{ option.label }}</v-btn
          >
        </v-btn-toggle></v-col
      >
    </v-row>

    <v-row>
      <v-col>
        <!-- <v-simple-table dense>
          <thead>
            <tr>
              <th>Client</th>
              <th>Tier</th>
              <th></th>
              <th
                v-for="m in this.selectedRegion[Object.keys(selectedRegion)[0]]"
                :key="'aspMonthHeader' + m.calendar_year + m.calendar_month"
              >
                {{
                  $moment()
                    .month(m.calendar_month - 1)
                    .format('MMM') +
                    ' ' +
                    $moment()
                      .year(m.calendar_year)
                      .format('YY')
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(client, key) in selectedRegion">
              <tr :key="'clientAspRow' + key">
                <td>{{ client[0].client_name | shorten(20) }}</td>
                <td>{{ client[0].rate_tier }}</td>
                <td />
                <td
                  v-for="(month, index) in client"
                  :key="'clientMonthAsp' + key + index"
                >
                  <cell-chip
                    :value="
                      parseFloat(month[viewOption.column]).toFixed(
                        viewOption.dp
                      )
                    "
                    :positive="getIcon(client, index)"
                  />
                </td></tr
            ></template>
          </tbody>
        </v-simple-table> -->

        <v-data-table :items="tableData" :headers="tableHeaders" dense>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col>
        <bar-chart
          :chartdata="chartData"
          :options="chartSettings.options"
          style="height:300px"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import cellChip from '../../../../components/tables/cellChip';
import barChart from '../../../../components/charts/bar';
export default {
  components: {
    barChart,
    cellChip,
  },
  props: {
    groupedData: {
      type: Array,
    },
  },
  data() {
    return {
      chartColours: [
        '#f9d8b7',
        '#b2c3d9',
        '#f8cb9f',
        '#99afcd',
        '#f6be88',
        '#7f9bc1',
      ],
      selectedGroup: {},
      viewOptions: [
        { label: 'ASP', column: 'average_selling_price', dp: '2' },
        { label: 'Samples', column: 'samplesReported', dp: '0' },
        { label: 'Revenue', column: 'invoice_total', dp: '0' },
      ],
      viewOption: '',
      chartSettings: {
        options: {
          title: {
            display: false,
            text: 'Monthly ASP & Sample Numbers',
          },
          legend: {
            display: true,
            position: 'right',
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                id: 'Samples',
                type: 'linear',
                position: 'left',
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
            xAxes: [
              {
                ticks: {},
              },
            ],
          },
        },
      },
    };
  },
  mounted() {
    //this.selectedRegion = this.regionData[Object.keys(this.regionData)[0]];
    this.selectedGroup = this.groupedData[0];
    this.viewOption = this.viewOptions[0];
  },
  computed: {
    tableHeaders() {
      if (!this.selectedGroup.clients) {
        return [];
      }
      let headers = [
        { text: 'Client', value: 'client_name' },
        { text: 'Tier', value: 'rate_tier' },
        { text: 'Tier', value: 'rate_tier' },
      ];
      this.selectedGroup.clients[0].forEach((m) => {
        headers.push({
          text:
            this.$moment()
              .month(m.calendar_month - 1)
              .format('MMM') +
            ' ' +
            this.$moment()
              .year(m.calendar_year)
              .format('YY'),
          value: 'test',
        });
      });
    },
    tableData() {
      if (!this.selectedGroup.clients[0]) {
        return [];
      }
      let tableData = [];
      this.selectedGroup.clients.forEach((client) => {
        console.log(client[0].client_name);
        // tableData.push({
        //   client: 'Test',
        //   tier: 'Test',
        // });
      });
      return tableData;
    },
    chartData() {
      let chartData = {};
      chartData.labels = [];
      chartData.datasets = [];
      let i = 0;
      this.selectedGroup.clients.forEach((r) => {
        if (i == 5) {
          return;
        }
        if (i == 0) {
          chartData.labels = r.map((m) =>
            this.$moment()
              .month(m.calendar_month - 1)
              .format('MMM')
          );
        }
        chartData.datasets.push({
          label: r[0].client_name,
          data: r.map((m) =>
            m[this.viewOption.column] >= 0 ? m[this.viewOption.column] : -1
          ),
          order: 1,
          fill: false,
          backgroundColor: this.chartColours[i],
        });
        i++;
      });
      return chartData;
    },
  },
  methods: {
    getIcon(client, index) {
      if (!client[index - 1]) {
        return null;
      }
      if (
        parseFloat(client[index][this.viewOption.column]) >
        parseFloat(client[index - 1][this.viewOption.column])
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style></style>
