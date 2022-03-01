<template>
  <div>
    <b-overlay
      variant="light"
      :show="loading"
      spinner-variant="primary"
      blur="0"
      opacity=".5"
      rounded="sm"
    >
      <section :class="'view-data-order-table-wrapper'">
        <b-row class="justify-content-center mb-1">
          <h3 class="text-black">
            <strong>
              Pilih orderan
            </strong>
          </h3>
        </b-row>
        <b-table
          ref="tableRefName"
          :items="tableData.items"
          :fields="tableData.header"
          :per-page="perPage"
          class="view-data-order-table"
          empty-text="Tidak ada data untuk ditampilkan."
          responsive
        >

          <template
            #head(order_date)="data"
          >
            <div class="all-check-data-order">
              <b-icon-check-circle-fill
                v-if="isCheckedAll"
                class="data-order-button-check"
                aria-hidden="true"
                @click="() => handleSelectOrder({}, false, true)"
              />
              <b-icon-circle
                v-else
                class="data-order-button-uncheck"
                aria-hidden="true"
                @click="() => handleSelectOrder({}, true, true)"
              />
              <span>{{ data.label }}</span>
            </div>
          </template>

          <template #cell(order_date)="dateData">
            <div
              class="all-check-data-order-item"
            >
              <b-icon-check-circle-fill
                v-if="dateData.item.isChecked"
                class="data-order-button-check"
                aria-hidden="true"
                @click="() => handleSelectOrder(dateData.item, false, false)"
              />
              <b-icon-circle
                v-else
                class="data-order-button-uncheck"
                aria-hidden="true"
                @click="() => handleSelectOrder(dateData.item, true, false)"
              />
            </div>
            <div class="all-check-data-order-date-text">
              <div class="date-wrapper">
                {{ getDate(dateData.value) }}
              </div>
              <div class="time-wrapper grey-text">
                {{ getTime(dateData.value) }}
              </div>
            </div>
          </template>

          <template #cell(customer_name)="nameCustomer">
            <div class="name-wrapper">
              {{ nameCustomer.value }}
            </div>
            <div
              class="tag-wrapper grey-text"
            >
              Komship
            </div>
          </template>

          <template #cell(product)="productData">
            <div v-if="productData.value.length > 1">
              <div
                v-for="(prodItem, prodIndex) in productData.value"
                :key="prodIndex+'prodItem'"
                class="product-item-wrapper"
              >
                <div v-if="prodIndex !== 0">
                  <b-collapse
                    :id="`collapse${productData.index}`"
                    class="mt-2"
                  >
                    <div class="product-name-img-wrapper">
                      <img :src="prodItem.product_image">
                    </div>
                    <div class="product-name-wrapper">
                      <div class="product-name-content">
                        <div class="product-name-text">
                          {{ prodItem.product_name }}
                        </div>
                        <div v-if="prodItem.variant_name !== '0' || prodItem.variant_name !== ''">
                          <div class="product-name-variant-wrapper org-text">
                            {{ prodItem.variant_name.replace(' -', ',') }}
                          </div>
                        </div>
                        <div v-else>
                          <span class="text-primary">
                            <strong>
                              Tidak ada variasi
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div class="product-name-qty">
                        {{ `x${prodItem.qty}` }}
                      </div>
                    </div>
                  </b-collapse>
                </div>
                <div v-else>
                  <div class="product-name-img-wrapper">
                    <img :src="prodItem.product_image">
                  </div>
                  <div class="product-name-wrapper">
                    <div class="product-name-content">
                      <div class="product-name-text">
                        {{ prodItem.product_name }}
                      </div>
                      <div v-if="prodItem.variant_name !== '0' && prodItem.variant_name !== ''">
                        <div class="product-name-variant-wrapper org-text">
                          {{ prodItem.variant_name.replace(' -', ',') }}
                        </div>
                      </div>
                      <div v-else>
                        <span class="text-primary">
                          <strong>
                            Tidak ada variasi
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div class="product-name-qty">
                      {{ `x${prodItem.qty}` }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <div
                v-for="(prodItem, prodIndex) in productData.value"
                :key="prodIndex+'prodItem'"
                class="product-item-wrapper"
              >
                <div class="product-name-img-wrapper">
                  <img :src="prodItem.product_image">
                </div>
                <div class="product-name-wrapper">
                  <div class="product-name-content">
                    <div class="product-name-text">
                      {{ prodItem.product_name }}
                    </div>
                    <div v-if="prodItem.variant_name !== '0' && prodItem.variant_name !== ''">
                      <div class="product-name-variant-wrapper org-text">
                        {{ prodItem.variant_name.replace(' -', ',') }}
                      </div>
                    </div>
                    <div v-else>
                      <span class="text-primary">
                        <strong>
                          Tidak ada variasi
                        </strong>
                      </span>
                    </div>
                  </div>
                  <div class="product-name-qty">
                    {{ `x${prodItem.qty}` }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="productData.value.length > 1"
              class="minmax-button-wrapper"
              @click="() => handleSetCollapseContent(productData.value.isClose, productData.index)"
            >
              <div v-if="!productData.value.isClose">
                {{ `${(productData.value.length - 1)} Produk lainnya` }}
                <b-icon-chevron-down
                  aria-hidden="true"
                />
              </div>
              <div v-else>
                Tutup
                <b-icon-chevron-up
                  aria-hidden="true"
                />
              </div>
            </div>
          </template>

          <template #cell(grand_total)="totalData">
            <div class="price-wrapper">
              {{ `Rp ${numberWithCommas(totalData.value)}` }}
            </div>
            <div
              v-if="totalData.item.payment_method === 'COD'"
              class="label-wrapper"
            >
              {{ totalData.item.payment_method }}
            </div>
            <div
              v-else
              class="label-wrapper"
            >
              Transfer
            </div>
            <div
              v-if="totalData.item.payment_method !== 'COD'"
              :id="`popoverTable${totalData.item.order_id}`"
              class="tooltip-wrapper"
              @click="() => handleShowPopOver(`popoverTable${totalData.item.order_id}`)"
            >
              <b-icon-info-circle />
            </div>
            <b-popover
              v-if="totalData.item.payment_method !== 'COD'"
              :id="`popoverTable${totalData.item.order_id}`"
              :ref="`popoverTable${totalData.item.order_id}`"
              :target="`popoverTable${totalData.item.order_id}`"
              triggers="click"
            >
              <div class="data-order-table-pop-over">
                <b-form-group
                  label="Nama Bank:"
                  :label-for="`labelName-${totalData.item.order_id}`"
                >
                  <div
                    v-if="totalData && totalData.item && totalData.item.bank"
                    :id="`labelName-${totalData.item.order_id}`"
                  >
                    {{ totalData.item.bank }}
                  </div>
                </b-form-group>
                <b-form-group
                  label="No Rekening:"
                  :label-for="`norek-${totalData.item.order_id}`"
                >
                  <div
                    v-if="totalData && totalData.item && totalData.item.bank_account_no"
                    :id="`norek-${totalData.item.order_id}`"
                  >
                    {{ totalData.item.bank_account_no }}
                  </div>
                </b-form-group>
                <b-form-group
                  label="Pemilik Rekening"
                  :label-for="`ownerRek-${totalData.item.order_id}`"
                >
                  <div
                    v-if="totalData && totalData.item && totalData.item.bank_account_name"
                    :id="`ownerRek-${totalData.item.order_id}`"
                  >
                    {{ totalData.item.bank_account_name }}
                  </div>
                </b-form-group>
              </div>
            </b-popover>
          </template>

          <template #cell(district)="addressData">
            <div class="address-wrapper">
              {{ addressData.value }}
            </div>
            <div
              v-if="isUseDetailAddress"
              class="address-details-wrapper"
            >
              {{ addressData.item.detail_address }}
            </div>
          </template>

          <template #cell(airway_bill)="resiData">
            <div class="resi-wrapper">
              <div class="resi-content">
                {{ resiData.value }}
              </div>
              <div
                v-if="resiData.value"
                class="resi-content-icon"
                @click="() => handleCopy(resiData.value)"
              >
                <b-icon-front />
              </div>
            </div>
          </template>

          <template #cell(acc_date)="accDateData">
            <div class="date-wrapper">
              {{ getDate(accDateData.item.order_date) }}
            </div>
          </template>

          <template #cell(address)="data">
            <b-row>
              <span class="text-black">
                <strong>
                  {{ data.item.district }}
                </strong>
              </span>, <span class="text-black"><strong>{{ data.item.detail_address }}</strong></span>
            </b-row>
          </template>

          <template #cell(details)="detailsData">
            <div class="details-wrapper">
              <b-button
                class="detail-button"
                variant="outline-primary"
                @click="() => handleShowDetail(detailsData.item)"
              >
                Lihat Detail
              </b-button>
            </div>
          </template>

        </b-table>

        <b-row class="justify-content-between mt-5 mx-50 mb-2">
          <div>
            <span class="text-black mr-1">
              <strong>
                List per halaman:
              </strong>
            </span>
            <b-button
              v-for="(itemsPage, index) in valuePerpage"
              :key="index+1"
              :variant="valuePerpageIsActive === itemsPage.value ? 'primary' : 'flat-dark'"
              class="btn-icon mr-1"
              size="sm"
              @click="changePerpage(itemsPage)"
            >
              {{ itemsPage.value }}
            </b-button>
          </div>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalItems"
            :per-page="perPage"
            first-number
            last-number
          />
        </b-row>

        <b-row class="justify-content-end pb-50 mr-50">
          <b-button
            variant="primary"
            @click="getSelectedOrder"
          >
            Simpan
          </b-button>
        </b-row>
      </section>
    </b-overlay>
  </div>
</template>

<script>
import {
  BCard,
  BOverlay,
  BTable,
  BButton,
  BIconFront,
  BIconChevronUp,
  BIconChevronDown,
  BIconInfoCircle,
  BIconCheckCircleFill,
  BIconCircle,
  BPopover,
  BFormGroup,
  BCollapse,
  BRow,
  // BCol,
  BPagination,
} from 'bootstrap-vue'
// import DataOrderTable from './DataOrderTable.vue'

export default {
  components: {
    // DataOrderTable,
    BOverlay,
    BTable,
    BButton,
    BIconFront,
    BIconChevronUp,
    BIconChevronDown,
    BIconInfoCircle,
    BIconCheckCircleFill,
    BIconCircle,
    BPopover,
    BFormGroup,
    BCollapse,
    BRow,
    // BCol,
    BPagination,
  },
  props: {
    passAddressId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: true,

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
        dataPagination: [],
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
      tableDataPagination: [],

      openId: '',
      selectedOrder: [],
      isCheckedAll: false,
      itemOrderTable: [],

      valuePerpage: [
        {
          value: 50,
        },
        {
          value: 100,
        },
        {
          value: 200,
        },
      ],

      currentPage: 1,
      perPage: 50,
      totalItems: 0,

      valuePerpageIsActive: 50,
    }
  },
  watch: {
    currentPage: {
      handler() {
        this.getOrder().catch(error => {
          console.error(error)
        })
      },
    },
  },
  async mounted() {
    this.reload()
  },
  methods: {
    getSelectOrder(data) {
      // handle error
    },
    getDataOrderFromChild(data) {
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
        if (this.tableItemsAllData[i] && this.tableItemsAllData[i].order_status.toLowerCase() === 'Diajukan') {
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
        this.profile = data
      }).catch(() => {
        // handle error
      })
    },
    getListProductByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/partner-product/${partnerId}`).then(response => {
        const { data } = response.data
        this.listProduct = data
      }).catch(() => {
        // handle error
      })
    },
    getOrder() {
      this.loading = true
      return this.$http_komship.get(`v1/order/${this.profile.partner_id}`, {
        params: {
          page: this.currentPage,
          order_status: 'Diajukan',
          partner_address_id: this.passAddressId,
          total_per_page: this.perPage,
        },
      }).then(response => {
        const { data } = response.data.data
        this.tableItemsAllData = data
        this.tableData.items = data
        this.excelData.items = data
        this.totalItems = response.data.data.total
        this.handleCountNeedToSendOrder()
        this.loading = false
      }).catch(() => {
        this.alertFail('Unable to get the list of the order. Please try again later or contact support.')
        this.loading = false
      })
    },
    getOrderDetail(orderId) {
      return this.$http_komship.get(`v1/order/${this.profile.partner_id}/detail/${orderId}`).then(response => {
        const { data } = response.data
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
        this.tableItemsAllData = data
        this.filterDataTableByHeaderType(this.currentView)
      }).catch(() => {
        this.alertFail('Unable to get the list of the order. Please try again later or contact support.')
      })
    },
    getDate(dateVal) {
      if (dateVal) {
        // let today = dateVal.split(' ')
        // let month = today[1]
        // const monthArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        // month = (monthArr.indexOf(month) + 1) > 9 ? (monthArr.indexOf(month) + 1) : `0${(monthArr.indexOf(month) + 1)}`
        // today = `${today[0]}-${month}-${today[2]}`
        const today = dateVal.split(' ')[0]
        return today
      }
      return dateVal
    },
    getTime(dateVal) {
      if (dateVal) {
        const today = dateVal.split(' ')
        let time = today[today.length - 1].split(':')
        time = `${time[0]}.${time[1]}`
        return time
      }
      return dateVal
    },
    numberWithCommas(x) {
      if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.')
      return x
    },
    handleCopy(val) {
      if (val) navigator.clipboard.writeText(val)
    },
    handleShowPopOver(val) {
      if (val) {
        if (val === this.openId) {
          this.$root.$emit('bv::hide::popover', val)
        } else {
          this.openId = val
          this.$root.$emit('bv::show::popover', val)
        }
      }
    },
    handleShowDetail(val) {
      if (val) {
        this.$emit('onOpenDetailView', val)
      }
    },
    addTotalItem(itemSelected, param) {
      this.$emit('onAddTotalItem', itemSelected, param)
    },
    handleShowVariation(productId, selectedDataVariation) {
      this.$emit('onShowPopUp', productId, selectedDataVariation)
    },
    refreshTable() {
      this.$refs.tableRefName.refresh()
    },
    setStartValue() {
      for (let i = 0; i < this.tableData.items.length; i += 1) {
        if (this.tableData.items[i] && this.tableData.items[i].product && this.tableData.items[i].product.length && this.tableData.items[i].product.length > 0) {
          this.tableData.items[i].isChecked = false

          for (let j = 0; j < this.tableData.items[i].product.length; j += 1) {
            this.tableData.items[i].product.isClose = true
          }
        }
      }
    },
    handleSetCollapseContent(isClose, indexData) {
      this.tableData.items[indexData].product.isClose = !isClose
      this.$root.$emit('bv::toggle::collapse', `collapse${indexData}`)
      this.refreshTable()
    },
    updateCheckAllItem(isChecked) {
      for (let i = 0; i < this.tableData.items.length; i += 1) {
        if (this.tableData.items[i] && this.tableData.items[i].product && this.tableData.items[i].product.length && this.tableData.items[i].product.length > 0) {
          if (isChecked) {
            this.tableData.items[i].isChecked = true
          } else {
            this.tableData.items[i].isChecked = false
          }
        }
      }

      if (isChecked) {
        this.selectedOrder = this.tableData.items
        this.handleSubmitSelectedOrder()
      }
    },
    handleCheckAllItem(isAdd) {
      if (isAdd) {
        this.updateCheckAllItem(true)
      } else {
        this.updateCheckAllItem(false)
        this.selectedOrder = []
        this.handleSubmitSelectedOrder()
      }
      this.isCheckedAll = !this.isCheckedAll
    },
    findObjInArr(itemArr, itemId) {
      let index = -1
      for (let i = 0; i < itemArr.length; i += 1) {
        if (itemArr[i].order_id === itemId) {
          index = i
        }
      }
      return index
    },
    handleSelectOrder(singleItem, isAdd, isAll) {
      const findItem = this.findObjInArr(this.tableData.items, singleItem.order_id)
      if (isAll) {
        this.handleCheckAllItem(isAdd)
      } else if (!isAll && isAdd) {
        const newSingleItem = singleItem
        newSingleItem.isChecked = true
        if (findItem > -1) {
          this.tableData.items[findItem].isChecked = true
          this.refreshTable()
        }
        this.selectedOrder.push(newSingleItem)
        if (this.selectedOrder.length === this.tableData.length) this.isCheckedAll = true
        this.handleSubmitSelectedOrder()
      } else if (!isAll && !isAdd) {
        if (findItem > -1) {
          const findSelected = this.findObjInArr(this.selectedOrder, singleItem.order_id)
          this.selectedOrder.splice(findSelected, 1)
          this.tableData.items[findItem].isChecked = false
          if (this.selectedOrder.length !== this.tableData.items.length) this.isCheckedAll = false
          this.refreshTable()
          this.handleSubmitSelectedOrder()
        }
      }
    },
    handleSubmitSelectedOrder() {
      this.$emit('onSelectOrder', this.selectedOrder)
    },
    getSelectedOrder() {
      this.$emit('passDataToParent', this.selectedOrder)
      this.$bvModal.hide('popupOrder')
    },
    changePerpage(data) {
      this.valuePerpageIsActive = data.value
      this.perPage = data.value
      this.getOrder()
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import 'data-order.scss';
</style>
