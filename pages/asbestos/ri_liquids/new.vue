<template>
  <v-row justify="center">
    <v-col md="8" cols="12">
      <v-card outlined>
        <v-toolbar flat>
          <v-toolbar-title>New Cargille Liquid</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field outlined label="Chemtest Code" v-model="form.CHEMTESTID"></v-text-field>
            </v-col>
            <v-col>
              <v-menu
                ref="recdateMenu"
                v-model="recdateMenu"
                transition="scale-transition"
                :close-on-content-click="false"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{on}">
                  <v-text-field
                    outlined
                    readonly
                    v-model="form.RECDATE"
                    label="Received Date"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="form.RECDATE" no-title @input="recdateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-select outlined label="Location" :items="locations" v-model="form.LOCATION"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field outlined label="Lot No." v-model="form.LOTNO"></v-text-field>
            </v-col>

            <v-col>
              <v-select outlined :items="seriesOptions" label="Series" v-model="form.SERIES"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field outlined label="RI" v-model="form.RI"></v-text-field>
            </v-col>
            <v-col>
              <v-menu
                ref="expdateMenu"
                v-model="expdateMenu"
                transition="scale-transition"
                :close-on-content-click="false"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{on}">
                  <v-text-field
                    outlined
                    readonly
                    v-model="form.UNOPEXPDT"
                    label="Expiry Date"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="form.UNOPEXPDT" no-title @input="expdateMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/asbestos/ri_liquids">Cancel</v-btn>
          <v-spacer />
          <v-btn @click="submit" color="primary">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      recdateMenu: false,
      expdateMenu: false,
      form: {},
      locations: ["Coventry", "Durham", "Liverpool"],
      seriesOptions: ["AAA", "AA", "A", "B", "E", "M", "H", "EH"]
    };
  },
  methods: {
    submit() {
      this.$axios.post("asbestos/riliquids", this.form);
    }
  }
};
</script>

<style>
</style>