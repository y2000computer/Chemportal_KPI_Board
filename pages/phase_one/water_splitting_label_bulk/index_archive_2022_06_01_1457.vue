<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row justify="space-between">
            <v-col md="6">Print Bulk Splitting Label</v-col>

          </v-row>
        </v-card-title>


        <v-card-text>


        <v-row justify="space-between">
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
            </v-col>
        </v-row>



        <v-row justify="space-between">

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

            </v-col>

        </v-row>




        <v-row>
          <v-col md="3" cols="12">
            <v-menu
              ref="expectedDateMenu"
              v-model="expdateMenu"
              offset-y
              max-width="290"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  readonly
                  label="Instructed Date"
                  v-bind="attrs"
                  v-on="on"
                  :value="
                    form.insdate
                      ? $moment(form.insdate).format('DD/MM/YY')
                      : ''
                  "
                  autocomplete="off"
                />
              </template>
              <v-date-picker
                color="primary"
                v-model="form.insdate"
                @input="expdateMenu = false"
              /> </v-menu>
              </v-col>
        </v-row>



          <v-row justify="space-between">
            <v-col md="3" cols="12">
                <v-autocomplete
                  dense
                  outlined
                  hide-details
                  :loading="sectionsLoading"
                  :items="sections"
                  v-model="section"
                  label="Section"
                  placeholder="Select Section"
                  item-value="section"
                  item-text="section"
                  @change="SectionSelected"
                ></v-autocomplete>
            </v-col>
          </v-row>

            <v-row justify="space-between">
              <v-col md="3" cols="12">
                <v-autocomplete
                  dense
                  outlined
                  hide-details
                  :loading="methodsLoading"
                  :items="methods"
                  v-model="backlogsid"
                  label="Method"
                  placeholder="Select Method"
                  item-value="BACKLOGSID"
                  item-text="TITLE"
                  @change="BacklogsidSelected"
                ></v-autocomplete>
              </v-col>
            </v-row>
    


            <v-row justify="space-between">
              <v-col md="3" cols="12">
                <v-autocomplete
                  dense
                  outlined
                  hide-details
                  :loading="testsLoading"
                  :items="tests"
                  v-model="form.test"
                  label="Test"
                  placeholder="Select Test"
                  item-value="TEST"
                  item-text="TEST"
                ></v-autocomplete>
              </v-col>
            </v-row>
    




        <v-col md="4" cols="12" class="text-center">
          <v-alert v-if="searchError" type="error">
            {{ searchError }}
          </v-alert>
        </v-col>




        <v-row justify="space-between">
            <v-col
              md="2"
              cols="12"
              :class="
                $vuetify.breakpoint.smAndDown ? 'text-center' : 'text-right'
              "
            >
              <v-btn
                color="primary"
                v-if="form.test"
                @click.prevent="SearchSample_by_test"
                x-large
              >
                Search 
                <v-icon class="ml-4">search</v-icon>
              </v-btn>
            </v-col>
        </v-row>


        <v-row justify="space-between">
            <v-col md="18" cols="12">

                <v-toolbar-title class="font-weight-medium"
                  >Standard Label Group</v-toolbar-title>

              <v-card outlined>
                <labelstandardgroup-list :LabelStandardGroups="LabelStandardGroups" :loading="LabelStandardGroupLoading"   />
              </v-card>
            </v-col>
          </v-row>







        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>



<script>

import labelstandardgroupList from './components/labelstandard_list';

export default {
  components: {
    labelstandardgroupList
  },    
  data() {
    return {

      expdateMenu: false,

      sectionsLoading: true,
      sections: [],
      section: "",

      methodsLoading: false,
      methods: [],
      method: "",
      backlogsid: "",


      testsLoading: false,
      tests: [],
      test: "",



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


      form: {
        insdate: '',
        test: ''
      },

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
    this.getSections();    
    //Get stored printer from local storage
    this.selectedPrinter = localStorage.getItem('chemportalLabelPrinter');
    this.getPrinters();
  },
  methods: {
    getSections() {
      this.$axios.get('reprep/sectionsviewall').then((response) => {        
        this.sections = response.data.data;
        this.sectionsLoading = false;
      });
    }, 
    SectionSelected() {
      this.getMethods();
    },
    getMethods() {
      this.$axios.get('reprep/testmethods/'+ this.section).then((response) => {                
        this.methods = response.data.data;
      });
    },
    BacklogsidSelected() {
      this.getTests();
    },
    getTests() {
      this.$axios.get('reprep/tests/'+ this.backlogsid).then((response) => {                
        console.log('backlogsid =',this.backlogsid)
        this.tests = response.data.data;
      });
    },
    getPrinters() {
      this.$axios
        .get('printers?location=Sample Registration')
        .then((response) => {
          this.printers = response.data.data;
        });
    }, 
    updatePrinter() {
      this.$store.dispatch('printer/setPrinter', this.selectedPrinter);
    },
    clearPrintGroup() {
      this.LabelStandardGroups = [];
      this.LabelSmallGroups = [];
    },  
    SearchSample_by_test() {

      if(!this.form.insdate){
          this.form.test ='';
          this.searchError = 'Please select Instructed Date';
          return;
      }      
      this.sample = [];
      this.searchError = '';
      this.clearPrintGroup();

      this.getPrintLabelStandardGroup_bulk();



    },    
    getPrintLabelStandardGroup_bulk() {
      this.LabelStandardGroups = [];
      this.LabelStandardGroupLoading = true;
      this.LabelStandardGroupHasRecord = false;
      //this.$axios.get('phaseone/wasp_sample_print_standard_bulk_label_group_view/' + this.test).then((response) => { 
      this.$axios.post('phaseone/wasp_sample_print_standard_bulk_label_group_view' , this.form).then((response) => {         
        this.LabelStandardGroups = response.data.data;
        this.LabelStandardGroupLoading = false;
        //console.log('this.LabelStandardGroups=', this.LabelStandardGroups);
        //console.log('this.LabelStandardGroups[0].SAMPNUM=', this.LabelStandardGroups[0].SAMPNUM);
        if(this.LabelStandardGroups[0].SAMPNUM)    {
          this.LabelStandardGroupHasRecord = true;
        } 
      });
    },    
    printStandardLabels() {
      this.printing = true;
      this.printData.filename = this.search_sample + '.csv';
      this.printData.csvRows = [];
      console.log('printGroups object=', this.printGroups);
      //this.LabelStandardGroups.forEach((sample) => {      
      this.LabelStandardGroups.slice().reverse().forEach((sample) => {                      
        console.log('sample object=', sample);
        console.log('Sample ID=', sample.SAMPNUM);
        this.DETAILS2 = '';

  

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


  },

  
};
</script>

<style>
.v-list-item__action {
  margin: 0;
}
</style>
