<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-btn icon class="my-0 mr-3" @click="$router.back()">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          {{ this.coc }} Details
        </v-card-title>

        <v-card-text>
          <v-data-table
            dense
            :items="samples"
            :headers="headers"
            hide-default-footer
            disable-pagination
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      coc: null,
      samples: [],
      headers: [
        { text: "Clients Ref", value: "Location" },
        { text: "Sample Ref", value: "SampleRef" },
        { text: "Sample ID", value: "SampleID" },
        { text: "Sample Top", value: "SampTop" },
        { text: "Sample Type", value: "SuperType" },
        { text: "AGS Type", value: "AgsType" },
        { text: "Containers", value: "Containers" },
        { text: "Barcodes", value: "Barcodes" }
      ]
    };
  },
  mounted() {
    this.coc = this.$route.params.COC;
    this.getSamples(this.coc);
  },
  methods: {
    getSamples(COC) {
      this.$axios.get("/chemsolutions/cocs/" + COC).then(response => {
        this.samples = response.data;
      });
    }
  }
};
</script>

<style></style>
