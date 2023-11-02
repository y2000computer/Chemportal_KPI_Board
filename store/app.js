import Vue from 'vue';

export const actions = {
  getSetTheme() {
    const theme = localStorage.getItem('chemportalTheme');
    if (!theme) {
      localStorage.setItem('chemportalTheme', 'light');
    } else {
      if (theme == 'dark') {
        $nuxt.$vuetify.theme.dark = true;
      } else {
        $nuxt.$vuetify.theme.dark = false;
      }
    }
  },

  toggleTheme() {
    const dark = !$nuxt.$vuetify.theme.dark;
    if (dark) {
      localStorage.setItem('chemportalTheme', 'dark');
    } else {
      localStorage.setItem('chemportalTheme', 'light');
    }
    $nuxt.$vuetify.theme.dark = !$nuxt.$vuetify.theme.dark;
  },
};
