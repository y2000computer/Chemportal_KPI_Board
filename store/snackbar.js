export const state = () => ({
  show: false,
  message: ""
});

export const getters = {
  snackbarMessage(state) {
    return state.message;
  },
  showSnackbar(state) {
    return state.show;
  }
};

export const mutations = {
  SET_MESSAGE(state, message) {
    state.message = message;
  },
  SHOW_MESSAGE(state, value) {
    state.show = value;
  }
};

export const actions = {
  showSnackbar({ commit }, message) {
    commit("SET_MESSAGE", message);
    commit("SHOW_MESSAGE", true);
  },
  resetSnackbar({ commit }) {
    commit("SHOW_MESSAGE", false);
    commit("SET_MESSAGE", "");
  }
};
