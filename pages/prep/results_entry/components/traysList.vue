<template>
  <v-row
    ><v-col
      ><v-row
        ><v-col></v-col
        ><v-col
          ><v-alert
            color="tableWarnings"
            dense
            v-if="printerNeeded"
            class="text-center font-weight-medium text-subtitle-2 mb-0"
            >Please Select A Printer!</v-alert
          ></v-col
        ><v-col
          ><v-btn
            :disabled="printerNeeded"
            class="float-right"
            @click="addTray"
            color="primary"
            >Add Tray<v-icon small class="ml-2">mdi-tray-plus</v-icon></v-btn
          ></v-col
        ></v-row
      ><v-row
        ><v-col
          ><v-data-table
            :loading="loading"
            :items="trays"
            :headers="headers"
            @click:row="traySelected"
          >
            <template v-slot:item.select="{ item }">
              <v-simple-checkbox color="primary" :value="item.open" />
            </template>
            <template v-slot:item.CREATEDDT="{ item }">
              {{ $moment(item.CREATEDDT).format('DD/MM/YY') }} -
              {{
                item.CREATEDTM.substring(0, 2) + ':' + item.CREATEDTM.slice(-2)
              }}
            </template>
            <template v-slot:item.containers="{ item }">
              {{ item.containers_count }} / {{ item.type.MAXCNT }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn @click.prevent="printTray(item)" icon color="primary"
                ><v-icon>mdi-printer</v-icon></v-btn
              >
              <v-btn
                @click.prevent="deleteTray(item)"
                icon
                color="primary"
                :disabled="item.containers_count > 0 || item.open"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </template>
          </v-data-table></v-col
        ></v-row
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  props: {
    trays: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    labelPrint: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      headers: [
        { text: '', value: 'select' },
        { text: 'Tray #', value: 'STRAYID', width: 120 },
        { text: 'Created', value: 'CREATEDDT' },
        { text: 'By', value: 'created_by.USER_NAME' },
        { text: 'Containers', value: 'containers', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    printerNeeded() {
      if (this.labelPrint && this.$store.state.printer.printer == 'null') {
        return true;
      }
      return false;
    },
  },
  methods: {
    traySelected(tray) {
      this.$emit('traySelected', tray);
    },
    addTray() {
      this.$emit('addTray');
    },
    printTray(tray) {
      this.$emit('printTray', tray);
    },
    deleteTray(tray) {
      this.$emit('deleteTray', tray.STRAYID);
    },
  },
};
</script>

<style></style>
