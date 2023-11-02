<template>
  <!-- <v-row>
    <v-col> -->
  <v-card flat class="mt-3">
    <v-card-text>


      <v-row
        >

        <v-col
          ><v-text-field
            outlined
            dense
            hide-details
            label="Search"
            autocomplete="off"
            v-model="search"
        /></v-col>


        <v-col >
          <v-btn color="primary" @click="createDialog = !createDialog"
            >New  <v-icon small class="ml-2">mdi-plus</v-icon></v-btn
          >
        </v-col>
        <v-col class="float-right"
          ><v-switch
            inset
            class="mt-1"
            hide-details
            label="Show All"
            v-model="ShowAll"
        /></v-col>
      </v-row>



      <v-row
        ><v-col>

          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :items="filteredsetups"
            :search="search"
            :headers="headers"
            :loading="loading"
            item-key="setups"
            
          >
            
            <template v-slot:item.WASP_LABEL_GROUP_NAME_ENG="{ item }">
              {{ item.WASP_LABEL_GROUP_NAME_ENG | shorten(30) }}
            </template>            
            

            <template v-slot:item.SECTION="{ item }">
              {{ item.SECTION | shorten(20) }}
            </template>

            <template v-slot:item.TITLE="{ item }">
              {{ item.TITLE | shorten(20) }}
            </template>

            <template v-slot:item.TEST="{ item }">
              {{ item.TEST | shorten(30) }}
            </template>



            <template v-slot:item.CREATEDDT="{ item }">
              {{ $moment(item.CREATEDDT).format('DD/MM/YY') }}
            </template>


            <template v-slot:item.ACTIVE_IS="{ item }">
              <v-chip small :color="item.ACTIVE_IS == 1 ? 'orange' : 'grey'">{{
                item.ACTIVE_IS == 1 ? 'Active' : 'De-active'
              }}</v-chip>
            </template>

  
            <template v-slot:item.actions="{ item }">
              <v-btn small icon @click="getSetup(item.ID)"
                ><v-icon>mdi-playlist-edit</v-icon>
              </v-btn>
            </template>


          </v-data-table>
        </v-col>
        
        
        
        
        
        

    <v-dialog
      v-model="createDialog"
      width="800"
      persistent
      ><v-card outlined
        ><v-card-title
          >{{ editing ? 'Edit ' : 'Create ' }}<v-spacer /><v-btn
            small
            icon
            @click="resetForm"
            ><v-icon>mdi-close</v-icon></v-btn
          ></v-card-title
        >
        <v-card-text>
          <v-form>
            

                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Label Group"
                      :items="wasp_label_group_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_label_group_id"
                      v-model="form.wasp_label_group_id"
                      v-validate="{ rules: 'required' }"
                      /></v-col
                ></v-row>


                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Section *"
                      :items="sections"
                      item-value="section"
                      item-text="section"
                      v-validate="{ rules: 'required' }"
                      name="section"
                      v-model="form.section"
                      @change="SectionSelected"
                      /></v-col
                ></v-row>



                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Method"
                      :items="methods"
                      item-value="BACKLOGSID"
                      item-text="TITLE"
                      v-validate="{ rules: 'required' }"
                      name="Backlogsid"
                      v-model="form.backlogsid"
                      @change="BacklogsidSelected"
                      /></v-col
                ></v-row>



                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Test"
                      :items="tests"
                      item-value="TEST"
                      item-text=TEST
                      v-validate="{ rules: 'required' }"
                      name="Test"
                      v-model="form.test"
                      /></v-col
                ></v-row>






              <v-row>
                <v-col>




              <v-row>
                <v-col>
                  <v-switch hide-details v-model="form.active_is" inset label="Active"/>
                </v-col>
              </v-row>


              
              </v-col>
            </v-row>
          </v-form> </v-card-text
        ><v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="saving"
            :loading="saving"
            @click="saveSetup"
            color="primary"
            >{{ editing ? 'Save' : 'Create' }}</v-btn
          ></v-card-actions
        ></v-card
      ></v-dialog
    >        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        </v-row
      >




    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    setups: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      ShowAll: false,  
      editing: false,
      saving: false,
      sectionsLoading: true,
      sections: [],
      section: "",
      methodsLoading: false,
      methods: [],
      method: "",
      backlogsid: "",
      testLoading: false,
      tests: [],
      wasp_label_group_mastersLoading: true,
      wasp_label_group_masters: [],
      wasp_pipette_mastersLoading: true,
      wasp_pipette_masters: [],
      wasp_disposable_pipette_mastersLoading: true,
      wasp_disposable_pipette_masters: [],
      wasp_tip_mastersLoading: true,
      wasp_tip_masters: [],
      wasp_filter_mastersLoading: true,
      wasp_filter_masters: [],
      wasp_container_mastersLoading: true,
      wasp_container_masters: [],
      wasp_cap_mastersLoading: true,
      wasp_cap_masters: [],
      wasp_sample_volume_mastersLoading: true,
      wasp_sample_volume_masters: [],
      wasp_tray_mastersLoading: true,
      wasp_tray_masters: [],
      clients: [],
      client: "",
      offices: [],
      office: "",
      officesLoading: false,
      setup: {},
      
      headers: [
        { text: 'Label Group', value: 'WASP_LABEL_GROUP_NAME_ENG' },        
        { text: 'Section', value: 'SECTION' },
        { text: 'Method', value: 'TITLE' },
        { text: 'Test', value: 'TEST' },
        { text: 'Created Date', value: 'CREATEDDT' },        
        { text: 'Status', value: 'ACTIVE_IS' },        
        { text: 'Actions', value: 'actions' },
      ],
      createDialog: false,
      expdateMenu: false,
      form: {
        section: '',
        backlogsid: '',
        test: '',
        wasp_label_group_id: '',
        active_is:'1',
      },

    };
  },
  mounted() {
    this.getSections();
    this.getWasp_label_group_master_viewall();
  },  
  computed: {
    filteredsetups() {

      if(!this.setups){
            return [];
        }

      return this.setups.filter((setup) => {
        if (!this.ShowAll) {
               if(setup.ACTIVE_IS == 1 ) return true;
               if(setup.ACTIVE_IS == 0 ) return false;
          } else {
                return true;
          }

      });        
      
    },
  },
  methods: {
    getSections() {
      this.$axios.get('phaseone/sectionsviewall').then((response) => {        
        this.sections = response.data.data;
        this.sectionsLoading = false;
      });
    },  
    SectionSelected() {
      this.getMethods();
    },
    getMethods() {
      this.$axios.get('phaseone/testmethods/'+ this.form.section).then((response) => {                
        this.methods = response.data.data;
      });
    },
    BacklogsidSelected() {
      this.getTests();
    },
    getTests() {
      this.$axios.get('phaseone/tests/'+ this.form.backlogsid).then((response) => {                
        this.tests = response.data.data;
      });
    },
    
    getWasp_label_group_master_viewall() {
      this.$axios.get('phaseone/wasp_label_group_master_viewAll').then((response) => {        
        this.wasp_label_group_masters = response.data.data;
        this.wasp_label_group_mastersLoading = false;
      });
    },  
    saveSetup() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        this.saving = true;
        if (this.editing) {
          this.$axios
            .patch('phaseone/watersplittingtestsetup/' + this.setup.ID, this.form)
            .then((response) => {
              this.savedResponse();
            });
        } else {
          this.$axios.post('phaseone/watersplittingtestsetup', this.form).then((response) => {
            this.savedResponse();
          });
        }
      });
    },
    savedResponse() {
      this.saving = false;
      this.createDialog = false;
      this.resetForm();
      this.$router.go();

    }, 
    getSetup(id) {
      
      this.editing = true;
      this.$axios.get('phaseone/watersplittingtestsetup/' + id).then((response) => {

        this.setup = response.data.data;
        this.form.section = response.data.data.SECTION;
        this.form.backlogsid = response.data.data.BACKLOGSID;
        this.form.test = response.data.data.TEST;
        this.form.label_group_id = response.data.data.WASP_LABEL_GROUP_ID;
        this.form.active_is = (response.data.data.ACTIVE_IS == 1 ? true : false);

        this.getMethods();
        this.getTests();

        this.createDialog = true;
        
      });
    },
    resetForm() {
      this.$emit('formReset');
      this.editing = false;
      this.createDialog = false;
      this.setup = {};
      Object.keys(this.form).forEach((key) => {
        this.form[key] = '';
      });
      this.$validator.reset();
    },   
 
  },
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  -ms-box-shadow: none !important;
}
</style>
