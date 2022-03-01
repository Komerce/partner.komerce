<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
  >
    <b-card>

      <b-row class="mt-3">
        <b-col>
          <h3 class="mb-50 mb-md-0">
            Ranking Kota Customer
          </h3>
        </b-col>
        <b-col cols="auto">
          <b-form-select
            v-model="rangkingCity"
            :options="rangkingCityOptions"
            class="mb-50 mb-md-0"
            @change="changeData"
          />
        </b-col>
      </b-row>

      <b-row class="d-flex align-items-center">
        <b-col
          md="4"
        >
          <div v-if="city[0] !== undefined">
            <b-list-group
              v-for="(items, index) in city"
              :key="index+1"
              class="ml-2"
            >
              <b-list-group-item class="border-0 p-1">
                {{ items.city_name }}
              </b-list-group-item>
            </b-list-group>
          </div>
          <div v-else>
            Tidak ada data
          </div>
        </b-col>

        <b-col
          md="8"
          class="mt-50"
        >
          <div id="chart">
            <vue-apex-charts
              ref="realtimeChart"
              type="bar"
              :height="heightBar"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </b-col>
      </b-row>

    </b-card>
  </b-overlay>
</template>

<script>
import {
  BCol,
  BRow,
  BListGroup,
  BListGroupItem,
  BFormSelect,
  BCard,
  BOverlay,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from '../setting-kompship/http_komship'

export default {
  components: {
    BCol,
    BRow,
    BListGroup,
    BListGroupItem,
    VueApexCharts,
    BFormSelect,
    BCard,
    BOverlay,
  },
  data() {
    return {
      loading: false,
      rangkingCity: 1,
      rangkingCityOptions: [
        { text: 'Bulan ini', value: 0 },
        { text: 'Life Time', value: 1 },
      ],
      selected: 1,

      city: [],

      series: [{
        data: [],
      }],
      heightBar: 120,
      chartOptions: {
        colors: '#34A770',
        chart: {
          toolbar: {
            tools: {
              download: false,
            },
          },
          width: 3,
          type: 'bar',
          height: this.heightBar,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          offsetX: 30,
          style: {
            fontSize: '12px',
            colors: ['black'],
          },
          formatter(val) {
            return val ? `${val.toFixed(0)}%` : ''
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff'],
        },
        tooltip: {
          enabled: false,
          intersect: false,
          x: {
            show: false,
          },
        },
        xaxis: {
          categories: [],
          max: 100,
        },
      },
    }
  },
  mounted() {
    this.getData()
    this.changeData()
  },
  methods: {
    changeData() {
      this.loading = false
      httpKomship.get('/v1/customers/ranking-customers', {
        params: {
          is_lifetime: this.rangkingCity,
        },
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.chartOptions.xaxis.categories.splice(0, this.chartOptions.xaxis.categories)
        const { data } = response.data
        this.city = data.city

        this.loading = false
        data.city.forEach(this.myArray)
        this.series = [
          {
            data: this.getPercentage(data.city),
          },
        ]
        return this.city
      }).catch(() => {
        this.loading = false
        this.series = [
          {
            data: [],
          },
        ]
      })
    },
    getData() {
      this.loading = true
      httpKomship.get('/v1/customers/ranking-customers', {
        params: {
          is_lifetime: this.rangkingCity,
        },
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.city = data.city
        this.loading = false
        data.city.forEach(this.myArray)
        this.series = [
          {
            data: this.getPercentage(data.city),
          },
        ]
        return this.city
      }).catch(() => {
        this.loading = false
        this.series = [
          {
            data: [],
          },
        ]
      })
    },
    getPercentage(value) {
      const result = value.map(item => (item.percentage))
      return result
    },
    myArray(data) {
      this.chartOptions.xaxis.categories.push(data.total_city)
    },
  },
}
</script>

<style lang="scss">

@import '~@core/scss/vue/libs/vue-flatpicker.scss';

</style>
