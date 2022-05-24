<template>
  <b-card>
    <h2 class="font-bold mb-2">
      Rincian Saldo
    </h2>
    <b-row class="mb-1">
      <b-col cols="6">
        <div
          style="border: 1px solid #E2E2E2; border-radius: 8px;"
          class="w-80 text-xl px-1 py-2"
        >
          Saldo: <span class="text-primary font-bold">{{ totalSaldo>=0?'':'-' }} Rp {{ formatNumber(totalSaldo) }}</span>
        </div>
      </b-col>
      <b-col cols="6">
        <div class="w-48 ml-auto">
          <b-form-select
            v-model="selectedFilter"
            :options="optionsFilter"
            @change="fetchData"
          />
        </div>
      </b-col>
    </b-row>
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
        :items="items"
        :fields="fields"
      >
        <template #cell(date_transaction)="data">
          <span>{{ moment(data.item.date_transaction) }}</span><br>
          <span class="text-muted">{{ momentTime(data.item.date_transaction) }}</span>
        </template>
        <template #cell(transaction_type)="data">
          <span v-if="data.item.transaction_type === 'topup'">
            Top Up Saldo
          </span>
          <span v-if="data.item.transaction_type === 'shopping'">
            Belanja (Keperluan Talent)
          </span>
          <span v-if="data.item.transaction_type === 'withdrawal'">
            Penarikan Saldo
          </span>
          <span v-if="data.item.transaction_type === 'orderku_done'">
            Orderan COD<br><span class="text-muted">Diterima</span>
          </span>
          <span v-if="data.item.transaction_type === 'orderku_cancel'">
            Orderan Non COD<br><span class="text-muted">Cancel</span>
          </span>
          <span v-if="data.item.transaction_type === 'orderku_ongkir'">
            Orderan Non COD<br><span class="text-muted">Ongkir</span>
          </span>
          <span v-if="data.item.transaction_type === 'orderku_retur' && data.item.payment_method === 'COD'">
            Orderan COD<br><span class="text-muted">Retur</span>
          </span>
          <span v-if="data.item.transaction_type === 'orderku_retur' && data.item.payment_method === 'BANK TRANSFER'">
            Orderan Non COD<br><span class="text-muted">Retur</span>
          </span>
        </template>
        <template #cell(amount)="data">
          <span
            v-if="data.item.amount.charAt(0) === '+'"
            class="text-success"
          >
            +Rp {{ formatNumber(data.item.amount) }}
          </span>
          <span
            v-if="data.item.amount.charAt(0) === '-'"
            class="text-primary"
          >
            -Rp {{ formatNumber(data.item.amount) }}
          </span>
        </template>
        <template #cell(saldo)="data">
          {{ data.item.saldo >= 0 ? '' : '-' }}Rp {{ formatNumber(data.item.saldo) }}
        </template>
        <template #cell(action)="data">
          <b-button
            v-if="data.item.order_id !== 0"
            variant="none"
            class="button-detail d-flex text-info"
            :to="{ name: 'detail-order', params: { order_id: data.item.order_id } }"
            target="_blank"
          >
            Lihat Detail
          </b-button>
          <span v-else>-</span>
        </template>>
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
  </b-card>
</template>
<script>
import {
  BCard, BRow, BCol, BFormSelect, BTable, BButton, BPagination, BOverlay,
} from 'bootstrap-vue'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  components: {
    BCard, BRow, BCol, BFormSelect, BTable, BButton, BPagination, BOverlay,
  },
  data() {
    return {
      selectedFilter: '7 Hari Terakhir',
      optionsFilter: ['7 Hari Terakhir', '1 Bulan Terakhir', '3 Bulan Terakhir'],
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
          key: 'action', label: '',
        },
      ],
      loadTable: false,
      startDate: null,
      endDate: null,
      pageOptions: [20, 50],
      currentPage: 1,
      perPage: 20,
      totalItems: 0,
    }
  },
  computed: {
    ...mapState('saldoDetail', ['totalSaldo']),
  },
  watch: {
    currentPage: {
      handler() {
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
  beforeMount() {
    this.$store.dispatch('saldoDetail/init')
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
    momentTime(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        return moment(date).format('HH:MM')
      }
      return ''
    },
    getDate() {
      const today = new Date()
      this.endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
      if (this.selectedFilter === '7 Hari Terakhir') {
        const last = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))
        this.startDate = `${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()}`
      } else if (this.selectedFilter === '1 Bulan Terakhir') {
        const last = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
        this.startDate = `${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()}`
      } else if (this.selectedFilter === '3 Bulan Terakhir') {
        const last = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000))
        this.startDate = `${last.getFullYear()}-${last.getMonth() + 1}-${last.getDate()}`
      }
    },
    async fetchData() {
      this.loadTable = true
      this.items = await this.$http_komship.get('v1/partner/order-transaction-balance', {
        params: {
          start_date: this.startDate,
          end_date: this.endDate,
          page: this.currentPage,
          limits: this.perPage,
        },
      })
        .then(res => {
          const { data } = res.data
          this.totalItems = data.total
          this.loadTable = false
          return data.data
        })
        .catch(() => {
          // handle error
        })
    },
    setPage(totalPage) {
      this.perPage = totalPage
      this.fetchData()
    },
  },
}
</script>
<style>
.btnPage {
  padding: 4px 7px;
  margin-right: 5px;
}
</style>
