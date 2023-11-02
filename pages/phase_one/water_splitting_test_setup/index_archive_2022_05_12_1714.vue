<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">Phase One > Water Splitting Label > Test Setup</v-toolbar-title
          ><v-spacer /></v-toolbar>
        <v-card-text>
          <v-tabs grow>

            
            <v-tab>Backlogs, Test Setup</v-tab>
            <v-tab-item>
              <setup-list :setups="setups" :loading="setupLoading" @getSetup="getSetup"  />
            </v-tab-item>

          </v-tabs> 
          </v-card-text>
          </v-card></v-col>
  </v-row>
</template>

<script>

import setupList from './components/setup_list';
export default {
  components: {
    setupList,
  },
  data() {
    return {
      setupLoading: true,
      setups: [],

      loading: false,
      printing: false,
      search: '',
      job: [],
      addTray: 0,
      traysLoading: false,
      priorityLabels: false,
      searchError: '',
      printers: [],
      selectedPrinter: '',

 
    };
  },
  mounted() {
    this.getSetup();
  },

  methods: {

    getSetup() {
      this.setupLoading = true;
      this.$axios.get('phaseone/watersplittingtestsetup').then((response) => {                
        this.setups = response.data.data;
        this.setupLoading = false;
        console.log('this.setups =', this.setups)
      });
    },
  },
};
</script>

<style></style>
