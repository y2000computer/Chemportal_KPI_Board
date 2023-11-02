<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Equipment Register</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-data-table :headers="headers" :items="equipment"></v-data-table>
        </v-card-text>
      </v-card>
      {{equipment}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      equipment: [],
      headers: [
        { text: "ID", value: "CHEMTESTID" },
        { text: "Type", value: "type.DESCRIPTN" },
        { text: "Serial No", value: "SERIALNO" },
        { text: "Rec Date", value: "RECDATE" },
        { text: "Location", value: "LOCATION" }
      ]
    };
  },
  mounted() {
    this.getEquipment();
  },
  methods: {
    getEquipment() {
      this.$axios.get("equipment").then(response => {
        this.equipment = response.data;
      });
    }
  }
};
</script>

<style>
</style>