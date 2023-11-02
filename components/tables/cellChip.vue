<template>
  <v-chip
    small
    dark
    :color="
      positive == null ? '' : positive ? 'green darken-1' : 'red darken-1'
    "
  >
    {{ value }}
    <v-icon right small>
      {{
        positive == null
          ? ''
          : positive
          ? 'mdi-arrow-up-bold'
          : 'mdi-arrow-down-bold'
      }}
    </v-icon>
  </v-chip>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    positive: {
      type: Boolean,
    },
    size: {
      type: String,
      default: 'small',
    },
  },
};
</script>

<style></style>
