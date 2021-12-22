<template>
  <section :class="'view-data-order-table-wrapper'">

    <b-table
      :ref="tableRefName"
      :filter="searchText"
      :items="items"
      :fields="fields"
      class="view-data-order-table"
      responsive
    >
      <template
        v-if="currentView === 'send'"
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
          v-if="currentView === 'send'"
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
          v-if="nameCustomer.item.is_komship === 1"
          class="tag-wrapper grey-text"
        >
          Komship
        </div>
        <div
          v-else
          class="tag-wrapper grey-text"
        >
          Non-Komship
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
                  <img src="prodItem.product_image">
                </div>
                <div class="product-name-wrapper">
                  <div class="product-name-content">
                    <div class="product-name-text">
                      {{ prodItem.product_name }}
                    </div>
                    <div class="product-name-variant-wrapper org-text">
                      {{ prodItem.variant_name.replace(' -', ',') }}
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
                <img src="prodItem.product_image">
              </div>
              <div class="product-name-wrapper">
                <div class="product-name-content">
                  <div class="product-name-text">
                    {{ prodItem.product_name }}
                  </div>
                  <div class="product-name-variant-wrapper org-text">
                    {{ prodItem.variant_name.replace(' -', ',') }}
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
              <img src="prodItem.product_image">
            </div>
            <div class="product-name-wrapper">
              <div class="product-name-content">
                <div class="product-name-text">
                  {{ prodItem.product_name }}
                </div>
                <div class="product-name-variant-wrapper org-text">
                  {{ prodItem.variant_name.replace(' -', ',') }}
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
          <div v-if="productData.value.isClose">
            Tutup
            <b-icon-chevron-up
              aria-hidden="true"
            />
          </div>
          <div v-else>
            {{ `${(productData.value.length - 1)} Produk lainnya` }}
            <b-icon-chevron-down
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
          {{ totalData.item.payment_methode }}
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
    <div class="flex justify-between">
      <b-form-group
        label="Per Page"
        label-cols="6"
        label-align="left"
        label-size="sm"
        label-for="sortBySelect"
        class="text-nowrap mb-md-0 mr-1"
      >
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          size="sm"
          inline
          :options="pageOptions"
        />
      </b-form-group>

      <!-- pagination -->
      <div>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          first-number
          last-number
          prev-class="prev-item"
          next-class="next-item"
          class="mb-0"
        >
          <template #prev-text>
            <feather-icon
              icon="ChevronLeftIcon"
              size="18"
            />
          </template>
          <template #next-text>
            <feather-icon
              icon="ChevronRightIcon"
              size="18"
            />
          </template>
        </b-pagination>
      </div>
    </div>

    <p class="mt-3">
      Current Page: {{ currentPage }}
    </p>
  </section>
</template>

<script>
import {
  BTable,
  BButton,
  BIconFront,
  BIconInfoCircle,
  BIconChevronUp,
  BIconChevronDown,
  BIconCheckCircleFill,
  BIconCircle,
  BPopover,
  BFormGroup,
  BFormSelect,
  BCollapse,
  BPagination,
} from 'bootstrap-vue'

export default {
  components: {
    BTable,
    BButton,
    BPagination,
    BIconFront,
    BIconChevronUp,
    BIconChevronDown,
    BIconInfoCircle,
    BFormSelect,
    BIconCheckCircleFill,
    BIconCircle,
    BPopover,
    BFormGroup,
    BCollapse,
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
    currentView: {
      type: String,
      default: 'all',
    },
    searchText: {
      type: String,
      default: '',
    },
    isUseDetailAddress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openId: '',
      selectedOrder: [],
      isCheckedAll: false,
      pageOptions: [5, 10, 20],
    }
  },
  mounted() {
    this.setStartValue()
  },
  methods: {
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
      this.$refs[this.tableRefName].refresh()
    },
    setStartValue() {
      for (let i = 0; i < this.items.length; i += 1) {
        if (this.items[i] && this.items[i].product && this.items[i].product.length && this.items[i].product.length > 0) {
          this.items[i].isChecked = false

          for (let j = 0; j < this.items[i].product.length; j += 1) {
            this.items[i].product.isClose = true
          }
        }
      }
    },
    handleSetCollapseContent(isClose, indexData) {
      this.items[indexData].product.isClose = !isClose
      this.$root.$emit('bv::toggle::collapse', `collapse${indexData}`)
      this.refreshTable()
    },
    updateCheckAllItem(isChecked) {
      for (let i = 0; i < this.items.length; i += 1) {
        if (this.items[i] && this.items[i].product && this.items[i].product.length && this.items[i].product.length > 0) {
          if (isChecked) {
            this.items[i].isChecked = true
          } else {
            this.items[i].isChecked = false
          }
        }
      }

      if (isChecked) {
        this.selectedOrder = this.items
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
      const findItem = this.findObjInArr(this.items, singleItem.order_id)
      if (isAll) {
        this.handleCheckAllItem(isAdd)
      } else if (!isAll && isAdd) {
        const newSingleItem = singleItem
        newSingleItem.isChecked = true
        if (findItem > -1) {
          this.items[findItem].isChecked = true
          this.refreshTable()
        }
        this.selectedOrder.push(newSingleItem)
        if (this.selectedOrder.length === this.items.length) this.isCheckedAll = true
        this.handleSubmitSelectedOrder()
      } else if (!isAll && !isAdd) {
        if (findItem > -1) {
          const findSelected = this.findObjInArr(this.selectedOrder, singleItem.order_id)
          this.selectedOrder.splice(findSelected, 1)
          this.items[findItem].isChecked = false

          if (this.selectedOrder.length !== this.items.length) this.isCheckedAll = false
          this.refreshTable()
          this.handleSubmitSelectedOrder()
        }
      }
    },
    handleSubmitSelectedOrder() {
      this.$emit('onSelectOrder', this.selectedOrder)
    },
  },
}

</script>
