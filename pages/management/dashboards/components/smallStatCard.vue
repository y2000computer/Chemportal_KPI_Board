<template>
  <v-card outlined :loading="loading" :disabled="disabled">
    <v-card-text>
      <v-row align="center">
        <v-col lg="6" md="12" sm="12" cols="12" class="text-h4">{{
          value
        }}</v-col>
        <v-col lg="6" md="12" sm="12" cols="12" class="text-h7 text-center">{{
          title
        }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    value: String,
    subvalue: String,
    loading: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
