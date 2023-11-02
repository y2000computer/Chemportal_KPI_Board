<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-toolbar flat dark>
          <v-toolbar-title>Unscheduled Sample Batches</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="search" label="Search"></v-text-field>
          <v-data-table
            :items="batches"
            :headers="headers"
            :loading="loading"
            :search="search"
            sort-by="JOB desc"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      batches: [],
      loading: true,
      search: "",
      headers: [
        {
          text: "Hold Batch ID",
          value: "JOB"
        },
        {
          text: "Client",
          value: "office.client.client_name"
        },
        {
          text: "Office",
          value: "office.SEARCHNAME"
        },
        {
          text: "Samples",
          value: "samples_count",
          searchable: false
        },
        {
          text: "Project ID",
          value: "project.PROJ_ID"
        },
        {
          text: "Project Name",
          value: "project.PROJ_NAME"
        },
        {
          text: "Actions"
        }
      ]
    };
  },
  mounted() {
    this.getBatches();
  },
  methods: {
    getBatches() {
      this.$axios.get("holdbatches").then(response => {
        this.batches = response.data;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>
