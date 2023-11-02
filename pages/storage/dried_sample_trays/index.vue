<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Dried Sample Trays</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="date"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="search"></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="getTrays">Get</v-btn>
            </v-col>
            <v-col>
              <v-btn @click="addDialog = !addDialog">Open</v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col md v-for="(tray, key) in filteredTrays" :key="key">
              <v-card flat>
                <v-card-title>Tray {{ key }}</v-card-title>
                <v-card-text>
                  <v-list dense>
                    <v-list-item
                      v-for="(sample, index) in tray"
                      :key="sample.drytraysid"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          <span class="mr-3">{{ index + 1 }}:</span>
                          {{ sample.SAMPNUM }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-dialog v-model="addDialog" width="400">
        <v-card>
          <v-card-title>
            Add Sample To Tray
            <v-spacer />
            <v-btn @click="closeDialog" icon class="ma-0">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Sample No."
                    v-model="addForm.sampnum"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Tray No."
                    v-model="addForm.tray"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    label="Date"
                    v-model="addForm.date"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="primary">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      date: this.$moment().format('YYYY-MM-DD'),
      search: '',
      sampleSearch: '',
      trays: [],
      addDialog: false,
      addForm: {
        sampnum: '',
        tray: '',
        date: '',
      },
    };
  },
  mounted() {
    this.getTrays();
  },
  computed: {
    filteredTrays() {
      if (!this.search) {
        var trays = this.trays;
      } else {
        var trays = this._.filter(this.trays, (item) => {
          return item.SAMPNUM.includes(this.search);
        });
      }
      return this._.groupBy(trays, (item) => {
        return item.TRAY;
      });
    },
  },
  methods: {
    getTrays() {
      this.$axios
        .get('dried-sample-trays?date=' + this.date)
        .then((response) => {
          this.trays = response.data.data;
        });
    },
    closeDialog() {
      this.addDialog = false;
      this.addForm.sampnum = '';
      this.addForm.date = '';
      this.addForm.tray = '';
    },
  },
};
</script>

<style></style>
