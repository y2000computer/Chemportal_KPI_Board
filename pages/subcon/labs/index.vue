<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>Subcon Labs</v-card-title>
        <v-card-text>
          <v-row justify="space-between" align="center">
            <v-col md="3" cols="12">
              <v-text-field
                dense
                outlined
                hide-details
                clearable
                v-model="search"
                label="Search"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn
                class="float-right"
                large
                color="primary"
                to="/subcon/labs/new"
              >
                Add
                <v-icon class="ml-2">mdi-domain-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :items="labs"
                :headers="headers"
                :search="search"
                :loading="loading"
                dense
                hide-default-footer
                disable-pagination
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    color="primary"
                    icon
                    :to="'/subcon/labs/' + item.SUBCNLABID + '/edit'"
                  >
                    <v-icon>mdi-home-edit</v-icon>
                  </v-btn>
                  <v-btn
                    color="primary"
                    icon
                    :to="'/subcon/labs/' + item.SUBCNLABID + '/dets'"
                  >
                    <v-icon>mdi-test-tube</v-icon>
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
      loading: true,
      search: '',
      headers: [
        { text: 'ID', value: 'SUBCNLABID' },
        { text: 'Lab Name', value: 'LABNAME' },
        { text: 'Address', value: 'ADDRESS1' },
        { text: 'City', value: 'CITY' },
        { text: 'Postcode', value: 'POSTCODE' },
        { text: 'Tel', value: 'TEL' },
        { text: 'Email', value: 'EMAIL' },
        { text: 'Actions', value: 'actions' },
        ,
      ],
      labs: [],
    };
  },
  mounted() {
    this.getLabs();
  },
  methods: {
    getLabs() {
      this.$axios.get('subcon/labs').then((response) => {
        this.labs = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
