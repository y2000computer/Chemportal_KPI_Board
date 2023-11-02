<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-row justify="space-between">
            <v-col md="6">Sample Check-In</v-col>

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
                ></v-autocomplete>
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


            <v-row justify="space-between">
              <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Tray Container Label"
                v-model="searchbytraycontainersample"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="getTrayContainerSample"
                ref="searchbytraycontainersample"
                :loading="searchbytraycontainersampleLoading">
                </v-text-field>

              </v-col>
            </v-row>



        <!---
          <v-row justify="space-between">

            <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Sample Label"
                v-model="search"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="getSample"
                ref="search"
                :loading="sampleLoading"
              ></v-text-field>
            </v-col>
          </v-row>
        -->


          <v-row justify="space-between">



            <v-col md="3" cols="12">
              <v-text-field
                outlined
                label="Scan Prep List Tray QR Label"
                v-model="searchbystray"
                autofocus
                append-icon="mdi-qrcode-scan"
                hide-details
                @keyup.enter="getStrayV2"
                ref="searchbystray"
                :loading="searchbystrayLoading"
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
                <v-card-title>Last Check-In Samples</v-card-title>

                
                  <sample-list :samples="samples" :loading="sampleListLoading" @getSamplesCpts="getSamplesCpts"  />


              </v-card>
            </v-col>


          <!--
            <v-col md="3" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Actions</v-card-title>
                <v-card-text>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn
                        x-large
                        color="primary"
                        @click="SampleCheckIn"
                        :disabled="sendDisabled"
                      >
                        Check-In
                        <v-icon class="ml-2">mdi-database-import</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="text-center">
                    <v-col>
                      <v-btn @click="resetForm">
                        Reset
                        <v-icon class="ml-2">mdi-cancel</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            -->

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
      search: '',
      searchError: '',
      sampleLoading: false,
      sampleListLoading: false,
      sample: [],
      searchbysample: '',
      searchbytraycontainersample: '',
      searchbytraycontainersampleLoading: false,
      searchbystray: '',
      searchbystrayLoading: false,
      progress_message: '',      

    };
  },
  computed: {
    
  },
  mounted() {
    this.getSections();
    this.getSamplesCpts();

  },
  methods: {
    getSections() {
      this.$axios.get('laboratory/sectionsviewall').then((response) => {        
        this.sections = response.data.data;
        this.sectionsLoading = false;
      });
    }, 
    SectionSelected() {
      this.getMethods();
    },
    getMethods() {
      this.$axios.get('laboratory/testmethods/'+ this.section).then((response) => {                
        this.methods = response.data.data;
      });
    },
    getSample() {
      this.sample = [];
      this.sampleLoading = true;
      this.$axios.get('laboratory/sample/' + this.search).then((response) => {
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
      this.searchError = '';
      this.sample = [];
      this.sampleLoading = true;
      this.$axios.get('laboratory/sample/' + this.search).then((response) => {
        this.sample = response.data.data;
        this.sampleLoading = false;
        this.search = '';
        console.log('this.sample =', this.sample);
        console.log('this.sample.SAMPNUM =', this.sample.SAMPNUM);
        if(this.sample.SAMPNUM)     
        {
            console.log('Sample found Sample ID=', this.sample.SAMPNUM);
            this.SampleCheckIn_v2();
        } else {
             console.log('Sample Not found');
             this.searchError = 'Error Finding Sample ID, Please Try Again';
        }

      });
    },    
    getTrayContainerSample() {
      if(!this.section){
          this.searchError = 'Please select Section';
          return;
      }
      if(!this.backlogsid){
          this.searchError = 'Please select Method';
          return;
      }
      this.searchError = '';
      this.sample = [];
      this.searchbytraycontainersampleLoading = true;
      this.$axios.get('laboratory/traycontainer/' + this.searchbytraycontainersample).then((response) => {
        this.sample = response.data.data;
        this.searchbytraycontainersampleLoading = false;
        this.searchbytraycontainersample = '';
        this.search = '';   

        console.log('this.sample =', this.sample);
        console.log('this.sample.SAMPNUM =', this.sample.SAMPNUM);

        if(this.sample.SAMPNUM)     
        {
            console.log('Sample found Sample ID=', this.sample.SAMPNUM);
            this.SampleCheckIn_v2();
        } else {
             console.log('Sample Not found');
             this.searchError = 'Error Finding Sample ID, Please Try Again';
        }

      });
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    },
    sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },   
    async getStrayV2() {
      console.log("execute getStrayV2");
      this.searchError = '';
      this.stray_samples = [];
      this.searchbystrayLoading = true;
      this.progress_message = '';

      if(!this.section){
          this.searchError = 'Please select Section';
          return;
      }
      if(!this.backlogsid){
          this.searchError = 'Please select Method';
          return;
      } 

      
      this.step = 0;
      console.log("Step=", this.step,"  Begin await /straycontainer get Time:", Date.now());

      await this.$axios.get('laboratory/straycontainer/' + this.searchbystray).then((response) => {
          this.stray_samples = response.data.data;
          this.searchbystrayLoading = false;
          this.searchbystray = '';
          this.search = '';   
          this.step = this.step + 1;
          console.log("Step=", this.step,"  Executed axios GET straycontainer this.stray_samples.length = " , this.stray_samples.length);


        }); //await this.$axios.get

  
        if(this.stray_samples.length > 0)     
        {
             this.seq = 0;
            //this.stray_samples.forEach(async (row) => {   //syntax can't wait the axio complete
            this.asyncForEach(this.stray_samples, async (row) => {

                  this.seq = this.seq + 1;
                  console.log("Time before await axios :", Date.now());
                  //this.sleep(100);
                  
                  console.log("row.SAMPNUM = ", row.SAMPNUM);

                  await this.$axios
                          .patch('/laboratory/samplecheckin/' + row.SAMPNUM, {
                           section: this.section,
                            backlogsid: this.backlogsid,
                          })
                          .then((response) => {
                              this.progress_message="Progress timestamp for Sample No = " + row.SAMPNUM

                           //this.resetForm(); 
                            //this.getSamplesCpts();
                          });    

                  console.log("Time AFTER await :", Date.now());
                  console.log("this.seq :", this.seq);


                });

        
        } else {
            console.log('Prep List Tray ID not found');
            this.searchError = 'Prep List Tray ID Not Found, Please Try Again';
        }		//if(this.stray_samples.length > 0)     


          this.resetForm(); 
          this.getSamplesCpts();



    },
    SampleCheckIn_v2() {
      this.$axios
        .patch('/laboratory/samplecheckin/' + this.sample.SAMPNUM, {
          section: this.section,
          backlogsid: this.backlogsid,
        })
        .then((response) => {
           this.resetForm(); 
           this.getSamplesCpts();
        });        
    },    
    SampleCheckIn() {
      this.$axios
        .patch('/laboratory/samplecheckin/' + this.sample.SAMPNUM, {
          section: this.section,
          backlogsid: this.backlogsid,
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
      //this.setFocus('search');
      this.setFocus('searchbytraycontainersample');
    },

    getSamplesCpts() {
      this.sampleListLoading = true;
      this.$axios.get('laboratory/samplecheckin').then((response) => {        
        this.samples = response.data.data;
        this.sampleListLoading = false;
      });
    },



  },
};
</script>

<style></style>
