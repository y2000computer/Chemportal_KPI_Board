<template>
  <v-list dense shaped>
    <v-list-item-group
      color="primary"
      v-model="selectedType"
      @change="typeSelected"
    >
      <template v-if="types.length == 0">
        <v-skeleton-loader
          v-for="i in 5"
          type="list-item"
          :key="i"
        ></v-skeleton-loader>
      </template>

      <v-list-item
        v-for="type in types"
        :key="'listItem' + type.STRAYTYPID"
        :value="type"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ type.DESCRIPTN }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedType: {},
    };
  },
  methods: {
    typeSelected() {
      this.$emit('typeSelected', this.selectedType);
    },
  },
};
</script>

<style></style>
