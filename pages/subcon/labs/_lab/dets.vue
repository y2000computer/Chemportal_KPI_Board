<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          <v-btn exact icon class="mr-3" to="/subcon/labs">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          {{ title }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col></v-col>
            <v-col></v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                label="Search"
                v-model="search"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Lab Dets
              <v-list dense>
                <v-list-item
                  three-line
                  v-for="(det, index) in labDets"
                  :key="'lab' + det.DET"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      >Name: {{ det.det.REPNAME }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Type: {{ det.det.SUPERTYPE }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Code: {{ det.det.DET }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn @click="removeDet(index)">remove</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col>
              Det list
              <v-list dense>
                <v-list-item
                  v-for="(det, index) in filteredDets"
                  :key="'det' + det.DET"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      >Name: {{ det.REPNAME }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Type: {{ det.SUPERTYPE }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Code: {{ det.DET }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="primary" @click="addDet(index)">Add</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      labId: '',
      search: '',
      lab: [],
      labDets: [],
      dets: [],
    };
  },
  computed: {
    title() {
      if (this.lab.LABNAME) {
        return 'Edit ' + this.lab.LABNAME;
      } else {
        return 'Edit....';
      }
    },
    filteredDets() {
      if (this.search.length > 2) {
        return this._.filter(this.dets, (o) => {
          if (o.REPNAME.toLowerCase().includes(this.search.toLowerCase())) {
            return o;
          }
        });
      } else {
        return {};
      }
    },
  },
  mounted() {
    this.labId = this.$route.params.lab;
    this.getLab();
    this.getSubconDets();
  },
  methods: {
    getLab() {
      this.$axios.get('subcon/labs/' + this.labId).then((response) => {
        this.lab = response.data.data;
        Object.assign(this.labDets, response.data.data.subcon_dets);
      });
    },
    getSubconDets() {
      this.$axios.get('dets/subcon-dets').then((response) => {
        this.dets = response.data.data;
      });
    },
    addDet(index) {
      var det = this.filteredDets[index];
      this.$axios
        .patch('subcon/labs/' + this.labId + '/add-det', {
          det: det.DET,
        })
        .then((response) => {
          this.labDets.push(response.data.data);
        });
    },
    removeDet(index) {
      var det = this.labDets[index];
      this.$axios
        .patch('subcon/labs/' + this.labId + '/remove-det', {
          det: det.DET,
        })
        .then((response) => {
          this.labDets.splice(index, 1);
        });
    },
  },
};
</script>

<style></style>
