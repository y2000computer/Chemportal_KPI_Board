<template>
  <div>
    <v-row class="mt-2">
      <v-col class="text-center">
        <v-btn-toggle color="primary" mandatory>
          <v-btn
            v-for="(year, index) in historyData"
            :key="'aspYearButton' + index"
            @click="selectedYear = year"
            >{{ year[0].calendar_year }}</v-btn
          >
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense>
          <thead>
            <tr>
              <th></th>
              <th v-for="n in 12" :key="'aspMonthHeader' + n">
                {{
                  $moment()
                    .month(n - 1)
                    .format('MMM')
                }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Revenue</td>
              <td v-for="n in 12" :key="'aspMonthRev' + n">
                {{
                  selectedYear[n - 1]
                    ? '£' + selectedYear[n - 1].invoice_total
                    : '-'
                }}
              </td>
            </tr>
            <tr>
              <td>Samples</td>
              <td v-for="n in 12" :key="'aspMonthSam' + n">
                {{
                  selectedYear[n - 1]
                    ? selectedYear[n - 1].SamplesReported
                    : '-'
                }}
              </td>
            </tr>
            <tr>
              <td>WDs</td>
              <td v-for="n in 12" :key="'aspMonthWd' + n">
                {{
                  selectedYear[n - 1] ? selectedYear[n - 1].workingDays : '-'
                }}
              </td>
            </tr>
            <tr>
              <td>Samples Per Day</td>
              <td v-for="n in 12" :key="'aspMonthSamPerDay' + n">
                {{
                  selectedYear[n - 1]
                    ? (
                        selectedYear[n - 1].SamplesReported /
                        selectedYear[n - 1].workingDays
                      ).toFixed(0)
                    : '-'
                }}
              </td>
            </tr>
            <tr>
              <td>ASP</td>
              <td
                class="font-weight-bold"
                v-for="n in 12"
                :key="'aspMonthAsp' + n"
              >
                {{
                  selectedYear[n - 1]
                    ? '£' + selectedYear[n - 1].average_selling_price
                    : '-'
                }}
              </td>
            </tr>
            <tr>
              <td>ASP</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col>Monthly ASP & Sample Numbers</v-col>
    </v-row>
    <v-row
      ><v-col>
        <line-chart
          :chartdata="chartData"
          :options="chartSettings.options"
          style="height:350px"
        /> </v-col
    ></v-row>
  </div>
</template>

<script>
import lineChart from '../../../../components/charts/line';
export default {
  components: {
    lineChart,
  },
  props: {
    historyData: {
      type: Array,
    },
  },
  data() {
    return {
      selectedYear: {},
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
                  suggestedMin: 6000,
                  suggestedMax: 18000,
                },
              },
              {
                id: 'ASP',
                type: 'linear',
                position: 'right',
                ticks: {
                  beginAtZero: false,
                  suggestedMin: 40,
                  suggestedMax: 60,
                },
                gridLines: {
                  display: false,
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

  computed: {
    chartData() {
      if (!this.selectedYear[0]) {
        return {};
      }
      let chartData = {};
      chartData.labels = [];
      chartData.datasets = [
        {
          label: 'Samples Reported',
          data: [],
          order: 1,
          yAxisID: 'Samples',
          backgroundColor: '#003883',
          borderColor: '#003883',
          lineTension: 0.0,
          fill: false,
        },
        {
          label: 'ASP (£)',
          data: [],
          order: 1,
          yAxisID: 'ASP',
          backgroundColor: '#EE7D11',
          borderColor: '#EE7D11',
          lineTension: 0.0,
          fill: false,
        },
      ];
      var i;
      for (i = 0; i < 12; i++) {
        chartData.labels.push(
          this.$moment()
            .month(i)
            .format('MMM') +
            ' ' +
            this.selectedYear[0].calendar_year
        );
      }
      this.selectedYear.forEach((m, i) => {
        chartData.datasets[0].data.push(m.SamplesReported);
        chartData.datasets[1].data.push(m.average_selling_price);
      });
      return chartData;
    },
  },
  mounted() {
    this.selectedYear = this.historyData[0];
  },
};
</script>

<style></style>
