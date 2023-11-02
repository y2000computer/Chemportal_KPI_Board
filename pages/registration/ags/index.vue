<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>AGS Parser</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3">
              <v-card flat>
                <v-card-title>Client Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        dense
                        outlined
                        hide-details
                        :loading="clientsLoading"
                        :items="clients"
                        v-model="client"
                        label="Client"
                        placeholder="Select Client"
                        item-value="CLIENT"
                        item-text="CLIENTNAME"
                        @change="clientSelected"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        dense
                        outlined
                        hide-details
                        :loading="officesLoading"
                        :items="offices"
                        v-model="office"
                        label="Office"
                        placeholder="Select Office"
                        item-value="OFFICE"
                        item-text="SEARCHNAME"
                        @change="officeSelected"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-select
                        outlined
                        dense
                        multiple
                        return-object
                        v-model="selectedContacts"
                        :items="contacts"
                        item-text="CONTACT"
                        label="Contacts"
                        placeholder="Select Contact/s"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        outlined
                        dense
                        hide-details
                        clearable
                        placeholder="Select Quote"
                        :loading="quotesLoading"
                        v-model="quote"
                        :items="quotes"
                        item-text="QUOTE"
                        item-value="QUOTE"
                        label="Quote"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      v-cloak
                      @drop.prevent="addDropFile"
                      @dragover.prevent="dragging = true"
                      @dragleave="dragging = false"
                    >
                      <v-file-input
                        dense
                        outlined
                        hide-details
                        label="AGS File"
                        placeholder="Upload AGS File"
                        v-model="AGS"
                        prepend-icon
                        :disabled="!client && !office"
                        :class="
                          dragging
                            ? ['v-input--is-focused', 'primary--text']
                            : ''
                        "
                      ></v-file-input>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      @click="parseAGS"
                      color="primary"
                      :loading="parsingAGS"
                      :disabled="parsingAGS || !AGS"
                    >Check File</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="4">
              <v-card flat>
                <v-card-title>File Details</v-card-title>
                <v-card-text>
                  <v-list v-if="AGSdata.filename">
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Filename:</v-list-item-subtitle>
                        <v-list-item-title>
                          {{
                          AGSdata.filename
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Client:</v-list-item-subtitle>
                        <v-list-item-title>
                          {{
                          AGSdata.client
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Office:</v-list-item-subtitle>
                        <v-list-item-title>
                          {{
                          AGSdata.office
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Project:</v-list-item-subtitle>
                        <v-list-item-title>
                          {{
                          AGSdata.project
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Samples:</v-list-item-subtitle>
                        <v-list-item-title>
                          {{
                          AGSdata.samples.length
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="5">
              <v-card flat>
                <v-card-title>Sample Details</v-card-title>
                <v-card-text v-if="AGSdata.filename">
                  <div v-for="sample in AGSdata.samples" :key="sample.key">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Sample ID:</v-list-item-subtitle>
                          <v-list-item-title>
                            {{ sample.location }}
                            {{ sample.sampTop ? ' @ ' + sample.sampTop + 'm' : '' }}
                            {{
                            sample.sampBottom
                            ? ' - ' + sample.sampBottom + 'm'
                            : ''
                            }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-subtitle>Type:</v-list-item-subtitle>
                          <v-list-item-title>
                            {{ sample.sampType }} ({{
                            sample.agsType
                            }})
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item
                        v-for="(suite, index) in sample.suites"
                        :key="sample.key + 'suite' + index"
                      >
                        <v-list-item-content>
                          <v-list-item-subtitle v-if="index == 0">Suites:</v-list-item-subtitle>
                          <v-list-item-title>
                            {{ suite.suiteCode }} -
                            {{ suite.suiteName }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-divider />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <v-btn
                color="primary"
                x-large
                class="float-right"
                @click="exportCSV"
                :disabled="!AGSdata.filename"
              >Export</v-btn>
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
      clientsLoading: true,
      clients: [],
      client: "",
      officesLoading: false,
      offices: [],
      office: "",
      quotesLoading: false,
      contacts: [],
      selectedContacts: [],
      quotes: [],
      quote: "",
      AGS: null,
      parsingAGS: false,
      AGSdata: [],
      dragging: false,
      exporting: false,
      csvData: {
        csvHeaders: [
          "CLIENT",
          "OFFICE",
          "ORDER_NO",
          "PROJECTSID",
          "PROJECT",
          "QUOTE",
          "SAMPTOP",
          "SAMPBOTTOM",
          "CONTAINER",
          "RECDATE",
          "RECTIME",
          "SAMPDATE",
          "SAMPTIME",
          "SAMPLE_ID",
          "SAMPLE_REF",
          "CLIENTSREF",
          "AGSTYPE",
          "TYPE",
          "SUPERTYPE",
          "SUBTYPE",
          "CONTACTS",
          "RCPT_EMAIL",
          "CONF_EMAIL",
          "REP_EMAIL",
          "SUITES",
          "DB_SCH"
        ],
        csvRows: [],
        path: "\\\\nm-fileserver\\Shared Areas\\Booking In\\Converted AGS\\",
        filename: ""
      }
    };
  },
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.$axios.get("clients/ids").then(response => {
        this.clients = response.data.data;
        this.clientsLoading = false;
      });
    },
    clientSelected() {
      this.quotesLoading = true;
      this.getOffices();
      this.getQuotes();
    },
    getOffices() {
      this.$axios.get("offices/index/" + this.client).then(response => {
        this.offices = response.data.data;
      });
    },
    officeSelected() {
      this.getOffice();
    },
    getOffice() {
      this.$axios.get("offices/show/" + this.office).then(response => {
        this.contacts = response.data.data.contacts;
      });
    },
    getQuotes() {
      this.$axios.get("quotes/index/" + this.client).then(response => {
        this.quotes = response.data.data;
        this.quotesLoading = false;
      });
    },
    parseAGS() {
      this.parsingAGS = true;
      let formData = new FormData();
      formData.append("AGS", this.AGS);
      formData.append("quote", this.quote);
      formData.append("client", this.client);
      formData.append("office", this.office);
      formData.append("filename", this.AGS.name);
      this.$axios
        .post("ags/parse", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          this.AGSdata = response.data;
          this.csvData.filename =
            response.data.client + " - " + response.data.filename + ".csv";
          this.parsingAGS = false;
        });
    },
    exportCSV() {
      this.exporting = true;
      var emails = "";
      this.AGSdata.samples.forEach(sample => {
        var contacts = this.selectedContacts
          .map(contact => contact.CONTACT)
          .join("; ");
        var emails = this.selectedContacts
          .map(contact => contact.EMAIL)
          .join("; ");
        this.csvData.csvRows.push([
          this.AGSdata.client,
          this.AGSdata.office,
          "",
          "",
          this.AGSdata.project,
          this.quote,
          sample.sampTop,
          sample.sampBottom,
          "",
          this.$moment().format("DD/MM/YYYY"),
          "1200",
          this.$moment(sample.sampDate).format("DD/MM/YYYY"),
          sample.sampTime,
          sample.sampId,
          sample.sampRef,
          sample.location,
          sample.agsType,
          sample.sampType,
          sample.supertype,
          sample.subtype,
          contacts,
          emails,
          emails,
          emails,
          sample.suiteString,
          this.AGSdata.filename
        ]);
      });
      this.$axios.post("csv/generate-csv", this.csvData).then(response => {
        console.log(response.data);
        this.resetForm();
      });
    },
    addDropFile(e) {
      console.log("draggin over");
      this.dragging = false;
      this.AGS = e.dataTransfer.files[0];
    },
    resetForm() {
      this.client = "";
      this.offices = [];
      this.office = "";
      this.contacts = [];
      this.quotes = [];
      this.quote = "";
      this.selectedContacts = [];
      this.AGS = null;
      this.AGSdata = {};
      this.csvData.csvRows = [];
    }
  }
};
</script>

<style></style>
