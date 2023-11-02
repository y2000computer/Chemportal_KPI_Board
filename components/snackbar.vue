<template>
  <v-snackbar
    color="primary"
    bottom
    right
    :value="show"
    :timeout="3000"
    @input="snackbarClose"
    >{{ message }}</v-snackbar
  >
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      message: 'snackbar/snackbarMessage',
      show: 'snackbar/showSnackbar',
    }),
  },
  methods: {
    snackbarClose() {
      this.$store.dispatch('snackbar/resetSnackbar');
    },
  },
};
</script>

<style></style>
