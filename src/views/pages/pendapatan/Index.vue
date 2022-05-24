<template>
  <section id="cod-pendapatan">
    <div v-if="!loadDataAwal">
      <b-card no-body>
        <b-card-body>
          <div class="wrapper__performa">
            <h3
              class="text-24-bold"
              style="color: #222222;"
            >
              Performa Partner
            </h3>
            <div class="wrapper__total">
              <div
                v-if="[0,2].indexOf(tabActiveIndex) !== -1"
                class="container__total mr-1"
              >
                <span
                  class="text__total-label"
                  style="color: #828282;font-size: 20px;font-weight: 500;"
                >
                  {{
                    tabActiveIndex === 0 ? 'Total Profit Ongkir' : ( tabActiveIndex === 2 ? 'Total Profit Ongkir COD' : '')
                  }}
                </span>
                <span
                  class="text__total text-black"
                >
                  {{ totalOngkir | rupiah }}
                </span>
              </div>
              <div
                class="container__total"
              >
                <span
                  class="text__total-label"
                  style="color: #828282;font-size: 20px;font-weight: 500;"
                >
                  {{
                    tabActiveIndex === 0 ? 'Total Profit COD' : ( tabActiveIndex === 1 ? 'Total Profit Non-COD' : 'Total Profit Ongkir Non-COD')
                  }}
                </span>
                <span
                  class="text__total text-black"
                >
                  {{ totalCod | rupiah }}
                </span>
              </div>
            </div>
          </div>
          <b-tabs
            v-model="tabActiveIndex"
            content-class="mt-1"
            class="mt-1"
            active-nav-item-class="font-weight-bold text-danger"
            active-tab-class="font-weight-bold text-danger"
            justified
          >
            <!-- This tabs content will always be mounted -->
            <b-tab
              title="COD"
            >
              <tab-cod
                ref="dataTabCOD"
                lazy
                :shipment-data="shipment"
                @totalCodFunc="totalCodFunc"
                @totalOngkirFunc="totalOngkirFunc"
              />
            </b-tab>

            <!-- and will be un-mounted when hidden -->
            <b-tab
              title="Non - COD"
              lazy
            >
              <tab-non-cod
                :shipment-data="shipment"
                @totalCodFunc="totalCodFunc"
                @totalOngkirFunc="totalOngkirFunc"
              />
            </b-tab>
            <!-- and will be un-mounted when hidden -->
            <b-tab
              title="Keduanya"
              lazy
            >
              <tab-keduanya
                :shipment-data="shipment"
                @totalCodFunc="totalCodFunc"
                @totalOngkirFunc="totalOngkirFunc"
              />
            </b-tab>
          </b-tabs>
        </b-card-body>
      </b-card>
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
  // BRow,
  BTab,
  BTabs,
  BCard,
  BSpinner,
  BCardBody,
} from 'bootstrap-vue'

import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import TabCod from './TabCod.vue'
import TabNonCod from './TabNonCod.vue'
import TabKeduanya from './TabKeduanya.vue'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BSpinner,
    BCardBody,
    TabCod,
    TabNonCod,
    TabKeduanya,
  },
  data() {
    return {
      totalCod: 0,
      totalOngkir: 0,
      loadDataAwal: true,
      tabActiveIndex: 0,
      shipment: [],
    }
  },
  computed: {
    //
  },
  watch: {
    tabActiveIndex: {
      handler(val) {
        if (val === 0) {
          this.$refs.dataTabCOD.fetchData()
        }
      },
    },
  },
  mounted() {
    this.getShipmentData()
  },
  created() {
    setTimeout(() => {
      this.loadDataAwal = false
    }, 1000)
  },
  methods: {
    totalCodFunc(val) {
      this.totalCod = val
    },
    totalOngkirFunc(val) {
      this.totalOngkir = val
    },
    getShipmentData() {
      const endpoint = '/v1/admin/shipment'
      this.$http_komship.get(endpoint)
        .then(({ data }) => {
          const parseData = JSON.parse(JSON.stringify(data.data))
          const ubahDataShipment = parseData.map(x => ({ title: x.shipping_name }))
          this.shipment = ubahDataShipment
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text: 'Unable to load the table data. Please try again later or contact support.',
              variant: 'danger',
            },
          })
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>

<style lang="scss" scoped>
.wrapper__performa{
  display: flex;
  justify-content: space-between;
}
.wrapper__total{
  display: flex;
}
.container__total{
  min-width: 320px;
  height: 133px;
  display: grid;
  padding: 24px;
  border: 1px solid #828282;
  border-radius: 16px;
}
.text__total{
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 150%;
  align-items: center;
  letter-spacing: 0.5px;
  color: #222222;

  &-label{
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 150%;
    align-items: center;
    letter-spacing: 0.5px;
    color: #828282;
  }
}
.wrappertab__content{
  display: grid;
}
@media screen and (max-width: 1000px) {
  .wrapper__performa{
    display: grid;
    justify-content: center;
    text-align: center;
  }
  .wrapper__total{
    display: grid;
    grid-row-gap: 1rem;
  }
}
</style>
