import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { BFormGroup } from 'bootstrap-vue'
import vSelect from 'vue-select'
import DateRangePicker from 'vue2-daterange-picker'
import ChartPenghasilan from '@/views/components/chart/ChartPenghasilan.vue'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import PopoverInfo from '@/views/components/popover/PopoverInfo.vue'

export default {
  components: {
    BFormGroup,
    DateRangePicker,
    vSelect,
    ChartPenghasilan,
    PopoverInfo,
  },
  data() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const last7 = new Date()
    last7.setDate(today.getDate() - 6)
    last7.setHours(0, 0, 0, 0)

    const last30 = new Date()
    last30.setDate(today.getDate() - 29)
    last30.setHours(0, 0, 0, 0)

    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDateOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    )

    return {
      picker: {
        startDate: firstDateOfMonth,
        endDate: lastDateOfMonth,
      },
      locale: {
        format: 'dd/mm/yyyy',
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
      styleImgPopover: {
        maxWidth: '22px',
        width: '22px',
        height: '22px',
      },
    }
  },
  computed: {
    ...mapFields('penghasilan', [
      'selectedPenghasilan',
      'optionsPenghasilan',
      'dateRange',
    ]),
    ...mapGetters('penghasilan', [
      'incomeTransferGraph',
      'incomeCODGraph',
    ]),
    ...mapState('penghasilan', [
      'cashback',
      'penghasilan7Hari',
      'penghasilan30Hari',
      'penghasilanTotal',
      'dataCod',
      'dataTransfer',
    ]),
  },
  watch: {
    dateRange() {
      this.handleChangePenghasilan()
    },
    selectedPenghasilan() {
      this.handleChangePenghasilan()
    },
  },
  beforeMount() {
    this.$store.dispatch('penghasilan/init')
  },
  methods: {
    formatRibuan(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatRupiah(x) {
      return `Rp ${this.formatRibuan(x)}`
    },
    formatDate(d) {
      return moment(d).format('D MMM YYYY')
    },
    handleChangePenghasilan() {
      this.$store.dispatch('penghasilan/getDataCod')
      this.$store.dispatch('penghasilan/getDataTransfer')
      this.$store.dispatch('penghasilan/getIncomeTransferGraph')
      this.$store.dispatch('penghasilan/getIncomeCODGraph')
    },
  },
}
