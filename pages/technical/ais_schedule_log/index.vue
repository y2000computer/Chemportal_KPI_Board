<template>
  <v-row
    ><v-col
      ><v-card flat>
        <v-toolbar flat dense
          ><v-toolbar-title class="font-weight-medium">AIS Schedule Log  > Reload Every 30 seconds > Last Update Timestamp: {{currentDateTime()}}</v-toolbar-title
          ><v-spacer />


          <v-btn icon @click="get_ais_schedule_logs">
            <v-icon>refresh</v-icon>
          </v-btn>
          
          </v-toolbar>
        <v-card-text>
          <v-tabs grow>
    
            <v-tab>AIS Schedule Log </v-tab>
            <v-tab-item>
              <aisschedulelog-list :ais_schedule_logs="ais_schedule_logs" :loading="ais_schedule_logs_Loading" @get_ais_schedule_logs="get_ais_schedule_logs"  />
            </v-tab-item>

          </v-tabs> 
          </v-card-text>
          </v-card></v-col>
  </v-row>
</template>

<script>
import aisschedulelogList from './components/aisschedulelog_list';
export default {
  components: {
    aisschedulelogList,
  },
  data() {
    return {
      ais_schedule_logs_Loading: true,
      ais_schedule_logs: [],
 
    };
  },
  mounted() {
    //this.get_ais_schedule_logs();

  },
  created() {  
    this.get_ais_schedule_logs();
    this.timer = setInterval(this.get_ais_schedule_logs, 30000);  
  },   
  methods: {

    get_ais_schedule_logs() {
      this.ais_schedule_logs_Loading = true;
      //this.$axios.get('laboratory/samplecheckin').then((response) => {        
      this.$axios.get('technical/ais_schedule_log').then((response) => {        
        this.ais_schedule_logs = response.data.data;
        this.ais_schedule_logs_Loading = false;
      });
    },
    currentDateTime() {
      const current = new Date();
      const date = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
      const time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
      const dateTime = date +' '+ time;

      return dateTime;
    },    
  },
};
</script>

<style></style>
