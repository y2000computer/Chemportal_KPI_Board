<template>
  <v-card outlined :loading="loading">
    <v-card-text>
      <v-row align="center">
        <v-col class="text-h3">{{ value }}</v-col>
        <v-col class="text-h6 text-center">{{ title }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    value: String,
    loading: Boolean,
  },
};
</script>

<style></style>
