<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Client Notes</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="4" cols="12">
              <v-autocomplete
                dense
                hide-details
                outlined
                autofocus
                v-model="client"
                :items="clients"
                item-text="CLIENTNAME"
                item-value="CLIENT"
                label="Select a Client"
                @change="getClient"
                v-on:keyup.enter="getClient"
                @click:append="getClient"
                :loading="clientsLoading"
                clearable
                @click:clear="clearClient"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card flat>
                <v-card-text class="font-weight-medium">
                  <pre
                    v-if="clientNotes"
                    style="white-space:pre-wrap; font-family:inherit;"
                    >{{ clientNotes }}</pre
                  >
                  <div v-if="!notesLoading && client && !clientNotes">
                    No Client Notes Found
                  </div>
                  <div v-if="notesLoading">Loading</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      clients: [],
      clientsLoading: true,
      client: '',
      notesLoading: false,
      clientNotes: '',
    };
  },
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.$axios.get('clients/ids').then((response) => {
        this.clients = response.data.data;
        this.clientsLoading = false;
      });
    },
    getClient() {
      if (this.client) {
        this.notesLoading = true;
        this.$axios.get('clients/show/' + this.client).then((response) => {
          this.clientNotes = response.data.data.reg_notes;
          this.notesLoading = false;
        });
      }
    },
    clearClient() {
      this.clientNotes = '';
      this.client = '';
    },
  },
};
</script>

<style></style>
