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
            :items="filteredais_schedule_logs"
            :headers="headers"
            :loading="loading"
            item-key="ais_schedule_logs"
            :search="search"
          >
            <template v-slot:item.SECTION="{ item }">
              {{ item.SECTION | shorten(50) }}
            </template>
            <template v-slot:item.DESCRIPTION="{ item }">
              {{ item.DESCRIPTION | shorten(50) }}
            </template>

            <template v-slot:item.CREATEDDT="{ item }">
              {{ $moment(item.CREATEDDT).format('DD/MM/YYYY hh:mm:ss') }}
            </template>



  
          </v-data-table>
        </v-col></v-row
      >




    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    ais_schedule_logs: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

      headers: [
        { text: 'Section', value: 'SECTION' },
        { text: 'Description', value: 'DESCRIPTION' },        
        { text: 'Timestamp ', value: 'CREATEDDT' }
      ],
    };
  },
  computed: {
    filteredais_schedule_logs() {
      if (!this.ais_schedule_logs) {
        return [];
      }
      if (this.ais_schedule_logs.length > 0) {
          return this.ais_schedule_logs;
      }
      return [];
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
