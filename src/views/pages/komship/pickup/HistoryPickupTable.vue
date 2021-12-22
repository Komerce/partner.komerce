<template>
  <section :class="'view-all-pickup-table-wrapper'">
    <b-table
      :ref="tableRefName"
      :items="items"
      :fields="fields"
      class="view-all-pickup-table"
      responsive
    >

      <template #cell(order_date)="dateData">
        <div class="view-all-pickup-date-text">
          <div class="date-wrapper">
            {{ dateData.value }}
          </div>
          <div class="time-wrapper grey-text">
            {{ dateData.item.time_submission }}
          </div>
        </div>
      </template>

      <template #cell(pickup_date)="dateData">
        <div class="view-all-pickup-date-text">
          <div class="date-wrapper">
            {{ dateData.value }}
          </div>
          <div class="time-wrapper grey-text">
            {{ dateData.item.pickup_time }}
          </div>
        </div>
      </template>

      <template #cell(button)="buttonData">
        <div
          class="view-all-pickup-button blue-text"
          @click="() => handleShowDetail(buttonData.item)"
        >
          Lihat detail...
        </div>
      </template>

    </b-table>
  </section>
</template>

<script>
import {
  BTable,
} from 'bootstrap-vue'

export default {
  components: {
    BTable,
  },
  props: {
    tableRefName: {
      type: String,
      default: 'tableOne',
    },
    fields: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    }
  },
  methods: {
    handleShowDetail(val) {
      if (val) {
        this.$emit('onDetailsClicked', 'details', val)
      }
    },
    refreshTable() {
      this.$refs[this.tableRefName].refresh()
    },

  },
}

</script>
