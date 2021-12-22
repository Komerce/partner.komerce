<template>
  <card-table
    :endpoint-get-all="endpointGetAll"
    :fields="fields"
  />
</template>

<script>
import CardTable from '@/views/components/CardTable.vue'
import filters from '@/libs/filters'

export default {
  components: {
    CardTable,
  },
  data() {
    return {
      endpointGetAll: '/skDocument/skPartnerAssignment',
      fields: [
        { key: 'sk_number', label: 'No. SK' },
        {
          key: 'release_date',
          label: 'Tanggal Diterbitkan',
          formatter: val => filters.date(Date.parse(val)),
        },
      ],
    }
  },
}
</script>
