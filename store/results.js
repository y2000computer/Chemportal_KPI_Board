import Vue from 'vue';

export const state = () => ({
  results: [],
  pending: [],
  lastImported: '',
});

// export const getters = {
//   allResults: (state) => {
//     let array = [];
//     state.results.forEach((result) => {
//       array.push({
//         sampnum: result.sampnum,
//         det: result.det,
//       });
//     });
//     state.pending.forEach((result) => {
//       array.push({
//         sampnum: result.Sampnum,
//         det: result.Det,
//       });
//     });
//     return array;
//   },
// };

export const mutations = {
  SET_RESULTS(state, data) {
    state.results = data;
  },

  SET_PENDING_RESULTS(state, data) {
    state.pending = data.data.results;
    state.lastImported = data.data.lastImportTime;
  },
};

export const actions = {
  setResults({ commit }) {
    if (localStorage.getItem('chemportalResults')) {
      commit(
        'SET_RESULTS',
        JSON.parse(localStorage.getItem('chemportalResults'))
      );
    }
  },

  addResult({ commit }, data) {
    if (!localStorage.getItem('chemportalResults')) {
      var array = [];
    } else {
      var array = JSON.parse(localStorage.getItem('chemportalResults'));
    }

    if (!array.length) {
      array.push(data);
      localStorage.setItem('chemportalResults', JSON.stringify(array));
      commit('SET_RESULTS', array);
      return;
    }

    var existingMethod = this._vm._.find(array, { method: data.method });

    if (!existingMethod) {
      array.push(data);
      localStorage.setItem('chemportalResults', JSON.stringify(array));
      commit('SET_RESULTS', array);
      return;
    }

    data.results.forEach((result) => {
      //Check if result for sampnum and det already pending to send
      var existingResult = this._vm._.findIndex(existingMethod.results, {
        det: result.det,
        sampnum: result.sampnum,
      });
      // If exists remove old result
      if (existingResult > -1) {
        existingMethod.results.splice(existingResult, 1);
      }

      existingMethod.results.push(result);
    });

    var newArray = this._vm._.filter(array, function(o) {
      return o.method != data.method;
    });
    newArray.push(existingMethod);

    localStorage.setItem('chemportalResults', JSON.stringify(newArray));
    commit('SET_RESULTS', newArray);
  },

  removeResult({ commit }, data) {
    var array = JSON.parse(localStorage.getItem('chemportalResults'));
    var existingMethod = this._vm._.find(array, { method: data.method });
    var newArray = this._vm._.filter(array, function(o) {
      return o.method != data.method;
    });
    existingMethod.results.splice(data.index, 1);
    if (!existingMethod.results.length == 0) {
      newArray.push(existingMethod);
    }
    localStorage.setItem('chemportalResults', JSON.stringify(newArray));
    commit('SET_RESULTS', newArray);
  },

  clearResults({ commit }) {
    localStorage.removeItem('chemportalResults');
    commit('SET_RESULTS', []);
  },

  async getPendingResults({ commit }) {
    let { data } = await this.$axios.get('test2');
    commit('SET_PENDING_RESULTS', data);
  },
};
