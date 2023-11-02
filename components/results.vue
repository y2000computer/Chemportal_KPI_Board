<template>
  <v-card>
    <v-card-title>Results for Export</v-card-title>
    <v-card-text>
      <v-row dense class="font-weight-bold">
        <v-col>Sample No.</v-col>
        <v-col v-for="(det,index) in uniqueDets" :key="'header' + index">{{det}}</v-col>
        <v-col cols="1"></v-col>
      </v-row>
      <v-row v-for="sample in results" :key="sample.sampnum + sample.test">
        <v-col>{{ sample.sampnum }}</v-col>
        <v-col
          v-for="det in uniqueDets"
          :key="sample.sampnum + det"
        >{{resultVal(sample.results, det)}}</v-col>
        <v-col cols="1">
          <v-btn color="primary" x-small>
            <v-icon small>delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      {{ results }}
      {{uniqueDets}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  computed: {
    results() {
      return this.$store.state.results.results;
    },
    uniqueDets() {
      return this.$store.getters["results/uniqueDets"];
    }
  },
  methods: {
    resultVal(results, det) {
      var resultVal = "-";
      results.forEach(detCode => {
        if (detCode.detname == det) {
          resultVal = detCode.result;
          return resultVal;
        }
      });
      return resultVal;
    }
  }
};
</script>

<style></style>
