import moment from "moment";

export default function({ $axios, app, store }) {
  $axios.onError(error => {
    console.log(error);
    if (error.response.status === 422) {
      store.dispatch("validation/setErrors", error.response.data.errors);
    }
    if (error.response.status === 404) {
      console.log(error.response.data.message);
    }
    if (error.response.status === 401) {
      store.dispatch("validation/setErrors", error.response.data.errors);
      app.$auth.logout();
    }
    return Promise.reject(error);
  });

  $axios.onRequest(() => {
    store.dispatch("validation/clearErrors");
  });

  $axios.onRequest(config => {
    var tokentime = localStorage.getItem("token_expiry");
    if (config.url != "refresh") {
      if (
        moment()
          .add(240, "m")
          .isAfter(tokentime) &&
        moment().isBefore(tokentime)
      ) {
        store.dispatch("token/tokenRefresh");
        store.dispatch("token/setExpiryTime");
      }
    }
  });
}
