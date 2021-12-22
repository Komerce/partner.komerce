<template>
  <div>
    <card-table
      ref="cardTable"
      v-model="filter"
      :keyword-key="isFilterNumber ? 'no_partner' : 'brancd'"
      delete-method="get"
      :endpoint-get-all="endpointGetAll"
      :endpoint-delete="endpointDelete"
      :fields="fields"
    />
  </div>
</template>

<script>
import { min, required } from '@core/utils/validations/validations'
import CardTable from '@/views/components/CardTable.vue'

export default {
  components: {
    CardTable,
  },
  data() {
    return {
      endpointGetAll: '/device/pagination',
      endpointDelete: 'device/delete/:id',
      fields: [
        { key: 'id', label: 'Id' },
        { key: 'brancd', label: 'Nama' },
        {
          key: 'partner',
          label: 'Partner',
          formatter: value => `${value.no_partner} - ${value.full_name}`,
        },
        {
          key: 'sdm.full_name',
          label: 'Pemegang Device',
          formatter: value => value ?? 'IT Support',
        },
      ],

      required,
      min,

      filter: '',
    }
  },
  computed: {
    isFilterNumber() {
      return /^-?\d+$/.test(this.filter)
    },
  },
}
</script>
