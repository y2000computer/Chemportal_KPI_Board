<template>
  <v-card flat>
    <v-toolbar flat dense>
      <v-toolbar-title>Quotes For eLIMS</v-toolbar-title>
      <v-spacer />
      <div class="font-weight-medium">
        Only {{ remainingQuotes }} / {{ filteredQuotes.length }} To Go!
      </div>
      <v-spacer />

      <v-btn icon small @click="getQuotes">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row align="center">
        <v-col>
          <v-text-field
            outlined
            dense
            v-model="search"
            hide-details
            label="Search"
          />
        </v-col>
        <v-col>
          <v-switch inset v-model="showAcceptedOnly" label="Accepted Only" />
        </v-col>
        <v-col>
          <v-switch inset v-model="showQuotesInElims" label="In Elims" />
        </v-col>
        <v-col>
          <v-switch
            inset
            disabled
            v-model="showBlockedQuotes"
            label="Blocked Quotes"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :items="filteredQuotes"
            :loading="loading"
            dense
            :headers="quoteHeaders"
            :search="search"
          >
            <template v-slot:item.CLIENT="{ item }">
              <v-tooltip
                bottom
                :disabled="item.client && item.client.CLIENTNAME.length <= 20"
              >
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    {{ item.client.CLIENTNAME | shorten(20) }}
                  </span>
                </template>
                {{ item.client.CLIENTNAME }}
              </v-tooltip>
            </template>
            <template v-slot:item.project="{ item }">
              <v-tooltip
                bottom
                :disabled="item.project && item.project.length <= 20"
              >
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs">
                    {{ item.project | shorten(20) }}
                  </span>
                </template>
                {{ item.project }}
              </v-tooltip>
            </template>
            <template v-slot:item.CREATED="{ item }">
              {{ $moment(item.CREATED).format("DD-MM-YY") }}
            </template>
            <template v-slot:item.EXPIRYDATE="{ item }">
              {{ $moment(item.EXPIRYDATE).format("DD-MM-YY") }}
            </template>
            <!-- <template v-slot:item.LASTUSED="{ item }">
              {{ item.LAST_USED > item.CREATED ? "Y" : "N" }}
            </template> -->
            <template v-slot:item.ELIMS="{ item }">
              <div class="text-caption">
                {{ item.ELIMS }}
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn small icon @click="handleEditQuoteClicked(item)"
                ><v-icon small>edit</v-icon></v-btn
              >
            </template>
            <template v-slot:item.ELIMSBLOCK="{ item }">
              {{ item.ELIMSBLOCK ? "Y" : "N" }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog v-model="editQuoteDialog" persistent max-width="800">
      <v-card>
        <v-card-title
          >Edit Quote {{ selectedQuote.QUOTE }}
          <v-spacer />
          <v-btn icon @click="handleCloseDialogClicked(false)"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>
        <v-card-text class="mt-4">
          <v-row>
            <v-col>
              <v-text-field
                hide-details
                v-model="form.eLimsId"
                outlined
                label="eLIMS ID"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                hide-details
                v-model="form.eLimsNotes"
                outlined
                label="eLIMS Notes"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-switch
                v-model="form.eLimsBlocked"
                inset
                label="Unable To Complete"
            /></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="updateQuote">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      search: "",
      showAcceptedOnly: true,
      showQuotesInElims: false,
      showBlockedQuotes: false,
      quoteHeaders: [
        { text: "Quote", value: "QUOTE" },
        { text: "Client", value: "CLIENT" },
        { text: "Project", value: "project" },
        { text: "Contact", value: "CONTACT" },
        { text: "Created", value: "CREATED" },
        { text: "Expires", value: "EXPIRYDATE" },
        { text: "Status", value: "QSTATUS" },
        //{ text: "Last Used", value: "LASTUSED" },
        { text: "eLIMS ID", value: "ELIMS" },
        { text: "Block", value: "ELIMSBLOCK" },

        { text: "", value: "actions", disabled: false },
      ],
      quotes: [],
      editQuoteDialog: false,
      selectedQuote: {},
      form: {
        eLimsId: "",
        eLimsNotes: "",
        eLimsBlocked: false,
      },
    };
  },
  mounted() {
    this.getQuotes();
  },
  computed: {
    filteredQuotes() {
      let quotes = this.quotes;
      if (this.showAcceptedOnly) {
        quotes = quotes.filter((q) => q.QSTATUS == "ACCEPTED");
      }
      if (!this.showQuotesInElims) {
        quotes = quotes.filter((q) => q.ELIMS == "");
      }
      return quotes;
    },
    remainingQuotes() {
      return this.filteredQuotes.filter((q) => q.ELIMS == "").length;
    },
  },
  methods: {
    async getQuotes() {
      this.loading = true;
      try {
        await this.$axios.get("quotes").then((res) => {
          this.quotes = res.data.data;
        });
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    handleEditQuoteClicked(q) {
      this.selectedQuote = q;
      this.form.eLimsId = q.ELIMS;
      this.form.eLimsNotes = q.ELIMSNOTES;
      this.form.eLimsBlocked = q.ELIMSBLOCK;
      this.editQuoteDialog = true;
    },
    handleCloseDialogClicked(e) {
      this.editQuoteDialog = false;
      this.selectedQuote = {};
      if (e) {
        this.getQuotes();
      }
    },
    async updateQuote() {
      await this.$axios
        .patch("quotes/" + this.selectedQuote.QUOTE, this.form)
        .then((r) => {
          this.handleCloseDialogClicked(true);
        });
    },
  },
};
</script>

<style></style>
