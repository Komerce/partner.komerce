<template>
  <div>
    <b-card
      class="data-order-main-wrapper"
    >
      <data-order-table
        v-if="!isDetail"
        ref="tableDataOrderOne"
        :fields="tableData.header"
        :items="tableData.items"
        :current-view="currentView"
        :search-text="searchFilterText"
        table-ref-name="tableDataOrder"
        @passDataToParentTable="getDataOrderFromChild"
        @onOpenDetailView="openDetailView"
      />
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BButton,
  BRow,
} from 'bootstrap-vue'
import DataOrderTable from './DataOrderTable.vue'

export default {
  components: {
    BCard,
    DataOrderTable,
  },
  data() {
    return {

      currentView: 'all',
      searchFilterText: '',
      isDetail: false,
      detailOrderData: {},
      profile: {},
      listProduct: [],
      tableItemsAllData: [],
      needToSendCounter: 0,
      filterHeaderOption: {
        all: 'all',
        send: 'perlu dikirim',
        sent: 'dikirim',
        received: 'diterima',
        retur: 'retur',
      },
      tableData: {
        header: [
          { key: 'order_date', label: 'Tanggal Order' },
          { key: 'customer_name', label: 'Pelanggan' },
          { key: 'product', label: 'Produk' },
          { key: 'grand_total', label: 'Total Pembayaran' },
          { key: 'address', label: 'Alamat' },
        ],
        items: [],
      },
      excelData: {
        header: {
          'Tanggal Order': 'order_date',
          Pelanggan: 'customer_name',
          Produk: {
            field: 'product',
            callback: value => `${value[0].product_name}`,
          },
          'Produk Variant': {
            field: 'product',
            callback: value => `${value[0].variant_name}`,
          },
          'Produk Jumlah': {
            field: 'product',
            callback: value => `${value[0].qty}`,
          },
          'Total Harga Produk': 'grand_total',
          'Status Order': 'order_status',
        },
        items: [],
      },
    }
  },
  async mounted() {
    this.reload()
  },
  methods: {
    getSelectOrder(data) {
      console.log(data)
    },
    getDataOrderFromChild(data) {
      console.log('getDataOrderFromChild', data)
      this.$emit('passDataOrderToParent', data)
    },
    updateCurrentView(val) {
      if (val) this.currentView = val
      this.tableData.header = [
        { key: 'order_date', label: 'Tanggal Order' },
        { key: 'customer_name', label: 'Pelanggan' },
        { key: 'product', label: 'Produk' },
        { key: 'grand_total', label: 'Total Pembayaran' },
      ]

      this.excelData.header = {
        'Tanggal Order': 'order_date',
        Pelanggan: 'customer_name',
        Produk: {
          field: 'product',
          callback: value => `${value[0].product_name}`,
        },
        'Produk Variant': {
          field: 'product',
          callback: value => `${value[0].variant_name}`,
        },
        'Produk Jumlah': {
          field: 'product',
          callback: value => `${value[0].qty}`,
        },
        'Total Harga Produk': 'grand_total',
      }

      if (this.currentView === 'all') {
        this.tableData.header.push({ key: 'order_status', label: 'Status' })
        this.tableData.header.push({ key: 'details', label: 'Rincian' })
        Object.assign(this.excelData.header, { 'Status Order': 'order_status' })
      } else if (this.currentView === 'send') {
        this.tableData.header.push({ key: 'district', label: 'Alamat' })
        this.tableData.header.push({ key: 'details', label: 'Rincian' })
        Object.assign(this.excelData.header, { Alamat: 'district' })
      } else if (this.currentView === 'sent') {
        this.tableData.header.push({ key: 'airway_bill', label: 'No Resi' })
        this.tableData.header.push({ key: 'details', label: 'Rincian' })
        Object.assign(this.excelData.header, { 'No Resi': 'airway_bill' })
      } else if (this.currentView === 'received') {
        this.tableData.header.push({ key: 'acc_date', label: 'Tanggal Diterima' })
        this.tableData.header.push({ key: 'details', label: 'Rincian' })
        Object.assign(this.excelData.header, { 'Tanggal Diterima': 'order_date' })
      } else if (this.currentView === 'retur') {
        this.tableData.header.push({ key: 'acc_date', label: 'Tanggal Diterima' })
        this.tableData.header.push({ key: 'details', label: 'Rincian' })
        Object.assign(this.excelData.header, { 'Tanggal Diterima': 'order_date' })
      }
      this.filterDataTableByHeaderType(val)
    },
    filterDataTableByHeaderType(type) {
      const oldItem = this.tableItemsAllData
      let newItem = []
      if (type) {
        if (type === 'all') {
          newItem = oldItem
        } else {
          for (let i = 0; i < oldItem.length; i += 1) {
            if (oldItem[i] && oldItem[i].order_status.toLowerCase() === this.filterHeaderOption[type]) {
              newItem.push(oldItem[i])
            }
          }
        }
        if (type === 'send') {
          newItem = oldItem
        } else {
          for (let i = 0; i < oldItem.length; i += 2) {
            if (oldItem[i] && oldItem[i].order_status.toLowerCase() === this.filterHeaderOption[type]) {
              newItem.push(oldItem[i])
            }
          }
        }
        if (type === 'sent') {
          newItem = oldItem
        } else {
          for (let i = 0; i < oldItem.length; i += 1) {
            if (oldItem[i] && oldItem[i].order_status.toLowerCase() === this.filterHeaderOption[type]) {
              newItem.push(oldItem[i])
            }
          }
        }
        if (type === 'received') {
          newItem = oldItem
        } else {
          for (let i = 0; i < oldItem.length; i += 2) {
            if (oldItem[i] && oldItem[i].order_status.toLowerCase() === this.filterHeaderOption[type]) {
              newItem.push(oldItem[i])
            }
          }
        }
        if (type === 'retur') {
          newItem = oldItem
        } else {
          for (let i = 0; i < oldItem.length; i += 3) {
            if (oldItem[i] && oldItem[i].order_status.toLowerCase() === this.filterHeaderOption[type]) {
              newItem.push(oldItem[i])
            }
          }
        }
      }
      this.tableData.items = newItem
      this.excelData.items = newItem
    },
    handleCountNeedToSendOrder() {
      let needToSendCounterTmp = 0
      for (let i = 0; i < this.tableItemsAllData.length; i += 1) {
        if (this.tableItemsAllData[i] && this.tableItemsAllData[i].order_status.toLowerCase() === 'Perlu dikirim') {
          needToSendCounterTmp += 1
        }
      }
      this.needToSendCounter = needToSendCounterTmp
    },
    updateSearchFilterText(val) {
      if (val) this.searchFilterText = val
    },
    async openDetailView(data) {
      if (data) {
        await this.getOrderDetail(data.order_id)
      }
    },
    exitDetailView() {
      this.isDetail = false
      this.detailOrderData = {}
    },
    handleRedirectToAddOrder() {
      this.$emit('tesEmit')
    },
    async handleApplyFilter(params) {
      this.loading = true
      await this.getOrderByFilter(params)
      this.loading = false
    },
    async handleResetDataDisplayed() {
      this.loading = true
      await this.getOrder()
      this.loading = false
    },
    async reload() {
      this.loading = true
      await this.getProfile()
      await this.getListProductByPartner()
      await this.getOrder()
      this.loading = false
    },
    getProfile() {
      return this.$http_komship.post('v1/my-profile').then(response => {
        const { data } = response.data
        // console.log('this.profile', data)
        this.profile = data
      }).catch(() => {
        console.log('failed to get the profile data')
      })
    },
    getListProductByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/partner-product/${partnerId}`).then(response => {
        const { data } = response.data
        // console.log('this.product', data)
        this.listProduct = data
      }).catch(() => {
        console.log('failed to get the product data by partner')
      })
    },
    getOrder() {
      return this.$http_komship.get(`v1/order/${this.profile.partner_id}`, {
        params: {
          page: this.currentPage,
          order_status: 0,
        },
      }).then(response => {
        const { data } = response.data.data
        // console.log('listAllOrder', data)
        this.tableItemsAllData = data
        this.tableData.items = data
        this.excelData.items = data
        this.handleCountNeedToSendOrder()
      }).catch(() => {
        this.alertFail('Unable to get the list of the order. Please try again later or contact support.')
      })
    },
    getOrderDetail(orderId) {
      return this.$http_komship.get(`v1/order/${this.profile.partner_id}/detail/${orderId}`).then(response => {
        const { data } = response.data
        // console.log('listOrderDetail', data)
        this.detailOrderData = data
        this.isDetail = true
      }).catch(() => {
        this.alertFail('Unable to get the order detail. Please try again later or contact support.')
      })
    },
    getOrderByFilter(values) {
      return this.$http_komship.get(`v1/order/${this.profile.partner_id}`, {
        params: { ...values },
      }).then(response => {
        const { data } = response.data.data
        // console.log('listAllOrderFromFilter', data)
        // this.tableData.items = data
        // this.excelData.items = data
        this.tableItemsAllData = data
        this.filterDataTableByHeaderType(this.currentView)
      }).catch(() => {
        this.alertFail('Unable to get the list of the order. Please try again later or contact support.')
      })
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import 'data-order.scss';
</style>
