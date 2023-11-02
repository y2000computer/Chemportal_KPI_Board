<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat dark>
          <v-toolbar-title>Chemsolutions Barcode Search</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row dense>
            <v-col md="4" cols="12">
              <v-text-field
                autofocus
                outlined
                :loading="loading"
                v-model="search"
                v-validate="{rules:'required'}"
                name="Barcode"
                :error-messages="errors.first('Barcode')"
                label="Search"
                @keyup.enter="barcodeSearch"
                append-icon="search"
                @click:append-outer="barcodeSearch"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-alert
                type="error"
                outline
                :value="errors"
                v-if="this.$store.state.validation.errors.length"
              >{{this.$store.state.validation.errors}}</v-alert>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-card outlined v-if="searched">
                <v-toolbar dense flat dark>
                  <v-toolbar-title>Sample Details for {{data.CONTAINER.BARCODE}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col md="3" cols="12">
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Client</v-card-title>
                        <v-card-text class="headline">{{data.CLIENT}}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Container</v-card-title>
                        <v-card-text class="headline">{{data.CONTAINER.CONTAINER}}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Location</v-card-title>
                        <v-card-text class="headline">{{data.CONTAINER.CLIENTSREF}}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Sample ID</v-card-title>
                        <v-card-text class="headline">{{data.CONTAINER.SAMPLE_ID}}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Sample Ref</v-card-title>
                        <v-card-text class="headline">{{data.CONTAINER.SAMPLE_REF}}</v-card-text>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Sample Depth</v-card-title>
                        <v-card-text class="headline">{{data.CONTAINER.SAMPTOP}}</v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col md="3" col="12">
                      <v-card outlined>
                        <v-card-title class="subtitle-2">Additional Sample Containers</v-card-title>
                        <v-card-text>
                          <v-data-table
                            :headers="sampleHeaders"
                            :items="data.SAMPLE.CONTAINERS"
                            hide-default-footer
                          ></v-data-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-2">
                          COC Details
                          <v-spacer />
                          <v-icon @click="runreport(data)">print</v-icon>
                        </v-card-title>
                        <v-card-text>
                          <v-data-table :headers="cocHeaders" :items="data.COC" hide-default-footer></v-data-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
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
      search: "",
      searched: false,
      data: [],
      container: [],
      loading: false,
      sampleHeaders: [
        { text: "Barcode", value: "BARCODE", sortable: false },
        { text: "Container", value: "CONTAINER", sortable: false }
      ],
      cocHeaders: [
        { text: "Location", value: "CLIENTSREF", sortable: false },
        { text: "Sample ID", value: "SAMPLE_ID", sortable: false },
        { text: "Sample Ref", value: "SAMPLE_REF", sortable: false },
        { text: "Sample Depth", value: "SAMPTOP", sortable: false }
      ]
    };
  },
  methods: {
    barcodeSearch() {
      this.data = [];
      this.loading = true;
      this.searched = false;
      this.$axios
        .get("chemsolutions?barcode=" + this.search)
        .then(response => {
          this.data = response.data;
          this.searched = true;
          (this.search = ""), (this.loading = false);
        })
        .catch(e => {
          this.error = e + "";
          this.loading = false;
        });
    },
    runreport(COC) {
      window.open(
        "http://nm-web01:8080/jasperserver/flow.html?j_username=guestUser&j_password=guest&_flowId=viewReportFlow&ParentFolderUri=/Reports/Chemsolutions&reportUnit=/Reports/Chemsolutions/ChemsolutionCOC&output=pdf&standAlone=true&COC=" +
          this.data.COCNO,
        "_blank"
      );
    }
  }
};
</script>

<style>
</style>