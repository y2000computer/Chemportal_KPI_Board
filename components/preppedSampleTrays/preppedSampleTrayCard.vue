<template>
  <v-card flat
    ><v-card-title
      >Sample Tray List<v-spacer /><v-btn
        class="ml-2"
        small
        icon
        @click="containersDialog = !containersDialog"
        ><v-icon>mdi-table-of-contents</v-icon></v-btn
      ><v-menu offset-y :close-on-content-click="false" v-model="addMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon class="ml-2" v-bind="attrs" v-on="on"
            ><v-icon>mdi-plus</v-icon></v-btn
          >
        </template>
        <v-card>
          <v-card-text>
            <v-tab-item></v-tab-item>
            <v-row
              ><v-col>
                <v-select
                  outlined
                  dense
                  hide-details
                  :items="trayTypes"
                  class="ma-0"
                  item-text="DESCRIPTN"
                  item-value="STRAYTYPID"
                  v-model="trayType"
                  label="Tray Type"
                ></v-select></v-col
            ></v-row>
            <v-row
              ><v-col
                ><v-btn @click="addTray" color="primary">Add</v-btn></v-col
              ></v-row
            >
          </v-card-text>
        </v-card> </v-menu
      ><v-menu offset-y :close-on-content-click="false" v-model="searchMenu"
        ><template v-slot:activator="{ on, attrs }">
          <v-btn small icon class="ml-2" v-bind="attrs" v-on="on"
            ><v-icon>mdi-card-search</v-icon></v-btn
          ></template
        >
        <v-card>
          <v-card-text>
            <v-row
              ><v-col>
                <v-text-field
                  v-model="search"
                  dense
                  hide-details
                  outlined
                  label="Search"
                  @keyup.enter="findTray"
                ></v-text-field></v-col
            ></v-row>
            <v-row
              ><v-col
                ><v-btn
                  :loading="searching"
                  :disabled="searching"
                  @click="findTray"
                  color="primary"
                  >Search</v-btn
                ></v-col
              ></v-row
            >
          </v-card-text>
        </v-card>
      </v-menu></v-card-title
    ><v-card-text
      ><v-row
        ><v-col
          ><v-text-field
            :loading="loading"
            outlined
            dense
            hide-details
            readonly
            :value="tray.STRAYID"
            label="Tray ID"
          ></v-text-field></v-col></v-row
      ><v-row
        ><v-col
          ><v-text-field
            :loading="loading"
            outlined
            dense
            hide-details
            readonly
            :value="tray.type ? tray.type.DESCRIPTN : ''"
            label="Tray Type"
          ></v-text-field></v-col></v-row
      ><v-row
        ><v-col
          ><v-text-field
            :loading="loading"
            outlined
            dense
            hide-details
            readonly
            :value="
              tray.STRAYID
                ? $moment(tray.CREATEDDT).format('DD/MM/YY') +
                  ' @ ' +
                  tray.CREATEDTM
                : ''
            "
            label="Created"
          ></v-text-field></v-col
      ></v-row>
      <v-row
        ><v-col
          ><v-text-field
            dense
            :loading="loading"
            autocomplete="off"
            outlined
            hide-details
            label="Last Sample"
            :value="
              tray.STRAYID
                ? tray.containers.length > 0
                  ? tray.containers[tray.containers.length - 1].SAMPNUM
                  : 'N/A'
                : 'N/A'
            "
          ></v-text-field></v-col
      ></v-row>
      <v-row
        ><v-col
          ><v-text-field
            :loading="loading"
            outlined
            autocomplete="off"
            dense
            readonly
            :error-messages="
              tray.containers
                ? tray.containers.length > tray.type.MAXCNT
                  ? 'Too Many Samples'
                  : ''
                : ''
            "
            :value="
              tray.STRAYID
                ? tray.containers.length + '/' + tray.type.MAXCNT
                : ''
            "
            label="Containers"
          ></v-text-field></v-col></v-row
      ><v-dialog scrollable v-model="containersDialog" max-width="1000"
        ><v-card flat height="800"
          ><v-card-title>Tray {{ tray.STRAYID }} Containers</v-card-title
          ><v-card-text
            ><v-row
              ><v-col>
                <v-simple-table dense
                  ><thead>
                    <tr>
                      <th>Container</th>
                      <th>Sample</th>
                      <th>Job</th>
                      <th>Client</th>
                      <th>Date/Time Added</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(container, index) in tray.containers"
                      :key="container.STRAYCNTID"
                    >
                      <td>{{ container.STRAYCNTID }}</td>
                      <td>{{ container.SAMPNUM }}</td>
                      <td>{{ container.sample.JOB }}</td>
                      <td>
                        {{ container.sample.job.office.client.CLIENTNAME }}
                      </td>
                      <td>
                        {{ $moment(container.ADDDATE).format('DD/MM/YY') }} @
                        {{ container.ADDTM }}
                      </td>
                      <td>
                        <v-btn
                          icon
                          small
                          @click="deleteContainer(container.STRAYCNTID, index)"
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                      </td>
                    </tr>
                  </tbody></v-simple-table
                >
              </v-col></v-row
            ></v-card-text
          ></v-card
        ></v-dialog
      ></v-card-text
    ></v-card
  >
</template>

<script>
export default {
  props: {
    defaultTrayType: {
      type: String,
      required: false,
    },
    sample: {
      type: String,
      default: null,
    },
    printLabel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      searching: false,
      trayTypes: [],
      trayType: '',
      tray: {},
      loading: false,
      sampnum: '',
      addMenu: false,
      searchMenu: false,
      containersDialog: false,
    };
  },
  mounted() {
    this.getTrayTypes();
    this.getLatestTray();
  },

  methods: {
    getTrayTypes() {
      this.$axios.get('prepped-sample-trays/tray-types').then((response) => {
        this.trayTypes = response.data.data;
        this.trayType = this.defaultTrayType;
      });
    },
    getLatestTray() {
      if (!this.defaultTrayType) {
        return;
      }
      this.loading = true;
      this.$axios
        .get('prepped-sample-trays/trays?type=' + this.defaultTrayType)
        .then((response) => {
          this.tray = response.data.data[0];
          this.loading = false;
        });
    },
    addTray() {
      this.$axios
        .post('prepped-sample-trays/trays', {
          type: this.trayType,
        })
        .then((response) => {
          this.tray = response.data.data;
          this.search = '';
          this.printTrayLabel();
          this.addMenu = false;
        });
    },
    printTrayLabel() {},
    findTray() {
      this.searching = true;
      this.$axios
        .get('prepped-sample-trays/trays/' + this.search)
        .then((response) => {
          this.tray = response.data.data;
          this.search = '';
          this.searchMenu = false;
          this.searching = false;
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
          this.$emit('containerAdded');
        });
    },
    deleteContainer(id, index) {
      this.$axios
        .delete('prepped-sample-trays/containers/' + id)
        .then((response) => {
          this.tray.containers.splice(index, 1);
        });
    },
  },
};
</script>

<style></style>
