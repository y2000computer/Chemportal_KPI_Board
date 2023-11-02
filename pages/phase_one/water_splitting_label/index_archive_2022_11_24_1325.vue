<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-toolbar flat dense>
          <v-toolbar-title class="font-weight-medium"
            >Print Sample Splitting Label</v-toolbar-title>
        </v-toolbar>
      </v-card>
        


        <v-row>
  
          <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Sample Label"
                v-model="search_sample"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="SearchSample"
                ref="search"
                :loading="sampleLoading"
              ></v-text-field>
            </v-col>

            <v-col md="4" cols="12" class="text-center">
              <v-alert v-if="searchError" type="error">
                {{ searchError }}
              </v-alert>
            </v-col>


            <v-col md="3" cols="12">
              <v-select
                hide-details
                outlined
                dense
                :items="printers"
                item-value="PRNTERNAME"
                item-text="PRNTERNAME"
                label="Select Standard Printer"
                @change="updatePrinter"
                v-model="selectedPrinter"
              ></v-select>

              <br>

              <v-select
                hide-details
                outlined
                dense
                :items="printers_b"
                item-value="PRNTERNAME"
                item-text="PRNTERNAME"
                label="Select Small Label Printer"
                @change="updatePrinter_b"
                v-model="selectedPrinter_b"
              ></v-select>

            </v-col>


            <v-col
              md="2"
              cols="12"
              :class="
                $vuetify.breakpoint.smAndDown ? 'text-center' : 'text-right'
              "
            >
              <v-btn
                color="primary"
                v-if="LabelStandardGroupHasRecord"
                @click.prevent="printStandardLabels"
                x-large
                :loading="printing"
                :disabled="printing || !selectedPrinter"
              >
                Standard Label 
                <v-icon class="ml-4">print</v-icon>
              </v-btn>


              <v-btn
                color="primary"
                v-if="LabelSmallGroupHasRecord"
                @click.prevent="printSmallLabels"
                x-large
                :loading="printing"
                :disabled="printing || !selectedPrinter"
              >
                Small Label
                <v-icon class="ml-4">print</v-icon>
              </v-btn>


            </v-col>







        <v-row justify="space-between">
            <v-col md="18" cols="12">

                <v-toolbar-title class="font-weight-medium"
                  >Standard Label Group</v-toolbar-title>

              <v-card outlined>
                <labelstandardgroup-list :LabelStandardGroups="LabelStandardGroups" :loading="LabelStandardGroupLoading"   />
              </v-card>
            </v-col>
          </v-row>



        <v-row justify="space-between">
            <v-col md="18" cols="12">

                <v-toolbar-title class="font-weight-medium"
                  >Small Label Group</v-toolbar-title>

              <v-card outlined>
                <labelsmallgroup-list :LabelSmallGroups="LabelSmallGroups" :loading="printGroupLoading"   />
              </v-card>
            </v-col>
          </v-row>



          </v-row>
          


                

    </v-col>
  </v-row>
</template>

<script>

import labelstandardgroupList from './components/labelstandard_list';
import labelsmallgroupList from './components/labelsmall_list';

export default {
  components: {
    labelstandardgroupList,
    labelsmallgroupList
  },    
  data() {
    return {

      search_sample: '',
      sampleLoading: false,
      sampleListLoading: false,
      sample: [],
      searchbysample: '',


      LabelStandardGroupLoading: false,
      LabelStandardGroups: [],
      LabelStandardGroupHasRecord: false,


      LabelSmallGroupLoading: false,
      LabelSmallGroups: [],
      LabelSmallGroupHasRecord: false,


      loading: false,
      printing: false,
      search: '',

      searchError: '',

      printers: [],
      selectedPrinter: '',

      printers_b: [],
      selectedPrinter_b: '',


      printData: {
        path: '\\\\nm-web01\\RegistrationLabels$\\',
        filename: '',
        csvHeaders: [
          'JOB',
          'SAMPNUM',
          'LABEL_FORMAT',
          'LABEL_PRINTER',
          'DETAILS1',
          'DETAILS2',
        ],
        csvRows: [],
      },
    };
  },
  mounted() {
    //Get stored printer from local storage
    this.selectedPrinter = localStorage.getItem('chemportalLabelPrinter');
    this.selectedPrinter_b = localStorage.getItem('chemportalLabelPrinter_label_small');
    this.getPrinters();
  },
  methods: {
    getPrinters() {
      this.$axios
        .get('printers?location=Sample Registration')
        .then((response) => {
          this.printers = response.data.data;
          this.printers_b = response.data.data;
        });
    }, 
    updatePrinter() {
      this.$store.dispatch('printer/setPrinter', this.selectedPrinter);
    },
    updatePrinter_b() {
      this.$store.dispatch('printer_label_small/setPrinter', this.selectedPrinter_b);
    },       
    clearPrintGroup() {
      this.LabelStandardGroups = [];
      this.LabelSmallGroups = [];
    },  
    SearchSample() {
      this.sample = [];
      this.searchError = '';
      this.clearPrintGroup();
      this.$axios.get('phaseone/sample/' + this.search_sample).then((response) => {
        this.sample = response.data.data;
        console.log('this.sample =', this.sample);
        console.log('this.sample.SAMPNUM =', this.sample.SAMPNUM);

        if(this.sample.SAMPNUM)     
        {
            //console.log('Sample found Sample ID=', this.sample.SAMPNUM);
            this.getPrintLabelStandardGroup();
        } else {
             //console.log('Sample Not found');
             this.searchError = 'Error Finding Sample ID, Please Try Again';
        }        
      });
    },    
    getSample_Wasp_noused() {
      this.setupLoading = true;
      this.$axios.get('phaseone/wasp_sample_view/' + this.search_sample).then((response) => { 
        this.setups = response.data.data;
        this.setupLoading = false;
        this.getPrintGroup();
      });
    },
    getPrintGroup_noused() {
      this.printGroups = [];
      this.PrintGroupLoading = true;
      this.printGroupHasRecord = false;
      this.$axios.get('phaseone/wasp_sample_print_group_view/' + this.search_sample).then((response) => { 
        this.printGroups = response.data;
        console.log('this.printGroups=', this.printGroups);
        console.log('this.printGroups[0].SAMPNUM=', this.printGroups[0].SAMPNUM);
        if(this.printGroups[0].SAMPNUM)    {
          this.printGroupHasRecord = true;
        } 
        this.getPrintLabelStandardGroup();
      });
    },
    getPrintLabelStandardGroup() {
      this.LabelStandardGroups = [];
      this.LabelStandardGroupLoading = true;
      this.LabelStandardGroupHasRecord = false;
      this.$axios.get('phaseone/wasp_sample_print_standard_label_group_view/' + this.search_sample).then((response) => { 
        this.LabelStandardGroups = response.data;
        this.LabelStandardGroupLoading = false;
        this.getPrintLabelSmallGroup();
        console.log('this.LabelStandardGroups=', this.LabelStandardGroups);
        console.log('this.LabelStandardGroups[0].SAMPNUM=', this.LabelStandardGroups[0].SAMPNUM);
        if(this.LabelStandardGroups[0].SAMPNUM)    {
          this.LabelStandardGroupHasRecord = true;
        } 
      });
    },    
    getPrintLabelSmallGroup() {
      this.LabelSmallGroups = [];
      this.LabelSmallGroupLoading = true;
      this.LabelSmallGroupHasRecord = false;
      this.$axios.get('phaseone/wasp_sample_print_small_label_group_view/' + this.search_sample).then((response) => { 
        this.LabelSmallGroups = response.data;
        this.LabelSmallGroupLoading = false;
        console.log('this.LabelSmallGroups=', this.LabelSmallGroups);
        console.log('this.LabelSmallGroups[0].SAMPNUM=', this.LabelSmallGroups[0].SAMPNUM);
        if(this.LabelSmallGroups[0].SAMPNUM)    {
          this.LabelSmallGroupHasRecord = true;
        } 
      });
    },
    printStandardLabels() {
      this.saveSampleLogLabelStandard();
      this.printing = true;
      this.printData.filename = this.search_sample + '.csv';
      this.printData.csvRows = [];
      console.log('printGroups object=', this.printGroups);
      //this.LabelStandardGroups.forEach((sample) => {      
      this.LabelStandardGroups.slice().reverse().forEach((sample) => {              
        console.log('sample object=', sample);
        console.log('Sample ID=', sample.SAMPNUM);
        this.DETAILS2 = '';

        sample.tests.forEach((item) => {      
          if(this.DETAILS2 != '') {
            this.DETAILS2 = this.DETAILS2 + ' , '
          }
          this.DETAILS2 = this.DETAILS2 + item.TEST
          console.log('item.TEST =', item.TEST);
          console.log('this.DETAILS2 =', this.DETAILS2);
          });  

            this.printData.csvRows.push([
              sample.JOB,
              sample.SAMPNUM,
              'NM_WATER_SPLIT_GROUP_LABEL_STANDARD.BTW',
              this.selectedPrinter,
              sample.WASP_LABEL_GROUP_NAME_ENG,
              this.DETAILS2
            ]);        
       });
      this.$axios.post('labels/print', this.printData).then(() => {
        this.$store.dispatch('snackbar/showSnackbar', 'Sent To Printer');
        this.printing = false;
        console.log('Excuted Sent To Printer');
       });
    },
    printSmallLabels() {
      this.saveSampleLogLabelSmall();
      this.printing = true;
      this.printData.filename = this.search_sample + '.csv';
      this.printData.csvRows = [];
      console.log('printGroups object=', this.printGroups);
      //this.LabelSmallGroups.forEach((sample) => {      
      this.LabelSmallGroups.slice().reverse().forEach((sample) => {              
        console.log('sample object=', sample);
        console.log('Sample ID=', sample.SAMPNUM);


            this.printData.csvRows.push([
              sample.JOB,
              sample.SAMPNUM,
              'NM_WATER_SPLIT_GROUP_LABEL_SMALL.BTW',
              this.selectedPrinter_b,
              sample.WASP_LABEL_GROUP_NAME_ENG,
              sample.WASP_LABEL_GROUP_NAME_ENG
            ]);        
       });
      this.$axios.post('labels/print', this.printData).then(() => {
        this.$store.dispatch('snackbar/showSnackbar', 'Sent To Printer');
        this.printing = false;
        console.log('Excuted Sent To Printer');
       });
    },
    saveSampleLog() {
      this.$axios.get('phaseone/wasp_sample_log/' + this.search_sample).then((response) => { 
       });
    },
    saveSampleLogLabelStandard() {
      this.$axios.get('phaseone/wasp_sample_log_label_standard/' + this.search_sample).then((response) => { 
       });
    },
    saveSampleLogLabelSmall() {
      this.$axios.get('phaseone/wasp_sample_log_label_small/' + this.search_sample).then((response) => { 
       });
    },

  },

  
};
</script>

<style>
.v-list-item__action {
  margin: 0;
}
</style>
