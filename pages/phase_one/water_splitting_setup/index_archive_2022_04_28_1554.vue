<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">Phase One > Water Splitting Label > Backlogs, Test Setup</v-toolbar-title
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

    //Get stored printer from local storage
    this.selectedPrinter = localStorage.getItem('chemportalLabelPrinter');
    this.getPrinters();
    //If job param passed in url then auto search for job
    if (this.$route.query.job) {
      let job = this.$route.query.job;
      this.search = job;
      this.searchTrigger();
    }    

  },

  methods: {
    getPrinters() {
      this.$axios
        .get('printers?location=Sample Registration')
        .then((response) => {
          this.printers = response.data.data;
        });
    },
    searchTrigger() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.searchError = '';
          this.clearJob();
          this.addTray = 0;
          this.jobSearch(this.search);
        }
      });
    },
    getSetup() {
      this.setupLoading = true;
      this.$axios.get('phaseone/watersplittingsetup').then((response) => {        
        this.setups = response.data.data;
        this.setupLoading = false;
        //console.log('this.setups =', this.setups)
      });
    },
  },
};
</script>

<style></style>
