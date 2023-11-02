<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>Container Demo Example</v-card-title>
        <v-card-text
          ><v-row
            ><v-col>
              <v-tabs color="primary" grow>
                <v-tab>Batch Details</v-tab>
                <v-tab>Sample Details</v-tab>
                <v-tab>Planning Details</v-tab>
                <v-tab>Container Counts</v-tab>
                <v-tab>Container Details</v-tab>
                <v-tab>Limit Details</v-tab>

                <v-tab-item
                  ><v-card flat
                    ><v-card-text
                      ><v-subheader>Batch Details</v-subheader></v-card-text
                    ></v-card
                  ></v-tab-item
                >
                <v-tab-item
                  ><v-card flat
                    ><v-card-text
                      ><v-subheader>Sample Details</v-subheader></v-card-text
                    ></v-card
                  ></v-tab-item
                >
                <v-tab-item
                  ><v-card flat
                    ><v-card-text
                      ><v-subheader>Planning Details</v-subheader>
                      <v-row
                        ><v-col
                          ><v-data-table
                            dense
                            :items="samples"
                            :headers="sampleHeaders"
                          ></v-data-table></v-col></v-row></v-card-text></v-card
                ></v-tab-item>
                <v-tab-item
                  ><v-card flat
                    ><v-card-text
                      ><v-subheader>Container Details</v-subheader
                      ><v-row
                        ><v-col
                          ><v-btn
                            small
                            color="primary"
                            @click="containerDialog = !containerDialog"
                            >Add Containers Types</v-btn
                          >
                          <v-btn
                            small
                            class="ml-2 float-right"
                            color="primary"
                            @click="containerDialog = !containerDialog"
                            >Save<v-icon small class="ml-2"
                              >mdi-content-save</v-icon
                            ></v-btn
                          ></v-col
                        ></v-row
                      ><v-row
                        ><v-col
                          ><v-simple-table>
                            <thead>
                              <tr>
                                <th
                                  v-for="header in sampleContainerHeaderArray"
                                  :key="'header' + header"
                                >
                                  {{ header.text }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="sample in sampleContainerCountArray"
                                :key="'sample' + sample.sample_id"
                              >
                                <td>{{ sample.sample_id }}</td>
                                <td>{{ sample.sample_desc }}</td>
                                <td>{{ sample.sample_depth }}</td>
                                <td>{{ sample.sample_matrix }}</td>
                                <td
                                  width="100"
                                  v-for="container in sample.containers"
                                  :key="
                                    'sample' +
                                      sample.sample_id +
                                      'container' +
                                      container.text
                                  "
                                >
                                  <v-text-field
                                    dense
                                    outlined
                                    hide-details
                                    :value="container.value"
                                  />
                                </td>
                              </tr>
                            </tbody> </v-simple-table></v-col></v-row></v-card-text></v-card
                ></v-tab-item>
                <v-tab-item
                  ><v-card flat
                    ><v-card-text
                      ><v-subheader>Container Details</v-subheader>
                      <v-row
                        ><v-col
                          ><v-simple-table>
                            <thead>
                              <tr>
                                <th>
                                  #
                                </th>
                                <th>
                                  Type
                                </th>
                                <th>
                                  Sample ID
                                </th>
                                <th>
                                  Desc
                                </th>
                                <th>
                                  Depth
                                </th>
                                <th>
                                  Temp.
                                </th>
                                <th>
                                  Broken?
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(container, index) in containers"
                                :key="'cont' + index"
                              >
                                <td>{{ index + 1 }}</td>
                                <td>{{ container.container_type }}</td>
                                <td>{{ container.sample_id }}</td>
                                <td>{{ container.sample_desc }}</td>
                                <td>{{ container.sample_depth }}</td>
                                <td width="100">
                                  <v-text-field
                                    dense
                                    outlined
                                    hide-details
                                    :value="container.value"
                                  />
                                </td>
                                <td><v-switch inset dense></v-switch></td>
                              </tr>
                            </tbody> </v-simple-table></v-col
                      ></v-row> </v-card-text></v-card
                ></v-tab-item> </v-tabs></v-col></v-row></v-card-text
      ></v-card>
      <v-dialog v-model="containerDialog" max-width="600"
        ><v-card outlined
          ><v-card-title>Add Containers</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-list dense
                  ><v-list-item-group multiple v-model="selectedContainers">
                    <v-list-item
                      color="primary"
                      v-for="(container, index) in containerOptions"
                      :key="container + index"
                      :value="container"
                      ><v-list-item-content
                        ><v-list-item-title>{{
                          container
                        }}</v-list-item-title></v-list-item-content
                      ></v-list-item
                    >
                  </v-list-item-group></v-list
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card></v-dialog
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      test: 'Tset',
      sampleHeaders: [
        { text: '#', value: 'sample_id' },
        { text: 'Desc', value: 'sample_desc' },
        { text: 'Depth', value: 'sample_depth' },
        { text: 'Matrix', value: 'sample_matrix' },
      ],
      samples: [
        {
          sample_id: '000001',
          sample_desc: 'Test Sample 1',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          containers: [],
        },
        {
          sample_id: '000002',
          sample_desc: 'Test Sample 2',
          sample_depth: '1.5m',
          sample_matrix: 'Soil',
          containers: [],
        },
        {
          sample_id: '000003',
          sample_desc: 'Test Sample 3',
          sample_depth: '2.5m',
          sample_matrix: 'Soil',
          containers: [],
        },
        {
          sample_id: '000004',
          sample_desc: 'Test Sample 4',
          sample_depth: '1.5m',
          sample_matrix: 'Soil',
          containers: [],
        },
        {
          sample_id: '000005',
          sample_desc: 'Test Sample 5',
          sample_depth: '0.7m',
          sample_matrix: 'Soil',
          containers: [],
        },
        {
          sample_id: '000006',
          sample_desc: 'Test Sample 6',
          sample_depth: '1.2m',
          sample_matrix: 'Soil',
          containers: [],
        },
      ],
      containerDialog: false,
      containers: [
        {
          sample_id: '000001',
          sample_desc: 'Test Sample 1',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (60ml)',
        },
        {
          sample_id: '000001',
          sample_desc: 'Test Sample 1',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Coloured Winchester (1000ml)',
        },
        {
          sample_id: '000001',
          sample_desc: 'Test Sample 1',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (150ml)',
        },
        {
          sample_id: '000002',
          sample_desc: 'Test Sample 2',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (60ml)',
        },
        {
          sample_id: '000002',
          sample_desc: 'Test Sample 2',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Coloured Winchester (1000ml)',
        },
        {
          sample_id: '000002',
          sample_desc: 'Test Sample 2',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (150ml)',
        },
        {
          sample_id: '000003',
          sample_desc: 'Test Sample 3',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (60ml)',
        },
        {
          sample_id: '000003',
          sample_desc: 'Test Sample 3',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Coloured Winchester (1000ml)',
        },
        {
          sample_id: '000003',
          sample_desc: 'Test Sample 3',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (150ml)',
        },
        {
          sample_id: '000004',
          sample_desc: 'Test Sample 4',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (60ml)',
        },
        {
          sample_id: '000004',
          sample_desc: 'Test Sample 4',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Coloured Winchester (1000ml)',
        },
        {
          sample_id: '000004',
          sample_desc: 'Test Sample 4',
          sample_depth: '0.5m',
          sample_matrix: 'Soil',
          container_type: 'Amber Jar (150ml)',
        },
      ],
      containerHeaders: [],
      containerOptions: [
        'Amber Jar (60ml)',
        'Amber Jar (150ml)',
        'Coloured Winchester (1000ml)',
        'Plastic Bag',
      ],
      selectedContainers: [],
    };
  },
  computed: {
    sampleContainerHeaderArray() {
      return [
        ...this.sampleHeaders,
        ...this.selectedContainers.map((container) => {
          return { text: container, value: 0 };
        }),
      ];
    },

    sampleContainerCountArray() {
      return this.samples.map((sample) => {
        sample.containers = this.selectedContainers.map((container) => {
          return { text: container, value: 0 };
        });
        return sample;
      });
    },
  },
};
</script>

<style></style>
