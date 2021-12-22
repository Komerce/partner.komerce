<template>
  <div class="data-order-header-filter-wrapper">
    <b-col
      cols="3"
    >

      <b-dropdown
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        right
        no-caret
        variant="primary"
      >
        <template
          #button-content
        >
          <img
            src="@/assets/images/icons/filter-icon-kompship.png"
          >
        </template>
        <b-dropdown-form
          style="width: 314px;"
        >
          <b-form>
            <b-row>
              <b-col
                cols="12"
                class="ml-50"
              >
                <b-form-group
                  label="Tanggal"
                  label-for="dateInput"
                >
                  <date-range-picker
                    id="dateInput"
                    ref="dateInput"
                    v-model="dateRange"
                    :locale-data="locale"
                    :opens="'left'"
                    :ranges="ranges"
                    class="w-100 mr-1"
                  >
                    <template v-slot:input="picker">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="mr-2">{{ formatDate(picker.startDate) }} - {{ formatDate(picker.endDate) }}</span>
                        <img src="@/assets/images/icons/date-picker-icon.svg">
                      </div>
                    </template>
                  </date-range-picker>
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                class="ml-50"
              >
                <b-form-group
                  label="Produk"
                  label-for="productInput"
                >
                  <v-select
                    id="productInput"
                    class="add-order-product-input"
                    label="product_name"
                    label-cols-md="2"
                    :options="listProduct"
                    @input="onAddProduct"
                  />
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                class="ml-50"
              >
                <b-form-group
                  label="Metode Pembayaran"
                  label-for="metodeInput"
                >
                  <v-select
                    id="metodeInput"
                    label="value"
                    label-cols-md="2"
                    :value="selectedExp"
                    :options="listExpedition"
                    @input="onAddExpedition"
                  />
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                class="ml-50 mt-1"
              >
                <b-button
                  class="sm-gap-r white-button"
                  variant="outline-warning"
                  @click="resetFilter"
                >
                  Reset
                </b-button>
                <b-button
                  variant="warning org-button"
                  @click="submitFilter"
                >
                  Terapkan
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-dropdown-form>
      </b-dropdown>
    </b-col>
  </div>
</template>

<script>
import {
  BButton,
  BCol,
  BRow,
  BForm,
  BDropdownForm,
  BFormGroup,
  // BFormInput,
  BDropdown,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import moment from 'moment'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BButton,
    BFormGroup,
    BDropdown,
    BCol,
    BForm,
    BRow,
    BDropdownForm,
    DateRangePicker,
    vSelect,
    // BFormInput,
  },
  directives: {
    Ripple,
  },
  props: {
    listProduct: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const last7 = new Date()
    last7.setDate(today.getDate() - 7)
    last7.setHours(0, 0, 0, 0)

    const last30 = new Date()
    last30.setDate(today.getDate() - 30)
    last30.setHours(0, 0, 0, 0)

    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDateOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return {
      selectedExp: ['COD'],
      chooseProduct: '',
      orderku: '',
      dateRange: {
        startDate: today,
        endDate: today,
      },
      ranges: {
        '7 Hari Terakhir': [last7, today],
        '30 Hari Terakhir': [last30, today],
        'Bulan Ini': [firstDateOfMonth, lastDateOfMonth],
      },
      locale: {
        format: 'dd/mm/yyyy',
      },
      listExpedition: [
        { key: 'code', value: 'COD' },
        { key: 'transfer', value: 'BANK TRANSFER' },
      ],
      filterForm: {
        date: '',
        product: '',
        method: null,
      },
    }
  },
  methods: {
    filterorder() {
      console.log('tes')
    },
    formatDate(d) {
      return moment(d).format('D MMM YYYY')
    },
    formatDateByYear(d) {
      return moment(d).format('YYYY-MM-D')
    },
    handleShowFilter(popOverId) {
      this.$root.$emit('bv::show::popover', popOverId)
    },
    handleHideFilter(popOverId = 'popoverDataOrderFilter1') {
      this.$root.$emit('bv::hide::popover', popOverId)
    },
    onAddExpedition(itemSelected) {
      if (itemSelected && itemSelected.value) {
        if (this.selectedExp.length === 0) {
          this.selectedExp.push(itemSelected.value)
        } else {
          this.selectedExp.splice(0, 1)
          this.selectedExp.push(itemSelected.value)
        }
      } else {
        this.selectedExp = []
      }
    },
    onAddProduct(itemSelected) {
      if (itemSelected && itemSelected.product_name) this.chooseProduct = itemSelected.product_name
    },
    submitFilter() {
      const formattedDateRange = {
        start_date: this.formatDateByYear(this.dateRange.startDate),
        end_date: this.formatDateByYear(this.dateRange.endDate),
      }
      this.filterForm = {
        date: formattedDateRange,
        product: this.chooseProduct,
        method: this.selectedExp && this.selectedExp.length > 0 ? this.selectedExp[0] : '',
      }
      this.$emit('onFormSubmit', this.filterForm)
      this.handleHideFilter()
    },
    resetFilter() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      this.chooseProduct = ''
      this.selectedExp = []
      this.dateRange = {
        startDate: today,
        endDate: today,
      }
      this.filterForm = {
        date: {},
        product: '',
        method: '',
      }
      this.$emit('onResetForm', this.filterForm)
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
</style>
