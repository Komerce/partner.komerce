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
      endpointGetAll: '/skDocument/skTeamLeadAssignment',
      fields: [
        { key: 'skNumbers', label: 'No. SK' },
        {
          key: 'releaseDates',
          label: 'Tanggal Diterbitkan',
          formatter: val => filters.date(Date.parse(val)),
        },
      ],
    }
  },
}
</script>
