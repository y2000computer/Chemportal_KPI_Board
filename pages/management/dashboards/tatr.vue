<template>
  <v-row>
    <v-col>
      <v-dialog v-model="tatrDialog.show" width="1000">
        <tatr-info-dialog
          :loading="tatrDialog.loading"
          :samples="tatrDialog.samples"
          :lab="highlightedRow.lab"
          :title="tatrDialog.title"
          :subcon="tatrDialog.subcon"
        />
      </v-dialog>

      <v-row align="center">
        <v-col class="font-weight-bold"
          >Turaround Time Reliability - {{ title }}</v-col
        >
        <v-col class="font-weight-bold text-center">
          <v-alert color="tableWarnings" dense v-if="filterTitle">{{
            filterTitle
          }}</v-alert>
        </v-col>
        <v-col>
          <div class="float-right">
            <v-menu
              :close-on-content-click="false"
              offset-y
              v-model="optionsMenu"
            >
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>settings</v-icon>
                </v-btn>
              </template>
              <v-card outlined width="400">
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-select
                        label="Date Grouping"
                        hide-details
                        outlined
                        dense
                        :items="dateRanges"
                        v-model="dateRange"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-autocomplete
                        :items="clients"
                        hide-details
                        return-object
                        item-text="CLIENTNAME"
                        label="Client"
                        v-model="client"
                        outlined
                        dense
                        clearable
                        @change="salesRegion = ''"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-select
                        label="Sales Region"
                        :items="salesRegions"
                        clearable
                        item-value="value"
                        item-text="name"
                        outlined
                        dense
                        v-model="salesRegion"
                        @change="client = ''"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        class="float-right"
                        color="primary"
                        @click="getTatr"
                        >Update</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
            <v-btn icon :loading="loading" :disabled="loading" @click="getTatr">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn icon @click="helpDialog = !helpDialog">
              <v-icon>help</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row justify="space-around">
        <v-col lg="3" md="4" cols="12">
          <main-stat-card
            :loading="loading"
            title="TAT-R"
            :value="
              !loading && currentTatr[highlightedRow.percent]
                ? currentTatr[highlightedRow.percent] + '%'
                : '-'
            "
          ></main-stat-card>
        </v-col>
        <v-col lg="3" md="4" cols="12">
          <main-stat-card
            title="Samples Reported"
            :loading="loading"
            :value="!loading ? currentTatr[highlightedRow.total] : '-'"
          ></main-stat-card>
        </v-col>

        <v-col lg="3" md="4" cols="12">
          <main-stat-card
            title="Samples On Time"
            :loading="loading"
            :value="!loading ? currentTatr[highlightedRow.onTime] : '-'"
          ></main-stat-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6" sm="12">
          <v-card outlined>
            <v-card-text>
              <v-row dense>
                <v-col>TAT-R Breakdown - {{ title }}</v-col>
              </v-row>
              <v-data-table
                :loading="loading"
                dense
                :items="tatrRows"
                :headers="tatrBreakdownHeaders"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:item="{ item }">
                  <tr @click="rowSelected(item)">
                    <td>
                      <v-icon
                        v-if="highlightedRow.total == item.total"
                        color="primary"
                        >mdi-check-circle</v-icon
                      >
                      <v-icon v-else>mdi-checkbox-blank-circle-outline</v-icon>
                    </td>
                    <td>{{ item.label }}</td>
                    <td>{{ currentTatr[item.total] }}</td>
                    <td>{{ currentTatr[item.onTime] }}</td>
                    <td>{{ currentTatr[item.percent] }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-card class="mt-4" outlined>
            <v-card-text>
              <v-row dense>
                <v-col>TAT-R Trend ({{ this.highlightedRow.label }})</v-col>
              </v-row>

              <line-chart
                style="height:225px"
                v-if="!tatRChart.loading"
                :options="tatRChart.options"
                :chartdata="tatRChart.chartData"
              ></line-chart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6" sm="12">
          <v-card outlined>
            <v-card-text>
              <v-row dense>
                <v-col>TAT-R History ({{ this.highlightedRow.label }})</v-col>
              </v-row>

              <v-data-table
                :loading="loading"
                dense
                show-expand
                :headers="tatRTableHeaders"
                :items="filteredTatr"
                :options="tatrTable.options"
                :footer-props="tatrTable.footerProps"
                item-key="id"
              >
                <template v-slot:item.calendar_date="{ item }">{{
                  $moment(item.calendar_date).format('DD/MM/YY')
                }}</template>
                <template v-slot:item.calendar_week="{ item }">
                  {{
                    $moment()
                      .year(item.calendar_year)
                      .isoWeek(item.calendar_week)
                      .startOf('isoweek')
                      .format('Do MMMM')
                  }}
                </template>
                <template v-slot:item.calendar_month="{ item }">{{
                  $moment(item.calendar_month, 'MM').format('MMM')
                }}</template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <v-card flat>
                      <v-card-text>
                        <v-simple-table dense>
                          <thead>
                            <tr>
                              <th></th>
                              <th>Group</th>
                              <th>Reported</th>
                              <th>On Time</th>
                              <th>Tat-R (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(row, index) in tatrRows"
                              :key="'row' + index"
                              :class="
                                highlightedRow.total == row.total
                                  ? 'font-weight-bold'
                                  : ''
                              "
                            >
                              <td>
                                <v-icon
                                  v-if="highlightedRow.total == row.total"
                                  color="primary"
                                  >mdi-check-circle</v-icon
                                >
                                <v-icon v-else
                                  >mdi-checkbox-blank-circle-outline</v-icon
                                >
                              </td>
                              <td>{{ row.label }}</td>
                              <td>{{ item[row.total] }}</td>
                              <td>{{ item[row.onTime] }}</td>
                              <td>{{ item[row.percent] }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </td>
                </template>
                <template
                  v-if="dateRange != 'Month'"
                  v-slot:item.view-details="{ item }"
                >
                  <v-btn small icon @click="openTatrDialog(item)">
                    <v-icon>mdi-information-outline</v-icon>
                  </v-btn>
                  <v-btn small icon @click="openTatrTestDialog(item)">
                    <v-icon>mdi-test-tube</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="tatrTestDialog" max-width="1200" height="1600"
        ><v-card>
          <v-card-title>Late Tests</v-card-title>
          <v-card-text>
            <v-data-table
              dense
              :items="tatrTestData"
              :headers="tatrTestHeaders"
              disable-pagination
              hide-default-footer
              group-by="job_id"
              :loading="loading"
            >
              <template v-slot:item.due_date="{ item }">
                {{ $moment(item.due_date).format('DD-MM-YY') }}
              </template>
              <template v-slot:item.test_added="{ item }">
                {{ $moment(item.test_added).format('DD-MM-YY') }}
              </template>
              <template v-slot:item.prep_time="{ item }">
                {{ $moment(item.available_to_lab).format('DD-MM-YY') }}
              </template>
              <template v-slot:item.result_time="{ item }">
                {{ $moment(item.result_time).format('DD-MM-YY') }}
              </template>
            </v-data-table>
          </v-card-text></v-card
        ></v-dialog
      >
      <v-dialog v-model="helpDialog" width="800" height="1600">
        <v-card>
          <v-card-title>TAT-R</v-card-title>
          <v-card-text>
            <div class="font-weight-bold">Definition</div>
            <p>
              TAT-R (Turnaround Time - Reliability) is the percentage of Samples
              Reported by (at or before) the Initially Confirmed Due Date and
              Time among all Samples Reported during a given time period and for
              a defined perimeter.
            </p>
            <div class="font-weight-bold">Instructions</div>
            <p>
              TAT-R is displayed at the top of the page. It is inititally
              displayed by day. This can be changed to Week or Month in the
              settings.
            </p>
            <p>
              The TAT-R Breakdown box shows the current day/week/months TAT-R
              broken down into different groups. Any group can be selected to
              update the trend graph and the history table.
            </p>
            <p>
              The TAT-R History displays the previous days/weeks/months TAT-R
              for the selected group. This can be changed by selected in the
              group in the TAT-R breakdown table. Each row can be expanded to
              show all groups for that time.
            </p>
            <p>
              The settings options allows you to change the date grouping that
              TAT-R is displayed in, as well as filter by client or sales
              region. To apply the filter simply change the options and click
              the update button.
            </p>
            <div class="font-weight-bold">Subcon TAT-R</div>
            <p>
              Samples with subcontracted analysis has an additional due date and
              reported date to allow the measure of TAT-R for both the internal
              and subcontracted testing seperately. Only the internal testing on
              a sample will contribute to the overall TAT-R, with the
              subcontracted testing TAT-R reported seperately.
            </p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import mainStatCard from './components/mainStatCard';
import tatrInfoDialog from './components/tatrInfoDialog';
import lineChart from '../../../components/charts/line';
export default {
  components: { mainStatCard, tatrInfoDialog, lineChart },
  data() {
    return {
      date: this.$moment(),
      loading: true,
      optionsMenu: false,
      helpDialog: false,
      tatrTestDialog: false,
      tatrTestData: [],
      tatrTestHeaders: [
        { text: 'Sample', value: 'sample_id' },
        { text: 'Job', value: 'job_id' },
        { text: 'Due', value: 'due_date' },
        { text: 'Test', value: 'test_name' },
        { text: 'Test Added', value: 'test_added' },
        { text: 'Prep Complete', value: 'prep_time' },
        { text: 'Result Complete', value: 'result_time' },
        { text: 'Days: Prep-Comp', value: 'working_days' },
      ],
      filterTitle: '',
      tatr: [],
      dateRange: 'Day',
      clients: [],
      client: '',
      salesRegions: [
        { name: 'East', value: 'E' },
        { name: 'Ireland', value: 'I' },
        { name: 'North', value: 'N' },
        { name: 'Poland', value: 'P' },
        { name: 'Scotland', value: 'S' },
        { name: 'West', value: 'W' },
      ],
      salesRegion: '',
      dateRanges: ['Day', 'Week', 'Month'],
      tatrRows: [
        {
          total: 'TotalSamplesReported',
          onTime: 'TotalSamplesOnTime',
          percent: 'PercentSamplesOnTime',
          label: 'Overall',
          lab: false,
          sampleFilter: '',
          highlight: true,
        },
        {
          total: 'InternalSamplesReported',
          onTime: 'InternalSamplesOnTime',
          percent: 'PercentInternalSamplesOnTime',
          label: 'Internal',
          lab: false,
          sampleFilter: '&internal=1',
          highlight: false,
        },
        {
          total: 'OrganicsSamplesReported',
          onTime: 'OrganicsSamplesOnTime',
          percent: 'PercentOrganicsSamplesOnTime',
          label: 'Organics',
          sampleFilter: '&department=ORGANICS',
          lab: true,
          highlight: false,
        },
        {
          total: 'InorganicsSamplesReported',
          onTime: 'InorganicsSamplesOnTime',
          percent: 'PercentInorganicsSamplesOnTime',
          sampleFilter: '&department=INORGANICS',
          label: 'Inorganics',
          lab: true,
          highlight: false,
        },
        {
          total: 'PrepSamplesReported',
          onTime: 'PrepSamplesOnTime',
          percent: 'PercentPrepSamplesOnTime',
          label: 'Prep',
          lab: true,
          sampleFilter: '&department=PREP',
          highlight: false,
        },
        {
          total: 'AsbestosSamplesReported',
          onTime: 'AsbestosSamplesOnTime',
          percent: 'PercentAsbestosSamplesOnTime',
          label: 'Asbestos',
          lab: true,
          sampleFilter: '&department=ASBESTOS',
          highlight: false,
        },
        {
          total: 'ThreeDayTASamplesReported',
          onTime: 'ThreeDayTASamplesOnTime',
          percent: 'PercentThreeDayTASamplesOnTime',
          label: '3 Day TA',
          lab: false,
          sampleFilter: '&turnaround=3',
          highlight: false,
        },
        {
          total: 'FourDayTASamplesReported',
          onTime: 'FourDayTASamplesOnTime',
          percent: 'PercentFourDayTASamplesOnTime',
          label: '4 Day TA',
          lab: false,
          sampleFilter: '&turnaround=4',
          highlight: false,
        },
        {
          total: 'FiveSixDayTASamplesReported',
          onTime: 'FiveSixDayTASamplesOnTime',
          percent: 'PercentFiveSixDayTASamplesOnTime',
          label: '5 Day TA',
          lab: false,
          sampleFilter: '&turnaround=5',
          highlight: false,
        },
        {
          total: 'SevenEightNineDayTASamplesReported',
          onTime: 'SevenEightNineDayTASamplesOnTime',
          percent: 'PercentSevenEightNineDayTASamplesOnTime',
          label: '7 Day TA',
          lab: false,
          sampleFilter: '&turnaround=7',
          highlight: false,
        },
        {
          total: 'TenDayTASamplesReported',
          onTime: 'TenDayTASamplesOnTime',
          percent: 'PercentTenDayTASamplesOnTime',
          label: '10 Day TA',
          lab: false,
          sampleFilter: '&turnaround=10',
          highlight: false,
        },
        {
          total: 'TenDayPlusSamplesReported',
          onTime: 'TenDayPlusSamplesOnTime',
          percent: 'PercentTenDayPlusSamplesOnTime',
          label: '>10 Day TA',
          lab: false,
          sampleFilter: '&turnaround=11',
          highlight: false,
        },
        {
          total: 'SubconSamplesReported',
          onTime: 'SubconSamplesOnTime',
          percent: 'PercentSubconSamplesOnTime',
          label: 'Subcon',
          lab: false,
          sampleFilter: '&subcon=1',
          highlight: false,
        },
      ],
      highlightedRow: {
        total: 'TotalSamplesReported',
        onTime: 'TotalSamplesOnTime',
        percent: 'PercentSamplesOnTime',
        label: 'Overall',
        lab: false,
        sampleFilter: '',
        highlight: true,
      },
      tatrBreakdownHeaders: [
        { text: '', value: 'select', sortable: false },
        { text: 'Group', value: 'group', sortable: false },
        { text: 'Samples Reported', value: 'total', sortable: false },
        { text: 'Samples On Time', value: 'onTime', sortable: false },
        { text: 'TAT-R (%)', value: 'percent', sortable: false },
      ],
      tatrTable: {
        options: {
          itemsPerPage: 20,
        },
        footerProps: {
          showFirstLastPage: true,
          itemsPerPageOptions: [20, 50, 100, -1],
        },
      },
      tatRChart: {
        loading: false,
        options: {
          legend: {
            position: 'right',
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            ],
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          responsive: true,
          maintainAspectRatio: false,
        },
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'TAT-R',
              data: [],
              fill: false,
              lineTension: 0,
              borderColor: this.$vuetify.theme.themes[
                this.$vuetify.theme.dark ? 'dark' : 'light'
              ].primary,
            },
          ],
        },
      },
      tatrDialog: {
        show: false,
        title: '',
        samples: [],
        subcon: false,
        dates: {
          day: '',
          week: '',
          month: '',
        },
      },
    };
  },
  mounted() {
    this.getClients();
    this.getTatr();
  },
  computed: {
    filteredTatr() {
      if (!this.loading) {
        return this.tatr.filter((item) => {
          if (item.PercentSamplesOnTime) {
            if (this.dateRange == 'Day') {
              return item.calendar_date <= this.date.format('YYYY-MM-DD');
            }
            if (this.dateRange == 'Month') {
              return (
                item.calendar_year < this.date.format('YYYY') ||
                (item.calendar_year == this.date.format('YYYY') &&
                  parseInt(item.calendar_month) <= this.date.format('M'))
              );
            }
            if (this.dateRange == 'Week') {
              return (
                item.calendar_year < this.date.format('YYYY') ||
                (item.calendar_year == this.date.format('YYYY') &&
                  parseInt(item.calendar_week) <= this.date.format('W'))
              );
            }
          }
        });
      }
      return [];
    },
    currentTatr() {
      if (!this.loading) {
        if (this.dateRange == 'Day') {
          return this._.find(this.tatr, [
            'calendar_date',
            this.date.format('YYYY-MM-DD'),
          ]);
        }
        if (this.dateRange == 'Week') {
          return this._.find(this.tatr, {
            calendar_year: this.date.format('YYYY'),
            calendar_week: this.date.format('W'),
          });
        }
        if (this.dateRange == 'Month') {
          return this._.find(this.tatr, {
            calendar_year: this.date.format('YYYY'),
            calendar_month: this.date.format('M'),
          });
        }
      }
      return [];
    },
    tatRTableHeaders() {
      var headers = [];
      if (this.dateRange == 'Day') {
        headers.push({
          text: 'Date',
          value: 'calendar_date',
          sortable: false,
        });
      }
      if (this.dateRange == 'Week') {
        headers.push(
          { text: 'Year', value: 'calendar_year', sortable: false },
          { text: 'Week Commencing', value: 'calendar_week', sortable: false }
        );
      }
      if (this.dateRange == 'Month') {
        headers.push(
          { text: 'Year', value: 'calendar_year', sortable: false },
          { text: 'Month', value: 'calendar_month', sortable: false }
        );
      }
      headers.push({
        text: 'Samples Reported',
        value: this.highlightedRow.total,
        sortable: false,
      });
      headers.push({
        text: 'Samples On Time',
        value: this.highlightedRow.onTime,
        sortable: false,
      });
      headers.push({
        text: 'TAT-R (%)',
        value: this.highlightedRow.percent,
        sortable: false,
      });
      headers.push(
        { text: '', value: 'data-table-expand' },
        { text: '', value: 'view-details', sortable: false }
      );
      return headers;
    },
    calendar_date() {
      if (this.dateRange == 'Day') {
        return 'calendar_date';
      }
      if (this.dateRange == 'Week') {
        return 'calendar_year + calendar_week';
      }
      if (this.dateRange == 'Month') {
        return 'calendar_year + calendar_month';
      }
    },
    title() {
      if (this.dateRange == 'Day') {
        return this.date.format('Do MMMM YYYY');
      }
      if (this.dateRange == 'Week') {
        return 'w/c ' + this.date.startOf('isoweek').format('Do MMMM YYYY');
      }
      if (this.dateRange == 'Month') {
        return this.date.format('MMMM YYYY');
      }
    },
  },
  methods: {
    getTatr() {
      this.loading = true;
      this.filterTitle = '';
      this.optionsMenu = false;
      let route = 'stats/dw-tatr?dateRange=' + this.dateRange.toLowerCase();
      if (this.client) {
        route = route + '&client=' + this.client.CLIENT;
        this.filterTitle = 'Client: ' + this.client.CLIENTNAME;
      }
      if (this.salesRegion) {
        route = route + '&region=' + this.salesRegion;
        this.filterTitle = 'Sales Region: ' + this.salesRegion;
      }

      this.$axios
        .get(route)
        .then((response) => {
          this.tatr = response.data.data;
          this.updateChart();
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          this.searchError = 'Error Finding Job, Please Try Again';
        });
    },
    getClients() {
      this.$axios.get('clients/ids').then((response) => {
        this.clients = response.data.data;
      });
    },
    rowSelected(item) {
      this.highlightedRow = item;
      this.updateChart();
    },
    updateChart() {
      this.tatRChart.loading = true;
      this.tatRChart.chartData.labels = [];
      this.tatRChart.chartData.datasets[0].data = [];
      this.$nextTick(() => {
        let i = 0;
        this.filteredTatr.forEach((date) => {
          if (i < 50 && date[this.highlightedRow.percent]) {
            let label = '';
            if (this.dateRange == 'Day') {
              label = this.$moment(date.calendar_date).format('DD/MM/YY');
            }
            if (this.dateRange == 'Week') {
              label = 'Wk ' + date.calendar_week + ' ' + date.calendar_year;
            }
            if (this.dateRange == 'Month') {
              label =
                this.$moment(date.calendar_month, 'MM').format('MMM') +
                ' ' +
                date.calendar_year;
            }
            this.tatRChart.chartData.labels.unshift(label);
            this.tatRChart.chartData.datasets[0].data.unshift(
              date[this.highlightedRow.percent]
            );
          }
          i++;
        });
      });
      this.$nextTick(() => {
        this.tatRChart.loading = false;
      });
    },
    openTatrDialog(item) {
      this.tatrDialog.loading = true;
      this.tatrDialog.show = !this.tatrDialog.show;
      this.tatrDialog.title = '';
      if (this.highlightedRow.label == 'Subcon') {
        this.tatrDialog.subcon = true;
      } else {
        this.tatrDialog.subcon = false;
      }
      let title = 'TAT-R Details (' + this.highlightedRow.label + ') ';
      let query = '';
      if (this.dateRange == 'Day') {
        query = 'day&date=' + item.calendar_date;
        title += this.$moment(item.calendar_date).format('Do MMMM YYYY');
      }
      if (this.dateRange == 'Month') {
        query =
          'month&year=' + item.calendar_year + '&month=' + item.calendar_month;
      }
      if (this.dateRange == 'Week') {
        query =
          'week&year=' + item.calendar_year + '&week=' + item.calendar_week;
        title +=
          'w/c ' +
          this.$moment()
            .year(item.calendar_year)
            .isoWeek(item.calendar_week)
            .startOf('isoweek')
            .format('Do MMMM');
      }
      if (this.client) {
        query += '&client_id=' + this.client.CLIENT;
        title += '/Client ' + this.client.CLIENT;
      }
      if (this.salesRegion) {
        query += '&region=' + this.salesRegion;
        title += '/Region ' + this.salesRegion;
      }
      query += this.highlightedRow.sampleFilter;
      this.$axios
        .get('stats/dw-tatr-samples?dateRange=' + query)
        .then((response) => {
          this.tatrDialog.samples = response.data.data;

          this.tatrDialog.loading = false;
          this.tatrDialog.title = title;
        });
    },
    async openTatrTestDialog(item) {
      this.loading = true;
      this.tatrTestData = [];
      this.tatrTestDialog = true;
      await this.$axios
        .get('stats/dw-tatr-tests?date=' + item.calendar_date)
        .then((res) => {
          //console.log(res.data.data);
          this.tatrTestData = res.data.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  -ms-box-shadow: none !important;
}
</style>
