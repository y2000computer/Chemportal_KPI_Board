<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Tenax</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col md="3">
              <v-row dense>
                <v-col>Sample List</v-col>
                <v-col>
                  <v-btn icon small @click="getSamples">
                    <v-icon>refresh</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-list dense>
                <v-list-item-group v-model="sample">
                  <v-list-item
                    three-line
                    v-for="sample in samples"
                    :key="sample.SAMPNUM"
                    :value="sample"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{
                        sample.SAMPNUM
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        sample.job.office.client.CLIENTNAME
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle
                        >Due:
                        {{
                          sample.OFFICEDATE | moment('DD/MM/YY')
                        }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                    <v-list-item-action>
                      <span>
                        <v-avatar
                          size="36"
                          :color="sample.tenaxQFile ? 'green' : 'red'"
                          >Q</v-avatar
                        >
                        <v-avatar
                          size="36"
                          :color="sample.tenaxLFile ? 'green' : 'red'"
                          >L</v-avatar
                        >
                      </span>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col>
              <v-row>
                <v-col>
                  <v-row>
                    <v-col>
                      <v-card v-if="sample.SAMPNUM">
                        <v-card-text>
                          <v-alert v-if="error.length" type="error">{{
                            error
                          }}</v-alert>
                          <v-row dense>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                readonly
                                :value="sample.SAMPNUM"
                                label="Sample"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                readonly
                                :value="sample.JOB"
                                label="Job"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                readonly
                                :value="sample.job.office.client.CLIENTNAME"
                                label="Client"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                readonly
                                :value="sample.OFFICEDATE | moment('DD/MM/YY')"
                                label="DueDate"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col>
                              <v-select
                                outlined
                                hide-details
                                dense
                                :items="vocTestTypes"
                                v-model="form.vocTestType"
                                label="Test Type"
                              ></v-select>
                            </v-col>
                            <v-col>
                              <v-text-field
                                outlined
                                dense
                                v-model="form.factor"
                                label="Factor"
                                hide-details
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-select
                                outlined
                                dense
                                hide-details
                                :items="standards"
                                v-model="form.ticStandard"
                                item-value="CASNO"
                                item-text="COMPOUND"
                                label="TIC Standard"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            :disabled="
                              !sample ||
                                !form.factor ||
                                !form.vocTestType ||
                                !form.ticStandard
                            "
                            color="primary"
                            @click="getSampleResults"
                            >Submit</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col md="6">
                      <v-simple-table dense v-if="results.vocData">
                        <thead>
                          <tr>
                            <th>Name</th>

                            <th>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(row, index) in results.vocData"
                            :key="'vocRow' + index"
                          >
                            <td>{{ row.Name }}</td>

                            <td v-if="row.Result.charAt(0) == '<'">
                              {{ row.Result }}
                            </td>
                            <td v-else class="red--text font-weight-bold">
                              {{ row.Result }}
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-simple-table dense>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cas No</th>
                <th>Carbons</th>
                <th>Aromatic</th>
                <th>Band</th>
                <th>Area</th>
                <th>Quality</th>
                <th>Result</th>
                <th>Checked?</th>
                <th>PubChem</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tic in results.ticData" :key="tic.CASNo">
                <td>{{ tic.det ? tic.det.COMPOUND : tic.Name }}</td>
                <td>{{ tic.CASNo }}</td>
                <td>{{ tic.det ? tic.det.CARBONS : '' }}</td>
                <td>{{ tic.det ? tic.det.AROMATIC : '' }}</td>
                <td>
                  {{ tic.det.tenax_band ? tic.det.tenax_band.LABEL : '' }}
                </td>
                <td>{{ tic.area }}</td>
                <td>{{ tic.quality }}</td>
                <td>{{ parseFloat(tic.result).toFixed(1) }}</td>
                <td>{{ tic.det ? tic.det.CHECKED : '' }}</td>
                <td>
                  <a
                    :href="
                      'https://pubchem.ncbi.nlm.nih.gov/#query=' +
                        (tic.det ? tic.det.INCHLKEY : tic.name)
                    "
                    target="_blank"
                    >PubChem</a
                  >
                </td>
                <td>
                  <v-btn small icon @click="editTic(tic)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-dialog v-model="editDetDialog" width="800">
          <v-card v-if="editDet">
            <v-card-title>Edit {{ editDet.name }}</v-card-title>
            <v-card-text>
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
                  <v-radio-group
                    v-model="editForm.standard"
                    row
                    label="TIC Standard:"
                    hide-details
                  >
                    <v-radio label="False" :value="'0'"></v-radio>
                    <v-radio label="True" :value="'1'"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="editForm.ticrep"
                    row
                    label="Report TIC"
                    hide-details
                  >
                    <v-radio label="False" :value="'0'"></v-radio>
                    <v-radio label="True" :value="'1'"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row
                ><v-col
                  ><v-select
                    outlined
                    dense
                    :items="bands"
                    item-value="TENAXBNDID"
                    item-text="LABEL"
                    label="Banding"
                    v-model="editForm.band"
                  ></v-select></v-col
              ></v-row>
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
            </v-card-text>
            <v-card-actions>
              <v-btn @click="cancelEdit()">Cancel</v-btn>
              <v-spacer />
              <v-btn color="primary" @click="setTic">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
      {{ bands }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      samples: [],
      sample: [],
      error: '',
      standards: [],
      bands: [],
      vocTestTypes: ['Passive', 'Active'],
      form: {
        vocTestType: null,
        factor: null,
        ticStandard: null
      },
      results: [],
      editDetDialog: false,
      editDet: [],
      editForm: {
        name: null,
        aromatic: null,
        standard: null,
        ticrep: null,
        checked: null,
        band: null
      }
    };
  },
  mounted() {
    this.getStandards();
    this.getSamples();
    this.getBands();
  },
  methods: {
    getStandards() {
      this.$axios.get('tenax/standard-list').then(response => {
        this.standards = response.data.data;
      });
    },
    getSamples() {
      this.$axios.get('tenax/sample-list').then(response => {
        this.samples = response.data.data;
      });
    },
    getBands() {
      this.$axios.get('tenax/band-list').then(response => {
        this.bands = response.data.data;
      });
    },
    getSampleResults() {
      this.results = [];
      this.error = '';
      this.$axios
        .post('tenax/results', {
          sample: this.sample.SAMPNUM,
          type: this.form.vocTestType,
          factor: this.form.factor,
          ticStandard: this.form.ticStandard
        })
        .then(response => {
          this.results = response.data;
        })
        .catch(e => {
          this.error = 'Something went wrong, try another standard...';
        });
    },
    editTic(det) {
      this.editDetDialog = true;
      this.editDet = det;
      this.editForm = {
        name: det.det.COMPOUND,
        aromatic: det.det.AROMATIC,
        standard: det.det.STANDARD,
        ticrep: det.det.TICREP,
        band: det.det.tenax_band ? det.det.tenax_band.TENAXBNDID : null
      };
      console.log(det);
    },
    setTic() {
      this.$axios
        .patch('tenax/edit-det', {
          name: this.editForm.name,
          casno: this.editDet.CASNo,
          aromatic: this.editForm.aromatic,
          standard: this.editForm.standard,
          ticrep: this.editForm.ticrep,
          checked: this.editForm.checked,
          tenaxBandId: this.editForm.band
        })
        .then(response => {
          this.cancelEdit();
          this.getSampleResults();
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
