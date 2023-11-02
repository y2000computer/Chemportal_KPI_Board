<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          Tenax
          <v-spacer />
          <v-btn icon @click="getSamples">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-col>
              <v-autocomplete
                dense
                outlined
                label="Select Sample"
                :loading="samplesLoading"
                :items="samples"
                item-text="SAMPNUM"
                v-model="sample"
                return-object
                hide-details
              >
                <template v-slot:selection="data">
                  <span class="font-weight-bold">{{ data.item.SAMPNUM }}</span>
                  <span class="body-2">
                    - {{ data.item.JOB }} -
                    {{ data.item.job.office.client.CLIENTNAME }}
                  </span>
                </template>
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.SAMPNUM }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.item.JOB }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ data.item.job.office.client.CLIENTNAME }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-avatar size="36" :color="data.item.tenaxQFile ? 'green' : 'red'">Q</v-list-item-avatar>
                  <v-list-item-avatar size="36" :color="data.item.tenaxLFile ? 'green' : 'red'">L</v-list-item-avatar>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-select
                dense
                hide-details
                v-model="vocTestType"
                outlined
                label="Test Type"
                :items="['Passive', 'Active']"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                dense
                v-model="vocFactor"
                hide-details
                outlined
                :disabled="blank"
                label="Factor"
              ></v-text-field>
            </v-col>
            <v-col md="1">
              <v-checkbox label="Blank" v-model="blank"></v-checkbox>
            </v-col>
            <v-col class="text-center">
              <v-btn x-large color="primary" @click="getResults">Submit</v-btn>
            </v-col>
          </v-row>
          <v-divider />
          <v-row>
            <v-col cols="3" v-if="results.vocData">
              <v-card flat>
                <v-card-title>VOC Results</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-simple-table dense>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="voc in results.vocData" :key="voc.inchiKey">
                            <td>{{ voc.name }}</td>
                            <td
                              :class="
                                voc.result.charAt(0) == '<'
                                  ? ''
                                  : 'red--text font-weight-bold'
                              "
                            >{{ voc.result }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="results.ticResults">
              <v-card flat>
                <v-card-title>
                  <v-row no-gutters>
                    <v-col>TIC Results</v-col>
                    <v-col>
                      <v-select
                        label="Standard"
                        dense
                        hide-details
                        outlined
                        v-model="ticStandard"
                        :items="results.ticResults"
                        item-text="standard"
                        return-object
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col md="8" cols="12">
                      <v-simple-table dense>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Aromatic</th>
                            <th>Band</th>
                            <th>Carbons</th>
                            <th>Checked</th>
                            <th>Result</th>
                            <th>RT</th>
                            <th>PubChem</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="result in ticStandard.results">
                            <tr
                              :key="result.casNo"
                              :class="
                                result.limsData.CHECKED == '1'
                                  ? 'tableSuccess'
                                  : 'tableWarnings'
                              "
                            >
                              <td @click="editTicDet(result)">{{ result.limsData.COMPOUND }}</td>
                              <td>
                                {{
                                result.limsData.AROMATIC == '1' ? 'Y' : 'N'
                                }}
                              </td>
                              <td>
                                {{
                                result.limsData.tenax_band
                                ? result.limsData.tenax_band.LABEL
                                : 'Not Set'
                                }}
                              </td>
                              <td>{{ result.limsData.CARBONS }}</td>
                              <td>{{ result.limsData.CHECKED == '1' ? 'Y' : 'N' }}</td>
                              <td>{{ parseFloat(result.result).toFixed(1) }}</td>
                              <td>
                                {{
                                result.quality == 'From VOC'
                                ? 'From VOC'
                                : parseFloat(result.retentionTime).toFixed(
                                1
                                )
                                }}
                              </td>
                              <td>
                                <a
                                  :href="
                                    'https://pubchem.ncbi.nlm.nih.gov/#query=' +
                                      (result.name
                                        ? result.limsData.INCHLKEY
                                        : result.name)
                                  "
                                  target="_blank"
                                >PubChem</a>
                              </td>
                              <td>
                                <v-btn small icon @click="editTicDet(result)">
                                  <v-icon>mdi-database-edit</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                    <v-col md="4" cols="12">
                      <v-simple-table dense>
                        <thead>
                          <tr>
                            <th>Band</th>
                            <th>Aromatic</th>
                            <th>Aliphatic</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="band in ticStandard.bandings" :key="band.TENAXBNDID">
                            <td>{{ band.LABEL }}</td>
                            <td>{{ parseFloat(band.aroTotal).toFixed(1) }}</td>
                            <td>{{ parseFloat(band.aliTotal).toFixed(1) }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-dialog v-model="editDetDialog" width="800">
        <v-card v-if="editDet">
          <v-card-title>Edit {{ editDet.name }}</v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Compound Name"
                    v-model="editForm.name"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="editForm.aromatic"
                    row
                    label="Aliphatic/Aromatic:"
                    hide-details
                  >
                    <v-radio label="Aliphatic" :value="'0'"></v-radio>
                    <v-radio label="Aromatic" :value="'1'"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group v-model="editForm.standard" row label="TIC Standard:" hide-details>
                    <v-radio label="False" :value="'0'"></v-radio>
                    <v-radio label="True" :value="'1'"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group v-model="editForm.ticrep" row label="Report TIC" hide-details>
                    <v-radio label="False" :value="'0'"></v-radio>
                    <v-radio label="True" :value="'1'"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    outlined
                    :items="bands"
                    item-value="TENAXBNDID"
                    item-text="LABEL"
                    label="Banding"
                    v-model="editForm.band"
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="editForm.checked"
                    row
                    label="Mark as Checked"
                    hide-details
                  >
                    <v-radio label="False" :value="'0'"></v-radio>
                    <v-radio label="True" :value="'1'"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="cancelEdit()">Cancel</v-btn>
            <v-spacer />
            <v-btn color="primary" @click="updateTic">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      samples: [],
      samplesLoading: false,
      sample: [],
      standards: [],
      results: [],
      vocTestType: "",
      vocFactor: "",
      ticStandard: [],
      blank: false,
      editDetDialog: false,
      editDet: [],
      editForm: {
        name: null,
        aromatic: null,
        standard: null,
        ticrep: null,
        band: null,
        checked: null
      }
    };
  },
  mounted() {
    this.getSamples();
    this.getStandards();
    this.getBands();
  },
  methods: {
    getSamples() {
      this.samplesLoading = true;
      this.$axios.get("tenax/sample-list").then(response => {
        this.samples = response.data.data;
        this.samplesLoading = false;
      });
    },
    getStandards() {
      this.$axios.get("tenax/standard-list").then(response => {
        this.standards = response.data.data;
      });
    },
    getBands() {
      this.$axios.get("tenax/band-list").then(response => {
        this.bands = response.data.data;
      });
    },
    getResults() {
      this.results = [];
      this.ticStandard = [];
      this.error = "";
      this.$axios
        .post("tenax/results", {
          sample: this.sample.SAMPNUM,
          type: this.vocTestType,
          factor: this.vocFactor,
          blank: this.blank
        })
        .then(response => {
          this.results = response.data.data;
          this.setDefaultStandard();
        });
    },
    setDefaultStandard() {
      this.ticStandard = this.results.ticResults[0];
    },
    editTicDet(result) {
      this.editDet = result;
      this.editDetDialog = true;
      this.editForm = {
        name: result.limsData.COMPOUND,
        aromatic: result.limsData.AROMATIC,
        standard: result.limsData.STANDARD,
        ticrep: result.limsData.TICREP,
        band: result.limsData.tenax_band
          ? result.limsData.tenax_band.TENAXBNDID
          : null,
        checked: result.limsData.CHECKED
      };
    },
    updateTic() {
      this.$axios
        .patch("tenax/edit-det", {
          name: this.editForm.name,
          casno: this.editDet.limsData.CASNO,
          aromatic: this.editForm.aromatic,
          standard: this.editForm.standard,
          ticrep: this.editForm.ticrep,
          checked: this.editForm.checked,
          tenaxBandId: this.editForm.band
        })
        .then(response => {
          this.cancelEdit();
          this.getResults();
        });
    },
    cancelEdit() {
      this.editDet = [];
      this.editDetDialog = false;
    }
  }
};
</script>

<style></style>
