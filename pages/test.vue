<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>tEST</v-card-title
        ><v-card-text
          ><v-row
            ><v-col
              ><v-text-field v-model="sample"></v-text-field
              ><v-btn @click="test">Test</v-btn></v-col
            ><v-col
              ><prepped-sample-trays-card
                ref="preppedSampleTrayCard"
                :defaultTrayType="'1'"
                :sample="sample"
                @containerAdded="
                  sample = ''
                "/></v-col></v-row></v-card-text></v-card></v-col
  ></v-row>
</template>

<script>
import preppedSampleTraysCard from '../components/preppedSampleTrays/preppedSampleTrayCard';
export default {
  components: {
    preppedSampleTraysCard,
  },
  data() {
    return {
      sample: '',
    };
  },
  methods: {
    test() {
      this.$refs.preppedSampleTrayCard.addContainer();
    },
  },
};
</script>

<style></style>
