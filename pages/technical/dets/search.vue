<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar flat dark>
          <v-toolbar-title>Det Search</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                label="Det Search"
                outlined
                v-validate="{rules:'required|min:3'}"
                name="Det"
                :error-messages="errors.first('Det')"
                autofocus
                :loading="loading"
                append-icon="search"
                @click:append="searchTrigger()"
                v-model="search"
                v-on:keyup.enter="searchTrigger()"
              ></v-text-field>
            </v-col>
            <v-col md="3" cols="12">
              <v-select
                outlined
                multiple
                label="Sample Types"
                :items="sampleTypes"
                item-value="SUPERTYPE"
                item-text="LABEL"
              ></v-select>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="dets">
            <template v-slot:item.LOLOD="{item}">{{item.LOLOD.replace(/0+$/g, "")}}</template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      search: "",
      dets: [],
      sampleTypes: [
        { SUPERTYPE: "S", LABEL: "Soil" },
        { SUPERTYPE: "W", LABEL: "Water" },
        { SUPERTYPE: "1", LABEL: "10:1 Leachate" },
        { SUPERTYPE: "2", LABEL: "2 Leachate" },
        { SUPERTYPE: "8", LABEL: "8 Leachate" },
        { SUPERTYPE: "M", LABEL: "Misc Solid" }
      ],
      headers: [
        { text: "Det Code", value: "DET" },
        { text: "Short Name", value: "DETNAME" },
        { text: "Rep Name", value: "REPNAME" },
        { text: "Units", value: "unit" },
        { text: "LOD", value: "LOLOD" },
        { text: "CAS No.", value: "CASCODE" }
      ]
    };
  },
  methods: {
    searchTrigger() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.loading = true;
          this.detSearch();
        }
      });
    },
    detSearch() {
      this.$axios.get("dets2?search=" + this.search).then(response => {
        this.dets = response.data;
        this.loading = false;
      });
    }
  }
};
</script>

<style>
</style>