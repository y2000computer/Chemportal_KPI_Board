<template>
  <v-card flat>
    <v-card-title>Sample Search</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            outlined
            label="Scan Sample"
            autocomplete="off"
            v-model="search"
            append-icon="mdi-barcode-scan"
            @keyup.enter="getSample"
            ref="searchBox"
            :loading="sampleLoading"
            :readonly="sampleLoading"
            :disabled="disabled"
            :error-messages="errorMessage"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider class="mt-4" />
      <v-row align="center">
        <v-col>Sample Details</v-col>
        <v-col>
          <v-btn
            color="primary"
            :disabled="!sample.SAMPNUM"
            @click="resetClicked"
            icon
            class="float-right"
          >
            <v-icon>mdi-beaker-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            outlined
            dense
            readonly
            hide-details
            placeholder=" "
            label="Sample"
            :value="sample.SAMPNUM"
            :loading="sampleLoading"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            outlined
            dense
            readonly
            hide-details
            placeholder=" "
            label="Job"
            :value="sample.JOB"
            :loading="sampleLoading"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Client"
            placeholder=" "
            outlined
            dense
            readonly
            hide-details
            :value="sample.job ? sample.job.office.client.CLIENTNAME : ''"
            :loading="sampleLoading"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Due Date"
            placeholder=" "
            outlined
            dense
            readonly
            hide-details
            :value="
              sample.job
                ? $moment(sample.job.OFFICEDATE).format('DD/MM/YY')
                : ''
            "
            :loading="sampleLoading"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Sample Status"
            placeholder=" "
            outlined
            dense
            readonly
            hide-details
            :value="sample.SAMPSTATUS"
            :loading="sampleLoading"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-alert v-if="error.length" class="white--text" color="primary">
            {{ error }}
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    moreDets: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      search: '',
      sampleLoading: false,
      sample: {},
      error: '',
    };
  },
  watch: {
    disabled: function(val) {
      if (!val) {
        this.resetSample();
      }
    },
  },
  methods: {
    getSample() {
      this.sample = [];
      this.sampleLoading = true;
      var route = 'samples/' + this.search;
      if (this.moreDets) {
        route += '?moreDets=1';
      }
      this.$axios
        .get(route)
        .then((response) => {
          this.sample = response.data.data;
          this.sampleLoading = false;
          this.search = '';
          this.error = '';
          this.$emit('sampleFound', this.sample);
        })
        .catch((e) => {
          this.error = 'Error Loading Sample. Please Try Again.';
          this.sampleLoading = false;
        });
    },
    setFocus(ref) {
      this.$nextTick(() => {
        this.$refs[ref].focus();
      });
    },
    updatePrinter() {
      this.$store.dispatch('printer/setPrinter', this.printer);
    },
    resetClicked() {
      this.$emit('sampleReset');
      this.resetSample();
    },
    resetSample() {
      this.search = '';
      this.sample = {};
      this.error = '';
      this.setFocus('searchBox');
    },
  },
};
</script>

<style></style>
