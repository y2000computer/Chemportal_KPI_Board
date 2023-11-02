<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>Dets</v-card-title
        ><v-card-text>
          <v-row dense
            ><v-col
              ><v-text-field
                dense
                outlined
                v-model="search"
                label="Search"
                @keydown.enter="getDets"
              ></v-text-field></v-col
            ><v-col
              ><v-text-field
                v-model="supertype"
                label="Type"
                outlined
                dense
              ></v-text-field></v-col
            ><v-col><v-btn @click="getDets"></v-btn></v-col
          ></v-row>
          <v-row
            ><v-col
              ><v-text-field
                v-model="tableSearch"
                outlined
                label="Table Search"
                dense
              ></v-text-field></v-col></v-row
          ><v-data-table
            dense
            disable-pagination
            hide-default-footer
            :items="dets"
            :headers="headers"
            :search="tableSearch"
          ></v-data-table></v-card-text></v-card></v-col
  ></v-row>
</template>

<script>
export default {
  data() {
    return {
      dets: [],
      headers: [
        { text: 'Det', value: 'DET' },
        { text: 'Name', value: 'DETNAME' },
        { text: 'Supertype', value: 'SUPERTYPE' },
        { text: 'Subtype', value: 'SUBTYPE' },
        { text: 'Rep Name', value: 'REPNAME' },
        { text: 'LOD', value: 'lod' },
        { text: 'Units', value: 'units' }
      ],
      search: '',
      supertype: '',
      tableSearch: ''
    };
  },
  methods: {
    getDets() {
      this.tableSearch = '';
      this.$axios
        .get('dets?search=' + this.search + '&supertype=' + this.supertype)
        .then(response => {
          this.dets = response.data.data;
        });
    }
  }
};
</script>

<style></style>
