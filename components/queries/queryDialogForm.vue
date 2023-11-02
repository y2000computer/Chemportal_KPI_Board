<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card outlined>
      <v-card-title
        >New Query<v-spacer /><v-btn icon small @click="closeDialog"
          ><v-icon>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-card-text>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field dense outlined label="Job" :value="job" readonly />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                :items="['Testing', 'Additional Testing']"
                label="Query Type"
                dense
                outlined
                v-model="queryType"
                v-validate="{ rules: 'required' }"
                name="Query Type"
                :error-messages="errors.first('Query Type')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                :items="users"
                item-text="USER_NAME"
                item-value="USER_ID"
                dense
                outlined
                label="FAO"
                v-model="fao"
                v-validate="{ rules: 'required' }"
                name="FAO"
                :error-messages="errors.first('FAO')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                dense
                outlined
                label="Query"
                v-model="queryText"
                v-validate="{ rules: 'required' }"
                name="Query"
                rows="5"
                :error-messages="errors.first('Query')"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions
        ><v-btn @click="submit" color="primary" block
          >Submit</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true,
    },
    job: {
      type: String,
      default: '',
      required: false,
    },
    data() {
      return {
        queryText: '',
        queryType: '',
        fao: '',
      };
    },
  },
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.$axios.get('users/section/BOOKING IN').then((response) => {
        this.users = response.data.data;
      });
    },
    closeDialog() {
      this.$emit('dialogClosed');
    },
    submit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.queryLoading = true;
          this.$axios
            .post('queries', {
              jobs: [this.job],
              queryText: this.queryText,
              queryType: this.queryType,
              section: 'BOOKING IN',
              addTestDays: '',
              fao: this.fao,
            })
            .then(() => {
              this.$store.dispatch('snackbar/showSnackbar', 'Query Added');
              this.fao = '';
              this.queryType = '';
              this.queryText = '';
              this.closeDialog();
            });
        }
      });
    },
  },
};
</script>

<style></style>
