<template>
  <v-card flat class="mt-3">
      <v-card-text>
 
      <v-row
        ><v-col
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
            >New<v-icon small class="ml-2">mdi-plus</v-icon></v-btn
          >
        </v-col>
        <v-col class="float-right"
          ><v-switch
            inset
            class="mt-1"
            hide-details
            label="Show Complete"
            v-model="incompleteOnly"
        /></v-col>
      </v-row>
      <v-row class="mt-4"
        ><v-col
          >
          <v-data-table
            dense
            :items="filteredVips"
            :headers="headers"
            :loading="loading"
            :footer-props="footerProps"
          >
            <template v-slot:item.CLIENT="{ item }">
              <v-tooltip bottom :disabled="item.client && item.client.CLIENTNAME.length <= 20">
               <template v-slot:activator="{on, attrs}" >
                  <span
                  v-on="on"
                  v-bind="attrs">
                    {{ item.client.CLIENTNAME | shorten(20) }}
                  </span> 
              </template>
                    {{ item.client.CLIENTNAME }}
            </v-tooltip>
            </template>
               <template v-slot:item.PROJECT="{ item }">
              <v-tooltip bottom :disabled="item.PROJECT && item.PROJECT.length <= 20">
               <template v-slot:activator="{on, attrs}" >
                  <span
                  v-on="on"
                  v-bind="attrs">
                    {{ item.PROJECT | shorten(20) }}
                  </span> 
                </template>
                    {{ item.PROJECT }}
            </v-tooltip>
            </template>
            <template v-slot:item.NOTES="{ item }">
              <v-tooltip bottom :disabled="item.NOTES && item.NOTES.length <= 30">
                <template v-slot:activator="{on, attrs}">
                  <span
                  v-on="on"
                  v-bind="attrs">
                    {{ item.NOTES | shorten(30) }}
                  </span>
      
                </template>
                {{item.NOTES}}
              </v-tooltip>
            
            </template>
             <template v-slot:item.CREATEDDT="{ item }">
              {{ $moment(item.CREATEDDT).isValid() ? $moment(item.CREATEDDT).format('DD/MM/YY') :''}}
            </template>
            <template v-slot:item.expdate="{ item }">
              {{ $moment(item.EXPDATE).isValid() ? $moment(item.EXPDATE).format('DD/MM/YY') :''}}
            </template>
            <template v-slot:item.ENDDATE="{ item }">
              {{ item.ENDDATE ? $moment(item.ENDDATE).format('DD/MM/YY') : '' }}
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip dark :color="item.APPRDATE? 'green':'red'" small>{{item.APPRDATE? 'Approved':'Pending'}}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn small icon @click="getVip(item.VIPSID)"
                ><v-icon>mdi-playlist-edit</v-icon>
              </v-btn>
            </template>
          </v-data-table></v-col
        ></v-row
      >
    </v-col>
    <v-dialog
      v-model="createDialog"
      :max-width="editing ? 1000 : 600"
      persistent
      ><v-card outlined
        ><v-card-title
          >{{ editing ? 'Edit VIP' : 'Create New VIP' }}<v-spacer /><v-btn
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
                <v-row
                  ><v-col
                    ><v-text-field
                      outlined
                      dense
                      label="Chemtref"
                      autocomplete="off"
                      v-model="form.chemref"/></v-col></v-row
                ><v-row
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
                      :error-messages="errors.first('Client')"
                      v-model="form.client"/></v-col
                ></v-row>
                <v-row
                  ><v-col
                    ><v-text-field
                      outlined
                      dense
                      autocomplete="off"
                      label="Project"
                      v-model="form.project"/></v-col
                ></v-row>
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
                              ? $moment(form.expdate).format('DD-MM-YY')
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
                <v-row>
                  <v-col>
                    <v-text-field
                      label="Expected Samples"
                      outlined
                      dense
                      autocomplete="off"
                      v-model="form.expsamps"
                    />
                  </v-col>
                </v-row>
                 <v-row>
                  <v-col>
                    <v-textarea
                      v-model="form.justification"
                      outlined
                      autocomplete="off"
                      :rules="[(v) => v.length <= 200 || 'Max 200 characters']"
                      label="Justification *"
                      rows="2"
                       v-validate="{ rules: 'required' }"
                      name="Justification"
                      :error-messages="errors.first('Justification')"
                    />
                  </v-col> </v-row
              >
                <v-row>
                  <v-col>
                    <v-textarea
                      v-model="form.notes"
                      hide-details
                      outlined
                      autocomplete="off"
                      rows="2"
                      :rules="[(v) => v.length <= 200 || 'Max 200 characters']"
                      label="Notes"
                      counter
                    />
                  </v-col> </v-row
              >
              <v-row v-if="$auth.user.USER_ID == 'JOS' || $auth.user.USER_ID == 'NS' || $auth.user.USER_ID == 'KTO' || $auth.user.USER_ID == 'KJE' || $auth.user.SECTION == 'IT'">
                <v-col>
                  <v-switch hide-details v-model="form.approved" inset label="Approved"/>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-switch hide-details v-model="form.complete" inset label="Complete"/>
                </v-col>
              </v-row>
              
              </v-col>
              <v-col v-if="editing && vip.APPRDATE">
                <v-row><v-col>Attached Jobs</v-col></v-row>
                <v-row justify="center"
                  ><v-col cols="10">
                    <v-text-field
                      outlined
                      dense
                      label="Job No."
                      v-model="job"
                      append-outer-icon="mdi-plus-circle"
                      @click:append-outer="addJob"
                      @keyup.enter="addJob"
                    ></v-text-field>

                    <v-list dense>
                      <v-list-item
                        three-line
                        v-for="(job, index) in vip.jobs"
                        :key="job.JOB"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            >Job: {{ job.JOB }}</v-list-item-title
                          >
                          <v-list-item-subtitle
                            >Logged: {{ job.LOGDATE }}</v-list-item-subtitle
                          >
                          <v-list-item-subtitle
                            >Status: {{ job.JOBSTATUS }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon @click="deleteJob(job.JOB, index)"
                            ><v-icon>mdi-delete</v-icon></v-btn
                          >
                        </v-list-item-action>
                      </v-list-item></v-list
                    ></v-col
                  ></v-row
                >
              </v-col>
            </v-row>
          </v-form> </v-card-text
        ><v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="saving"
            :loading="saving"
            @click="saveVip"
            color="primary"
            >{{ editing ? 'Save' : 'Create' }}</v-btn
          ></v-card-actions
        ></v-card
      ></v-dialog
    ></v-card-text>
  </v-card>
</template>

<script>
export default {
    props:{
        vips:{
            type:Array,
            
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
  data() {
    return {
      search: '',
      //loading: false,
      editing: false,
      saving: false,
      incompleteOnly: false,
      clients: [],
      vip: {},
      headers: [
        { text: 'Client', value: 'CLIENT' },
        { text: 'Project', value: 'PROJECT' },
        { text: 'Created', value: 'CREATEDDT' },
        { text: 'By', value: 'CREATEDBY' },
        { text: 'Exp Date', value: 'expdate' },
        { text: 'Exp Samps', value: 'EXPSAMPS' },
        { text: 'ChemRef', value: 'CONSIGNMNT' },
        { text: 'Jobs', value: 'jobs_count' },
        { text: 'Notes', value: 'NOTES' },
        {text: ' TatR', value: 'tatR'},
        { text: 'Status', value: 'status' },
        { text: 'Ended', value: 'ENDDATE' },
        { text: 'Actions', value: 'actions' },
      ],
      footerProps: {
        showFirstLastPage: true,
        itemsPerPageOptions: [20, 50, 100, -1],
      },      
      createDialog: false,
      expdateMenu: false,
      form: {
        chemref: '',
        client: '',
        project: '',
        notes: '',
        expdate: '',
        expsamps: '',
        approved: '',
        justification:'',
      },
      job: '',
    };
  },
  mounted() {
    this.getClients();
    // /this.getVips();
  },
  computed: {
    filteredVips() {
        if(!this.vips){
            return [];
        }
      if (this.incompleteOnly) {
        return this.vips;
      }
      return this.vips.filter((vip) => {
        return !vip.ENDDATE;
      });
    },
  },
  methods: {
    getClients() {
      this.$axios.get('clients/ids').then((response) => {
        this.clients = response.data.data;
      });
    },

    getVip(id) {
      this.editing = true;
      this.$axios.get('vips/' + id).then((response) => {
        this.vip = response.data.data;
        this.form.chemref = response.data.data.CONSIGNMNT;
        this.form.client = response.data.data.CLIENT;
        this.form.project = response.data.data.PROJECT;
        this.form.justification = response.data.data.JUSTIFY;
        this.form.notes = response.data.data.NOTES;
        this.form.expsamps = response.data.data.EXPSAMPS;
        this.form.expdate = response.data.data.EXPDATE;
        this.form.jobs = response.data.data.jobs;
        this.form.approved = response.data.data.APPRDATE? true:false;
        this.form.complete = response.data.data.ENDDATE? true:false;
        this.createDialog = true;
      });
    },

    saveVip() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }
        this.saving = true;
        if (this.editing) {
          this.$axios
            .patch('vips/' + this.vip.VIPSID, this.form)
            .then((response) => {
              this.savedResponse();
            });
        } else {
          this.$axios.post('vips', this.form).then((response) => {
            this.savedResponse();
          });
        }
      });
    },

    savedResponse() {
      this.saving = false;
      this.createDialog = false;
      this.resetForm();
      //this.getVips();
    },

    addJob() {
      this.$axios
        .post('vips/jobs', {
          job: this.job,
          vipsid: this.vip.VIPSID,
        })
        .then((response) => {
          this.vip.jobs.push(response.data.data);
          this.job = '';
        });
    },

    deleteJob(job, index) {
      this.$axios
        .delete('vips/jobs', {
          data: {
            job: job,
            vipsid: this.vip.VIPSID,
          },
        })
        .then((response) => {
          this.vip.jobs.splice(index, 1);
        });
    },

    resetForm() {
      this.$emit('formReset');
      this.editing = false;
      this.createDialog = false;
      this.vip = {};
      Object.keys(this.form).forEach((key) => {
        this.form[key] = '';
      });
      this.$validator.reset();
    },
  },
};
</script>

<style></style>
