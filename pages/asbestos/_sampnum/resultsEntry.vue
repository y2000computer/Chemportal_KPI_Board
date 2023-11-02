<template>
  <v-layout justify-space-around>
    <v-flex md7>
      <v-card class="mb-4">
        <v-toolbar dark flat>
          <v-toolbar-title>Test Results Entry: Sample {{sampnum}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap justify-space-around>
            <v-flex md3>
              <v-text-field label="Job" readonly v-model="job"></v-text-field>
            </v-flex>
            <v-flex md3>
              <v-text-field label="Sample No." readonly v-model="sampnum"></v-text-field>
            </v-flex>
            <v-flex md3>
              <v-text-field label="Client" readonly v-model="client"></v-text-field>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap justify-space-around>
            <v-flex md3>
              <v-select
                label="Microscope"
                :items="microscopes"
                v-model="form.microscope"
                @change="updateEquipment($event, 'microscope')"
              ></v-select>
            </v-flex>
            <v-flex md3>
              <v-select
                label="Stereo Microscope"
                :items="stereoMicroscopes"
                v-model="form.stereoMicroscope"
                @change="updateEquipment($event, 'stereoMicroscope')"
              ></v-select>
            </v-flex>
            <v-flex md3>
              <v-select
                label="Safety Cabinet"
                :items="safetyCabinets"
                v-model="form.safetyCabinet"
                @change="updateEquipment($event, 'safetyCabinet')"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex class="pa-2" md2>
              <v-select label="Sample Type" :items="sampleTypes" v-model="form.sampleType"></v-select>
            </v-flex>
            <v-flex md6 class="pa-2">
              <v-combobox
                label="Sample Description"
                :items="sampleDescriptions"
                v-model="form.sampleDescription"
                name="Sample Description"
                @change="newDescription($event)"
              ></v-combobox>
            </v-flex>
            <v-flex md4 class="pa-2">
              <v-select label="Sample Preps" :items="samplePreps" multiple v-model="form.preps"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              <v-select label="ACM Type (for score)" :items="acmTypes"></v-select>
            </v-flex>
          </v-layout>
          <v-row>
            <v-col>
              <v-textarea label="Notes" rows="2"></v-textarea>
            </v-col>
          </v-row>
          <v-layout>
            <v-flex>
              <v-btn :disabled="fibreCount > 3" @click="addFibre">Add Fibre</v-btn>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
        </v-card-text>
      </v-card>
      <v-expansion-panels>
        <v-expansion-panel v-for="(fibre, index) in form.fibres" :key="'fibre' + index">
          <v-expansion-panel-header class="font-weight-bold">Fibre {{index + 1}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-layout>
              <v-flex>
                <v-spacer />
                <v-btn class="float-right" text @click="deleteFibre(index)">
                  Delete
                  <v-icon class="ml-2">delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-around>
              <v-flex md6>
                <v-combobox
                  label="Morphology"
                  v-model="form.fibres[index].morphology"
                  multiple
                  :items="morphologyOptions"
                ></v-combobox>
              </v-flex>
              <v-flex md2>
                <v-combobox
                  label="Colour"
                  :items="fibreColours"
                  v-model="form.fibres[index].colour"
                ></v-combobox>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-around>
              <v-flex md3>
                <v-combobox
                  :items="RILiquidTypes"
                  label="RI Liquid Type"
                  v-model="form.fibres[index].riType"
                ></v-combobox>
              </v-flex>
              <v-flex md3>
                <v-text-field label="RI Liquid ID" v-model="form.fibres[index].riID"></v-text-field>
              </v-flex>
              <v-flex md3>
                <v-select
                  label="RI Liquid ID"
                  :items="riLiquids"
                  item-text="ID"
                  v-model="form.fibres[index].riID"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex>
                <v-radio-group
                  v-model="form.fibres[index].birefringence"
                  column
                  label="Birefringence"
                >
                  <v-radio color="primary" label="Low" value="Low"></v-radio>
                  <v-radio color="primary" label="Moderate" value="Moderate"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex>
                <v-radio-group
                  v-model="form.fibres[index].signOfElongation"
                  column
                  label="Sign of Elongation"
                >
                  <v-radio color="primary" label="Slow" value="Slow"></v-radio>
                  <v-radio color="primary" label="Fast" value="Fast"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex>
                <v-radio-group
                  v-model="form.fibres[index].angleOfExtinction"
                  column
                  label="Angle of Extinction"
                >
                  <v-radio color="primary" label="Parallel" value="Parallel"></v-radio>
                  <v-radio color="primary" label="Oblique" value="Oblique"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex>
                <v-radio-group v-model="form.fibres[index].pleochroism" column label="Pleochroism">
                  <v-radio color="primary" label="Yes" value="Yes"></v-radio>
                  <v-radio color="primary" label="No" value="No"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex>
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
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex px-2>
                <v-combobox
                  v-model="form.fibres[index].dispersionStainingNS"
                  :items="dispersionStainingOptions"
                  label="Dispersion Staining N/S"
                ></v-combobox>
              </v-flex>
              <v-flex px-2>
                <v-combobox
                  v-model="form.fibres[index].dispersionStainingEW"
                  :items="dispersionStainingOptions"
                  label="Dispersion Staining E/W"
                ></v-combobox>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap justify-center>
              <v-flex md6>
                <v-combobox
                  label="Abestos Type"
                  :items="asbestosTypes"
                  v-model="form.fibres[index].asbestosType"
                ></v-combobox>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-card v-for="(fibre, index) in form.fibres" :key="'fibre' + index" class="my-4">
        <v-toolbar flat dense dark>
          <v-toolbar-title>Fibre {{index + 1}}</v-toolbar-title>
          <v-spacer />
          <v-btn text @click="deleteFibre(index)">
            Delete
            <v-icon class="ml-2">delete</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap justify-space-around>
            <v-flex md6>
              <v-combobox
                label="Morphology"
                v-model="form.fibres[index].morphology"
                multiple
                :items="morphologyOptions"
              ></v-combobox>
            </v-flex>
            <v-flex md2>
              <v-combobox label="Colour" :items="fibreColours" v-model="form.fibres[index].colour"></v-combobox>
            </v-flex>
          </v-layout>
          <v-layout row wrap justify-space-around>
            <v-flex md3>
              <v-combobox
                :items="RILiquidTypes"
                label="RI Liquid Type"
                v-model="form.fibres[index].riType"
              ></v-combobox>
            </v-flex>
            <v-flex md3>
              <v-text-field label="RI Liquid ID" v-model="form.fibres[index].riID"></v-text-field>
            </v-flex>
            <v-flex md3>
              <v-select
                label="RI Liquid ID"
                :items="riLiquids"
                item-text="ID"
                v-model="form.fibres[index].riID"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout>
            <v-flex>
              <v-radio-group
                v-model="form.fibres[index].birefringence"
                column
                label="Birefringence"
              >
                <v-radio color="primary" label="Low" value="Low"></v-radio>
                <v-radio color="primary" label="Moderate" value="Moderate"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex>
              <v-radio-group
                v-model="form.fibres[index].signOfElongation"
                column
                label="Sign of Elongation"
              >
                <v-radio color="primary" label="Slow" value="Slow"></v-radio>
                <v-radio color="primary" label="Fast" value="Fast"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex>
              <v-radio-group
                v-model="form.fibres[index].angleOfExtinction"
                column
                label="Angle of Extinction"
              >
                <v-radio color="primary" label="Parallel" value="Parallel"></v-radio>
                <v-radio color="primary" label="Oblique" value="Oblique"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex>
              <v-radio-group v-model="form.fibres[index].pleochroism" column label="Pleochroism">
                <v-radio color="primary" label="Yes" value="Yes"></v-radio>
                <v-radio color="primary" label="No" value="No"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex>
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
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex px-2>
              <v-combobox
                v-model="form.fibres[index].dispersionStainingNS"
                :items="dispersionStainingOptions"
                label="Dispersion Staining N/S"
              ></v-combobox>
            </v-flex>
            <v-flex px-2>
              <v-combobox
                v-model="form.fibres[index].dispersionStainingEW"
                :items="dispersionStainingOptions"
                label="Dispersion Staining E/W"
              ></v-combobox>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap justify-center>
            <v-flex md6>
              <v-combobox
                label="Abestos Type"
                :items="asbestosTypes"
                v-model="form.fibres[index].asbestosType"
              ></v-combobox>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>-->
    </v-flex>

    <v-flex md4>
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>What's Going to be Reported</v-toolbar-title>
        </v-toolbar>
        <v-card-text>{{form}}</v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      sampnum: "",
      sampleTypes: ["Soil", "Bulk"],
      sampleDescriptions: [],
      microscopes: ["MS1", "MS2", "MS3"],
      stereoMicroscopes: ["SMS1", "SMS2", "SMS3"],
      safetyCabinets: ["SC1", "SC2", "SC3"],
      acmTypes: [
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
        "Crocodile",
        "Tremolite"
      ],
      job: "19-12345",
      client: "Chemtest",
      form: {
        microscope: "",
        stereoMicroscope: "",
        safetyCabinet: "",
        sampleType: "",
        sampleDescription: "",
        preps: [],
        fibres: []
      }
    };
  },
  computed: {
    fibreCount() {
      return this.form.fibres.length;
    },
    riLiquids() {
      return this.$store.state.asbestos.riLiquids;
    }
  },
  mounted() {
    this.sampnum = this.$route.params.sampnum;
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
    },
    newDescription(e) {
      this.sampleDescriptions.push(e);
    }
  }
};
</script>

<style>
</style>
