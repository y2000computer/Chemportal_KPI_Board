export default {
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/moment",
    "~/plugins/lodash",
    "~/plugins/axios",
    "~/plugins/filters",
    "~/plugins/vuetify",
    "~/plugins/clipboard",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    //'@nuxtjs/pwa',
    "@nuxtjs/auth",
    "@nuxtjs/vuetify",
    ["nuxt-validate", {}],
    // [
    //   'nuxt-gmaps',
    //   {
    //     key: 'AIzaSyAhBlvNHjyDjx53kkq4Z5OEBzu0Cf-ZPDo',
    //     //you can use libraries: ['places']
    //   },
    // ],
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: "http://chem-api-v2/api/",
    //baseURL: "http://lab/api2_developing/public/api/",
    credentials: false,
  },

  auth: {
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      home: "/",
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "auth/login",
            method: "post",
            propertyName: "meta.token",
          },
          logout: { url: "auth/logout", method: "post" },
          user: { url: "auth/me", method: "get", propertyName: "data" },
        },
      },
    },
  },

  router: {
    middleware: ["auth"],
    base: "/chemportal/",
    //base: "/chemportal_enhance_batch17_compiled/",
  },

  /*
   ** Build configuration
   */

  vuetify: {
    //treeShake: true,
    //customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#003883",
          priorityLabels: "#FFEB3B",
          tableSubHeaders: "#e0e0e0",
          tableSuccess: "#A5D6A7",
          tableWarnings: "#FFCDD2",
          chartDash: "#bdbdbd",
          testColour: "#0366fc",
          eurofinsOrange: "#EE7D11",
        },
        dark: {
          primary: "#EE7D11",
          priorityLabels: "#F57F17",
          tableSubHeaders: "#424242",
          tableSuccess: "#04B83E",
          tableWarnings: "#B71C1C",
          chartDash: "#bdbdbd",
          testColour: "#f2023a",
          eurofinsOrange: "#EE7D11",
        },
      },
    },
    icons: {
      iconfont: "mdi",
    },
  },

  pwa: {
    meta: {
      title: "Chemportal",
    },
    manifest: {
      name: "Chemportal",
      lang: "en",
      display: "standalone",
      background_color: "#003883",
    },
  },

  build: {
    transpile: ["vuetify/lib"],
    babel: {
      plugins: [
        ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
      ],
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
