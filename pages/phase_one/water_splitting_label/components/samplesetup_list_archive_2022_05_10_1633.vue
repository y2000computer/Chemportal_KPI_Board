<template>
  <!-- <v-row>
    <v-col> -->
  <v-card flat class="mt-3">
    <v-card-text>




      <v-row
        ><v-col>

          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :items="filteredsetups"
            :search="search"
            :headers="headers"
            :loading="loading"
            item-key="setups"
            
          >

            <template v-slot:item.JOB="{ item }">
              {{ item.JOB | shorten(30) }}
            </template>            

            <template v-slot:item.SAMPNUM="{ item }">
              {{ item.SAMPNUM | shorten(30) }}
            </template>            



            <template v-slot:item.TEST="{ item }">
              {{ item.TEST | shorten(30) }}
            </template>



          </v-data-table>
        </v-col>
        
        
        
        
        
        
        
        
        
        
        
        
        </v-row
      >




    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    setups: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      ShowAll: false,  
      setup: {},
      headers: [
        { text: 'Job', value: 'JOB' },        
        { text: 'Sample', value: 'SAMPNUM' },        
        { text: 'Test', value: 'TEST' },
      ],
    };
  },
  mounted() {
  },  
  computed: {
    filteredsetups() {

      if(!this.setups){
            return [];
        }

      return this.setups.filter((setup) => {
        if (!this.ShowAll) {
               if(setup.ACTIVE_IS == 1 ) return true;
               if(setup.ACTIVE_IS == 0 ) return false;
          } else {
                return true;
          }

      });        
      
    },
  },
  methods: {
   
 
  },
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  -ms-box-shadow: none !important;
}
</style>
