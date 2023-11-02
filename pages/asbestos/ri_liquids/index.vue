<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>Cargille Liquids</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-btn to="ri_liquids/new">New</v-btn>
          <v-data-table :loading="loading" :items="riLiquids" :headers="headers">
            <template v-slot:item.actions="{item}">
              <v-btn x-small @click="openRILiquid(item.ASBRILIQID)">Open</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        {{riLiquids}}
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      riLiquids: [],
      headers: [
        { text: "ID", value: "CHEMTESTID" },
        { text: "Received", value: "RECDATE" },
        { text: "Location", value: "LOCATION" },
        { text: "Lot No.", value: "LOTNO" },
        { text: "Series", value: "SERIES" },
        { text: "RI", value: "RI" },
        { text: "Expires", value: "UNOPEXPDT" },
        { text: "Opened", value: "OPENDATE" },
        { text: "Opened By", value: "opened_by.USER_NAME" },
        { text: "Expires", value: "OPEXPDT" },
        { text: "Disposal Date", value: "DISPDATE" },
        { text: "Disposed By", value: "DISPBY" },
        { text: "Open", value: "actions", sortable: false }
      ]
    };
  },
  mounted() {
    this.getRILiquids();
  },
  methods: {
    getRILiquids() {
      this.$axios.get("asbestos/riliquids").then(response => {
        this.riLiquids = response.data;
        this.loading = false;
      });
    },
    openRILiquid(id) {
      console.log(id);
      this.$axios
        .patch("asbestos/riliquids/open", {
          asbriliqid: id
        })
        .then(this.getRILiquids);
    }
  }
};
</script>

<style>
</style>