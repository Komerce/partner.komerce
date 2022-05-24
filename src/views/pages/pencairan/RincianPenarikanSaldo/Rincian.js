/* eslint-disable import/no-unresolved */
import {
  BRow,
  BCol,
  BCard,
  BModal,
  BFormTextarea,
  BImg,
  BFormGroup,
  BBadge,
  BTable,
  BPagination,
  BButton,
  BSpinner,
  BCardBody,
  BCardHeader,
  BFormSelect,
} from 'bootstrap-vue'

// eslint-disable-next-line import/extensions
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BImg,
    BRow,
    BCol,
    BCard,
    BModal,
    BFormTextarea,
    BBadge,
    BTable,
    BPagination,
    BFormGroup,
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
          key: 'order_date',
          label: 'Tanggal',
          sortable: true,
        },
        // A virtual column made up from two fields
        {
          key: 'payment_method',
          label: 'Jenis Transaksi',
        },
        {
          key: 'order_grandtotal',
          label: 'Nilai Transaksi',
        },
        // {
        //   key: 'shipping_cost',
        //   label: 'Ongkos Kirim',
        // },
        // {
        //   key: 'service_fee',
        //   label: 'Biaya COD',
        // },
        {
          key: 'net_profit',
          label: 'Saldo',
        },
        {
          key: 'lihat_detail',
          label: '',
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
  },
  created() {
    this.$store.commit('pencairan/UPDATE_PENCAIRAN_ID', this.$route.params.slug)
    this.fetchData()
  },
  methods: {
    formatNumber: value => `${value}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
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
    handleCopy(refElement) {
      this.selectText(this.$refs[refElement])
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
      formData.append('_method', 'PUT')
      formData.append('status', 'on_review')
      formData.append('notes', this.catatanReview)
      this.$http_komship
        .post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(({ data }) => {
          if (data) {
            this.fetchData()
          }
        })
        .catch(() => {
          this.loadDataAwal = false
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
      formData.append('_method', 'PUT')
      this.$http_komship
        .put(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.$bvModal.show('modal-transfer-berhasil')
        })
        .catch(() => {
          this.$bvModal.show('modal-transfer-gagal')
        })
    },
    handleOkTransBerhasil() {
      // hide modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-transfer-berhasil')
        this.$router.go(this.$router.currentRoute)
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
      this.$http_komship
        .get(endpoint)
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          this.$store.commit(
            'pencairan/UPDATE_PENCAIRAN_STATUS',
            parseData.status,
          )
          this.detailData = parseData
          this.items = data.data.order
          this.totalRows = data.data.order.length
        })
        .catch(() => {
          this.loadDataAwal = false
        })
        .finally(() => {
          this.isLoadTable = false
        })
    },
  },
}
