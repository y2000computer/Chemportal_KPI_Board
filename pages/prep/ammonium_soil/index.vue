<template>
  <phase-two-template
    :title="'Ammonium Soil'"
    :prepCodes="prepCodes"
    :method="method"
    :autoNextSample="true"
    :trayType="'2'"
    :printLabel="true"
  />
</template>

<script>
import phaseTwoTemplate from '../../../components/prep/phaseTwoTemplate.vue';
export default {
  components: {
    phaseTwoTemplate,
  },
  data() {
    return {
      method: {
        filePrefix: 'AMMONIUMSOIL',
        name: 'Ammonium Soil Prep',
      },
      prepCodes: [{ det: 'KCL_SP', name: 'Ammonium Soil Prep', value: 'Y' }],
    };
  },
};
</script>

<style></style>
