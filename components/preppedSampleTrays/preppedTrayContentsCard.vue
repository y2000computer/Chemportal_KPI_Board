<template>
  <v-card flat
    ><v-card-title>Test</v-card-title
    ><v-card-content>{{ id }}</v-card-content></v-card
  >
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style></style>
