<template>
  <v-row>
    <v-col>


        <v-row>



        <v-row justify="space-between">
            <v-col md="18" cols="12">

                <v-toolbar-title class="font-weight-medium"
                  >Late Job Report Without Subcon latest 6 months (Current Year)</v-toolbar-title>

              <v-card outlined>


                <v-simple-table dense v-if="!loading" class="font-weight-medium">
                  <thead>
                    <tr>
                      <th>Late Day</th>
                      <th colspan="2" class="text-center">{{this.data.late1day[0].calendar_month}}/{{this.data.late1day[0].calendar_year}} </th>
                      <th bgcolor="#FFEEC9" colspan="2" class="text-center">{{this.data.late1day[1].calendar_month}}/{{this.data.late1day[1].calendar_year}} </th>
                      <th colspan="2" class="text-center">{{this.data.late1day[2].calendar_month}}/{{this.data.late1day[2].calendar_year}} </th>
                      <th bgcolor="#FFEEC9" colspan="2" class="text-center">{{this.data.late1day[3].calendar_month}}/{{this.data.late1day[3].calendar_year}} </th>
                      <th colspan="2" class="text-center">{{this.data.late1day[4].calendar_month}}/{{this.data.late1day[4].calendar_year}} </th>
                      <th bgcolor="#FFEEC9" colspan="2" class="text-center">{{this.data.late1day[5].calendar_month}}/{{this.data.late1day[5].calendar_year}} </th>
                    </tr>

                    <tr>
                      <th></th>
                      <th class="text-right">Late TTL</th>
                      <th class="text-right">Late %</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late TTL</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late %</th>
                      <th class="text-right">Late TTL</th>
                      <th class="text-right">Late %</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late TTL</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late %</th>
                      <th class="text-right">Late TTL</th>
                      <th class="text-right">Late %</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late TTL</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late %</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Late 1 Day</td>
                      <td align="right">{{this.data.late1day[0].lateOneDayReportCount}}</td>
                      <td align="right">{{this.data.late1day[0].lateOneDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late1day[1].lateOneDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late1day[1].lateOneDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late1day[2].lateOneDayReportCount}}</td>
                      <td align="right">{{this.data.late1day[2].lateOneDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late1day[3].lateOneDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late1day[3].lateOneDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late1day[4].lateOneDayReportCount}}</td>
                      <td align="right">{{this.data.late1day[4].lateOneDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late1day[5].lateOneDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late1day[5].lateOneDayReportPercentage}}%</td>
                      

                    </tr>

                    <tr>
                      <td>Late 2 Day</td>
                      <td align="right">{{this.data.late2day[0].lateTwoDayReportCount}}</td>
                      <td align="right">{{this.data.late2day[0].lateTwoDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late2day[1].lateTwoDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late2day[1].lateTwoDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late2day[2].lateTwoDayReportCount}}</td>
                      <td align="right">{{this.data.late2day[2].lateTwoDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late2day[3].lateTwoDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late2day[3].lateTwoDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late2day[4].lateTwoDayReportCount}}</td>
                      <td align="right">{{this.data.late2day[4].lateTwoDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late2day[5].lateTwoDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late2day[5].lateTwoDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 3 Day</td>
                      <td align="right">{{this.data.late3day[0].lateThreeDayReportCount}}</td>
                      <td align="right">{{this.data.late3day[0].lateThreeDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late3day[1].lateThreeDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late3day[1].lateThreeDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late3day[2].lateThreeDayReportCount}}</td>
                      <td align="right">{{this.data.late3day[2].lateThreeDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late3day[3].lateThreeDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late3day[3].lateThreeDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late3day[4].lateThreeDayReportCount}}</td>
                      <td align="right">{{this.data.late3day[4].lateThreeDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late3day[5].lateThreeDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late3day[5].lateThreeDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 4 Day</td>
                      <td align="right">{{this.data.late4day[0].lateFourDayReportCount}}</td>
                      <td align="right">{{this.data.late4day[0].lateFourDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late4day[1].lateFourDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late4day[1].lateFourDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late4day[2].lateFourDayReportCount}}</td>
                      <td align="right">{{this.data.late4day[2].lateFourDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late4day[3].lateFourDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late4day[3].lateFourDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late4day[4].lateFourDayReportCount}}</td>
                      <td align="right">{{this.data.late4day[4].lateFourDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late4day[5].lateFourDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late4day[5].lateFourDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 5 Day</td>
                      <td align="right">{{this.data.late5day[0].lateFiveDayReportCount}}</td>
                      <td align="right">{{this.data.late5day[0].lateFiveDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late5day[1].lateFiveDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late5day[1].lateFiveDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late5day[2].lateFiveDayReportCount}}</td>
                      <td align="right">{{this.data.late5day[2].lateFiveDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late5day[3].lateFiveDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late5day[3].lateFiveDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late5day[4].lateFiveDayReportCount}}</td>
                      <td align="right">{{this.data.late5day[4].lateFiveDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late5day[5].lateFiveDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late5day[5].lateFiveDayReportPercentage}}%</td>
                    </tr>


                    <tr>
                      <td>Late 6 Day</td>
                      <td align="right">{{this.data.late6day[0].lateSixDayReportCount}}</td>
                      <td align="right">{{this.data.late6day[0].lateSixDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late6day[1].lateSixDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late6day[1].lateSixDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late6day[2].lateSixDayReportCount}}</td>
                      <td align="right">{{this.data.late6day[2].lateSixDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late6day[3].lateSixDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late6day[3].lateSixDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late6day[4].lateSixDayReportCount}}</td>
                      <td align="right">{{this.data.late6day[4].lateSixDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late6day[5].lateSixDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late6day[5].lateSixDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 7 Day</td>
                      <td align="right">{{this.data.late7day[0].lateSevenDayReportCount}}</td>
                      <td align="right">{{this.data.late7day[0].lateSevenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late7day[1].lateSevenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late7day[1].lateSevenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late7day[2].lateSevenDayReportCount}}</td>
                      <td align="right">{{this.data.late7day[2].lateSevenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late7day[3].lateSevenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late7day[3].lateSevenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late7day[4].lateSevenDayReportCount}}</td>
                      <td align="right">{{this.data.late7day[4].lateSevenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late7day[5].lateSevenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late7day[5].lateSevenDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 8 Day</td>
                      <td align="right">{{this.data.late8day[0].lateEightDayReportCount}}</td>
                      <td align="right">{{this.data.late8day[0].lateEightDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late8day[1].lateEightDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late8day[1].lateEightDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late8day[2].lateEightDayReportCount}}</td>
                      <td align="right">{{this.data.late8day[2].lateEightDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late8day[3].lateEightDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late8day[3].lateEightDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late8day[4].lateEightDayReportCount}}</td>
                      <td align="right">{{this.data.late8day[4].lateEightDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late8day[5].lateEightDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late8day[5].lateEightDayReportPercentage}}%</td>
                    </tr>


                    <tr>
                      <td>Late 9 Day</td>
                      <td align="right">{{this.data.late9day[0].lateNineDayReportCount}}</td>
                      <td align="right">{{this.data.late9day[0].lateNineDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late9day[1].lateNineDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late9day[1].lateNineDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late9day[2].lateNineDayReportCount}}</td>
                      <td align="right">{{this.data.late9day[2].lateNineDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late9day[3].lateNineDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late9day[3].lateNineDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late9day[4].lateNineDayReportCount}}</td>
                      <td align="right">{{this.data.late9day[4].lateNineDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late9day[5].lateNineDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late9day[5].lateNineDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 10 Day</td>
                      <td align="right">{{this.data.late10day[0].lateTenDayReportCount}}</td>
                      <td align="right">{{this.data.late10day[0].lateTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late10day[1].lateTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late10day[1].lateTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late10day[2].lateTenDayReportCount}}</td>
                      <td align="right">{{this.data.late10day[2].lateTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late10day[3].lateTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late10day[3].lateTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.late10day[4].lateTenDayReportCount}}</td>
                      <td align="right">{{this.data.late10day[4].lateTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late10day[5].lateTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.late10day[5].lateTenDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late Over 10 Day</td>
                      <td align="right">{{this.data.lateover10day[0].lateOverTenDayReportCount}}</td>
                      <td align="right">{{this.data.lateover10day[0].lateOverTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.lateover10day[1].lateOverTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.lateover10day[1].lateOverTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.lateover10day[2].lateOverTenDayReportCount}}</td>
                      <td align="right">{{this.data.lateover10day[2].lateOverTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.lateover10day[3].lateOverTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.lateover10day[3].lateOverTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.lateover10day[4].lateOverTenDayReportCount}}</td>
                      <td align="right">{{this.data.lateover10day[4].lateOverTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.lateover10day[5].lateOverTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.lateover10day[5].lateOverTenDayReportPercentage}}%</td>
                    </tr>


                    <tr>
                      <td align="right"> Monthly Total:</td>
                      <td align="right">{{this.data.latetotal[0].lateTotalReportCount}}</td>
                      <td align="right">{{this.data.latetotal[0].lateTotalReportPercentage}}%</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.latetotal[1].lateTotalReportCount}}</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.latetotal[1].lateTotalReportPercentage}}%</td>
                      <td align="right">{{this.data.latetotal[2].lateTotalReportCount}}</td>
                      <td align="right">{{this.data.latetotal[2].lateTotalReportPercentage}}%</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.latetotal[3].lateTotalReportCount}}</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.latetotal[3].lateTotalReportPercentage}}%</td>
                      <td align="right">{{this.data.latetotal[4].lateTotalReportCount}}</td>
                      <td align="right">{{this.data.latetotal[4].lateTotalReportPercentage}}%</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.latetotal[5].lateTotalReportCount}}</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.latetotal[5].lateTotalReportPercentage}}%</td>
                    </tr>


                  </tbody>
                </v-simple-table>


              </v-card>
            </v-col>
          </v-row>






        <v-row justify="space-between">
            <v-col md="18" cols="12">

                <v-toolbar-title class="font-weight-medium"
                  >Late Job Report Without Subcon latest 6 months (Previous Year)</v-toolbar-title>

              <v-card outlined>


                <v-simple-table dense v-if="!loading" class="font-weight-medium">
                  <thead>
                    <tr>
                      <th>Late Day</th>
                      <th colspan="2" class="text-center">{{this.data.preyearlate1day[0].calendar_month}}/{{this.data.preyearlate1day[0].calendar_year}} </th>
                      <th bgcolor="#FFEEC9" colspan="2" class="text-center">{{this.data.preyearlate1day[1].calendar_month}}/{{this.data.preyearlate1day[1].calendar_year}} </th>
                      <th colspan="2" class="text-center">{{this.data.preyearlate1day[2].calendar_month}}/{{this.data.preyearlate1day[2].calendar_year}} </th>
                      <th bgcolor="#FFEEC9" colspan="2" class="text-center">{{this.data.preyearlate1day[3].calendar_month}}/{{this.data.preyearlate1day[3].calendar_year}} </th>
                      <th colspan="2" class="text-center">{{this.data.preyearlate1day[4].calendar_month}}/{{this.data.preyearlate1day[4].calendar_year}} </th>
                      <th bgcolor="#FFEEC9" colspan="2" class="text-center">{{this.data.preyearlate1day[5].calendar_month}}/{{this.data.preyearlate1day[5].calendar_year}} </th>
                    </tr>

                    <tr>
                      <th></th>
                      <th class="text-right">Late TTL</th>
                      <th class="text-right">Late %</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late TTL</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late %</th>
                      <th class="text-right">Late TTL</th>
                      <th class="text-right">Late %</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late TTL</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late %</th>
                      <th class="text-right">Late TTL</th>
                      <th class="text-right">Late %</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late TTL</th>
                      <th bgcolor="#FFEEC9" class="text-right">Late %</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Late 1 Day</td>
                      <td align="right">{{this.data.preyearlate1day[0].lateOneDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate1day[0].lateOneDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate1day[1].lateOneDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate1day[1].lateOneDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate1day[2].lateOneDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate1day[2].lateOneDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate1day[3].lateOneDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate1day[3].lateOneDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate1day[4].lateOneDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate1day[4].lateOneDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate1day[5].lateOneDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate1day[5].lateOneDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 2 Day</td>
                      <td align="right">{{this.data.preyearlate2day[0].lateTwoDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate2day[0].lateTwoDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate2day[1].lateTwoDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate2day[1].lateTwoDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate2day[2].lateTwoDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate2day[2].lateTwoDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate2day[3].lateTwoDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate2day[3].lateTwoDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate2day[4].lateTwoDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate2day[4].lateTwoDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate2day[5].lateTwoDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate2day[5].lateTwoDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 3 Day</td>
                      <td align="right">{{this.data.preyearlate3day[0].lateThreeDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate3day[0].lateThreeDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate3day[1].lateThreeDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate3day[1].lateThreeDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate3day[2].lateThreeDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate3day[2].lateThreeDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate3day[3].lateThreeDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate3day[3].lateThreeDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate3day[4].lateThreeDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate3day[4].lateThreeDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate3day[5].lateThreeDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate3day[5].lateThreeDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 4 Day</td>
                      <td align="right">{{this.data.preyearlate4day[0].lateFourDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate4day[0].lateFourDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate4day[1].lateFourDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate4day[1].lateFourDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate4day[2].lateFourDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate4day[2].lateFourDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate4day[3].lateFourDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate4day[3].lateFourDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate4day[4].lateFourDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate4day[4].lateFourDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate4day[5].lateFourDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate4day[5].lateFourDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 5 Day</td>
                      <td align="right">{{this.data.preyearlate5day[0].lateFiveDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate5day[0].lateFiveDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate5day[1].lateFiveDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate5day[1].lateFiveDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate5day[2].lateFiveDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate5day[2].lateFiveDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate5day[3].lateFiveDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate5day[3].lateFiveDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate5day[4].lateFiveDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate5day[4].lateFiveDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate5day[5].lateFiveDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate5day[5].lateFiveDayReportPercentage}}%</td>
                    </tr>


                    <tr>
                      <td>Late 6 Day</td>
                      <td align="right">{{this.data.preyearlate6day[0].lateSixDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate6day[0].lateSixDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate6day[1].lateSixDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate6day[1].lateSixDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate6day[2].lateSixDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate6day[2].lateSixDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate6day[3].lateSixDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate6day[3].lateSixDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate6day[4].lateSixDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate6day[4].lateSixDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate6day[5].lateSixDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate6day[5].lateSixDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 7 Day</td>
                      <td align="right">{{this.data.preyearlate7day[0].lateSevenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate7day[0].lateSevenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate7day[1].lateSevenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate7day[1].lateSevenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate7day[2].lateSevenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate7day[2].lateSevenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate7day[3].lateSevenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate7day[3].lateSevenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate7day[4].lateSevenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate7day[4].lateSevenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate7day[5].lateSevenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate7day[5].lateSevenDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 8 Day</td>
                      <td align="right">{{this.data.preyearlate8day[0].lateEightDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate8day[0].lateEightDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate8day[1].lateEightDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate8day[1].lateEightDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate8day[2].lateEightDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate8day[2].lateEightDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate8day[3].lateEightDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate8day[3].lateEightDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate8day[4].lateEightDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate8day[4].lateEightDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate8day[5].lateEightDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate8day[5].lateEightDayReportPercentage}}%</td>
                    </tr>


                    <tr>
                      <td>Late 9 Day</td>
                      <td align="right">{{this.data.preyearlate9day[0].lateNineDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate9day[0].lateNineDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate9day[1].lateNineDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate9day[1].lateNineDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate9day[2].lateNineDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate9day[2].lateNineDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate9day[3].lateNineDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate9day[3].lateNineDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate9day[4].lateNineDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate9day[4].lateNineDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate9day[5].lateNineDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate9day[5].lateNineDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late 10 Day</td>
                      <td align="right">{{this.data.preyearlate10day[0].lateTenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate10day[0].lateTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate10day[1].lateTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate10day[1].lateTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate10day[2].lateTenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate10day[2].lateTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate10day[3].lateTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate10day[3].lateTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlate10day[4].lateTenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlate10day[4].lateTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate10day[5].lateTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlate10day[5].lateTenDayReportPercentage}}%</td>
                    </tr>

                    <tr>
                      <td>Late Over 10 Day</td>
                      <td align="right">{{this.data.preyearlateover10day[0].lateOverTenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlateover10day[0].lateOverTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlateover10day[1].lateOverTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlateover10day[1].lateOverTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlateover10day[2].lateOverTenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlateover10day[2].lateOverTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlateover10day[3].lateOverTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlateover10day[3].lateOverTenDayReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlateover10day[4].lateOverTenDayReportCount}}</td>
                      <td align="right">{{this.data.preyearlateover10day[4].lateOverTenDayReportPercentage}}%</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlateover10day[5].lateOverTenDayReportCount}}</td>
                      <td bgcolor="#FFEEC9" align="right">{{this.data.preyearlateover10day[5].lateOverTenDayReportPercentage}}%</td>
                    </tr>


                    <tr>
                      <td align="right"> Monthly Total:</td>
                      <td align="right">{{this.data.preyearlatetotal[0].lateTotalReportCount}}</td>
                      <td align="right">{{this.data.preyearlatetotal[0].lateTotalReportPercentage}}%</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.preyearlatetotal[1].lateTotalReportCount}}</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.preyearlatetotal[1].lateTotalReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlatetotal[2].lateTotalReportCount}}</td>
                      <td align="right">{{this.data.preyearlatetotal[2].lateTotalReportPercentage}}%</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.preyearlatetotal[3].lateTotalReportCount}}</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.preyearlatetotal[3].lateTotalReportPercentage}}%</td>
                      <td align="right">{{this.data.preyearlatetotal[4].lateTotalReportCount}}</td>
                      <td align="right">{{this.data.preyearlatetotal[4].lateTotalReportPercentage}}%</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.preyearlatetotal[5].lateTotalReportCount}}</td>
                      <td bgcolor="#F7DFAC" align="right">{{this.data.preyearlatetotal[5].lateTotalReportPercentage}}%</td>
                    </tr>


                  </tbody>
                </v-simple-table>



              </v-card>
            </v-col>
          </v-row>






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
      late1dayTotalCount: 0,
      late2dayTotalCount: 0,
      late3dayTotalCount: 0,
      late4dayTotalCount: 0,
      late5dayTotalCount: 0,
      late6dayTotalCount: 0,
      late7dayTotalCount: 0,
      late8dayTotalCount: 0,
      late9dayTotalCount: 0,
      late10dayTotalCount: 0,
      lateover10dayTotalCount: 0,
      lateTotalCount: 0,


      preyearlate1dayTotalCount: 0,
      preyearlate2dayTotalCount: 0,
      preyearlate3dayTotalCount: 0,
      preyearlate4dayTotalCount: 0,
      preyearlate5dayTotalCount: 0,
      preyearlate6dayTotalCount: 0,
      preyearlate7dayTotalCount: 0,
      preyearlate8dayTotalCount: 0,
      preyearlate9dayTotalCount: 0,
      preyearlate10dayTotalCount: 0,
      preyearlateover10dayTotalCount: 0,
      preyearlateTotalCount: 0,


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

        
        console.log('data.late1day[0].calendar_month =' + this.data.late1day[0].calendar_month )
        console.log('data.late1day[0].lateOneDayReportCount =' + this.data.late1day[0].lateOneDayReportCount )
       
        this.late1dayTotalCount = Number(this.data.late1day[0].lateOneDayReportCount)
                                 + Number(this.data.late1day[1].lateOneDayReportCount)
                                 + Number(this.data.late1day[2].lateOneDayReportCount)
                                 + Number(this.data.late1day[3].lateOneDayReportCount)
                                 + Number(this.data.late1day[4].lateOneDayReportCount)
                                 + Number(this.data.late1day[5].lateOneDayReportCount)
                                 

       console.log('this.late1dayTotalCount =' + this.late1dayTotalCount )                                 


        this.late2dayTotalCount = Number(this.data.late2day[0].lateTwoDayReportCount)
                                 + Number(this.data.late2day[1].lateTwoDayReportCount)
                                 + Number(this.data.late2day[2].lateTwoDayReportCount)
                                 + Number(this.data.late2day[3].lateTwoDayReportCount)
                                 + Number(this.data.late2day[4].lateTwoDayReportCount)
                                 + Number(this.data.late2day[5].lateTwoDayReportCount)
                                 

       console.log('this.late2dayTotalCount =' + this.late2dayTotalCount )                                 


        this.late3dayTotalCount = Number(this.data.late3day[0].lateThreeDayReportCount)
                                 + Number(this.data.late3day[1].lateThreeDayReportCount)
                                 + Number(this.data.late3day[2].lateThreeDayReportCount)
                                 + Number(this.data.late3day[3].lateThreeDayReportCount)
                                 + Number(this.data.late3day[4].lateThreeDayReportCount)
                                 + Number(this.data.late3day[5].lateThreeDayReportCount)
                                

       console.log('this.late3dayTotalCount =' + this.late3dayTotalCount )                                 


        this.late4dayTotalCount = Number(this.data.late4day[0].lateFourDayReportCount)
                                 + Number(this.data.late4day[1].lateFourDayReportCount)
                                 + Number(this.data.late4day[2].lateFourDayReportCount)
                                 + Number(this.data.late4day[3].lateFourDayReportCount)
                                 + Number(this.data.late4day[4].lateFourDayReportCount)
                                 + Number(this.data.late4day[5].lateFourDayReportCount)
                                 

       console.log('this.late4dayTotalCount =' + this.late4dayTotalCount )                                 


        this.late5dayTotalCount = Number(this.data.late5day[0].lateFiveDayReportCount)
                                 + Number(this.data.late5day[1].lateFiveDayReportCount)
                                 + Number(this.data.late5day[2].lateFiveDayReportCount)
                                 + Number(this.data.late5day[3].lateFiveDayReportCount)
                                 + Number(this.data.late5day[4].lateFiveDayReportCount)
                                 + Number(this.data.late5day[5].lateFiveDayReportCount)
                                 

       console.log('this.late5dayTotalCount =' + this.late5dayTotalCount )                                 


        this.late6dayTotalCount = Number(this.data.late6day[0].lateSixDayReportCount)
                                 + Number(this.data.late6day[1].lateSixDayReportCount)
                                 + Number(this.data.late6day[2].lateSixDayReportCount)
                                 + Number(this.data.late6day[3].lateSixDayReportCount)
                                 + Number(this.data.late6day[4].lateSixDayReportCount)
                                 + Number(this.data.late6day[5].lateSixDayReportCount)
                                 

       console.log('this.late6dayTotalCount =' + this.late6dayTotalCount )                                 


        this.late7dayTotalCount = Number(this.data.late7day[0].lateSevenDayReportCount)
                                 + Number(this.data.late7day[1].lateSevenDayReportCount)
                                 + Number(this.data.late7day[2].lateSevenDayReportCount)
                                 + Number(this.data.late7day[3].lateSevenDayReportCount)
                                 + Number(this.data.late7day[4].lateSevenDayReportCount)
                                 + Number(this.data.late7day[5].lateSevenDayReportCount)
                                 

       console.log('this.late7dayTotalCount =' + this.late7dayTotalCount )                                 


        this.late8dayTotalCount = Number(this.data.late8day[0].lateEightDayReportCount)
                                 + Number(this.data.late8day[1].lateEightDayReportCount)
                                 + Number(this.data.late8day[2].lateEightDayReportCount)
                                 + Number(this.data.late8day[3].lateEightDayReportCount)
                                 + Number(this.data.late8day[4].lateEightDayReportCount)
                                 + Number(this.data.late8day[5].lateEightDayReportCount)
                                 

       console.log('this.late8dayTotalCount =' + this.late8dayTotalCount )                                 


        this.late9dayTotalCount = Number(this.data.late9day[0].lateNineDayReportCount)
                                 + Number(this.data.late9day[1].lateNineDayReportCount)
                                 + Number(this.data.late9day[2].lateNineDayReportCount)
                                 + Number(this.data.late9day[3].lateNineDayReportCount)
                                 + Number(this.data.late9day[4].lateNineDayReportCount)
                                 + Number(this.data.late9day[5].lateNineDayReportCount)
                                 

       console.log('this.late9dayTotalCount =' + this.late9dayTotalCount )                                 



        this.late10dayTotalCount = Number(this.data.late10day[0].lateTenDayReportCount)
                                 + Number(this.data.late10day[1].lateTenDayReportCount)
                                 + Number(this.data.late10day[2].lateTenDayReportCount)
                                 + Number(this.data.late10day[3].lateTenDayReportCount)
                                 + Number(this.data.late10day[4].lateTenDayReportCount)
                                 + Number(this.data.late10day[5].lateTenDayReportCount)
                                 

       console.log('this.late10dayTotalCount =' + this.late10dayTotalCount )                                 


        this.lateover10dayTotalCount = Number(this.data.lateover10day[0].lateOverTenDayReportCount)
                                 + Number(this.data.lateover10day[1].lateOverTenDayReportCount)
                                 + Number(this.data.lateover10day[2].lateOverTenDayReportCount)
                                 + Number(this.data.lateover10day[3].lateOverTenDayReportCount)
                                 + Number(this.data.lateover10day[4].lateOverTenDayReportCount)
                                 + Number(this.data.lateover10day[5].lateOverTenDayReportCount)
                                 

       console.log('this.lateover10dayTotalCount =' + this.lateover10dayTotalCount )                                 


        this.lateTotalCount = this.late1dayTotalCount
                              + this.late2dayTotalCount
                              + this.late3dayTotalCount
                              + this.late4dayTotalCount
                              + this.late5dayTotalCount
                              + this.late6dayTotalCount
                              + this.late7dayTotalCount
                              + this.late8dayTotalCount
                              + this.late9dayTotalCount
                              + this.late10dayTotalCount
                              + this.lateover10dayTotalCount

       console.log('this.lateTotalCount =' + this.lateTotalCount )                                 


      //Previous Year

        this.preyearlate1dayTotalCount = Number(this.data.preyearlate1day[0].lateOneDayReportCount)
                                 + Number(this.data.preyearlate1day[1].lateOneDayReportCount)
                                 + Number(this.data.preyearlate1day[2].lateOneDayReportCount)
                                 + Number(this.data.preyearlate1day[3].lateOneDayReportCount)
                                 + Number(this.data.preyearlate1day[4].lateOneDayReportCount)
                                 + Number(this.data.preyearlate1day[5].lateOneDayReportCount)
                                 

       console.log('this.preyearlate1dayTotalCount =' + this.preyearlate1dayTotalCount )                                 


        this.preyearlate2dayTotalCount = Number(this.data.preyearlate2day[0].lateTwoDayReportCount)
                                 + Number(this.data.preyearlate2day[1].lateTwoDayReportCount)
                                 + Number(this.data.preyearlate2day[2].lateTwoDayReportCount)
                                 + Number(this.data.preyearlate2day[3].lateTwoDayReportCount)
                                 + Number(this.data.preyearlate2day[4].lateTwoDayReportCount)
                                 + Number(this.data.preyearlate2day[5].lateTwoDayReportCount)
                                 

       console.log('this.preyearlate2dayTotalCount =' + this.preyearlate2dayTotalCount )                                 


        this.preyearlate3dayTotalCount = Number(this.data.preyearlate3day[0].lateThreeDayReportCount)
                                 + Number(this.data.preyearlate3day[1].lateThreeDayReportCount)
                                 + Number(this.data.preyearlate3day[2].lateThreeDayReportCount)
                                 + Number(this.data.preyearlate3day[3].lateThreeDayReportCount)
                                 + Number(this.data.preyearlate3day[4].lateThreeDayReportCount)
                                 + Number(this.data.preyearlate3day[5].lateThreeDayReportCount)
                                 

       console.log('this.preyearlate3dayTotalCount =' + this.preyearlate3dayTotalCount )                                 



        this.preyearlate4dayTotalCount = Number(this.data.preyearlate4day[0].lateFourDayReportCount)
                                 + Number(this.data.preyearlate4day[1].lateFourDayReportCount)
                                 + Number(this.data.preyearlate4day[2].lateFourDayReportCount)
                                 + Number(this.data.preyearlate4day[3].lateFourDayReportCount)
                                 + Number(this.data.preyearlate4day[4].lateFourDayReportCount)
                                 + Number(this.data.preyearlate4day[5].lateFourDayReportCount)
                                 

       console.log('this.preyearlate4dayTotalCount =' + this.preyearlate4dayTotalCount )                                 


        this.preyearlate5dayTotalCount = Number(this.data.preyearlate5day[0].lateFiveDayReportCount)
                                 + Number(this.data.preyearlate5day[1].lateFiveDayReportCount)
                                 + Number(this.data.preyearlate5day[2].lateFiveDayReportCount)
                                 + Number(this.data.preyearlate5day[3].lateFiveDayReportCount)
                                 + Number(this.data.preyearlate5day[4].lateFiveDayReportCount)
                                 + Number(this.data.preyearlate5day[5].lateFiveDayReportCount)
                                 

       console.log('this.preyearlate5dayTotalCount =' + this.preyearlate5dayTotalCount )                                 


        this.preyearlate6dayTotalCount = Number(this.data.preyearlate6day[0].lateSixDayReportCount)
                                 + Number(this.data.preyearlate6day[1].lateSixDayReportCount)
                                 + Number(this.data.preyearlate6day[2].lateSixDayReportCount)
                                 + Number(this.data.preyearlate6day[3].lateSixDayReportCount)
                                 + Number(this.data.preyearlate6day[4].lateSixDayReportCount)
                                 + Number(this.data.preyearlate6day[5].lateSixDayReportCount)
                                 

       console.log('this.preyearlate6dayTotalCount =' + this.preyearlate6dayTotalCount )                                 


        this.preyearlate7dayTotalCount = Number(this.data.preyearlate7day[0].lateSevenDayReportCount)
                                 + Number(this.data.preyearlate7day[1].lateSevenDayReportCount)
                                 + Number(this.data.preyearlate7day[2].lateSevenDayReportCount)
                                 + Number(this.data.preyearlate7day[3].lateSevenDayReportCount)
                                 + Number(this.data.preyearlate7day[4].lateSevenDayReportCount)
                                 + Number(this.data.preyearlate7day[5].lateSevenDayReportCount)
                                 

       console.log('this.preyearlate7dayTotalCount =' + this.preyearlate7dayTotalCount )                                 


        this.preyearlate8dayTotalCount = Number(this.data.preyearlate8day[0].lateEightDayReportCount)
                                 + Number(this.data.preyearlate8day[1].lateEightDayReportCount)
                                 + Number(this.data.preyearlate8day[2].lateEightDayReportCount)
                                 + Number(this.data.preyearlate8day[3].lateEightDayReportCount)
                                 + Number(this.data.preyearlate8day[4].lateEightDayReportCount)
                                 + Number(this.data.preyearlate8day[5].lateEightDayReportCount)
                                 

       console.log('this.preyearlate8dayTotalCount =' + this.preyearlate8dayTotalCount )                                 


        this.preyearlate9dayTotalCount = Number(this.data.preyearlate9day[0].lateNineDayReportCount)
                                 + Number(this.data.preyearlate9day[1].lateNineDayReportCount)
                                 + Number(this.data.preyearlate9day[2].lateNineDayReportCount)
                                 + Number(this.data.preyearlate9day[3].lateNineDayReportCount)
                                 + Number(this.data.preyearlate9day[4].lateNineDayReportCount)
                                 + Number(this.data.preyearlate9day[5].lateNineDayReportCount)
                                 

       console.log('this.preyearlate9dayTotalCount =' + this.preyearlate9dayTotalCount )                                 


        this.preyearlate10dayTotalCount = Number(this.data.preyearlate10day[0].lateTenDayReportCount)
                                 + Number(this.data.preyearlate10day[1].lateTenDayReportCount)
                                 + Number(this.data.preyearlate10day[2].lateTenDayReportCount)
                                 + Number(this.data.preyearlate10day[3].lateTenDayReportCount)
                                 + Number(this.data.preyearlate10day[4].lateTenDayReportCount)
                                 + Number(this.data.preyearlate10day[5].lateTenDayReportCount)
                                 

       console.log('this.preyearlate10dayTotalCount =' + this.preyearlate10dayTotalCount )                                 


        this.preyearlateover10dayTotalCount = Number(this.data.preyearlateover10day[0].lateOverTenDayReportCount)
                                 + Number(this.data.preyearlateover10day[1].lateOverTenDayReportCount)
                                 + Number(this.data.preyearlateover10day[2].lateOverTenDayReportCount)
                                 + Number(this.data.preyearlateover10day[3].lateOverTenDayReportCount)
                                 + Number(this.data.preyearlateover10day[4].lateOverTenDayReportCount)
                                 + Number(this.data.preyearlateover10day[5].lateOverTenDayReportCount)
                                 

       console.log('this.preyearlateover10dayTotalCount =' + this.preyearlateover10dayTotalCount )                                 



        this.preyearlateTotalCount = this.preyearlate1dayTotalCount
                              + this.preyearlate2dayTotalCount
                              + this.preyearlate3dayTotalCount
                              + this.preyearlate4dayTotalCount
                              + this.preyearlate5dayTotalCount
                              + this.preyearlate6dayTotalCount
                              + this.preyearlate7dayTotalCount
                              + this.preyearlate8dayTotalCount
                              + this.preyearlate9dayTotalCount
                              + this.preyearlate10dayTotalCount
                              + this.preyearlateover10dayTotalCount
                              


       console.log('this.preyearlateTotalCount =' + this.preyearlateTotalCount )                                 




      });
    },
  },
};
</script>

<style></style>

