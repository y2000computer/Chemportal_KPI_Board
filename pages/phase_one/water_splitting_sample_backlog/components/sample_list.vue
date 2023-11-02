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
              {{ item.CLIENT | shorten(30) }}
            </template>

            <template v-slot:item.JOB="{ item }">
              {{ item.JOB | shorten(10) }}
            </template>

            <template v-slot:item.SAMPNUM="{ item }">
              {{ item.SAMPNUM | shorten(20) }}
            </template>

            <template v-slot:item.TYPE="{ item }">
              {{ item.TYPE | shorten(10) }}
            </template>

            <template v-slot:item.LOGDATE="{ item }">
              {{ $moment(item.LOGDATE).format('DD/MM/YYYY') }}
            </template>

            <template v-slot:item.DUEDATE="{ item }">
              {{ $moment(item.DUEDATE).format('DD/MM/YYYY') }}
            </template>


            <template v-slot:item.SAMPSTATUS="{ item }">
              {{ item.SAMPSTATUS | shorten(10) }}
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
        { text: 'Job', value: 'JOB' },
        { text: 'Sample ID', value: 'SAMPNUM' },
        { text: 'Type', value: 'TYPE' },
        { text: 'Logged Date', value: 'LOGDATE' },
        { text: 'Due Date', value: 'DUEDATE' },
        { text: 'Sample Status', value: 'SAMPSTATUS' },
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
