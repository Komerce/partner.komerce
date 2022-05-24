<template>
  <div class="wrappertab__content">
    <div
      class="d-flex justify-content-end"
    >
      <div class="mr-1">
        <flat-pickr
          v-model="rangeDate"
          class="form-control"
          :config="configRangeDate"
        />
      </div>
      <v-select
        v-model="selected"
        :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
        label="title"
        :options="option"
        style="width: 180px;"
      />
    </div>
    <div class="mt-2">
      <b-table
        striped
        hover
        responsive
        :per-page="0"
        :current-page="currentPage"
        :items="items"
        :busy.sync="isLoadTable"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        :filter="filter"
        :filter-included-fields="filterOn"
        @filtered="onFiltered"
      >
        <!-- A virtual composite column -->
        <!-- <template #cell(transreturn)="data">
          <b>
            {{ data.item.trans }}
          </b>
          <br>
          <span class="text-secondary">
            {{ data.item.trans_return }}
          </span>
        </template> -->
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner
              class="align-middle"
            />
            <strong> Loading...</strong>
          </div>
        </template>
      </b-table>
      <div class="d-flex justify-between ">
        <div>
          <span class="mr-1">List per halaman</span>
          <b-button
            v-for="page in pageOptions"
            :key="page"
            :variant="page === perPage ? 'primary' : 'light'"
            size="sm"
            class="btnPage"
            @click="setperPage(page)"
          >
            {{ page }}
          </b-button>
        </div>
        <b-col
          cols=""
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            class="my-0"
            aria-controls="my-table"
          />
        </b-col>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BTable,
  BSpinner,
  BCol,
  BButton,
  BPagination,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  today,
  last30,
} from '@/store/helpers'

export default {
  components: {
    BTable,
    BSpinner,
    BCol,
    BButton,
    BPagination,
    vSelect,
    flatPickr,
  },
  props: {
    shipmentData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rangeDate: '',
      payment_method: '',
      selected: { title: '' },
      option: this.shipmentData,
      isLoadTable: true,
      perPage: 10,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      items: [],
      fields: [
        {
          key: 'partner_name',
          label: 'Nama',
          sortable: true,
        },
        {
          key: 'district',
          label: 'Kota',
          sortable: true,
        },
        // A virtual column made up from two fields
        // {
        //   key: 'transreturn',
        //   label: 'Transaksi',
        // },
        {
          key: 'shipping_profit',
          label: 'Profit Ongkir COD',
          sortable: true,
          formatter: val => (`Rp${new Intl.NumberFormat('id-ID').format(val)}`),
        },
        {
          key: 'net_profit',
          label: 'Profit Ongkir Non COD',
          sortable: true,
          formatter: val => (`Rp${new Intl.NumberFormat('id-ID').format(val)}`),
        },
      ],
      configRangeDate: {
        mode: 'range',
        maxDate: 'today',
        defaultDate: [last30, today],
      },
      paramsCallAPI: {
        start_date: null,
        end_date: null,
        payment_method: null,
        shipping: null,
        page: null,
      },
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }))
    },
  },
  watch: {
    rangeDate: {
      handler(val) {
        // calling api
        if (val.indexOf('to') !== -1) {
          const [startDate, endDate] = val.split(' to ')
          this.paramsCallAPI.start_date = startDate
          this.paramsCallAPI.end_date = endDate
          this.paramsCallAPI.page = null
        } else {
          this.paramsCallAPI.start_date = val
          this.paramsCallAPI.end_date = val
          this.paramsCallAPI.page = null
        }
      },
    },
    selected: {
      handler(val) {
        this.paramsCallAPI.shipping = val.title
        this.paramsCallAPI.page = null
      },
    },
    currentPage: {
      handler(val) {
        this.paramsCallAPI.page = val
      },
    },
    paramsCallAPI: {
      handler() {
        this.fetchData()
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.isLoadTable = true
      const endpoint = '/v1/admin/finance/income'
      this.$http_komship.get(endpoint, {
        params: {
          ...this.paramsCallAPI,
        },
      })
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          this.$emit('totalCodFunc', parseData.profit.total_shipping_profit)
          this.$emit('totalOngkirFunc', parseData.profit.profit_cod)
          if (Array.isArray(parseData.income) && parseData.income.length === 0) {
            this.items = []
            this.totalRows = 0
          } else {
            this.items = parseData.income.data
            this.totalRows = parseData.income.total
          }
          this.isLoadTable = false
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text: 'Unable to load the table data. Please try again later or contact support.',
              variant: 'danger',
            },
          })
          this.isLoadTable = false
        })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    setperPage(pagedt) {
      this.perPage = pagedt
    },
  },
}
</script>
