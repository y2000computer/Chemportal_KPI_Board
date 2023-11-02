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
                label="Scan Tray Container Label"
                v-model="searchbytraycontainersample"
                autofocus
                append-icon="mdi-barcode-scan"
                hide-details
                @keyup.enter="getTrayContainerSample"
                ref="searchbytraycontainersample"
                :loading="searchbytraycontainersampleLoading"
              ></v-text-field>


              <v-alert v-if="searchError" type="error">
                {{ searchError }}
              </v-alert>

            </v-col>






            <v-col md="8" cols="12">
              <v-card outlined :disabled="!sample.SAMPNUM">
                <v-card-title>Sample</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col>
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col cols="3">Sample:</v-col>
                                <v-col class="font-weight-medium">
                                  {{ sample.SAMPNUM }}
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
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
      searchbytraycontainersample: '',
      searchbytraycontainersampleLoading: false,
      

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
        this.searchbytraycontainersample = '';

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
