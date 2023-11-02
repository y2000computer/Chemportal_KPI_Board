<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text v-if="!loading">
      <v-row dense>
        <v-col>
          <v-switch
            inset
            hide-details
            v-model="lateOnly"
            :label="lab ? 'Lab Lates Samples Only' : 'Lates Samples Only'"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-simple-table dense>
            <thead>
              <th>Sample</th>
              <th>Due</th>
              <th>Complete</th>
              <th>Approved</th>
              <th>Reported</th>
              <th>On Time</th>
              <th v-if="lab">Lab On Time</th>
              <th>PO</th>
              <th>On Stop</th>
            </thead>
            <tbody>
              <template v-for="(sample, index) in filteredSamples">
                <tr
                  v-if="
                    index == 0 ||
                      filteredSamples[index - 1].client_name !=
                        filteredSamples[index].client_name
                  "
                  :key="'client' + sample.client_name"
                >
                  <td
                    class="tableSubHeaders font-weight-bold caption"
                    :colspan="lab ? 9 : 8"
                  >
                    {{ sample.client_name }}
                  </td>
                </tr>
                <tr
                  v-if="
                    index == 0 ||
                      filteredSamples[index - 1].job_id !=
                        filteredSamples[index].job_id
                  "
                  :key="'job' + sample.job_id"
                >
                  <td class="font-weight-bold" :colspan="lab ? 9 : 8">
                    Job: {{ sample.job_id }}
                  </td>
                </tr>
                <tr
                  :key="sample.sample_id"
                  :class="
                    (subcon
                      ? sample.der_subcon_on_time
                      : sample.der_internal_on_time) == 1
                      ? ''
                      : 'tableWarnings'
                  "
                  class="text-center"
                >
                  <td>{{ sample.sample_id }}</td>
                  <td>
                    {{
                      dateFormat(
                        subcon ? sample.subcon_due_date : sample.due_date
                      )
                    }}
                  </td>
                  <td>{{ dateFormat(sample.completed_date) }}</td>
                  <td>{{ dateFormat(sample.approved_date) }}</td>
                  <td>
                    {{
                      dateFormat(
                        subcon
                          ? sample.der_subcon_reported_date
                          : sample.der_internal_reported_date
                      )
                    }}
                  </td>
                  <td>
                    {{
                      (subcon
                        ? sample.der_subcon_on_time
                        : sample.der_internal_on_time) == 1
                        ? 'Y'
                        : 'N'
                    }}
                  </td>
                  <td v-if="lab">{{ sample.on_time == 1 ? 'Y' : 'N' }}</td>
                  <td>{{ sample.poReq ? 'X' : '' }}</td>
                  <td>{{ sample.onStop ? 'X' : '' }}</td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else class="text-center">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    samples: Array,
    lab: Boolean,
    title: String,
    subcon: Boolean,
  },
  data() {
    return {
      lateOnly: true,
    };
  },
  computed: {
    filteredSamples() {
      if (!this.loading) {
        if (!this.lateOnly) {
          return this.samples;
        } else {
          if (this.lab) {
            return this.samples.filter((sample) => sample.on_time == 0);
          } else if (this.subcon) {
            return this.samples.filter(
              (sample) => sample.der_subcon_on_time == 0
            );
          } else {
            return this.samples.filter(
              (sample) => sample.der_internal_on_time == 0
            );
          }
        }
      }
    },
  },
  methods: {
    dateFormat(date) {
      if (date) {
        return this.$moment(date, 'YYYY-MM-DD').format('DD/MM/YY');
      } else {
        return '';
      }
    },
  },
};
</script>

<style></style>
