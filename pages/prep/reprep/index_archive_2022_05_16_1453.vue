<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row justify="space-between">
            <v-col md="6">Sample Re-prep</v-col>

          </v-row>
        </v-card-title>


        <v-card-text>



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
                  v-model="test"
                  label="Test"
                  placeholder="Select Test"
                  item-value="TEST"
                  item-text="TEST"
                ></v-autocomplete>
              </v-col>
            </v-row>
    



          <v-row justify="space-between">
            <v-col md="3" cols="12">
                <v-autocomplete
                  dense
                  outlined
                  hide-details
                  :loading="reprep_reason_mastersLoading"
                  :items="reprep_reason_masters"
                  v-model="reprep_reason_master_id"
                  label="Reason"
                  placeholder="Select Reason"
                  item-value="ID"
                  item-text="NAME_ENG"
                ></v-autocomplete>
            </v-col>
          </v-row>  



          <v-row justify="space-between">
            <v-col md="7" cols="12">
             <v-text-field
                outlined
                dense
                label="Remark"
                autocomplete="off"
                v-model="remark"/>
            </v-col>
          </v-row>


          <v-row justify="space-between">
            <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Sample Label"
                v-model="search"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="getSample_and_update"
                ref="search"
                :loading="sampleLoading"
              ></v-text-field>
            </v-col>
          </v-row>










          <v-row v-if="searchError" justify="center">
            <v-col md="4" cols="100">

              <v-alert v-if="searchError" type="error">
                {{ searchError }}
              </v-alert>                


            </v-col>
          </v-row>


          <v-row v-if="progress_message" justify="center">
            <v-col md="4" cols="100">

              <v-alert v-if="progress_message" class="text-center" dense color="primary" dark>
                {{ progress_message }}
                </v-alert>                


            </v-col>
          </v-row>


          <v-row justify="space-between">
            <v-col md="8" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Last Re-prep Samples</v-card-title>

                
                  <sample-list :samples="samples" :loading="sampleListLoading" @getSamplesCpts="getSamplesCpts"  />


              </v-card>
            </v-col>



          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
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


      reprep_reason_mastersLoading: true,
      reprep_reason_masters: [],
      reprep_reason_master_id: "",

      remark: "",

      search: '',
      searchError: '',
      sampleLoading: false,
      sampleListLoading: false,
      sample: [],
      searchbysample: '',
      progress_message: '',      

    };
  },
  computed: {
    
  },
  mounted() {
    this.getSections();
    this.getReprepReasonMaster();
    this.getSamplesCpts();

  },
  methods: {
    getSections() {
      this.$axios.get('reprep/sectionsviewall').then((response) => {        
        this.sections = response.data.data;
        this.sectionsLoading = false;
      });
    }, 
    getReprepReasonMaster() {
      this.$axios.get('reprep/reprep_reason_master_viewAll').then((response) => {        
        this.reprep_reason_masters = response.data.data;
        this.reprep_reason_mastersLoading = false;
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
    getSample() {
      this.sample = [];
      this.sampleLoading = true;
      
      this.$axios.get('reprep/sample/' + this.search).then((response) => {
        this.sample = response.data.data;
        this.sampleLoading = false;
        this.search = '';
        this.searchbysample = '';

      });
    },
    getSample_and_update() {
      if(!this.section){
          this.searchError = 'Please select Section';
          return;
      }
      if(!this.backlogsid){
          this.searchError = 'Please select Method';
          return;
      }
      if(!this.test){
          this.searchError = 'Please select Test';
          return;
      }
      
      if(!this.reprep_reason_master_id){
          this.searchError = 'Please select Reason';
          return;
      }

      this.searchError = '';
      this.progress_message = '';
      this.sample = [];
      this.sampleLoading = true;
      this.$axios.get('reprep/sample/' + this.search).then((response) => {
        this.sample = response.data.data;
        this.sampleLoading = false;
        this.search = '';
        //console.log('this.sample =', this.sample);
        //console.log('this.sample.SAMPNUM =', this.sample.SAMPNUM);
        if(this.sample.SAMPNUM)     
        {
            //console.log('Sample found Sample ID=', this.sample.SAMPNUM);
            this.SampleCheckIn_v2();
        } else {
             //console.log('Sample Not found');
             this.searchError = 'Error Finding Sample ID, Please Try Again';
        }

      });

    },
    SampleCheckIn_v2() {

      //console.log('reprep_reason_master_id =', this.reprep_reason_master_id);
      //console.log('remark =', this.remark);

      this.$axios
        .patch('/reprep/sample_log/' + this.sample.SAMPNUM, {
          section: this.section,
          backlogsid: this.backlogsid,
          test: this.test,
          reprep_reason_master_id: this.reprep_reason_master_id,
          remark: this.remark
        })
        .then((response) => {
           this.resetForm(); 
           this.getSamplesCpts();
        });        
    },    
    setFocus(ref) {
      this.$refs[ref].focus();
    },
    resetForm() {
      this.search = '';
      this.sample = [];
      this.setFocus('search');
    },

    getSamplesCpts() {
      this.sampleListLoading = true;
      this.$axios.get('reprep/sample_log').then((response) => {        
        this.samples = response.data.data;
        this.sampleListLoading = false;
      });
    },



  },
};
</script>

<style></style>
