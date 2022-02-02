<template>
  <div class="container p-0">
    <h1 class="mb-2 h-text-xl">
      Informasi Penghasilan
    </h1>
    <div class="d-flex justify-content-between">
      <div
        class="d-block"
        style="width: 29.5%"
      >
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="d-flex align-items-center">
              <div class="first-card-header-text me-8 mb-0">
                Cashback
              </div>
            </div>
          </div>
          <div class="card-body pb-0 mb-0">
            <div class="h-text-xl pb-0 mb-0">
              {{ formatRupiah(cashback) }}
            </div>
            <p class="mb-0">
              Total cashback yang kamu dapatkan semenjak menggunakan Komship
            </p>
          </div>
        </div>
      </div>
      <div
        class="d-block"
        style="width: 21.5%"
      >
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="first-card-header-text me-8 mb-0">
              Penghasilan
              <div class="d-flex align-items-center">
                <p class="mb-0 mr-1">
                  7 Hari Terakhir
                </p>
                <popover-info text="Akumulasi penghasilan 7 hari terakhir." />
              </div>
            </div>
          </div>
          <div class="card-body h-text-lg pb-0 mt-2 mb-0">
            {{ formatRupiah(penghasilan7Hari) }}
          </div>
        </div>
      </div>
      <div
        class="d-block"
        style="width: 21.5%"
      >
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="first-card-header-text me-8 mb-0">
              Penghasilan
              <div class="d-flex align-items-center">
                <p class="mb-0 mr-1">
                  30 Hari Terakhir
                </p>
                <popover-info text="Akumulasi penghasilan dalam 30 hari terakhir." />
              </div>
            </div>
          </div>
          <div class="card-body h-text-lg pb-0 mt-2 mb-0">
            {{ formatRupiah(penghasilan30Hari) }}
          </div>
        </div>
      </div>
      <div
        class="d-block"
        style="width: 21.5%"
      >
        <div class="card h-100">
          <div class="card-header mb-8 pb-0">
            <div class="first-card-header-text me-8 mb-0">
              Penghasilan
              <div class="d-flex align-items-center">
                <p class="mb-0 mr-1">
                  Total
                </p>
                <popover-info text="Akumulasi total penghasilan yang didapatkan." />
              </div>
            </div>
          </div>
          <div class="card-body h-text-lg pb-0 mt-2 mb-0">
            {{ formatRupiah(penghasilanTotal) }}
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <div class="h-text-lg">
              Rincian Penghasilan
            </div>
            <div class="d-flex justify-content-end w-50">
              <b-form-group class="w-25 mb-0 mr-1">
                <v-select
                  v-model="selectedPenghasilan"
                  label="Komship"
                  dir="ltr"
                  :options="optionsPenghasilan"
                  :clearable="false"
                  @input="handleChangePenghasilan"
                />
              </b-form-group>
              <date-range-picker
                ref="picker"
                v-model="dateRange"
                :locale-data="locale"
                :ranges="ranges"
                :opens="'left'"
                class="w-50"
                @input="handleChangePenghasilan"
              >
                <template
                  v-slot:input="picker"
                  style="min-width: 350px"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <span>{{ formatDate(picker.startDate) }} -
                      {{ formatDate(picker.endDate) }}</span>
                  </div>
                </template>
              </date-range-picker>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12 col-md-6 pr-0">
                <p class="h-text-xl">
                  COD
                </p>
                <ChartPenghasilan
                  :datasets="incomeCODGraph.datasets"
                  :labels="incomeCODGraph.labels"
                  :height="300"
                />
              </div>
              <div class="col-12 col-md-6 row px-0">
                <div class="col-12 h-5-5" />
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Orderan COD
                      </div>
                      <popover-info text="Orderan COD merupakan presentase perbandingan jumlah order antara metode pembayaran COD dengan Transfer Bank." />
                    </div>
                    <div class="info-card-body-text">
                      {{ dataCod.orderan }}%
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Orderan Sukses
                      </div>
                      <popover-info text="Presentase orderan dengan status diterima, dari seluruh orderan." />
                    </div>
                    <div class="info-card-body-text">
                      {{ dataCod.sukses }}%
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Orderan Retur
                      </div>
                      <popover-info text="Presentase orderan dengan status retur dari seluruh orderan." />
                    </div>
                    <div class="info-card-body-text">
                      {{ dataCod.retur }}%
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Penghasilan Kotor
                      </div>
                      <popover-info text="Akumulasi penghasilan kotor." />
                    </div>
                    <div class="info-card-body-text text-orange">
                      {{ formatRupiah(dataCod.pKotor) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Penghasilan Bersih
                      </div>
                      <popover-info text="Akumulasi penghasilan bersih." />
                    </div>
                    <div class="info-card-body-text text-blue">
                      {{ formatRupiah(dataCod.pBersih) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Cashback Ongkos Kirim
                      </div>
                      <popover-info text="Akumulasi perolehan cashback ongkos kirim yang diperoleh." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataCod.cashbackOngkir) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Ongkos Kirim
                      </div>
                      <popover-info text="Akumulasi nilai ongkos kirim kotor (tanpa cashback)." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataCod.ongkir) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Ongkos Kirim Bersih
                      </div>
                      <popover-info text="Akumulasi nilai ongkos kirim bersih (setelah cashback)." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataCod.ongkirBersih) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Biaya COD
                      </div>
                      <popover-info text="Akumulasi seluruh Biaya COD dari setiap transaksi COD." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataCod.biayaCod) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12 col-md-6 pr-0">
                <p class="h-text-xl">
                  Transfer
                </p>
                <ChartPenghasilan
                  :datasets="incomeTransferGraph.datasets"
                  :labels="incomeTransferGraph.labels"
                  :height="300"
                />
              </div>
              <div class="col-12 col-md-6 row px-0">
                <div class="col-12 h-5-5" />
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Orderan Transfer Bank
                      </div>
                      <popover-info text="Orderan Transfer Bank merupakan presentase perbandingan jumlah order antara metode pembayaran Transfer Bank dengan COD." />
                    </div>
                    <div class="info-card-body-text">
                      {{ dataTransfer.orderan }}%
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Orderan Sukses
                      </div>
                      <popover-info text="Presentase orderan dengan status diterima, dari seluruh orderan." />
                    </div>
                    <div class="info-card-body-text">
                      {{ dataTransfer.sukses }}%
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Orderan Retur
                      </div>
                      <popover-info text="Presentase orderan dengan status retur dari seluruh orderan.Akumulasi penghasilan kotor." />
                    </div>
                    <div class="info-card-body-text">
                      {{ dataTransfer.retur }}%
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Penghasilan Kotor
                      </div>
                      <popover-info text="Akumulasi penghasilan kotor." />
                    </div>
                    <div class="info-card-body-text text-orange">
                      {{ formatRupiah(dataTransfer.pKotor) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Penghasilan Bersih
                      </div>
                      <popover-info text="Akumulasi penghasilan bersih." />
                    </div>
                    <div class="info-card-body-text text-blue">
                      {{ formatRupiah(dataTransfer.pBersih) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Cashback Ongkos Kirim
                      </div>
                      <popover-info text="Akumulasi perolehan cashback ongkos kirim yang diperoleh." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataTransfer.cashbackOngkir) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Ongkos Kirim
                      </div>
                      <popover-info text="Akumulasi nilai ongkos kirim kotor (tanpa cashback)." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataTransfer.ongkir) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Ongkos Kirim Bersih
                      </div>
                      <popover-info text="Akumulasi nilai ongkos kirim bersih (setelah cashback)." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataTransfer.ongkirBersih) }}
                    </div>
                  </div>
                </div>
                <div class="col-4 pr-0 h-color-dark mb-1">
                  <div class="border rounded-16 h-100 p-1">
                    <div class="d-flex flex-nowrap">
                      <div class="info-card-header-text">
                        Biaya COD
                      </div>
                      <popover-info text="Akumulasi seluruh Biaya COD dari setiap transaksi COD." />
                    </div>
                    <div class="info-card-body-text">
                      {{ formatRupiah(dataTransfer.biayaCod) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { BFormGroup } from 'bootstrap-vue'
import vSelect from 'vue-select'
import DateRangePicker from 'vue2-daterange-picker'
import ChartPenghasilan from '../../../components/chart/ChartPenghasilan.vue'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import PopoverInfo from '../../../components/popover/PopoverInfo.vue'

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
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.container {
  font-family: 'Poppins', sans-serif;
}
.h-text-xl {
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.h-text-lg {
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.first-card-header-text {
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #828282;
}
.first-card-header-text p {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.info-card-header-text {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.info-card-body-text {
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-align: left;
}
.card,
.rounded-16 {
  border-radius: 16px !important;
}
.h-color-dark {
  color: #222222;
}
.text-orange {
  color: #fba63c;
}
.text-blue {
  color: #08a0f7;
}
.h-5-5 {
  height: 5.5em;
}
.reportrange-text {
  background-color: #fff !important;
  display: flex;
}
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
