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
      <b-row class="justify-content-between">
        <b-col
          cols="auto"
        >
          <div class="p-50 bg-light rounded">
            <b-button
              v-for="(itemsPage, index) in pageOptions"
              :key="index+1"
              class="btn-icon mr-50"
              size="sm"
              :variant="itemsPage === totalPerPage ? 'primary' : 'flat-dark'"
              @click="setPage(itemsPage)"
            >
              {{ itemsPage }}
            </b-button>
          </div>
        </b-col>
        <b-col
          cols="auto"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="totalPerPage"
            first-number
            last-number
            class="pagination-primary"
          >
            <template #prev-text>
              <feather-icon
                size="18"
                icon="ChevronLeftIcon"
              />
            </template>
            <template #next-text>
              <feather-icon
                size="18"
                icon="ChevronRightIcon"
              />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </b-overlay>
  </b-card>
</template>

<script>
import {
  BCard,
  BOverlay,
  BRow,
  BPagination,
  BCol,
  BButton,
} from 'bootstrap-vue'
import HistoryPickupTable from './HistoryPickupTable.vue'
import HistoryPickupDetails from './HistoryPickupDetails.vue'

export default {
  components: {
    BCard,
    HistoryPickupTable,
    HistoryPickupDetails,
    BOverlay,
    BRow,
    BPagination,
    BCol,
    BButton,
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

      pageOptions: [50, 100, 200],

      currentPage: 1,
      totalRows: 0,
      totalPerPage: 50,
    }
  },
  watch: {
    currentPage: {
      handler() {
        this.getPickup().catch(error => {
          console.error(error)
        })
      },
    },
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
        this.profile = data
      }).catch(() => {
        this.loading = false
        // handle error
      })
    },
    getPickup() {
      this.loading = true
      return this.$http_komship.get('v1/pickup/history', {
        params: {
          page: this.currentPage,
          limits: this.totalPerPage,
        },
      }).then(response => {
        const { data } = response.data.data
        this.items = data
        this.totalRows = response.data.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.alertFail('Unable to get the list of the pickup. Please try again later or contact support.')
      })
    },
    getPickupDetail(pickupId) {
      return this.$http_komship.get(`v1/pickup/history/detail/${pickupId}`).then(response => {
        const { data } = response.data
        this.detailsItem = data
        if (data && data.data_order && data.data_order.length && data.data_order.length > 0) this.genItemsProdArr(data)
      }).catch(() => {
        this.alertFail('Unable to get the pickup detail. Please try again later or contact support.')
      })
    },
    async setPage(totalPage) {
      this.totalPerPage = await totalPage
      this.getPickup()
    },
  },
}
</script>

<style lang="scss">
  @import 'history-pickup.scss';
</style>
