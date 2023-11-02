<template>
  <v-card flat>
    {{ qcCount }}
    <v-card-title>Tray {{ tray.STRAYID }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col><v-btn>Add Blank</v-btn></v-col>
        <v-col><v-btn>Add QC</v-btn></v-col>
        <v-col>
          <v-text-field
            :disabled="!tray.STRAYID"
            dense
            outlined
            label="Scan Sample"
            v-model="search"
            autofocus
            append-icon="mdi-barcode-scan"
            hide-details
            @keyup.enter="addSample"
            ref="search"
            :loading="sampleLoading"
          ></v-text-field
        ></v-col>
      </v-row>
      <v-row
        ><v-col>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>#</th>
                <th>Sample</th>
                <th>Job</th>
                <th>Client</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(container, index) in tray.containers"
                :key="container.STRAYCNTID"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ container.SAMPNUM }}</td>
                <td>
                  {{ container.sample ? container.sample.JOB : '' }}
                </td>
                <td>
                  {{
                    container.sample
                      ? container.sample.job.office.client.CLIENTNAME
                      : ''
                  }}
                </td>
                <td>{{ container.ADDDATE }}</td>
                <td>{{ container.ADDTM }}</td>
                <td>
                  <v-btn icon small>
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                  <v-btn icon small @click="deleteContainer(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table></v-col
        ></v-row
      >
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    tray: Array,
  },
  data() {
    return {
      search: '',
      sample: [],
      sampleLoading: false,
    };
  },
  computed: {
    qcCount() {
      if (this.tray.STRAYID) {
        let count = 0;
        this.tray.containers.forEach((container) => {
          if (container.SAMPNUM.substring(0, 2) == 'QC') {
            count++;
          }
        });
        return count;
      }
    },
  },
  methods: {
    addSample() {
      this.sampleLoading = true;
      this.$axios
        .post('sample-trays/' + this.tray.STRAYID, {
          sampnum: this.search,
        })
        .then((response) => {
          this.tray.containers.push(response.data.data);
          this.sampleLoading = false;
          //this.printSampleLabel(response.data.data);
          this.search = '';
        });
    },
    deleteContainer(index) {
      this.$axios
        .delete(
          'sample-trays/container/' + this.tray.containers[index].STRAYCNTID
        )
        .then((response) => {
          this.tray.containers.splice(index, 1);
        });
    },
  },
};
</script>

<style></style>
