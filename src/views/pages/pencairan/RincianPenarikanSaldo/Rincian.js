import {
  BRow,
  BCol,
  BCard,
  BModal,
  BFormTextarea,
  BImg,
  BFormGroup,
  // BDropdownForm,
  BBadge,
  // BAvatar,
  BTable,
  BPagination,
  // BTableSimple,
  // BThead,
  // BTbody,
  // BTh,
  // BTr,
  // BTd,
  // BInputGroup,
  // BInputGroupPrepend,
  // BDropdown,
  BButton,
  BSpinner,
  BCardBody,
  BCardHeader,
  BFormSelect,
} from 'bootstrap-vue'

import axioskomsipdev from '@/libs/axioskomsipdev'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BImg,
    BRow,
    BCol,
    BCard,
    BModal,
    BFormTextarea,
    // BFormInput,
    BBadge,
    // BAvatar,
    BTable,
    BPagination,
    // BTableSimple,
    // BThead,
    // BTbody,
    // BTh,
    // BTr,
    // BTd,
    // BInputGroup,
    BFormGroup,
    // BDropdownForm,
    // BInputGroupPrepend,
    // BDropdown,
    BButton,
    BSpinner,
    BCardBody,
    BFormSelect,
    BCardHeader,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
  },
  filters: {
    formatRupiah: val => {
      if (!val) return val
      const dataRp = new Intl.NumberFormat('id-ID').format(val)
      return dataRp
    },
    changeStatus: status => {
      let classStatusColor = ''
      switch (status) {
        case 'on_review':
          // #FBA63C
          classStatusColor = 'statusWarning'
          break
        case 'rejected':
          // #FBA63C
          classStatusColor = 'statusWarning'
          break
        case 'completed':
          // #34A770
          classStatusColor = 'statusSuccess'
          break
        default:
          // #FF6A3A
          classStatusColor = 'statusPrimary'
          break
      }
      return classStatusColor
    },
  },
  data() {
    return {
      loadDataAwal: true,
      catatanReview: '',
      catatanReviewState: null,
      detailData: {
        status: '',
        notes: '',
      },
      isLoadTable: false,
      perPage: 5,
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
      fields: [
        {
          key: 'order_id',
          label: 'Id',
        },
        {
          key: 'order_date',
          label: 'Tanggal',
          sortable: true,
        },
        // A virtual column made up from two fields
        {
          key: 'transreturn',
          label: 'Transaksi',
        },
        {
          key: 'order_grandtotal',
          label: 'Nilai Transaksi',
        },
        {
          key: 'shipping_cost',
          label: 'Ongkos Kirim',
        },
        {
          key: 'service_fee',
          label: 'Biaya COD',
        },
        {
          key: 'net_profit',
          label: 'Saldo',
        },
      ],
      items: [],
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
    //
  },
  mounted() {
    this.loadDataAwal = false
    // Set the initial number of items
    this.totalRows = this.items.length
    //
  },
  created() {
    this.$store.commit('pencairan/UPDATE_PENCAIRAN_ID', this.$route.params.slug)
    this.fetchData()
  },
  methods: {
    selectText(element) {
      let range
      if (document.selection) {
        // IE
        range = document.body.createTextRange()
        range.moveToElementText(element)
        range.select()
      } else if (window.getSelection) {
        range = document.createRange()
        range.selectNode(element)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }
    },
    handleCopyNominalPenarikanSaldo() {
      this.selectText(this.$refs.nominalPenarikanSaldo)
      document.execCommand('copy')
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Success copy to clipboard',
          icon: 'BellIcon',
          variant: 'success',
        },
      })
    },
    checkFormValidity() {
      const valid = this.$refs['form-review'].checkValidity()
      this.catatanReviewState = valid
      return valid
    },
    resetModalReview() {
      this.catatanReview = ''
      this.catatanReviewState = null
      this.$nextTick(() => {
        this.$bvModal.hide('modal-review')
      })
    },
    handleOkReview(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmitReview()
    },
    handleSubmitReview() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // calling api for submit review
      const endpoint = `/v1/admin/withdrawal/update/${this.$route.params.slug}`
      const formData = new FormData()
      formData.append('notes', this.catatanReview)
      formData.append('withdrawal_id', this.$route.params.slug)
      formData.append('status', this.detailData.status)
      // formData.append('yinyang.png', fs.createReadStream('./yinyang.png'));
      // res.data.files; // 'yinyang.png': an extremely long binary string
      // res.data.form; // form: { id: '1', string: 'Text we want to add to the submit' }
      axioskomsipdev.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(({ data }) => {
          // console.log(data)
          if (data) {
            this.fetchData()
          }
        })
        .catch(e => {
          console.log('error', e)
        })
      // then hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-review')
      })
    },
    resetModalTransNow() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-sekarang')
      })
    },
    handleOkTransNow() {
      // Trigger submit handler calling api for transfer
      const endpoint = `/v1/admin/withdrawal/update/${this.$route.params.slug}`
      const formData = new FormData()
      formData.append('withdrawal_id', this.$route.params.slug)
      formData.append('status', this.detailData.status)
      axioskomsipdev.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(({ data }) => {
          // if success display modal transfer berhasil
          // console.log(data)
          this.$bvModal.show('modal-transfer-berhasil')
        })
        .catch(e => {
          // if fail display modal transfer fail
          console.log('error', e)
          this.$bvModal.show('modal-transfer-gagal')
        })
    },
    handleOkTransBerhasil() {
      // hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-berhasil')
      })
    },
    handleOkTransGagal() {
      // hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-gagal')
      })
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async fetchData() {
      this.isLoadTable = true
      const endpoint = `/v1/admin/withdrawal/detail/${this.$route.params.slug}`
      axioskomsipdev.get(endpoint)
        .then(({ data }) => {
          // console.log(data.data)
          const parseData = JSON.parse(JSON.stringify(data.data))
          this.$store.commit('pencairan/UPDATE_PENCAIRAN_STATUS', parseData.status)
          this.detailData = parseData
          this.items = parseData.orders
          this.totalRows = parseData.length
        })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.isLoadTable = false
        })
    },
  },
}
