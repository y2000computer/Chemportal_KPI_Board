<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">Water Splitting Sample Back Log </v-toolbar-title
          ><v-spacer /></v-toolbar>
        <v-card-text>
          <v-tabs grow>
    
            <v-tab>Water Splitting Sample BackLog </v-tab>
            <v-tab-item>
              <sample-list :samples="samples" :loading="samplesLoading" @getSamples="getSamples"  />
            </v-tab-item>

          </v-tabs> 
          </v-card-text>
          </v-card></v-col>
  </v-row>
</template>

<script>
import sampleList from './components/sample_list';
export default {
  components: {
    sampleList,
  },
  data() {
    return {
      samplesLoading: true,
      samples: [],
 
    };
  },
  mounted() {
    this.getSamples();

  },

  methods: {

    getSamples() {
      this.samplesLoading = true;
      this.$axios.get('phaseone/wasp_sample_backlog').then((response) => {        
        this.samples = response.data.data;
        this.samplesLoading = false;
      });
    },
  },
};
</script>

<style></style>
