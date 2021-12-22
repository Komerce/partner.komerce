<template>
  <div class="container p-0">
    <div class="card">
      <div class="card-header">
        <div>
          <p class="h-text-lg mb-0">
            Rincian Saldo
          </p>
        </div>
      </div>
      <div class="card-body px-0">
        <div class="row justify-content-between px-2">
          <div class="col-12 col-md-4">
            <div class="rounded border p-1">
              <p class="h-text-md mb-0">
                <span class="font-weight-normal">Total Saldo: </span>
                <span class="text-orange">{{ formatRupiah(totalSaldo) }}</span>
              </p>
              <!-- <p class="h-text-md mb-0">
                <span class="font-weight-normal">Saldo Awal: </span>
                {{ formatRupiah(saldoAwal) }}
              </p> -->
            </div>
          </div>
          <div class="col-12 col-md-2">
            <!-- <div class="w-25"> -->
            <b-form-group class="mb-0">
              <v-select
                id="select_saldo"
                v-model="selectedSaldo"
                dir="ltr"
                :options="optionsSaldo"
                :clearable="false"
                @input="handleChangeSaldo"
              />
            </b-form-group>
            <!-- </div> -->
          </div>
          <table class="table table-borderless mt-3">
            <thead>
              <tr>
                <th
                  v-for="title in tableTitles"
                  :key="title"
                  class="
                    h-text-sm
                    transform-none
                    h-text-dark
                    bg-white
                    h-border-bottom
                    pb-2
                  "
                  scope="col"
                >
                  {{ title }}
                  <img
                    v-if="
                      tableTitles.indexOf(title) == 3 ||
                        tableTitles.indexOf(title) == 4
                    "
                    src="@/assets/images/icons/info-circle-dark.svg"
                    alt="Info"
                  >
                </th>
              </tr>
            </thead>
            <tbody class="h-text-xs">
              <tr
                v-for="rincian in rincianSaldos"
                :key="rincianSaldos.indexOf(rincian)"
                :class="
                  'py-1' +
                    (rincianSaldos.indexOf(rincian) != rincianSaldos.length - 1
                      ? ' border-bottom'
                      : '')
                "
              >
                <th>
                  <p class="mb-0 h-text-dark">
                    {{ rincian.tanggal }}
                  </p>
                </th>
                <td>
                  <p class="mb-0 h-text-dark font-weight-bold">
                    {{
                      rincian.jenisOrder
                    }}
                  </p>
                  <p
                    v-if="rincian.retur"
                    class="text-xxs mb-0"
                  >
                    Retur
                  </p>
                </td>
                <td class="h-text-dark font-weight-bold">
                  {{ formatRupiah(rincian.nilaiOrder) }}
                </td>
                <td>
                  <p class="mb-0 h-text-dark font-weight-bold">
                    {{ formatRupiah(rincian.ongkir) }}
                  </p>
                  <p
                    v-if="rincian.ongkirTambahan"
                    class="text-xxs mb-0 font-weight-bold"
                  >
                    {{ formatRupiah(rincian.ongkirTambahan) }}
                  </p>
                </td>
                <td class="h-text-dark font-weight-bold">
                  {{
                    rincian.biayaCod !== null
                      ? formatRupiah(rincian.biayaCod)
                      : '-'
                  }}
                </td>
                <td
                  :class="
                    'font-weight-bold ' +
                      (rincian.negative ? 'text-danger' : 'text-success')
                  "
                >
                  {{
                    (rincian.negative ? '-' : '+') + formatRupiah(rincian.saldo)
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { BFormGroup } from 'bootstrap-vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  components: {
    BFormGroup,
    vSelect,
  },
  data() {
    return {
      tableTitles: [
        'Tanggal',
        'Jenis Order',
        'Nilai Order',
        'Ongkos Kirim',
        'Biaya COD',
        'Saldo',
      ],
      tableHeadInfos: [3, 4],
    }
  },
  computed: {
    ...mapFields('saldoDetail', { selectedSaldo: 'selectedSaldo' }),
    ...mapState('saldoDetail', ['totalSaldo', 'rincianSaldos', 'optionsSaldo']),
  },
  beforeMount() {
    this.$store.dispatch('saldoDetail/init')
  },
  methods: {
    formatRibuan(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatRupiah(x) {
      if (x === '-') return '-'
      return `Rp ${this.formatRibuan(x)}`
    },
    handleChangeSaldo() {
      this.$store.dispatch('saldoDetail/getRincianSaldo')
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.container {
  font-family: 'Poppins', sans-serif;
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
.h-text-md {
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.h-text-sm {
  font-size: 16px !important;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.h-text-xs {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.5px;
  text-align: left;
}
.text-xxs {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.5px;
  text-align: left;
}
.text-orange {
  color: #ff6a3a;
}
.h-text-dark {
  color: #222222 !important;
}
.transform-none {
  text-transform: none !important;
}
.h-border-bottom {
  border-bottom: 2px solid #c2c2c2 !important;
}
.text-danger {
  color: #e31a1a;
}
.text-success {
  color: #34a770;
}

.bg-orange {
  background-color: #ff6a3a !important;
}
.bg-orange2 {
  background-color: #f95031 !important;
}
.card,
.rounded-16 {
  border-radius: 16px !important;
}
.first-card-header-text {
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-align: left;
}
.saldo-texts {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.5px;
  text-align: left;
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
.order-head-text {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-align: left;
}
.order-body-text {
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: 0.5px;
  text-align: left;
  color: #222222;
}
.container {
  font-family: 'Poppins', sans-serif;
}
.ms-8 {
  margin-left: 8px;
}
.me-8 {
  margin-right: 8px;
}
.mb-8 {
  margin-bottom: 8px;
}
.py-9 {
  padding-top: 9px;
  padding-bottom: 9px;
}
.mx-16 {
  margin-left: 16px;
  margin-right: 16px;
}
.my-24 {
  margin-top: 24px;
  margin-bottom: 24px;
}
.p-12 {
  padding: 12px;
}
.h-text-dark {
  color: #222222;
}
.border-gray {
  border: 1px solid #e2e2e2;
}
.list-text-1 {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 27px;
  letter-spacing: 0.5px;
  text-align: left;
}
.list-text-2 {
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0.5px;
  text-align: right;
}
.list-text-3 {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.5px;
  text-align: right;
}
.text-green {
  color: #34a770;
}
.h-badge-success {
  background-color: #dcf3eb;
  color: #34a770;
}
.h-badge-danger {
  background-color: #ffeded;
  color: #e31a1a;
}
#select_saldo > div {
  border: none;
  padding-left: 0px;
}
#select_saldo > div > .vs__selected-options,
#select_saldo > div > .vs__selected-options > .vs__selected {
  padding-left: 0px;
  margin-left: 0;
}
.select-chart {
  right: 42px;
  width: 38%;
}
.h-70 {
  height: 70%;
}
.w-30 {
  width: 30%;
}
.blurry {
  filter: blur(7px);
  pointer-events: none;
  user-select: none;
}
.pos-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dropdown-item {
  width: 100% !important;
}
</style>
