<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title
          >Tenax Compounds
          <v-spacer />

          <v-btn icon @click="getCompounds"><v-icon>refresh</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                clearable
                v-model="search"
                label="Search"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="compounds"
                :search="search"
                :loading="loading"
              >
                <template v-slot:item.tenaxBand="{ item }">{{
                  item.tenax_band ? item.tenax_band.LABEL : ''
                }}</template>
                <template v-slot:item.AROMATIC="{ item }"
                  ><v-chip
                    dark
                    :color="item.AROMATIC == '1' ? 'green' : 'red'"
                    >{{ item.AROMATIC == '1' ? 'Y' : 'N' }}</v-chip
                  ></template
                >
                <template v-slot:item.TICREP="{ item }"
                  ><v-chip dark :color="item.TICREP == '1' ? 'green' : 'red'">{{
                    item.TICREP == '1' ? 'Y' : 'N'
                  }}</v-chip></template
                >
                <template v-slot:item.CHECKED="{ item }"
                  ><v-chip
                    dark
                    :color="item.CHECKED == '1' ? 'green' : 'red'"
                    >{{ item.CHECKED == '1' ? 'Y' : 'N' }}</v-chip
                  ></template
                >
                <template v-slot:item.pubchem="{ item }">
                  <a
                    :href="
                      'https://pubchem.ncbi.nlm.nih.gov/#query=' + item.INCHLKEY
                    "
                    target="_blank"
                    >PubChem</a
                  >
                </template>
                <template v-slot:item.actions="{}">
                  <v-btn icon>
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
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
      loading: true,
      compounds: [],
      search: '',
      headers: [
        { text: 'Name', value: 'COMPOUND' },
        { text: 'CAS', value: 'CASNO' },
        { text: 'INCHI', value: 'INCHLKEY' },
        { text: 'Formula', value: 'FORMULA' },
        { text: 'Band', value: 'tenaxBand' },
        { text: 'Aromatic', value: 'AROMATIC' },
        { text: 'Aromatic', value: 'AROMATIC' },
        { text: 'Report TIC', value: 'TICREP' },
        { text: 'Checked', value: 'CHECKED' },
        { text: 'PubChem', value: 'pubchem' },
        { text: 'Actions', value: 'actions' }
      ]
    };
  },
  mounted() {
    this.getCompounds();
  },
  methods: {
    getCompounds() {
      this.loading = true;
      this.$axios.get('tenax/compound-list').then(response => {
        this.compounds = response.data.data;
        this.loading = false;
      });
    }
  }
};
</script>

<style></style>
