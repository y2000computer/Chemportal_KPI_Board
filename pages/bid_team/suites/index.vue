<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>Suites</v-card-title
        ><v-card-text>
          <v-row dense
            ><v-col
              ><v-text-field
                dense
                outlined
                v-model="search"
                label="Search"
              ></v-text-field></v-col></v-row
          ><v-data-table
            dense
            disable-pagination
            hide-default-footer
            :search="search"
            :items="suites"
            :headers="headers"
          ></v-data-table></v-card-text></v-card></v-col
  ></v-row>
</template>

<script>
export default {
  data() {
    return {
      suites: [],
      headers: [
        { text: 'Suite', value: 'SUITE' },
        { text: 'Title', value: 'title' },
        { text: 'Supertype', value: 'SUPERTYPE' },
        { text: 'Subtype', value: 'SUBTYPE' },
        { text: 'Price', value: 'PRICE' }
      ],
      search: ''
    };
  },
  mounted() {
    this.getSuites();
  },
  methods: {
    getSuites() {
      this.$axios.get('suites').then(response => {
        this.suites = response.data.data;
      });
    }
  }
};
</script>

<style></style>
