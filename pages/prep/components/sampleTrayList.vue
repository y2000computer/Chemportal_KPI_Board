<template>
  <v-row no-gutters
    ><v-col>
      <v-row
        ><v-col
          ><v-switch
            v-model="complete"
            @change="getTrays"
            label="Show Completed"
          ></v-switch></v-col
      ></v-row>
      <v-row
        ><v-col><v-btn @click="createNewTray">Add New</v-btn></v-col></v-row
      >
      <v-list dense
        ><v-list-item
          v-for="tray in trays"
          :key="tray.STRAYID"
          @click="traySelected(tray.STRAYID)"
        >
          <v-list-item-content>
            <v-list-item-title>Tray: {{ tray.STRAYID }}</v-list-item-title>
            <v-list-item-title>Created: {{ tray.CREATEDDT }}</v-list-item-title>
            <v-list-item-title
              >By: {{ tray.created_by.USER_NAME }}</v-list-item-title
            >
            <v-list-item-title
              >Samples: {{ tray.containers_count }}</v-list-item-title
            >
          </v-list-item-content></v-list-item
        ></v-list
      >
    </v-col></v-row
  >
</template>

<script>
export default {
  props: {
    type: Number,
  },
  data() {
    return {
      trays: [],
      complete: false,
    };
  },

  mounted() {
    this.getTrays();
  },
  methods: {
    createNewTray() {
      this.$axios.post('sample-trays?type=' + this.type).then((response) => {
        this.tray = response.data.data;
        //this.printTrayLabel();
        this.trays.unshift(response.data.data);
      });
    },
    getTrays() {
      this.$axios
        .get('sample-trays', {
          params: {
            type: 3,
            complete: this.complete ? 1 : 0,
          },
        })
        .then((response) => {
          this.trays = response.data.data;
          this.traysLoading = false;
        });
    },
    traySelected(id) {
      this.$emit('traySelected', id);
    },
  },
};
</script>

<style></style>
