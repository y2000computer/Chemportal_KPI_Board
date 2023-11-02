<template>
  <v-row>
    <v-col>
      <v-row align="center">
        <v-col class="font-weight-medium"
          >Late Job Report Without Subcon latest 6 months</v-col
        >
        <v-col>
          <div class="float-right">
            <v-btn icon>
              <v-icon>help</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>


      <v-row>
        <v-col>
          <v-card outlined>

            <v-card-text>
              <v-simple-table dense v-if="!loading" class="font-weight-medium">
                <thead>
                  <tr>
                    <th>Late</th>
                    <th colspan="2" class="text-center">{{this.data.late1day[0].calendar_month}}/{{this.data.late1day[0].calendar_year}} </th>
                    <th colspan="2" class="text-center">{{this.data.late1day[1].calendar_month}}/{{this.data.late1day[1].calendar_year}} </th>
                    <th colspan="2" class="text-center">{{this.data.late1day[2].calendar_month}}/{{this.data.late1day[2].calendar_year}} </th>
                    <th colspan="2" class="text-center">{{this.data.late1day[3].calendar_month}}/{{this.data.late1day[3].calendar_year}} </th>
                    <th colspan="2" class="text-center">{{this.data.late1day[4].calendar_month}}/{{this.data.late1day[4].calendar_year}} </th>
                    <th colspan="2" class="text-center">{{this.data.late1day[5].calendar_month}}/{{this.data.late1day[5].calendar_year}} </th>
                    <th colspan="2" class="text-center">{{this.data.late1day[6].calendar_month}}/{{this.data.late1day[6].calendar_year}} </th>
                  </tr>

                  <tr>
                    <th></th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                    <th class="text-right">Late TTL</th>
                    <th class="text-right">Late %</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Late 1 Day</td>
                    <td align="right">{{this.data.late1day[0].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[0].lateOneDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late1day[1].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[1].lateOneDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late1day[2].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[2].lateOneDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late1day[3].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[3].lateOneDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late1day[4].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[4].lateOneDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late1day[5].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[5].lateOneDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late1day[6].lateOneDayReportCount}}</td>
                    <td align="right">{{this.data.late1day[6].lateOneDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 2 Day</td>
                    <td align="right">{{this.data.late2day[0].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[0].lateTwoDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late2day[1].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[1].lateTwoDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late2day[2].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[2].lateTwoDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late2day[3].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[3].lateTwoDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late2day[4].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[4].lateTwoDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late2day[5].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[5].lateTwoDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late2day[6].lateTwoDayReportCount}}</td>
                    <td align="right">{{this.data.late2day[6].lateTwoDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 3 Day</td>
                    <td align="right">{{this.data.late3day[0].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[0].lateThreeDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late3day[1].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[1].lateThreeDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late3day[2].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[2].lateThreeDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late3day[3].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[3].lateThreeDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late3day[4].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[4].lateThreeDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late3day[5].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[5].lateThreeDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late3day[6].lateThreeDayReportCount}}</td>
                    <td align="right">{{this.data.late3day[6].lateThreeDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 4 Day</td>
                    <td align="right">{{this.data.late4day[0].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[0].lateFourDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late4day[1].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[1].lateFourDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late4day[2].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[2].lateFourDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late4day[3].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[3].lateFourDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late4day[4].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[4].lateFourDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late4day[5].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[5].lateFourDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late4day[6].lateFourDayReportCount}}</td>
                    <td align="right">{{this.data.late4day[6].lateFourDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 5 Day</td>
                    <td align="right">{{this.data.late5day[0].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[0].lateFiveDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late5day[1].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[1].lateFiveDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late5day[2].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[2].lateFiveDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late5day[3].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[3].lateFiveDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late5day[4].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[4].lateFiveDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late5day[5].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[5].lateFiveDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late5day[6].lateFiveDayReportCount}}</td>
                    <td align="right">{{this.data.late5day[6].lateFiveDayReportPercentage}}%</td>
                  </tr>


                  <tr>
                    <td>Late 6 Day</td>
                    <td align="right">{{this.data.late6day[0].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[0].lateSixDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late6day[1].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[1].lateSixDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late6day[2].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[2].lateSixDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late6day[3].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[3].lateSixDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late6day[4].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[4].lateSixDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late6day[5].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[5].lateSixDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late6day[6].lateSixDayReportCount}}</td>
                    <td align="right">{{this.data.late6day[6].lateSixDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 7 Day</td>
                    <td align="right">{{this.data.late7day[0].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[0].lateSevenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late7day[1].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[1].lateSevenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late7day[2].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[2].lateSevenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late7day[3].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[3].lateSevenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late7day[4].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[4].lateSevenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late7day[5].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[5].lateSevenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late7day[6].lateSevenDayReportCount}}</td>
                    <td align="right">{{this.data.late7day[6].lateSevenDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 8 Day</td>
                    <td align="right">{{this.data.late8day[0].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[0].lateEightDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late8day[1].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[1].lateEightDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late8day[2].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[2].lateEightDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late8day[3].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[3].lateEightDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late8day[4].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[4].lateEightDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late8day[5].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[5].lateEightDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late8day[6].lateEightDayReportCount}}</td>
                    <td align="right">{{this.data.late8day[6].lateEightDayReportPercentage}}%</td>
                  </tr>


                  <tr>
                    <td>Late 9 Day</td>
                    <td align="right">{{this.data.late9day[0].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[0].lateNineDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late9day[1].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[1].lateNineDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late9day[2].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[2].lateNineDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late9day[3].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[3].lateNineDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late9day[4].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[4].lateNineDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late9day[5].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[5].lateNineDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late9day[6].lateNineDayReportCount}}</td>
                    <td align="right">{{this.data.late9day[6].lateNineDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late 10 Day</td>
                    <td align="right">{{this.data.late10day[0].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[0].lateTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late10day[1].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[1].lateTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late10day[2].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[2].lateTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late10day[3].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[3].lateTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late10day[4].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[4].lateTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late10day[5].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[5].lateTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.late10day[6].lateTenDayReportCount}}</td>
                    <td align="right">{{this.data.late10day[6].lateTenDayReportPercentage}}%</td>
                  </tr>

                  <tr>
                    <td>Late Over 10 Day</td>
                    <td align="right">{{this.data.lateover10day[0].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[0].lateOverTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.lateover10day[1].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[1].lateOverTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.lateover10day[2].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[2].lateOverTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.lateover10day[3].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[3].lateOverTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.lateover10day[4].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[4].lateOverTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.lateover10day[5].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[5].lateOverTenDayReportPercentage}}%</td>
                    <td align="right">{{this.data.lateover10day[6].lateOverTenDayReportCount}}</td>
                    <td align="right">{{this.data.lateover10day[6].lateOverTenDayReportPercentage}}%</td>
                  </tr>


                  <tr>
                    <td align="right"> Monthly Total:</td>
                    <td align="right">{{this.data.latetotal[0].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[0].lateTotalReportPercentage}}%</td>
                    <td align="right">{{this.data.latetotal[1].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[1].lateTotalReportPercentage}}%</td>
                    <td align="right">{{this.data.latetotal[2].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[2].lateTotalReportPercentage}}%</td>
                    <td align="right">{{this.data.latetotal[3].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[3].lateTotalReportPercentage}}%</td>
                    <td align="right">{{this.data.latetotal[4].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[4].lateTotalReportPercentage}}%</td>
                    <td align="right">{{this.data.latetotal[5].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[5].lateTotalReportPercentage}}%</td>
                    <td align="right">{{this.data.latetotal[6].lateTotalReportCount}}</td>
                    <td align="right">{{this.data.latetotal[6].lateTotalReportPercentage}}%</td>
                  </tr>


                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>

    </v-col>
  </v-row>
</template>

<script>
import mainStatCard from "./components/mainStatCard";
export default {
  components: { mainStatCard },
  data() {
    return {
      loading: true,
      data: [],
    };
  },
  computed: {
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios.get("stats/dw-late-job-with-subcon-month-counts").then((response) => {
        this.data = response.data.data;
        this.loading = false;
        //console.log('data.late2day[0].lateOneDayReportCount =' + this.data.late2day[0].lateOneDayReportCount )
      });
    },
  },
};
</script>

<style></style>

