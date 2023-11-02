import Vue from 'vue';

Vue.filter('shorten', function(string, value) {
  if (string) {
    if (string.length > value) {
      return string.substring(0, value) + ' ..';
    } else {
      return string;
    }
  }
});
