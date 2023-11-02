<template>
  <v-app>
    <v-app-bar app flat fixed clipped-left>
      <img v-if="darkTheme" src="~/assets/images/chemtest_negative.png" height="50px" />
      <img v-else src="~/assets/images/chemtest_full.png" height="50px" />
      <v-spacer />
      <v-btn icon @click="toggleTheme">
        <v-icon color="primary">mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="px-6">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    darkTheme: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set() {
        this.$store.dispatch("app/toggleTheme");
      }
    }
  },
  methods: {
    toggleTheme() {
      this.$store.dispatch("app/toggleTheme");
    }
  }
};
</script>
<style></style>
