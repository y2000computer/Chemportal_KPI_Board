<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Projects</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="4">
              <v-text-field dense outlined label="Search" v-model="search"></v-text-field>
            </v-col>
          </v-row>
          <v-data-table :search="search" :headers="headers" :items="projects" :loading="loading"></v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      headers: [
        { text: "#", value: "PROJECTSID" },
        { text: "Project ID", value: "PROJ_ID" },
        { text: "Project Name", value: "PROJ_NAME" },
        { text: "Client", value: "office.client.client_name" },
        { text: "Office", value: "office.SEARCHNAME" }
      ],
      loading: true,
      search: ""
    };
  },
  mounted() {
    this.getProjects();
  },
  methods: {
    getProjects() {
      this.$axios.get("projects").then(response => {
        this.projects = response.data;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>
