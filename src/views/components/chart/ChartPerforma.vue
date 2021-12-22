<template>
  <VueApexcharts
    ref="myChart"
    width="700"
    type="area"
    :options="options"
    :series="series"
  />
</template>

<script>
import VueApexcharts from 'vue-apexcharts'

export default {
  name: 'ChartPerforma',
  components: {
    VueApexcharts,
  },
  props: {
    categoriesProp: {
      type: Array,
    },
    seriesProp: {
      type: Array,
    },
  },
  data() {
    return {
      options: {
        chart: {
          id: `vuechart-${Date.now()}`,
          toolbar: {
            show: false,
          },
          stacked: true,
        },
        fill: {
          colors: ['#08A0F7', '#34A770', '#F95031'],
        },
        colors: ['#08A0F7', '#34A770', '#F95031'],
        xaxis: {
          categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            formatter: value => {
              let formatedVal = 0

              if (Math.abs(Number(value)) >= 1.0e9) {
                formatedVal = `${Math.abs(Number(value)) / 1.0e9} Mn`
              } else if (Math.abs(Number(value)) >= 1.0e6) {
                formatedVal = `${Math.abs(Number(value)) / 1.0e6} Jt`
              } else if (Math.abs(Number(value)) >= 1.0e3) {
                formatedVal = `${Math.abs(Number(value)) / 1.0e3} Rb`
              } else {
                formatedVal = Math.abs(Number(value))
              }
              return `${formatedVal}`
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
      },
      series: [
        {
          name: 'Leads',
          data: ['24', '23', '27', '20', '25', '28', '21'],
        },
        {
          name: 'Orders',
          data: ['14', '13', '17', '20', '15', '18', '11'],
        },
        {
          name: 'Pcs',
          data: ['4', '3', '7', '10', '5', '8', '1'],
        },
      ],
    }
  },
  watch: {
    seriesProp() {
      this.$refs.myChart.updateSeries(this.seriesProp)
    },
    categoriesProp() {
      this.options.xaxis.categories = this.categoriesProp
      this.$refs.myChart.updateOptions(this.options)
    },
  },
}
</script>
