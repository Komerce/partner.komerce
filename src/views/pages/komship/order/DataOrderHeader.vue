<template>
  <div class="data-order-header-wrapper">
    <b-card-title class="mb-4">
      Data Order
    </b-card-title>
    <div class="data-order-floating-button-wrapper top-right">
      <b-button
        v-if="currentView === 'send'"
        class="org-button header-button mid-part"
        @click="handleAddPickupBtnClicked"
      >
        Ajukan Pickup
      </b-button>
      <b-dropdown
        id="dropdown-1"
        :text="dropdownText"
        class="dropdown-export-wrapper white-button"
        variant="outline-warning"
      >
        <b-dropdown-item>
          <json-excel
            :fields="excelData.header"
            :data="excelData.items"
            :worksheet="`${currentView}-list-data`"
            :name="`komship_${currentView}_order_data_${getTodayDate()}.xls`"
          >
            Export Excel
          </json-excel>
        </b-dropdown-item>
        <b-dropdown-item>
          <json-excel
            :fields="excelData.header"
            :data="excelData.items"
            type="csv"
            :worksheet="`${currentView}-list-data`"
            :name="`komship_${currentView}_order_data_${getTodayDate()}.xls`"
          >
            Export CSV
          </json-excel>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <b-nav class="data-order-nav-wrapper mb-3">
      <b-nav-item
        class="data-order-nav-item"
        :active="(currentView === 'all')"
      >
        <div
          class="transparent-button"
          @click="() => navButtonToggle('all')"
        >
          Semua
        </div>
        <div
          v-if="needToSendCounter && needToSendCounter > 0"
          class="tag-item"
        >
          {{ needToSendCounter > 9 ? needToSendCounter : `0${needToSendCounter}` }}
        </div>
      </b-nav-item>
      <b-nav-item
        class="data-order-nav-item"
        :active="(currentView === 'send')"
      >
        <div
          class="transparent-button"
          @click="() => navButtonToggle('send')"
        >
          Perlu Dikirim
        </div>
      </b-nav-item>
      <b-nav-item
        class="data-order-nav-item"
        :active="(currentView === 'sent')"
      >
        <div
          class="transparent-button"
          @click="() => navButtonToggle('sent')"
        >
          Dikirim
        </div>
      </b-nav-item>
      <b-nav-item
        class="data-order-nav-item"
        :active="(currentView === 'received')"
      >
        <div
          class="transparent-button"
          @click="() => navButtonToggle('received')"
        >
          Diterima
        </div>
      </b-nav-item>
      <b-nav-item
        class="data-order-nav-item"
        :active="(currentView === 'retur')"
      >
        <div
          class="transparent-button"
          @click="() => navButtonToggle('retur')"
        >
          Retur
        </div>
      </b-nav-item>
    </b-nav>
    <div class="data-order-filter-wrapper">
      <div class="search-bar">
        <b-form-input
          v-model="searchFilterText"
          class="search-input"
          type="search"
          placeholder="Cari Nama Produk atau SKU"
          @input="updateSearchFilterText"
        />
        <div class="icon-magnify-glass">
          <b-icon-search />
        </div>
      </div>
      <data-order-filter
        :list-product="listProduct"
        @onFormSubmit="handleFilterFormSubmit"
        @onResetForm="handleFilterFormReset"
      />
    </div>
  </div>
</template>

<script>
import {
  BCardTitle,
  BButton,
  BNav,
  BNavItem,
  BFormInput,
  BIconSearch,
  BDropdown,
  BDropdownItem,
} from 'bootstrap-vue'
import jsonExcel from 'vue-json-excel'
import moment from 'moment'
import DataOrderFilter from './DataOrderFilter.vue'

export default {
  components: {
    BCardTitle,
    BButton,
    BNav,
    BNavItem,
    BFormInput,
    BIconSearch,
    BDropdown,
    BDropdownItem,
    DataOrderFilter,
    jsonExcel,
  },
  props: {
    listProduct: {
      type: Array,
      default: () => [],
    },
    excelData: {
      type: Object,
      default: () => {},
    },
    needToSendCounter: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      currentView: 'all',
      dropdownText: 'Export',
      searchFilterText: '',
      filterForm: {
        date: '',
        product: '',
        method: null,
      },
    }
  },
  methods: {
    getTodayDate() {
      const today = new Date()
      return moment(today).format('D-MMM-YYYY')
    },
    navButtonToggle(val) {
      if (val) {
        this.currentView = val
        this.$emit('onUpdateView', val)
      }
    },
    updateSearchFilterText(val) {
      if (val) {
        this.searchFilterText = val
        this.$emit('onSearchFilter', val)
      }
    },
    handleFilterFormReset(valObj) {
      if (valObj) {
        this.filterForm = valObj
        this.$emit('onResetFilter')
      }
    },
    handleFilterFormSubmit(valObj) {
      if (valObj) {
        this.filterForm = valObj
        const paramsToSend = {
          payment_method: this.filterForm && this.filterForm.method ? this.filterForm.method : '',
          start_date: this.filterForm && this.filterForm.date && this.filterForm.date.start_date ? this.filterForm.date.start_date : '',
          end_date: this.filterForm && this.filterForm.date && this.filterForm.date.end_date ? this.filterForm.date.end_date : '',
        }
        this.$emit('onApplyFilter', paramsToSend)
      }
    },
    handleAddPickupBtnClicked() {
      this.$router.push('ajukan-pickup')
    },
  },
}
</script>
