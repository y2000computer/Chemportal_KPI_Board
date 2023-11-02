<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar dark flat>
          <v-toolbar-title>Asbestos Backlog</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-btn to="81111/resultsEntry">Test</v-btn>
              <v-btn to="81111/resultsEntry2">Test2</v-btn>
              <v-text-field label="Search" v-model="search"></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            :search="search "
            :loading="loading"
            :items="backlog"
            :items-per-page="100"
            :headers="headers"
            disable-sort
            dense
            sort-by="DUEDATE"
          >
            <template v-slot:item="props">
              <tr :class="props.item.colour? 'grey lighten-4':''">
                <td :class="props.item.border == 'dashed'? 'dashed-border':''">{{props.index + 1}}</td>
                <td :class="props.item.border == 'dashed'? 'dashed-border':''">{{props.item.JOB}}</td>
                <td
                  :class="props.item.border == 'dashed'? 'dashed-border':''"
                >{{props.item.SAMPNUM}}</td>
                <td
                  :class="props.item.border == 'dashed'? 'dashed-border':''"
                >{{props.item.CLIENTNAME}}</td>
                <td
                  :class="props.item.border == 'dashed'? 'dashed-border':''"
                >{{props.item.DUEDATE}}</td>
                <td
                  :class="props.item.border == 'dashed'? 'dashed-border':''"
                >{{props.item.LOCATION}}</td>
                <td :class="props.item.border == 'dashed'? 'dashed-border':''">{{props.item.STYPE}}</td>
                <td :class="props.item.border == 'dashed'? 'dashed-border':''">
                  <v-icon v-if="props.item.ACM == 'Y'" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td :class="props.item.border == 'dashed'? 'dashed-border':''">
                  <v-icon v-if="props.item.ASBGR == 'Y'" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
                <td :class="props.item.border == 'dashed'? 'dashed-border':''">
                  <v-icon v-if="props.item.ASBFC == 'Y'" color="green">check_box</v-icon>
                  <v-icon v-else color="red">check_box_outline_blank</v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      backlog: [],
      headers: [
        { text: "#" },
        { text: "Job No.", value: "JOB" },
        { text: "Sample", value: "SAMPNUM" },
        { text: "Client", value: "CLIENTNAME" },
        { text: "Due", value: "DUEDATE" },
        { text: "Location", value: "LOCATION" },
        { text: "Type", value: "STYPE" },
        { text: "ACM", value: "ACM" },
        { text: "Grav", value: "ASBGR" },
        { text: "Fibre C", value: "ASBFC" }
      ],
      loading: true,
      rowJob: "",
      search: "",
      selected: []
    };
  },
  mounted() {
    this.getBacklog();
  },
  methods: {
    getBacklog() {
      this.$axios
        .get("asbestos/backlog")
        .then(response => {
          this.backlog = response.data;
          this.loading = false;
        })
        .then(() => {
          this.backlog.forEach((sample, index) => {
            this.checkJob(index);
            this.checkDueDate(index);
          });
        });
    },
    checkJob(index) {
      if (index == 0) {
        this.setClass(index, "colour", false);
        return;
      }
      if (this.backlog[index].JOB == this.backlog[index - 1].JOB) {
        this.setClass(index, "colour", this.backlog[index - 1].colour);
        return;
      }
      this.setClass(index, "colour", !this.backlog[index - 1].colour);
    },
    checkDueDate(index) {
      if (
        index < this.backlog.length - 1 &&
        this.backlog[index].DUEDATE != this.backlog[index + 1].DUEDATE
      ) {
        this.setClass(index, "border", "dashed");
      } else {
        this.setClass(index, "border", "none");
      }
    },
    setClass(index, name, value) {
      this.$set(this.backlog[index], name, value);
    }
  }
};
</script>

<style>
td.dashed-border {
  border-bottom: 2px solid black !important;
}
</style>
