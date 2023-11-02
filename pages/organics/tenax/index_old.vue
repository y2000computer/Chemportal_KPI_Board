<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          Tenax Test
          <v-spacer />
          <v-btn icon @click="getSamples">
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <v-row>
                <v-col>980002 - 20-06870 - ERITH CONTRACTORS -D</v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field dense hide-details outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field dense hide-details outlined></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-list dense>
                    <v-list-item v-for="(det,key) in vocResults[980002]" :key="det + key">
                      <v-list-item-content>
                        <v-list-item-title>{{key}}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2" v-for="(sample,index) in samples" :key="sample.SAMPNUM">
              <v-row>
                <v-col>{{sample.SAMPNUM}} - {{sample.JOB}} - {{sample.CLIENT}}</v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field dense outlined hide-details v-model="form.samples[index].factor"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select
                    outlined
                    dense
                    hide-details
                    :items="types"
                    v-model="form.samples[index].type"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="vocResults[sample.SAMPNUM]">
                <v-col>
                  <v-list dense>
                    <v-list-item
                      v-for="(det,key,index) in vocResults[sample.SAMPNUM]"
                      :key="sample.SAMPNUM + '-' + index"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{det}}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-btn @click="getVocResults">VOC Gets</v-btn>
        {{form}}
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      types: ["Active", "Passive"],
      type: "",
      samples: [],
      form: { samples: [] },
      vocResults: []
    };
  },
  mounted() {
    this.getSamples();
  },
  methods: {
    getSamples() {
      this.samples = [];
      this.vocResults = [];
      this.$axios.get("tenax/spreadsheet-list").then(response => {
        this.samples = response.data.data;
        response.data.data.forEach(sample => {
          this.form.samples.push({
            sample: sample.SAMPNUM,
            factor: "10080",
            type: "Passive"
          });
        });
      });
    },
    getVocResults() {
      this.$axios.post("tenax/voc-results", this.form).then(response => {
        this.vocResults = response.data;
      });
    }
  }
};
</script>

<style>
</style>