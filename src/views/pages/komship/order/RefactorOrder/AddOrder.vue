<template>
  <b-card>
    <h4>
      <strong>
        Tambah Order
      </strong>
    </h4>

    <b-row>
      <b-col cols="12">
        <b-form-group
          label="Tanggal"
          label-cols-md="2"
          class="ml-1"
        >
          <b-form-datepicker
            id="input-date"
            ref="dp1"
            v-model="dateValue"
            class="add-order-date-button"
            button-only
            selected-variant="primary"
            @context="onChangeDate"
          >
            <b-button
              size="sm"
              variant="light-primary"
              class="btn-icon"
            >
              <img src="@/assets/images/icons/date-picker-icon.svg">
            </b-button>
          </b-form-datepicker>
        </b-form-group>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BFormGroup,
  BFormDatepicker,
  BCol,
  BButton,
} from 'bootstrap-vue'

function changeDate(dateString) {
  if (dateString && dateString !== '') {
    let today = new Date(dateString)
    const dd = today.getDate()
    const monthArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const mm = today.getMonth()
    const yyyy = today.getFullYear()
    today = `${dd} ${monthArr[mm]} ${yyyy}`
    return today
  }
  return dateString
}

export default {
  components: {
    BCard,
    BRow,
    BFormGroup,
    BFormDatepicker,
    BCol,
    BButton,
  },
  data() {
    return {
      dateValue: '',
    }
  },
  methods: {
    onChangeDate(ctx) {
      if (ctx && ctx.activeYMD) {
        this.dateLabel = changeDate(ctx.activeYMD)
        this.$emit('onUpdateDate', ctx.activeYMD)
      }
    },
  },
}
</script>

<style>

</style>
