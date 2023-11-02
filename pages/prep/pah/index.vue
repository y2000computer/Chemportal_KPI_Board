<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>PAH Prep</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3"
              ><sample-tray-list
                :type="3"
                @traySelected="getTray"
              ></sample-tray-list
            ></v-col>
            <v-col md="9"
              ><sample-tray-contents :tray="tray"></sample-tray-contents
            ></v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import sampleTrayList from '../components/sampleTrayList';
import sampleTrayContents from '../components/sampleTrayContents';
export default {
  components: { sampleTrayList, sampleTrayContents },
  data() {
    return {
      trays: [],
      traysLoading: false,
      completeTrays: false,
      trayLoading: false,
      tray: [],
      search: '',
      samples: [],
      sampleLoading: false,
    };
  },
  mounted() {
    this.getTrays();
  },
  computed: {},
  methods: {
    getTrays() {
      this.traysLoading = true;
      this.$axios
        .get('sample-trays', {
          params: {
            type: 3,
            complete: this.completeTrays ? 1 : 0,
          },
        })
        .then((response) => {
          this.trays = response.data.data;
          this.traysLoading = false;
        });
    },
    traySelected() {},
    getTray(id) {
      this.trayLoading = true;
      this.$axios.get('sample-trays/' + id).then((response) => {
        this.tray = response.data.data;
        this.trayLoading = false;
      });
    },
  },
};
</script>

<style></style>
