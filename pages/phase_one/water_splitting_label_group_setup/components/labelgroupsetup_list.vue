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
            


            <template v-slot:item.WASP_SAMPLE_VOLUME_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_SAMPLE_VOLUME_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_CONTAINER_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_CONTAINER_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_PIPETTE_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_PIPETTE_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_DISPOSABLE_PIPETTE_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_DISPOSABLE_PIPETTE_MASTER_NAME_ENG | shorten(30) }}
            </template>

            <template v-slot:item.WASP_TIP_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_TIP_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_FILTER_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_FILTER_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_CAP_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_CAP_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_TRAY_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_TRAY_MASTER_NAME_ENG | shorten(30) }}
            </template>

            <template v-slot:item.STANDARD="{ item }">
              {{ item.STANDARD | shorten(30) }}
            </template>

            <template v-slot:item.REMARKS="{ item }">
              {{ item.REMARKS | shorten(30) }}
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
            

              <v-row>
                <v-col>

                  <v-row>
                  <v-col>
                    <v-text-field
                        outlined
                        dense
                        label="Label Group *"
                        autocomplete="off"
                        v-validate="{ rules: 'required' }"
                        v-model="form.name_eng"/>
                    </v-col>
                  </v-row>


                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Sample volume (ml)"
                      :items="wasp_sample_volume_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_sample_volume_id"
                      v-model="form.wasp_sample_volume_id"
                      /></v-col
                ></v-row>



                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Container"
                      :items="wasp_container_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_container_id"
                      v-model="form.wasp_container_id"
                      /></v-col
                ></v-row>



                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Pipette tools"
                      :items="wasp_pipette_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_pipette_id"
                      v-model="form.wasp_pipette_id"
                      /></v-col
                ></v-row>


                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Disposable pipette"
                      :items="wasp_disposable_pipette_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_disposable_pipette_id"
                      v-model="form.wasp_disposable_pipette_id"
                      /></v-col
                ></v-row>


                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Tip"
                      :items="wasp_tip_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_tip_id"
                      v-model="form.wasp_tip_id"
                      /></v-col
                ></v-row>



                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Filter"
                      :items="wasp_filter_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_filter_id"
                      v-model="form.wasp_filter_id"
                      /></v-col
                ></v-row>





                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Cap"
                      :items="wasp_cap_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_cap_id"
                      v-model="form.wasp_cap_id"
                      /></v-col
                ></v-row>





                <v-row
                  ><v-col>
                    <v-autocomplete
                      outlined
                      dense
                      autocomplete="off"
                      label="Tray"
                      :items="wasp_tray_masters"
                      item-value="ID"
                      item-text="NAME_ENG"
                      name="wasp_tray_id"
                      v-model="form.wasp_tray_id"
                      /></v-col
                ></v-row>



                <v-row
                  ><v-col
                    ><v-text-field
                      outlined
                      dense
                      autocomplete="off"
                      label="Standard"
                      v-model="form.standard"/></v-col
                ></v-row>


                <v-row
                  ><v-col
                    ><v-text-field
                      outlined
                      dense
                      autocomplete="off"
                      label="Remarks"
                      v-model="form.remarks"/></v-col
                ></v-row>




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
        { text: 'sample volume (ml)', value: 'WASP_SAMPLE_VOLUME_MASTER_NAME_ENG' },                        
        { text: 'Container', value: 'WASP_CONTAINER_MASTER_NAME_ENG' },                        
        { text: 'Pipette tools', value: 'WASP_PIPETTE_MASTER_NAME_ENG' },                
        { text: 'Disposable pipette', value: 'WASP_DISPOSABLE_PIPETTE_MASTER_NAME_ENG' },                
        { text: 'Tip', value: 'WASP_TIP_MASTER_NAME_ENG' },                        
        { text: 'Filter', value: 'WASP_FILTER_MASTER_NAME_ENG' },                        
        { text: 'Cap', value: 'WASP_CAP_MASTER_NAME_ENG' },                        
        { text: 'Tray', value: 'WASP_TRAY_MASTER_NAME_ENG' },                        
        { text: 'Standard', value: 'STANDARD' },                                
        { text: 'Remarks', value: 'REMARKS' },                                
        { text: 'Created Date', value: 'CREATEDDT' },        
        { text: 'Status', value: 'ACTIVE_IS' },        
        { text: 'Actions', value: 'actions' },
      ],
      createDialog: false,
      expdateMenu: false,
      form: {
        name_eng: '',
        wasp_pipette_id: '',
        wasp_disposable_pipette_id: '',
        wasp_tip_id: '',
        wasp_filter_id: '',
        wasp_container_id: '',
        wasp_cap_id: '',
        wasp_sample_volume_id: '',
        wasp_tray_id: '',                                        
        standard: '',                                        
        remarks: '',                                                
        active_is:'1',
      },

    };
  },
  mounted() {
    this.getWasp_pipette_master_viewall();
    this.getwasp_disposable_pipette_master_viewAll();
    this.getwasp_tip_master_viewAll();
    this.getwasp_filter_master_viewAll();
    this.getwasp_container_master_viewAll();
    this.getwasp_cap_master_viewAll();
    this.getwasp_sample_volume_master_viewAll();
    this.getwasp_tray_master_viewAll();
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
    getWasp_pipette_master_viewall() {
      this.$axios.get('phaseone/wasp_pipette_master_viewAll').then((response) => {        
        this.wasp_pipette_masters = response.data.data;
        this.wasp_pipette_mastersLoading = false;
      });
    },  
    getwasp_disposable_pipette_master_viewAll() {
      this.$axios.get('phaseone/wasp_disposable_pipette_master_viewAll').then((response) => {        
        this.wasp_disposable_pipette_masters = response.data.data;
        this.wasp_disposable_pipette_mastersLoading = false;
      });
    },      
    getwasp_tip_master_viewAll() {
      this.$axios.get('phaseone/wasp_tip_master_viewAll').then((response) => {        
        this.wasp_tip_masters = response.data.data;
        this.wasp_tip_mastersLoading = false;
      });
    },      
    getwasp_filter_master_viewAll() {
      this.$axios.get('phaseone/wasp_filter_master_viewAll').then((response) => {        
        this.wasp_filter_masters = response.data.data;
        this.wasp_filter_mastersLoading = false;
      });
    },      
    getwasp_container_master_viewAll() {
      this.$axios.get('phaseone/wasp_container_master_viewAll').then((response) => {        
        this.wasp_container_masters = response.data.data;
        this.wasp_container_mastersLoading = false;
      });
    },      
    getwasp_cap_master_viewAll() {
      this.$axios.get('phaseone/wasp_cap_master_viewAll').then((response) => {        
        this.wasp_cap_masters = response.data.data;
        this.wasp_cap_mastersLoading = false;
      });
    },      
    getwasp_sample_volume_master_viewAll() {
      this.$axios.get('phaseone/wasp_sample_volume_master_viewAll').then((response) => {        
        this.wasp_sample_volume_masters = response.data.data;
        this.wasp_sample_volume_mastersLoading = false;
      });
    },      
    getwasp_tray_master_viewAll() {
      this.$axios.get('phaseone/wasp_tray_master_viewAll').then((response) => {        
        this.wasp_tray_masters = response.data.data;
        this.wasp_tray_mastersLoading = false;
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
            .patch('phaseone/watersplittinglabelgroupsetup/' + this.setup.ID, this.form)
            .then((response) => {
              this.savedResponse();
            });
        } else {
          //this.$axios.post('vips/rushproject', this.form).then((response) => {
          this.$axios.post('phaseone/watersplittinglabelgroupsetup', this.form).then((response) => {
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
      this.$axios.get('phaseone/watersplittinglabelgroupsetup/' + id).then((response) => {

        this.setup = response.data.data;
        this.form.name_eng = response.data.data.NAME_ENG;
        this.form.wasp_sample_volume_id = response.data.data.WASP_SAMPLE_VOLUME_ID;
        this.form.wasp_container_id = response.data.data.WASP_CONTAINER_ID;
        this.form.wasp_pipette_id = response.data.data.WASP_PIPETTE_ID;
        this.form.wasp_disposable_pipette_id = response.data.data.WASP_DISPOSABLE_PIPETTE_ID;
        this.form.wasp_tip_id = response.data.data.WASP_TIP_ID;
        this.form.wasp_filter_id = response.data.data.WASP_FILTER_ID;
        this.form.wasp_cap_id = response.data.data.WASP_CAP_ID;
        this.form.wasp_tray_id = response.data.data.WASP_TRAY_ID;
        this.form.standard = response.data.data.STANDARD;
        this.form.remarks = response.data.data.REMARKS;
        this.form.active_is = (response.data.data.ACTIVE_IS == 1 ? true : false);

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
