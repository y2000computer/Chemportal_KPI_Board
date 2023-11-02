<template>
  <div>
    <v-row class="mt-2">
      <v-col class="text-center">
        <v-btn-toggle color="primary" mandatory>
          <v-btn
            v-for="(group, key, index) in surcharges"
            :key="'button' + index"
            @click="selectedGroup = group"
            >Tier {{ key }}</v-btn
          >
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table dense :items="selectedGroup" :headers="headers">
          <template v-slot:item.calendar_month="{ item }">
            {{
              $moment()
                .month(item.calendar_month - 1)
                .format('MMM')
            }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <line-chart
          :chartdata="chartData"
          :options="chartSettings.options"
          style="height:250px"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import lineChart from '../../../../components/charts/line';
export default {
  props: {
    surcharges: {
      type: Object,
    },
  },
  components: {
    lineChart,
  },
  data() {
    return {
      selectedGroup: [],
      headers: [
        { text: 'Year', value: 'calendar_year' },
        { text: 'Month', value: 'calendar_month' },
        { text: 'Courier Charges', value: 'courier_charges' },
        { text: 'Minvoice Charges', value: 'minimum_invoice_charges' },
        { text: 'Disposal Charge', value: 'sample_disposal_charges' },
        { text: 'Untested Sample Charges', value: 'untested_sample_charges' },
        { text: 'Brexit', value: 'customs_administration_charges' },
        { text: 'Total Surcharges', value: 'surcharge_total' },
        { text: 'Total Invoices ', value: 'invoice_total' },
        { text: 'Surcharge %', value: 'surcharge_percent' },
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
                id: 'Charges',
                type: 'linear',
                position: 'left',
                ticks: {
                  beginAtZero: true,
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
    this.selectedGroup = this.surcharges['1'];
  },
  computed: {
    chartData() {
      if (!this.selectedGroup[0]) {
        return {};
      }
      let array = _.cloneDeep(this.selectedGroup);
      array = array.reverse();
      let chartData = {
        labels: [],
        datasets: [
          {
            label: 'Courier Charges',
            data: [],
            order: 1,
            yAxisID: 'Charges',
            backgroundColor: '#003883',
            borderColor: '#003883',
            lineTension: 0.0,
            fill: false,
          },
          {
            label: 'Min Invoice Charges',
            data: [],
            order: 1,
            yAxisID: 'Charges',
            backgroundColor: '#EE7D11',
            borderColor: '#EE7D11',
            lineTension: 0.0,
            fill: false,
          },
          {
            label: 'Disposal Charges',
            data: [],
            order: 1,
            yAxisID: 'Charges',
            backgroundColor: '#6fadff',
            borderColor: '#6fadff',
            lineTension: 0.0,
            fill: false,
          },
          {
            label: 'U/T Sample Charges',
            data: [],
            order: 1,
            yAxisID: 'Charges',
            backgroundColor: '#f5af6d',
            borderColor: '#f5af6d',
            lineTension: 0.0,
            fill: false,
          },
          {
            label: 'Brexit Charges',
            data: [],
            order: 1,
            yAxisID: 'Charges',
            backgroundColor: '#d1e5ff',
            borderColor: '#d1e5ff',
            lineTension: 0.0,
            fill: false,
          },
        ],
      };
      let l = array.length - 10;
      array.forEach((m, i) => {
        if (i < l) {
          return;
        }
        chartData.labels.push(
          this.$moment()
            .month(m.calendar_month - 1)
            .format('MMM') +
            ' ' +
            m.calendar_year
        );
        chartData.datasets[0].data.push(m.courier_charges);
        chartData.datasets[1].data.push(m.minimum_invoice_charges);
        chartData.datasets[2].data.push(m.disposal_charges);
        chartData.datasets[3].data.push(m.untested_sample_charges);
        chartData.datasets[4].data.push(m.customs_administration_charges);
      });
      return chartData;
    },
  },
};
</script>

<style></style>
