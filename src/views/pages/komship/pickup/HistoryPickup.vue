<template>
  <b-card
    class="history-pickup-main-wrapper"
  >
    <div
      v-if="currentView === 'all'"
      class="history-pickup-title mb-4"
    >
      Riwayat Pickup
    </div>
    <div
      v-else
      class="history-pickup-title top-right"
    >
      Riwayat Pengajuan Pickup
    </div>

    <b-overlay
      variant="light"
      :show="loading"
      spinner-variant="primary"
      blur="0"
      opacity=".5"
      rounded="sm"
    >
      <history-pickup-table
        v-if="currentView === 'all'"
        ref="allPickupTable1"
        :items="items"
        :fields="fields"
        table-ref-name="allPickupTable1"
        @onDetailsClicked="handleDetailsButtonClicked"
      />

      <history-pickup-details
        v-else
        :items="detailsItem"
        :items-arr="itemsArr"
        @onBackButtonClicked="() => handleDetailsButtonClicked('all', {})"
      />
    </b-overlay>

  </b-card>
</template>

<script>
import {
  BCard,
  BOverlay,
} from 'bootstrap-vue'
import HistoryPickupTable from './HistoryPickupTable.vue'
import HistoryPickupDetails from './HistoryPickupDetails.vue'

export default {
  components: {
    BCard,
    HistoryPickupTable,
    HistoryPickupDetails,
    BOverlay,
  },
  data() {
    return {
      loading: false,
      currentView: 'all',
      detailsItem: {},
      fields: [
        { key: 'date_submission', label: 'Waktu Pengajuan' },
        { key: 'pickup_date', label: 'Waktu Penjemputan' },
        { key: 'shipping', label: 'Ekspedisi' },
        { key: 'vehicle', label: 'Kendaraan' },
        { key: 'total_product', label: 'Produk' },
        { key: 'total_order', label: 'Orderan' },
        { key: 'button', label: 'Rincian' },
      ],
      items: [],
      itemsArr: [],
    }
  },
  async mounted() {
    this.reload()
  },
  methods: {
    handleDetailsButtonClicked(view, itemDetails) {
      if (view) this.currentView = view
      if (itemDetails && typeof itemDetails.id !== 'undefined') {
        this.openDetailView(itemDetails)
      }
    },
    genItemsProdArr(itemsOld) {
      const newItems = itemsOld
      newItems.product = itemsOld.data_order
      delete newItems.data_order
      this.itemsArr.push({ ...newItems })
    },
    alertFail(textWarn, isReload) {
      this.$swal({
        title: `<span class="font-weight-bold h4">${textWarn}</span>`,
        imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
        showCloseButton: false,
        focusConfirm: true,
        confirmButtonText: 'Oke',
        customClass: {
          confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
        },
        buttonsStyling: false,
      }).then(() => {
        if (isReload) this.$forceUpdate()
      })
    },
    async reload() {
      this.loading = true
      await this.getProfile()
      await this.getPickup()
    },
    async openDetailView(data) {
      if (data) {
        await this.getPickupDetail(data.id)
      }
    },
    getProfile() {
      return this.$http_komship.post('v1/my-profile').then(response => {
        const { data } = response.data
        // console.log('this.profile', data)
        this.profile = data
      }).catch(() => {
        this.loading = false
        console.log('gagal fetch profile')
      })
    },
    getPickup() {
      return this.$http_komship.get('v1/pickup/history').then(response => {
        const { data } = response.data
        console.log('listAllPickup', data)
        this.items = data
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.alertFail('Unable to get the list of the pickup. Please try again later or contact support.')
      })
    },
    getPickupDetail(pickupId) {
      return this.$http_komship.get(`v1/pickup/history/detail/${pickupId}`).then(response => {
        const { data } = response.data
        // console.log('pickupDetail', data)
        this.detailsItem = data
        if (data && data.data_order && data.data_order.length && data.data_order.length > 0) this.genItemsProdArr(data)
      }).catch(() => {
        this.alertFail('Unable to get the pickup detail. Please try again later or contact support.')
      })
    },
  },
}
</script>

<style lang="scss">
  @import 'history-pickup.scss';
</style>
