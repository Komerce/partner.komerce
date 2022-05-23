import {
  BRow,
  BCol,
  BCard,
  BForm,
  BFormGroup,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import Ripple from 'vue-ripple-directive'
import { mapFields } from 'vuex-map-fields'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  required,
} from '@validations'
import moment from 'moment'
import {
  today,
  last7,
  last30,
  firstDateOfMonth,
  lastDateOfMonth,
} from '@/store/helpers'

export default
{
  components: {
    BRow,
    BCol,
    BCard,
    BForm,
    BFormGroup,
    vSelect,
    DateRangePicker,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loadingDataTable: true,
      fieldsTicket: [
        {
          key: 'ticket_no',
          label: 'No. Tiket',
          trClass: 'border-top-0 bg-warning',
          class: 'bg-white',
        },
        {
          key: 'no_resi',
          label: 'Nomor Resi',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
        {
          key: 'shipping',
          label: 'Ekspedisi',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
        {
          key: 'customer_name',
          label: 'Customer',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
        {
          key: 'name',
          label: 'Jenis Tiket',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
        {
          key: 'ticket_status',
          label: 'Status Tiket',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
        {
          key: 'date_created',
          label: 'Waktu Dibuat',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
        {
          key: 'date_updated',
          label: 'Waktu Diupdate',
          trClass: 'border-top-0',
          class: 'bg-white',
        },
      ],
      itemsTicket: [],
      itemsResi: [],

      // Date range picker
      picker: {
        startDate: firstDateOfMonth,
        endDate: lastDateOfMonth,
      },
      locale: {
        format: 'dd/mm/yyyy',
        daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      },
      ranges: {
        '7 Hari Terakhir': [last7, today],
        '30 Hari Terakhir': [last30, today],
        'Bulan Ini': [firstDateOfMonth, today],
      },
      today,
      last7,
      last30,
      firstDateOfMonth,
      lastDateOfMonth,
      imageFile: null,
      imageInitialFile: null,
      itemsImageInitialFile: [],
      selected: true,
      belumDiProses: 0,
      perluTindakLanjut: 0,
      sedangDiProses: 0,
      searchType: {
        label: 'Nomor Tiket',
        value: 'ticket_no',
      },
      searchItems: [
        {
          label: 'Nomor Tiket',
          value: 'ticket_no',
        },
        {
          label: 'Nomor Resi',
          value: 'no_resi',
        },
        {
          label: 'Nama Customer',
          value: 'customer_name',
        },
      ],

      // Validation
      required,

      // Store
      loadingSubmitTicket: false,
      itemsNoResi: null,
      noResi: null,
      customerName: '',
      jenisTicketItems: [
        {
          label: 'Alamat penerima / Nomor HP tidak lengkap',
          value: 5,
        },
      ],
      ticketTypeItems: [],
      ticketType: null,
      description: '',
      file: null,

      // Filter
      ticketStatus: [],
      ticketStatusItems: [
        {
          label: 'Menunggu Tindak Lanjut',
          value: 0,
          onCheck: false,
        },
        {
          label: 'Belum Diproses',
          value: 1,
          onCheck: false,
        },
        {
          label: 'Sedang Diproses',
          value: 2,
          onCheck: false,
        },
        {
          label: 'Selesai',
          value: 3,
          onCheck: false,
        },
      ],
      fontClassTicketStatus: {
        color: 'salmon',
      },
      search: '',
      filterTicketType: [],
      dateRange: {
        startDate: last30,
        endDate: today,
      },
      dateRangeUpdate: {
        startDate: last30,
        endDate: today,
      },
    }
  },
  watch: {
    dateRange: {
      handler() {
        this.fetchTicket()
      },
    },
    dateRangeUpdate: {
      handler() {
        this.fetchTicket()
      },
    },
  },
  mounted() {
    this.fetchTicket()
    this.fetchTicketPartnerCount()
    this.fetchTicketType()
  },
  methods: {
    fetchTicket() {
      this.loadingDataTable = true
      const params = {}
      if (this.dateRange) {
        Object.assign(params, { start_date: this.formatDateParams(this.dateRange.startDate) })
        Object.assign(params, { end_date: this.formatDateParams(this.dateRange.endDate) })
      }
      if (this.dateRangeUpdate) {
        Object.assign(params, { update_start_date: this.formatDateParams(this.dateRangeUpdate.startDate) })
        Object.assign(params, { update_end_date: this.formatDateParams(this.dateRangeUpdate.endDate) })
      }
      if (this.ticketStatus) Object.assign(params, { ticket_status: this.ticketStatus.join() })
      if (this.search) Object.assign(params, { search: this.search })
      if (this.searchType) Object.assign(params, { search_type: this.searchType.value })
      if (this.filterTicketType) Object.assign(params, { ticket_type: this.filterTicketType.join() })
      this.$http_komship.get('/v1/ticket-partner/list', {
        params,
      })
        .then(response => {
          const { data } = response.data
          this.itemsTicket = data
          this.loadingDataTable = false
        })
        .catch(err => {
          this.itemsTicket = []
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text: err,
              variant: 'danger',
            },
          }, 2000)
          this.loadingDataTable = false
        })
    },
    fetchTicketPartnerCount() {
      this.$http_komship.get('v1/ticket-partner/count')
        .then(response => {
          const { data } = response.data
          this.belumDiProses = data.belum_diproses
          this.perluTindakLanjut = data.perlu_tindak_lanjut
          this.sedangDiProses = data.sedang_diproses
        }).catch(err => {
          console.log(err)
        })
    },
    fetchDataResi() {
      this.customerName = this.itemsNoResi.customer_name
      this.noResi = this.itemsNoResi.no_resi
    },
    fetchJenisTicket() {
      console.log(this.ticketType)
    },
    submitTicket() {
      this.loadingSubmitTicket = true
      this.$refs.formRules.validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('no_resi', this.noResi)
          formData.append('customer_name', this.customerName)
          formData.append('ticket_type', this.ticketType.value)
          formData.append('description', this.description)
          if (this.itemsImageInitialFile.length > 1) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.itemsImageInitialFile.length; i++) {
              formData.append('file[]', this.itemsImageInitialFile[i])
            }
          } else {
            formData.append('file[]', this.itemsImageInitialFile[0])
          }

          this.$http_komship.post('/v1/ticket-partner/store', formData)
            .then(response => {
              this.loadingSubmitTicket = false
              this.$refs['popup-success-create-ticket'].show()
            })
            .catch(err => {
              this.loadingSubmitTicket = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Failure',
                  icon: 'AlertCircleIcon',
                  text: err,
                  variant: 'danger',
                },
              }, 2000)
            })
        } else {
          this.loadingSubmitTicket = false
        }
      })
      // this.$refs['popup-success-create-ticket'].show()
    },
    closeSuccessCreateTicket() {
      this.$refs['popup-success-create-ticket'].hide()
    },
    onRowSelected(data) {
      this.$router.push({ path: `/ticketing/detail/${data[0].id}`, params: { data_ticket: data } })
    },
    cekResi(search, loading) {
      if (search.length) {
        this.searchResi(loading, search, this)
      }
    },
    searchResi: _.debounce((loading, search, that) => {
      loading(true)
      that.loadResi(search).finally(() => loading(false))
    }, 500),
    loadResi(search) {
      return this.$http_komship.get(`/v1/ticket-partner/check-resi/${search}`)
        .then(response => {
          const { data } = response.data
          this.itemsResi = data
        }).catch(err => {
          console.log(err)
        })
    },
    handleChangeDatePicker() {
      console.log(this.dateRange)
    },
    formatDate(d) {
      return moment(d).format('D MMM YYYY')
    },
    formatDateParams(d) {
      return moment(d).format('YYYY-MM-DD')
    },
    onChangeFile(event) {
      event.target.files.forEach(this.myFile)
    },
    myFile(data) {
      this.itemsImageInitialFile.push(data)
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
    deleteFile(data) {
      const findIndexObj = this.itemsImageInitialFile.findIndex(items => items.name === data.name)
      this.itemsImageInitialFile.splice(findIndexObj, 1)
    },
    setSearchType(data) {
      this.searchType = data
      this.fetchTicket()
      this.$root.$emit('bv::hide::popover', 'popover-search-type')
    },
    filterTicketByStatus(data) {
      const findIndexObj = this.ticketStatusItems.findIndex(items => items.value === data.value)
      const findObj = this.ticketStatus.findIndex(items => items === data.value)
      if (this.ticketStatusItems[findIndexObj].onCheck === true) {
        this.ticketStatus.push(data.value)
      } else {
        this.ticketStatus.splice(findObj, 1)
      }
      this.fetchTicket()
    },
    filterByTicketType(data) {
      const findIndexObj = this.ticketTypeItems.findIndex(items => items.id === data.id)
      const findObj = this.filterTicketType.findIndex(items => items === data.id)
      if (this.ticketTypeItems[findIndexObj].onCheck === true) {
        this.filterTicketType.push(data.id)
      } else {
        this.filterTicketType.splice(findObj, 1)
      }
      this.fetchTicket()
    },
    fetchTicketType() {
      this.$http_komship.get('/v1/ticket-partner/ticket-type/list')
        .then(response => {
          const { data } = response.data
          this.ticketTypeItems = data
          // eslint-disable-next-line no-plusplus
          for (let x = 0; x < this.ticketTypeItems.length; x++) {
            Object.assign(this.ticketTypeItems[x], { onCheck: false })
          }
        }).catch(err => {
          console.log(err)
        })
    },
    statusTicketClass(data) {
      let resultVariant = ''
      if (data === 'Belum diproses') {
        resultVariant = 'font-medium text-primary'
      } else if (data === 'Sedang diproses') {
        resultVariant = 'font-medium text-warning'
      } else if (data === 'Selesai') {
        resultVariant = 'font-medium text-success'
      } else if (data === 'Dikirim') {
        resultVariant = 'font-medium text-info'
      } else if (data === 'Dibatalkan') {
        resultVariant = 'font-medium text-secondary'
      }
      return resultVariant
    },
    searchTicket() {
      this.fetchTicket()
    },
    clearFilter() {
      this.loadingDataTable = true
      const params = {}
      this.$http_komship.get('/v1/ticket-partner/list', {
        params,
      })
        .then(response => {
          const { data } = response.data
          this.itemsTicket = data
          this.loadingDataTable = false
        })
        .catch(err => {
          this.itemsTicket = []
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text: err,
              variant: 'danger',
            },
          }, 2000)
          this.loadingDataTable = false
        })
    },
  },
}
