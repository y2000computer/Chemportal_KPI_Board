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
            :items="filteredSamples"
            :headers="headers"
            :loading="loading"
            item-key="samples"
            :search="search"
          >
            <template v-slot:item.SAMPNUM="{ item }">
              {{ item.SAMPNUM | shorten(20) }}
            </template>
            <template v-slot:item.TEST="{ item }">
              {{ item.TEST | shorten(20) }}
            </template>
            <template v-slot:item.CREATETS="{ item }">
              {{ $moment(item.CREATETS).format('DD/MM/YYYY hh:mm:ss') }}
            </template>
            <template v-slot:item.CREATEDBY="{ item }">
              {{ item.CREATEDBY | shorten(20) }}
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
    samples: {
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
        { text: 'Sample ID', value: 'SAMPNUM' },
        { text: 'Test', value: 'TEST' },
        { text: 'Create Timestamp ', value: 'CREATETS' },
        { text: 'Create By', value: 'CREATEDBY' }
      ],
    };
  },
  computed: {
    filteredSamples() {
      if (!this.samples) {
        return [];
      }
      if (this.samples.length > 0) {
          return this.samples;
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
