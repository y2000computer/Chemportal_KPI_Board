<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Asbestos Sample History</v-toolbar-title>
        </v-toolbar>
        <v-card-text>{{samples}}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      samples: []
    };
  },
  mounted() {
    this.getSamples();
  },
  methods: {
    getSamples() {
      this.$axios.get("asbestos/samples").then(response => {
        this.samples = response.data;
      });
    }
  }
};
</script>

<style>
</style>