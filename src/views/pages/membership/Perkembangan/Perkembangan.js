import {
  BTable,
  BCard,
  BSpinner,
  BCardBody,
} from 'bootstrap-vue'
import filterLib from '@/libs/filters'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

const formatDate = 'YYYY-MM-DDTHH:mm:ss\\Z'
let timeoutCallApi = null
export default {
  components: {
    BTable,
    BCard,
    BSpinner,
    BCardBody,
    DateRangePicker,
  },
  data() {
    const today = new Date()
    today.setHours(23, 59, 59, 0)

    return {
      loadDataAwal: true,
      search: '',
      locale: {
        format: 'dd/mm/yyyy',
        daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      },
      ranges: {
        '7 Hari Terakhir': [this.$moment().subtract(7, 'days').startOf('day').toDate(), today],
        '30 Hari Terakhir': [this.$moment().subtract(30, 'days').startOf('day').toDate(), today],
        '2 Bulan Terakhir': [this.$moment().subtract(60, 'days').startOf('day').toDate(), today],
        'Bulan Ini': [this.$moment().startOf('month').toDate(), today],
      },
      rangeDate: {
        startDate: this.$moment().subtract(30, 'days').startOf('day').toDate(),
        endDate: today,
      },
      isLoadTable: false,
      perPage: 50,
      pageOptions: [50, 100, 200, 500],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      items: [
        {
          partner_id: 201,
          full_name: 'Tatausahaku',
          email: 'asdkmaksmdkasmdk@mail.com',
          no_hp: '12739741293879141',
          registered: '2020-05-29 20:24:38',
          email_verified_at: '2020-05-29 21:24:38',
          is_onboarding: 1,
          first_product: '2021-05-01 21:24:38',
          first_order: '2021-07-01 21:24:38',
          first_pickup: '2021-09-01 21:24:38',
          last_pickup: '2021-09-02 21:24:38',
          total_order: 188,
          total_transaksi: 13494799,
          total_ongkir: 20020002020,
          total_revenue: 1020,
        },
      ],
      fields: [
        {
          key: 'full_name',
          label: 'Nama',
          sortable: true,
          stickyColumn: true,
          thClass: 'text-black',
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'no_hp',
          label: 'No. HP',
          // stickyColumn: true,
          thClass: 'text-black',
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'registered',
          label: 'Registrasi',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'cell__custom',
          formatter: val => (this.$moment(val).isValid() ? this.$moment(val).format('DD MMMM YYYY') : val),
          thStyle: {
            color: 'black',
            minWidth: '190px',
            verticalAlign: 'middle',
            textTransform: 'capitalize',
          },
        },
        {
          key: 'email_verified_at',
          label: 'Verifikasi Email',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'text-capitalize',
          formatter: val => (this.$moment(val).isValid() ? this.$moment(val).format('DD MMMM YYYY') : val),
          thStyle: {
            color: 'black',
            minWidth: '190px',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'is_onboarding',
          label: 'On Boarding',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'text-capitalize',
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'first_product',
          label: '1st Produk',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'text-capitalize',
          formatter: val => (this.$moment(val).isValid() ? this.$moment(val).format('DD MMMM YYYY') : val),
          thStyle: {
            color: 'black',
            minWidth: '190px',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'first_order',
          label: '1st Order',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'text-capitalize',
          formatter: val => (this.$moment(val).isValid() ? this.$moment(val).format('DD MMMM YYYY') : val),
          thStyle: {
            color: 'black',
            minWidth: '190px',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'first_pickup',
          label: '1st Pickup',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'text-capitalize',
          formatter: val => (this.$moment(val).isValid() ? this.$moment(val).format('DD MMMM YYYY') : val),
          thStyle: {
            color: 'black',
            minWidth: '190px',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'last_pickup',
          label: 'Last Pickup',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'text-capitalize',
          formatter: val => (this.$moment(val).isValid() ? this.$moment(val).format('DD MMMM YYYY') : val),
          thStyle: {
            color: 'black',
            minWidth: '190px',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'total_order',
          label: 'Total Order',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'cell__custom',
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'total_transaksi',
          label: 'Total Transaksi',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'cell__custom',
          formatter: val => `${filterLib.rupiah(val)},-`,
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'total_ongkir',
          label: 'Total Ongkir',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'cell__custom',
          formatter: val => `${filterLib.rupiah(val)},-`,
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
        {
          key: 'total_revenue',
          label: 'Total Revenue',
          sortable: true,
          class: 'text-black text-right',
          tdClass: 'cell__custom',
          formatter: val => `${filterLib.rupiah(val)},-`,
          thStyle: {
            color: 'black',
            textTransform: 'capitalize',
            verticalAlign: 'middle',
          },
        },
      ],
      paramsCallAPI: {
        start_date: this.$moment().subtract(30, 'days').startOf('day').format(formatDate),
        end_date: this.$moment().endOf('day').format(formatDate),
        page: null,
        limits: 50,
      },
      filteredItems: [],
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
        // calling api for table and update data table
        if (val) {
          const { startDate, endDate } = val
          this.paramsCallAPI.start_date = this.$moment(startDate).startOf('day').format(formatDate)
          this.paramsCallAPI.end_date = this.$moment(endDate).endOf('day').format(formatDate)
        } else {
          this.paramsCallAPI.start_date = this.$moment(val.startDate).startOf('day').format(formatDate)
          this.paramsCallAPI.end_date = this.$moment(val.endDate).endOf('day').format(formatDate)
        }
      },
      deep: true,
    },
    perPage: {
      handler(val) {
        this.search = ''
        this.paramsCallAPI.limits = val
      },
    },
    currentPage: {
      handler(val) {
        this.search = ''
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
      // params dikasih sory_by=email dan order_by=asc atau desc ?
      this.isLoadTable = true
      clearTimeout(timeoutCallApi)
      this.$http_komship({
        methods: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/v1/admin/partnerGrowth',
        params: {
          ...this.paramsCallAPI,
        },
      })
        .then(resp => {
          const parseData = JSON.parse(JSON.stringify(resp.data.data))
          if (Array.isArray(parseData.data) && parseData.data.length === 0) {
            this.items = []
            this.filteredItems = []
            this.totalRows = 0
          } else {
            // last
            const dtitems = parseData.data.sort((a, b) => b.partner_id - a.partner_id)
            this.items = dtitems
            this.filteredItems = dtitems
            this.totalRows = parseData.last_page * this.perPage
            timeoutCallApi = setTimeout(this.fetchData, 180000)
          }
          this.loadDataAwal = false
          this.isLoadTable = false
        })
        .catch(e => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text: 'Unable to load the table data. Please try again later or contact support.',
              variant: 'danger',
            },
          })
          this.loadDataAwal = false
          this.isLoadTable = false
        })
    },
    formatDate(d) {
      return this.$moment(d).format('D MMM YYYY')
    },
    disabledDate(classes, date) {
      // date format Wed Apr 06 2022 12:00:00 GMT+0700 (Western Indonesia Time)
      const dataclass = classes
      if (!dataclass.disabled) {
        dataclass.disabled = this.$moment(date.getTime()).startOf('day').isAfter(this.$moment())
      }
      return dataclass
    },
    checkDataStatusOnboarding(dt) {
      let strWord = ''
      if (dt === 1) {
        strWord = 'Selesai'
      } else {
        strWord = 'Belum'
      }
      return strWord
    },
    handlePhone(phonetext, type) {
      switch (type) {
        case 'wa':
          window.open(`https://wa.me/62${phonetext.substring(1)}`, '_blank')
          break
        case 'copy':
          navigator.clipboard.writeText(phonetext)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success copy to clipboard',
              icon: 'BellIcon',
              variant: 'success',
            },
          })
          break
        default:
          break
      }
    },
    onChangeSearch(dtsearch) {
      if (dtsearch) {
        const filteredData = [...this.items].filter(x => {
          if (x.full_name.toLowerCase().indexOf(dtsearch.toLowerCase()) !== -1) {
            return true
          }
          if (x.email.toLowerCase().indexOf(dtsearch.toLowerCase()) !== -1) {
            return true
          }
          if (x.no_hp.indexOf(dtsearch) !== -1) {
            return true
          }
          return false
        })
        this.filteredItems = filteredData
      } else {
        this.filteredItems = this.items
      }
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
  destroyed() {
    clearTimeout(timeoutCallApi)
  },
}
