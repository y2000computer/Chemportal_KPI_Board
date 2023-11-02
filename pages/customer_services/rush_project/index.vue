<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">Rush Project</v-toolbar-title
          ><v-spacer /></v-toolbar>
        <v-card-text>
          <v-tabs grow>

            
            <v-tab>Rush Project</v-tab>
            <v-tab-item>
              <rushproject-list :rushprojects="rushprojects" :loading="rushprojectLoading" @getRushProject="getRushProject"  />
            </v-tab-item>

          </v-tabs> 
          </v-card-text>
          </v-card></v-col>
  </v-row>
</template>

<script>

import rushprojectList from './components/rushproject_list';
export default {
  components: {
    rushprojectList,
  },
  data() {
    return {
      rushprojectLoading: true,
      rushprojects: [],
 
    };
  },
  mounted() {
    this.getRushProject();

  },

  methods: {

    getRushProject() {
      this.rushprojectLoading = true;
      this.$axios.get('vips/rushproject').then((response) => {        
        this.rushprojects = response.data.data;
        this.rushprojectLoading = false;
        //console.log('this.rushprojects =', this.rushprojects)
      });
    },
  },
};
</script>

<style></style>
