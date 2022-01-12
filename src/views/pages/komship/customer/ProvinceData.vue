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
      <b-row>
        <b-col>
          <h3 class="mb-50 mb-md-0">
            Ranking Provinsi Customer
          </h3>
        </b-col>
        <b-col cols="auto">
          <b-form-select
            v-model="rangkingProvince"
            :options="rangkingProvinceOptions"
            class="mb-50 mb-md-0"
            @change="changeData"
          />
        </b-col>

      </b-row>

      <b-row class="d-flex align-items-center">
        <b-col
          md="4"
        >
          <div v-if="province[0] !== undefined">
            <b-list-group
              v-for="(items, index) in province"
              :key="index+1"
              class="ml-2"
            >
              <b-list-group-item class="border-0 p-1">
                {{ items.province_name }}
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
          <div id="chart"
          >
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
      rangkingProvince: 0,
      rangkingProvinceOptions: [
        { text: 'Bulan ini', value: 0 },
        { text: 'Life Time', value: 1 },
      ],
      selected: 1,

      province: [],
      city: [],

      series: [{
        data: [],
      }],
      heightBar: 0,
      chartOptions: {
        colors: '#34A770',
        chart: {
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
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff'],
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff'],
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        xaxis: {
          categories: [],
        },
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    changeData() {
      this.loading = true
      const params = {
        is_liftime: this.rangkingProvince,
      }
      httpKomship.get('/v1/customers/ranking-customers', params, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.chartOptions.xaxis.categories.splice(0, this.chartOptions.xaxis.categories.length)
        const { data } = response.data
        this.province = data.province
        this.loading = false
        data.province.forEach(this.myArray)
        this.series = [
          {
            data: this.getPercentage(data.province),
          },
        ]
        return this.province
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
      const params = {
        is_liftime: this.rangkingProvince,
      }
      httpKomship.get('/v1/customers/ranking-customers', params, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.province = data.province
        if (this.province.length === 5) this.heightBar = 290
        if (this.province.length === 4) this.heightBar = 250
        if (this.province.length === 3) this.heightBar = 210
        if (this.province.length === 2) this.heightBar = 150
        if (this.province.length === 1) this.heightBar = 120
        this.loading = false
        data.province.forEach(this.myArray)
        this.series = [
          {
            data: this.getPercentage(data.province),
          },
        ]
        return this.province
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
      this.chartOptions.xaxis.categories.push(data.total_province)
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
