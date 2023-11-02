export const state = () => ({
  printer: '',
});

export const mutations = {
  SET_PRINTER(state, printer) {
    state.printer = printer;
  },
};

export const actions = {
  getLabelPrinter({ commit }) {
    let printer = localStorage.getItem('chemportalLabelPrinter_label_small');
    commit('SET_PRINTER', printer);
  },
  setPrinter({ commit }, printer) {
    localStorage.setItem('chemportalLabelPrinter_label_small', printer);
    commit('SET_PRINTER', printer);
  },
};
