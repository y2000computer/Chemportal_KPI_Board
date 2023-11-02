<template>
  <!-- <v-row>
    <v-col> -->
  <v-card flat class="mt-3">
    <v-card-text>


      <v-row
        >
        <v-col >
          <v-btn color="primary" @click="createDialog = !createDialog"
            >New Rush Project<v-icon small class="ml-2">mdi-plus</v-icon></v-btn
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
            :items="filteredrushprojects"
            :headers="headers"
            :loading="loading"
            item-key="rushprojects"
            
          >
            <template v-slot:item.CLIENTNAME="{ item }">
              {{ item.CLIENTNAME | shorten(20) }}
            </template>

            <template v-slot:item.OFFICENAME="{ item }">
              {{ item.OFFICENAME | shorten(20) }}
            </template>


            <template v-slot:item.EXPDATE="{ item }">
              {{ $moment(item.EXPDATE).format('DD/MM/YY') }}
            </template>

            <template v-slot:item.EXPSAMPS="{ item }">
              {{ item.EXPSAMPS | shorten(20) }}
            </template>

            <template v-slot:item.CHEMREF="{ item }">
              {{ item.CHEMREF | shorten(50) }}
            </template>

            <template v-slot:item.CREATEDDT="{ item }">
              {{ $moment(item.CREATEDDT).format('DD/MM/YY') }}
            </template>


            <template v-slot:item.CREATEDBY="{ item }">
              {{ item.CREATEDBY | shorten(50) }}
            </template>


            <template v-slot:item.HIDDEN_IS="{ item }">
              <v-chip small :color="item.HIDDEN_IS > 0 ? 'grey' : 'orange'">{{
                item.HIDDEN_IS > 0 ? 'Y' : 'N'
              }}</v-chip>
            </template>

  
            <template v-slot:item.actions="{ item }">
              <v-btn small icon @click="getRushProject(item.RUPRID)"
                ><v-icon>mdi-playlist-edit</v-icon>
              </v-btn>
            </template>


          </v-data-table>
        </v-col>
        
        
        
        
        
        
        
    <v-dialog
      v-model="createDialog"
      :max-width="editing ? 1000 : 600"
      persistent
      ><v-card outlined
        ><v-card-title
          >{{ editing ? 'Edit Rush Project' : 'Create New Rush Project' }}<v-spacer /><v-btn
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
                      label="Client *"
                      :items="clients"
                      item-value="CLIENT"
                      item-text="CLIENTNAME"
                      v-validate="{ rules: 'required' }"
                      name="Client"
                      v-model="form.client"
                      @change="OfficeSelected"
                      /></v-col
                ></v-row>






                <v-row>
                  <v-col>
                    <v-autocomplete
                      dense
                      outlined
                      hide-details
                      :loading="officesLoading"
                      :items="offices"
                      label="Office *"
                      placeholder="Select Office"
                      item-value="OFFICE"
                      item-text="OFFICENAME"
                      name="Office"
                      v-model="form.office"
                    />
                  </v-col>
                </v-row>



              <v-row>
                <v-col>
                  <v-row
                    ><v-col
                      ><v-text-field
                        outlined
                        dense
                        label="Chem Rref"
                        autocomplete="off"
                        v-model="form.chemref"/></v-col></v-row
                  >

                <v-row
                  ><v-col>
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
                          label="Expected Date"
                          v-bind="attrs"
                          v-on="on"
                          :value="
                            form.expdate
                              ? $moment(form.expdate).format('DD/MM/YY')
                              : ''
                          "
                          autocomplete="off"
                        />
                      </template>
                      <v-date-picker
                        color="primary"
                        v-model="form.expdate"
                        @input="expdateMenu = false"
                      /> </v-menu></v-col
                ></v-row>



                <v-row
                  ><v-col
                    ><v-text-field
                      outlined
                      dense
                      autocomplete="off"
                      label="No. of Sample"
                      v-model="form.expsamps"/></v-col
                ></v-row>



              <v-row>
                <v-col>
                  <v-switch hide-details v-model="form.hidden_is" inset label="Archive"/>
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
            @click="saveRushProject"
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
    rushprojects: {
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
      clients: [],
      client: "",
      offices: [],
      office: "",
      officesLoading: false,
      rushproject: {},
      
      headers: [
        { text: 'Client Name', value: 'CLIENTNAME' },
        { text: 'Site Name', value: 'OFFICENAME' },
        { text: 'Expected Date', value: 'EXPDATE' },
        { text: 'No. of Sample', value: 'EXPSAMPS' },
        { text: 'Chem Ref', value: 'CHEMREF' },        
        { text: 'Created Date', value: 'CREATEDDT' },        
        { text: 'Created By', value: 'CREATEDBY' },        
        { text: 'Archive', value: 'HIDDEN_IS' },        
        { text: 'Actions', value: 'actions' },
      ],
      createDialog: false,
      expdateMenu: false,
      form: {
        chemref: '',
        client: '',
        office: '',
        expdate: '',
        expsamps: '',
        hidden_is:'',
      },

    };
  },
  mounted() {
    this.getClients();
  },  
  computed: {
    filteredrushprojects() {

      if(!this.rushprojects){
            return [];
        }

      return this.rushprojects.filter((rushproject) => {
        if (!this.ShowAll) {
               if(rushproject.HIDDEN_IS == 1 ) return false;
               if(rushproject.HIDDEN_IS == 0 ) return true;
          } else {
                //return true;
              if(rushproject.HIDDEN_IS == 1 ) return true;
               if(rushproject.HIDDEN_IS == 0 ) return true;
          }

      });        
      
    },
  },
  methods: {
    getClients() {
      this.$axios.get('clients/ids').then((response) => {
        this.clients = response.data.data;
      });
    },
    OfficeSelected() {
      this.getOffices();
    },
    getOffices() {
      this.$axios.get('offices/index/'+ this.form.client).then((response) => {
        this.offices = response.data.data;
        
      });
    }, 
    saveRushProject() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        this.saving = true;
        if (this.editing) {
          this.$axios
            .patch('vips/rushproject/' + this.rushproject.RUPRID, this.form)
            .then((response) => {
              this.savedResponse();
            });
        } else {
          this.$axios.post('vips/rushproject', this.form).then((response) => {
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
    getRushProject(id) {
      
      this.editing = true;
      this.$axios.get('vips/rushproject/' + id).then((response) => {

        this.rushproject = response.data.data;

        this.form.chemref = response.data.data.CHEMREF;
        this.form.client = response.data.data.CLIENT;
        this.form.office = response.data.data.OFFICE;
        this.form.expdate = response.data.data.EXPDATE;
        this.form.expsamps = response.data.data.EXPSAMPS;
        this.form.hidden_is = (response.data.data.HIDDEN_IS == 1 ? true : false);

        this.getOffices();

        this.createDialog = true;
        
      });
    },
    resetForm() {
      this.$emit('formReset');
      this.editing = false;
      this.createDialog = false;
      this.rushproject = {};
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
