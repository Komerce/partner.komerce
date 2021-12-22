<template>
  <section id="dashboard-cod">
    <div v-if="!loadDataAwal">
      <b-row class="match-height mb-md-1">
        <b-col>
          <h3 class="mb-50 mb-md-1">
            Dashboard
          </h3>
          <div>
            <b-alert
              v-if="alertshow"
              show
              variant="warning"
              class="d-flex justify-content-between align-items-center px-1 wrapper-warning-pemintaan-saldo"
            >
              <span class="text-warning-pemintaan-saldo">
                Anda masih memiliki permintaan penarikan saldo, segera cek sekarang!
              </span>
              <b-button
                variant="gradient-warning"
                class="btn-warning-pemintaan-saldo"
              >
                <span>11</span>
              </b-button>
            </b-alert>
          </div>
        </b-col>
      </b-row>
      <b-row class="match-height">
        <b-col lg="6">
          <b-card no-body>
            <b-card-header class="custom-card-header">
              <b-row style="width: 100%;">
                <b-col
                  md="12"
                  class="dashboard-report-wrapper"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title mb-50 mb-sm-0">
                      Perfoma Ekspedisi
                    </h4>
                    <b-button
                      variant="outline"
                      class="button-custom"
                      @click="toPage('/performa-ekspedisi')"
                    >
                      <feather-icon
                        icon="ChevronRightIcon"
                      />
                    </b-button>
                  </div>
                </b-col>
              </b-row>
            </b-card-header>

            <b-card-body>
              <b-row class="select-form">
                <b-col
                  md="2"
                />
                <b-col
                  md="3"
                />
                <b-col
                  md="3"
                  class="mb-50 mb-xs-1"
                >
                  <b-form-select
                    v-model="selectedEkspedisi.shipper"
                    :options="optionsKurir"
                  />
                </b-col>
                <b-col
                  md="4"
                  class="custom-selected-filter"
                >
                  <b-form-select
                    v-model="selectedEkspedisi.month"
                    :options="optionsBulan"
                  />
                </b-col>
              </b-row>
              <div style="transform: translateY(-35px);">
                <vue-apex-charts
                  type="area"
                  height="400"
                  :options="categoriesChartShippingComp"
                  :series="seriesChartshipping"
                />
              </div>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col lg="6">
          <b-card no-body>
            <b-card-header>
              <div
                class="d-flex justify-content-between align-items-center"
                style="width: 100%;"
              >
                <h4 class="card-title mb-50 mb-sm-0">
                  Top Ekspedisi
                </h4>
                <div class="d-flex align-items-center justify-content-end">
                  <b-button-group>
                    <b-button
                      variant="outline-secondary"
                      class="btn-custom-topcodnoncod"
                      @click="choosenFilterTop('cod', 'filterTopEkspedisi')"
                    >
                      COD
                    </b-button>
                    <b-button
                      variant="outline-secondary"
                      class="btn-custom-topcodnoncod"
                      @click="choosenFilterTop('non_cod', 'filterTopEkspedisi')"
                    >
                      Non-COD
                    </b-button>
                  </b-button-group>
                </div>
              </div>
            </b-card-header>
            <b-card-body>
              <div class="tbl-dashboard-top">
                <b-list-group v-if="topShipping.length > 0">
                  <b-list-group-item
                    v-for="(row, index) in topShipping"
                    :key="index"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-flex justify-content-between">
                      <b-avatar
                        :src="row.avatar || 'https://via.placeholder.com/52x52'"
                        class="mr-1"
                      />
                      <span class="text-top-each-item">{{ row.shipping }}</span>
                    </div>
                    <span class="total-top-each-item">
                      {{ row.profit }}
                    </span>
                  </b-list-group-item>
                </b-list-group>
                <span v-else>
                  No Data
                </span>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>

      <b-row class="match-height">
        <b-col lg="6">
          <b-card no-body>
            <b-card-header class="custom-card-header">
              <b-row style="width: 100%;">
                <b-col
                  md="12"
                  class="dashboard-report-wrapper"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title mb-50 mb-sm-0">
                      Perfoma Partner
                    </h4>
                    <b-button
                      variant="outline"
                      class="button-custom"
                      @click="toPage('/pendapatan')"
                    >
                      <feather-icon
                        icon="ChevronRightIcon"
                      />
                    </b-button>
                  </div>
                </b-col>
              </b-row>
            </b-card-header>

            <b-card-body>
              <b-row class="select-form">
                <b-col
                  md="4"
                />
                <b-col
                  md="4"
                />
                <b-col
                  md="4"
                  class="custom-selected-filter"
                >
                  <b-form-select
                    v-model="selectedPartner.month"
                    :options="optionsBulan"
                  />
                </b-col>
              </b-row>
              <div style="transform: translateY(-35px);">
                <vue-apex-charts
                  type="area"
                  height="400"
                  :options="categoriesChartPartnerComp"
                  :series="seriesChartpartner"
                />
              </div>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col lg="6">
          <b-card no-body>
            <b-card-header>
              <div
                class="d-flex justify-content-between align-items-center"
                style="width: 100%;"
              >
                <h4 class="card-title mb-50 mb-sm-0">
                  Top Partner
                </h4>
                <div class="d-flex align-items-center justify-content-end">
                  <b-button-group>
                    <b-button
                      variant="outline-secondary"
                      class="btn-custom-topcodnoncod"
                      @click="choosenFilterTop('cod', 'filterTopPartner')"
                    >
                      COD
                    </b-button>
                    <b-button
                      variant="outline-secondary"
                      class="btn-custom-topcodnoncod"
                      @click="choosenFilterTop('non_cod', 'filterTopPartner')"
                    >
                      Non-COD
                    </b-button>
                  </b-button-group>
                </div>
              </div>
            </b-card-header>
            <b-card-body>
              <div class="tbl-dashboard-top">
                <b-list-group v-if="topPartner.length > 0">
                  <b-list-group-item
                    v-for="(row, index) in topPartner"
                    :key="index"
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-flex justify-content-between">
                      <b-avatar
                        :src="row.avatar || 'https://via.placeholder.com/52x52'"
                        class="mr-1"
                      />
                      <span class="text-top-each-item">{{ row.partner }}</span>
                    </div>
                    <span class="total-top-each-item">
                      {{ row.profit }}
                    </span>
                  </b-list-group-item>
                </b-list-group>
                <span v-else>
                  No Data
                </span>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <div
      v-else
      class="text-center"
    >
      <b-spinner
        variant="primary"
        label="Text Centered"
      />
    </div>
  </section>
</template>

<script>
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

import { kFormatter } from '@core/utils/filter'
import store from '@/store/index'
import axioskomsipdev from '@/libs/axioskomsipdev'
// import { $themeColors } from '@themeConfig'

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
        month: `0${new Date().getMonth()}`,
      },
      selectedPartner: {
        month: `0${new Date().getMonth()}`,
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
      axioskomsipdev.get(`/v1/admin/dashboard/performance/${type}`, { params: paramsTemp })
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
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
    async fetchDataTop(type = '') {
      axioskomsipdev.get(`/v1/admin/dashboard/top/${type}`)
        .then(({ data }) => {
          this[`top${type.charAt(0).toUpperCase()}${type.substring(1)}Temp`] = data.data
          this[`top${type.charAt(0).toUpperCase()}${type.substring(1)}`] = data.data.cod
        })
        .catch(e => {
          console.log('error', e)
        })
        .finally(() => {
          this.loadDataAwal = false
        })
    },
    objectToQueryString(obj = {}) {
      const str = []
      Object.keys(obj)
        .map(x => {
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
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/chart-apex.scss';
</style>
<style lang="scss" scoped>
.custom-card-header{
  padding-right: 8px;
}
.btn-custom-topcodnoncod{
  @media only screen and (max-width: 390px) {
    padding: 10px;
  }
}
.custom-selected-filter{
  @media only screen and (min-width: 780px) {
    padding-left: 0px;
  }
}
.dashboard-report-wrapper{
  padding-right: 0px;
}
.button-custom{
  padding: 0;
  margin: 0;
  display: grid;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border: 1.5px solid #222222;
}
.dashboard-title{
  letter-spacing: 0.5px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 150%;
  color: #222222;
}
.tbl-dashboard-top{
  height: 440px;
  padding-bottom: 16px;
  // overflow-y: scroll;
}
.card-dashboard{
  padding: 16px 0px;
}
.select-form{
  position: relative;
  z-index: 10000;
  @media screen  {
    //
  }
}
.total-top-each-item{
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  font-family: Poppins;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #34A770;
  padding-right: 10px;
  text-align: right;
  display: inline-block;
}
.text-top-each-item{
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #444444;
}
.wrapper-warning-pemintaan-saldo{
  background: #FBA63C !important;
  border-radius: 16px;
  height: 62px;
}
.text-warning-pemintaan-saldo{
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.5px;
  color: #FFFFFF;
}
.btn-warning-pemintaan-saldo{
  width: 46px;
  height: 46px;
  padding: 0px;
  // background: #FFFFFF;
  // opacity: 0.4;
  border-radius: 12px;
  & span{
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 150%;
    color: #FFFFFF;
    letter-spacing: 0.5px;
  }
}
</style>
