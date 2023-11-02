<template>
  <v-row>
    <v-col>
      <v-card flat :loading="loading">
        <v-toolbar dense flat>
          <v-toolbar-title>Due Samples by Test</v-toolbar-title>
          <v-spacer />
          <span class="font-weight-medium text-center">
            Samples Due (Outstanding)<br />
            [Cumulative]
          </span>
          <v-spacer />
          <v-btn icon small @click="getData">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-simple-table dense :loading="loading">
            <thead>
              <tr>
                <th>Sop Group</th>
                <th v-for="date in data.dates" :key="'head' + date">
                  {{
                    $moment(date).isBefore($moment(), "day")
                      ? "Overdue"
                      : $moment(date).format("ddd Do MMM")
                  }}
                </th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(group, key) in data.counts" :key="'row' + key">
                <td class="font-weight-medium text-caption">
                  {{ key }} ({{ data.groups[key][0].capacity }})
                  <!-- <v-btn
                    icon
                    small
                    @click="handleEditClicked(data.groups[key][0])"
                    ><v-icon small>mdi-pencil</v-icon></v-btn
                  > -->
                </td>
                <template>
                  <td
                    v-for="date in data.dates"
                    :key="key + date"
                    class="text-caption"
                  >
                    <span
                      v-if="group[date][0].cumulativeOverCapacity"
                      class="font-weight-medium"
                      :class="
                        dateColour(
                          parseInt(data.groups[key][0].capacity),
                          parseInt(group[date][0].uniqueTestCount)
                        )
                      "
                    >
                      {{ group[date] ? group[date][0].uniqueTestCount : "-" }}
                    </span>
                    <span>
                      {{
                        group[date]
                          ? " (" + group[date][0].outstandingTestCount + ")"
                          : "-"
                      }}</span
                    >
                    <div
                      v-if="group[date][0].cumulativeOverCapacity"
                      class="font-weight-medium"
                      :class="
                        group[date][0].cumulativeOverCapacity > 0
                          ? 'red--text'
                          : 'green--text'
                      "
                    >
                      [{{
                        group[date]
                          ? group[date][0].cumulativeOverCapacity
                          : ""
                      }}]
                    </div>
                  </td>
                </template>
                <td class="text-caption">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <p v-on="on" v-bind="attrs">
                        {{ data.groups[key][0].comments | shorten(30) }}
                      </p>
                    </template>
                    {{ data.groups[key][0].comments }}
                  </v-tooltip>
                </td>
                <td>
                  <v-btn
                    icon
                    small
                    @click="handleEditClicked(data.groups[key][0])"
                    ><v-icon small>mdi-pencil</v-icon></v-btn
                  >
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="editCapacityDialog" max-width="800">
      <v-card>
        <v-card-title
          >Edit Capacity - {{ selectedGroup.name }}
          <v-spacer />
          <v-btn icon @click="handleEditClosed">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-5">
          <v-row>
            <v-col>
              <v-text-field
                outlined
                dense
                type="number"
                label="New Capacity"
                v-model="form.capacity"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                maxlength="100"
                counter
                :disabled="
                  $auth.user.SECTION !== 'APPROVER' &&
                    $auth.user.SECTION !== 'IT'
                "
                outlined
                label="Comments"
                v-model="form.comments"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="updating" @click="handleEditClosed">Cancel</v-btn>
          <v-spacer />
          <v-btn
            :loading="updating"
            :disabled="updating || form.capacity === ''"
            @click="handleSubmitUpdatedCapacity"
            color="primary"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: [],
      columns: ["cumulativeOverCapacity", "cumulativeOverCapacitySubComp"],
      column: "cumulativeOverCapacity",
      selectedGroup: {},
      form: {
        id: "",
        capacity: "",
        comments: "",
      },
      editCapacityDialog: false,
      updating: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      await this.$axios
        .get("stats/dw-sop-group-due-date-totals")
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        });
    },
    handleEditClicked(sg) {
      this.selectedGroup = sg;
      this.form.id = sg.id;
      this.form.capacity = sg.capacity;
      this.form.comments = sg.comments;
      console.log(this.selectedGroup);
      this.editCapacityDialog = true;
    },
    handleEditClosed() {
      this.selectedGroup = {};
      this.form.id = "";
      this.form.capacity = "";
      this.editCapacityDialog = false;
      this.updating = false;
    },
    async handleSubmitUpdatedCapacity() {
      this.updating = true;
      try {
        await this.$axios
          .patch("stats/dw-sop-group-due-date-totals", this.form)
          .then((res) => {
            this.getData();
            this.handleEditClosed();
          });
      } catch (error) {
        console.log(error);
        this.handleEditClosed();
      }
    },
    dateColour(capacity, uniqueTestCount) {
      if (uniqueTestCount > capacity) {
        return "red--text";
      } else if (uniqueTestCount > capacity * 0.85) {
        return "orange--text";
      } else {
        return "green--text";
      }
    },
  },
};
</script>

<style></style>
