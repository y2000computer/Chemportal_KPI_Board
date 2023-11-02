<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title>
            Bad Injections
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                label="Instrument Filter"
                outlined
                dense
                :items="instruments"
                item-text="name"
                item-value="id"
                v-model="instrumentFilter"
                clearable
              />
            </v-col>
            <v-col>
              <v-btn @click="newDialog = true" large color="primary"
                >Add New</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table dense :items="filteredData" :headers="tableHeaders">
                <template v-slot:item.run_date="{ item }">
                  {{ $moment(item.run_date).format('DD-MM-YY') }}
                </template>
                <template v-slot:item.bad_injections="{ item }">
                  <span class="font-weight-bold">{{
                    item.bad_injections
                  }}</span>
                </template>
                <template v-slot:item.delete="{ item }">
                  <v-btn icon small @click="deleteBad(item.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="newDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>
          Record Bad Injections
          <v-spacer />
          <v-btn icon small @click="closeDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                outlined
                dense
                label="Instrument"
                :items="instruments"
                item-value="id"
                item-text="name"
                v-model="form.instrument_id"
              />
            </v-col>

            <v-col>
              <v-menu
                ref="startDateMenu"
                v-model="startDateMenu"
                transition="scale-transition"
                :close-on-content-click="false"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    outlined
                    dense
                    readonly
                    :value="
                      form.run_date
                        ? $moment(form.run_date).format('DD/MM/YY')
                        : ''
                    "
                    label="Run Date"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="form.run_date"
                  no-title
                  @input="startDateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          Reasons
          <v-row>
            <v-col>
              <v-text-field
                type="number"
                outlined
                dense
                label="Reprep"
                v-model="form.reprep"
              />
            </v-col>

            <v-col>
              <v-text-field
                outlined
                type="number"
                dense
                label="Diltutions"
                v-model="form.dilutions"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                type="number"
                dense
                label="QC Failures"
                v-model="form.qc_failures"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="number"
                label="Misinjections"
                v-model="form.misinjections"
              />
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                outlined
                dense
                label="Other"
                v-model="form.other"
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="6">
              <v-text-field
                outlined
                type="number"
                readonly
                label="Bad Injections"
                :value="bad_injections"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="closeDialog">Cancel</v-btn>
          <v-spacer />
          <v-btn :disabled="disabled" color="primary" @click="addBad"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      newDialog: false,
      startDateMenu: false,
      form: {
        instrument_id: '',
        run_date: '',
        bad_injections: '',
        reprep: '',
        dilutions: '',
        misinjections: '',
        qc_failures: '',
        other: '',
      },
      instruments: [],
      instrumentFilter: '',
      data: [],
      tableHeaders: [
        { text: 'Run Date', value: 'run_date' },
        { text: 'Instrument', value: 'instrument.name' },
        { text: 'Total Bad', value: 'bad_injections' },
        { text: 'Dilutions', value: 'dilutions' },
        { text: 'Misinjections', value: 'misinjections' },
        { text: 'QC Fail', value: 'qc_failures' },
        { text: 'Reprep', value: 'reprep' },
        { text: 'Delete', value: 'delete' },
      ],
    };
  },
  mounted() {
    this.getInstruments();
    this.getData();
  },
  computed: {
    bad_injections() {
      return (
        (this.form.reprep ? parseInt(this.form.reprep) : 0) +
        (this.form.dilutions ? parseInt(this.form.dilutions) : 0) +
        (this.form.qc_failures ? parseInt(this.form.qc_failures) : 0) +
        (this.form.misinjections ? parseInt(this.form.misinjections) : 0) +
        (this.form.other ? parseInt(this.form.other) : 0)
      );
    },
    disabled() {
      return (
        this.bad_injections === 0 ||
        this.bad_injections == null ||
        this.form.run_date == ''
      );
    },
    filteredData() {
      if (!this.instrumentFilter) {
        return this.data;
      }
      return this.data.filter((d) => d.instrument_id == this.instrumentFilter);
    },
  },
  methods: {
    getInstruments() {
      this.$axios.get('instruments/instruments').then((res) => {
        this.instruments = res.data.data;
      });
    },
    getData() {
      this.$axios.get('instruments/bad-injections').then((res) => {
        this.data = res.data.data;
      });
    },
    addBad() {
      this.$axios
        .post('instruments/bad-injections', {
          ...this.form,
          bad_injections: this.bad_injections,
        })
        .then((res) => {
          console.log(res);
          this.closeDialog();
          this.getData();
        });
    },
    deleteBad(bad) {
      this.$axios.delete('instruments/bad-injections/' + bad).then((res) => {
        this.getData();
      });
    },
    closeDialog() {
      this.newDialog = false;
      this.form.instrument_id = '';
      this.form.run_date = '';
      this.form.bad_injections = '';
      this.form.reprep = '';
      this.form.dilutions = '';
      this.form.misinjections = '';
      this.form.other = '';
    },
  },
};
</script>

<style></style>
