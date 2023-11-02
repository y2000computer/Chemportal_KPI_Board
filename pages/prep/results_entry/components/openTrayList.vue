<template>
  <v-list>
    <v-list-item
      v-for="(tray, index) in openTrays"
      :key="tray.STRAYID"
      three-line
    >
      <v-list-item-content
        ><v-list-item-title>Tray {{ tray.STRAYID }}</v-list-item-title
        ><v-list-item-subtitle>{{ tray.type.DESCRIPTN }}</v-list-item-subtitle
        ><v-list-item-subtitle>{{
          tray.containers.length + '/' + tray.type.MAXCNT
        }}</v-list-item-subtitle></v-list-item-content
      ><v-list-item-action @click="removeTray(index)"
        ><v-btn icon><v-icon>mdi-close</v-icon></v-btn></v-list-item-action
      >
    </v-list-item>
    <v-skeleton-loader v-if="loading" type="list-item-three-line">
    </v-skeleton-loader>
  </v-list>
</template>

<script>
export default {
  props: {
    openTrays: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
    },
  },
  methods: {
    removeTray(index) {
      this.$emit('removeOpenTray', index);
    },
  },
};
</script>

<style></style>
