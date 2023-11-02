<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-card flat
          ><v-card-title
            >Test<v-spacer /><v-btn
              icon
              small
              @click="addTray"
              :loading="traysLoading"
              :disabled="traysLoading"
              ><v-icon>add</v-icon></v-btn
            ><v-btn
              class="ml-2"
              icon
              small
              @click="getTrays"
              :loading="traysLoading"
              :disabled="traysLoading"
              ><v-icon>refresh</v-icon></v-btn
            ></v-card-title
          ><v-card-text
            ><v-row
              ><v-col
                ><v-data-table
                  :items="trays"
                  :headers="headers"
                  dense
                  :loading="traysLoading"
                  @click:row="getTray"
                >
                  <template v-slot:item.CREATEDDT="{ item }">
                    {{ $moment(item.CREATEDDT).format('DD/MM/YY') }} -
                    {{
                      item.CREATEDTM.substring(0, 2) +
                        ':' +
                        item.CREATEDTM.slice(-2)
                    }}
                  </template>
                  <template v-slot:item.containers="{ item }">
                    {{ item.containers_count }} / {{ item.type.MAXCNT }}
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      color="primary"
                      icon
                      small
                      :disabled="item.containers_count > 0"
                      @click="deleteTray(item.STRAYID)"
                      ><v-icon>mdi-delete</v-icon></v-btn
                    >
                  </template>
                </v-data-table></v-col
              ></v-row
            ></v-card-text
          ></v-card
        ></v-col
      >
      <v-col
        ><v-card flat
          ><v-card-title>Tray: {{ tray.STRAYID }}</v-card-title
          ><v-card-text
            ><v-row>
              <v-col><v-btn @click="addContainer('Blank')">Blank</v-btn></v-col>
              <v-col><v-btn @click="addContainer('QC')">QC</v-btn></v-col>
              <v-col></v-col> </v-row
            ><v-row
              ><v-col
                ><v-data-table
                  dense
                  :items="tray.containers"
                  :headers="
                    contentsHeaders
                  "/></v-col></v-row></v-card-text></v-card
      ></v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    trayType: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      traysLoading: false,
      trays: [],
      headers: [
        { text: 'ID', value: 'STRAYID' },
        { text: 'Created', value: 'CREATEDDT' },
        { text: 'By', value: 'created_by.USER_NAME' },
        { text: 'Containers', value: 'containers', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      contentsHeaders: [
        { text: 'ID', value: 'STRAYCNTID' },
        { text: 'Sample', value: 'SAMPNUM' },
        { text: 'Client', value: 'sample.job.office.client.CLIENTNAME' },
      ],
      tray: {},
    };
  },
  mounted() {
    this.getTrays();
  },
  methods: {
    getTrays() {
      this.traysLoading = true;
      this.$axios
        .get('prepped-sample-trays/trays?type=' + this.trayType)
        .then((response) => {
          this.trays = response.data.data;
          this.traysLoading = false;
        });
    },
    addTray() {
      this.traysLoading = true;
      this.$axios
        .post('prepped-sample-trays/trays', {
          type: this.trayType,
        })
        .then((response) => {
          //this.tray = response.data.data;
          //this.search = '';
          this.printTrayLabel();
          this.trays.unshift(response.data.data);
          this.traysLoading = false;
          this.getTray(response.data.data);
          //this.addMenu = false;
        });
    },
    deleteTray(tray) {
      this.traysLoading = true;
      this.$axios
        .delete('prepped-sample-trays/trays/' + tray)
        .then((response) => {
          this.getTrays();
        });
    },
    printTrayLabel() {},
    getTray(e) {
      this.$axios
        .get('prepped-sample-trays/trays/' + e.STRAYID)
        .then((response) => {
          this.tray = response.data.data;
        });
    },
    addContainer(sample) {
      this.$axios
        .post('prepped-sample-trays/containers', {
          sampnum: sample,
          stray_id: this.tray.STRAYID,
        })
        .then((response) => {
          this.tray.containers.push(response.data.data);
        });
    },
  },
};
</script>

<style></style>
