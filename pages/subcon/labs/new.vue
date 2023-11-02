<template>
  <v-row justify="center">
    <v-col lg="6" md="8" cols="12">
      <lab-form :creating="true"></lab-form>
    </v-col>
  </v-row>
</template>

<script>
import labForm from "./components/form";
export default {
  components: {
    labForm
  }
};
</script>

<style>
</style>