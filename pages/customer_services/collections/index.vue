<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Collections</v-toolbar-title>
        </v-toolbar>
        <v-card-text>{{collections}}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      collections: []
    };
  },
  mounted() {
    this.getCollections();
  },
  methods: {
    getCollections() {
      this.$axios.get("collections").then(response => {
        this.collections = response.data;
      });
    }
  }
};
</script>

<style>
</style>