import {
  BRow,
  BCol,
  BCard,
  BAlert,
  BButton,
  BAvatar,
  BSpinner,
  BCardBody,
  BListGroup,
  BCardHeader,
  BFormSelect,
  BButtonGroup,
  BListGroupItem,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import Ripple from 'vue-ripple-directive'

import store from '@/store/index'
import axioskomsipdev from '@/libs/axioskomsipdev'
// import { $themeColors } from '@themeConfig'
import { kFormatter } from '@core/utils/filter'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BAlert,
    BButton,
    BAvatar,
    BSpinner,
    BCardBody,
    BListGroup,
    BFormSelect,
    BCardHeader,
    BButtonGroup,
    VueApexCharts,
    BListGroupItem,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      dir: false,
      alertshow: false,
      loadDataAwal: true,
      rows: [],
      searchTerm: '',
      areaChartOptions: {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 0.9,
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 80, 100],
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
        xaxis: {
          categories: [],
          labels: {
            show: true,
            // formatter: val => `${val.toFixed(0)}`,
          },
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
            // formatter: val => `${val} Jt`,
          },
        },
        tooltip: {
          x: { show: false },
        },
        plotOptions: {
          area: {
            fillTo: 'origin',
          },
        },
        color: ['#08A0F7', '#34A770'],
      },
      seriesChartshipping: [],
      categoriesChartshipping: [],
      seriesChartpartner: [],
      categoriesChartpartner: [],
      topPartner: [],
      topPartnerTemp: [],
      topShipping: [],
      topShippingTemp: [],
      filterTopEkspedisi: '',
      filterTopPartner: '',
      selectedEkspedisi: {
        shipper: 'JNE',
        month: `0${new Date().getMonth() + 1}`,
      },
      selectedPartner: {
        month: `0${new Date().getMonth() + 1}`,
      },
      optionsKurir: [
        { value: null, text: 'Pilih Kurir' },
        { value: 'JNE', text: 'JNE' },
        { value: 'JNT', text: 'JNT' },
        { value: 'Sicepat', text: 'Sicepat' },
      ],
      optionsBulan: [
        { value: null, text: 'Pilih Bulan' },
        { value: '01', text: 'Januari' },
        { value: '02', text: 'Febuari' },
        { value: '03', text: 'Maret' },
        { value: '04', text: 'April' },
        { value: '05', text: 'Mei' },
        { value: '06', text: 'Juni' },
        { value: '07', text: 'Juli' },
        { value: '08', text: 'Agustus' },
        { value: '09', text: 'September' },
        { value: '10', text: 'Oktober' },
        { value: '11', text: 'November' },
        { value: '12', text: 'Desember' },
      ],
    }
  },
  computed: {
    categoriesChartPartnerComp() {
      const data = {
        ...this.areaChartOptions,
        xaxis: {
          ...this.areaChartOptions.xaxis,
          categories: this.categoriesChartpartner,
        },
      }
      return data
    },
    categoriesChartShippingComp() {
      const data = {
        ...this.areaChartOptions,
        xaxis: {
          ...this.areaChartOptions.xaxis,
          categories: this.categoriesChartshipping,
        },
      }
      return data
    },
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
  },
  watch: {
    filterTopEkspedisi: {
      // immediate: true,
      handler() {
        this.topShipping = this.topShippingTemp[this.filterTopEkspedisi]
      },
    },
    filterTopPartner: {
      // immediate: true,
      handler() {
        this.topPartner = this.topPartnerTemp[this.filterTopPartner]
      },
    },
    selectedEkspedisi: {
      deep: true,
      // immediate: true,
      handler() {
        this.fetchDataChart(this.selectedEkspedisi, 'shipping')
      },
    },
    selectedPartner: {
      deep: true,
      // immediate: true,
      handler() {
        this.fetchDataChart(this.selectedPartner, 'partner')
      },
    },
  },
  mounted() {
    this.fetchDataChart(this.selectedEkspedisi, 'shipping')
    this.fetchDataChart(this.selectedPartner, 'partner')
    this.fetchDataTop('partner')
    this.fetchDataTop('shipping')
  },
  beforeCreate() {
    // window.location.reload()
  },
  created() {
    this.loadDataAwal = true
    // check data from API when there is withdrawal pending/process in api
    // get data for series performa expedisi and performa partner
    // get data for select option kurir
    // get data for select option bulan or just hardcode
  },
  methods: {
    kFormatter,
    choosenFilterTop(val, type = '') {
      this[type] = val
    },
    async fetchDataChart(params, type = '') {
      const paramsTemp = {}
      if (type === 'partner') {
        paramsTemp.month = params.month
      } else {
        paramsTemp.shipper = params.shipper
        paramsTemp.month = params.month
      }
      axioskomsipdev
        .get(`/v1/admin/dashboard/performance/${type}`, { params: paramsTemp })
        .then(({ data }) => {
          if (Array.isArray(data.data)) {
            this[`categoriesChart${type}`] = []
            this[`seriesChart${type}`] = [
              {
                name: 'COD',
                data: [],
              },
              {
                name: 'Non - COD',
                data: [],
              },
            ]
          } else {
            const mappinData = [
              {
                name: 'COD',
                data: data.data.cod,
              },
              {
                name: 'Non - COD',
                data: data.data.non_cod,
              },
            ]
            this[`categoriesChart${type}`] = data.data.categories
            this[`seriesChart${type}`] = mappinData
          }
        })
        .catch(() => {
          this.loadDataAwal = false
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
    async fetchDataTop(type = '') {
      axioskomsipdev
        .get(`/v1/admin/dashboard/top/${type}`)
        .then(({ data }) => {
          this[`top${type.charAt(0).toUpperCase()}${type.substring(1)}Temp`] = data.data
          this[`top${type.charAt(0).toUpperCase()}${type.substring(1)}`] = data.data.cod
        })
        .catch(() => {
          this.loadDataAwal = false
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
    objectToQueryString(obj = {}) {
      const str = []
      Object.keys(obj).map(x => {
        str.push(`${encodeURIComponent(x)}=${encodeURIComponent(obj[x])}`)
        return str
      })
      return str.join('&')
    },
    toPage(params = '') {
      // make sure to pass params on router base for changing page
      this.$router.push(params)
    },
  },
}
