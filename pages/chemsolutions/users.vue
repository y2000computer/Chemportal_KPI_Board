<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title>
          Chemsolutions Users
          <v-spacer />
          <v-icon @click="getUsers">refresh</v-icon>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col md="4" sm="12">
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

          <v-data-table
            dense
            :headers="headers"
            :items="users"
            :loading="loading"
            :search="search"
            :sort-by="['id']"
            :sort-desc="[true]"
            :options="options"
            :footer-props="footerProps"
          >
            <template v-slot:item.user_registered="{ item }">
              {{ $moment(item.regdate).format('DD/MM/YYYY') }}
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
      search: '',
      loading: true,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'display_name' },
        { text: 'Email', value: 'user_login' },
        { text: 'Client', value: 'client' },
        { text: 'Reg Date', value: 'user_registered' },
      ],
      options: {
        itemsPerPage: 15,
      },
      footerProps: {
        showFirstLastPage: true,
        itemsPerPageOptions: [15, 50, 100, -1],
      },
      users: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.loading = true;
      this.$axios.get('chemsolutions/users').then((response) => {
        this.users = response.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
