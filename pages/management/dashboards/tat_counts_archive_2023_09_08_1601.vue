<template>
  <v-row>
    <v-col>
      <v-row align="center">
        <v-col class="font-weight-medium"
          >Turnaround time Details for {{ formattedDate }}</v-col
        >
        <v-col>
          <div class="float-right">
            <v-btn icon>
              <v-icon>help</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col md="3" sm="10" cols="12">
          <v-text-field
            :value="formattedDate"
            label="Date"
            outlined
            hide-details
            readonly
          ></v-text-field></v-col
        ><v-col
          ><v-btn text @click="changeDate(-1)"
            ><v-icon>mdi-calendar-minus</v-icon></v-btn
          ><v-btn text @click="changeDate(1)"
            ><v-icon>mdi-calendar-plus</v-icon></v-btn
          ></v-col
        ><v-col class="text-center">
          <v-btn-toggle mandatory color="primary"
            ><v-btn
              width="120"
              v-for="dateOption in dateOptions"
              :key="dateOption.label"
              @click="dateOptionChanged(dateOption)"
              >{{ dateOption.label }}</v-btn
            ></v-btn-toggle
          ></v-col
        ><v-col md="4" sm="10" cols="12" class="text-right">
          <v-btn
            :loading="loading"
            :disabled="loading || !dateChanged"
            large
            color="primary"
            @click="getData"
            >Update</v-btn
          ></v-col
        >
        
          <v-col md="4" sm="10" cols="12" class="text-right">
          <v-btn
            :loading="loading"
            :disabled="loading || !dateChanged"
            large
            color="primary"
            @click="getData_v2"
            >Update_v2</v-btn
          ></v-col
        >        
        
        
        </v-row
      >
      
      
    
      
      <v-row dense justify="space-around">
        <v-col lg="4" md="6" cols="12">
          <main-stat-card
            :loading="summaryLoading"
            title="TAT 50"
            :value="!summaryLoading ? currentTat.tat50 + ' days' : ''"
          ></main-stat-card>
        </v-col>
        <v-col lg="4" md="6" cols="12">
          <main-stat-card
            :loading="summaryLoading"
            title="TAT 95"
            :value="!summaryLoading ? currentTat.tat95 + ' days' : ''"
          ></main-stat-card>
        </v-col>
      </v-row>      
      
      
      
      <v-row justify="space-between"
        ><v-col
          v-for="(group, index) in headerCards"
          :key="'headerCard' + index"
          ><small-stat-card
            :loading="loading"
            :disabled="dateChanged"
            :title="group.label"
            :value="data[group.column]"/></v-col></v-row
      ><v-row
        ><v-col v-for="(group, index) in dashboard" :key="'statGroup' + index"
          ><v-card outlined :disabled="dateChanged" :loading="loading"
            ><v-card-text
              ><v-row dense
                ><v-col>{{ group.label }}</v-col></v-row
              ><v-simple-table
                ><thead>
                  <tr>
                    <th></th>
                    <th>Samples</th>
                    <th v-if="selectedDateOption.label != 'Day'">
                      Per Working Day ({{
                        (data.workingDays - dateFraction).toFixed(1)
                      }})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in group.data" :key="'row' + row.label">
                    <td>{{ row.label }}</td>
                    <td class="font-weight-bold">{{ data[row.column] }}</td>
                    <td v-if="selectedDateOption.label != 'Day'">
                      {{
                        row.workingDay
                          ? (
                              data[row.column] /
                              (data.workingDays - dateFraction)
                            ).toFixed(1)
                          : '-'
                      }}
                    </td>
                  </tr>
                </tbody></v-simple-table
              ></v-card-text
            ></v-card
          ></v-col
        ></v-row
      >
    </v-col>
  </v-row>



























</template>

<script>
import smallStatCard from './components/smallStatCard';

import mainStatCard from './components/mainStatCard';


export default {
  components: {
    smallStatCard,
    mainStatCard
  },
  data() {
    return {
      countsLoading: true,
      summaryLoading: true,   //8 Aug 2023
      loading: true,
      tatCounts: [],
      tatSummary: [],
      dateOptions: [
        {
          label: 'Month',
          query: 'month',
          queryYear: true,
          moment: 'M',
          format: 'MM',
        },
      ],
      selectedDateOption: {},
      date: this.$moment().format('YYYY-MM-DD'),
      dateChanged: false,
      region: '',
      client: '',
      data: [],
      headerCards: [
        {
          label: 'Samples Registered w/ Testing',
          column: 'SamplesLoggedWithTesting',
        },
        {
          label: 'Samples Off Hold',
          column: 'SamplesOffHold',
        },
        { label: 'Samples Due', column: 'SamplesDue' },
        { label: 'Samples Reported', column: 'SamplesReported' },
      ],
      dashboard: [
        {
          label: 'Registration Stats',
          data: [
            {
              label: 'Samples Registered',
              column: 'SamplesLogged',
              workingDay: true,
            },
            {
              label: 'Samples Registered w/ Testing',
              column: 'SamplesLoggedWithTesting',
              workingDay: true,
            },

            {
              label: 'Samples Off Hold',
              column: 'SamplesOffHold',
              workingDay: true,
            },
            {
              label: 'Samples Instructed',
              column: 'SamplesInstructed',
              workingDay: true,
            },

            {
              label: 'Samples Logged Electronically',
              column: 'SamplesLoggedElectronic',
              workingDay: true,
            },
            {
              label: 'Samples Registered (Interco)',
              column: 'SamplesLoggedInterco',
              workingDay: true,
            },
            {
              label: 'Samples Registered & Tested',
              column: 'SamplesLoggedTested',
              workingDay: true,
            },
            // {
            //   label: 'Samples Logged On Hold',
            //   column: 'SamplesLoggedOnHold',
            // },
          ],
        },
        {
          label: 'Lab Stats',
          data: [
            { label: 'Samples Due', column: 'SamplesDue', workingDay: false },
            {
              label: 'Samples Due (Incomplete)',
              column: 'SamplesDueIncomplete',
              workingDay: false,
            },

            {
              label: 'Samples Due (Awaiting Report)',
              column: 'SamplesDueAwaitingReporting',
              workingDay: false,
            },
            {
              label: 'Samples Completed',
              column: 'SamplesCompleted',
              workingDay: true,
            },
            {
              label: 'Samples Approved',
              column: 'SamplesApproved',
              workingDay: true,
            },
            {
              label: 'Samples Auto Approved',
              column: 'SamplesAutoApproved',
              workingDay: true,
            },
            {
              label: 'Samples Reported',
              column: 'SamplesReported',
              workingDay: true,
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.selectedDateOption = this.dateOptions[0];
    this.getData();
    //this.getData_v2();
    this.getTatCounts();
    this.getTatSummary();
  },
  computed: {
    currentTat() {
      return this._.find(this.tatSummary, {
        //calendar_year: this.date.format('YYYY'),
        //calendar_month: this.date.format('M'),
      });
    },    
    formattedDate() {
      if (this.selectedDateOption.label == 'Day') {
        return this.$moment(this.date).format('ddd DD/MM/YY');
      }
      if (this.selectedDateOption.label == 'Week') {
        return (
          'Week Commencing ' +
          this.$moment(this.date)
            .startOf(this.selectedDateOption.moment)
            .format('DD/MM/YY')
        );
      }
      if (this.selectedDateOption.label == 'Month') {
        return this.$moment(this.date)
          .startOf(this.selectedDateOption.moment)
          .format('MMMM YYYY');
      }
      if (this.selectedDateOption.label == 'Quarter') {
        return (
          'Quarter ' +
          this.$moment(this.date)
            .startOf(this.selectedDateOption.moment)
            .format('Q YYYY')
        );
      }
      return this.$moment(this.date)
        .startOf(this.selectedDateOption.moment)
        .format(this.selectedDateOption.format);
    },
    dateFraction() {
      let date = this.$moment();
      if (
        date.isAfter(
          this.$moment(this.date).endOf(this.selectedDateOption.moment)
        )
      ) {
        return 0;
      }
      if (date.hour() >= 18) {
        return 0;
      }
      if (date.day() == 0 || date.day() == 6) {
        return 0;
      }
      return 1 - ((date.hour() - 6) / 11).toFixed(1);
    },

    queryString() {
      let query = 'stats/dw-details?';
      query +=
        this.selectedDateOption.query +
        '=' +
        this.$moment(this.date).format(this.selectedDateOption.format);
      if (this.selectedDateOption.queryYear) {
        query += '&year=' + this.$moment(this.date).format('YYYY');
      }
      return query;
    },
    queryString_counts() {
      let query = 'stats/dw-tat-counts?';
      query +=
        this.selectedDateOption.query +
        '=' +
        this.$moment(this.date).format(this.selectedDateOption.format);
      if (this.selectedDateOption.queryYear) {
        query += '&year=' + this.$moment(this.date).format('YYYY');
      }
      return query;
    },    
    queryString_summary_month() {
      let query = 'stats/dw-tat-summary-month?';
      query +=
        this.selectedDateOption.query +
        '=' +
        this.$moment(this.date).format(this.selectedDateOption.format);
      if (this.selectedDateOption.queryYear) {
        query += '&year=' + this.$moment(this.date).format('YYYY');
      }
      return query;
    },    

  },
  methods: {
    changeDate(change) {
      this.dateChanged = true;
      this.date = this.$moment(this.date)
        .add(change, this.selectedDateOption.moment)
        .startOf(this.selectedDateOption.moment)
        .format('YYYY-MM-DD');
    },
    dateOptionChanged(option) {
      this.dateChanged = true;
      if (option.label == 'Day') {
        this.date = this.$moment().format('YYYY-MM-DD');
      }
      this.selectedDateOption = option;
      this.date = this.$moment(this.date)
        .startOf(this.selectedDateOption.moment)
        .format('YYYY-MM-DD');
    },
    getData() {
      this.loading = true;
      this.$axios.get(this.queryString).then((response) => {
        this.data = response.data.data[0];
        this.loading = false;
        this.dateChanged = false;
      });
    },
    getData_v2() {

      this.getTatCounts();
      this.getTatSummary();


    },
    getTatCounts() {
      this.countsLoading = true;
      //queryString_counts = 'stats/dw-tat-counts?';
      this.$axios.get(this.queryString_counts).then((response) => {
        this.tatCounts = response.data.data;
        this.countsLoading = false;
      });
    },
    getTatSummary() {
      this.summaryLoading = true;
      //queryString_summary_month = 'stats/dw-tat-summary-month?';
      this.$axios.get(this.queryString_summary_month).then((response) => {
        this.tatSummary = response.data.data;
        this.summaryLoading = false;
      });
    },    

  },
};
</script>

<style></style>
