<template>

  <v-card flat class="mt-3">
    <v-card-text>
     
      <v-row
        ><v-col>
          <v-data-table
            dense
            disable-pagination
            hide-default-footer
            :items="LabelStandardGroups"
            :headers="headers"
            :loading="loading"
          >


            <template v-slot:item.INSDATE="{ item }">
              {{ $moment(item.INSDATE).format('DD/MM/YY') }}
            </template>

            <template v-slot:item.JOB="{ item }">
              {{ item.JOB | shorten(30) }}
            </template>            

            <template v-slot:item.SAMPNUM="{ item }">
              {{ item.SAMPNUM | shorten(30) }}
            </template>            


            <template v-slot:item.LABEL_GROUP="{ item }">
              {{ item.LABEL_GROUP | shorten(30) }}
            </template>            
            

            <template v-slot:item.WASP_SAMPLE_VOLUME_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_SAMPLE_VOLUME_MASTER_NAME_ENG | shorten(30) }}
            </template>

            <template v-slot:item.WASP_CONTAINER_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_CONTAINER_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_PIPETTE_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_PIPETTE_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_DISPOSABLE_PIPETTE_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_DISPOSABLE_PIPETTE_MASTER_NAME_ENG | shorten(30) }}
            </template>

            <template v-slot:item.WASP_TIP_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_TIP_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_FILTER_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_FILTER_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_CAP_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_CAP_MASTER_NAME_ENG | shorten(30) }}
            </template>


            <template v-slot:item.WASP_TRAY_MASTER_NAME_ENG="{ item }">
              {{ item.WASP_TRAY_MASTER_NAME_ENG | shorten(30) }}
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
    LabelStandardGroups: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

      printGroup: {},
      headers: [
        { text: 'Instructed Date', value: 'INSDATE' },        
        { text: 'Job', value: 'JOB' },        
        { text: 'Sample', value: 'SAMPNUM' },        
        { text: 'Label Group', value: 'WASP_LABEL_GROUP_NAME_ENG' },        
        { text: 'sample volume (ml)', value: 'WASP_SAMPLE_VOLUME_MASTER_NAME_ENG' },                        
        { text: 'Container', value: 'WASP_CONTAINER_MASTER_NAME_ENG' },                        
        { text: 'Pipette tools', value: 'WASP_PIPETTE_MASTER_NAME_ENG' },                
        { text: 'Disposable pipette', value: 'WASP_DISPOSABLE_PIPETTE_MASTER_NAME_ENG' },                
        { text: 'Tip', value: 'WASP_TIP_MASTER_NAME_ENG' },                        
        { text: 'Filter', value: 'WASP_FILTER_MASTER_NAME_ENG' },                        
        { text: 'Cap', value: 'WASP_CAP_MASTER_NAME_ENG' },                        
        { text: 'Tray', value: 'WASP_TRAY_MASTER_NAME_ENG' },                                
        
      ],



    };
  },
  computed: {

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
