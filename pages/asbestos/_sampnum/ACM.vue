<template>
  <v-row dense>
    <v-col md="9">
      <v-card class="mb-2">
        <v-toolbar flat>
          <v-toolbar-title>Test Results Entry: Sample {{sampnum}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="2">
              <v-text-field outlined hide-details label="Job" readonly :value="sample.JOB"></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field outlined label="Sample No." readonly v-model="sample.SAMPNUM"></v-text-field>
            </v-col>
            <v-col md="2">
              <v-text-field
                readonly
                outlined
                label="Sample Type"
                :items="sampleTypes"
                v-model="sample.TYPE"
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field
                outlined
                label="Client"
                readonly
                v-model="sample.job.office.client.client_name"
              ></v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field outlined label="Due Date" readonly v-model="sample.job.LABDATE"></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="space-between" dense>
            <v-col md="3">
              <v-select
                outlined
                label="Microscope"
                :items="microscopes"
                v-model="form.microscope"
                @change="updateEquipment($event, 'microscope')"
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-select
                outlined
                label="Stereo Microscope"
                :items="stereoMicroscopes"
                v-model="form.stereoMicroscope"
                @change="updateEquipment($event, 'stereoMicroscope')"
              ></v-select>
            </v-col>
            <v-col md="3">
              <v-select
                outlined
                label="Safety Cabinet"
                :items="safetyCabinets"
                v-model="form.safetyCabinet"
                @change="updateEquipment($event, 'safetyCabinet')"
              ></v-select>
            </v-col>
          </v-row>

          <v-row dense justify="space-between">
            <v-col md="4">
              <v-combobox
                outlined
                label="Sample Description"
                :items="sampleDescriptions"
                v-model="form.sampleDescription"
                name="Sample Description"
                @change="newDescription($event)"
              ></v-combobox>
            </v-col>
            <v-col md="4">
              <v-select
                outlined
                label="Sample Preps"
                :items="samplePreps"
                multiple
                v-model="form.preps"
              ></v-select>
            </v-col>
            <v-col md="2">
              <v-select
                outlined
                label="Visibility"
                :items="['Visible','Microscopic']"
                v-model="form.visibility"
              ></v-select>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-textarea outlined label="Notes" rows="4"></v-textarea>
            </v-col>
            <v-col>
              <v-textarea outlined label="Reporting Notes" rows="4"></v-textarea>
            </v-col>
            <v-col>
              <v-select
                outlined
                label="ACM Type (for score)"
                :items="acmTypes"
                item-value="ACMTYPESID"
                item-text="TYPE"
              ></v-select>
              <v-btn
                block
                class="px-5"
                color="primary"
                :disabled="fibreCount > 3"
                @click="addFibre"
              >Add Fibre</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="addFibre">Add Fibre</v-btn>
        </v-card-actions>
      </v-card>

      <v-expansion-panels v-model="fibres" accordion>
        <v-expansion-panel v-for="(fibre, index) in form.fibres" :key="'fibre' + index">
          <v-expansion-panel-header class="font-weight-bold">Fibre {{index + 1}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters></v-row>
            <v-row no-gutters justify="space-around">
              <v-col md="6">
                <v-combobox
                  label="Morphology"
                  v-model="form.fibres[index].morphology"
                  multiple
                  :items="morphologyOptions"
                ></v-combobox>
              </v-col>
              <v-col md="2">
                <v-combobox
                  label="Colour"
                  :items="fibreColours"
                  v-model="form.fibres[index].colour"
                ></v-combobox>
              </v-col>
              <v-col md="2">
                <v-btn class="float-right" color="primary" @click="deleteFibre(index)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row row wrap justify="space-around">
              <v-col md="3">
                <v-combobox
                  :items="RILiquidTypes"
                  label="RI Liquid Type"
                  v-model="form.fibres[index].riType"
                ></v-combobox>
              </v-col>
              <v-col md="3">
                <v-text-field label="RI Liquid ID" v-model="form.fibres[index].riID"></v-text-field>
              </v-col>
              <v-col md="3">
                <v-select
                  label="RI Liquid ID"
                  :items="riLiquids"
                  item-text="ID"
                  v-model="form.fibres[index].riID"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-radio-group
                  v-model="form.fibres[index].birefringence"
                  column
                  label="Birefringence"
                >
                  <v-radio color="primary" label="Low" value="Low"></v-radio>
                  <v-radio color="primary" label="Moderate" value="Moderate"></v-radio>
                  <v-radio color="primary" label="None" value="None"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-radio-group
                  v-model="form.fibres[index].signOfElongation"
                  column
                  label="Sign of Elongation"
                >
                  <v-radio color="primary" label="Slow" value="Slow"></v-radio>
                  <v-radio color="primary" label="Fast" value="Fast"></v-radio>
                  <v-radio color="primary" label="None" value="None"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-radio-group
                  v-model="form.fibres[index].angleOfExtinction"
                  column
                  label="Angle of Extinction"
                >
                  <v-radio color="primary" label="Parallel" value="Parallel"></v-radio>
                  <v-radio color="primary" label="Oblique" value="Oblique"></v-radio>
                  <v-radio color="primary" label="Incomplete" value="Incomplete"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-radio-group v-model="form.fibres[index].pleochroism" column label="Pleochroism">
                  <v-radio color="primary" label="Yes" value="Yes"></v-radio>
                  <v-radio color="primary" label="No" value="No"></v-radio>
                  <v-radio color="primary" label="None" value="None"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col>
                <v-combobox
                  :disabled="form.fibres[index].pleochroism != 'Yes'"
                  :items="pleochroismColoursNS"
                  label="Pleochroism Colour N/S"
                ></v-combobox>
                <v-combobox
                  :disabled="form.fibres[index].pleochroism != 'Yes'"
                  :items="pleochroismColoursEW"
                  label="Pleochroism Colour E/W"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-combobox
                  v-model="form.fibres[index].dispersionStainingNS"
                  :items="dispersionStainingOptions"
                  label="Dispersion Staining N/S"
                ></v-combobox>
              </v-col>
              <v-col>
                <v-combobox
                  v-model="form.fibres[index].dispersionStainingEW"
                  :items="dispersionStainingOptions"
                  label="Dispersion Staining E/W"
                ></v-combobox>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row row wrap justify="center" align="center">
              <v-col md="6">
                <v-combobox
                  label="Abestos Type"
                  :items="asbestosTypes"
                  v-model="form.fibres[index].asbestosType"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col md="3">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>What's Going to be Reported</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div class="headline">{{reportable}}</div>
          <br />
          {{form}}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      sampnum: "",
      sample: [],
      sampleTypes: ["Soil", "Bulk"],
      sampleDescriptions: [],
      microscopes: ["MS1", "MS2", "MS3"],
      stereoMicroscopes: ["SMS1", "SMS2", "SMS3"],
      safetyCabinets: ["SC1", "SC2", "SC3"],
      acmTypes: [],
      acmTypesOld: [
        "Asbestos Cement",
        "Asbestos Insulating Board",
        "Floor Tiles",
        "Bituminous Products",
        "Laggings",
        "Sprayed and Loose Fill Asbestos",
        "Textiles and Gaskets",
        "Hard Set Lagging",
        "Decorative Plaster/Coating/Paint",
        "Vinyl Floor Tiles",
        "Soils Containings Asbestos",
        "Asbestos Impurity in Mineral Product"
      ],
      samplePreps: ["Crush", "Acid", "Solvent", "Dry", "Ignition"],
      morphologyOptions: ["Sticky", "Straight", "Elastic", "Harsh", "Curly"],
      fibreColours: ["White", "Brown", "Green", "Blue"],
      RILiquidTypes: ["1.55", "1.67", "1.70", "1.605", "1.64"],
      signOfElongationOptions: ["Slow", "Fast"],
      angleOfExtinctionOptions: ["Parallel", "Oblique"],
      pleochroismColoursNS: ["Grey"],
      pleochroismColoursEW: ["Blue", "Green"],
      dispersionStainingOptions: [
        "Blue",
        "Gold",
        "Magenta",
        "Orange",
        "Purple",
        "Red",
        "Yellow"
      ],
      asbestosTypes: [
        "Actinolite",
        "Amosite",
        "Anthophyllite",
        "Chrysotile",
        "Crocidolite",
        "Tremolite"
      ],
      job: "19-12345",
      client: "Chemtest",
      fibres: [],
      form: {
        microscope: "",
        stereoMicroscope: "",
        safetyCabinet: "",
        sampleType: "",
        sampleDescription: "",
        visibility: "",
        preps: [],
        fibres: []
      }
    };
  },
  computed: {
    fibreCount() {
      return this.form.fibres.length;
    },
    reportable() {
      let reportable = "";
      if (this.form.fibres.length == 0) {
        reportable = "No Asbestos Detected";
      } else {
        reportable = this.form.visibility + " fibres of ";
      }
      this.form.fibres.forEach((fibre, index) => {
        if (index + 1 == this.form.fibres.length && index > 0) {
          reportable += " and ";
        } else if (index > 0) {
          reportable += ", ";
        }
        reportable += fibre.asbestosType;
      });

      return reportable;
    },
    riLiquids() {
      return this.$store.state.asbestos.riLiquids;
    }
  },
  mounted() {
    this.getSample(this.$route.params.sampnum);
    this.getACMTypes();
    this.getEquipment();
  },
  methods: {
    getSample(sample) {
      this.$axios.get("asbestos/sample?sampnum=" + sample).then(response => {
        this.sample = response.data;
      });
    },
    getACMTypes() {
      this.$axios.get("asbestos/acmtypes").then(response => {
        this.acmTypes = response.data;
      });
    },
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
    },
    addFibre() {
      this.form.fibres.push({
        morphology: [],
        colour: "",
        riType: "",
        riID: "",
        birefringence: null,
        signOfElongation: "",
        angleOfExtinction: "",
        pleochroism: null,
        dispersionStainingNS: "",
        dispersionStainingEW: "",
        asbestosType: ""
      });
    },
    deleteFibre(index) {
      this.form.fibres.splice(index, 1);
      this.fibres = [];
    },
    newDescription(e) {
      this.sampleDescriptions.push(e);
    }
  }
};
</script>

<style>
</style>
