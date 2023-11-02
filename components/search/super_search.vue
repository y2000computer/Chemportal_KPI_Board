<template>
  <div>
    <v-text-field
      hide-details
      outlined
      dense
      clearable
      placeholder="Job/Sample Search"
      @keyup.enter="search"
      v-model="searchString"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchString: '',
    };
  },
  methods: {
    search() {
      this.$router.replace('/job/' + this.searchString);
      this.searchString = '';
      // this.loading = true;
      // this.$axios.get('search?search=' + this.searchString).then((response) => {
      //   this.searchResult = response.data.data;
      //   this.loading = false;
      // });
    },
  },
};
</script>

<style></style>
