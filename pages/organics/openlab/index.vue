<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Openlab Sequence Generator</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col md="3">
              <v-card flat>
                <v-card-title>Sequence Options</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-select
                          outlined
                          hide-details
                          dense
                          label=" Select Method"
                          :items="methods"
                          v-model="selectedMethod"
                          @change="getTrayLists"
                        ></v-select>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Dual Channel</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch v-model="dualChannel" inset />
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Method Template</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn-toggle>
                          <v-btn
                            small
                            v-for="(template,key) in templates"
                            :key="'template' + key"
                            @click="templateSelected(key)"
                          >{{key}}</v-btn>
                        </v-btn-toggle>
                      </v-list-item-action>
                    </v-list-item>
                    <v-list-group>
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title>Tray Lists</v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <v-list-item-group v-model="selectedTrayList">
                        <v-list-item
                          dense
                          v-for="trayList in trayLists"
                          :key="trayList"
                          :value="trayList"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{
                              trayList
                              }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat>
                <v-card-title>Channel 1</v-card-title>
                <v-card-text>{{list1}}{{selectedTemplate}}</v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card flat :disabled="!dualChannel">
                <v-card-title>Channel 2</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="item in list1"
                      :key="'list2' + item.position"
                    >{{item.position}} - {{item.value}}</v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      {{ path }}
      {{ trayLists }}
      {{selectedTemplate}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      methods: ["CWG", "PAH", "Phenols"],
      selectedMethod: "",
      dualChannel: false,
      trayLists: [],
      templates: [],
      selectedTemplate: [],
      path: "",
      selectedTrayList: "",
      selectedTrayListContents: [],
      column1Samples: [],
      column2Samples: []
    };
  },
  computed: {
    list1() {
      var positions = [];
      var list = [];
      Object.keys(this.selectedTemplate).forEach(position => {
        positions.push(parseInt(position, 10));
      });

      var listSize = Math.max.apply(Math, positions);
      var i = 1;
      while (i <= listSize) {
        if (typeof this.selectedTemplate[i] != "undefined") {
          list.push({
            position: i,
            value: this.selectedTemplate[i]
          });
        } else {
          list.push({
            position: i,
            value: "test"
          });
        }
        i++;
      }
      return list;
    }
  },
  methods: {
    getTrayLists() {
      this.$axios
        .get("csols/tray-lists?method=" + this.selectedMethod)
        .then(response => {
          this.trayLists = response.data.data.trayLists;
          this.path = response.data.data.path;
          this.templates = response.data.data.templates;
        });
    },
    getTrayList() {
      this.$axios
        .get(
          "csols/tray-list?filename=" + this.path + "\\" + this.selectedTrayList
        )
        .then(response => {
          this.selectedTrayListContents = response.data.data;
        });
    },
    templateSelected(key) {
      this.column1Samples = [];
      this.column2Samples = [];
      this.selectedTemplate = this.templates[key];
    }
  }
};
</script>

<style></style>
