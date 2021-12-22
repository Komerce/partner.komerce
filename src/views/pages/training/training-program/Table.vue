<template>
  <card-table
    :endpoint-get-all="endpointGetAll"
    :endpoint-delete="endpointDelete"
    :fields="fields"
  />
</template>

<script>
import { dateFormat } from '@core/mixins/ui/date'
import CardTable from '@/views/components/CardTable.vue'

export default {
  components: {
    CardTable,
  },
  mixins: [dateFormat],
  data() {
    return {
      endpointGetAll: '/trainingProgram',
      endpointDelete: '/trainingProgram/:id',
      fields: [
        { key: 'id', label: 'Id' },
        { key: 'name', label: 'Nama' },
        {
          key: 'quota', label: 'Quota', formatter: value => Number(value),
        },
        {
          key: 'start_date',
          label: 'Start',
          sortable: false,
          formatter: value => {
            if (!value || value === '0000-00-00 00:00:00') return '-'
            return this.dateFormat(value, 'dd mmm yyyy')
          },
        },
        {
          key: 'end_date',
          label: 'End',
          sortable: false,
          formatter: value => {
            if (!value || value === '0000-00-00 00:00:00') return '-'
            return this.dateFormat(value, 'dd mmm yyyy')
          },
        },
        { key: 'training_center.name', label: 'Location' },
        {
          key: 'level',
          label: 'Level',
          sortable: false,
          badge: [
            { basic: 'Dasar', specific: 'Spesifik', mature: 'Pematangan' },
            { basic: 'light-success', specific: 'light-warning', mature: 'light-danger' },
          ],
        },
      ],
    }
  },
}
</script>
