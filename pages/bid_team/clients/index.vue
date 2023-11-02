<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>Clients</v-card-title
        ><v-card-text>
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
                @click:append="getClient"
                clearable
                @click:clear="clearClient"
              ></v-autocomplete>
            </v-col> </v-row
          ><v-row
            ><v-col cols="12" md="3"
              ><v-card flat
                ><v-card-title>Client Details</v-card-title>
                <v-card-text>
                  <v-list>
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
                      <v-list-item-action
                        ><v-btn
                          small
                          :disabled="!selectedClient.CLIENT"
                          color="primary"
                          @click="updateTierDialog = !updateTierDialog"
                          >Update</v-btn
                        ></v-list-item-action
                      >
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle
                          >Standard Turnaround</v-list-item-subtitle
                        >
                        <v-list-item-title>{{
                          selectedClient.TURNAROUND
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-subtitle
                          >Minimum Invoice Charge</v-list-item-subtitle
                        >
                        <v-list-item-title
                          >£{{ selectedClient.MININVOICE }}</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list></v-card-text
                ></v-card
              ></v-col
            ><v-col
              ><v-card flat v-if="selectedClient.CLIENT"
                ><v-card-title
                  >Price List<v-spacer /><v-btn
                    icon
                    @click="viewPriceList"
                    color="primary"
                    ><v-icon>print</v-icon></v-btn
                  ></v-card-title
                ><v-card-text
                  ><v-row dense
                    ><v-col cols="6"
                      ><v-text-field
                        outlined
                        dense
                        label="Search"
                        v-model="priceListSearch"
                        hide-details
                      ></v-text-field></v-col
                    ><v-col class="text-center"
                      ><v-btn-toggle
                        dense
                        v-model="selectedCurrency"
                        color="primary"
                        mandatory
                        ><v-btn
                          v-for="currency in currencies"
                          :key="'btn' + currency.currency"
                          :value="currency.currency"
                          :disabled="!currency.display"
                          >{{ currency.unit }}</v-btn
                        ></v-btn-toggle
                      ></v-col
                    ></v-row
                  ><v-row dense
                    ><v-col
                      ><v-simple-table dense :loading="clientLoading"
                        ><thead>
                          <tr>
                            <th>Item</th>
                            <th>Method</th>
                            <th>Price</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="(group, gkey, gindex) in priceList">
                            <tr :key="'group' + gkey">
                              <td class="primary white--text" colspan="4">
                                {{ gkey }}
                              </td>
                            </tr>
                            <template v-for="(subgroup, skey, sindex) in group">
                              <tr :key="'subgroup' + gkey + sindex">
                                <td class="tableSubHeaders " colspan="4">
                                  {{ skey }}
                                </td>
                              </tr>
                              <tr
                                v-for="(item, index) in subgroup"
                                :key="'item' + gindex + skey + index"
                              >
                                <td class="font-weight-bold">
                                  {{ item.LABEL }}
                                </td>
                                <td>{{ item.METHOD | shorten(25) }}</td>
                                <td>{{ item.PRICE }}</td>
                                <td>
                                  <v-btn icon small
                                    ><v-icon small @click="editPrice(item)"
                                      >edit</v-icon
                                    ></v-btn
                                  >
                                </td>
                              </tr>
                            </template>
                          </template>
                        </tbody></v-simple-table
                      ></v-col
                    ></v-row
                  ></v-card-text
                ></v-card
              ></v-col
            ></v-row
          ></v-card-text
        ></v-card
      ><v-dialog v-model="updateTierDialog" width="600"
        ><v-card outlined
          ><v-card-title>Update Tier</v-card-title
          ><v-card-text
            ><v-row
              ><v-col
                >Note: All tier specific turanrounds and surcharges will be
                applied.</v-col
              ></v-row
            ><v-row
              ><v-col
                ><v-select
                  dense
                  outlined
                  :items="tiers"
                  label="Tier"
                  v-model="selectedTier"
                  hide-details
                ></v-select></v-col></v-row
            ><v-row
              ><v-col
                ><v-switch
                  label="Apply Tier Price List"
                  v-model="applyPriceList"
                  inset
                ></v-switch></v-col></v-row
            ><v-row
              ><v-col
                ><v-select
                  :disabled="!applyPriceList"
                  label="Currency"
                  v-model="applyPriceListCurrency"
                  outlined
                  dense
                  hide-details
                  :items="currencies"
                  item-text="currency"
                  item-value="currency"
                ></v-select></v-col></v-row></v-card-text
          ><v-card-actions
            ><v-btn @click="updateTierDialog = !updateTierDialog">Cancel</v-btn
            ><v-spacer /><v-btn
              :loading="tierUpdating"
              :disabled="
                tierUpdating ||
                  !selectedTier ||
                  (applyPriceList && !applyPriceListCurrency)
              "
              color="primary"
              @click="updateTier"
              >Update</v-btn
            ></v-card-actions
          ></v-card
        ></v-dialog
      ><v-dialog v-model="updatePriceDialog" width="600"
        ><v-card outlined
          ><v-card-title>Update Price</v-card-title
          ><v-card-text
            ><v-row
              ><v-col
                ><v-text-field
                  dense
                  outlined
                  :value="selectedPrice.PRICE"
                  label="Current Price"
                  readonly
                  hide-details
                ></v-text-field></v-col></v-row
            ><v-row
              ><v-col
                ><v-text-field
                  dense
                  outlined
                  v-model="updatedPrice"
                  v-validate="'max_value:5000'"
                  name="Price"
                  :error-messages="errors.first('Price')"
                  label="New Price"
                ></v-text-field></v-col
            ></v-row> </v-card-text
          ><v-card-actions
            ><v-btn
              @click="updatePriceDialog = !updatePriceDialog"
              :disabled="priceUpdating"
              >Cancel</v-btn
            ><v-spacer /><v-btn
              color="primary"
              @click="updatePrice"
              :loading="priceUpdating"
              :disabled="priceUpdating"
              >Submit</v-btn
            ></v-card-actions
          ></v-card
        ></v-dialog
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      clients: [],
      clientsLoading: false,
      client: "",
      clientLoading: false,
      selectedClient: [],
      priceListSearch: "",
      tiers: ["1", "2", "3", "4", "5", "6"],
      currencies: [
        {
          unit: "£",
          currency: "GBP",
          display: false,
        },
        {
          unit: "€",
          currency: "EUR",
          display: false,
        },
      ],
      selectedCurrency: "",
      updateTierDialog: false,
      selectedTier: "",
      applyPriceList: false,
      applyPriceListCurrency: "",
      tierUpdating: false,
      updatePriceDialog: false,
      selectedPrice: {},
      updatedPrice: "",
      priceUpdating: false,
    };
  },

  mounted() {
    this.getClients();
  },

  computed: {
    priceList() {
      if (this.selectedClient.CLIENT) {
        var priceList = {};
        this.selectedClient.priceList[this.selectedCurrency].forEach(
          (price) => {
            if (
              this.priceListSearch.length > 2 &&
              !price.LABEL.toLowerCase().includes(
                this.priceListSearch.toLowerCase()
              )
            ) {
              return;
            }
            if (!priceList[price.GROUP]) {
              priceList[price.GROUP] = {};
            }
            if (!priceList[price.GROUP][price.SUBGROUP]) {
              priceList[price.GROUP][price.SUBGROUP] = [];
            }

            priceList[price.GROUP][price.SUBGROUP].push(price);
          }
        );
        return priceList;
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
      this.clientLoading = true;
      this.$axios.get("price-lists/" + this.client).then((response) => {
        this.selectedClient = response.data.data;
        this.selectedTier = response.data.data.RATETIER;
        this.selectedCurrency = Object.keys(response.data.data.priceList)[0];
        this.currencies.forEach((currency) => {
          if (
            Object.keys(response.data.data.priceList).includes(
              currency.currency
            )
          ) {
            currency.display = true;
          } else {
            currency.display = false;
          }
        });
        this.clientLoading = true;
      });
    },
    clearClient() {
      this.client = "";
      this.selectedClient = "";
    },
    updateTier() {
      this.tierUpdating = true;
      var url =
        "clients/update-tier/" +
        encodeURIComponent(this.selectedClient.CLIENT) +
        "?rate_tier=" +
        this.selectedTier +
        "&price_list=" +
        (this.applyPriceList ? 1 : 0) +
        "&currency=" +
        this.applyPriceListCurrency;
      this.$axios.patch(url).then((response) => {
        this.tierUpdating = false;
        this.updateTierDialog = false;
        this.getClient();
        this.applyPriceList = false;
        this.selectedTier = "";
      });
    },
    editPrice(item) {
      this.updatePriceDialog = true;
      this.selectedPrice = item;
      this.updatedPrice = "";
      console.log(item);
    },
    updatePrice() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        this.priceUpdating = true;
        var query =
          "price-lists?client=" +
          encodeURIComponent(this.selectedClient.CLIENT) +
          "&id=" +
          this.selectedPrice.PRCELISTID +
          "&price=" +
          this.updatedPrice +
          "&currency=" +
          this.selectedCurrency;

        this.$axios.patch(query).then((response) => {
          this.priceUpdating = false;
          this.getClient();
          this.updatePriceDialog = false;
        });
      });
    },
    viewPriceList() {
      window.open(
        "http://nm-web01:8080/jasperserver/flow.html?j_username=jasperadmin&j_password=jasperadmin&_flowId=viewReportFlow&ParentFolderUri=/Reports/Bid_Team&reportUnit=/Reports/Bid_Team/PriceListTest&output=pdf&standAlone=true&CLIENT=" +
          encodeURIComponent(this.selectedClient.CLIENT),
        "_blank"
      );
    },
  },
};
</script>

<style></style>
