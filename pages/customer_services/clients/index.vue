<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Client Manager</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
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
                :loading="clientsLoading"
                @change="getClient"
                v-on:keyup.enter="getClient"
                @click:append="getClient"
                clearable
                @click:clear="clearClient"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-if="selectedClient">
            <v-col md="3" cols="12">
              <v-card flat>
                <v-card-title>Client Details</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Client Name</v-list-item-subtitle>
                        <v-list-item-title>{{
                          selectedClient.CLIENTNAME
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Client ID</v-list-item-subtitle>
                        <v-list-item-title>{{
                          selectedClient.CLIENT
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Rate Tier</v-list-item-subtitle>
                        <v-list-item-title>{{
                          selectedClient.RATETIER
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>Turnaround</v-list-item-subtitle>
                        <v-list-item-title
                          >{{
                            selectedClient.TURNAROUND
                          }}
                          days</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle>PO Required</v-list-item-subtitle>
                        <v-list-item-title>{{
                          selectedClient.PO_REQD == "1" ? "Yes" : "No"
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-subtitle>
                        Auto Reports
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      v-for="report in selectedClient.auto_reports"
                      :key="'rep' + report.REPORT"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ report.REPORTNAME }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="5" cols="12">
              <v-card flat>
                <v-card-title>Offices</v-card-title>
                <v-card-text>
                  <v-card
                    class="ma-2"
                    outlined
                    v-for="office in selectedClient.offices"
                    :key="office.OFFICE"
                  >
                    <v-subheader> {{ office.SEARCHNAME }}</v-subheader>
                    <v-list dense>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-subtitle
                            >Min Invoice</v-list-item-subtitle
                          >
                          <v-list-item-title>{{
                            office.MININV
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>
                            Contacts
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        v-for="contact in office.contacts"
                        :key="contact.CONTACTSID"
                        two-line
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{
                            contact.CONTACT
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            contact.EMAIL
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>

                    <!-- <v-list dense>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-subtitle
                            >Office Name</v-list-item-subtitle
                          >
                          <v-list-item-title>{{}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list> -->
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat>
                <v-card-title>Client Options</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Auto Reporting</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          inset
                          @change="toggleAutorep"
                          :input-value="autorep"
                          color="primary"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Onboarding</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          inset
                          disabled
                          v-model="selectedClient.ONBOARDING"
                          color="primary"
                          @change="setOnboarding"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Price List (test)</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          color="primary"
                          :disabled="!selectedClient.CLIENT"
                          small
                          @click="viewPriceList"
                          >View</v-btn
                        >
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
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
      client: "",
      selectedClient: [],
    };
  },
  mounted() {
    this.getClients();
  },
  computed: {
    autorep() {
      if (this.selectedClient.AUTOREP == "1") {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    getClients() {
      this.$axios.get("clients/ids").then((response) => {
        this.clients = response.data.data;
        this.clientsLoading = false;
      });
    },
    getClient() {
      if (!this.client) {
        return;
      }
      this.$axios.get("clients/show/" + this.client).then((response) => {
        this.selectedClient = response.data.data;
      });
    },
    clearClient() {
      this.client = "";
      this.selectedClient = "";
    },
    setOnboarding() {
      this.$axios
        .get("startOnboarding?client=" + this.client)
        .then((response) => {
          this.getClient();
        });
    },
    toggleAutorep() {
      this.$axios
        .patch("clients/toggle-autorep", {
          client: this.selectedClient.CLIENT,
        })
        .then((response) => {
          this.selectedClient.AUTOREP = response.data.data.AUTOREP;
        });
    },
    viewPriceList() {
      window.open(
        "http://nm-web01:8080/jasperserver/flow.html?j_username=jasperadmin&j_password=jasperadmin&_flowId=viewReportFlow&ParentFolderUri=/Reports/Bid_Team&reportUnit=/Reports/Bid_Team/PriceListTest&output=pdf&standAlone=true&CLIENT=" +
          this.selectedClient.CLIENT,
        "_blank"
      );
    },
  },
};
</script>

<style></style>
