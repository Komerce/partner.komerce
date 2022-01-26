<template>
  <b-card>
    <b-row class="mb-4 px-1">
      <b-button
        variant="primary"
        class="rounded-lg"
        size="sm"
        to="/data-order"
      >
        <b-icon-chevron-left />
      </b-button>
    </b-row>
    <div class="d-flex justify-between">
      <h3 class="font-bold mb-3">
        Detail Order
      </h3>
      <b-button
        v-if="orderData.order_status === 'Diajukan'"
        variant="default"
        size="sm"
        class="my-auto text-primary font-bold"
        @click="cancelOrder"
      >
        Batal
      </b-button>
    </div>
    <b-container>
      <h4 class="font-bold mb-1">
        Informasi Order
      </h4>
      <div class="border px-2 pt-2">
        <b-row class="mb-1">
          <b-col cols="6">
            No Order
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ orderData.order_no }}
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            Tanggal Order
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ moment(orderData.order_date) }}
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            Metode Pembayaran
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ orderData.payment_method }}
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            Status
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            <b-alert
              show
              :variant="statusOrder"
              class="px-1 w-36 text-center"
              style="padding: 5px 0;"
            >
              {{ orderData.order_status }}
            </b-alert>
          </b-col>
        </b-row>
        <span class="d-flex mt-20 mb-1">Telah ditambahkan oleh ‘{{ profile.user_fullname }}’ pada {{ postDate(orderData.order_date) }} WIB</span>
      </div>
      <h4 class="font-bold mt-2 mb-1">
        Informasi Pengirim
      </h4>
      <div class="border px-2 pt-2 pb-1">
        <b-row class="mb-1">
          <b-col cols="6">
            <div class="d-flex">
              <img
                src="@/assets/images/icons/profile-placehold.svg"
              >
              <div class="ml-1 my-auto">
                <span class="font-bold">{{ orderData.customer_name }}</span><br>
                <span>{{ orderData.customer_phone }}</span>
              </div>
            </div>
          </b-col>
          <b-col
            cols="6"
            class="text-right text-primary font-bold"
          >
            Pengiriman Komship
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            Ekspedisi
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ orderData.shipping }}
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            No Resi
          </b-col>
          <b-col
            cols="6"
            class="font-bold d-flex"
          >
            {{ orderData.airway_bill }}
            <img
              v-if="orderData.airway_bill"
              src="@/assets/images/icons/copy.png"
              class="copy-resi"
              @click.prevent="copyResi(orderData.airway_bill)"
            >
            <span v-if="orderData.airway_bill === null">-</span>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            Detail Alamat
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ orderData.customer_address }}
          </b-col>
        </b-row>
      </div>
      <h4 class="font-bold mt-2 mb-1">
        Informasi Penjualan
      </h4>
      <div class="border pb-2">
        <b-table
          responsive
          :fields="fieldOrder"
          :items="itemOrder"
        >
          <template #cell(no)="data">
            {{ data.index + 1 }}
          </template>
          <template #cell(price)="data">
            Rp. {{ formatNumber(data.item.price) }}
          </template>
          <template #cell(subtotal)="data">
            Rp. {{ formatNumber(data.item.price * data.item.qty) }}
          </template>
        </b-table>
        <hr>
        <b-row class="mt-3">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
          >
            Total Harga Produk
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp. {{ formatNumber(orderData.subtotal) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
          >
            Ongkos Kirim
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp. {{ formatNumber(orderData.shipping_cost) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
          >
            Potongan Harga
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp. {{ formatNumber(orderData.discount) }}
          </b-col>
        </b-row>
        <hr>
        <b-row class="mt-2">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
            class="font-bold text-xl"
          >
            Total Pembayaran ({{ orderData.payment_method }}) :
          </b-col>
          <b-col
            lg="3"
            class="text-right font-bold text-primary text-xl"
          >
            Rp. {{ formatNumber(orderData.grandtotal) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
          >
            Biaya {{ orderData.payment_method }} ({{ orderData.service_fee_to }}% sudah termasuk PPN)
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp. {{ formatNumber(orderData.service_fee) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
          >
            Cashback Ongkir ({{ orderData.cashback_to }}%)
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp. {{ formatNumber(orderData.shipping_cashback) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col
            lg="3"
          />
          <b-col
            lg="5"
            class="text-primary font-bold"
          >
            Penghasilan bersih yang kamu dapatkan
          </b-col>
          <b-col
            lg="3"
            class="text-right text-primary font-bold"
          >
            Rp. {{ formatNumber(orderData.net_profit) }}
          </b-col>
        </b-row>
      </div>
    </b-container>
  </b-card>
</template>
<script>
import {
  BCard, BRow, BButton, BIconChevronLeft, BContainer, BCol, BAlert, VBModal, BTable,
} from 'bootstrap-vue'
import moment from 'moment'

export default {
  components: {
    BCard, BRow, BButton, BIconChevronLeft, BContainer, BCol, BAlert, BTable,
  },
  directives: { VBModal },
  data() {
    return {
      profile: {},
      orderData: [],
      statusOrder: null,
      fieldOrder: [
        { key: 'no', label: 'No' },
        { key: 'product_name', label: 'Nama Produk' },
        { key: 'price', label: 'Harga Satuan' },
        { key: 'qty', label: 'Jumlah' },
        { key: 'subtotal', label: 'Sub Total' },
      ],
      itemOrder: [],
    }
  },
  async created() {
    const profile = await this.$http_komship.post('v1/my-profile')
    const dataProfile = await profile.data.data
    this.profile = await dataProfile
    this.fetchData()
  },
  methods: {
    formatNumber: value => (`${value}`).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    moment(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        return moment(date).format('DD MMMM YYYY')
      }
      return date
    },
    postDate(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        return moment(date).format('DD MMMM YYYY hh:mm')
      }
      return date
    },
    async fetchData() {
      const order = await this.$http_komship.get(`v1/order/${this.profile.partner_id}/detail/${this.$route.params.order_id}`)
      const { data } = await order.data
      this.orderData = await data
      this.itemOrder = await data.product
      this.statusOrder = await this.setAlert(data.order_status)
    },
    setAlert(status) {
      if (status === 'Diajukan') {
        this.statusOrder = 'warning'
      } else if (status === 'Dikirim') {
        this.statusOrder = 'primary'
      } else if (status === 'Diterima') {
        this.statusOrder = 'success'
      } else if (status === 'Retur') {
        this.statusOrder = 'danger'
      } else if (status === 'Batal') {
        this.statusOrder = 'secondary'
      }
      return this.statusOrder
    },
    cancelOrder() {
      // eslint-disable-next-line global-require
      const logoWarning = require('@/assets/images/icons/popup-warning.png')
      this.$swal.fire({
        title: 'Kamu yakin ingin<br>menghapus Order?',
        imageUrl: logoWarning,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        cancelButtonColor: '#FFFFFF',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-outline-primary text-primary',
      }).then(isConfirm => {
        if (isConfirm.value === true) {
          this.$http_komship.delete(`v1/order/${this.profile.partner_id}/delete/${this.$route.params.order_id}`)
            .then(() => {
              this.$router.push('/data-order')
            })
        }
      })
    },
    async copyResi(resi) {
      try {
        await navigator.clipboard.writeText(resi)
        console.log('Copied')
      } catch ($e) {
        console.log('Cannot Copy')
      }
    },
  },
}
</script>
<style>
.copy-resi{
  margin-left: 3px;
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>
