import {
  BRow,
  BCol,
  BCard,
  BButton,
  BFormGroup,
} from 'bootstrap-vue'
import VSelect from 'vue-select'
import VueApexCharts from 'vue-apexcharts'
import VueMonthlyPicker from 'vue-monthly-picker'
import filtersLibs from '@/libs/filters'

const typeOfCallingApi = {
  chart: {
    ekspedisi: 'ekspedisi',
    partner: 'partner',
  },
  toplist: {
    ekspedisi: 'ekspedisi',
    partner: 'partner',
  },
}

const colorDefaultChart = ['#FBA63C', '#34A770', '#08A0F7']

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BButton,
    VueApexCharts,
    BFormGroup,
    VSelect,
    VueMonthlyPicker,
  },
  data() {
    return {
      seriesekspedisi: [
        {
          name: 'COD',
          data: [300000, 600000, 900000, 2000000, 3000000, 5000000, 6000000],
        },
        {
          name: 'Non - COD',
          data: [500000, 800000, 1000000, 5000000, 7000000, 10000000, 14000000],
        },
        {
          name: 'Total',
          data: [800000, 1400000, 1900000, 7000000, 10000000, 15000000, 20000000],
        },
      ],
      seriespartner: [
        {
          name: 'COD',
          data: [300000, 600000, 900000, 2000000, 3000000, 5000000, 6000000],
        },
        {
          name: 'Non - COD',
          data: [500000, 800000, 1000000, 5000000, 7000000, 10000000, 14000000],
        },
        {
          name: 'Total',
          data: [800000, 1400000, 1900000, 7000000, 10000000, 15000000, 20000000],
        },
        {
          name: 'Order',
          data: [200, 400, 450, 300, 400, 500, 1000],
        },
      ],
      chartOptionsEkspedisi: {
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
          },
        },
        stroke: {
          curve: 'smooth',
        },
        yaxis: {
          labels: {
            style: {
              colors: '#8e8da4',
            },
            offsetX: 0,
            formatter: val => `${(val / 1000000).toFixed(0)} Jt`,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 14,
          min: this.$moment().startOf('month').valueOf(),
          max: this.$moment().endOf('month').valueOf(),
          // min: this.$moment('2022-04-01').valueOf(),
          // max: this.$moment('2022-04-30').valueOf(),
          categories: ['2022-03-01T00:00:00.000', '2022-03-02T01:30:00.000', '2022-03-03T02:30:00.000', '2022-03-04T03:30:00.000', '2022-03-05T04:30:00.000', '2022-03-15T05:30:00.000', '2022-03-19T06:30:00.000'],
          labels: {
            formatter: (val, timestamp) => this.$moment(new Date(timestamp)).format('DD'),
          },
        },
        tooltip: {
          // intersect: true,
          custom: ({
            series,
            seriesIndex,
            dataPointIndex,
            w,
          }) => {
            let htmlRender = ''
            const arrayData = [...w.globals.series]
            arrayData.forEach((x, idx) => {
              if (w.globals.collapsedSeriesIndices.indexOf(idx) !== -1) {
                htmlRender += ''
              } else {
                htmlRender += `<p
                  class="my-0 mt-1"
                  style="color: ${colorDefaultChart[idx]};"
                >
                  ${w.globals.seriesNames[idx]}</span> <span class="text-black"> ${filtersLibs.rupiah(x[dataPointIndex])}
                </p>`
              }
            })

            return `
            <div
              class="d-grid px-1 rounded align-items-center"
            >
              ${htmlRender}
              <br/>
            </div>
            `
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
        colors: colorDefaultChart,
      },
      chartOptionsPartner: {
        chart: {
          type: 'area',
          stacked: false,
          height: 350,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
          },
        },
        stroke: {
          curve: 'smooth',
        },
        yaxis: {
          labels: {
            style: {
              colors: '#8e8da4',
            },
            offsetX: 0,
            formatter: val => `${(val / 1000000).toFixed(0)} Jt`,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 14,
          min: this.$moment().startOf('month').valueOf(),
          max: this.$moment().endOf('month').valueOf(),
          // min: this.$moment('2022-04-01').valueOf(),
          // max: this.$moment('2022-04-30').valueOf(),
          categories: ['2022-03-01T00:00:00.000', '2022-03-02T01:30:00.000', '2022-03-03T02:30:00.000', '2022-03-04T03:30:00.000', '2022-03-05T04:30:00.000', '2022-03-15T05:30:00.000', '2022-03-19T06:30:00.000'],
          labels: {
            formatter: (val, timestamp) => this.$moment(new Date(timestamp)).format('DD'),
          },
        },
        tooltip: {
          // intersect: true,
          custom: ({
            series,
            seriesIndex,
            dataPointIndex,
            w,
          }) => {
            // console.log('ini series', series)
            // console.log('ini series index', seriesIndex)
            // console.log('ini W', w)
            // w.globals.collapsedSeriesIndices: Array number
            // w.globals.collapsedSeries: Array Object
            /*
              {data: Array(7) [ 200, 400, 450, … ]
              index: 3
              type: "area"}
            */

            let htmlRender = ''
            const arrayData = [...w.globals.series]
            arrayData.forEach((x, idx) => {
              if (w.globals.collapsedSeriesIndices.indexOf(idx) !== -1) {
                htmlRender += ''
              } else {
                htmlRender += `<p
                  class="my-0 mt-1"
                  style="color: ${colorDefaultChart[idx]};"
                >
                  ${w.globals.seriesNames[idx]}</span> <span class="text-black"> ${w.globals.seriesNames[idx].toLowerCase() === 'order' ? x[dataPointIndex] : filtersLibs.rupiah(x[dataPointIndex])}
                </p>`
              }
            })

            return `
            <div
              class="d-grid px-1 rounded align-items-center"
            >
              ${htmlRender}
              <br/>
            </div>
            `
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
        colors: [...colorDefaultChart, '#D3067B'],
      },
      optionTopList: [
        {
          name: 'COD',
          value: 1,
        },
        {
          name: 'Non-COD',
          value: 2,
        },
        {
          name: 'COD & Non COD',
          value: 3,
        },
      ],
      optionChart: [
        {
          name: 'JNE',
          value: 1,
        },
        {
          name: 'SiCepat',
          value: 2,
        },
        {
          name: 'IDExpress',
          value: 3,
        },
      ],
      monthlabel: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Dec'],
      bulanChartExpedisi: '2022-02-02',
      filterdata: {
        ekspedisi: {
          chart: {
            selectOpt: {
              name: 'JNE',
              value: 1,
            },
            bulan: this.$moment(),
          },
          toplist: {
            selectOpt: {
              name: 'COD',
              value: 1,
            },
            bulan: this.$moment(),
          },
        },
        partner: {
          chart: {
            selectOpt: {
              name: 'JNE',
              value: 1,
            },
            bulan: this.$moment(),
          },
          toplist: {
            selectOpt: {
              name: 'COD',
              value: 1,
            },
            bulan: this.$moment(),
          },
        },
      },
      datachart: {
        expedisi: [],
        partner: [],
      },
      datatoplist: {
        ekspedisi: [
          // {
          //   shipping: 'JNE',
          //   shipping_cost: 22000,
          // },
        ],
        partner: [
          // {
          //   partner_name: 'iiskun',
          //   transaction_cod: 112000,
          // },
        ],
      },
    }
  },
  watch: {
    'filterdata.ekspedisi.chart.selectOpt': {
      handler(val) {
        this.fetchDataChart(typeOfCallingApi.chart.ekspedisi)
      },
    },
    'filterdata.ekspedisi.chart.bulan': {
      handler(val) {
        this.fetchDataChart(typeOfCallingApi.chart.ekspedisi)
      },
    },
    'filterdata.ekspedisi.toplist.selectOpt': {
      handler(val) {
        this.fetchDataTop(typeOfCallingApi.toplist.ekspedisi)
      },
    },
    'filterdata.ekspedisi.toplist.bulan': {
      handler(val) {
        this.fetchDataTop(typeOfCallingApi.toplist.ekspedisi)
      },
    },
    'filterdata.partner.chart.selectOpt': {
      handler(val) {
        this.fetchDataChart(typeOfCallingApi.chart.partner)
      },
    },
    'filterdata.partner.chart.bulan': {
      handler(val) {
        this.fetchDataChart(typeOfCallingApi.chart.partner)
      },
    },
    'filterdata.partner.toplist.selectOpt': {
      handler(val) {
        this.fetchDataTop(typeOfCallingApi.toplist.partner)
      },
    },
    'filterdata.partner.toplist.bulan': {
      handler(val) {
        this.fetchDataTop(typeOfCallingApi.toplist.partner)
      },
    },
  },
  computed: {
    maxDatePicker() {
      return this.$moment().endOf('month')
    },
  },
  mounted() {
    // this.fetchDataChart(typeOfCallingApi.chart.ekspedisi)
    // this.fetchDataChart(typeOfCallingApi.chart.partner)
    this.fetchDataTop(typeOfCallingApi.toplist.ekspedisi)
    this.fetchDataTop(typeOfCallingApi.toplist.partner)
    this.$refs.chartPerformancePartner.chart.toggleSeries('Order')
  },
  methods: {
    fetchDataTop(type = '') {
      let endpoint = ''
      let dtbulan = ''
      const params = {}
      switch (type.toLowerCase()) {
        case typeOfCallingApi.toplist.partner:
          endpoint = 'topPartnerTransaction'
          dtbulan = this.filterdata.partner.toplist.bulan
          params.start_date = this.parseStartDate(dtbulan)
          params.end_date = this.parseEndDate(dtbulan)
          params.payment_option = this.filterdata.partner.toplist.selectOpt.value
          break
        case typeOfCallingApi.toplist.ekspedisi:
          endpoint = 'topShippingExpeditors'
          dtbulan = this.filterdata.ekspedisi.toplist.bulan
          params.start_date = this.parseStartDate(dtbulan)
          params.end_date = this.parseEndDate(dtbulan)
          params.payment_option = this.filterdata.ekspedisi.toplist.selectOpt.value
          break
        default:
          break
      }
      this.$http_komship.get(`/v1/admin/dashboard/${endpoint}`, { params })
        .then(({ data }) => {
          if (type.toLowerCase() === typeOfCallingApi.toplist.ekspedisi) {
            this.datatoplist[type.toLowerCase()] = data.data[Object.keys(data.data)[0]]
          } else {
            this.datatoplist[type.toLowerCase()] = data.data
          }
        })
        .catch(e => console.log('error', e))
    },
    fetchDataChart(type = '') {
      // payment_option 1: COD, 2: non COD, 3: total(cod dan non-cod)
      // start_date => awal bulan tgl 1 00:00 contoh 2022-02-01T00:00:00
      // end_date => skrng 23:59 contoh 2022-02-28 23:59:59
      let endpoint = ''
      let dtbulan = ''
      const params = {}
      switch (type.toLowerCase()) {
        case typeOfCallingApi.chart.partner:
          endpoint = 'partnerTransactionPerformance'
          dtbulan = this.filterdata.partner.chart.bulan
          params.start_date = this.parseStartDate(dtbulan)
          params.end_date = this.parseEndDate(dtbulan)
          params.expedition_option = this.filterdata.partner.chart.selectOpt.value
          break
        case typeOfCallingApi.chart.ekspedisi:
          endpoint = 'shippingPerformancePerExpedition'
          dtbulan = this.filterdata.ekspedisi.chart.bulan
          params.start_date = this.parseStartDate(dtbulan)
          params.end_date = this.parseEndDate(dtbulan)
          params.expedition_option = this.filterdata.ekspedisi.chart.selectOpt.value
          break
        default:
          break
      }
      this.$http_komship.get(`/v1/admin/dashboard/${endpoint}`, { params })
        .then(({ data }) => {
          // console.log('response data: ', data)
          this[`series${type}`] = [
            {
              name: 'COD',
              data: data.data.cod,
            },
            {
              name: 'Non - COD',
              data: data.data.non_cod,
            },
            {
              name: 'Total',
              data: data.data.total,
            },
          ]
        })
        .catch(e => console.log('error', e))
    },
    parseStartDate(dt) {
      return this.$moment(dt).startOf('month').format('YYYY-MM-DDTHH:mm:ss\\Z')
    },
    parseEndDate(dt) {
      let data = null
      if (this.$moment(dt).month() === this.$moment().month()) {
        data = this.$moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss\\Z')
      } else {
        data = this.$moment(dt).endOf('month').format('YYYY-MM-DDTHH:mm:ss\\Z')
      }
      return data
    },
    formatCurrency(dt) {
      return filtersLibs.rupiah(dt)
    },
  },
}
