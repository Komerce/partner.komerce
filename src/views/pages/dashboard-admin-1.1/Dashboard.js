import {
  BRow, BCol, BCard, BButton, BFormGroup,
} from 'bootstrap-vue'
import VSelect from 'vue-select'
import VueApexCharts from 'vue-apexcharts'
import VueMonthlyPicker from 'vue-monthly-picker'
import filtersLibs from '@/libs/filters'
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'

const seriesNameChart = {
  cod: 'COD',
  noncod: 'Non - COD',
  total: 'Total',
  order: 'Order',
  partner: 'Partner',
}

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

const colorDefaultChart = ['#08A0F7', '#34A770', '#FBA63C']

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
      seriesekspedisi: [],
      seriespartner: [],
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
            opacityFrom: 0.75,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
          },
        },
        stroke: {
          curve: 'smooth',
        },
        yaxis: {
          forceNiceScale: true,
          labels: {
            style: {
              colors: '#000000',
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
          categories: [],
          labels: {
            formatter: (val, timestamp) => this.$moment(new Date(timestamp)).format('DD'),
          },
        },
        tooltip: {
          // intersect: true,
          custom: ({ dataPointIndex, w }) => {
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
                  ${
  w.globals.seriesNames[idx]
}</span> <span class="text-black"> ${filtersLibs.rupiah(
  x[dataPointIndex] || 0,
)}
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
        noData: {
          text: 'NO DATA',
        },
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
            opacityFrom: 0.75,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
          },
        },
        stroke: {
          curve: 'smooth',
        },
        yaxis: {
          forceNiceScale: true,
          labels: {
            style: {
              colors: '#000000',
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
          categories: [],
          labels: {
            formatter: (val, timestamp) => this.$moment(new Date(timestamp)).format('DD'),
          },
        },
        tooltip: {
          // intersect: true,
          custom: ({ dataPointIndex, w }) => {
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
            // console.log('w.globals ', w.globals)
            arrayData.forEach((x, idx) => {
              if (w.globals.collapsedSeriesIndices.indexOf(idx) !== -1) {
                htmlRender += ''
              } else {
                htmlRender += `<p
                  class="my-0 mt-1"
                  style="color: ${colorDefaultChart[idx]};"
                >
                  <span>${
  w.globals.seriesNames[idx]
}</span> <span class="text-black"> ${
  w.globals.seriesNames[idx] === seriesNameChart.order
    ? x[dataPointIndex]
    : filtersLibs.rupiah(x[dataPointIndex] || 0)
}</span>${
  w.globals.seriesNames[idx] === seriesNameChart.total
    ? `<span class="text-gray-600"> <br/>${w.globals.seriesNames[3]} ${w.globals.collapsedSeries[0].data[dataPointIndex]} (${w.globals.collapsedSeries[1].data[dataPointIndex]} Partner)</span>`
    : ''
}
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
        noData: {
          text: 'NO DATA',
        },
      },
      optionTopList: [
        {
          name: seriesNameChart.cod,
          value: 1,
        },
        {
          name: seriesNameChart.noncod,
          value: 2,
        },
        {
          name: 'COD & Non COD',
          value: 3,
        },
      ],
      optionChartEkspedisi: [],
      optionChartPartner: [
        {
          name: 'Semua',
          value: 0,
        },
      ],
      monthlabel: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Dec',
      ],
      bulanChartExpedisi: '2022-02-02',
      filterdata: {
        ekspedisi: {
          chart: {
            selectOpt: {
              name: 'JNE',
              value: 2,
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
              name: 'Semua',
              value: 0,
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
      handler() {
        this.fetchDataChart(typeOfCallingApi.chart.ekspedisi)
      },
    },
    'filterdata.ekspedisi.chart.bulan': {
      handler() {
        this.fetchDataChart(typeOfCallingApi.chart.ekspedisi)
      },
    },
    'filterdata.ekspedisi.toplist.selectOpt': {
      handler() {
        this.fetchDataTop(typeOfCallingApi.toplist.ekspedisi)
      },
    },
    'filterdata.ekspedisi.toplist.bulan': {
      handler() {
        this.fetchDataTop(typeOfCallingApi.toplist.ekspedisi)
      },
    },
    'filterdata.partner.chart.selectOpt': {
      handler() {
        this.fetchDataChart(typeOfCallingApi.chart.partner)
      },
    },
    'filterdata.partner.chart.bulan': {
      handler() {
        this.fetchDataChart(typeOfCallingApi.chart.partner)
      },
    },
    'filterdata.partner.toplist.selectOpt': {
      handler() {
        this.fetchDataTop(typeOfCallingApi.toplist.partner)
      },
    },
    'filterdata.partner.toplist.bulan': {
      handler() {
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
    this.getDataShippingName()
  },
  methods: {
    getDataShippingName() {
      this.$http_komship
        .get('/v1/admin/dashboard/shippingName')
        .then(({ data }) => {
          const oriOptions = data.data.map((x, idx) => ({
            name: x,
            value: idx + 1,
          }))
          const optPartner = [...oriOptions]
          optPartner.unshift({
            name: 'Semua',
            value: 0,
          })
          this.optionChartEkspedisi = oriOptions
          this.optionChartPartner = optPartner
          this.$nextTick(() => {
            this.fetchDataChart(typeOfCallingApi.chart.ekspedisi)
            this.fetchDataChart(typeOfCallingApi.chart.partner)
            this.fetchDataTop(typeOfCallingApi.toplist.ekspedisi)
            this.fetchDataTop(typeOfCallingApi.toplist.partner)
          })
        })
        .catch(() => {
          this.$toast(
            {
              component: ToastificationContentVue,
              props: {
                title: 'Gagal',
                text: 'Gagal untuk mengambil data, silahkan coba lagi!',
                icon: 'AlertCircleIcon',
                variant: 'danger',
              },
            },
            2000,
          )
        })
    },
    clickLegendPartner(event, chartContext, config) {
      if (config.globals.collapsedSeriesIndices.indexOf(3) !== -1) {
        this.$refs.chartPerformancePartner.chart.hideSeries(
          seriesNameChart.noncod,
        )
        this.$refs.chartPerformancePartner.chart.hideSeries(
          seriesNameChart.total,
        )
        this.$refs.chartPerformancePartner.chart.hideSeries(seriesNameChart.cod)
        this.$refs.chartPerformancePartner.chart.hideSeries(
          seriesNameChart.partner,
        )
        this.$refs.chartPerformancePartner.chart.showSeries(
          seriesNameChart.order,
        )
      } else {
        this.$refs.chartPerformancePartner.chart.showSeries(
          seriesNameChart.noncod,
        )
        this.$refs.chartPerformancePartner.chart.showSeries(
          seriesNameChart.total,
        )
        this.$refs.chartPerformancePartner.chart.showSeries(seriesNameChart.cod)
        this.$refs.chartPerformancePartner.chart.hideSeries(
          seriesNameChart.partner,
        )
        this.$refs.chartPerformancePartner.chart.hideSeries(
          seriesNameChart.order,
        )
      }
    },
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
      this.$http_komship
        .get(`/v1/admin/dashboard/${endpoint}`, { params })
        .then(({ data }) => {
          this.datatoplist[type.toLowerCase()] = data.data
        })
        .catch(() => {
          this.$toast(
            {
              component: ToastificationContentVue,
              props: {
                title: 'Gagal',
                text: 'Gagal untuk mengambil data, silahkan coba lagi!',
                icon: 'AlertCircleIcon',
                variant: 'danger',
              },
            },
            2000,
          )
        })
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
          params.expedition_option = this.filterdata.partner.chart.selectOpt.name.toLowerCase()
            === 'semua'
            ? this.optionChartEkspedisi.map(x => x.name).join()
            : this.filterdata.partner.chart.selectOpt.name
          this.chartOptionsPartner = {
            ...this.chartOptionsPartner,
            xaxis: {
              ...this.chartOptionsPartner.xaxis,
              min: this.$moment(dtbulan).startOf('month').valueOf(),
              max: this.$moment(dtbulan).endOf('month').valueOf(),
            },
          }
          break
        case typeOfCallingApi.chart.ekspedisi:
          endpoint = 'shippingPerformancePerExpedition'
          dtbulan = this.filterdata.ekspedisi.chart.bulan
          this.chartOptionsEkspedisi = {
            ...this.chartOptionsEkspedisi,
            xaxis: {
              ...this.chartOptionsEkspedisi.xaxis,
              min: this.$moment(dtbulan).startOf('month').valueOf(),
              max: this.$moment(dtbulan).endOf('month').valueOf(),
            },
          }
          params.start_date = this.parseStartDate(dtbulan)
          params.end_date = this.parseEndDate(dtbulan)
          params.expedition_option = this.filterdata.ekspedisi.chart.selectOpt.name
          break
        default:
          break
      }
      this.$http_komship
        .get(`/v1/admin/dashboard/${endpoint}`, { params })
        .then(({ data }) => {
          switch (type) {
            case typeOfCallingApi.chart.ekspedisi:
              this[`series${type}`] = [
                {
                  name: seriesNameChart.total,
                  data: data.data.total.map(x => x.total),
                },
                {
                  name: seriesNameChart.noncod,
                  data: data.data.non_cod.map(x => x.total_noncod),
                },
                {
                  name: seriesNameChart.cod,
                  data: data.data.cod.map(x => x.total_cod),
                },
              ]
              this.chartOptionsEkspedisi = {
                ...this.chartOptionsEkspedisi,
                xaxis: {
                  ...this.chartOptionsEkspedisi.xaxis,
                  categories: data.data.total.map(x => x.day),
                },
              }
              break
            case typeOfCallingApi.chart.partner:
              this[`series${type}`] = [
                {
                  name: seriesNameChart.total,
                  data: data.data.total.map(x => x.total),
                },
                {
                  name: seriesNameChart.noncod,
                  data: data.data.non_cod.map(x => x.total_noncod),
                },
                {
                  name: seriesNameChart.cod,
                  data: data.data.cod.map(x => x.total_cod),
                },
                {
                  name: seriesNameChart.order,
                  data: data.data.total.map(x => x.total_order),
                },
                {
                  name: seriesNameChart.partner,
                  data: data.data.total.map(x => x.total_partner),
                },
              ]
              this.chartOptionsPartner = {
                ...this.chartOptionsPartner,
                xaxis: {
                  ...this.chartOptionsPartner.xaxis,
                  categories: data.data.total.map(x => x.day),
                },
              }
              this.$nextTick(() => {
                this.$refs.chartPerformancePartner.chart.hideSeries(
                  seriesNameChart.order,
                )
                this.$refs.chartPerformancePartner.chart.hideSeries(
                  seriesNameChart.partner,
                )
              })
              break
            default:
              break
          }
        })
        .catch(() => {
          this.$toast(
            {
              component: ToastificationContentVue,
              props: {
                title: 'Gagal',
                text: 'Gagal untuk mengambil data, silahkan coba lagi!',
                icon: 'AlertCircleIcon',
                variant: 'danger',
              },
            },
            2000,
          )
        })
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
