<template>
  <v-app>
    <v-app-bar color="#003883" app fixed clipped-left>
      <v-app-bar-nav-icon
        dark
        @click.stop="navbar = !navbar"
        :disabled="!loggedIn"
      ></v-app-bar-nav-icon>
      <img src="~/assets/images/chemtest_negative.png" height="45px" />
      <!-- <img
        v-if="!darkTheme"
        src="~/assets/images/chemtest_negative.png"
        height="38px"
      />
      <img v-else src="~/assets/images/chemtest_full.png" height="38px" /> -->

      <v-spacer />
      <!-- <super-search v-if="$auth.user.USER_ID == 'ANB'" /> -->
      <v-spacer />

      <!-- Logged Out Option -->
      <v-toolbar-items v-if="!loggedIn">
        <v-btn text :to="{ name: 'auth-login' }">Login</v-btn>
      </v-toolbar-items>
      <!-- Logged In Option -->
      <div v-if="loggedIn">
        <!-- <v-btn @click="resultsDialog = !resultsDialog" icon v-if="resultCount"> -->
        <v-btn dark to="/results" icon v-if="resultCount">
          <!-- <v-badge bottom overlap :content="resultCount"> -->
          <v-icon>mdi-database-export</v-icon>
          <!-- </v-badge> -->
        </v-btn>

        <v-menu :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item class="text-right">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $auth.user.USER_NAME }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    $auth.user.JOB_TITLE
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Dark Mode</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-switch
                    inset
                    v-model="darkTheme"
                    color="primary"
                  ></v-switch>
                </v-list-item-action>
              </v-list-item>
              <v-list-item
                ><v-list-item-content
                  ><v-list-item-title
                    ><v-row no-gutters align="center"
                      ><v-col cols="4">Label Printer</v-col
                      ><v-col
                        ><v-select
                          outlined
                          dense
                          hide-details
                          :items="printers"
                          @change="updatePrinter"
                          item-value="PRNTERNAME"
                          item-text="PRNTERNAME"
                          v-model="printer"
                        ></v-select></v-col></v-row></v-list-item-title></v-list-item-content
              ></v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="logout">
                Logout
                <v-icon small class="ml-2">mdi-logout-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Nav Drawer -->
    <v-navigation-drawer v-if="loggedIn" v-model="navbar" app clipped>
      <v-list nav dense>
        <div v-for="level1 in navMenu" :key="'1' + level1.label">
          <v-list-item
            style="margin-bottom:4px"
            v-if="
              level1.type == 'link' &&
                permissionCheck(level1.group, level1.section, level1.user_id)
            "
            :to="level1.to"
            exact
            ripple
          >
            <v-list-item-icon>
              <v-icon>{{ level1.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ level1.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- Expand if set to group -->
          <v-list-group
            :prepend-icon="level1.icon"
            v-if="
              level1.type == 'group' &&
                permissionCheck(level1.group, level1.section, level1.user_id)
            "
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ level1.label }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <div v-for="level2 in level1.links" :key="'2' + level2.label">
              <v-list-item
                v-if="
                  level2.type == 'link' &&
                    permissionCheck(
                      level2.group,
                      level2.section,
                      level2.user_id
                    )
                "
                :to="level2.to"
                exact
                ripple
                style="margin-bottom:4px"
              >
                <v-list-item-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ level2.label }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>{{ level2.icon }}</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-list-group
                style="margin-bottom:4px"
                no-icon
                sub-group
                v-if="
                  level2.type == 'group' &&
                    permissionCheck(
                      level2.group,
                      level2.section,
                      level2.user_id
                    )
                "
              >
                <template v-slot:activator>
                  <v-list-item>
                    <v-list-item-title>{{ level2.label }}</v-list-item-title>
                  </v-list-item>
                </template>
                <div v-for="level3 in level2.links" :key="'3' + level3.label">
                  <v-list-item
                    v-if="
                      permissionCheck(
                        level3.group,
                        level3.section,
                        level3.user_id
                      )
                    "
                    :to="level3.to"
                    exact
                    ripple
                    style="margin-bottom:4px"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ level3.label }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>{{ level3.icon }}</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </div>
              </v-list-group>
            </div>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>
    <snackbar />

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import snackbar from "../components/Snackbar";
import results from "../components/Results";
import superSearch from "../components/search/super_search";
export default {
  components: {
    snackbar,
    results,
    superSearch,
  },

  created() {
    this.$store.dispatch("results/setResults");
    this.$store.dispatch("app/getSetTheme");
    this.printer = localStorage.getItem("chemportalLabelPrinter");
    this.updatePrinter(this.printer);
    this.getPrinters();
  },
  data() {
    return {
      navbar: null,
      resultsDialog: false,
      printers: [],
      printer: "",
    };
  },

  computed: {
    navMenu() {
      return this.$store.state.nav.menu;
    },
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    darkTheme: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set() {
        this.$store.dispatch("app/toggleTheme");
      },
    },
    user() {
      return this.$store.state.auth.user;
    },
    initials() {
      return this.$auth.user.USER_NAME.match(/\b\w/g).join("");
    },
    resultCount() {
      return this.$store.state.results.results.length;
    },
  },

  methods: {
    logout() {
      localStorage.removeItem("token_expiry");
      this.$auth.logout();
      this.$store.dispatch("snackbar/showSnackbar", "Logged Out");
    },
    getPrinters() {
      this.$axios.get("printers").then((response) => {
        this.printers = response.data.data;
      });
    },
    updatePrinter() {
      this.$store.dispatch("printer/setPrinter", this.printer);
    },
    permissionCheck(group, section, user_id) {
      if (this.$auth.user.SECTION == "IT") {
        return true;
      }
      if (
        (group.indexOf(this.$auth.user.GROUP) > -1 || group == "*") &&
        (section.indexOf(this.$auth.user.SECTION) > -1 || section == "*") &&
        (user_id.indexOf(this.$auth.user.USER_ID) > -1 || user_id == "*")
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style>
.v-navigation-drawer {
  will-change: initial;
}
</style>
