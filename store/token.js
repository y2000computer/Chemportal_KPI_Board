import Vue from 'vue';

export const actions = {
  setExpiryTime() {
    var time = Vue.moment().add(2880, 'm');
    localStorage.setItem('token_expiry', time);
  },

  async tokenRefresh({ dispatch }) {
    const response = await this.$axios.post('refresh');
    const token = 'Bearer ' + response.data.meta.token;
    this.$auth.setToken('local', token);
    this.$auth.strategy._setToken(token);
    dispatch('setExpiryTime');
  },
};
