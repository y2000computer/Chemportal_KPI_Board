<template>
  <div>
    <v-row class="mt-3" v-if="overviewData.ytd">
      <v-col>
        <v-card outlined>
          <v-card-text class="text-center">
            <v-row><v-col class="text-subtitle-1">ASP YTD</v-col></v-row>
            <v-row
              ><v-col class="text-h3"
                >£{{
                  parseFloat(overviewData.ytd.average_selling_price).toFixed(2)
                }}</v-col
              ></v-row
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined>
          <v-card-text class="text-center">
            <v-row
              ><v-col class="text-subtitle-1">ASP Current Month</v-col></v-row
            >
            <v-row
              ><v-col class="text-h3">{{
                overviewData.currentMonth !== null
                  ? '£' +
                    parseFloat(
                      overviewData.currentMonth.average_selling_price
                    ).toFixed(2)
                  : '-'
              }}</v-col></v-row
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined>
          <v-card-text class="text-center">
            <v-row><v-col class="text-subtitle-1">ASP Last Month</v-col></v-row>
            <v-row
              ><v-col class="text-h3"
                >£{{
                  parseFloat(
                    overviewData.previousMonth.average_selling_price
                  ).toFixed(2)
                }}</v-col
              ></v-row
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined>
          <v-card-text class="text-center">
            <v-row><v-col class="text-subtitle-1">ASP % Change</v-col></v-row>
            <v-row>
              <v-col class="text-h3">
                {{
                  overviewData.currentMonth !== null
                    ? aspChange(
                        overviewData.previousMonth.average_selling_price,
                        overviewData.currentMonth.average_selling_price
                      )
                    : '-'
                }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      ><v-col class="text-center">
        <v-btn-toggle color="primary" mandatory>
          <v-btn
            v-for="(group, index) in summaryGroups"
            :key="'groupButton' + index"
            @click="summaryGroup = group"
            >{{ group.label }}</v-btn
          >
        </v-btn-toggle></v-col
      ></v-row
    >
    <v-row class="mt-3">
      <v-col>
        <v-simple-table v-if="selectedQuarter[0]" dense>
          <thead>
            <tr>
              <th></th>
              <th>
                ASP Q{{ selectedQuarter[0][1].calendar_quarter }}
                {{ selectedQuarter[0][1].calendar_year }}
              </th>
              <th>Samples Reported</th>
              <th>
                % Change
              </th>
              <th>
                ASP Q{{ selectedQuarter[0][2].calendar_quarter }}
                {{ selectedQuarter[0][2].calendar_year }}
              </th>
              <th>Samples Reported</th>
              <th>
                % Change
              </th>
              <th>
                ASP Q{{ selectedQuarter[0][3].calendar_quarter }}
                {{ selectedQuarter[0][3].calendar_year }}
              </th>
              <th>Samples Reported</th>
              <th>
                % Change
              </th>
              <th>
                ASP Q{{ selectedQuarter[0][4].calendar_quarter }}
                {{ selectedQuarter[0][4].calendar_year }}
              </th>
              <th>Samples Reported</th>
              <th>
                % Change
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(group, index) in filteredQuarters"
              :key="'groupRow' + index"
            >
              <td>
                {{
                  summaryGroup.prefix + ' ' + group[0][summaryGroup.labelColumn]
                }}
              </td>
              <template v-for="(quarter, qIndex) in group">
                <td :key="'quarter' + index + qIndex" class="font-weight-bold">
                  £{{ parseFloat(quarter.average_selling_price).toFixed(2) }}
                </td>
                <td :key="'qQuarterSamples' + qIndex">
                  {{ parseInt(quarter.samplesReported) }}
                </td>
                <td :key="'qQuarterChange' + qIndex">
                  <cell-chip
                    :value="
                      aspChange(
                        selectedQuarter[index][qIndex].average_selling_price,
                        quarter.average_selling_price
                      ) + '%'
                    "
                    :positive="
                      aspChange(
                        selectedQuarter[index][qIndex].average_selling_price,
                        quarter.average_selling_price
                      ) > 0
                    "
                  />
                </td>
              </template>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row class="mt-3"
      ><v-col>
        <bar-chart
          :chartdata="chartData"
          :options="chartSettings.options"
          style="height:250px"/></v-col
    ></v-row>
  </div>
</template>

<script>
import barChart from '../../../../components/charts/bar';
import cellChip from '../../../../components/tables/cellChip';

export default {
  props: {
    overviewData: {
      type: Object,
    },
    monthlyData: {
      type: Array,
    },
    monthlyRegionData: {
      type: Array,
    },
    quarterlyRegionData: {
      type: Array,
    },
    monthlyTierData: {
      type: Array,
    },
    quarterlyTierData: {
      type: Array,
    },
  },
  components: {
    barChart,
    cellChip,
  },
  data() {
    return {
      summaryGroups: [
        {
          label: 'Tiers',
          monthlyData: 'monthlyTierData',
          quarterlyData: 'quarterlyTierData',
          prefix: 'Tier ',
          labelColumn: 'rate_tier',
        },
        {
          label: 'Regions',
          monthlyData: 'monthlyRegionData',
          quarterlyData: 'quarterlyRegionData',
          prefix: 'Region ',
          labelColumn: 'region',
        },
      ],
      summaryGroup: {},
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
                scaleLabel: {
                  display: true,
                  labelString: 'Average Selling Price (£)',
                },
                id: 'ASP',
                type: 'linear',
                position: 'left',
                ticks: {
                  beginAtZero: false,
                },
                gridLines: {
                  display: false,
                },
              },
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Revenue (£)',
                },
                id: 'Revenue',
                type: 'linear',
                position: 'right',
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
    this.summaryGroup = this.summaryGroups[0];
  },

  computed: {
    selectedQuarter() {
      return this[this.summaryGroup.quarterlyData];
    },
    selectedMonth() {
      return this[this.summaryGroup.monthlyData];
    },
    filteredQuarters() {
      return this.selectedQuarter.map((tier) => {
        return tier.filter((t, i) => {
          return i > 0;
        });
      });
    },
    chartData() {
      let chartData = {};
      chartData.labels = [];
      chartData.datasets = [];
      this.selectedMonth.forEach((r, index) => {
        if (index == 0) {
          chartData.labels = r.map(
            (m) =>
              this.$moment()
                .month(m.calendar_month - 1)
                .format('MMM') +
              ' - ' +
              m.calendar_year
          );
        }
        chartData.datasets.push({
          label: this.summaryGroup.prefix + r[0][this.summaryGroup.labelColumn],
          yAxisID: 'ASP',
          order: 1,
          fill: false,
          backgroundColor: this.chartColours[index],
          data: r.map((m) => parseFloat(m.average_selling_price).toFixed(2)),
        });
      });
      chartData.datasets.push({
        label: 'Overall',
        yAxisID: 'ASP',
        order: 0,
        fill: false,
        type: 'line',
        lineTension: 0,
        pointRadius: 0,
        backgroundColor: '#003883',
        borderColor: '#003883',
        borderWidth: 5,
        data: this.monthlyData.map((m) =>
          parseFloat(m.average_selling_price).toFixed(2)
        ),
      });
      chartData.datasets.push({
        label: 'Revenue',
        yAxisID: 'Revenue',
        order: 0,
        fill: false,
        type: 'line',
        lineTension: 0,
        pointRadius: 0,
        backgroundColor: '#EE7D11',
        borderColor: '#EE7D11',
        borderWidth: 5,
        data: this.monthlyData.map((m, i) =>
          i < this.monthlyData.length - 1
            ? parseFloat(m.invoice_total).toFixed(0)
            : null
        ),
      });
      return chartData;
    },
  },
  methods: {
    getAspChange() {
      if (this.overviewData.currentMonth == null) {
        return '-';
      }
      return (
        (
          ((parseFloat(this.overviewData.currentMonth.average_selling_price) -
            parseFloat(this.overviewData.previousMonth.average_selling_price)) /
            parseFloat(this.overviewData.previousMonth.average_selling_price)) *
          100
        )
          .toFixed(1)
          .toString() + '%'
      );
    },
    aspChange(oldVal, newVal) {
      return (
        ((parseFloat(newVal) - parseFloat(oldVal)) /
          Math.abs(parseFloat(oldVal))) *
        100
      ).toFixed(1);
    },
  },
};
</script>

<style></style>
