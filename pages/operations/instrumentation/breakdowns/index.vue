<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Instrument Breakdowns</v-toolbar-title
          ><v-spacer /><v-btn @click="getBreakdowns" icon
            ><v-icon>mdi-refresh</v-icon></v-btn
          >
        </v-toolbar>

        <v-card-text>
          <v-row
            ><v-col cols="12" md="3"
              ><v-text-field
                outlined
                dense
                label="Search"
                v-model="search"/></v-col
            ><v-col
              ><v-btn
                @click="breakdownDialog = !breakdownDialog"
                color="primary"
                >New</v-btn
              ></v-col
            ></v-row
          >
          <v-row
            ><v-col
              ><v-data-table
                dense
                :search="search"
                :loading="loading"
                :items="breakdowns"
                @click:row="rowSelected"
                :headers="breakdownHeaders"
                :options="options"
                :footer-props="footerProps"
              >
                <template v-slot:item.start_time="{ item }">
                  {{ $moment(item.start_time).format('DD/MM/YY - HH:mm') }}
                </template>

                <template v-slot:item.end_time="{ item }">
                  {{
                    item.end_time
                      ? $moment(item.end_time).format('DD/MM/YY - HH:mm')
                      : ''
                  }}
                </template>
                <template v-slot:item.type="{ item }">
                  {{ item.breakdown_type == 1 ? 'Breakdown' : 'Stoppage' }}
                </template>
                <template v-slot:item.duration="{ item }">
                  {{
                    item.end_time
                      ? $moment(item.end_time).diff(item.start_time, 'minutes')
                      : ''
                  }}
                </template>
                <template v-slot:item.engineer_required="{ item }">
                  <v-chip
                    dark
                    small
                    :color="item.engineer_required ? 'green' : 'red'"
                    >{{ item.engineer_required ? 'Yes' : 'No' }}</v-chip
                  >
                </template>
                <template v-slot:item.reason="{ item }">
                  {{ item.reason | shorten(50) }}
                </template>
              </v-data-table></v-col
            ></v-row
          >
        </v-card-text></v-card
      ></v-col
    ><v-dialog v-model="breakdownDialog" max-width="600" persistent
      ><v-card outlined
        ><v-card-title
          >{{ selectedItem.id ? 'Update Breakdown' : 'Create Breakdown'
          }}<v-spacer /><v-btn icon small @click="dialogClosed"
            ><v-icon>mdi-close</v-icon></v-btn
          ></v-card-title
        ><v-card-text
          ><v-row
            ><v-col
              ><v-autocomplete
                label="Instrument Name"
                dense
                outlined
                :items="instruments"
                item-value="id"
                item-text="name"
                v-model="form.instrument_id"/></v-col
            ><v-col
              ><v-select
                :items="breakdownTypes"
                item-value="id"
                item-text="text"
                label="Type"
                outlined
                dense
                v-model="form.breakdown_type"/></v-col
          ></v-row>
          <v-row
            ><v-col>
              <v-menu
                ref="startDateMenu"
                v-model="startDateMenu"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    dense
                    label="Start Date"
                    name="Start Date"
                    v-validate="'required'"
                    :value="form.start_date"
                    :error-messages="errors.first('Start Date')"
                    v-bind="attrs"
                    v-on="on"
                    autocomplete="off"
                  ></v-text-field> </template
                ><v-date-picker
                  color="primary"
                  v-model="form.start_date"
                  @input="startDateMenu = false"
                ></v-date-picker> </v-menu></v-col
            ><v-col>
              <v-menu
                ref="startTimeMenu"
                v-model="startTimeMenu"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    dense
                    label="Start Time"
                    name="Start Time"
                    v-validate="'required'"
                    :value="form.start_time"
                    :error-messages="errors.first('Start Time')"
                    v-bind="attrs"
                    v-on="on"
                    autocomplete="off"
                  ></v-text-field> </template
                ><v-time-picker
                  color="primary"
                  format="24hr"
                  v-model="form.start_time"
                  :allowed-minutes="allowedMinutes"
                  @input="startTimeMenu = false"
                ></v-time-picker> </v-menu></v-col
          ></v-row>
          <v-row
            ><v-col>
              <v-menu
                ref="endDateMenu"
                v-model="endDateMenu"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    label="End Date"
                    name="End Date"
                    v-validate="'required'"
                    :value="form.end_date"
                    :error-messages="errors.first('End Date')"
                    v-bind="attrs"
                    v-on="on"
                    autocomplete="off"
                  ></v-text-field> </template
                ><v-date-picker
                  color="primary"
                  v-model="form.end_date"
                  @input="endDateMenu = false"
                ></v-date-picker> </v-menu></v-col
            ><v-col>
              <v-menu
                ref="endTimeMenu"
                v-model="endTimeMenu"
                offset-y
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    dense
                    hide-details
                    label="End Time"
                    name="End Time"
                    v-validate="'required'"
                    :value="form.end_time"
                    :error-messages="errors.first('End Time')"
                    v-bind="attrs"
                    v-on="on"
                    autocomplete="off"
                  ></v-text-field> </template
                ><v-time-picker
                  color="primary"
                  format="24hr"
                  v-model="form.end_time"
                  :allowed-minutes="allowedMinutes"
                  @input="endTimeMenu = false"
                ></v-time-picker> </v-menu></v-col
          ></v-row>
          <v-row
            ><v-col
              ><v-switch
                inset
                dense
                hide-details
                label="Engineer Required"
                v-model="form.engineer_required"/></v-col
          ></v-row>
          <v-row
            ><v-col>
              <v-textarea
                outlined
                dense
                label="Reason"
                v-model="form.reason"/></v-col
          ></v-row> </v-card-text
        ><v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="selectedItem.id ? updateBreakdown() : createBreakdown()"
            >{{ selectedItem.id ? 'Update' : 'Create' }}</v-btn
          >
        </v-card-actions></v-card
      ></v-dialog
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      startDateMenu: false,
      startTimeMenu: false,
      endDateMenu: false,
      endTimeMenu: false,
      breakdownDialog: false,
      search: '',
      instruments: [],
      breakdownTypes: [
        { id: 1, text: 'Breakdown' },
        { id: 2, text: 'Stoppage' },
      ],
      breakdowns: [],
      breakdownHeaders: [
        { text: '#', value: 'id' },
        { text: 'Instrument', value: 'instrument.name' },
        { text: 'Start Time', value: 'start_time', searchable: false },
        { text: 'End Time', value: 'end_time', searchable: false },
        { text: 'Duration (mins)', value: 'duration', searchable: false },
        { text: 'Type', value: 'type' },
        { text: 'Engineer Required', value: 'engineer_required' },
        { text: 'Reason', value: 'reason' },
        { text: 'Analyst', value: 'analyst.USER_NAME' },
      ],
      options: {
        itemsPerPage: 25,
      },
      footerProps: {
        showFirstLastPage: true,
        itemsPerPageOptions: [25, 50, 100, -1],
      },
      selectedItem: {},
      form: {
        instrument_id: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        breakdown_type: '',
        engineer_required: '',
        reason: '',
      },
    };
  },
  mounted() {
    this.getInstruments();
    this.getBreakdowns();
  },
  methods: {
    getInstruments() {
      this.$axios.get('instruments/instruments').then((response) => {
        this.instruments = response.data.data.filter(
          (instrument) => instrument.active
        );
      });
    },
    getBreakdowns() {
      this.loading = true;
      this.$axios.get('instruments/breakdowns').then((response) => {
        this.breakdowns = response.data.data;
        this.loading = false;
      });
    },
    createBreakdown() {
      this.$axios.post('instruments/breakdowns', this.form).then((response) => {
        this.resetForm();
        this.breakdownDialog = false;
        this.getBreakdowns();
      });
    },
    rowSelected(item) {
      this.breakdownDialog = true;
      this.selectedItem = item;
      this.form.instrument_id = item.instrument_id;
      this.form.breakdown_type = item.breakdown_type;
      this.form.start_date = this.$moment(item.start_time).format('YYYY-MM-DD');
      this.form.start_time = this.$moment(item.start_time).format('HH:mm');
      this.form.end_date = item.end_time
        ? this.$moment(item.end_time).format('YYYY-MM-DD')
        : '';
      this.form.end_time = item.end_time
        ? this.$moment(item.end_time).format('HH:mm')
        : '';
      this.form.reason = item.reason;
      this.form.engineer_required = item.engineer_required;
    },
    dialogClosed() {
      this.item = {};
      this.resetForm();
      this.breakdownDialog = false;
    },
    resetForm() {
      this.form.instrument_id = '';
      this.form.breakdown_type = '';
      this.form.start_date = '';
      this.form.start_time = '';
      this.form.end_date = '';
      this.form.end_time = '';
      this.form.reason = '';
      this.form.engineer_required = '';
    },
    updateBreakdown() {
      this.$axios
        .patch('instruments/breakdowns/' + this.selectedItem.id, this.form)
        .then((response) => {
          this.getBreakdowns();
          this.selectedItem = false;
          this.breakdownDialog = false;
        });
    },

    allowedMinutes: (m) => m % 5 === 0,
  },
};
</script>

<style></style>
