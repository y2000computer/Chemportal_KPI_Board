<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Instrument Inventory</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text
          ><v-row
            ><v-col
              ><v-text-field
                outlined
                dense
                hide-details
                v-model="search"
                label="Search"
              ></v-text-field></v-col
            ><v-col class="text-right"
              ><v-btn large color="primary" @click="addInstrument"
                >Add</v-btn
              ></v-col
            ></v-row
          >
          <v-row
            ><v-col
              ><v-data-table
                :loading="loading"
                dense
                disable-pagination
                hide-default-footer
                :items="instruments"
                :headers="headers"
                :search="search"
                @click:row="editInstrument"
              >
                <template v-slot:item.active="{ item }">
                  <v-chip dark small :color="item.active ? 'green' : 'red'">{{
                    item.active ? 'Y' : 'N'
                  }}</v-chip></template
                ></v-data-table
              ></v-col
            ></v-row
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="instrumentDialog" width="600">
      <v-card outlined>
        <v-card-title
          >{{ editing ? 'Edit Instrument' : 'Add New Instrument'
          }}<v-spacer /><v-btn
            @click="deleteDialog = true"
            v-if="editing"
            icon
            small
            ><v-icon color="primary">mdi-delete</v-icon></v-btn
          ></v-card-title
        >
        <v-card-text>
          <v-row
            ><v-col
              ><v-text-field
                dense
                :readonly="editing"
                outlined
                label="Name"
                v-model="instrument.name"
              ></v-text-field></v-col
          ></v-row>
          <v-row
            ><v-col
              ><v-switch
                inset
                label="In Use"
                v-model="instrument.active"/></v-col
          ></v-row>
        </v-card-text>
        <v-card-actions
          ><v-btn @click="instrumentDialog = !instrumentDialog">Cancel</v-btn
          ><v-spacer /><v-btn color="primary" @click="save"
            >Save</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" width="400">
      <v-card>
        <v-card-title>
          Are You Sure You Want To Delete.
        </v-card-title>
        <v-card-actions
          ><v-btn @click="deleteDialog = false">No</v-btn><v-spacer /><v-btn
            @click="deleteInstrument"
            color="primary"
            >Yes</v-btn
          ></v-card-actions
        >
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      instrumentDialog: false,
      deleteDialog: false,
      editing: false,
      instruments: [],
      instrument: {},

      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'In Use', value: 'active' },
        { text: 'Software', value: 'software.name' },
        { text: 'Results Path', value: 'result_path' },
      ],
    };
  },
  mounted() {
    this.getInstruments();
  },
  methods: {
    getInstruments() {
      this.loading = true;
      this.$axios.get('instruments/instruments').then((response) => {
        this.instruments = response.data.data;
        this.loading = false;
      });
    },
    addInstrument() {
      this.editing = false;
      this.instrumentDialog = true;
      this.instrument = {
        name: '',
        active: true,
      };
    },
    editInstrument(e) {
      this.editing = true;
      this.instrumentDialog = true;
      this.instrument = e;
    },
    save() {
      this.saving = true;
      if (this.editing) {
        this.$axios
          .patch(
            'instruments/instruments/' + this.instrument.id,
            this.instrument
          )
          .then((response) => {
            this.savingResponse();
          });
      } else {
        this.$axios
          .post('instruments/instruments', this.instrument)
          .then((response) => {
            console.log(response);
          })
          .then((response) => {
            this.savingResponse();
          });
      }
    },
    savingResponse() {
      this.getInstruments();
      this.instrumentDialog = false;
    },
    deleteInstrument() {
      this.$axios
        .delete('instruments/instruments/' + this.instrument.id)
        .then((response) => {
          this.deleteDialog = false;
          this.savingResponse();
        });
    },
  },
};
</script>

<style></style>
