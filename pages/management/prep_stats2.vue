<template>
  <v-row
    ><v-col
      ><v-card outlined
        ><v-card-title>Prep Stats (WIP)</v-card-title
        ><v-card-text
          ><v-row
            ><v-col md="4" sm="6" cols="12"
              ><v-card flat
                ><v-card-text
                  >Overall Preps<v-row
                    ><v-col
                      ><v-data-table
                        :loading="overallLoading"
                        :items="overall"
                        :headers="overallHeaders"
                        dense
                        ><template v-slot:item.result_date="{ item }">{{
                          $moment(item.result_date).format('DD/MM/YY')
                        }}</template
                        ><template v-slot:item.percentOnTime="{ item }">{{
                          parseFloat(item.percentOnTime).toFixed(2)
                        }}</template>
                        <template v-slot:item.view="{ item }"
                          ><v-btn
                            x-small
                            color="primary"
                            @click="getDaysPreps(item.result_date)"
                            >View</v-btn
                          ></template
                        ></v-data-table
                      ></v-col
                    ></v-row
                  ></v-card-text
                ></v-card
              ></v-col
            ><v-col md="6" cols="12"
              ><v-card flat
                ><v-card-text
                  ><v-row
                    ><v-col
                      >Selected Date:
                      {{ daysPrepsDate ? daysPrepsDate : 'No Date Selected'
                      }}<v-data-table
                        disable-pagination
                        hide-default-footer
                        :loading="daysPrepsLoading"
                        :items="daysPreps"
                        :headers="daysPrepsHeaders"
                        dense
                        ><template v-slot:item.det_name="{ item }"
                          >{{ item.det_name }} ({{
                            item.prep_complete_days
                          }})</template
                        ><template v-slot:item.percentOnTime="{ item }">{{
                          parseFloat(item.percentOnTime).toFixed(2)
                        }}</template></v-data-table
                      ></v-col
                    ></v-row
                  >
                </v-card-text></v-card
              ></v-col
            ></v-row
          ></v-card-text
        ></v-card
      ></v-col
    ></v-row
  >
</template>

<script>
export default {
  data() {
    return {
      overallLoading: false,
      overallHeaders: [
        {
          text: 'Result Date',
          value: 'result_date',
        },
        {
          text: 'Preps Complete',
          value: 'prepCount',
        },
        {
          text: 'Preps On Time',
          value: 'onTime',
        },
        {
          text: '% On Time',
          value: 'percentOnTime',
        },
        {
          text: 'View',
          value: 'view',
        },
      ],
      overall: [],
      daysPrepsDate: '',
      daysPrepsLoading: false,
      daysPrepsHeaders: [
        {
          text: 'Det Name (days)',
          value: 'det_name',
        },
        {
          text: 'Det ID',
          value: 'det_id',
        },
        {
          text: 'Samples Prepped',
          value: 'sampleCount',
        },
        {
          text: 'On Time',
          value: 'onTime',
        },
        {
          text: '% On Time',
          value: 'percentOnTime',
        },
      ],
      daysPreps: [],
    };
  },
  mounted() {
    this.getOverallData();
  },
  methods: {
    getOverallData() {
      this.overallLoading = true;
      this.$axios.get('stats/dw-prep-overall').then((response) => {
        this.overall = response.data.data;
        this.overallLoading = false;
      });
    },
    getDaysPreps(date) {
      this.daysPreps = [];
      this.daysPrepsDate = date;
      this.daysPrepsLoading = true;
      this.$axios.get('stats/dw-prep-by-date?date=' + date).then((response) => {
        this.daysPreps = response.data.data;
        this.daysPrepsLoading = false;
      });
    },
  },
};
</script>

<style></style>
