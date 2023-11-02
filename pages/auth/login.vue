<template>
  <v-row justify="center">
    <v-col xl="3" lg="4" md="6" sm="10" cols="12">
      <v-card outlined>
        <v-card-text>
          <v-row justify="center"
            ><v-col cols="10">
              <v-img
                contain
                height="80px"
                :src="
                  require(this.$vuetify.theme.dark
                    ? '~/assets/images/chemtest_negative.png'
                    : '~/assets/images/chemtest_full.png')
                "
              ></v-img></v-col
          ></v-row>
          <v-row
            ><v-col class="text-center text-subtitle-1"
              >Chemportal</v-col
            ></v-row
          >
          <v-row
            ><v-col class="text-center text-subtitle-2"
              >Please Sign In</v-col
            ></v-row
          >
          <v-row justify="center">
            <v-col md="10">
              <v-text-field
                outlined
                autocomplete="off"
                placeholder="AIS User ID"
                autofocus
                type="text"
                v-model="form.user_id"
                label="User ID"
                name="User ID"
                v-validate="'required'"
                :error-messages="errors.first('User ID')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col md="10">
              <v-text-field
                outlined
                autocomplete="off"
                placeholder="AIS Password"
                type="password"
                v-model="form.password"
                label="Password"
                name="Password"
                v-validate="'required'"
                :error-messages="errors.first('Password')"
                @keyup.enter="login"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            large
            block
            @click="login"
            :loading="loading"
            :disabled="loading"
            color="primary"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
      <v-row v-if="loginErrors.length">
        <v-col>
          <v-alert type="error" class="mt-2">{{ loginErrors }}</v-alert>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: 'guest',
  data() {
    return {
      form: {
        user_id: '',
        password: '',
      },
      loading: false,
    };
  },
  computed: {
    loginErrors() {
      return this.$store.state.validation.errors;
    },
  },
  methods: {
    login() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loading = true;
          localStorage.removeItem('token_expiry');
          this.$auth
            .loginWith('local', {
              data: this.form,
            })
            .then(() => {
              this.$store.dispatch('token/setExpiryTime');
            })
            .then(() => {
              var hour = this.$moment().format('H');
              var string = '';
              if (hour < 12) {
                string = 'Good Morning';
              } else if (hour >= 12 && hour <= 17) {
                string = 'Good Afternoon';
              } else {
                string = 'Good Evening';
              }
              name = this.$auth.user.USER_NAME;
              this.$store.dispatch(
                'snackbar/showSnackbar',
                string + ' ' + name
              );
            })
            // .then(() => {
            //   this.$router.push({
            //     path: this.$store.state.auth.redirect,
            //   });
            // })

            .catch((e) => {
              this.error = e + '';
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style></style>
