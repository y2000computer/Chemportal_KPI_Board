<template>
  <v-card outlined>
    <v-card-title>
      <v-btn exact icon class="mr-3" to="/subcon/labs">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{title}}
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field
              dense
              outlined
              :loading="loading"
              label="Lab Name *"
              v-model="form.name"
              v-validate="{ rules: 'required' }"
              name="Name"
              :error-messages="errors.first('Name')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              outlined
              :loading="loading"
              label="Address 1 *"
              v-model="form.address1"
              v-validate="{ rules: 'required' }"
              name="Address 1"
              :error-messages="errors.first('Address 1')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              outlined
              :loading="loading"
              label="Address 2"
              v-model="form.address2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              dense
              outlined
              :loading="loading"
              label="Address 3"
              v-model="form.address3"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field dense outlined :loading="loading" label="City" v-model="form.city"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              outlined
              :loading="loading"
              label="Postcode *"
              v-model="form.postcode"
              v-validate="{ rules: 'required' }"
              name="Postcode"
              :error-messages="errors.first('Postcode')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field dense outlined :loading="loading" label="County" v-model="form.country"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense outlined :loading="loading" label="Country" v-model="form.country"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field dense outlined :loading="loading" label="Tel." v-model="form.tel"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense outlined :loading="loading" label="Email" v-model="form.email"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        block
        @click="submit"
        :disabled="saving"
        :loading="saving"
      >{{creating? 'Save':'Update'}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    creating: Boolean,
    labId: String
  },
  data() {
    return {
      saving: false,
      loading: false,
      lab: [],
      form: {
        name: "",
        address1: "",
        address2: "",
        address3: "",
        city: "",
        county: "",
        postcode: "",
        country: "",
        tel: "",
        email: ""
      }
    };
  },
  mounted() {
    if (this.labId) {
      this.getLab();
    }
  },
  computed: {
    title() {
      if (this.creating) {
        return "Add New Subcon Lab";
      } else {
        if (this.lab.LABNAME) {
          return "Edit " + this.lab.LABNAME;
        } else {
          return "Edit....";
        }
      }
    }
  },
  methods: {
    getLab() {
      this.loading = true;
      this.$axios.get("subcon/labs/" + this.labId).then(response => {
        this.lab = response.data.data;
        this.loading = false;
        Object.assign(this.form, {
          name: response.data.data.LABNAME,
          address1: response.data.data.ADDRESS1,
          address2: response.data.data.ADDRESS2,
          address3: response.data.data.ADDRESS3,
          city: response.data.data.CITY,
          county: response.data.data.COUNTY,
          postcode: response.data.data.POSTCODE,
          country: response.data.data.COUNTRY,
          tel: response.data.data.TEL,
          email: response.data.data.EMAIL
        });
      });
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.saving = true;
          if (this.creating) {
            this.$axios.post("subcon/labs", this.form).then(response => {
              this.saving = false;
              this.$router.push("/subcon/labs");
            });
          } else {
            this.$axios
              .patch("subcon/labs/" + this.labId, this.form)
              .then(response => {
                this.saving = false;
                this.getLab();
              });
          }
        }
      });
    }
  }
};
</script>

<style>
</style>