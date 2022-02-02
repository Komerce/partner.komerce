<template>
  <div class="container p-0">
    <div class="card">
      <div class="card-header align-items-start">
        <div>
          <p class="h-text-lg mb-0">
            Rincian Penarikan
          </p>
          <p class="h-text-sm font-weight-normal">
            {{ `${indoDate(previous_request_withdrawal_date)}( ${previous_request_withdrawal_time} WIB)` }} - {{ `${indoDate(dateEnd)}( ${timeEnd} WIB)` }}
          </p>
        </div>
        <span
          v-if="statusPenerimaan.toLowerCase() === 'completed'"
          class="font-weight-bold rounded status-success"
        >Disetujui</span>
        <span
          v-else-if="statusPenerimaan.toLowerCase() === 'on_review'"
          class="font-weight-bold rounded status-warning"
        >Sedang Direview</span>
        <span
          v-else-if="statusPenerimaan.toLowerCase() === 'requested'"
          class="font-weight-bold rounded status-warning"
        >Perlu Disetujui</span>
        <span
          v-else-if="statusPenerimaan.toLowerCase() === 'canceled'"
          class="font-weight-bold rounded status-danger"
        >Dibatalkan</span>
        <span
          v-else
          class="font-weight-bold rounded status-danger"
        >Dibatalkan</span>
      </div>
      <div class="card-body px-0">
        <div class="row px-2">
          <div class="col-md-6">
            <div class="rounded border p-1">
              <p class="h-text-md mb-0">
                <span class="font-weight-normal">Total Saldo: </span>
                <span class="text-orange">{{
                  formatRupiah(totalSaldo)
                }}</span>
              </p>
            </div>
          </div>
          <div class="col-md-6 mt-2 mt-md-0">
            <div class="rounded border p-1">
              <p class="h-text-md mb-0">
                <span
                  class="font-weight-normal"
                >Nominal Penarikan Saldo:
                </span>
                {{ formatRupiah(nominalPenarikan) }}
              </p>
              <p class="h-text-md mb-0">
                <span class="font-weight-normal">Sisa Saldo: </span>
                {{ formatRupiah(sisaSaldo) }}
              </p>
            </div>
          </div>
          <div class="col-12 mt-2">
            <b-overlay
              variant="light"
              :show="loadTable"
              spinner-variant="primary"
              blur="0"
              opacity=".5"
              rounded="sm"
            >
              <b-table
                responsive
                show-empty
                empty-text="Tidak ada data untuk ditampilkan."
                :items="list"
                :fields="fields"
              >
                <template #head(shipping_cost)="data">
                  <span class="d-flex">{{ data.label }}
                    <img
                      id="ongkosKirim"
                      src="@/assets/images/icons/info-circle-dark.svg"
                      class="w-5 h-5"
                      style="margin-left:5px;cursor:pointer;"
                    >
                  </span>
                  <b-tooltip
                    target="ongkosKirim"
                    triggers="hover"
                  >
                    Ongkos kirim dari orderan.
                  </b-tooltip>
                </template>
                <template #head(service_fee)="data">
                  <span class="d-flex">{{ data.label }}
                    <img
                      id="biayaCOD"
                      src="@/assets/images/icons/info-circle-dark.svg"
                      class="w-5 h-5"
                      style="margin-left:5px;cursor:pointer;"
                    >
                  </span>
                  <b-tooltip
                    target="biayaCOD"
                    triggers="hover"
                  >
                    Biaya COD dari orderan yang menggunakan layanan COD.
                  </b-tooltip>
                </template>
                <template #cell(order_date)="data">
                  {{ moment(data.item.date_transaction) }}
                </template>
                <template #cell(transaction_type)="data">
                  <div v-if="data.item.transaction_type === 'topup'">
                    Top UP Saldo
                  </div>
                  <div v-else-if="data.item.transaction_type === 'withdrawal'">
                    Penarikan Saldo
                  </div>
                  <div v-else-if="data.item.transaction_type === 'shopping'">
                    <div class="text-black text-md">
                      Belanja
                    </div>
                    <div class="text-xs text-secondary">
                      Keperluan talent
                    </div>
                  </div>
                  <div v-else-if="data.item. transaction_type === 'orderku_done'">
                    <div class="text-black text-md">
                      Orderan COD
                    </div>
                    <div class="text-xs text-secondary">
                      Diterima
                    </div>
                  </div>
                  <div v-else-if="data.item.transaction_type === 'orderku_ongkir'">
                    <div class="text-black text-md">
                      Orderan Non COD
                    </div>
                    <div class="text-xs text-secondary">
                      Ongkir
                    </div>
                  </div>
                  <div v-else-if="data.item.transaction_type === 'orderku_cancel'">
                    <div class="text-black text-md">
                      Orderan Non COD
                    </div>
                    <div class="text-xs text-secondary">
                      Dibatalkan
                    </div>
                  </div>
                  <div v-else-if="data.item.transaction_type === 'orderku_retur (payment_method COD)'">
                    <div class="text-black text-md">
                      Orderan COD
                    </div>
                    <div class="text-xs text-secondary">
                      Retur
                    </div>
                  </div>
                  <div v-else-if="data.item.transaction_type === 'orderku_retur (payment_method Bank Transfer)'">
                    <div class="text-black text-md">
                      Orderan Non COD
                    </div>
                    <div class="text-xs text-secondary">
                      Retur
                    </div>
                  </div>
                  <div v-else>
                    -
                  </div>
                </template>
                <template #cell(amount)="data">
                  <span
                    v-if="parseInt(data.item.amount) < 0"
                    class="
                    text-primary"
                  >
                    -Rp.{{ formatNumber(data.item.amount) }}
                  </span>
                  <span
                    v-else
                    class="text-success"
                  >
                    +Rp.{{ formatNumber(data.item.amount) }}
                  </span>
                </template>
                <template #cell(saldo)="data">
                  Rp. {{ formatNumber(data.item.saldo) }}
                </template>
                <template #cell(action)="data">
                  <p
                    v-if="
                      data.item.transaction_type === 'topup' || data.item.transaction_type === 'withdrawal' || data.item.transaction_type === 'shopping' || typeof data.item.order_id=== undefined
                    "
                  >
                  -
                  </p>
                  <a
                    v-else
                    :href="'/detail-order/' + data.item.id"
                    class="text-info"
                  >
                    Lihat Detail
                  </a>
                </template>
              </b-table>
              <div class="d-flex justify-between align-middle">
                <div>
                  <span class="mr-1">List per halaman</span>
                  <b-button
                    v-for="page in pageOptions"
                    :key="page"
                    :variant="page === perPage ? 'primary' : 'light'"
                    size="sm"
                    class="btnPage"
                    @click="setPage(page)"
                  >
                    {{ page }}
                  </b-button>
                </div>
                <b-pagination
                  v-model="currentPage"
                  size="md"
                  class="float-right mr-2"
                  :total-rows="totalItems"
                  :per-page="perPage"
                  first-number
                  last-number
                />
              </div>
            </b-overlay>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <p class="font-weight-bold mb-0">
          Catatan:
        </p>
        <p>
          {{ notes == null || notes == '' ? 'Tidak ada catatan': notes }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  BTable, BButton, BPagination, BOverlay, BTooltip,
} from 'bootstrap-vue'
import moment from 'moment'

export default {
  components: {
    BTable, BButton, BPagination, BOverlay, BTooltip,

  },
  data() {
    return {
      items: [],
      fields: [
        {
          key: 'date_transaction', label: 'Tanggal', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'transaction_type', label: 'Jenis Transaksi', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'amount', label: 'Jumlah', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'saldo', label: 'Saldo', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'action', label: '', thClass: 'align-middle', tdClass: 'align-top',
        },
      ],
      loadTable: false,
      tableTitles: [
        'Tanggal',
        'Jenis Order',
        'Nilai Orders',
        'Ongkos Kirim',
        'Biaya COD',
        'Saldo',
      ],
      tableHeadInfos: [3, 4],
      startDate: null,
      endDate: null,
      pageOptions: [20, 50],
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
      list: [],
    }
  },
  watch: {
    currentPage: {
      handler(value) {
        this.fetchData().catch(error => {
          console.error(error)
        })
      },
    },
  },
  mounted() {
    this.fetchData().catch(error => {
      console.error(error)
    })
  },
  methods: {
    formatNumber: value => (`${value}`).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    moment(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        return moment(date).format('DD-MM-YYYY')
      }
      return ''
    },
    indoDate(string) {
      const newString = string.toLowerCase()
      if (newString.indexOf('january')) {
        return string.replace('January', 'Januari')
      } if (newString.indexOf('february')) {
        return string.replace('February', 'Februari')
      } if (newString.indexOf('march')) {
        return string.replace('March', 'Maret')
      } if (newString.indexOf('april')) {
        return string.replace('April', 'April')
      } if (newString.indexOf('may')) {
        return string.replace('May', 'Mei')
      } if (newString.indexOf('june')) {
        return string.replace('June', 'Juni')
      } if (newString.indexOf('july')) {
        return string.replace('July', 'Juli')
      } if (newString.indexOf('august')) {
        return string.replace('August', 'Agustus')
      } if (newString.indexOf('september')) {
        return string.replace('September', 'September')
      } if (newString.indexOf('october')) {
        return string.replace('October', 'Oktober')
      } if (newString.indexOf('november')) {
        return string.replace('November', 'November')
      } if (newString.indexOf('december')) {
        return string.replace('December', 'Desember')
      }
      return string
    },
    formatRibuan(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatRupiah(x) {
      if (x === '-') return x
      return `Rp ${this.formatRibuan(x)}`
    },
    fetchKmPoint() {

    },
    async fetchData() {
      const user = JSON.parse(localStorage.getItem('userData'))
      this.loadTable = true
      await this.$http_komship.get('v1/partner/order-transaction-balance', {
        params: {
          user_id: user.id,
          start_date: this.startDate,
          end_date: this.endDate,
          page: this.currentPage,
          total_per_page: this.perPage,
        },
      })
        .then(res => {
          const { data } = res.data
          this.totalItems = data.total
          this.loadTable = false
          this.list = data.data
        })
        .catch(error => {
          this.loadTable = false
          console.log(error)
        })
    },
    setPage(totalPage) {
      this.perPage = totalPage
      this.fetchData()
    },
  },
  computed: {
    ...mapState('saldoPenarikan', [
      'dateStart',
      'dateEnd',
      'timeEnd',
      'totalSaldo',
      'nominalPenarikan',
      'statusPenerimaan',
      'rincianSaldos',
      'notes',
      'previous_request_withdrawal_date',
      'previous_request_withdrawal_time',
    ]),
    ...mapGetters('saldoPenarikan', ['sisaSaldo']),
  },
  beforeMount() {
    this.$store.commit('saldoPenarikan/UPDATE_ID', this.$route.params.id)
    this.$store.dispatch('saldoPenarikan/init')
    this.$store.dispatch('saldoPenarikan/UPDATE_DETAIL_SALDO', this.$route.params.id)
    this.fetchData()
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
.status-success,
.status-info,
.status-warning,
.status-danger {
  padding: 8px 27px;
}
.status-success {
  background-color: #dcf3eb;
  color: #34a770;
}
.status-info {
  background-color: #dff3ff;
  color: #08a0f7;
}
.status-warning {
  background-color: #fff2e2;
  color: #fba63c;
}
.status-danger {
  background-color: #ffeded;
  color: #e31a1a;
}
</style>
