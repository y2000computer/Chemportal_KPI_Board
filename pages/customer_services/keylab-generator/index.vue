<template>
  <div>
    <v-card flat>
      <v-toolbar flat dense>
        <v-toolbar-title>KeyLab File Generator</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col>
            KeyLab files can be imported into client software to provide a
            predefined list of testing to schedule. Keylab files can only be
            generated on a quote and will only export suites (so no individual
            dets).
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              :items="clients"
              item-value="CLIENT"
              item-text="CLIENTNAME"
              outlined
              dense
              label="Client"
              @change="getQuotes"
            />
          </v-col>
          <v-col>
            <v-autocomplete
              :items="quotes"
              item-value="QUOTE"
              item-text="QUOTE"
              outlined
              dense
              label="Quote"
              v-model="selectedQuote"
            />
          </v-col>
          <v-col>
            <v-btn large color="primary" @click="generateFile">Generate</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>File Exported To:</span
            ><span class="font-weight-medium">{{ filePath }}</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getClients();
  },
  methods: {
    async getClients() {
      this.$axios.get("clients/ids").then((res) => {
        this.clients = res.data.data;
      });
    },
    async getQuotes(e) {
      this.quotes = [];
      this.filePath = "";
      this.$axios.get(`quotes/index/${e}`).then((res) => {
        this.quotes = res.data.data;
      });
    },
    async generateFile() {
      this.$axios.get(`keylab?quote=${this.selectedQuote}`).then((res) => {
        this.filePath = res.data;
      });
    },
  },

  data() {
    return {
      clients: [],
      quotes: [],
      selectedQuote: "",
      filePath: "",
    };
  },
};
</script>

<style></style>
