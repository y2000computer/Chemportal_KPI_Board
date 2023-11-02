<template>
  <v-row>
    <v-col>
      <v-row class="mt-2">
        <v-col
          ><v-text-field
            dense
            outlined
            v-model="search"
            label="Search"
            clearable
        /></v-col>
        <v-col class="text-center">
          <v-btn-toggle color="primary" mandatory>
            <v-btn
              v-for="(group, index) in groupedData"
              :key="'groupButton' + index"
              @click="selectedGroup = group"
              >{{ group.groupHeading }}</v-btn
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
      <v-row class="mt-2">
        <v-col>
          <v-data-table
            :items="tableData"
            :headers="tableHeaders"
            :footer-props="{
              showFirstLastPage: true,
              itemsPerPageOptions: [10, 20, 50],
            }"
            dense
            :search="search"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.client_name | shorten(20) }}</td>
                <td>{{ item.rate_tier }}</td>
                <td
                  v-for="(m, i) in item.months"
                  :key="item.client_id + 'month' + i"
                >
                  <cell-chip
                    :value="parseFloat(m).toFixed(viewOption.dp)"
                    :positive="
                      i == 0
                        ? null
                        : parseFloat(item.months[i]) >
                          parseFloat(item.months[i - 1])
                        ? true
                        : false
                    "
                  ></cell-chip>
                </td>
              </tr> </template
          ></v-data-table>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col>
          <bar-chart
            :chartdata="chartData"
            :options="chartSettings.options"
            style="height:250px"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import cellChip from '../../../../components/tables/cellChip';
import barChart from '../../../../components/charts/bar';
export default {
  components: {
    cellChip,
    barChart,
  },
  props: {
    groupedData: {
      type: Array,
    },
  },
  data() {
    return {
      search: '',
      selectedGroup: {},
      viewOptions: [
        { label: 'ASP', column: 'average_selling_price', dp: '2' },
        { label: 'Samples', column: 'samplesReported', dp: '0' },
        { label: 'Revenue', column: 'invoice_total', dp: '0' },
      ],
      viewOption: {},
      chartColours: [
        '#f9d8b7',
        '#b2c3d9',
        '#f8cb9f',
        '#99afcd',
        '#f6be88',
        '#7f9bc1',
      ],
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
    this.selectedGroup = this.groupedData[0];
    this.viewOption = this.viewOptions[0];
  },
  computed: {
    tableHeaders() {
      let headers = [
        { text: 'Client', value: 'client_name' },
        { text: 'Tier', value: 'rate_tier' },
      ];
      if (this.selectedGroup.clients) {
        this.selectedGroup.clients[0].forEach((m, i) => {
          headers.push({
            text:
              this.$moment()
                .month(m.calendar_month - 1)
                .format('MMM') +
              ' ' +
              this.$moment()
                .year(m.calendar_year)
                .format('YY'),
            value: 'month' + i,
          });
        });
      }
      return headers;
    },
    tableData() {
      let data = [];
      if (!this.selectedGroup.clients) {
        return data;
      }
      this.selectedGroup.clients.forEach((client) => {
        let clientData = {
          client_name: client[0].client_name,
          rate_tier: client[0].rate_tier,
          months: [],
        };
        client.forEach((m, i) => {
          clientData['month' + i] = m[this.viewOption.column];
          clientData.months.push(m[this.viewOption.column]);
        });
        data.push(clientData);
      });
      return data;
    },
    chartData() {
      let chartData = {};
      if (!this.selectedGroup.clients) {
        return chartData;
      }
      chartData.labels = [];
      chartData.datasets = [];
      this.selectedGroup.clients.forEach((r, i) => {
        if (i == 0) {
          chartData.labels = r.map(
            (m) =>
              this.$moment()
                .month(m.calendar_month - 1)
                .format('MMM') +
              ' ' +
              this.$moment()
                .year(m.calendar_year)
                .format('YY')
          );
        }
        if (i <= 5) {
          chartData.datasets.push({
            label: r[0].client_name,
            data: r.map((m) =>
              m[this.viewOption.column] >= 0 ? m[this.viewOption.column] : -1
            ),
            order: 1,
            fill: false,
            backgroundColor: this.chartColours[i],
          });
        }
        //     if (i == 0) {
        //       chartData.labels = r.months.map((m) =>
        //         this.$moment()
        //           .month(m.calendar_month - 1)
        //           .format('MMM')
        //       );
        //     }
      });
      return chartData;
    },
  },
};
</script>

<style></style>
