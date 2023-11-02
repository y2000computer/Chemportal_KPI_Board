<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          Chemsolutions COC's
          <v-spacer />
          <v-icon @click="getCOCs" :disabled="loading">refresh</v-icon>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="3" cols="12">
              <v-text-field
                dense
                hide-details
                v-model="search"
                clearable
                outlined
                label="Search"
                append-icon="search"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                dense
                :headers="headers"
                :items="COCs"
                :loading="loading"
                :search="search"
                :sort-by="['LogDate']"
                :sort-desc="[true]"
              >
                <template v-slot:item.LogDate="{ item }">
                  {{
                  $moment(item.LogDate).format('DD/MM/YYYY')
                  }}
                </template>
                <template v-slot:item.Project="{item}">{{item.Project | shorten(20)}}</template>
                <template v-slot:item.JobContact="{ item }">
                  <v-tooltip bottom dark>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">{{ item.JobContact | shorten(25) }}</div>
                    </template>
                    <span>{{ item.JobContact }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:item.WebJobStatus="{ item }">
                  <v-chip
                    small
                    dark
                    :color="colour(item.WebJobStatus)"
                  >{{ item.WebJobStatus == 4 ? 'Sent' : 'Open' }}</v-chip>
                </template>
                <template v-slot:item.Action="{ item }">
                  <v-btn class="mr-2" small icon :to="'/chemsolutions/' + item.COCNO">
                    <v-icon>visibility</v-icon>
                  </v-btn>
                  <v-btn small icon @click="runreport(item.COCNO)">
                    <v-icon>print</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
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
      search: "",
      loading: true,
      headers: [
        { text: "Log Date", value: "LogDate" },
        { text: "COC No", value: "COCNO" },
        { text: "Client", value: "Client" },
        { text: "Project", value: "Project" },
        { text: "Contact", value: "JobContact" },
        { text: "Samples", value: "SampCount", sortable: false },
        { text: "Status", value: "WebJobStatus" },
        { text: "Action", value: "Action" },
      ],
      COCs: [],
    };
  },
  mounted() {
    this.getCOCs();
  },
  methods: {
    getCOCs() {
      this.loading = true;
      this.$axios.get("/chemsolutions/cocs").then((response) => {
        this.COCs = response.data;
        this.loading = false;
      });
    },
    colour(status) {
      if (status == 4) {
        return "green";
      } else {
        return "red";
      }
    },
    runreport(COC) {
      window.open(
        "http://nm-web01:8080/jasperserver/flow.html?j_username=sampleReg&j_password=sampleReg&_flowId=viewReportFlow&ParentFolderUri=/Reports/Chemsolutions&reportUnit=/Reports/Chemsolutions/ChemsolutionsCOC&output=pdf&standAlone=true&COC=" +
          COC,
        "_blank"
      );
    },
  },
};
</script>

<style></style>
