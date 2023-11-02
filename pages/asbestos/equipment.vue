<template>
  <v-row>
    <v-col>
      <v-card>
        <v-toolbar dark flat>
          <v-toolbar-title>Asbestos Equipment for {{user.name}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-combobox
                label="Stereo Microscope"
                :items="stereoMicroscopes"
                v-model="form.stereoMicroscope"
                @change="updateEquipment($event,'stereoMicroscope')"
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-combobox
                label="Microscope"
                :items="microscopes"
                v-model="form.microscope"
                @change="updateEquipment($event,'microscope')"
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-combobox
                label="Safety Cabinet"
                :items="safetyCabinets"
                v-model="form.safetyCabinet"
                @change="updateEquipment($event,'safetyCabinet')"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      microscopes: ["MS1", "MS2", "MS3"],
      stereoMicroscopes: ["SMS1", "SMS2", "SMS3"],
      safetyCabinets: ["SC1", "SC2", "SC3"],
      form: {
        stereoMicroscope: "",
        safetyCabinet: "",
        microscope: ""
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    this.getEquipment();
  },
  methods: {
    getEquipment() {
      this.form.safetyCabinet = this.$store.state.asbestos.equipment.safetyCabinet;
      this.form.microscope = this.$store.state.asbestos.equipment.microscope;
      this.form.stereoMicroscope = this.$store.state.asbestos.equipment.stereoMicroscope;
    },
    updateEquipment(e, value) {
      this.$store.dispatch("asbestos/updateEquipment", {
        equipment: value,
        value: e
      });
    }
  }
};
</script>

<style>
</style>