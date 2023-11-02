<template>
  <v-row>
    <v-col>
      <v-card outlined min-height="800">
        <v-toolbar flat>
          <v-toolbar-title>Map Test2</v-toolbar-title>
        </v-toolbar>
        <v-card-text
          ><GMap ref="gMap" :zoom="10" :center="center"> </GMap>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      center: {
        lat: 52.268033,
        lng: 0.392647
      },
      currentLocation: {},
      locations: [
        {
          lat: 52.268033,
          lng: 0.392647
        }
      ],
      pins: {
        selected: 'data:image/png;base64,iVBORw0KGgo...',
        notSelected: 'data:image/png;base64,iVBORw0KGgo...'
      }
    };
  }
};
</script>

<style></style>
